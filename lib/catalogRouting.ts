import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
import { SEO_REGIONS, findCity } from "./seoLocations";
import { catalogPath, publicCountry, slugify } from "./publicSeo";
import type { SiteLocale } from "./i18n";

// Exact imported values (case insensitive), not inferred pluralisation.
// Houses retain the existing search UI's broad house group.
export const PROPERTY_TYPES = [
  {
    slug: "apartments",
    label: { pl: "Apartament", en: "Apartment" },
    dbValues: ["Apartment"],
    seoEnabled: true,
  },
  {
    slug: "houses",
    label: { pl: "Dom", en: "House" },
    dbValues: [
      "casas",
      "Country House",
      "Country House Penthouse",
      "Town House",
      "Town House Penthouse",
      "townhouse",
      "Villa",
      "Villa Penthouse",
    ],
    seoEnabled: true,
  },
  {
    slug: "villas",
    label: { pl: "Willa", en: "Villa" },
    dbValues: ["Villa"],
    seoEnabled: true,
  },
  {
    slug: "penthouses",
    label: { pl: "Penthouse", en: "Penthouse" },
    dbValues: ["Penthouse", "Apartment Penthouse", "Penthouse Penthouse"],
    seoEnabled: true,
  },
  {
    slug: "bungalows",
    label: { pl: "Bungalow", en: "Bungalow" },
    dbValues: ["Bungalow"],
    seoEnabled: true,
  },
  {
    slug: "townhouses",
    label: { pl: "Dom szeregowy", en: "Townhouse" },
    dbValues: ["townhouse", "Town House"],
    seoEnabled: true,
  },
  {
    slug: "fincas",
    label: { pl: "Posiadłość", en: "Finca" },
    dbValues: ["Finca"],
    seoEnabled: true,
  },
  // Keep the former broad Apartment choice available without assigning it a landing.
  {
    slug: "apartment-variants",
    label: {
      pl: "Apartament (wszystkie warianty)",
      en: "Apartment (all variants)",
    },
    dbValues: [
      "Apartment",
      "Quad House",
      "Semi Detached",
      "Apartment Penthouse",
    ],
    seoEnabled: false,
  },
  {
    slug: "imported-apartament",
    label: { pl: "Apartament (import)", en: "Apartment (import)" },
    dbValues: ["apartament"],
    seoEnabled: false,
  },
  {
    slug: "imported-dom",
    label: { pl: "Dom (import)", en: "House (import)" },
    dbValues: ["dom"],
    seoEnabled: false,
  },
  {
    slug: "quad-houses",
    label: { pl: "Quad House", en: "Quad House" },
    dbValues: ["Quad House"],
    seoEnabled: false,
  },
  {
    slug: "semi-detached",
    label: { pl: "Semi Detached", en: "Semi Detached" },
    dbValues: ["Semi Detached"],
    seoEnabled: false,
  },
  {
    slug: "quad-villas",
    label: { pl: "Quad Villa", en: "Quad Villa" },
    dbValues: ["Quad Villa"],
    seoEnabled: false,
  },
  {
    slug: "other",
    label: { pl: "Nieruchomość", en: "Property" },
    dbValues: ["shop", "null"],
    seoEnabled: false,
  },
];
export type CatalogRoute = {
  country: string;
  region?: string;
  propertyType?: string;
  city?: string;
};
export type CatalogQuery = Record<string, string | string[] | undefined>;
export const csv = (value: CatalogQuery[string]) =>
  (Array.isArray(value) ? value.join(",") : value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
const normalizedSet = (values: string[]) =>
  [...new Set(values.map((v) => v.toLowerCase()))].sort().join(",");
export const typeForQuery = (value: CatalogQuery[string]) => {
  const values = csv(value);
  return (
    PROPERTY_TYPES.find(
      (t) => normalizedSet(t.dbValues) === normalizedSet(values),
    ) ||
    PROPERTY_TYPES.find(
      (t) =>
        values.length === 1 &&
        !t.dbValues.some((v) => v.toLowerCase() === values[0].toLowerCase()) &&
        [t.slug, t.label.en, t.label.pl].some(
          (label) => label.toLowerCase() === values[0].toLowerCase(),
        ),
    )
  );
};
export const regionForQuery = (
  country: string,
  value: CatalogQuery[string],
) => {
  const values = csv(value);
  return values.length === 1
    ? SEO_REGIONS.find(
        (r) =>
          r.country === country &&
          [r.slug, r.name, r.locationId].some(
            (v) => slugify(v) === slugify(values[0]),
          ),
      )
    : undefined;
};
export function catalogRoutePath(
  route: CatalogRoute,
  locale: SiteLocale = "pl",
) {
  const base = catalogPath(route.country, locale, route.region, route.city);
  return base + (route.propertyType ? "/" + route.propertyType : "");
}
// Disjoint explicit dictionaries resolve the second segment. Cities keep their existing routes.
export function parseCatalogPath(path: string): CatalogRoute | null {
  const parts = path.split("?")[0].split("/").filter(Boolean);
  if (parts[0] === "en") parts.shift();
  if (!["properties", "nieruchomosci"].includes(parts.shift() || ""))
    return null;
  const country = publicCountry(parts.shift());
  if (!country?.seoEnabled || parts.length > 2) return null;
  if (!parts.length) return { country: country.slug };
  const region = SEO_REGIONS.find(
    (r) => r.country === country.slug && r.seoEnabled && r.slug === parts[0],
  );
  const type = PROPERTY_TYPES.find((t) => t.seoEnabled && t.slug === parts[0]);
  if (type && parts.length === 1)
    return { country: country.slug, propertyType: type.slug };
  if (!region) return null;
  if (parts.length === 1) return { country: country.slug, region: region.slug };
  const lastType = PROPERTY_TYPES.find(
    (t) => t.seoEnabled && t.slug === parts[1],
  );
  if (lastType)
    return {
      country: country.slug,
      region: region.slug,
      propertyType: lastType.slug,
    };
  const city = findCity(region.slug, parts[1]);
  return city
    ? { country: country.slug, region: region.slug, city: city.slug }
    : null;
}
export function queryFromUrl(asPath: string): CatalogQuery {
  const result: CatalogQuery = {};
  new URLSearchParams(asPath.split("?")[1]?.split("#")[0] || "").forEach(
    (v, k) => {
      const previous = result[k];
      result[k] =
        previous === undefined
          ? v
          : [...(Array.isArray(previous) ? previous : [previous]), v];
    },
  );
  return result;
}
export function effectiveCatalogQuery(
  route: CatalogRoute,
  query: CatalogQuery,
): CatalogQuery {
  const result = { ...query, country: route.country };
  if (route.region) {
    delete result.region;
  }
  if (route.propertyType)
    result.type = PROPERTY_TYPES.find(
      (t) => t.slug === route.propertyType,
    )!.dbValues.join(",");
  // Public aliases remain in the visible URL; the existing query engine receives its native keys.
  if (result.minPrice !== undefined) result.priceMin = result.minPrice;
  if (result.maxPrice !== undefined) result.priceMax = result.maxPrice;
  delete result.minPrice;
  delete result.maxPrice;
  return result;
}
export function buildCatalogUrl(
  countryValue: string,
  input: CatalogQuery,
  locale: SiteLocale = "pl",
  scope: Partial<CatalogRoute> = {},
) {
  const country = publicCountry(countryValue);
  if (!country) return null;
  const query = { ...input };
  for (const key of ["country", "title", "city", "catalog", "id"])
    delete query[key];
  const route: CatalogRoute = { ...scope, country: country.slug };
  const region =
    regionForQuery(country.slug, query.region) ||
    regionForQuery(country.slug, query.location);
  if (region?.seoEnabled && !route.city && (!scope.region || scope.region === region.slug)) {
    route.region = region.slug;
    if (regionForQuery(country.slug, query.region)) delete query.region;
    if (regionForQuery(country.slug, query.location)) delete query.location;
  }
  const type = typeForQuery(query.type);
  if (type?.seoEnabled && !route.city && !scope.propertyType) {
    route.propertyType = type.slug;
    delete query.type;
  }
  if (route.region) delete query.region;
  if (route.propertyType) delete query.type;
  if (query.page === "1") delete query.page;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    for (const v of Array.isArray(value) ? value : [value])
      if (v !== undefined && v !== "") params.append(key, v);
  });
  return (
    catalogRoutePath(route, locale) +
    (params.size ? "?" + params.toString() : "")
  );
}
export function seoCatalogRoutes(): CatalogRoute[] {
  return PROPERTY_COUNTRY_OPTIONS.filter((c) => c.seoEnabled).flatMap((c) => {
    const bases: CatalogRoute[] = [
      { country: c.slug },
      ...SEO_REGIONS.filter((r) => r.country === c.slug && r.seoEnabled).map(
        (r) => ({ country: c.slug, region: r.slug }),
      ),
    ];
    return bases.flatMap((base) => [
      base,
      ...PROPERTY_TYPES.filter((t) => t.seoEnabled).map((t) => ({
        ...base,
        propertyType: t.slug,
      })),
    ]);
  });
}
