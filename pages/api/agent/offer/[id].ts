import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { AGENT_OFFER_COLUMNS } from "@/lib/agentOffers";
import { supabaseServer } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer)
    return res.status(auth.status).json({ error: auth.error });
  const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
  if (!id || id.length > 200)
    return res
      .status(400)
      .json({ error: "Nieprawidłowy identyfikator oferty" });
  const { data, error } = await supabaseServer
    .from("properties")
    .select(AGENT_OFFER_COLUMNS)
    .eq("external_id", id)
    .maybeSingle();
  if (error)
    return res.status(500).json({ error: "Nie udało się pobrać oferty" });
  if (!data)
    return res.status(404).json({ error: "Oferta nie jest już dostępna" });
  return res.status(200).json({ data });
}
