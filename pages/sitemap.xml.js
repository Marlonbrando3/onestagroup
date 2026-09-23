import { sitemapEntries, sitemapXml, SITEMAP_SIZE } from "@/lib/publicSitemap";
import { SITE_URL } from "@/lib/publicSeo";
export async function getServerSideProps({ res }) {
  const entries = await sitemapEntries();
  const xml =
    entries.length <= SITEMAP_SIZE
      ? sitemapXml(entries)
      : `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Array.from({ length: Math.ceil(entries.length / SITEMAP_SIZE) }, (_, i) => `<sitemap><loc>${SITE_URL}/sitemaps/${i + 1}.xml</loc></sitemap>`).join("")}</sitemapindex>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=900");
  res.end(xml);
  return { props: {} };
}
export default function Sitemap() {
  return null;
}
