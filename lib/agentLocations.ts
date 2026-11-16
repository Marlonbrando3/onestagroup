import locations from "@/data/locations.json";
import { expandLocationSelection, getLocationCountry, type LocationEntry } from "@/lib/locations";
import { navigationCountries, navigationRegionLabel } from "@/lib/propertyNavigation";
import { slugify } from "@/lib/publicSeo";
import { SEO_CITIES, SEO_REGIONS } from "@/lib/seoLocations";

// Filtr „Regiony i miasta” w panelu agenta — ten sam podział co menu „Oferty” na stronie:
// wybrzeża i ich główne miasta. Miasto obejmuje też okoliczne osiedla z landingów miast
// (np. Orihuela Costa = Playa Flamenca, La Zenia, Cabo Roig…) oraz nazwy typu „Mijas Costa”.

export type AgentTownGroup = { id: string; name: string; names: string[] };
export type AgentCoastGroup = { id: string; name: string; provinces: string[]; towns: AgentTownGroup[] };

const EXTRA_PROVINCES: Record<string, string[]> = {
  mallorca: ["Baleares", "Mallorca", "Majorca"],
  cypr_poludniowy: ["Cypr Południowy"],
};

function buildGroups(): AgentCoastGroup[] {
  const all = locations as LocationEntry[];
  return navigationCountries.flatMap((country) => {
    const countryLocations = all.filter((entry) => getLocationCountry(entry) === country.slug);
    return country.regions.map((region) => {
      const seoRegion = SEO_REGIONS.find((item) => item.locationId === region.id);
      const provinces = [
        ...new Set([...(seoRegion?.provinces || []), ...(EXTRA_PROVINCES[region.id] || []), region.name]),
      ];
      const towns = region.towns.map((town) => {
        const spellings = expandLocationSelection([town.id], countryLocations)
          .filter((entry) => ["town", "city"].includes(entry.type))
          .map((entry) => entry.name);
        const city = SEO_CITIES.find(
          (item) =>
            (!seoRegion || item.region === seoRegion.slug) &&
            // Tylko landing tego samego miasta (np. „Orihuela Costa”), nie osiedle z jego listy (La Zenia).
            slugify(item.name) === slugify(town.name),
        );
        return {
          id: town.id,
          name: town.name,
          names: [...new Set([town.name, ...spellings, ...(city?.aliases || [])])],
        };
      });
      return { id: region.id, name: navigationRegionLabel(region.name, "pl"), provinces, towns };
    });
  });
}

let groupsCache: AgentCoastGroup[] | null = null;
export function agentCoastGroups() {
  return (groupsCache ||= buildGroups());
}

const lower = (value: unknown) => String(value || "").trim().toLowerCase();

// Czy nazwa miejscowości z bazy należy do grupy miasta: dokładnie ta nazwa (bez względu na
// wielkość liter) albo nazwa zaczynająca się od niej i spacji, np. „Mijas Costa”.
export function townInGroup(dbTown: unknown, group: AgentTownGroup) {
  const town = lower(dbTown);
  if (!town) return false;
  return group.names.some((name) => {
    const n = lower(name);
    return town === n || town.startsWith(n + " ");
  });
}

export function coastOfProvince(province: unknown) {
  const value = lower(province);
  return agentCoastGroups().find((coast) => coast.provinces.some((item) => lower(item) === value)) || null;
}

// Warunki do filtra PostgREST (.or): oferta pasuje do któregokolwiek zaznaczonego wybrzeża lub miasta.
export function agentLocationConditions(regionIds: string[], townIds: string[]) {
  const quoted = (value: string) => `"${value.replace(/["\\]/g, "")}"`;
  const groups = agentCoastGroups();
  const conditions: string[] = [];
  for (const coast of groups.filter((item) => regionIds.includes(item.id))) {
    coast.provinces.forEach((province) => conditions.push(`province.ilike.${quoted(province)}`));
  }
  for (const town of groups.flatMap((coast) => coast.towns).filter((item) => townIds.includes(item.id))) {
    town.names.forEach((name) => {
      conditions.push(`town.ilike.${quoted(name)}`);
      conditions.push(`town.ilike.${quoted(name + " %")}`);
    });
  }
  return conditions;
}
