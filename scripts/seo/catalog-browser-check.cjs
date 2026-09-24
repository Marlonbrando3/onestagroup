// Read-only local acceptance test. Never submits forms or sends analytics.
const { chromium } = require(process.env.SEO_PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const base = process.env.SEO_BASE_URL || "http://localhost:3101";
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", (route) => {
      const request = route.request(),
        url = new URL(request.url());
      return request.method() !== "GET" ||
        !["localhost", "127.0.0.1"].includes(url.hostname)
        ? route.abort()
        : route.continue();
    });
    await page.addInitScript(() => {
      window.getCkyConsent = () => ({
        isUserActionCompleted: true,
        categories: { necessary: true, advertisement: true },
      });
    });
    const original =
      "/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2&maxPrice=400000";
    await page.goto(base + original, { waitUntil: "networkidle" });
    const search = page.locator("#search-wrapper");
    await search.getByText("Apartament", { exact: true }).waitFor();
    assert.equal(
      await search.getByText("Costa Blanca", { exact: true }).count(),
      1,
    );
    assert.equal(
      await search
        .getByRole("button", { name: "Hiszpania", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      "https://onesta.com.pl/nieruchomosci/hiszpania/costa-blanca/apartments",
    );
    const submit = async (expected) => {
      await search.getByRole("button", { name: "Search", exact: true }).click();
      await page.waitForURL((url) => url.pathname === expected);
      await page.waitForLoadState("networkidle");
      assert.equal(new URL(page.url()).searchParams.get("beds"), "2");
      assert.equal(new URL(page.url()).searchParams.get("maxPrice"), "400000");
    };
    // F: replace the coast using the existing location control.
    await search.getByRole("button", { name: "Remove", exact: true }).click();
    await search
      .getByPlaceholder("np. Alicante, Malaga, Costa Blanca...")
      .fill("Costa del Sol");
    await search.getByText("Costa del Sol", { exact: true }).click();
    await submit("/nieruchomosci/hiszpania/costa-del-sol/apartments");
    // G: remove region, retaining type and query.
    await search.getByRole("button", { name: "Remove", exact: true }).click();
    await submit("/nieruchomosci/hiszpania/apartments");
    // H: remove type.
    await search.getByText("Zabudowa", { exact: true }).click();
    await search
      .locator("span")
      .getByText("Apartament", { exact: true })
      .click();
    await submit("/nieruchomosci/hiszpania");
    // J: browser history and reload restore both URL scope and controls.
    await page.goBack({ waitUntil: "networkidle" });
    await search.getByText("Apartament", { exact: true }).waitFor();
    await page.goBack({ waitUntil: "networkidle" });
    await search.getByText("Costa del Sol", { exact: true }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await search.getByText("Costa del Sol", { exact: true }).waitFor();
    await search.getByText("Apartament", { exact: true }).waitFor();
    await page.goForward({ waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, "/nieruchomosci/hiszpania/apartments");
    await search
      .getByRole("button", { name: "Remove", exact: true })
      .waitFor({ state: "detached" });
    // Sorting and pagination preserve the scope.
    await page.locator("#summary select").selectOption("price_asc");
    await page.waitForURL(
      (url) => url.searchParams.get("sort") === "price_asc",
    );
    assert.equal(new URL(page.url()).pathname, "/nieruchomosci/hiszpania/apartments");
    const next = page.locator("nav a").filter({ hasText: /^2$/ }).first();
    await next.click();
    await page.waitForURL((url) => url.searchParams.get("page") === "2");
    assert.equal(new URL(page.url()).pathname, "/nieruchomosci/hiszpania/apartments");
    await page.locator('link[rel="canonical"][href="https://onesta.com.pl/nieruchomosci/hiszpania/apartments?page=2"]').waitFor({ state: "attached" });
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      "https://onesta.com.pl/nieruchomosci/hiszpania/apartments?page=2",
    );
    await page.screenshot({ path: "/tmp/catalog-routing-desktop.png" });
    // English and mobile use the same URL-derived state.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      base + "/en/properties/spain/costa-blanca/apartments?beds=2&maxPrice=400000",
      { waitUntil: "networkidle" },
    );
    await page
      .getByRole("button", { name: "Search", exact: true })
      .first()
      .click();
    await page
      .getByText("Apartment", { exact: true })
      .last()
      .waitFor({ state: "visible" });
    await page
      .getByText("Costa Blanca", { exact: true })
      .last()
      .waitFor({ state: "visible" });
    await page.screenshot({ path: "/tmp/catalog-routing-mobile.png" });
    assert.deepEqual(errors, []);
    console.log(
      "PASS: direct navigation, F–J, sorting, pagination, canonical, English/mobile state; no browser errors.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
