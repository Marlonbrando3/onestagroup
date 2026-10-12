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

const FEATURED_LIMIT = 6;
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
      // Offers the team marked as featured; one per town for variety.
      spain(LIST_COLUMNS).eq("new_build", true).eq("onesta_featured", true).order("updated_at", { ascending: false }).limit(80),
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

    const seenTowns = new Set<string>();
    const picked = ((featuredRows.data || []) as any[]).filter((row) => {
      const town = String(row.town || "").toLowerCase();
      if (!town || seenTowns.has(town)) return false;
      seenTowns.add(town);
      return true;
    }).slice(0, FEATURED_LIMIT);

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
