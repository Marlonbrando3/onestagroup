import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { OutfitSans } from "@/fonts/fonts";
import { MultiSelect } from "./SearchEngine/MultiSearch";
import LocationSearch from "./SearchEngine/LocationSearch";
import PriceSelect from "./SearchEngine/PriceSearch";
import locationsData from "@/data/locations.json";

type LocationItem = {
  id: string;
  name: string;
  type: "coast" | "province" | "city";
  parentId: string | null;
};

type PriceRange = { min: number; max: number };

type FiltersState = {
  locations: LocationItem[];
  type: string[];
  bedrooms: string[];
  bathrooms: string[];
  price: PriceRange;
};

type Props = {
  handleShowMobileFilters: any;
  searchEngine: any;
  mobileButtonSearchEngine: any;
  loader: any;
  setLoader: any;
};

const DEFAULT_PRICE: PriceRange = { min: 0, max: 5000000 };
const NUMBER_OPTIONS = ["1", "2", "3", "4", "5"];

const TYPE_LABEL_TO_DB: Record<string, string> = {
  Apartament: "apartment",
  Bungalow: "bungalow",
  Szeregówka: "townhouse",
  Dom: "villa",
};

const TYPE_DB_TO_LABEL: Record<string, string> = {
  apartment: "Apartament",
  bungalow: "Bungalow",
  townhouse: "Szeregówka",
  villa: "Dom",
};

export default function Home({
  mobileButtonSearchEngine,
  searchEngine,
  loader,
  setLoader,
}: Props) {
  const router = useRouter();
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    locations: [],
    type: [],
    bedrooms: [],
    bathrooms: [],
    price: DEFAULT_PRICE,
  });

  function slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  const parseCsv = (param: string | string[] | undefined): string[] => {
    const raw = Array.isArray(param) ? param.join(",") : (param ?? "");
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const parseNum = (v: string | string[] | undefined): number | null => {
    const raw = Array.isArray(v) ? v[0] : v;
    if (raw === undefined) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const toCsv = (arr: string[]) => arr.join(",");

  const buildQueryFromFilters = (next: FiltersState) => {
    const q: Record<string, string> = {};

    if (router.query.region) {
      q.region = Array.isArray(router.query.region)
        ? router.query.region[0]
        : String(router.query.region);
    }

    if (next.locations.length) {
      q.location = next.locations.map((l) => l.id).join(",");
    }

    if (next.type.length) {
      const dbTypes = next.type
        .map((label) => TYPE_LABEL_TO_DB[label])
        .filter(Boolean);
      if (dbTypes.length) q.type = toCsv(dbTypes);
    }

    if (next.bedrooms.length === 1) {
      q.bedsMin = next.bedrooms[0];
      q.bedsMax = next.bedrooms[0];
    } else if (next.bedrooms.length > 1) {
      q.beds = toCsv(next.bedrooms);
    }

    if (next.bathrooms.length === 1) {
      q.bathsMin = next.bathrooms[0];
      q.bathsMax = next.bathrooms[0];
    } else if (next.bathrooms.length > 1) {
      q.baths = toCsv(next.bathrooms);
    }

    if (next.price.min !== DEFAULT_PRICE.min)
      q.priceMin = String(next.price.min);
    if (next.price.max !== DEFAULT_PRICE.max)
      q.priceMax = String(next.price.max);

    return q;
  };

  const pushFiltersToQuery = (next: FiltersState) => {
    const country = slugify((router.query.country as string) || "hiszpania");
    const query = buildQueryFromFilters(next);

    router.push(
      {
        pathname: `/nieruchomosci/${country}/`,
        query,
      },
      undefined,
      { shallow: false, scroll: false },
    );

    setLoader(true);
  };

  const updateFilter = (key: keyof FiltersState, value: any) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
  };

  const handleSearch = () => {
    pushFiltersToQuery(filters);
  };

  useEffect(() => {
    console.log("effec");
    if (!router.isReady) return;

    const typeFromUrl = parseCsv(router.query.type).map(
      (db) => TYPE_DB_TO_LABEL[db.toLowerCase()] ?? db,
    );

    const bedsFromList = parseCsv(router.query.beds);
    const bedsMin = parseNum(router.query.bedsMin);
    const bedsMax = parseNum(router.query.bedsMax);
    const bedrooms =
      bedsFromList.length > 0
        ? bedsFromList
        : bedsMin !== null && bedsMax !== null && bedsMin === bedsMax
          ? [String(bedsMin)]
          : [];

    const bathsFromList = parseCsv(router.query.baths);
    const bathsMin = parseNum(router.query.bathsMin);
    const bathsMax = parseNum(router.query.bathsMax);
    const bathrooms =
      bathsFromList.length > 0
        ? bathsFromList
        : bathsMin !== null && bathsMax !== null && bathsMin === bathsMax
          ? [String(bathsMin)]
          : [];

    const priceMin = parseNum(router.query.priceMin) ?? DEFAULT_PRICE.min;
    const priceMax = parseNum(router.query.priceMax) ?? DEFAULT_PRICE.max;

    const locationIds = parseCsv(router.query.location);
    const locations = locationIds
      .map((id) => (locationsData as any[]).find((l) => l.id === id))
      .filter(Boolean);

    setFilters((prev) => ({
      ...prev,
      locations,
      type: typeFromUrl,
      bedrooms,
      bathrooms,
      price: { min: priceMin, max: priceMax },
    }));
  }, [
    router.isReady,
    router.query.type,
    router.query.beds,
    router.query.bedsMin,
    router.query.bedsMax,
    router.query.baths,
    router.query.bathsMin,
    router.query.bathsMax,
    router.query.priceMin,
    router.query.priceMax,
    router.query.location,
  ]);

  const types = ["Apartament", "Bungalow", "Szeregówka", "Dom"];

  return (
    <div
      id="search-wrapper"
      className={`${OutfitSans.className} mx-auto tracking-[1.2px] w-[90vw] max-w-[1330px] lg:sticky lg:top-[100px] lg:z-30 mb-[30px] -mt-[70px]`}
    >
      {/* MOBILE SEARCH TRIGGER */}
      <button
        onClick={() => setMobileModalOpen(true)}
        className="lg:hidden w-full bg-white rounded-full shadow-lg p-4 flex items-center gap-3 text-gray-500 hover:shadow-xl transition-shadow mt-[50px]"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-left">Wyszukaj</span>
      </button>

      {/* DESKTOP SEARCH BAR */}
      <div className="hidden lg:flex bg-white rounded-full shadow-lg flex-col lg:flex-row gap-0 lg:h-20">
        {/* LOCATION */}
        <div className="w-full lg:flex-[2] h-full lg:border-r border-gray-200 px-4">
          <LocationSearch
            className="w-full h-full"
            value={filters.locations}
            onChange={(val: LocationItem[]) => updateFilter("locations", val)}
          />
        </div>

        {/* ZABUDOWA */}
        <div className="w-full lg:flex-1 h-full lg:border-r border-gray-200 px-4">
          <MultiSelect
            options={types}
            label="Zabudowa"
            value={filters.type}
            onChange={(val) => updateFilter("type", val)}
          />
        </div>

        {/* SYPIALNIE */}
        <div className="w-full lg:flex-1 h-full lg:border-r border-gray-200 px-4">
          <MultiSelect
            options={NUMBER_OPTIONS}
            label="Sypilani"
            value={filters.bedrooms}
            onChange={(val) => updateFilter("bedrooms", val)}
          />
        </div>

        {/* ŁAZIENKI */}
        <div className="w-full lg:flex-1 h-full lg:border-r border-gray-200 px-4">
          <MultiSelect
            options={NUMBER_OPTIONS}
            label="Łazienek"
            value={filters.bathrooms}
            onChange={(val) => updateFilter("bathrooms", val)}
          />
        </div>

        {/* CENA */}
        <div className="w-full lg:flex-1 h-full lg:border-r border-gray-200 px-4">
          <PriceSelect
            value={filters.price}
            onChange={(val: PriceRange) => updateFilter("price", val)}
          />
        </div>

        {/* SEARCH BUTTON */}
        <div className="w-full lg:w-auto h-full flex items-center justify-center px-2">
          <button
            onClick={handleSearch}
            className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MODAL */}
      {mobileModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh]">
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-4 rounded-t-3xl">
              <h2 className="text-xl font-semibold">Search</h2>
              <button
                onClick={() => setMobileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* FILTERS */}
            <div className="p-4 space-y-4">
              {/* LOCATION */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Where?
                </label>
                <LocationSearch
                  className="w-full"
                  value={filters.locations}
                  onChange={(val: LocationItem[]) =>
                    updateFilter("locations", val)
                  }
                />
              </div>

              {/* ZABUDOWA */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zabudowa
                </label>
                <MultiSelect
                  options={types}
                  label="Zabudowa"
                  value={filters.type}
                  onChange={(val) => updateFilter("type", val)}
                />
              </div>

              {/* SYPIALNIE */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sypialnie
                </label>
                <MultiSelect
                  options={NUMBER_OPTIONS}
                  label="Sypilani"
                  value={filters.bedrooms}
                  onChange={(val) => updateFilter("bedrooms", val)}
                />
              </div>

              {/* ŁAZIENKI */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Łazienki
                </label>
                <MultiSelect
                  options={NUMBER_OPTIONS}
                  label="Łazienek"
                  value={filters.bathrooms}
                  onChange={(val) => updateFilter("bathrooms", val)}
                />
              </div>

              {/* CENA */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cena
                </label>
                <PriceSelect
                  value={filters.price}
                  onChange={(val: PriceRange) => updateFilter("price", val)}
                />
              </div>

              {/* SEARCH BUTTON */}
              <button
                onClick={() => {
                  handleSearch();
                  setMobileModalOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
