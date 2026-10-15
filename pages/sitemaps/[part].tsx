import { sitemapEntries, sitemapXml, SITEMAP_SIZE } from "@/lib/publicSitemap";
export async function getServerSideProps({ params, res }: any) {
  if (!/^[1-9]\d*\.xml$/.test(params.part)) return { notFound: true };
  const page = Number(params.part.replace(".xml", ""));
  const entries = await sitemapEntries();
  if (
    entries.length <= SITEMAP_SIZE ||
    page > Math.ceil(entries.length / SITEMAP_SIZE)
  )
    return { notFound: true };
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=900");
  res.setHeader("Netlify-CDN-Cache-Control", "public, durable, s-maxage=21600, stale-while-revalidate=86400");
  res.end(
    sitemapXml(entries.slice((page - 1) * SITEMAP_SIZE, page * SITEMAP_SIZE)),
  );
  return { props: {} };
}
export default function SitemapPart() {
  return null;
}
