import { countryMetadata, catalogPath, publicCountry } from "./publicSeo";
import { findRegion, findCity } from "./seoLocations";
import {
  catalogRoutePath,
  PROPERTY_TYPES,
  type CatalogRoute,
} from "./catalogRouting";
import type { SiteLocale } from "./i18n";

export type LandingContent = {
  title: string;
  metaDescription: string;
  h1: string;
  intro?: string;
  bottomContent?: string;
  canonical?: string;
};
export const landingKey = (route: CatalogRoute) =>
  [
    publicCountry(route.country)?.seoSlug || route.country,
    route.region || "",
    route.propertyType || "",
    route.city || "",
  ].join("/");
// Editorial overrides, e.g. "spain/costa-blanca/apartments/": { pl: {...}, en: {...} }.
// Canonical overrides are local absolute paths, never query-filter URLs.
export const SEO_LANDING_CONFIG: Record<
  string,
  Partial<Record<SiteLocale, Partial<LandingContent>>>
> = {};
export function landingContent(
  route: CatalogRoute,
  locale: SiteLocale,
): LandingContent {
  const base = countryMetadata(route.country, locale);
  const region = findRegion(route.region);
  const city = findCity(route.region, route.city);
  const type = PROPERTY_TYPES.find((t) => t.slug === route.propertyType);
  const place = city?.name || region?.name;
  const h1 = type
    ? `${type.label[locale]} — ${place || (locale === "en" ? publicCountry(route.country)?.englishLabel : publicCountry(route.country)?.label)}`
    : place
      ? locale === "en"
        ? `Property for sale in ${place}`
        : `Nieruchomości ${place} na sprzedaż`
      : base.h1;
  return {
    h1,
    title: `${h1} | Onesta`,
    metaDescription:
      city?.intro[locale] || region?.copy[locale].intro || base.description,
    ...SEO_LANDING_CONFIG[landingKey(route)]?.[locale],
  };
}
export function catalogBreadcrumbs(route: CatalogRoute, locale: SiteLocale) {
  const country = publicCountry(route.country)!;
  const items = [
    {
      name: locale === "en" ? "Properties" : "Nieruchomości",
      path: locale === "en" ? "/en/properties" : "/nieruchomosci",
    },
    {
      name: locale === "en" ? country.englishLabel : country.label,
      path: catalogPath(route.country, locale),
    },
  ];
  if (route.region)
    items.push({
      name: findRegion(route.region)!.name,
      path: catalogPath(route.country, locale, route.region),
    });
  if (route.city)
    items.push({
      name: findCity(route.region, route.city)!.name,
      path: catalogRoutePath(route, locale),
    });
  if (route.propertyType)
    items.push({
      name: PROPERTY_TYPES.find((t) => t.slug === route.propertyType)!.label[
        locale
      ],
      path: catalogRoutePath(route, locale),
    });
  return items;
}
