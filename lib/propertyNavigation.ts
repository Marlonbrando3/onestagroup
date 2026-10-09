import locations from "@/data/locations.json";
import { buildCatalogUrl, catalogRoutePath, PROPERTY_TYPES } from "./catalogRouting";
import { getCanonicalLocations, getLocationCountry, type LocationEntry } from "./locations";
import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
import { SEO_CITIES, SEO_REGIONS } from "./seoLocations";
import { slugify } from "./publicSeo";
import type { SiteLocale } from "./i18n";

const canonicalLocations = getCanonicalLocations(locations as LocationEntry[]);

// SEO: the mega-menu renders on every page. Listing every feed locality (130+ per
// coast, including feed noise) dilutes internal links, so each coast shows a
// curated set of key towns; the full list stays reachable from the catalogue
// filters. Regions without an entry (e.g. Cyprus) keep their complete, short list.
const MENU_TOWNS: Record<string, string[]> = {
  costa_blanca: [
    "Alicante", "Altea", "Benidorm", "Calpe", "Ciudad Quesada", "Denia", "Finestrat",
    "Gran Alacant", "Guardamar del Segura", "Javea", "La Zenia", "Orihuela Costa",
    "Pilar de la Horadada", "San Miguel de Salinas", "Santa Pola", "Torrevieja", "Villamartin",
  ],
  costa_calida: [
    "Aguilas", "Cartagena", "La Manga del Mar Menor", "Los Alcazares", "Mazarron", "Murcia",
    "San Javier", "San Pedro del Pinatar", "Torre Pacheco",
  ],
  costa_del_sol: [
    "Benahavis", "Benalmadena", "Casares", "Estepona", "Fuengirola", "Malaga", "Manilva",
    "Marbella", "Mijas", "Nerja", "Torremolinos",
  ],
  costa_de_almeria: ["Cuevas del Almanzora", "Mojacar", "Pulpi", "San Juan de los Terreros", "Vera"],
  costa_brava: [],
  mallorca: ["Calvia", "Palma de Mallorca", "Puerto de Andratx"],
};

function curatedMenuTowns(regionId: string, towns: LocationEntry[]) {
  const wanted = MENU_TOWNS[regionId];
  if (!wanted) return towns;
  const bySlug = new Map<string, LocationEntry>();
  for (const town of towns) {
    const key = slugify(town.name);
    if (!bySlug.has(key)) bySlug.set(key, town);
  }
  return wanted.map((name) => bySlug.get(slugify(name))).filter((town): town is LocationEntry => Boolean(town));
}

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
        towns: curatedMenuTowns(
          region.id,
          canonicalLocations.filter((location) => location.parentId === region.id && ["town", "city"].includes(location.type)),
        ).sort((a, b) => a.name.localeCompare(b.name, "pl")),
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
