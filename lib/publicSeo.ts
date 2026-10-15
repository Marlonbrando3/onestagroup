import { propertyTypeLabel, type SiteLocale } from "./i18n";
import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
import { validTitleOrEmpty } from "./titlesDictionary";
import { descriptiveTitle, developmentTitle } from "./offerTitle";

export const SITE_URL = "https://onesta.com.pl";
export const FILTER_KEYS = [
  "type",
  "region",
  "market",
  "baths",
  "bathsMin",
  "bathsMax",
  "beds",
  "bedsMin",
  "bedsMax",
  "priceMin",
  "priceMax",
  "location",
  "sort",
  "minPrice",
  "maxPrice",
  "pool",
];
export function slugify(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
export function publicCountry(value: unknown) {
  return PROPERTY_COUNTRY_OPTIONS.find(
    (c) =>
      c.slug === value ||
      c.seoSlug === value ||
      c.dbValues.some((v) => v.toLowerCase() === String(value).toLowerCase()),
  );
}
export function catalogPath(
  country: string,
  locale: SiteLocale = "pl",
  region?: string,
  city?: string,
) {
  const option = publicCountry(country);
  // Existing city and detail URLs retain their identity.
  if (city)
    return `${locale === "en" ? "/en/properties" : "/nieruchomosci"}/${option?.slug || country}/${region}/${city}`;
  return `${locale === "en" ? "/en/properties/" + (option?.seoSlug || country) : "/nieruchomosci/" + (option?.slug || country)}${region ? "/" + region : ""}`;
}
/** Title used ONLY for URL slugs — kept on the original formula so offer URLs never change. */
export function propertySlugTitle(property: any, locale: SiteLocale = "pl") {
  const type =
    propertyTypeLabel[locale][property.type] ||
    (locale === "en" ? "Property" : "Nieruchomość");
  const country = publicCountry(property.country)?.slug;
  const place =
    property.town ||
    (locale === "en"
      ? country === "cypr"
        ? "in Cyprus"
        : "in Spain"
      : country === "cypr"
        ? "na Cyprze"
        : "w Hiszpanii");
  return (
    (locale === "pl"
      ? validTitleOrEmpty(property.title) ||
        validTitleOrEmpty(property.headerAdvertisement)
      : "") ||
    `${type}${property.town ? (locale === "en" ? " in " : " w ") : " "}${place}`
  );
}
/** Visible offer title (H1, cards, <title>, JSON-LD). Never used for URLs. */
export function propertyTitle(property: any, locale: SiteLocale = "pl") {
  if (property?.dev_title) return developmentTitle(property, property.dev_title, locale);
  const feedTitle =
    locale === "pl"
      ? validTitleOrEmpty(property.title) || validTitleOrEmpty(property.headerAdvertisement)
      : "";
  return feedTitle || descriptiveTitle(property, locale);
}
export function propertyPath(property: any, locale: SiteLocale = "pl") {
  const country = publicCountry(property.country);
  if (!country || !property.external_id) return null;
  return `${locale === "en" ? "/en/properties" : "/nieruchomosci"}/${country.slug}/${slugify(propertySlugTitle(property, locale))}?id=${encodeURIComponent(String(property.external_id))}`;
}
export function canonicalCatalog(path: string, query: Record<string, any>) {
  const params = new URLSearchParams();
  for (const key of ["page"]) {
    const value = query[key];
    if (
      value === undefined ||
      value === "" ||
      (key === "page" && String(value) === "1")
    )
      continue;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  return SITE_URL + path + (params.size ? "?" + params.toString() : "");
}
export function hasFilters(query: Record<string, any>) {
  return FILTER_KEYS.some(
    (key) => query[key] !== undefined && query[key] !== "",
  );
}
function plPlural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const d = n % 10,
    t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
}
export function propertyMetadata(property: any, locale: SiteLocale = "pl") {
  const en = locale === "en";
  const name = propertyTitle(property, locale);
  const surface = Number(property.surface_built);
  const beds = Number(property.beds);
  const baths = Number(property.baths);
  const details: string[] = [];
  if (surface > 0) details.push(`${surface} m²`);
  // 0 in the feed means studio OR missing data, so it is omitted instead of
  // printing "Sypialnie: 0" in search results.
  if (beds > 0)
    details.push(
      en
        ? `${beds} bedroom${beds === 1 ? "" : "s"}`
        : `${beds} ${plPlural(beds, "sypialnia", "sypialnie", "sypialni")}`,
    );
  if (baths > 0)
    details.push(
      en
        ? `${baths} bathroom${baths === 1 ? "" : "s"}`
        : `${baths} ${plPlural(baths, "łazienka", "łazienki", "łazienek")}`,
    );
  if (property.pool === true) details.push(en ? "pool" : "basen");
  if (property.new_build === true)
    details.push(en ? "new build" : "rynek pierwotny");
  const lead = en ? `${name} for sale` : `${name} na sprzedaż`;
  // Feed does not distinguish project starting prices from individual-unit prices.
  // Leave price out of metadata until that distinction is explicit in the data.
  return {
    title: `${name}${surface > 0 ? ", " + surface + " m²" : ""} · ${property.external_id} | Onesta`,
    description: `${lead}${details.length ? ": " + details.join(", ") : ""}. ${en ? "0% buyer's commission. View photos and ask Onesta about this property." : "0% prowizji dla kupującego. Zobacz zdjęcia i zapytaj Onesta o tę nieruchomość."}`,
  };
}
export function countryMetadata(country: string, locale: SiteLocale = "pl") {
  const en = locale === "en",
    spain = country === "hiszpania";
  const h1 = en
    ? `Property for sale in ${spain ? "Spain" : "Cyprus"}`
    : `Nieruchomości ${spain ? "w Hiszpanii" : "na Cyprze"} na sprzedaż`;
  const description = en
    ? spain
      ? "Explore apartments and houses for sale in Spain on the Costa Blanca, Costa del Sol, Costa Cálida and Almería coast. Get buying support from Onesta."
      : "Explore apartments and houses for sale in Cyprus. Compare locations, prices and property features, with support from Onesta throughout your purchase."
    : spain
      ? "Nieruchomości w Hiszpanii na sprzedaż: apartamenty, mieszkania, domy i wille na Costa Blanca, Costa del Sol, Costa Cálida i Costa de Almería. Sprawdź aktualne oferty."
      : "Przeglądaj apartamenty i domy na Cyprze. Porównaj lokalizacje, ceny i parametry ofert. Skorzystaj ze wsparcia Onesta przy wyborze i zakupie.";
  return { h1, title: `${h1} | Onesta`, description };
}
/**
 * Public catalogue/offer pages: browsers revalidate, Netlify's CDN keeps the page for
 * `seconds` and serves it stale while refreshing in the background. The cache key
 * includes the query string (filters, page, ?id=), so different offers never share an entry.
 * Never use on pages with private data (agent, CRM, client lists).
 */
export function publicCache(res: any, seconds: number, staleSeconds = seconds * 24) {
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("CDN-Cache-Control", `public, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  res.setHeader(
    "Netlify-CDN-Cache-Control",
    `public, durable, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`,
  );
  res.setHeader("Netlify-Vary", "query");
}
export function noStore(res: any) {
  res.setHeader(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Netlify-CDN-Cache-Control", "no-store");
}
export function preservedQuery(
  path: string,
  query: Record<string, any>,
  omit: string[] = [],
) {
  const url = new URL(path, SITE_URL);
  for (const [key, value] of Object.entries(query)) {
    if (
      ["country", "title", "city", "id", ...omit].includes(key) ||
      value === undefined
    )
      continue;
    for (const entry of Array.isArray(value) ? value : [value])
      url.searchParams.append(key, String(entry));
  }
  return url.pathname + url.search;
}
