import { siteConfig } from "@/lib/siteConfig";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrl({ loc, lastmod, changefreq = "monthly", priority = "0.7" }) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function getServerSideProps({ res }) {
  const { getAllBlogPosts } = await import("@/lib/blog");

  const staticUrls = [
    {
      loc: siteConfig.url,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: `${siteConfig.url}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    },
  ];

  const blogUrls = getAllBlogPosts().map((post) => ({
    loc: `${siteConfig.url}/blog/${post.slug}`,
    lastmod: new Date(post.updatedAt).toISOString(),
    changefreq: "monthly",
    priority: "0.7",
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...blogUrls].map(buildUrl).join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
