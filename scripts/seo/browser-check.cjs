const { chromium } = require(process.env.SEO_PLAYWRIGHT_PATH || "playwright");
const fs = require("fs"),
  assert = require("assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  // Never send real leads or analytics while verifying forms.
  await context.route("**/*", (r) => {
    const u = new URL(r.request().url());
    if (
      r.request().method() !== "GET" ||
      (!["localhost", "127.0.0.1"].includes(u.hostname) &&
        !r
          .request()
          .resourceType()
          .match(/image|font|stylesheet/))
    )
      return r.abort();
    return r.continue();
  });
  await context.addInitScript(() => {
    window.getCkyConsent = () => ({
      isUserActionCompleted: true,
      categories: { necessary: true, advertisement: true },
    });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const routes = [
    "/",
    "/en",
    "/nieruchomosci/hiszpania",
    "/nieruchomosci/cypr",
    "/nieruchomosci/hiszpania/costa-blanca",
    "/nieruchomosci/hiszpania/costa-de-almeria/vera",
    "/en/properties/hiszpania/costa-del-sol",
    "/blog/nieruchomosci-costa-blanca",
    "/abc",
  ];
  const results = [];
  for (const route of routes) {
    await page.goto("http://localhost:3100" + route, {
      waitUntil: "networkidle",
    });
    const data = await page.evaluate(() => ({
      title: document.title,
      h1: [...document.querySelectorAll("h1")].map((e) => e.textContent),
      lang: document.documentElement.lang,
      canon: [...document.querySelectorAll("link[rel=canonical]")].map(
        (e) => e.href,
      ),
      descriptions: document.querySelectorAll("meta[name=description]").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    results.push({ route, ...data });
    assert.equal(data.h1.length, 1, route);
    assert.equal(data.canon.length, 1, route);
    assert.equal(data.descriptions, 1, route);
    const file =
      route === "/" ? "home" : route.split("/").filter(Boolean).join("-");
    await page.screenshot({
      path: "/tmp/onesta-seo-" + file + "-desktop.png",
      fullPage: false,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "/tmp/onesta-seo-" + file + "-mobile.png",
      fullPage: false,
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.goto("http://localhost:3100/nieruchomosci/hiszpania");
  const propertyHref = await page
    .locator('a[href*="?id="]')
    .first()
    .getAttribute("href");
  await page.goto("http://localhost:3100" + propertyHref, {
    waitUntil: "networkidle",
  });
  const prop = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps.propertyFromSupabase,
  );
  assert.ok(prop.external_id);
  assert.equal(await page.locator("h1").count(), 1);
  await page.screenshot({ path: "/tmp/onesta-seo-offer-desktop.png" });
  const form = page
    .locator("form")
    .filter({ has: page.locator('input[name="email"]') })
    .filter({ visible: true })
    .first();
  await form.locator('input[name="name"]').fill("SEO TEST");
  await form.locator('input[name="phone"]').fill("000000000");
  await form.locator('input[name="email"]').fill("seo-test@example.invalid");
  await form.locator("input[type=checkbox]").first().check();
  let payload;
  await page.route("**/api/formFromProperty", async (r) => {
    payload = r.request().postDataJSON();
    await r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: 200 }),
    });
  });
  await form.locator("button").last().click();
  await page.waitForTimeout(300);
  assert.equal(payload.id, prop.external_id);
  assert.equal(payload.ref, prop.external_id);
  assert.equal(payload.consents.rodo, true);
  const conversion = await page.evaluate(() =>
    window.dataLayer.filter((e) => e.event === "google_ads_contact_conversion"),
  );
  assert.equal(conversion.length, 1);
  assert.equal(conversion[0].property_id, prop.external_id);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "/tmp/onesta-seo-offer-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3100/en/properties/hiszpania/costa-calida");
  await page
    .getByRole("button", { name: "Arrange a consultation", exact: true })
    .click();
  await page.getByLabel("Full name", { exact: true }).fill("SEO TEST");
  await page.getByLabel("Phone number", { exact: true }).fill("000000000");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("seo-test@example.invalid");
  const cf = page
    .locator("form")
    .filter({ has: page.getByLabel("Full name", { exact: true }) });
  await cf.locator("input[type=checkbox]").first().check();
  let consultation;
  await page.route("**/api/consultation", async (r) => {
    consultation = r.request().postDataJSON();
    await r.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });
  await cf.getByRole("button", { name: "Send request" }).click();
  await page.waitForTimeout(300);
  assert.match(consultation.msg, /Costa Cálida/);
  assert.ok(
    await page.getByText("Thank you! We will contact you soon.").isVisible(),
  );
  // Both same-slug records must agree in SSR, DOM and the mocked form.
  for (const id of ["MTI-3226-115-10-115", "MTI-3263-115-10-115"]) {
    await page.goto(
      "http://localhost:3100/nieruchomosci/hiszpania/apartament-w-torrevieja?id=" +
        id,
      { waitUntil: "networkidle" },
    );
    const record = await page.evaluate(
      () => window.__NEXT_DATA__.props.pageProps.propertyFromSupabase,
    );
    assert.equal(record.external_id, id);
    assert.ok((await page.title()).includes(id));
    assert.ok(
      (await page.locator("link[rel=canonical]").getAttribute("href")).endsWith(
        "?id=" + id,
      ),
    );
    const f = page
      .locator("form")
      .filter({ has: page.locator('input[name="email"]') })
      .filter({ visible: true })
      .first();
    await f.locator('input[name="name"]').fill("SEO TEST");
    await f.locator('input[name="phone"]').fill("000000000");
    await f.locator('input[name="email"]').fill("seo-test@example.invalid");
    await f.locator("input[type=checkbox]").first().check();
    await f.locator("button").last().click();
    await page.waitForTimeout(200);
    assert.equal(payload.id, id);
  }
  // Same-template client navigation must reset any form/description/gallery state.
  const currentForm = page
    .locator("form")
    .filter({ has: page.locator('input[name="email"]') })
    .filter({ visible: true })
    .first();
  await currentForm.locator('input[name="name"]').fill("PREVIOUS RECORD");
  await page.evaluate(() =>
    window.next.router.push(
      "/nieruchomosci/hiszpania/apartament-w-torrevieja?id=MTI-3226-115-10-115",
    ),
  );
  await page.waitForFunction(() =>
    document.title.includes("MTI-3226-115-10-115"),
  );
  assert.equal(
    await page
      .locator("form")
      .filter({ visible: true })
      .first()
      .locator('input[name="name"]')
      .inputValue(),
    "",
  );
  await page.evaluate(() =>
    window.next.router.push(
      "/nieruchomosci/hiszpania/apartament-w-torrevieja?id=MTI-3263-115-10-115",
    ),
  );
  await page.waitForFunction(() =>
    document.title.includes("MTI-3263-115-10-115"),
  );
  await page.getByRole("button", { name: "Zmień język", exact: true }).hover();
  await page
    .locator('header a[href^="/en/properties/"]')
    .filter({ hasText: "EN" })
    .first()
    .click();
  await page.waitForURL((u) => u.pathname.startsWith("/en/properties/"));
  await page.waitForFunction(() => document.documentElement.lang === "en");
  assert.ok((await page.title()).includes("MTI-3263-115-10-115"));
  await page.locator('img[alt="Apartment in Torrevieja"]').first().click();
  const gallery = page.getByRole("dialog", {
    name: "Property gallery",
    exact: true,
  });
  assert.ok(await gallery.isVisible());
  await gallery.locator("img").first().click();
  const photos = page.getByRole("dialog", {
    name: "Property photos",
    exact: true,
  });
  assert.ok(await photos.isVisible());
  const galleryForm = photos.locator("form");
  await galleryForm.locator('input[name="name"]').fill("SEO TEST");
  await galleryForm.locator('input[name="phone"]').fill("000000000");
  await galleryForm
    .locator('input[name="email"]')
    .fill("seo-test@example.invalid");
  await galleryForm
    .getByRole("button", { name: "SEND MESSAGE", exact: true })
    .click();
  await page.waitForTimeout(200);
  assert.equal(payload.id, "MTI-3263-115-10-115");
  await photos.getByText("Back to gallery", { exact: true }).click();
  await gallery
    .getByRole("button", { name: "Back to listing", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("dialog", { name: "Property gallery", exact: true })
      .count(),
    0,
  );
  await page.goto("http://localhost:3100/en/properties/hiszpania");
  await page
    .getByRole("button", { name: "TOP 10 offers", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Send me the TOP 10 properties", exact: true })
    .click();
  const recommended = page.getByRole("dialog");
  await recommended.getByLabel("Maximum budget (€)").fill("250000");
  await recommended
    .getByLabel("Email address", { exact: true })
    .fill("seo-test@example.invalid");
  await recommended.locator('input[name="rodoConsent"]').check();
  let recommendedPayload;
  await page.route("**/api/sendRecommendedOffers", async (r) => {
    recommendedPayload = r.request().postDataJSON();
    await r.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });
  await recommended
    .getByRole("button", { name: "Send and receive the TOP 10", exact: true })
    .click();
  await page.waitForTimeout(200);
  assert.equal(recommendedPayload.rodoConsent, true);
  assert.equal(recommendedPayload.marketingConsent, false);
  // Sort resets pagination and keeps the coast/city route.
  await page.goto(
    "http://localhost:3100/nieruchomosci/hiszpania/costa-blanca/torrevieja?page=2",
  );
  await page
    .locator("select")
    .filter({ has: page.locator('option[value="price_desc"]') })
    .selectOption("price_desc");
  await page.waitForURL(
    (u) =>
      u.pathname.endsWith("/costa-blanca/torrevieja") &&
      u.searchParams.get("sort") === "price_desc" &&
      !u.searchParams.has("page"),
  );
  const sorted = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps,
  );
  assert.equal(sorted.citySlug, "torrevieja");
  assert.ok(sorted.properties.every((p) => p.town === "Torrevieja"));
  fs.writeFileSync(
    "/tmp/onesta-seo-browser-results.json",
    JSON.stringify(
      {
        results,
        errors,
        propertyHref,
        form: { id: payload.id, ref: payload.ref, consents: payload.consents },
        consultationContext: consultation.msg,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      pages: results.length,
      errors,
      propertyHref,
      forms: "mocked OK",
    }),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
