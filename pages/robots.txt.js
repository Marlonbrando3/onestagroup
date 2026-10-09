import { siteConfig } from "@/lib/siteConfig";

// Katalogi i filtry nie są tu blokowane celowo: mają noindex,follow, a Google
// musi móc odczytać ten znacznik. Blokujemy tylko strefy prywatne/techniczne.
// /oferty/[token] (listy dla klientów) mają noindex,nofollow w HTML.

export async function getServerSideProps({ res }) {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Allow: /api/property-image
Disallow: /admin
Disallow: /agent
Disallow: /crm
Disallow: /onesari
Disallow: /login
Disallow: /leadforms
Disallow: /choosedoffers
Disallow: /test-1

Sitemap: ${siteConfig.url}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.write(robots);
  res.end();

  return {
    props: {},
  };
}

export default function Robots() {
  return null;
}
