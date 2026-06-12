import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { OutfitSans } from "@/fonts/fonts";
import { MultiSelect } from "./SearchEngine/MultiSearch";
import LocationSearch from "./SearchEngine/LocationSearch";
import PriceSelect from "./SearchEngine/PriceSearch";
import locationsData from "@/data/locations.json";
import { typeDictionarySingular } from "@/lib/titlesDictionary";
import {
  getPropertyCountryOption,
  normalizeCountrySlug,
  PROPERTY_COUNTRY_OPTIONS,
} from "@/lib/propertyCountries";

type LocationItem = {
  id: string;
  name: string;
  type: "coast" | "province" | "town" | "city";
  parentId: string | null;
  country?: string;
};

type PriceRange = { min: number; max: number };

type FiltersState = {
  locations: LocationItem[];
  type: string[];
  market: string[];
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

function getLocationCountry(location: LocationItem) {
  return location.country || "hiszpania";
}

const TYPE_LABEL_TO_DB_VALUES: Record<string, string[]> = {
  Apartament: [
    "apartment",
    "Apartment",
    "Quad House",
    "Semi Detached",
    "Apartment Penthouse",
  ],
  Penthouse: ["Penthouse", "Apartment Penthouse", "Penthouse Penthouse"],
  Bungalow: ["bungalow", "Bungalow"],
  Dom: [
    "casas",
    "Country House",
    "Country House Penthouse",
    "Town House",
    "Town House Penthouse",
    "townhouse",
    "villa",
    "Villa",
    "Villa Penthouse",
  ],
  "Dom szeregowy": ["townhouse", "Town House"],
  Posiadłość: ["Finca"],
  Nieruchomość: ["shop", "null"],
};

const TYPE_DB_TO_LABEL: Record<string, string> = Object.entries(
  typeDictionarySingular,
).reduce(
  (acc, [dbType, label]) => {
    acc[dbType.toLowerCase()] = label;
    return acc;
  },
  {} as Record<string, string>,
);

const MARKET_OPTIONS = ["Pierwotny", "Wtórny"];
const MARKET_LABEL_TO_QUERY: Record<string, "true" | "false"> = {
  Pierwotny: "true",
  Wtórny: "false",
};
const MARKET_QUERY_TO_LABEL: Record<string, string> = {
  true: "Pierwotny",
  false: "Wtórny",
};

function MarketSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = value[0] ?? "Wszystkie";

  const pick = (label: string) => {
    onChange(label === "Wszystkie" ? [] : [label]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full overflow-hidden whitespace-nowrap bg-white text-left font-semibold text-[#182334]"
      >
        {current}
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-30 w-full overflow-hidden border border-[#e5dac7] bg-[#f7f3ec] shadow-xl">
          {["Wszystkie", ...MARKET_OPTIONS].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              className={`w-full px-3 py-2 text-left text-sm transition hover:bg-white ${
                current === opt
                  ? "bg-white font-bold text-[#9b7a36]"
                  : "text-[#334155]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}) {
  return (
    <label
      className={`flex h-11 w-full items-stretch text-sm font-semibold text-[#182334] ${className}`}
    >
      <span className="flex min-w-[78px] items-center justify-center border border-r-0 border-[#c9aa63] bg-[#d6b36a] px-3 uppercase tracking-[0.14em]">
        Kraj
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-0 flex-1 border border-[#d7c8ad] bg-white px-3 font-semibold text-[#182334] outline-none transition hover:border-[#b8954c] focus:border-[#b8954c]"
      >
        {PROPERTY_COUNTRY_OPTIONS.map((country) => (
          <option key={country.slug} value={country.slug}>
            {country.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Home({
  mobileButtonSearchEngine,
  searchEngine,
  loader,
  setLoader,
}: Props) {
  const router = useRouter();
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [countryTransition, setCountryTransition] = useState({
    active: false,
    slug: "",
    label: "",
  });
  const [isMobilePinned, setIsMobilePinned] = useState(false);
  const [mobileButtonHeight, setMobileButtonHeight] = useState(0);
  const mobileTriggerStartYRef = useRef<number | null>(null);
  const mobileTriggerAnchorRef = useRef<HTMLDivElement | null>(null);
  const mobileTriggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const [filters, setFilters] = useState<FiltersState>({
    locations: [],
    type: [],
    market: [],
    bedrooms: [],
    bathrooms: [],
    price: DEFAULT_PRICE,
  });

  const selectedCountry = getPropertyCountryOption(
    Array.isArray(router.query.country)
      ? router.query.country[0]
      : router.query.country,
  );
  const displayedCountrySlug = countryTransition.active
    ? countryTransition.slug
    : selectedCountry.slug;

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

  const serializeQuery = (queryObj: Record<string, string>) =>
    Object.entries(queryObj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

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
        .flatMap((label) => TYPE_LABEL_TO_DB_VALUES[label] ?? [])
        .filter(Boolean);
      if (dbTypes.length) q.type = toCsv(dbTypes);
    }
    if (next.market.length) {
      const picked = next.market[0];
      const mapped = MARKET_LABEL_TO_QUERY[picked];
      if (mapped) q.market = mapped;
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
    const country = normalizeCountrySlug(
      Array.isArray(router.query.country)
        ? router.query.country[0]
        : router.query.country,
    );
    const query = buildQueryFromFilters(next);
    const nextSerialized = serializeQuery(query);
    const currentComparableQuery: Record<string, string> = {};

    Object.entries(router.query).forEach(([k, v]) => {
      if (k === "country") return;
      if (Array.isArray(v)) {
        if (v.length) currentComparableQuery[k] = v.join(",");
      } else if (v !== undefined && v !== null && String(v).length) {
        currentComparableQuery[k] = String(v);
      }
    });

    const currentSerialized = serializeQuery(currentComparableQuery);

    if (currentSerialized === nextSerialized) {
      setLoader(false);
      return;
    }

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

  const handleCountryChange = (countrySlug: string) => {
    const normalizedCountry = normalizeCountrySlug(countrySlug);
    if (normalizedCountry === selectedCountry.slug) return;

    const nextCountry = getPropertyCountryOption(normalizedCountry);
    const next = { ...filters, locations: [] };
    const query = buildQueryFromFilters(next);

    delete query.region;
    delete query.location;

    setFilters(next);
    setLoader(true);
    setCountryTransition({
      active: true,
      slug: nextCountry.slug,
      label: nextCountry.label,
    });

    router
      .push(
        {
          pathname: `/nieruchomosci/${normalizedCountry}/`,
          query,
        },
        undefined,
        { shallow: false, scroll: false },
      )
      .catch(() => {
        setCountryTransition({ active: false, slug: "", label: "" });
        setLoader(false);
      });
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

    const typeFromUrl = Array.from(
      new Set(
        parseCsv(router.query.type).map(
          (db) => TYPE_DB_TO_LABEL[db.toLowerCase()] ?? db,
        ),
      ),
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
      .filter(
        (location): location is LocationItem =>
          Boolean(location) &&
          getLocationCountry(location as LocationItem) === selectedCountry.slug,
      );
    const marketFromUrlRaw = Array.isArray(router.query.market)
      ? router.query.market[0]
      : String(router.query.market ?? "");
    const marketLabel = MARKET_QUERY_TO_LABEL[marketFromUrlRaw] ?? null;

    setFilters((prev) => ({
      ...prev,
      locations,
      type: typeFromUrl,
      market: marketLabel ? [marketLabel] : [],
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
    router.query.market,
    router.query.country,
    selectedCountry.slug,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const TOP_OFFSET = 88;

    const measure = () => {
      if (mobileTriggerButtonRef.current) {
        setMobileButtonHeight(mobileTriggerButtonRef.current.offsetHeight);
      }
      if (mobileTriggerAnchorRef.current) {
        mobileTriggerStartYRef.current =
          mobileTriggerAnchorRef.current.getBoundingClientRect().top +
          window.scrollY;
      }
    };

    const onScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsMobilePinned(false);
        return;
      }
      if (mobileTriggerStartYRef.current === null) {
        measure();
      }
      const startY = mobileTriggerStartYRef.current;
      if (startY === null) return;
      setIsMobilePinned(window.scrollY >= startY - TOP_OFFSET);
    };

    const onResize = () => {
      mobileTriggerStartYRef.current = null;
      measure();
      onScroll();
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const finishCountryTransition = () => {
      setCountryTransition({ active: false, slug: "", label: "" });
      setLoader(false);
    };

    router.events.on("routeChangeComplete", finishCountryTransition);
    router.events.on("routeChangeError", finishCountryTransition);

    return () => {
      router.events.off("routeChangeComplete", finishCountryTransition);
      router.events.off("routeChangeError", finishCountryTransition);
    };
  }, [router.events, setLoader]);

  const types = [
    "Apartament",
    "Penthouse",
    "Bungalow",
    "Dom",
    "Dom szeregowy",
    "Posiadłość",
  ];

  return (
    <>
      {countryTransition.active ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#182334]/45 px-6 backdrop-blur-[2px]">
          <div className="grid min-w-[240px] justify-items-center gap-4 border border-[#e5dac7] bg-white px-8 py-7 text-center shadow-2xl">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5dac7] border-t-[#b8954c]" />
            <div>
              <p className="text-lg font-bold text-[#182334]">
                Zmieniamy kraj...
              </p>
              <p className="mt-1 text-sm font-semibold text-[#5f6b7a]">
                Ładuję oferty: {countryTransition.label}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* MOBILE SEARCH TRIGGER */}
      <div
        ref={mobileTriggerAnchorRef}
        className={`${OutfitSans.className} lg:hidden w-[90vw] max-w-[1330px] mx-auto mt-[10px] mb-[12px]`}
        style={{ height: isMobilePinned ? mobileButtonHeight : "auto" }}
      >
        <button
          ref={mobileTriggerButtonRef}
          onClick={() => setMobileModalOpen(true)}
          className={`flex items-center gap-3 border border-[#d7c8ad] bg-white p-4 text-[#5f6b7a] shadow-lg transition hover:border-[#b8954c] hover:shadow-xl ${
            isMobilePinned
              ? "fixed top-[88px] left-1/2 -translate-x-1/2 z-[35] w-[90vw] max-w-[1330px]"
              : "w-full relative"
          }`}
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
      </div>

      <div
        id="search-wrapper"
        className={`${OutfitSans.className} mx-auto tracking-[1.2px] w-[90vw] max-w-[1330px] lg:sticky lg:top-[100px] lg:z-30 mb-[30px] mt-0 lg:-mt-[70px]`}
      >
        <div className="mb-3 hidden lg:flex">
          <CountrySelect
            value={displayedCountrySlug}
            onChange={handleCountryChange}
            className="max-w-[240px]"
          />
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden border border-[#e5dac7] bg-white shadow-xl lg:flex lg:h-20 lg:flex-row lg:gap-0 text-sm">
          {/* LOCATION */}
          <div className="h-full w-full border-[#e5dac7] pl-4 lg:flex-[4.20] lg:border-r">
            <LocationSearch
              className="w-full h-full"
              countrySlug={selectedCountry.slug}
              value={filters.locations}
              onChange={(val: LocationItem[]) => updateFilter("locations", val)}
            />
          </div>

          {/* ZABUDOWA */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-1 lg:border-r">
            <MultiSelect
              options={types}
              label="Zabudowa"
              value={filters.type}
              onChange={(val) => updateFilter("type", val)}
            />
          </div>

          {/* RYNEK */}
          <div className="flex h-full w-full min-w-0 items-center border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <div className="w-full">
              <label className="mb-1 block text-xs font-semibold text-[#5f6b7a]">
                Rynek
              </label>
              <MarketSelect
                value={filters.market}
                onChange={(val) => updateFilter("market", val)}
              />
            </div>
          </div>

          {/* SYPIALNIE */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <MultiSelect
              options={NUMBER_OPTIONS}
              label="Sypilani"
              value={filters.bedrooms}
              onChange={(val) => updateFilter("bedrooms", val)}
            />
          </div>

          {/* ŁAZIENKI */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <MultiSelect
              options={NUMBER_OPTIONS}
              label="Łazienek"
              value={filters.bathrooms}
              onChange={(val) => updateFilter("bathrooms", val)}
            />
          </div>

          {/* CENA */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[1.25] lg:border-r">
            <PriceSelect
              value={filters.price}
              onChange={(val: PriceRange) => updateFilter("price", val)}
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex h-full w-full items-center justify-center bg-[#fbf8f2] px-3 lg:w-auto">
            <button
              onClick={handleSearch}
              className="flex h-12 w-12 items-center justify-center border border-[#b8954c] bg-[#d6b36a] text-[#182334] transition-colors hover:border-[#182334] hover:bg-[#182334] hover:text-white"
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
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto border-t border-[#e5dac7] bg-[#f7f3ec]">
              {/* HEADER */}
              <div className="sticky top-0 flex items-center justify-between border-b border-[#e5dac7] bg-[#f7f3ec] p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7a36]">
                    Filtry
                  </p>
                  <h2 className="text-xl font-semibold text-[#182334]">
                    Wyszukaj
                  </h2>
                </div>
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center bg-white text-2xl text-[#5f6b7a] hover:text-[#182334]"
                >
                  ✕
                </button>
              </div>
              {/* FILTERS */}
              <div className="space-y-4 p-4">
                <div className="relative">
                  <CountrySelect
                    value={displayedCountrySlug}
                    onChange={handleCountryChange}
                  />
                </div>

                {/* LOCATION */}
                <div className="relative">
                  {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Where?
                  </label> */}
                  <LocationSearch
                    className="w-full"
                    countrySlug={selectedCountry.slug}
                    value={filters.locations}
                    onChange={(val: LocationItem[]) =>
                      updateFilter("locations", val)
                    }
                  />
                </div>

                {/* ZABUDOWA */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    Zabudowa
                  </label>
                  <MultiSelect
                    options={types}
                    label="Zabudowa"
                    value={filters.type}
                    onChange={(val) => updateFilter("type", val)}
                  />
                </div>

                {/* RYNEK */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    Rynek
                  </label>
                  <MarketSelect
                    value={filters.market}
                    onChange={(val) => updateFilter("market", val)}
                  />
                </div>

                {/* SYPIALNIE */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
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
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
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
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
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
                  className="mt-6 w-full border border-[#b8954c] bg-[#d6b36a] py-3 font-semibold uppercase tracking-[0.12em] text-[#182334] transition-colors hover:border-[#182334] hover:bg-[#182334] hover:text-white"
                >
                  Szukaj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
