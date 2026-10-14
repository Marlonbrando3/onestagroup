// Live data for /polskie-biuro-nieruchomosci-w-hiszpanii: offer counts and a short list of
// featured new developments. Rendered statically and refreshed hourly (ISR), so the database
// is queried at most once an hour. Any failure returns empty data and the page hides the blocks.
import { supabaseServer } from "./supabaseClient";
import { publicListings } from "./publicListings";
import { publicCountry } from "./publicSeo";
import { SEO_REGIONS } from "./seoLocations";
import { attachDevelopmentTitles } from "./developmentTitles";

export type AgencyShowcase = {
  totalOffers: number | null;
  newBuildOffers: number | null;
  coastCounts: Record<string, number>;
  featured: any[];
};

const LIST_COLUMNS = [
  "external_id",
  "type",
  "town",
  "province",
  "price",
  "beds",
  "baths",
  "images",
  "new_build",
  "onesta_featured",
  "surface_built",
  "pool",
  "updated_at",
  "country",
  "title",
  "distance_to_sea_m",
].join(",");

const FEATURED_LIMIT = 8;
const FEATURED_PRICE = [320000, 480000] as const;
// Skład: 1 apartament, 3 bungalowy, 2 domy, 2 pozostałe (np. penthouse); różne miejscowości, gdy się da.
const FEATURED_MIX: Array<{ types: string[]; count: number }> = [
  { types: ["apartment"], count: 1 },
  { types: ["bungalow"], count: 3 },
  { types: ["villa", "town house", "townhouse", "quad house", "semi detached", "country house"], count: 2 },
  { types: ["penthouse", "apartment penthouse"], count: 2 },
];

function pickFeatured(rows: any[]) {
  const picked: any[] = [];
  const used = new Set<string>();
  const towns = new Set<string>();
  const take = (row: any) => {
    picked.push(row);
    used.add(String(row.external_id));
    towns.add(String(row.town || "").toLowerCase());
  };
  const typeOf = (row: any) => String(row.type || "").toLowerCase();
  for (const { types, count } of FEATURED_MIX) {
    const pool = rows.filter((row) => types.includes(typeOf(row)) && !used.has(String(row.external_id)));
    let added = 0;
    for (const strictTown of [true, false]) {
      for (const row of pool) {
        if (added >= count) break;
        if (used.has(String(row.external_id))) continue;
        if (strictTown && towns.has(String(row.town || "").toLowerCase())) continue;
        take(row);
        added += 1;
      }
    }
  }
  // Uzupełnij do 8 czymkolwiek, jeśli w którejś grupie zabrakło ofert.
  for (const row of rows) {
    if (picked.length >= FEATURED_LIMIT) break;
    if (!used.has(String(row.external_id))) take(row);
  }
  return picked.slice(0, FEATURED_LIMIT).sort((a, b) => Number(a.price) - Number(b.price));
}
const EMPTY: AgencyShowcase = { totalOffers: null, newBuildOffers: null, coastCounts: {}, featured: [] };

export async function loadAgencyShowcase(): Promise<AgencyShowcase> {
  const country = publicCountry("hiszpania");
  if (!supabaseServer || !country) return EMPTY;
  const db = supabaseServer;
  const spain = (select: string, options?: object) =>
    publicListings(db.from("properties").select(select, options), country.dbValues);

  try {
    const [total, newBuild, featuredRows, ...coasts] = await Promise.all([
      spain("external_id", { count: "exact", head: true }),
      spain("external_id", { count: "exact", head: true }).eq("new_build", true),
      // Rekomendowane (onesta_featured) z rynku pierwotnego w budżecie 320–480 tys. €.
      spain(LIST_COLUMNS).eq("new_build", true).eq("onesta_featured", true).gte("price", FEATURED_PRICE[0]).lte("price", FEATURED_PRICE[1]).order("updated_at", { ascending: false }).limit(200),
      ...SEO_REGIONS.filter((region) => region.country === "hiszpania").map((region) =>
        spain("external_id", { count: "exact", head: true })
          .in("province", region.provinces)
          .in("town", region.towns),
      ),
    ]);

    const coastCounts: Record<string, number> = {};
    SEO_REGIONS.filter((region) => region.country === "hiszpania").forEach((region, index) => {
      const count = coasts[index]?.count;
      if (typeof count === "number") coastCounts[region.slug] = count;
    });

    const picked = pickFeatured((featuredRows.data || []) as any[]);

    return {
      totalOffers: total.count ?? null,
      newBuildOffers: newBuild.count ?? null,
      coastCounts,
      featured: await attachDevelopmentTitles(picked),
    };
  } catch (error) {
    console.error("agency showcase failed", error);
    return EMPTY;
  }
}
