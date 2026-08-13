type FilterQuery = Record<string, string | string[] | undefined>;

type ListingFilterOption = {
  label: string;
  value: string;
};

type CoastFilterOption = ListingFilterOption & {
  country: string;
};

export const ONESARI_COUNTRY_FILTERS: ListingFilterOption[] = [
  { label: "Hiszpania", value: "spain" },
  { label: "Cypr", value: "cyprus" },
  { label: "Dominikana", value: "dominican_republic" },
];

export const ONESARI_COAST_FILTERS: CoastFilterOption[] = [
  { country: "spain", label: "Costa Blanca", value: "costa_blanca" },
  { country: "spain", label: "Costa Cálida", value: "costa_calida" },
  { country: "spain", label: "Costa del Sol", value: "costa_del_sol" },
  { country: "spain", label: "Costa de Almería", value: "costa_de_almeria" },
  { country: "spain", label: "Costa Azahar / Valencia", value: "costa_azahar" },
  { country: "spain", label: "Costa de la Luz", value: "costa_de_la_luz" },
  { country: "cyprus", label: "Cypr Południowy", value: "south_cyprus" },
  { country: "dominican_republic", label: "Samaná", value: "samana" },
];

const countryDatabaseValues: Record<string, string[]> = {
  spain: ["Spain", "SPAIN", "Hiszpania", "HISZPANIA"],
  cyprus: ["Cypr", "CYPR", "Cyprus", "CYPRUS"],
  dominican_republic: [
    "Dominikana",
    "DOMINIKANA",
    "Dominican Republic",
    "DOMINICAN REPUBLIC",
  ],
};

const coastDatabaseValues: Record<string, string[]> = {
  costa_blanca: ["Alicante", "ALICANTE", "Costa Blanca", "COSTA BLANCA"],
  costa_calida: ["Murcia", "MURCIA", "Costa Calida", "Costa Cálida", "COSTA CALIDA"],
  costa_del_sol: ["Malaga", "Málaga", "MALAGA", "MÁLAGA", "Costa del Sol", "COSTA DEL SOL"],
  costa_de_almeria: [
    "Almeria",
    "Almería",
    "ALMERIA",
    "ALMERÍA",
    "Costa de Almeria",
    "Costa de Almería",
  ],
  costa_azahar: [
    "Castellon",
    "Castellón",
    "CASTELLON",
    "CASTELLÓN",
    "Valencia",
    "VALENCIA",
    "Costa Azahar",
    "Costa de Valencia",
  ],
  costa_de_la_luz: ["Cadiz", "Cádiz", "CADIZ", "CÁDIZ", "Costa de la Luz"],
  south_cyprus: ["Cypr Południowy", "CYPR POŁUDNIOWY", "South Cyprus"],
  samana: ["Samana", "Samaná", "SAMANA", "SAMANÁ"],
};

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function normalizedSearchValue(value: string | string[] | undefined) {
  return firstQueryValue(value)
    .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function normalizedPrice(value: string | string[] | undefined) {
  const normalized = firstQueryValue(value).trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const price = Number(normalized);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function applyOnesariListingFilters<T>(query: T, requestQuery: FilterQuery): T {
  let filteredQuery: any = query;
  const search = normalizedSearchValue(requestQuery.q);
  const country = firstQueryValue(requestQuery.country);
  const coast = firstQueryValue(requestQuery.coast);
  const minPrice = normalizedPrice(requestQuery.minPrice);
  const maxPrice = normalizedPrice(requestQuery.maxPrice);

  if (search) {
    const searchPattern = `%${search}%`;
    filteredQuery = filteredQuery.or(
      [
        `title.ilike.${searchPattern}`,
        `town.ilike.${searchPattern}`,
        `province.ilike.${searchPattern}`,
        `country.ilike.${searchPattern}`,
        `ref.ilike.${searchPattern}`,
        `external_id.ilike.${searchPattern}`,
        `type.ilike.${searchPattern}`,
      ].join(","),
    );
  }

  if (countryDatabaseValues[country]) {
    filteredQuery = filteredQuery.in("country", countryDatabaseValues[country]);
  }

  if (coastDatabaseValues[coast]) {
    filteredQuery = filteredQuery.in("province", coastDatabaseValues[coast]);
  }

  if (minPrice !== null) {
    filteredQuery = filteredQuery.gte("price", minPrice);
  }

  if (maxPrice !== null) {
    filteredQuery = filteredQuery.lte("price", maxPrice);
  }

  return filteredQuery as T;
}
