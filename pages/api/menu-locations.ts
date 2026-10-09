import type { NextApiRequest, NextApiResponse } from "next";
import locations from "@/data/locations.json";
import { supabaseServer } from "@/lib/supabaseClient";
import { publicListings } from "@/lib/publicListings";
import { publicCountry } from "@/lib/publicSeo";
import { expandLocationSelection, getLocationCountry, type LocationEntry } from "@/lib/locations";
import { MENU_COASTS, MENU_TOWNS_LIMIT, menuTownCandidates, type MenuTown } from "@/lib/propertyNavigation";

// Offer counts for the mega-menu. Counts mirror the catalogue's `?location=` filter:
// a town matches every spelling of that location (town ILIKE name, i.e. case-insensitive).
// Cached at the CDN for an hour, so the database is hit at most once per hour.
const PAGE = 1000;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const country = publicCountry("hiszpania");
  if (!supabaseServer || !country) return res.status(503).json({ error: "unavailable" });

  try {
    const perTown = new Map<string, number>();
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await publicListings(
        supabaseServer.from("properties").select("id, town"),
        country.dbValues,
      )
        .order("id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      for (const row of data || []) {
        const key = String(row.town || "").trim().toLowerCase();
        if (key) perTown.set(key, (perTown.get(key) || 0) + 1);
      }
      if (!data || data.length < PAGE) break;
    }

    const spain = (locations as LocationEntry[]).filter((entry) => getLocationCountry(entry) === "hiszpania");
    const coasts: Record<string, MenuTown[]> = {};
    for (const coastId of MENU_COASTS) {
      coasts[coastId] = menuTownCandidates(coastId)
        .map((town) => {
          const names = new Set(
            expandLocationSelection([town.id], spain)
              .filter((entry) => entry && ["town", "city"].includes(entry.type))
              .map((entry) => entry.name.trim().toLowerCase()),
          );
          let count = 0;
          names.forEach((name) => (count += perTown.get(name) || 0));
          return { id: town.id, name: town.name, count };
        })
        .filter((town) => town.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, MENU_TOWNS_LIMIT);
    }

    const cache = "public, s-maxage=3600, stale-while-revalidate=86400";
    res.setHeader("Cache-Control", cache);
    res.setHeader("CDN-Cache-Control", cache);
    res.setHeader("Netlify-CDN-Cache-Control", cache);
    return res.status(200).json({ coasts, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("menu-locations failed", error);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: "query failed" });
  }
}
