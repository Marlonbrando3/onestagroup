import type { NextApiRequest, NextApiResponse } from "next";
import { defaultCrmPipeline } from "@/components/crm/types";
import {
  canAccessCrm,
  getVisibleCrmOwner,
  isCrmAdmin,
  normalizeCrmEmail,
} from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

const tableName = "crm_pipelines";
const contactsTableName = "crm_contacts";
const missingTableMessage =
  "Tabela crm_pipelines nie istnieje w Supabase. Uruchom SQL z scripts/crm_contacts_schema.sql w Supabase SQL Editor.";

function handleSupabaseError(res: NextApiResponse, error: { message: string }) {
  const isMissingTable =
    error.message.includes("Could not find the table") ||
    error.message.includes(tableName) ||
    error.message.includes("pipeline_id");
  return res.status(500).json({
    error: isMissingTable ? missingTableMessage : error.message,
  });
}

function normalizeStages(stages: unknown) {
  if (!Array.isArray(stages)) return [];
  return stages
    .map((stage) => String(stage || "").trim())
    .filter(Boolean)
    .slice(0, 20);
}

function mapPipeline(row: any) {
  return {
    id: row.id,
    name: row.name || "",
    ownerEmail: normalizeCrmEmail(row.owner_email),
    stages: normalizeStages(row.stages),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireCrmAuth(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseServer) {
    res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
    return null;
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) {
    res.status(401).json({ error: "Brak autoryzacji. Zaloguj sie, aby korzystac z CRM." });
    return null;
  }

  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Sesja wygasla albo jest nieprawidlowa." });
    return null;
  }

  if (!canAccessCrm(data.user.email)) {
    res.status(403).json({ error: "Brak dostepu do CRM dla tego konta." });
    return null;
  }

  return {
    email: normalizeCrmEmail(data.user.email),
    isAdmin: isCrmAdmin(data.user.email),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const crmUser = await requireCrmAuth(req, res);
  if (!crmUser) return;
  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
  }

  if (req.method === "GET") {
    const owner = getVisibleCrmOwner(crmUser.email, req.query.owner);
    const visibleOwner = owner === "all" ? crmUser.email : owner;

    const { data, error } = await supabaseServer
      .from(tableName)
      .select("*")
      .eq("owner_email", visibleOwner)
      .order("created_at", { ascending: true });

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({
      pipelines: [
        {
          ...defaultCrmPipeline,
          ownerEmail: visibleOwner,
        },
        ...(data || []).map(mapPipeline),
      ],
    });
  }

  if (req.method === "POST") {
    const name = String(req.body?.name || "Nowy lejek").trim();
    const stages = normalizeStages(req.body?.stages);
    if (!name || stages.length < 1) {
      return res.status(400).json({ error: "Nazwa i minimum jeden etap sa wymagane." });
    }

    const { data, error } = await supabaseServer
      .from(tableName)
      .insert({
        owner_email: crmUser.email,
        name,
        stages,
      })
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(201).json({ pipeline: mapPipeline(data) });
  }

  if (req.method === "PATCH") {
    const id = String(req.body?.id || "");
    const name = String(req.body?.name || "Lejek").trim();
    const stages = normalizeStages(req.body?.stages);
    if (!id || !name || stages.length < 1) {
      return res.status(400).json({ error: "ID, nazwa i etapy lejka sa wymagane." });
    }

    const { data, error } = await supabaseServer
      .from(tableName)
      .update({
        name,
        stages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("owner_email", crmUser.email)
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ pipeline: mapPipeline(data) });
  }

  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    if (!id || id === defaultCrmPipeline.id) {
      return res.status(400).json({ error: "Nie mozna usunac tego lejka." });
    }

    const { error: contactsError } = await supabaseServer
      .from(contactsTableName)
      .update({
        pipeline_id: null,
        status: defaultCrmPipeline.stages[0] || "Zakwalifikowano",
        last_contact: new Date().toISOString().slice(0, 10),
      })
      .eq("pipeline_id", id)
      .eq("pipeline_owner", crmUser.email);

    if (contactsError) {
      return handleSupabaseError(res, contactsError);
    }

    const { error } = await supabaseServer
      .from(tableName)
      .delete()
      .eq("id", id)
      .eq("owner_email", crmUser.email);

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ deleted: true, id });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
