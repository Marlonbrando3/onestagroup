const { test } = require("node:test");
const assert = require("node:assert/strict");
const { harness, fixtures } = require("./routing.test.cjs");
const { load } = harness([
  ...fixtures,
  { ...fixtures[0], id: 102, external_id: "VILLA", type: "Villa" },
]);
const routing = load("lib/catalogRouting");
const loader = load("pages/properties/[[...catalog]].tsx").getServerSideProps;
function context(url) {
  const parsed = new URL(url, "https://onesta.com.pl");
  return {
    query: routing.queryFromUrl(url),
    params: { catalog: parsed.pathname.split("/").slice(2) },
    resolvedUrl: url,
    res: { setHeader() {} },
  };
}
test("Alicante city landing excludes other towns in Alicante province in both languages", async () => {
  const { load: loadCity } = harness([
    ...fixtures,
    { ...fixtures[0], id: 301, external_id: "ALICANTE-CITY", town: "Alicante" },
    { ...fixtures[0], id: 302, external_id: "WRONG-PROVINCE", town: "Alicante", province: "Murcia" },
  ]);
  const cityLoader = loadCity("pages/properties/[[...catalog]].tsx").getServerSideProps;
  for (const path of [
    "/nieruchomosci/hiszpania/costa-blanca/alicante",
    "/en/properties/hiszpania/costa-blanca/alicante",
  ]) {
    const result = await cityLoader(context(path));
    assert.equal(result.props.totalCount, 1);
    assert.equal(result.props.properties[0].external_id, "ALICANTE-CITY");
    assert.equal(result.props.citySlug, "alicante");
  }
});
test("A–D: all four SEO scopes use the shared datasource and exact Apartment filter", async () => {
  const matrix = [
    ["/nieruchomosci/hiszpania", { country: "hiszpania" }, 49],
    [
      "/nieruchomosci/hiszpania/apartments",
      { country: "hiszpania", propertyType: "apartments" },
      48,
    ],
    [
      "/nieruchomosci/hiszpania/costa-blanca",
      { country: "hiszpania", region: "costa-blanca" },
      48,
    ],
    [
      "/nieruchomosci/hiszpania/costa-blanca/apartments",
      {
        country: "hiszpania",
        region: "costa-blanca",
        propertyType: "apartments",
      },
      47,
    ],
  ];
  for (const [url, scope, count] of matrix) {
    const result = await loader(context(url));
    assert.deepEqual(result.props.catalogRoute, scope);
    assert.equal(result.props.totalCount, count);
  }
});
test("E–H: changing and removing SEO filters retains compatible UX parameters", () => {
  const build = (q) =>
    routing.buildCatalogUrl("Spain", {
      beds: "2",
      maxPrice: "400000",
      pool: "true",
      ...q,
    });
  assert.equal(
    build({ region: "Costa Blanca", type: "Apartment" }),
    "/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2&maxPrice=400000&pool=true",
  );
  assert.equal(
    build({ location: "costa_del_sol", type: "Apartment" }),
    "/nieruchomosci/hiszpania/costa-del-sol/apartments?beds=2&maxPrice=400000&pool=true",
  );
  assert.equal(
    build({ type: "Apartment" }),
    "/nieruchomosci/hiszpania/apartments?beds=2&maxPrice=400000&pool=true",
  );
  assert.equal(build({}), "/nieruchomosci/hiszpania?beds=2&maxPrice=400000&pool=true");
  assert.equal(
    build({ region: "Costa Blanca", type: "House" }).split("?")[0],
    "/nieruchomosci/hiszpania/costa-blanca/houses",
  );
});
test("I: legacy URLs permanently redirect once, preserving UX and campaign parameters", async () => {
  for (const prefix of [
    "/properties?country=Spain&",
    "/properties/spain?",
    "/nieruchomosci/hiszpania?",
  ]) {
    const first = await loader(
      context(
        prefix +
          "region=Costa+Blanca&type=Apartment&beds=2&maxPrice=400000&utm_source=test",
      ),
    );
    assert.equal(first.redirect.permanent, true);
    assert.equal(
      first.redirect.destination,
      "/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2&maxPrice=400000&utm_source=test",
    );
    const second = await loader(context(first.redirect.destination));
    assert.ok(second.props);
    assert.ok(
      second.props.properties.every(
        (p) => p.type === "Apartment" && p.beds === 2,
      ),
    );
  }
});
test("path is authoritative when redundant query dimensions conflict", async () => {
  const result = await loader(
    context(
      "/nieruchomosci/hiszpania/costa-blanca/apartments?country=Cyprus&region=Costa+del+Sol&type=Villa&beds=2",
    ),
  );
  assert.equal(
    result.redirect.destination,
    "/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2",
  );
});
test("multi-selects, disabled types and narrower legacy types retain their exact predicates", () => {
  for (const type of [
    "Apartment,Villa",
    "Quad House",
    "Penthouse",
    "townhouse",
  ]) {
    const url = routing.buildCatalogUrl("Spain", { type });
    assert.equal(routing.queryFromUrl(url).type, type);
  }
  assert.equal(
    routing.buildCatalogUrl("Spain", {
      location: "costa_brava",
      type: "Apartment",
    }),
    "/nieruchomosci/hiszpania/apartments?location=costa_brava",
  );
  for (const route of [
    "/nieruchomosci/hiszpania/quad-houses",
    "/nieruchomosci/hiszpania/not-a-region",
    "/nieruchomosci/cypr/costa-blanca",
    "/nieruchomosci/hiszpania/apartments/villas",
    "/nieruchomosci/hiszpania/costa-blanca/apartments/pool",
  ])
    assert.equal(routing.parseCatalogPath(route), null);
});
test("all enabled sitemap combinations roundtrip; disabled values never become landings", () => {
  for (const route of routing.seoCatalogRoutes()) {
    for (const locale of ["pl", "en"])
      assert.deepEqual(
        routing.parseCatalogPath(routing.catalogRoutePath(route, locale)),
        route,
      );
  }
  assert.equal(
    new Set(routing.PROPERTY_TYPES.map((t) => t.slug)).size,
    routing.PROPERTY_TYPES.length,
  );
});
test("canonical, copy and breadcrumbs depend on scope, not UX filters", () => {
  const route = routing.parseCatalogPath(
    "/nieruchomosci/hiszpania/costa-blanca/apartments",
  );
  const content = load("lib/catalogContent");
  const key = content.landingKey(route);
  content.SEO_LANDING_CONFIG[key] = {
    pl: { h1: "Editorial title", intro: "Editorial intro" },
  };
  assert.equal(content.landingContent(route, "pl").h1, "Editorial title");
  const crumbs = content.catalogBreadcrumbs(route, "en");
  assert.deepEqual(
    crumbs.map((c) => c.path),
    [
      "/en/properties",
      "/en/properties/spain",
      "/en/properties/spain/costa-blanca",
      "/en/properties/spain/costa-blanca/apartments",
    ],
  );
  assert.equal(
    load("lib/publicSeo").canonicalCatalog("/nieruchomosci/hiszpania/apartments", {
      beds: "2",
      pool: "true",
      maxPrice: "400000",
      page: "2",
    }),
    "https://onesta.com.pl/nieruchomosci/hiszpania/apartments?page=2",
  );
});
test("pool and price aliases reach shared filters; malformed values remain rejected", async () => {
  const result = await loader(
    context("/nieruchomosci/hiszpania/apartments?beds=2&pool=true&maxPrice=100000"),
  );
  assert.ok(
    result.props.properties.every(
      (p) => p.beds === 2 && p.pool && p.price <= 100000,
    ),
  );
  for (const suffix of [
    "page=-1",
    "page=999",
    "pool=maybe",
    "maxPrice=wrong",
    "minPrice=200000&maxPrice=100000",
    "type=%25",
    "beds=two",
  ]) {
    assert.equal(
      (await loader(context("/nieruchomosci/hiszpania?" + suffix))).notFound,
      true,
      suffix,
    );
  }
});
