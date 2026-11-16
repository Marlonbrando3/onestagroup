import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { agentCoastGroups, coastOfProvince, townInGroup } from "@/lib/agentLocations";
import { supabaseServer } from "@/lib/supabaseClient";

// Wybrzeża i główne miasta do filtra „Regiony i miasta” w panelu agenta (podział jak w menu
// „Oferty”), z liczbą ofert. Te same warunki bazowe co /api/agent/properties (oferty ze zdjęciami).
// Wynik trzymany w pamięci przez godzinę.
const PAGE = 1000;
const CACHE_MS = 60 * 60 * 1000;

type Coast = { id: string; name: string; count: number; towns: { id: string; name: string; count: number }[] };

let cached: { at: number; coasts: Coast[] } | null = null;

async function loadCoasts(): Promise<Coast[]> {
  const rows: { town: string | null; province: string | null }[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseServer!
      .from("properties")
      .select("town, province")
      .not("images", "is", null)
      .neq("images", "[]")
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...((data || []) as typeof rows));
    if (!data || data.length < PAGE) break;
  }

  const coastCounts = new Map<string, number>();
  for (const row of rows) {
    const coast = coastOfProvince(row.province);
    if (coast) coastCounts.set(coast.id, (coastCounts.get(coast.id) || 0) + 1);
  }

  return agentCoastGroups()
    .map((coast) => ({
      id: coast.id,
      name: coast.name,
      count: coastCounts.get(coast.id) || 0,
      towns: coast.towns
        .map((town) => ({
          id: town.id,
          name: town.name,
          count: rows.filter((row) => townInGroup(row.town, town)).length,
        }))
        .filter((town) => town.count > 0),
    }))
    .filter((coast) => coast.count > 0 || coast.towns.length > 0)
    .sort((a, b) => b.count - a.count);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    if (!cached || Date.now() - cached.at > CACHE_MS) {
      cached = { at: Date.now(), coasts: await loadCoasts() };
    }
    return res.status(200).json({ coasts: cached.coasts });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Nie udało się pobrać lokalizacji" });
  }
}
