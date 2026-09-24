import locations from "@/data/locations.json";
import { buildCatalogUrl, catalogRoutePath, PROPERTY_TYPES } from "./catalogRouting";
import { getCanonicalLocations, getLocationCountry, type LocationEntry } from "./locations";
import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
import { SEO_CITIES, SEO_REGIONS } from "./seoLocations";
import { slugify } from "./publicSeo";
import type { SiteLocale } from "./i18n";

const canonicalLocations = getCanonicalLocations(locations as LocationEntry[]);

export const navigationCountries = [...PROPERTY_COUNTRY_OPTIONS]
  .filter((country) => country.seoEnabled)
  .sort((a, b) => Number(b.slug === "hiszpania") - Number(a.slug === "hiszpania"))
  .map((country) => ({
    ...country,
    regions: canonicalLocations
      .filter((location) => location.type === "coast" && getLocationCountry(location) === country.slug)
      .map((region) => ({
        ...region,
        name: SEO_REGIONS.find((item) => item.locationId === region.id)?.name || region.name,
        towns: canonicalLocations
          .filter((location) => location.parentId === region.id && ["town", "city"].includes(location.type))
          .sort((a, b) => a.name.localeCompare(b.name, "pl")),
      })),
  }));

export const navigationPropertyTypes = PROPERTY_TYPES.filter((type) => type.seoEnabled);

export function navigationLocationHref(country: string, location: LocationEntry, locale: SiteLocale) {
  // Use published city landings where available; other places retain the search's location IDs.
  const region = SEO_REGIONS.find((item) => item.country === country && item.locationId === location.parentId);
  const city = region && SEO_CITIES.find((item) => item.region === region.slug && item.aliases.some((alias) => slugify(alias) === slugify(location.name)));
  if (region && city) return catalogRoutePath({ country, region: region.slug, city: city.slug }, locale);
  return buildCatalogUrl(country, { location: location.id }, locale)!;
}

export function navigationRegionLabel(name: string, locale: SiteLocale) {
  if (name === "Cypr Południowy" && locale === "en") return "Southern Cyprus";
  if (name === "Mallorca" && locale === "pl") return "Majorka";
  return name;
}
