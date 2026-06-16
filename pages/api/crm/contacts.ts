import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { crmLegacyStatusMap, crmStatuses } from "@/components/crm/types";
import {
  canAccessCrm,
  getVisibleCrmOwner,
  isCrmAdmin,
  normalizeCrmEmail,
} from "@/components/crm/users";

const tableName = "crm_contacts";
const missingTableMessage =
  "Tabela crm_contacts nie istnieje w Supabase. Uruchom SQL z scripts/crm_contacts_schema.sql w Supabase SQL Editor.";

function handleSupabaseError(res: NextApiResponse, error: { message: string }) {
  const isMissingTable =
    error.message.includes("Could not find the table") || error.message.includes(tableName);
  return res.status(500).json({ error: isMissingTable ? missingTableMessage : error.message });
}

function mapContact(row: any) {
  const rawStatus = row.status || "Zakwalifikowano";
  return {
    id: row.id,
    name: row.name || "",
    company: row.company || "",
    email: row.email || "",
    phone: row.phone || "",
    owner: row.owner || "",
    value: Number(row.value || 0),
    country: row.country || "",
    maxBudget: Number(row.max_budget || 0),
    bedrooms: row.bedrooms || "",
    bathrooms: row.bathrooms || "",
    coast: row.coast || "",
    purchaseTimeline: row.purchase_timeline || "",
    note: row.note || "",
    pipelineOwner: row.pipeline_owner || "",
    pipelineId: row.pipeline_id || null,
    status: crmStatuses.includes(rawStatus)
      ? rawStatus
      : crmLegacyStatusMap[rawStatus] || rawStatus || "Zakwalifikowano",
    source: row.source || "",
    lastContact: row.last_contact || "",
    createdAt: row.created_at,
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
  if (!crmUser) {
    return;
  }
  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
  }

  if (req.method === "GET") {
    const owner = getVisibleCrmOwner(crmUser.email, req.query.owner);
    const pipelineId = String(req.query.pipelineId || "");
    let query = supabaseServer
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (owner !== "all") {
      query = query.eq("pipeline_owner", owner);
    }

    if (pipelineId && pipelineId !== "default") {
      query = query.eq("pipeline_id", pipelineId);
    } else {
      query = query.is("pipeline_id", null);
    }

    const { data, error } = await query;

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ contacts: (data || []).map(mapContact) });
  }

  if (req.method === "POST") {
    const name = String(req.body?.name || "").trim();
    if (!name) {
      return res.status(400).json({ error: "Imie i nazwisko jest wymagane." });
    }

    const pipelineId = String(req.body?.pipelineId || "");
    const status = String(req.body?.status || "").trim() || "Zakwalifikowano";
    const requestedOwner = normalizeCrmEmail(req.body?.pipelineOwner);
    const pipelineOwner =
      crmUser.isAdmin && requestedOwner ? getVisibleCrmOwner(crmUser.email, requestedOwner) : crmUser.email;
    const payload = {
      name,
      company: String(req.body?.company || "").trim() || "Bez firmy",
      email: String(req.body?.email || "").trim(),
      phone: String(req.body?.phone || "").trim(),
      owner: "Marco",
      value: Number(req.body?.value || 0),
      country: String(req.body?.country || "").trim(),
      max_budget: Number(req.body?.maxBudget || 0),
      bedrooms: String(req.body?.bedrooms || "").trim(),
      bathrooms: String(req.body?.bathrooms || "").trim(),
      coast: String(req.body?.coast || "").trim(),
      purchase_timeline: String(req.body?.purchaseTimeline || "").trim(),
      note: String(req.body?.note || "").trim(),
      pipeline_owner: pipelineOwner === "all" ? crmUser.email : pipelineOwner,
      pipeline_id: pipelineId && pipelineId !== "default" ? pipelineId : null,
      status,
      source: "CRM",
      last_contact: new Date().toISOString().slice(0, 10),
    };

    const { data, error } = await supabaseServer
      .from(tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(201).json({ contact: mapContact(data) });
  }

  if (req.method === "PATCH") {
    const id = String(req.body?.id || "");
    if (!id) {
      return res.status(400).json({ error: "Brak ID kontaktu." });
    }

    const payload: Record<string, string | number | null> = {
      last_contact: new Date().toISOString().slice(0, 10),
    };

    if (typeof req.body?.name !== "undefined") {
      const name = String(req.body.name || "").trim();
      if (!name) {
        return res.status(400).json({ error: "Imie i nazwisko jest wymagane." });
      }
      payload.name = name;
    }

    if (typeof req.body?.company !== "undefined") {
      payload.company = String(req.body.company || "").trim() || "Bez firmy";
    }

    if (typeof req.body?.email !== "undefined") {
      payload.email = String(req.body.email || "").trim();
    }

    if (typeof req.body?.phone !== "undefined") {
      payload.phone = String(req.body.phone || "").trim();
    }

    if (typeof req.body?.value !== "undefined") {
      payload.value = Number(req.body.value || 0);
    }

    if (typeof req.body?.country !== "undefined") {
      payload.country = String(req.body.country || "").trim();
    }

    if (typeof req.body?.maxBudget !== "undefined") {
      payload.max_budget = Number(req.body.maxBudget || 0);
    }

    if (typeof req.body?.bedrooms !== "undefined") {
      payload.bedrooms = String(req.body.bedrooms || "").trim();
    }

    if (typeof req.body?.bathrooms !== "undefined") {
      payload.bathrooms = String(req.body.bathrooms || "").trim();
    }

    if (typeof req.body?.coast !== "undefined") {
      payload.coast = String(req.body.coast || "").trim();
    }

    if (typeof req.body?.purchaseTimeline !== "undefined") {
      payload.purchase_timeline = String(req.body.purchaseTimeline || "").trim();
    }

    if (typeof req.body?.note !== "undefined") {
      payload.note = String(req.body.note || "").trim();
    }

    if (typeof req.body?.status !== "undefined") {
      const status = String(req.body.status || "").trim();
      if (!status) {
        return res.status(400).json({ error: "Nieprawidlowy etap." });
      }
      payload.status = status;
    }

    if (typeof req.body?.pipelineId !== "undefined") {
      const pipelineId = String(req.body.pipelineId || "");
      payload.pipeline_id = pipelineId && pipelineId !== "default" ? pipelineId : null;
    }

    if (crmUser.isAdmin && typeof req.body?.pipelineOwner !== "undefined") {
      const owner = getVisibleCrmOwner(crmUser.email, req.body.pipelineOwner);
      if (owner !== "all") {
        payload.pipeline_owner = owner;
      }
    }

    let updateQuery = supabaseServer
      .from(tableName)
      .update(payload)
      .eq("id", id);

    if (!crmUser.isAdmin) {
      updateQuery = updateQuery.eq("pipeline_owner", crmUser.email);
    }

    const { data, error } = await updateQuery.select("*").single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ contact: mapContact(data) });
  }

  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    if (!id) {
      return res.status(400).json({ error: "Brak ID kontaktu." });
    }

    let deleteQuery = supabaseServer.from(tableName).delete().eq("id", id);

    if (!crmUser.isAdmin) {
      deleteQuery = deleteQuery.eq("pipeline_owner", crmUser.email);
    }

    const { error } = await deleteQuery;

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ deleted: true, id });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
