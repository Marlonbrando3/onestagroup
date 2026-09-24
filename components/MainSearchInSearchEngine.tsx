import {
  buildCatalogUrl,
  parseCatalogPath,
  queryFromUrl,
  effectiveCatalogQuery,
  PROPERTY_TYPES,
  typeForQuery,
} from "@/lib/catalogRouting";
import { findRegion } from "@/lib/seoLocations";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { OutfitSans } from "@/fonts/fonts";
import { MultiSelect } from "./SearchEngine/MultiSearch";
import LocationSearch from "./SearchEngine/LocationSearch";
import PriceSelect from "./SearchEngine/PriceSearch";
import locationsData from "@/data/locations.json";
import {
  getCanonicalLocationsByIds,
  getLocationCountry,
  type LocationEntry,
} from "@/lib/locations";
import {
  getPropertyCountryOption,
  normalizeCountrySlug,
  PROPERTY_COUNTRY_OPTIONS,
} from "@/lib/propertyCountries";
import { SiteLocale } from "@/lib/i18n";

type LocationItem = LocationEntry;

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
  locale?: SiteLocale;
};

const DEFAULT_PRICE: PriceRange = { min: 0, max: 5000000 };
const NUMBER_OPTIONS = ["1", "2", "3", "4", "5"];

const MARKET_OPTIONS = ["Pierwotny", "Wtórny"];
const MARKET_OPTIONS_EN = ["Primary", "Resale"];
const MARKET_LABEL_TO_QUERY: Record<string, "true" | "false"> = {
  Pierwotny: "true",
  Wtórny: "false",
  Primary: "true",
  Resale: "false",
};
const MARKET_QUERY_TO_LABEL: Record<string, string> = {
  true: "Pierwotny",
  false: "Wtórny",
};
const MARKET_QUERY_TO_LABEL_EN: Record<string, string> = {
  true: "Primary",
  false: "Resale",
};

function MarketSelect({
  value,
  onChange,
  locale = "pl",
}: {
  value: string[];
  onChange: (val: string[]) => void;
  locale?: SiteLocale;
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

  const isEn = locale === "en";
  const allLabel = isEn ? "All" : "Wszystkie";
  const options = isEn ? MARKET_OPTIONS_EN : MARKET_OPTIONS;
  const current = value[0] ?? allLabel;

  const pick = (label: string) => {
    onChange(label === allLabel ? [] : [label]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full overflow-hidden rounded-lg whitespace-nowrap bg-white text-left font-semibold text-[#182334]"
      >
        {current}
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-30 w-full min-w-[180px] overflow-hidden rounded-[18px] border border-[#e5dac7] bg-[#f7f3ec] shadow-xl lg:w-[190px]">
          {[allLabel, ...options].map((opt) => (
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
  locale = "pl",
  variant = "default",
}: {
  value: string;
  onChange: (slug: string) => void;
  className?: string;
  locale?: SiteLocale;
  variant?: "default" | "tab";
}) {
  const isEn = locale === "en";
  if (variant === "tab") {
    return (
      <div
        role="group"
        aria-label={isEn ? "Country" : "Kraj"}
        className={`flex gap-1 tracking-normal ${className}`}
      >
        {["hiszpania", "cypr"].map((slug) => {
          const country = getPropertyCountryOption(slug);
          const isActive = value === slug;
          return (
            <button
              key={slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(slug)}
              className={`h-6 rounded-t-lg border border-b-0 px-4 py-0 text-[15.3px] leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8954c] ${
                isActive
                  ? "border-[#c9aa63] bg-[#d6b36a] font-semibold text-[#182334]"
                  : "border-[#e5dac7] bg-[#f7f3ec] font-medium text-[#5f6b7a] hover:bg-white hover:text-[#182334]"
              }`}
            >
              {isEn
                ? slug === "hiszpania"
                  ? "Spain"
                  : "Cyprus"
                : country.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <label
      className={`flex h-11 w-full items-stretch overflow-hidden rounded-[16px] text-sm font-semibold text-[#182334] ${className}`}
    >
      <span className="flex min-w-[78px] items-center justify-center border border-r-0 border-[#c9aa63] bg-[#d6b36a] px-3 uppercase tracking-[0.14em]">
        {isEn ? "Country" : "Kraj"}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-0 flex-1 border border-[#d7c8ad] bg-white px-3 font-semibold text-[#182334] outline-none transition hover:border-[#b8954c] focus:border-[#b8954c]"
      >
        {PROPERTY_COUNTRY_OPTIONS.map((country) => (
          <option key={country.slug} value={country.slug}>
            {isEn && country.slug === "hiszpania"
              ? "Spain"
              : isEn && country.slug === "cypr"
                ? "Cyprus"
                : country.label}
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
  locale = "pl",
}: Props) {
  const router = useRouter();
  const isEn = locale === "en";
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

  const activeRoute = parseCatalogPath(router.asPath);
  const urlQuery = queryFromUrl(router.asPath);
  const activeQuery = activeRoute
    ? effectiveCatalogQuery(activeRoute, urlQuery)
    : urlQuery;
  const initialFilters = useRef<FiltersState | null>(null);
  const selectedCountry = getPropertyCountryOption(activeRoute?.country);
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

  const buildQueryFromFilters = (next: FiltersState) => {
    const q: Record<string, any> = { ...urlQuery };
    for (const key of [
      "page",
      "region",
      "location",
      "type",
      "market",
      "beds",
      "bedsMin",
      "bedsMax",
      "baths",
      "bathsMin",
      "bathsMax",
      "priceMin",
      "priceMax",
      "minPrice",
      "maxPrice",
    ])
      delete q[key];

    if (next.locations.length) {
      q.location = next.locations.map((l) => l.id).join(",");
    }

    if (next.type.length) {
      const dbTypes = next.type
        .flatMap(
          (label) =>
            PROPERTY_TYPES.find((t) => t.label[locale] === label)?.dbValues ?? [
              label,
            ],
        )
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

    // Preserve exact imported values, ranges and aliases for controls the user
    // has not edited. In particular, a raw legacy type must not expand to a group.
    const fields = {
      type: ["type"],
      market: ["market"],
      bedrooms: ["beds", "bedsMin", "bedsMax"],
      bathrooms: ["baths", "bathsMin", "bathsMax"],
      price: ["priceMin", "priceMax", "minPrice", "maxPrice"],
    };
    for (const [field, keys] of Object.entries(fields)) {
      if (
        initialFilters.current &&
        JSON.stringify(next[field as keyof FiltersState]) ===
          JSON.stringify(initialFilters.current[field as keyof FiltersState])
      ) {
        for (const key of keys) {
          delete q[key];
          if (urlQuery[key] !== undefined) q[key] = urlQuery[key];
        }
        if (field === "type" && activeRoute?.propertyType)
          q.type = activeQuery.type;
      }
    }
    if (
      initialFilters.current &&
      JSON.stringify(next.locations) ===
        JSON.stringify(initialFilters.current.locations) &&
      urlQuery.region
    )
      q.region = urlQuery.region;
    return q;
  };

  const pushFiltersToQuery = (next: FiltersState) => {
    const query = buildQueryFromFilters(next);
    const sameLocations = JSON.stringify(next.locations) === JSON.stringify(initialFilters.current?.locations);
    const destination = buildCatalogUrl(
      selectedCountry.slug,
      query,
      locale,
      sameLocations && activeRoute ? { region: activeRoute.region, city: activeRoute.city } : {},
    )!;
    if (destination === router.asPath) {
      setLoader(false);
      return;
    }
    setLoader(true);
    void router
      .push(destination, undefined, { shallow: false, scroll: false })
      .catch(() => setLoader(false));
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
      .push(buildCatalogUrl(normalizedCountry, query, locale)!, undefined, {
        shallow: false,
        scroll: false,
      })
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
    if (!router.isReady) return;

    const selectedType = typeForQuery(activeQuery.type);
    const typeFromUrl = selectedType
      ? [selectedType.label[locale]]
      : parseCsv(activeQuery.type).map((value) => {
          const exact = PROPERTY_TYPES.find(
            (t) =>
              t.dbValues.length === 1 &&
              t.dbValues[0].toLowerCase() === value.toLowerCase(),
          );
          return exact?.label[locale] || value;
        });

    const bedsFromList = parseCsv(activeQuery.beds);
    const bedsMin = parseNum(activeQuery.bedsMin);
    const bedsMax = parseNum(activeQuery.bedsMax);
    const bedrooms =
      bedsFromList.length > 0
        ? bedsFromList
        : bedsMin !== null && bedsMax !== null && bedsMin === bedsMax
          ? [String(bedsMin)]
          : [];

    const bathsFromList = parseCsv(activeQuery.baths);
    const bathsMin = parseNum(activeQuery.bathsMin);
    const bathsMax = parseNum(activeQuery.bathsMax);
    const bathrooms =
      bathsFromList.length > 0
        ? bathsFromList
        : bathsMin !== null && bathsMax !== null && bathsMin === bathsMax
          ? [String(bathsMin)]
          : [];

    const priceMin = parseNum(activeQuery.priceMin) ?? DEFAULT_PRICE.min;
    const priceMax = parseNum(activeQuery.priceMax) ?? DEFAULT_PRICE.max;
    const locationIds = parseCsv(activeQuery.location);
    const region = findRegion(activeRoute?.region);
    if (region && !activeRoute?.city && !locationIds.length)
      locationIds.push(region.locationId);
    const locations = getCanonicalLocationsByIds(
      locationIds,
      (locationsData as LocationEntry[]).filter(
        (location) => getLocationCountry(location) === selectedCountry.slug,
      ),
    );
    const marketFromUrlRaw = Array.isArray(activeQuery.market)
      ? activeQuery.market[0]
      : String(activeQuery.market ?? "");
    const marketLabel =
      (isEn ? MARKET_QUERY_TO_LABEL_EN : MARKET_QUERY_TO_LABEL)[
        marketFromUrlRaw
      ] ?? null;

    const restored: FiltersState = {
      locations,
      type: typeFromUrl,
      market: marketLabel ? [marketLabel] : [],
      bedrooms,
      bathrooms,
      price: { min: priceMin, max: priceMax },
    };
    initialFilters.current = restored;
    setFilters(restored);
  }, [router.isReady, router.asPath, locale]);

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

  const types = Array.from(
    new Set([
      ...PROPERTY_TYPES.filter((t) => t.slug !== "other").map(
        (t) => t.label[locale],
      ),
      ...filters.type,
    ]),
  );

  return (
    <>
      {countryTransition.active ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#182334]/45 px-6 backdrop-blur-[2px]">
          <div className="grid min-w-[240px] justify-items-center gap-4 rounded-[22px] border border-[#e5dac7] bg-white px-8 py-7 text-center shadow-2xl">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5dac7] border-t-[#b8954c]" />
            <div>
              <p className="text-lg font-bold text-[#182334]">
                {isEn ? "Changing country..." : "Zmieniamy kraj..."}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#5f6b7a]">
                {isEn ? "Loading offers:" : "Ładujemy oferty:"}{" "}
                {isEn && countryTransition.slug === "hiszpania"
                  ? "Spain"
                  : isEn && countryTransition.slug === "cypr"
                    ? "Cyprus"
                    : countryTransition.label}
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
          className={`flex items-center gap-3 rounded-[16px] border border-[#d7c8ad] bg-white p-4 text-[#5f6b7a] shadow-lg transition hover:border-[#b8954c] hover:shadow-xl ${
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
          <span className="text-left">{isEn ? "Search" : "Wyszukaj"}</span>
        </button>
      </div>

      <div
        id="search-wrapper"
        className={`${OutfitSans.className} mx-auto tracking-[1.2px] w-[90vw] max-w-[1330px] lg:relative lg:z-30 mb-[30px] mt-0 lg:-mt-[44px]`}
      >
        <div className="ml-[22px] hidden lg:flex">
          <CountrySelect
            value={displayedCountrySlug}
            onChange={handleCountryChange}
            variant="tab"
            locale={locale}
          />
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden rounded-[16px] border border-[#e5dac7] bg-white shadow-xl lg:flex lg:h-20 lg:flex-row lg:gap-0 text-sm">
          {/* LOCATION */}
          <div className="h-full w-full border-[#e5dac7] pl-4 lg:flex-[4.20] lg:border-r">
            <LocationSearch
              className="h-full w-full rounded-l-[15px] rounded-r-none"
              countrySlug={selectedCountry.slug}
              value={filters.locations}
              onChange={(val: LocationItem[]) => updateFilter("locations", val)}
              locale={locale}
            />
          </div>

          {/* ZABUDOWA */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-1 lg:border-r">
            <MultiSelect
              options={types}
              label={isEn ? "Property type" : "Zabudowa"}
              value={filters.type}
              onChange={(val) => updateFilter("type", val)}
              locale={locale}
            />
          </div>

          {/* RYNEK */}
          <div className="flex h-full w-full min-w-0 items-center border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <div className="w-full">
              <label className="mb-1 block text-xs font-semibold text-[#5f6b7a]">
                {isEn ? "Market" : "Rynek"}
              </label>
              <MarketSelect
                value={filters.market}
                onChange={(val) => updateFilter("market", val)}
                locale={locale}
              />
            </div>
          </div>

          {/* SYPIALNIE */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <MultiSelect
              options={NUMBER_OPTIONS}
              label={isEn ? "Bedrooms" : "Sypilani"}
              value={filters.bedrooms}
              onChange={(val) => updateFilter("bedrooms", val)}
              locale={locale}
            />
          </div>

          {/* ŁAZIENKI */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[0.75] lg:border-r">
            <MultiSelect
              options={NUMBER_OPTIONS}
              label={isEn ? "Bathrooms" : "Łazienek"}
              value={filters.bathrooms}
              onChange={(val) => updateFilter("bathrooms", val)}
              locale={locale}
            />
          </div>

          {/* CENA */}
          <div className="h-full w-full border-[#e5dac7] px-4 lg:flex-[1.25] lg:border-r">
            <PriceSelect
              value={filters.price}
              onChange={(val: PriceRange) => updateFilter("price", val)}
              locale={locale}
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex h-full w-full items-center justify-center rounded-r-[15px] bg-[#fbf8f2] px-3 lg:w-auto">
            <button
              onClick={handleSearch}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#b8954c] bg-[#d6b36a] text-[#182334] transition-colors hover:border-[#182334] hover:bg-[#182334] hover:text-white"
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
            <div className="fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[24px] border-t border-[#e5dac7] bg-[#f7f3ec]">
              {/* HEADER */}
              <div className="sticky top-0 flex items-center justify-between rounded-t-[24px] border-b border-[#e5dac7] bg-[#f7f3ec] p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7a36]">
                    {isEn ? "Filters" : "Filtry"}
                  </p>
                  <h2 className="text-xl font-semibold text-[#182334]">
                    {isEn ? "Search" : "Wyszukaj"}
                  </h2>
                </div>
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl text-[#5f6b7a] hover:text-[#182334]"
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
                    locale={locale}
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
                    locale={locale}
                  />
                </div>

                {/* ZABUDOWA */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    {isEn ? "Property type" : "Zabudowa"}
                  </label>
                  <MultiSelect
                    options={types}
                    label={isEn ? "Property type" : "Zabudowa"}
                    value={filters.type}
                    onChange={(val) => updateFilter("type", val)}
                    locale={locale}
                  />
                </div>

                {/* RYNEK */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    {isEn ? "Market" : "Rynek"}
                  </label>
                  <MarketSelect
                    value={filters.market}
                    onChange={(val) => updateFilter("market", val)}
                    locale={locale}
                  />
                </div>

                {/* SYPIALNIE */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    {isEn ? "Bedrooms" : "Sypialnie"}
                  </label>
                  <MultiSelect
                    options={NUMBER_OPTIONS}
                    label={isEn ? "Bedrooms" : "Sypilani"}
                    value={filters.bedrooms}
                    onChange={(val) => updateFilter("bedrooms", val)}
                    locale={locale}
                  />
                </div>

                {/* ŁAZIENKI */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    {isEn ? "Bathrooms" : "Łazienki"}
                  </label>
                  <MultiSelect
                    options={NUMBER_OPTIONS}
                    label={isEn ? "Bathrooms" : "Łazienek"}
                    value={filters.bathrooms}
                    onChange={(val) => updateFilter("bathrooms", val)}
                    locale={locale}
                  />
                </div>

                {/* CENA */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#182334]">
                    {isEn ? "Price" : "Cena"}
                  </label>
                  <PriceSelect
                    value={filters.price}
                    onChange={(val: PriceRange) => updateFilter("price", val)}
                    locale={locale}
                  />
                </div>

                {/* SEARCH BUTTON */}
                <button
                  onClick={() => {
                    handleSearch();
                    setMobileModalOpen(false);
                  }}
                  className="mt-6 w-full rounded-full border border-[#b8954c] bg-[#d6b36a] py-3 font-semibold uppercase tracking-[0.12em] text-[#182334] transition-colors hover:border-[#182334] hover:bg-[#182334] hover:text-white"
                >
                  {isEn ? "Search" : "Szukaj"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
