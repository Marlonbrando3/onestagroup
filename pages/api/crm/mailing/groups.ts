import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleMailingDatabaseError,
  requireCrmAdmin,
} from "@/lib/crmMailingServer";
import { supabaseServer } from "@/lib/supabaseClient";

function cleanContactIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((id) => String(id || "")).filter(Boolean))).slice(0, 100000);
}

function chunks<T>(items: T[], size = 500) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
}

async function getGroups() {
  if (!supabaseServer) return [];
  const { data: groups, error } = await supabaseServer
    .from("crm_mailing_groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const memberships: any[] = [];
  for (let from = 0; from < 100000; from += 1000) {
    const { data, error: membershipsError } = await supabaseServer
      .from("crm_mailing_group_members")
      .select("group_id,contact_id")
      .range(from, from + 999);
    if (membershipsError) throw membershipsError;
    memberships.push(...(data || []));
    if ((data || []).length < 1000) break;
  }

  const contactIds = Array.from(new Set(memberships.map((item) => item.contact_id)));
  let consentedIds = new Set<string>();
  if (contactIds.length) {
    const consentedRows: any[] = [];
    for (const contactIdChunk of chunks(contactIds)) {
      const { data: contacts, error: contactsError } = await supabaseServer
        .from("crm_contacts")
        .select("id,marketing_consent_evidence_id")
        .in("id", contactIdChunk)
        .eq("marketing_email_status", "consented")
        .not("marketing_consent_evidence_id", "is", null)
        .neq("email", "");
      if (contactsError) throw contactsError;
      consentedRows.push(...(contacts || []));
    }
    const evidenceIds = Array.from(
      new Set(consentedRows.map((contact) => contact.marketing_consent_evidence_id).filter(Boolean)),
    );
    const validEvidenceIds = new Set<string>();
    for (const evidenceIdChunk of chunks(evidenceIds)) {
      const { data: evidenceRows, error: evidenceError } = await supabaseServer
        .from("newsletter_evidence_packages")
        .select("id")
        .in("id", evidenceIdChunk)
        .eq("package_type", "consent_confirmed");
      if (evidenceError) throw evidenceError;
      (evidenceRows || []).forEach((item) => validEvidenceIds.add(item.id));
    }
    consentedIds = new Set(
      consentedRows
        .filter((contact) => validEvidenceIds.has(contact.marketing_consent_evidence_id))
        .map((contact) => contact.id),
    );
  }

  return (groups || []).map((group) => {
    const memberIds = memberships
      .filter((member) => member.group_id === group.id)
      .map((member) => member.contact_id);
    return {
      id: group.id,
      name: group.name,
      description: group.description || "",
      contactIds: memberIds,
      memberCount: memberIds.length,
      consentedCount: memberIds.filter((id) => consentedIds.has(id)).length,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
    };
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;

  if (req.method === "GET") {
    try {
      return res.status(200).json({ groups: await getGroups() });
    } catch (error: any) {
      return handleMailingDatabaseError(res, error);
    }
  }

  if (req.method === "POST") {
    const name = String(req.body?.name || "").trim();
    const contactIds = cleanContactIds(req.body?.contactIds);
    if (!name) return res.status(400).json({ error: "Nazwa grupy jest wymagana." });

    const { data: group, error } = await supabaseServer
      .from("crm_mailing_groups")
      .insert({
        name,
        description: String(req.body?.description || "").trim(),
        created_by: admin.email,
      })
      .select("*")
      .single();
    if (error) return handleMailingDatabaseError(res, error);

    if (contactIds.length) {
      for (const contactIdChunk of chunks(contactIds)) {
        const { error: membersError } = await supabaseServer
          .from("crm_mailing_group_members")
          .insert(contactIdChunk.map((contactId) => ({ group_id: group.id, contact_id: contactId })));
        if (membersError) {
          await supabaseServer.from("crm_mailing_groups").delete().eq("id", group.id);
          return handleMailingDatabaseError(res, membersError);
        }
      }
    }
    return res.status(201).json({ groups: await getGroups() });
  }

  if (req.method === "PATCH") {
    const id = String(req.body?.id || "");
    const name = String(req.body?.name || "").trim();
    const contactIds = cleanContactIds(req.body?.contactIds);
    if (!id || !name) return res.status(400).json({ error: "ID i nazwa grupy są wymagane." });

    const { error } = await supabaseServer
      .from("crm_mailing_groups")
      .update({
        name,
        description: String(req.body?.description || "").trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return handleMailingDatabaseError(res, error);

    const { error: deleteError } = await supabaseServer
      .from("crm_mailing_group_members")
      .delete()
      .eq("group_id", id);
    if (deleteError) return handleMailingDatabaseError(res, deleteError);
    if (contactIds.length) {
      for (const contactIdChunk of chunks(contactIds)) {
        const { error: insertError } = await supabaseServer
          .from("crm_mailing_group_members")
          .insert(contactIdChunk.map((contactId) => ({ group_id: id, contact_id: contactId })));
        if (insertError) return handleMailingDatabaseError(res, insertError);
      }
    }
    return res.status(200).json({ groups: await getGroups() });
  }

  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    if (!id) return res.status(400).json({ error: "Brak ID grupy." });
    const { error } = await supabaseServer.from("crm_mailing_groups").delete().eq("id", id);
    if (error) return handleMailingDatabaseError(res, error);
    return res.status(200).json({ groups: await getGroups() });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
