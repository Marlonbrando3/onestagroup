import { supabaseServer } from "./supabaseClient";
import { publicListings } from "./publicListings";
import { catalogPath, propertyPath, SITE_URL } from "./publicSeo";
import { SEO_REGIONS, SEO_CITIES } from "./seoLocations";
import { getAllBlogPosts } from "./blog";
export const SITEMAP_SIZE = 45000;
export type SitemapEntry = { loc: string; lastmod?: string };
export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
export function sitemapXml(entries: SitemapEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((e) => `<url><loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `<lastmod>${escapeXml(e.lastmod)}</lastmod>` : ""}</url>`).join("")}</urlset>`;
}
export async function sitemapEntries(): Promise<SitemapEntry[]> {
  if (!supabaseServer) throw new Error("Sitemap database unavailable");
  const entries: SitemapEntry[] = ["/", "/en", "/abc", "/blog"].map((path) => ({
    loc: SITE_URL + path,
  }));
  for (const locale of ["pl", "en"] as const) {
    for (const country of ["hiszpania", "cypr"])
      entries.push({ loc: SITE_URL + catalogPath(country, locale) });
    for (const region of SEO_REGIONS)
      entries.push({
        loc: SITE_URL + catalogPath("hiszpania", locale, region.slug),
      });
    for (const city of SEO_CITIES)
      entries.push({
        loc:
          SITE_URL + catalogPath("hiszpania", locale, city.region, city.slug),
      });
  }
  for (const post of getAllBlogPosts()) {
    entries.push({
      loc: SITE_URL + "/blog/" + post.slug,
      ...(post.updatedAt && Number.isFinite(Date.parse(post.updatedAt))
        ? { lastmod: new Date(post.updatedAt).toISOString() }
        : {}),
    });
  }
  // Supabase limits each response to 1,000 rows. Read stable, disjoint batches.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await publicListings(
      supabaseServer
        .from("properties")
        .select("external_id,type,town,country,title"),
    )
      .order("id")
      .range(offset, offset + 999);
    if (error) throw new Error("Sitemap property query failed");
    for (const property of data || [])
      for (const locale of ["pl", "en"] as const) {
        const path = propertyPath(property, locale);
        // updated_at is refreshed by imports, not necessarily a material edit: omit lastmod.
        if (path) entries.push({ loc: SITE_URL + path });
      }
    if (!data || data.length < 1000) break;
  }
  return [...new Map(entries.map((entry) => [entry.loc, entry])).values()];
}
