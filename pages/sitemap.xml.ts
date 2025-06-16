// pages/sitemap.xml.ts
import { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";

const SITE_URL = "https://onesta.com.pl";

const formatTitleForQuery = (title: string) =>
  encodeURIComponent(title.replace(/\s+/g, " ").trim());

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const filePath = path.join(process.cwd(), "public/properties.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const properties = JSON.parse(raw);

  const urls = properties.map((p: any) => {
    const country = p.country?.name?.toLowerCase();
    const titleParam = formatTitleForQuery(p.headerAdvertisement || "ogloszenie");

    const url = `${SITE_URL}/nieruchomosci/${country}/oferta?id=${p.id}&t=${titleParam}`;

    return `
      <url>
        <loc>${url.replace(/&/g, "&amp;")}</loc>
        <lastmod>${new Date(p.actualisationDate).toISOString()}</lastmod>
      </url>
    `;
  });

  console.log(urls);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
