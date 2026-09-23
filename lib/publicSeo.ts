import { propertyTypeLabel, type SiteLocale } from "./i18n";
import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
import { validTitleOrEmpty } from "./titlesDictionary";

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
      c.dbValues.some((v) => v.toLowerCase() === String(value).toLowerCase()),
  );
}
export function catalogPath(
  country: string,
  locale: SiteLocale = "pl",
  region?: string,
  city?: string,
) {
  return `${locale === "en" ? "/en/properties" : "/nieruchomosci"}/${country}${region ? "/" + region : ""}${city ? "/" + city : ""}`;
}
export function propertyTitle(property: any, locale: SiteLocale = "pl") {
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
export function propertyPath(property: any, locale: SiteLocale = "pl") {
  const country = publicCountry(property.country);
  if (!country || !property.external_id) return null;
  return `${catalogPath(country.slug, locale)}/${slugify(propertyTitle(property, locale))}?id=${encodeURIComponent(String(property.external_id))}`;
}
export function canonicalCatalog(path: string, query: Record<string, any>) {
  const params = new URLSearchParams();
  for (const key of [...FILTER_KEYS, "page"].sort()) {
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
export function propertyMetadata(property: any, locale: SiteLocale = "pl") {
  const name = propertyTitle(property, locale);
  const details = [name];
  if (Number(property.surface_built) > 0)
    details.push(`${property.surface_built} m²`);
  if (property.beds !== null && property.beds !== undefined)
    details.push(
      locale === "en"
        ? `Bedrooms: ${property.beds}`
        : `Sypialnie: ${property.beds}`,
    );
  if (property.pool === true) details.push(locale === "en" ? "Pool" : "Basen");
  // Feed does not distinguish project starting prices from individual-unit prices.
  // Leave price out of metadata until that distinction is explicit in the data.
  return {
    title: `${name}${Number(property.surface_built) > 0 ? ", " + property.surface_built + " m²" : ""} · ${property.external_id} | Onesta`,
    description: `${details.join(". ")}. ${locale === "en" ? "View photos and contact Onesta about this property." : "Zobacz zdjęcia i zapytaj Onesta o tę nieruchomość."}`,
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
