import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessCrm, getCrmUser, isCrmAdmin, normalizeCrmEmail } from "@/components/crm/users";

const tableName = "crm_notes";

function mapNote(row: any) {
  return {
    id: row.id,
    contactId: row.contact_id,
    body: row.body || "",
    createdBy: row.created_by || "",
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
  return { email: normalizeCrmEmail(data.user.email) };
}

async function canAccessContact(userEmail: string, contactId: string) {
  if (!supabaseServer || !contactId) return false;
  let query = supabaseServer.from("crm_contacts").select("id").eq("id", contactId);
  if (!isCrmAdmin(userEmail)) query = query.eq("pipeline_owner", userEmail);
  const { data, error } = await query.maybeSingle();
  return !error && Boolean(data);
}

async function getNoteContactId(id: string) {
  if (!supabaseServer || !id) return "";
  const { data } = await supabaseServer.from(tableName).select("contact_id").eq("id", id).maybeSingle();
  return data?.contact_id || "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const crmUser = await requireCrmAuth(req, res);
  if (!crmUser || !supabaseServer) return;

  if (req.method === "GET") {
    const contactId = String(req.query.contactId || "");
    if (!(await canAccessContact(crmUser.email, contactId))) {
      return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
    }
    const { data, error } = await supabaseServer
      .from(tableName)
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ notes: (data || []).map(mapNote) });
  }

  if (req.method === "POST") {
    const contactId = String(req.body?.contactId || "");
    const body = String(req.body?.body || "").trim();
    if (!contactId || !body) {
      return res.status(400).json({ error: "Tresc notatki jest wymagana." });
    }
    if (!(await canAccessContact(crmUser.email, contactId))) {
      return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
    }
    const author = getCrmUser(crmUser.email)?.label || crmUser.email;
    const { data, error } = await supabaseServer
      .from(tableName)
      .insert({ contact_id: contactId, body, created_by: author })
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ note: mapNote(data) });
  }

  if (req.method === "PATCH" || req.method === "DELETE") {
    const id = String(req.body?.id || "");
    const contactId = await getNoteContactId(id);
    if (!contactId || !(await canAccessContact(crmUser.email, contactId))) {
      return res.status(403).json({ error: "Brak dostepu do tej notatki." });
    }

    if (req.method === "DELETE") {
      const { error } = await supabaseServer.from(tableName).delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ deleted: true, id });
    }

    const body = String(req.body?.body || "").trim();
    if (!body) return res.status(400).json({ error: "Tresc notatki jest wymagana." });
    const { data, error } = await supabaseServer
      .from(tableName)
      .update({ body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ note: mapNote(data) });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
