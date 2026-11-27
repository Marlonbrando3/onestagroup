import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { requireCrmUser } from "@/lib/crmServerAuth";

// Katalog flag rekordów CRM. Lista – wszyscy (żeby każdy widział flagi przypięte przez innych);
// dodawać może każdy (flaga należy do autora); usuwać – autor albo administrator. Flagi systemowe są stałe.
const COLOR = /^#[0-9a-f]{6}$/i;

function mapFlag(row: any) {
  return {
    id: row.id,
    label: row.label || "",
    color: row.color || "#64748b",
    ownerEmail: row.owner_email || null,
    isSystem: Boolean(row.is_system),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;
  const db = supabaseServer;

  if (req.method === "GET") {
    const { data, error } = await db
      .from("crm_flags")
      .select("*")
      .order("is_system", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ flags: (data || []).map(mapFlag) });
  }

  if (req.method === "POST") {
    const label = String(req.body?.label ?? "").trim().slice(0, 40);
    const color = String(req.body?.color ?? "").trim();
    if (!label) return res.status(400).json({ error: "Podaj nazwę flagi." });
    if (!COLOR.test(color)) return res.status(400).json({ error: "Wybierz kolor flagi." });
    const { data, error } = await db
      .from("crm_flags")
      .insert({ label, color: color.toLowerCase(), owner_email: user.email, is_system: false })
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ flag: mapFlag(data) });
  }

  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    const { data: flag } = await db.from("crm_flags").select("*").eq("id", id).maybeSingle();
    if (!flag) return res.status(404).json({ error: "Nie znaleziono flagi." });
    if (flag.is_system) return res.status(400).json({ error: "Flag podstawowych nie można usunąć." });
    if (flag.owner_email !== user.email && !user.isAdmin) {
      return res.status(403).json({ error: "Możesz usuwać tylko swoje flagi." });
    }
    // Zdejmij flagę z rekordów, na których była przypięta.
    const { data: tagged } = await db.from("crm_contacts").select("id, flag_ids").contains("flag_ids", [id]);
    await Promise.all(
      (tagged || []).map((row: any) =>
        db
          .from("crm_contacts")
          .update({ flag_ids: (row.flag_ids || []).filter((flagId: string) => flagId !== id) })
          .eq("id", row.id),
      ),
    );
    const { error } = await db.from("crm_flags").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
