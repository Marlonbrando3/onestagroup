import type { NextApiRequest, NextApiResponse } from "next";
import { getCrmUser } from "@/components/crm/users";
import { requireCrmUser } from "@/lib/crmServerAuth";
import { supabaseServer } from "@/lib/supabaseClient";

// Wyszukiwarka kontaktów CRM (np. do skojarzenia prezentacji z szansą sprzedaży w strefie agenta).
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const q = String(req.query.q || "").trim().slice(0, 80).replace(/[%,()]/g, " ");
  let query = supabaseServer
    .from("crm_contacts")
    .select("id,name,phone,email,status,pipeline_owner")
    .order("created_at", { ascending: false })
    .limit(12);
  if (!user.isAdmin) query = query.eq("pipeline_owner", user.email);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({
    contacts: (data || []).map((row) => ({
      id: row.id,
      name: row.name || "Klient bez nazwy",
      phone: row.phone || "",
      email: row.email || "",
      status: row.status || "",
      ownerLabel: getCrmUser(row.pipeline_owner)?.label || row.pipeline_owner || "",
    })),
  });
}
