import type { NextApiRequest, NextApiResponse } from "next";
import locations from "@/data/locations.json";
import { supabaseServer } from "@/lib/supabaseClient";
import { publicListings } from "@/lib/publicListings";
import { publicCountry } from "@/lib/publicSeo";
import { expandLocationSelection, getLocationCountry, type LocationEntry } from "@/lib/locations";
import { SEO_REGIONS } from "@/lib/seoLocations";
import { MENU_COUNTRY_COASTS, MENU_TOWNS_LIMIT, menuTownCandidates, type MenuTown } from "@/lib/propertyNavigation";

// Offer counts for the mega-menu, mirroring the catalogue's filters:
// - town:  `?location=` matches every spelling of a location, town ILIKE name (case-insensitive);
// - coast: the SEO region page scope, province IN provinces AND town IN towns.
// Cached at the CDN for an hour, so the database is queried at most once an hour.
const PAGE = 1000;
type Row = { id: number; town: string | null; province: string | null };

async function fetchRows(dbValues: string[]) {
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await publicListings(
      supabaseServer!.from("properties").select("id, town, province"),
      dbValues,
    )
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...((data || []) as Row[]));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseServer) return res.status(503).json({ error: "unavailable" });
  try {
    const towns: Record<string, MenuTown[]> = {};
    const searchTowns: Record<string, MenuTown[]> = {};
    const coastTotals: Record<string, number> = {};
    const countryTotals: Record<string, number> = {};

    for (const [countrySlug, coastIds] of Object.entries(MENU_COUNTRY_COASTS)) {
      const country = publicCountry(countrySlug);
      if (!country) continue;
      const rows = await fetchRows(country.dbValues);
      countryTotals[countrySlug] = rows.length;

      const perTown = new Map<string, number>();
      for (const row of rows) {
        const key = String(row.town || "").trim().toLowerCase();
        if (key) perTown.set(key, (perTown.get(key) || 0) + 1);
      }
      const countryLocations = (locations as LocationEntry[]).filter((entry) => getLocationCountry(entry) === countrySlug);

      for (const coastId of coastIds) {
        const seenSpellings = new Set<string>();
        const counted = menuTownCandidates(coastId)
          .map((town) => {
            const names = new Set(
              expandLocationSelection([town.id], countryLocations)
                .filter((entry) => entry && ["town", "city"].includes(entry.type))
                .map((entry) => entry.name.trim().toLowerCase()),
            );
            let count = 0;
            names.forEach((name) => (count += perTown.get(name) || 0));
            return { id: town.id, name: town.name, count, key: [...names].sort().join("|") };
          })
          .filter((town) => town.count > 0)
          // Alternative spellings of one place (e.g. Alfas/Alfaz del Pi) match the same rows — keep one.
          .filter((town) => !seenSpellings.has(town.key) && !!seenSpellings.add(town.key))
          .map(({ key, ...town }) => town);
        towns[coastId] = [...counted].sort((a, b) => b.count - a.count).slice(0, MENU_TOWNS_LIMIT);
        searchTowns[coastId] = [...counted].sort((a, b) => a.name.localeCompare(b.name, "pl"));

        const region = SEO_REGIONS.find((item) => item.locationId === coastId);
        if (region)
          coastTotals[coastId] = rows.filter(
            (row) => region.provinces.includes(String(row.province)) && region.towns.includes(String(row.town)),
          ).length;
      }
    }

    const cache = "public, s-maxage=3600, stale-while-revalidate=86400";
    res.setHeader("Cache-Control", cache);
    res.setHeader("CDN-Cache-Control", cache);
    res.setHeader("Netlify-CDN-Cache-Control", cache);
    return res.status(200).json({ towns, searchTowns, coastTotals, countryTotals, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("menu-locations failed", error);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: "query failed" });
  }
}
