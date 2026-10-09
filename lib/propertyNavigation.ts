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
// Ordered by expected demand: this order is the server-rendered fallback
// until live offer counts re-rank the list in the browser.
const MENU_TOWNS: Record<string, string[]> = {
  costa_blanca: [
    "Torrevieja", "Orihuela Costa", "Alicante", "Calpe", "Benidorm", "Guardamar del Segura",
    "Javea", "Denia", "Altea", "Finestrat", "Santa Pola", "Pilar de la Horadada",
    "Ciudad Quesada", "San Miguel de Salinas", "Villamartin", "La Zenia", "Gran Alacant",
  ],
  costa_calida: [
    "San Pedro del Pinatar", "Los Alcazares", "Torre Pacheco", "San Javier", "Cartagena",
    "La Manga del Mar Menor", "Mazarron", "Aguilas", "Murcia",
  ],
  costa_del_sol: [
    "Marbella", "Estepona", "Mijas", "Fuengirola", "Benahavis", "Malaga", "Benalmadena",
    "Manilva", "Torremolinos", "Casares", "Nerja",
  ],
  costa_de_almeria: ["Vera", "Pulpi", "San Juan de los Terreros", "Mojacar", "Cuevas del Almanzora"],
  costa_brava: [],
  mallorca: ["Palma de Mallorca", "Calvia", "Puerto de Andratx"],
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

// ---- Mega-menu v2 (09.10.2026): flat panel, towns ranked by live offer counts ----

/** Spanish coasts shown side by side in the desktop panel. */
export const MENU_COASTS = ["costa_blanca", "costa_del_sol", "costa_calida", "costa_de_almeria"];
export const MENU_TOWNS_LIMIT = 8;

const canonicalById = new Map(canonicalLocations.map((location) => [location.id, location]));
export const menuLocationById = (id: string) => canonicalById.get(id);

/** Every canonical town of a coast — candidates ranked by /api/menu-locations. */
export function menuTownCandidates(coastId: string) {
  return canonicalLocations.filter(
    (location) => location.parentId === coastId && ["town", "city"].includes(location.type),
  );
}

export type MenuTown = { id: string; name: string; count: number | null };

/** Server-rendered fallback (no counts) until live counts arrive in the browser. */
export function staticMenuTowns(coastId: string): MenuTown[] {
  return curatedMenuTowns(coastId, menuTownCandidates(coastId))
    .slice(0, MENU_TOWNS_LIMIT)
    .map((town) => ({ id: town.id, name: town.name, count: null }));
}

// ---- Context-aware menu: Spanish pages show Spain, Cypriot pages Cyprus, the rest all countries ----
export type MenuScope = "hiszpania" | "cypr" | "all";
export const MENU_COUNTRY_COASTS: Record<"hiszpania" | "cypr", string[]> = {
  hiszpania: MENU_COASTS,
  cypr: ["cypr_poludniowy"],
};

export function menuScope(path: string): MenuScope {
  const p = (path || "/").split(/[?#]/)[0].toLowerCase();
  if (/^\/(nieruchomosci\/hiszpania|en\/properties\/spain|polskie-biuro-nieruchomosci-w-hiszpanii|zarzadzanie-nieruchomosciami-w-hiszpanii)(\/|$)/.test(p)) return "hiszpania";
  if (/^\/(nieruchomosci\/cypr|en\/properties\/cyprus)(\/|$)/.test(p)) return "cypr";
  return "all";
}
