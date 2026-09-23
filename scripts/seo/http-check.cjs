// Read-only HTTP acceptance checks against an already running production build.
// Usage: SEO_BASE_URL=http://localhost:3100 node scripts/seo/http-check.cjs
const assert = require("node:assert/strict"),
  fs = require("node:fs");
const { XMLValidator, XMLParser } = require("fast-xml-parser");
const base = process.env.SEO_BASE_URL || "http://localhost:3100";
const matrix = [];
const decode = (s) =>
  s
    ?.replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
async function get(path, status = 200) {
  const r = await fetch(base + path, { redirect: "manual" });
  assert.equal(
    r.status,
    status,
    `${path}: expected ${status}, received ${r.status}`,
  );
  const html = await r.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  return { r, html, props: m ? JSON.parse(m[1]).props.pageProps : {} };
}
async function check(path) {
  const result = await get(path);
  const { html } = result;
  const tag = (regex) => decode(html.match(regex)?.[1]);
  const canonical = tag(/<link rel="canonical" href="([^"]*)"/);
  assert.equal((html.match(/<title\b/g) || []).length, 1, path);
  assert.equal((html.match(/name="description"/g) || []).length, 1, path);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
  const lang = tag(/<html[^>]*lang="([^"]+)"/);
  assert.equal(lang, path.startsWith("/en") ? "en" : "pl");
  assert.ok(canonical.startsWith("https://onesta.com.pl/"));
  assert.ok(!/[?&](utm_|fbclid|gclid)/.test(canonical));
  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
  ))
    JSON.parse(m[1]);
  matrix.push({
    url: path,
    title: tag(/<title[^>]*>(.*?)<\/title>/s),
    h1: tag(/<h1[^>]*>(.*?)<\/h1>/s)?.replace(/<[^>]+>/g, ""),
    canonical,
    robots: tag(/<meta name="robots" content="([^"]+)"/),
    lang,
  });
  return result;
}
(async () => {
  for (const path of [
    "/",
    "/en",
    "/abc",
    "/blog/nieruchomosci-costa-blanca",
    "/nieruchomosci/hiszpania",
    "/nieruchomosci/cypr",
    "/en/properties/hiszpania",
    "/en/properties/cypr",
  ])
    await check(path);
  for (const region of [
    "costa-blanca",
    "costa-del-sol",
    "costa-calida",
    "costa-de-almeria",
  ])
    for (const prefix of ["/nieruchomosci", "/en/properties"]) {
      const x = await check(`${prefix}/hiszpania/${region}`);
      assert.ok(x.props.totalCount > 0);
    }
  for (const [region, city] of [
    ["costa-blanca", "torrevieja"],
    ["costa-blanca", "guardamar-del-segura"],
    ["costa-del-sol", "estepona"],
    ["costa-del-sol", "mijas"],
    ["costa-calida", "san-pedro-del-pinatar"],
    ["costa-de-almeria", "vera"],
  ])
    for (const prefix of ["/nieruchomosci", "/en/properties"])
      await check(`${prefix}/hiszpania/${region}/${city}`);
  for (const path of [
    "/nieruchomosci/hiszpania",
    "/nieruchomosci/hiszpania/costa-blanca",
    "/nieruchomosci/hiszpania/costa-de-almeria/vera",
  ]) {
    const a = await get(path),
      b = await check(path + "?page=2");
    assert.equal(b.props.currentPage, 2);
    assert.ok(b.props.properties.length > 0);
    assert.ok(
      !b.props.properties.some((p) =>
        a.props.properties.some((q) => q.external_id === p.external_id),
      ),
    );
    assert.ok(matrix.at(-1).canonical.endsWith("?page=2"));
  }
  const slug = "/nieruchomosci/hiszpania/apartament-w-torrevieja";
  for (const id of [
    "MTI-3263-115-10-115",
    "MTI-3226-115-10-115",
    "MTI-3226-115-10-115",
    "MTI-3263-115-10-115",
  ]) {
    const p = await check(slug + "?id=" + id + "&utm_source=seo-test");
    assert.equal(p.props.propertyFromSupabase.external_id, id);
    assert.match(p.r.headers.get("cache-control"), /no-store/);
    assert.ok(matrix.at(-1).canonical.endsWith("?id=" + id));
  }
  for (const path of [
    slug,
    slug + "?id=SEO-NONEXISTENT-20260922",
    "/nieruchomosci/hiszpania?page=0",
    "/nieruchomosci/hiszpania?page=2abc",
    "/nieruchomosci/hiszpania?page=99999",
    "/nieruchomosci/unknown",
    "/nieruchomosci/hiszpania/costa-calida/torrevieja",
    "/nieruchomosci/hiszpania?location=not-a-real-location",
    "/nieruchomosci/hiszpania?sort=invalid",
  ])
    await get(path, 404);
  for (const [path, dest] of [
    [
      "/nieruchomosci/hiszpania?page=1&utm_source=test",
      "/nieruchomosci/hiszpania?utm_source=test",
    ],
    [
      "/hiszpania?page=1&utm_source=test",
      "/nieruchomosci/hiszpania?utm_source=test",
    ],
    [
      "/blog/nieruchomosci-costa-blanca-old",
      "/blog/nieruchomosci-costa-blanca",
    ],
  ]) {
    const { r } = await get(path, 308);
    assert.equal(r.headers.get("location"), dest);
  }
  await check("/nieruchomosci/hiszpania?bedsMin=0&bedsMax=0");
  assert.equal(matrix.at(-1).robots, "noindex, follow");
  const sitemap = await get("/sitemap.xml");
  assert.equal(XMLValidator.validate(sitemap.html), true);
  const xml = new XMLParser().parse(sitemap.html);
  assert.ok(
    xml.urlset,
    "Update this smoke test to crawl sitemap index after 45,000 URLs",
  );
  const urls = xml.urlset.url;
  assert.ok(urls.length > 2000, "sitemap must exceed a single Supabase batch");
  assert.equal(new Set(urls.map((u) => u.loc)).size, urls.length);
  assert.ok(
    urls.every((u) => !u.loc.includes("-old") && !u.loc.includes("utm_")),
  );
  assert.ok(
    urls.filter((u) => u.loc.includes("?id=")).every((u) => !u.lastmod),
  );
  // Sample across the complete map, including beyond the first Supabase batch.
  const offers = urls.filter((u) => u.loc.includes("?id="));
  const special = offers.find((u) =>
    new URL(u.loc).searchParams.get("id").includes("/"),
  );
  assert.ok(special);
  const specialUrl = new URL(special.loc);
  const specialResult = await check(specialUrl.pathname + specialUrl.search);
  assert.equal(
    specialResult.props.propertyFromSupabase.external_id,
    specialUrl.searchParams.get("id"),
  );
  assert.equal(matrix.at(-1).canonical, special.loc);
  for (const i of [0, 1, 2001, offers.length - 1]) {
    const url = new URL(offers[i].loc);
    await check(url.pathname + url.search);
    assert.equal(matrix.at(-1).canonical, offers[i].loc);
  }
  fs.writeFileSync(
    "/tmp/onesta-seo-http-results.json",
    JSON.stringify(
      { matrix, sitemapUrls: urls.length, offers: offers.length },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      pages: matrix.length,
      sitemapUrls: urls.length,
      offers: offers.length,
      status: "PASS",
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
