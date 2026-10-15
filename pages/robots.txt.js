import { siteConfig } from "@/lib/siteConfig";

// Blokujemy strefy prywatne/techniczne i kombinacje filtrów katalogu (każda to osobne
// wywołanie funkcji Netlify). /oferty/[token] (listy dla klientów) mają noindex,nofollow w HTML.

export async function getServerSideProps({ res }) {
  // Filtry katalogu mają noindex,follow; ich kombinacje to praktycznie nieskończona liczba
  // adresów generowanych przez funkcję serwera. Czyste adresy (regiony, miasta, typy),
  // zwykła paginacja (?page=) i oferty (?id=) pozostają dostępne.
  const filterParams = ["location", "region", "type", "priceMin", "priceMax", "minPrice", "maxPrice", "bedsMin", "bathsMin", "pool", "market", "sort"];
  const filterRules = filterParams.map((param) => `Disallow: /*?*${param}=`).join("\n");
  // Boty zbierające dane do trenowania modeli i narzędzia SEO — nie wpływają na Google.
  // Boty wyszukiwarek AI (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot) zostają wpuszczone.
  const blockedBots = ["GPTBot", "CCBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "Bytespider", "Amazonbot", "meta-externalagent", "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "PetalBot", "BLEXBot", "DataForSeoBot"];
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /agent
Disallow: /crm
Disallow: /onesari
Disallow: /login
Disallow: /leadforms
Disallow: /choosedoffers
Disallow: /test-1
${filterRules}

${blockedBots.map((bot) => `User-agent: ${bot}\nDisallow: /`).join("\n\n")}

Sitemap: ${siteConfig.url}/sitemap.xml
`;
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Netlify-CDN-Cache-Control", "public, durable, s-maxage=86400, stale-while-revalidate=604800");

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
