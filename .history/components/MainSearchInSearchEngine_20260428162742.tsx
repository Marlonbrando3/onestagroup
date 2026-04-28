import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { OutfitSans } from "@/fonts/fonts";
import { MultiSelect } from "./SearchEngine/MultiSearch";
import LocationSearch from "./SearchEngine/LocationSearch";
import PriceSelect from "./SearchEngine/PriceSearch";

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
  const searchBtn = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FiltersState>({
    locations: [],
    type: [],
    bedrooms: [],
    bathrooms: [],
    price: DEFAULT_PRICE,
  });

  const isPriceDirty =
    filters.price.min !== DEFAULT_PRICE.min ||
    filters.price.max !== DEFAULT_PRICE.max;

  function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
      <div className="flex items-center gap-2 bg-gray-100 px-2 py-[2px] rounded-full h-[30px] text-[12px] font-[400]">
        {label}
        <button onClick={onRemove}>
          <IoIosCloseCircleOutline className="w-[20px] h-[20px] text-gray-500" />
        </button>
      </div>
    );
  }

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
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      pushFiltersToQuery(next);
      return next;
    });
  };

  const removeFilter = (key: keyof FiltersState) => {
    forceRemoveRef.current = key; // 🔥 zapamiętaj co usuwasz

    const next: FiltersState = {
      ...filters,
      locations: key === "locations" ? [] : filters.locations,
      type: key === "type" ? [] : filters.type,
      bedrooms: key === "bedrooms" ? [] : filters.bedrooms,
      bathrooms: key === "bathrooms" ? [] : filters.bathrooms,
      price: key === "price" ? DEFAULT_PRICE : filters.price,
    };

    setFilters(next); // 🔥 NATYCHMIAST znika TAG
    pushFiltersToQuery(next); // URL sobie ogarnie później
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

    setFilters((prev) => ({
      ...prev,
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
  ]);

  const types = ["Apartament", "Bungalow", "Szeregówka", "Dom"];

  const format = (num: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(num);

  const getPriceLabel = (min: number, max: number) => {
    if (max >= 5000000) return `Cena: ${format(1500000)} i więcej`;
    return `Cena: ${format(min)} - ${format(max)}`;
  };

  return (
    <div
      id="search-wrapper"
      className={`${OutfitSans.className} flex flex-col mx-auto tracking-[1.2px] w-[90vw] max-w-[1300px] md:pt-[20px] px-0 md:sticky md:top-[80px] lg:top-[100px] md:z-30`}
    >
      <div className="flex flex-col justify-end w-full">
        <div
          id="search-params-wrapper"
          className="flex w-full flex-col lg:flex-row lg:flex-wrap items-stretch lg:items-center justify-between gap-2 lg:gap-0"
        >
          {/* LOCATION – 100% */}
          <LocationSearch
            className="w-full lg:flex-1 min-w-0"
            value={filters.locations}
            onChange={(val: LocationItem[]) => updateFilter("locations", val)}
          />

          {/* FILTERS – 50% ONLY ON MOBILE */}
          <div className="flex w-full lg:w-auto flex-wrap lg:flex-nowrap gap-2 lg:gap-0">
            <div className="max-lg:basis-[calc(50%-4px)] max-lg:shrink-0 max-lg:grow-0">
              <MultiSelect
                options={types}
                label="Zabudowa"
                value={filters.type}
                onChange={(val) => updateFilter("type", val)}
              />
            </div>

            <div className="max-lg:basis-[calc(50%-4px)] max-lg:shrink-0 max-lg:grow-0">
              <MultiSelect
                options={NUMBER_OPTIONS}
                label="Sypilani"
                value={filters.bedrooms}
                onChange={(val) => updateFilter("bedrooms", val)}
              />
            </div>

            <div className="max-lg:basis-[calc(50%-4px)] max-lg:shrink-0 max-lg:grow-0">
              <MultiSelect
                options={NUMBER_OPTIONS}
                label="Łazienek"
                value={filters.bathrooms}
                onChange={(val) => updateFilter("bathrooms", val)}
              />
            </div>

            <div className="max-lg:basis-[calc(50%-4px)] max-lg:shrink-0 max-lg:grow-0">
              <PriceSelect
                value={filters.price}
                onChange={(val: PriceRange) => updateFilter("price", val)}
              />
            </div>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap my-[15px] min-h-[30px] h-auto">
          {filters.locations.length > 0 && (
            <Tag
              label={`Lokalizacja: ${filters.locations.map((l) => l.name).join(", ")}`}
              onRemove={() => removeFilter("locations")}
            />
          )}
          {filters.type.length > 0 && (
            <Tag
              label={`Zabudowa: ${filters.type.join(", ")}`}
              onRemove={() => removeFilter("type")}
            />
          )}
          {filters.bedrooms.length > 0 && (
            <Tag
              label={`Sypialni: ${filters.bedrooms.join(", ")}`}
              onRemove={() => removeFilter("bedrooms")}
            />
          )}
          {filters.bathrooms.length > 0 && (
            <Tag
              label={`Łazienek: ${filters.bathrooms.join(", ")}`}
              onRemove={() => removeFilter("bathrooms")}
            />
          )}
          {isPriceDirty && (
            <Tag
              label={getPriceLabel(filters.price.min, filters.price.max)}
              onRemove={() => removeFilter("price")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
