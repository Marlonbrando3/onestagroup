import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { supabaseServer } from "@/lib/supabaseClient";

// Powiadomienia w strefie agenta (dzwonek w nagłówku).
// GET  — ostatnie powiadomienia zalogowanego agenta + liczba nieprzeczytanych.
// POST — { ids: string[] } albo { all: true } oznacza jako przeczytane.
const LIMIT = 40;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "private, no-store");
  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const email = auth.agent.email.replace(/["\\,()]/g, "");
  const mine = `agent_user_id.eq.${auth.agent.id},agent_email.ilike."${email}"`;

  if (req.method === "GET") {
    const [{ data, error }, { count }] = await Promise.all([
      supabaseServer
        .from("agent_notifications")
        .select("id,kind,presentation_id,presentation_name,public_token,offer_external_id,offer_ref,offer_title,created_at,read_at")
        .or(mine)
        .order("created_at", { ascending: false })
        .limit(LIMIT),
      supabaseServer
        .from("agent_notifications")
        .select("id", { count: "exact", head: true })
        .or(mine)
        .is("read_at", null),
    ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ notifications: data || [], unread: count || 0 });
  }

  if (req.method === "POST") {
    const body = (req.body ?? {}) as { ids?: unknown; all?: unknown };
    let query = supabaseServer
      .from("agent_notifications")
      .update({ read_at: new Date().toISOString() })
      .or(mine)
      .is("read_at", null);
    if (body.all !== true) {
      const ids = Array.isArray(body.ids) ? body.ids.map(String).filter((id) => /^[0-9a-f-]{36}$/i.test(id)) : [];
      if (!ids.length) return res.status(400).json({ error: "Brak powiadomień do oznaczenia" });
      query = query.in("id", ids.slice(0, 100));
    }
    const { error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
