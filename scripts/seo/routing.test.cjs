// Execute real Pages Router loaders with a controlled, read-only Supabase double.
// No credentials, network, React rendering, or production writes are involved.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript"),
  vm = require("node:vm"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "../..");
function harness(rows, { failure = false } = {}) {
  const cache = {};
  class Query {
    constructor() {
      this.rows = [...rows];
      this.orders = [];
      this.from = 0;
      this.to = Infinity;
    }
    select() {
      return this;
    }
    eq(k, v) {
      this.rows = this.rows.filter((r) => r[k] === v);
      return this;
    }
    in(k, v) {
      this.rows = this.rows.filter((r) => v.includes(r[k]));
      return this;
    }
    gte(k, v) {
      this.rows = this.rows.filter((r) => r[k] >= v);
      return this;
    }
    lte(k, v) {
      this.rows = this.rows.filter((r) => r[k] <= v);
      return this;
    }
    not(k, op, v) {
      this.rows = this.rows.filter((r) => r[k] !== v);
      return this;
    }
    neq(k, v) {
      this.rows = this.rows.filter((r) => JSON.stringify(r[k]) !== v);
      return this;
    }
    ilike(k, v) {
      this.rows = this.rows.filter(
        (r) => String(r[k]).toLowerCase() === v.toLowerCase(),
      );
      return this;
    }
    or(expression) {
      if (expression.startsWith("and(or(status."))
        this.rows = this.rows.filter(
          (r) =>
            (r.status == null || r.status === "AKTUALNA") &&
            (r.operation == null || ["sale", "SPRZEDAŻ"].includes(r.operation)),
        );
      else throw new Error("Unsupported test predicate: " + expression);
      return this;
    }
    order(k, { ascending = true } = {}) {
      this.orders.push([k, ascending]);
      return this;
    }
    range(a, b) {
      this.from = a;
      this.to = b;
      return this;
    }
    result() {
      const sorted = this.rows.sort((a, b) => {
        for (const [k, asc] of this.orders) {
          if (a[k] !== b[k]) return (a[k] < b[k] ? -1 : 1) * (asc ? 1 : -1);
        }
        return 0;
      });
      return {
        data: sorted.slice(this.from, this.to + 1),
        count: sorted.length,
        error: failure ? { message: "controlled outage" } : null,
      };
    }
    then(resolve, reject) {
      return Promise.resolve(this.result()).then(resolve, reject);
    }
    async maybeSingle() {
      const r = this.result();
      return {
        ...r,
        data: r.data.length === 1 ? r.data[0] : null,
        error: r.error || (r.data.length > 1 ? { message: "ambiguous" } : null),
      };
    }
  }
  const db = { from: () => new Query() };
  function load(file) {
    file = path.resolve(root, file);
    for (const ext of ["", ".ts", ".tsx", ".js", ".json", "/index.tsx"])
      if (fs.existsSync(file + ext) && fs.statSync(file + ext).isFile()) {
        file += ext;
        break;
      }
    if (cache[file]) return cache[file].exports;
    if (file.endsWith(".json"))
      return JSON.parse(fs.readFileSync(file, "utf8"));
    const m = { exports: {} };
    cache[file] = m;
    const localRequire = (id) => {
      if (id.includes("supabaseClient")) return { supabaseServer: db };
      const resolved = id.startsWith("@/")
        ? path.join(root, id.slice(2))
        : id.startsWith(".")
          ? path.resolve(path.dirname(file), id)
          : null;
      if (
        resolved &&
        (resolved.includes("/lib/") ||
          resolved.includes("/data/") ||
          resolved.includes("/pages/"))
      )
        return load(resolved);
      // Components and framework hooks are not invoked by getServerSideProps.
      return new Proxy(() => null, { get: () => () => null });
    };
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
      filename: file,
    })(localRequire, m, m.exports);
    return m.exports;
  }
  return { load };
}
const fixtures = Array.from({ length: 47 }, (_, i) => ({
  id: i,
  external_id: i === 1 ? "REF/a & b" : `REF-${i}`,
  title: "Apartament w Torrevieja",
  type: "Apartment",
  town: "Torrevieja",
  province: "Alicante",
  country: "Spain",
  price: 100000,
  beds: i % 3,
  baths: 1,
  pool: true,
  surface_built: 49,
  new_build: false,
  onesta_featured: false,
  images: ["https://example.invalid/image.jpg"],
  description_pl: "Kontrolowany opis",
  description_en: "Controlled description",
}));
fixtures.push({
  ...fixtures[0],
  id: 100,
  external_id: "VERA",
  town: "Vera",
  province: "Almería",
});
function ctx(
  query = {},
  params = { country: "hiszpania", title: "apartament-w-torrevieja" },
) {
  const headers = {};
  return {
    query: { ...params, ...query },
    params,
    resolvedUrl: "/nieruchomosci/hiszpania/" + (params.title || ""),
    res: { setHeader: (k, v) => (headers[k] = v) },
    headers,
  };
}
test("same slug, distinct IDs, reverse request order, zero bedrooms and cache", async () => {
  const { load } = harness(fixtures),
    page = load("pages/nieruchomosci/[country]/[title]/index.tsx");
  for (const id of ["REF-0", "REF/a & b", "REF/a & b", "REF-0"]) {
    const c = ctx({ id });
    const r = await page.getServerSideProps(c);
    assert.equal(r.props.propertyFromSupabase.external_id, id);
    assert.equal(
      r.props.propertyFromSupabase.descriptions.pl,
      "Kontrolowany opis",
    );
    assert.match(c.headers["Cache-Control"], /no-store/);
    assert.equal(c.headers["Netlify-CDN-Cache-Control"], "no-store");
  }
  const seo = load("lib/publicSeo");
  const uri = seo.propertyPath(fixtures[1]);
  assert.equal(new URL(uri, seo.SITE_URL).searchParams.get("id"), "REF/a & b");
  assert.match(seo.propertyMetadata(fixtures[0]).description, /Sypialnie: 0/);
});
test("missing, invalid and ambiguous ID never choose arbitrary record; outage is server error", async () => {
  const { load } = harness(fixtures),
    fn = load(
      "pages/nieruchomosci/[country]/[title]/index.tsx",
    ).getServerSideProps;
  for (const id of [undefined, "MISSING", ["REF-0", "REF/a & b"]])
    assert.equal((await fn(ctx({ id }))).notFound, true);
  const fail = harness(fixtures, { failure: true }).load(
    "pages/nieruchomosci/[country]/[title]/index.tsx",
  ).getServerSideProps;
  await assert.rejects(fail(ctx({ id: "REF-0" })), /lookup failed/);
});
test("wrong country/slug redirects same identity, preserving campaign attribution", async () => {
  const { load } = harness(fixtures);
  const r = await load(
    "pages/nieruchomosci/[country]/[title]/index.tsx",
  ).getServerSideProps(
    ctx(
      { id: "REF/a & b", utm_source: "test" },
      { country: "cypr", title: "wrong" },
    ),
  );
  const u = new URL(r.redirect.destination, "https://onesta.com.pl");
  assert.equal(u.pathname, "/nieruchomosci/hiszpania/apartament-w-torrevieja");
  assert.equal(u.searchParams.get("id"), "REF/a & b");
  assert.equal(u.searchParams.get("utm_source"), "test");
  assert.equal(r.redirect.permanent, true);
});
test("region and city stay scoped across stable pagination; invalid routes and pages 404", async () => {
  const { load } = harness(fixtures),
    fn = load("pages/nieruchomosci/[country]").getServerSideProps;
  const params = {
    country: "hiszpania",
    title: "costa-blanca",
    city: "torrevieja",
  };
  const first = await fn(ctx({}, params)),
    second = await fn(ctx({ page: "2" }, params));
  assert.equal(first.props.totalCount, 47);
  assert.equal(second.props.properties.length, 21);
  assert.ok(second.props.properties.every((p) => p.town === "Torrevieja"));
  assert.equal(
    new Set(
      [...first.props.properties, ...second.props.properties].map(
        (p) => p.external_id,
      ),
    ).size,
    42,
  );
  for (const page of ["0", "-1", "2junk", "999", "1.5"])
    assert.equal((await fn(ctx({ page }, params))).notFound, true);
  assert.equal((await fn(ctx({}, { country: "unknown" }))).notFound, true);
  assert.equal(
    (
      await fn(
        ctx(
          {},
          { country: "hiszpania", title: "costa-calida", city: "torrevieja" },
        ),
      )
    ).notFound,
    true,
  );
  const r = await fn(
    ctx({ page: "1", bedsMin: "0", utm_source: "test" }, params),
  );
  assert.ok(!r.redirect.destination.includes("page="));
  assert.match(r.redirect.destination, /bedsMin=0/);
  assert.match(r.redirect.destination, /utm_source=test/);
});
test("canonical keeps pagination, scope and filters but excludes campaign tags", () => {
  const seo = harness(fixtures).load("lib/publicSeo");
  const canonical = seo.canonicalCatalog(
    "/nieruchomosci/hiszpania/costa-blanca",
    { page: "2", bedsMin: "0", utm_source: "test", fbclid: "x" },
  );
  const u = new URL(canonical);
  assert.equal(u.searchParams.get("page"), "2");
  assert.equal(u.searchParams.get("bedsMin"), "0");
  assert.equal(u.searchParams.has("utm_source"), false);
  assert.equal(u.searchParams.has("fbclid"), false);
  assert.equal(seo.hasFilters({ bedsMin: "0" }), true);
  assert.equal(seo.hasFilters({ page: "2" }), false);
});
test("a region slug with explicit id resolves an offer, not a region", async () => {
  const fn = harness(fixtures).load(
    "pages/nieruchomosci/[country]/[title]/index.tsx",
  ).getServerSideProps;
  const r = await fn(
    ctx({ id: "REF-0" }, { country: "hiszpania", title: "costa-blanca" }),
  );
  assert.ok(r.redirect.destination.includes("?id=REF-0"));
});

test("withdrawn properties and rentals are absent from catalogue and detail", async () => {
  const rows = [
    ...fixtures,
    { ...fixtures[0], id: 200, external_id: "WITHDRAWN", status: "WYCOFANA" },
    { ...fixtures[0], id: 201, external_id: "RENT", operation: "rent" },
  ];
  const { load } = harness(rows);
  const detail = load(
    "pages/nieruchomosci/[country]/[title]/index.tsx",
  ).getServerSideProps;
  for (const id of ["WITHDRAWN", "RENT"])
    assert.equal((await detail(ctx({ id }))).notFound, true);
  const catalog = await load(
    "pages/nieruchomosci/[country]",
  ).getServerSideProps(ctx({}, { country: "hiszpania" }));
  assert.equal(catalog.props.totalCount, fixtures.length);
});
