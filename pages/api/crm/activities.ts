import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { crmActivityTypes } from "@/components/crm/types";
import { canAccessCrm, getVisibleCrmOwner, isCrmAdmin, normalizeCrmEmail } from "@/components/crm/users";

const tableName = "crm_activities";
const missingTableMessage =
  "Tabela crm_activities nie istnieje w Supabase. Uruchom zaktualizowany SQL z scripts/crm_contacts_schema.sql w Supabase SQL Editor.";

function handleSupabaseError(res: NextApiResponse, error: { message: string }) {
  const isMissingTable =
    error.message.includes("Could not find the table") || error.message.includes(tableName);
  return res.status(500).json({ error: isMissingTable ? missingTableMessage : error.message });
}

function mapActivity(row: any) {
  return {
    id: row.id,
    contactId: row.contact_id,
    type: row.type,
    title: row.title || "",
    note: row.note || "",
    dueDate: row.due_date,
    dueTime: row.due_time,
    status: row.status || "planned",
    createdBy: row.created_by || "CRM",
    createdAt: row.created_at,
    completedAt: row.completed_at,
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

async function getVisibleContactIds(userEmail: string, requestedOwner?: string | string[]) {
  if (!supabaseServer) return [];

  const owner = getVisibleCrmOwner(userEmail, requestedOwner);
  let query = supabaseServer.from("crm_contacts").select("id");

  if (owner !== "all") {
    query = query.eq("pipeline_owner", owner);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []).map((contact) => contact.id);
}

async function canAccessContact(userEmail: string, contactId: string) {
  if (!supabaseServer) return false;
  if (isCrmAdmin(userEmail)) {
    const { data, error } = await supabaseServer.from("crm_contacts").select("id").eq("id", contactId).maybeSingle();
    return !error && Boolean(data);
  }

  const { data, error } = await supabaseServer
    .from("crm_contacts")
    .select("id")
    .eq("id", contactId)
    .eq("pipeline_owner", userEmail)
    .maybeSingle();
  return !error && Boolean(data);
}

async function canAccessActivity(userEmail: string, activityId: string) {
  if (!supabaseServer) return false;

  const { data, error } = await supabaseServer
    .from(tableName)
    .select("contact_id")
    .eq("id", activityId)
    .maybeSingle();

  if (error || !data?.contact_id) return false;
  return canAccessContact(userEmail, data.contact_id);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const crmUser = await requireCrmAuth(req, res);
  if (!crmUser) return;
  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
  }

  if (req.method === "GET") {
    const contactId = String(req.query.contactId || "");
    let query = supabaseServer
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (contactId) {
      const canAccess = await canAccessContact(crmUser.email, contactId);
      if (!canAccess) {
        return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
      }
      query = query.eq("contact_id", contactId);
    } else {
      const contactIds = await getVisibleContactIds(crmUser.email, req.query.owner);
      if (!contactIds.length) {
        return res.status(200).json({ activities: [] });
      }
      query = query.eq("status", "planned");
      query = query.in("contact_id", contactIds);
    }

    const { data, error } = await query;

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ activities: (data || []).map(mapActivity) });
  }

  if (req.method === "POST") {
    const contactId = String(req.body?.contactId || "");
    const type = req.body?.type;
    const title = String(req.body?.title || "").trim();
    if (!contactId || !crmActivityTypes.includes(type) || !title) {
      return res.status(400).json({ error: "Kontakt, typ i tytul dzialania sa wymagane." });
    }

    const canAccess = await canAccessContact(crmUser.email, contactId);
    if (!canAccess) {
      return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
    }

    const payload = {
      contact_id: contactId,
      type,
      title,
      note: String(req.body?.note || "").trim(),
      due_date: req.body?.dueDate || null,
      due_time: req.body?.dueTime || null,
      status: "planned",
      created_by: "CRM",
    };

    const { data, error } = await supabaseServer
      .from(tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(201).json({ activity: mapActivity(data) });
  }

  if (req.method === "PATCH") {
    const id = String(req.body?.id || "");
    if (!id) {
      return res.status(400).json({ error: "Brak ID dzialania." });
    }

    const canAccess = await canAccessActivity(crmUser.email, id);
    if (!canAccess) {
      return res.status(403).json({ error: "Brak dostepu do tego dzialania." });
    }

    const payload: Record<string, string | null> = {};

    if (typeof req.body?.type !== "undefined") {
      const type = req.body.type;
      if (!crmActivityTypes.includes(type)) {
        return res.status(400).json({ error: "Nieprawidlowy typ dzialania." });
      }
      payload.type = type;
    }

    if (typeof req.body?.title !== "undefined") {
      const title = String(req.body.title || "").trim();
      if (!title) {
        return res.status(400).json({ error: "Tytul dzialania jest wymagany." });
      }
      payload.title = title;
    }

    if (typeof req.body?.note !== "undefined") {
      payload.note = String(req.body.note || "").trim();
    }

    if (typeof req.body?.dueDate !== "undefined") {
      payload.due_date = req.body.dueDate || null;
    }

    if (typeof req.body?.dueTime !== "undefined") {
      payload.due_time = req.body.dueTime || null;
    }

    if (typeof req.body?.status !== "undefined") {
      const status = req.body.status === "done" ? "done" : "planned";
      payload.status = status;
      payload.completed_at = status === "done" ? new Date().toISOString() : null;
    }

    const { data, error } = await supabaseServer
      .from(tableName)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ activity: mapActivity(data) });
  }

  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    if (!id) {
      return res.status(400).json({ error: "Brak ID dzialania." });
    }

    const canAccess = await canAccessActivity(crmUser.email, id);
    if (!canAccess) {
      return res.status(403).json({ error: "Brak dostepu do tego dzialania." });
    }

    const { error } = await supabaseServer.from(tableName).delete().eq("id", id);

    if (error) {
      return handleSupabaseError(res, error);
    }

    return res.status(200).json({ deleted: true, id });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
