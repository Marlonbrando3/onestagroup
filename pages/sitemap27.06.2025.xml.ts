// pages/sitemap.xml.ts
import { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";

const SITE_URL = "https://onesta.com.pl";

// Funkcja slugify
const slugify = (title: string, id: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") +
  "-" +
  id;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const filePath = path.join(process.cwd(), "public/properties.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const properties = JSON.parse(raw);

  const urls = properties.map((p: any) => {
    const country = p.country?.name?.toLowerCase() || "hiszpania";
    const title = p.headerAdvertisement || "ogloszenie";
    const id = p.id?.toString() || "0";
    const slug = slugify(title, id);
    const url = `${SITE_URL}/nieruchomosci/${country}/${slug}`;
    const lastmod = new Date(p.actualisationDate || new Date()).toISOString();

    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${lastmod}</lastmod>
      </url>
    `;
  });

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
