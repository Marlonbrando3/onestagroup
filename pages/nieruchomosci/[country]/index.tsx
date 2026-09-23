import { publicListings } from "@/lib/publicListings";
import SeoHead from "@/components/SeoHead";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import SeoLocationContent from "@/components/SeoLocationContent";
import { findRegion, findCity } from "@/lib/seoLocations";
import {
  catalogPath,
  canonicalCatalog,
  countryMetadata,
  hasFilters,
  publicCountry,
  noStore,
  preservedQuery,
  FILTER_KEYS,
} from "@/lib/publicSeo";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import locationsData from "@/data/locations.json";
import MiniHomeView from "../../../components/SearchEngine/MiniHomeView";
import Header from "../../../components/Header";
import SearchEngine from "../../../components/SearchEngine/SearchEngine";
import Footer from "../../../components/Footer";
import ContactFormMain from "../../../components/ContactFormMain";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Consultation from "@/components/consulatation/consultation";
import RecommendedOffersPopup from "../../../components/SearchEngine/RecommendedOffersPopup";
import { getPropertyCountryOption } from "@/lib/propertyCountries";
import { SiteLocale, countryLabel } from "@/lib/i18n";
import {
  expandLocationSelection,
  getLocationCountry,
  type LocationEntry,
} from "@/lib/locations";

const PROPERTY_LIST_COLUMNS = [
  "external_id",
  "type",
  "town",
  "province",
  "price",
  "beds",
  "baths",
  "images",
  "new_build",
  "onesta_featured",
  "surface_built",
  "pool",
  "vacantFromDate:available_from",
  "updated_at",
  "country",
  "title",
  "distance_to_sea_m",
].join(",");

interface Property {
  external_id: string | number;
  type: string;
  town: string;
  province: string;
  price: number;
  beds: number;
  baths: number;
  images: string[];
  new_build: boolean;
  onesta_featured: boolean;
  surface_built: number;
  pool: boolean;
  headerAdvertisement: string;
  vacantFromDate: string | null;
  updated_at: string;
  country: string;
  distance_to_sea_m: number | null;
}

interface PageProps {
  properties: Property[];
  country: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  query: Record<string, string | string[]>;
  locale?: SiteLocale;
  regionSlug?: string;
  citySlug?: string;
}

export default function ListingsPage(props: PageProps) {
  const router = useRouter();
  const { country } = router.query;
  const locale = props.locale ?? "pl";
  const isEn = locale === "en";

  const searchEngine = useRef<HTMLDivElement>(null);
  const mobileButtonSearchEngine = useRef<HTMLButtonElement>(null);

  const [loader, setLoader] = useState(false);
  const [propertiesState, setPropertiesState] = useState<Property[]>(
    props.properties ?? [],
  );
  const [pageState, setPageState] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [showOffersPopup, setShowOffersPopup] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownPopupRef = useRef(false);
  const hasScrolledToMiddleRef = useRef(false);

  const handleConsultationPopUp = () => setConsultationOpen((prev) => !prev);

  const showPopup = () => {
    if (!hasShownPopupRef.current) {
      setShowOffersPopup(true);
      hasShownPopupRef.current = true;
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageState((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    setPropertiesState(props.properties ?? []);
    setPageState(1);
    setHasMore(true);
  }, [props.properties]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      searchEngine.current
    ) {
      searchEngine.current.style.top = "-120vh";
    }
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      // Only start timer if user has scrolled to middle
      if (hasScrolledToMiddleRef.current) {
        inactivityTimerRef.current = setTimeout(() => {
          showPopup();
        }, 5000);
      }
    };

    const handleActivity = () => {
      // Only reset timer if user has scrolled to middle
      if (hasScrolledToMiddleRef.current) {
        resetTimer();
      }
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = scrollTop / (docHeight - windowHeight);

      // User scrolled to middle - NOW start the timer
      if (scrollPercentage >= 0.5 && !hasScrolledToMiddleRef.current) {
        hasScrolledToMiddleRef.current = true;
        resetTimer();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setLoader(false);
  }, [router.asPath]);

  if (!country || typeof country !== "string") return null;

  const handleShowMobileFilters = () => {
    if (!searchEngine.current || !mobileButtonSearchEngine.current) return;
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;

    const next = !isMobileFiltersOpen;
    setIsMobileFiltersOpen(next);

    searchEngine.current.style.top = next ? "0px" : "-120vh";
    mobileButtonSearchEngine.current.innerHTML = next
      ? isEn
        ? "Close"
        : "Zamknij"
      : isEn
        ? "Filters"
        : "Filtry";
  };

  const region = findRegion(props.regionSlug);
  const city = findCity(props.regionSlug, props.citySlug);
  const baseMeta = countryMetadata(String(country), locale);
  const h1 = city
    ? isEn
      ? `Property for sale in ${city.name}`
      : `Nieruchomości w ${city.name} na sprzedaż`
    : region
      ? isEn
        ? `Property for sale on the ${region.name}`
        : `Nieruchomości na ${region.name}`
      : baseMeta.h1;
  const description =
    city?.intro[locale] || region?.copy[locale].intro || baseMeta.description;
  const title = region
    ? city
      ? `${h1} | Onesta`
      : isEn
        ? `${h1} | Onesta`
        : `Nieruchomości ${region.name} na sprzedaż | Onesta`
    : baseMeta.title;
  const path = catalogPath(String(country), locale, region?.slug, city?.slug);
  const canonical = canonicalCatalog(path, props.query);
  const breadcrumbs = [
    { name: isEn ? "Home" : "Strona główna", path: isEn ? "/en" : "/" },
    { name: baseMeta.h1, path: catalogPath(String(country), locale) },
  ];
  if (region)
    breadcrumbs.push({
      name: region.name,
      path: catalogPath(String(country), locale, region.slug),
    });
  if (city) breadcrumbs.push({ name: city.name, path });

  return (
    <div className="bg-gray-100/[0.3] w-full overflow-x-clip">
      <SeoHead
        title={
          props.currentPage > 1
            ? `${title.replace(" | Onesta", "")} — ${isEn ? "page" : "strona"} ${props.currentPage} | Onesta`
            : title
        }
        description={description}
        canonical={canonical}
        robots={hasFilters(props.query) ? "noindex, follow" : "index, follow"}
        alternates={{
          pl: canonicalCatalog(
            catalogPath(String(country), "pl", region?.slug, city?.slug),
            props.query,
          ),
          en: canonicalCatalog(
            catalogPath(String(country), "en", region?.slug, city?.slug),
            props.query,
          ),
        }}
      />
      <WhatsAppButton />
      <Consultation
        handleConsultationPopUp={handleConsultationPopUp}
        ConsultationsShowed={consultationOpen}
        locale={locale}
        contextLabel={[region?.name, city?.name].filter(Boolean).join(" / ")}
      />
      <Header
        handleConsultationPopUp={handleConsultationPopUp}
        handleShowOffersPopup={() => {
          setShowOffersPopup(true);
          hasShownPopupRef.current = false;
        }}
        locale={locale}
      />
      <div className="pt-[74px] xl:pt-[82px]" />
      <MiniHomeView>
        <header>
          <SeoBreadcrumbs
            items={breadcrumbs}
            className="hidden lg:flex lg:text-white/80 [&_a]:transition-colors lg:[&_a:hover]:text-white"
          />
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight md:text-4xl lg:text-[42px] lg:drop-shadow-sm">
            {h1}
          </h1>
          <p className="mt-3 max-w-4xl leading-7 text-[#4a5568] lg:text-white/90 lg:drop-shadow-sm">
            {description}
          </p>
        </header>
      </MiniHomeView>
      <RecommendedOffersPopup
        locale={locale}
        isOpen={showOffersPopup}
        onClose={() => setShowOffersPopup(false)}
      />
      <SearchEngine
        loader={loader}
        setLoader={setLoader}
        handleShowMobileFilters={handleShowMobileFilters}
        searchEngine={searchEngine}
        mobileButtonSearchEngine={mobileButtonSearchEngine}
        count={props.totalCount}
        {...props}
        properties={propertiesState}
        isMobileFiltersOpen={isMobileFiltersOpen}
        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        locale={locale}
      />

      <div ref={lastElementRef} style={{ height: 50 }} />

      {loadingMore && (
        <div className="flex items-center justify-center gap-2 mb-[50px]">
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce" />
        </div>
      )}

      {country === "hiszpania" && (
        <SeoLocationContent
          regionSlug={region?.slug}
          citySlug={city?.slug}
          locale={locale}
          onConsultation={handleConsultationPopUp}
        />
      )}
      <ContactFormMain locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}

function parseCsvParam(val: unknown): string[] {
  if (!val) return [];
  const raw = Array.isArray(val) ? val.join(",") : String(val);
  return raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

function parseNumList(val: unknown): number[] {
  if (!val) return [];
  const raw = Array.isArray(val) ? val.join(",") : String(val);
  return raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n));
}

function escapeLikeValue(value: string): string {
  return String(value).replace(/[%_,]/g, "").trim();
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  noStore(context.res);
  const {
    country,
    title: regionSlug,
    city: citySlug,
  } = context.params as { country: string; title?: string; city?: string };
  const countryOption = publicCountry(country);
  if (!countryOption || countryOption.slug !== country)
    return { notFound: true };
  const regionScope = regionSlug ? findRegion(regionSlug) : undefined;
  const cityScope = citySlug ? findCity(regionSlug, citySlug) : undefined;
  if (
    (regionSlug && (!regionScope || country !== "hiszpania")) ||
    (citySlug && !cityScope)
  )
    return { notFound: true };
  const rawPage = context.query.page;
  if (
    rawPage !== undefined &&
    (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage))
  )
    return { notFound: true };
  const page = Number(rawPage || 1);
  if (
    !Number.isSafeInteger(page) ||
    page > Math.floor(Number.MAX_SAFE_INTEGER / 21)
  )
    return { notFound: true };
  const locale: SiteLocale = context.resolvedUrl.startsWith("/en/")
    ? "en"
    : "pl";
  if (rawPage === "1")
    return {
      redirect: {
        destination: preservedQuery(
          catalogPath(country, locale, regionSlug, citySlug),
          context.query,
          ["page"],
        ),
        permanent: true,
      },
    };
  if (!validFilters(context.query)) return { notFound: true };

  const limit = 21;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    type,
    region,
    market,
    baths,
    bathsMin,
    bathsMax,
    beds,
    bedsMin,
    bedsMax,
    priceMin,
    priceMax,
    location,
    sort,
  } = context.query;

  const provincesParam = region
    ? Array.isArray(region)
      ? region
      : [region]
    : undefined;

  const bathsFrom = bathsMin ? Number(bathsMin) : 0;
  const bathsTo = bathsMax ? Number(bathsMax) : 99;
  const bedsFrom = bedsMin ? Number(bedsMin) : 0;
  const bedsTo = bedsMax ? Number(bedsMax) : 99;
  const priceFrom = priceMin ? Number(priceMin) : 0;
  const priceTo = priceMax ? Number(priceMax) : 99_999_999;
  const marketType = market ?? null;

  const typeList = parseCsvParam(type);
  const bathsExact = parseNumList(baths);
  const bedsExact = parseNumList(beds);
  const hasBathsFilter =
    baths !== undefined || bathsMin !== undefined || bathsMax !== undefined;
  const hasBedsFilter =
    beds !== undefined || bedsMin !== undefined || bedsMax !== undefined;

  const locationParam = location ? String(location).split(",") : [];
  const countryLocations = (locationsData as LocationEntry[]).filter(
    (entry) => getLocationCountry(entry) === countryOption.slug,
  );
  if (
    locationParam.some(
      (id) => !countryLocations.some((entry) => entry.id === id),
    )
  )
    return { notFound: true };
  const expandedLocations = expandLocationSelection(
    locationParam,
    countryLocations,
  );

  const selectedTowns = expandedLocations
    .filter((l) => l?.type === "town" || l?.type === "city")
    .map((l) => l!.name);

  const selectedProvinces = expandedLocations
    .filter((l) => l?.type === "province")
    .map((l) => l!.name);

  const selectedCoasts = expandedLocations
    .filter((l) => l?.type === "coast")
    .map((l) => l!.name);

  if (!supabaseServer) throw new Error("Property database unavailable");

  let query = publicListings(
    supabaseServer
      .from("properties")
      .select(PROPERTY_LIST_COLUMNS, { count: "exact" }),
    countryOption.dbValues,
  )
    .gte("price", priceFrom)
    .lte("price", priceTo);
  if (marketType !== null) query = query.eq("new_build", marketType === "true");

  if (regionScope)
    query = query
      .in("province", regionScope.provinces)
      .in("town", cityScope ? cityScope.aliases : regionScope.towns);
  if (locationParam.length && !expandedLocations.length)
    return { notFound: true };

  if (typeList.length === 1) {
    query = query.ilike("type", typeList[0]);
  } else if (typeList.length > 1) {
    query = query.or(typeList.map((t) => `type.ilike.${t}`).join(","));
  }
  //asas
  if (hasBathsFilter) {
    if (bathsExact.length > 0) {
      query = query.in("baths", bathsExact);
    } else {
      query = query.gte("baths", bathsFrom).lte("baths", bathsTo);
    }
  }

  if (hasBedsFilter) {
    if (bedsExact.length > 0) {
      query = query.in("beds", bedsExact);
    } else {
      query = query.gte("beds", bedsFrom).lte("beds", bedsTo);
    }
  }

  if (locationParam.length > 0) {
    const townLikeClauses = selectedTowns
      .map((t) => escapeLikeValue(t))
      .filter(Boolean)
      .map((t) => `town.ilike.${t}`);

    const regionNames = [...selectedProvinces, ...selectedCoasts];

    if (selectedTowns.length > 0 && regionNames.length > 0) {
      const provinceClause = `province.in.(${regionNames.map((p) => `"${p}"`).join(",")})`;
      query = query.or([...townLikeClauses, provinceClause].join(","));
    } else if (selectedTowns.length > 0) {
      query = query.or(townLikeClauses.join(","));
    } else if (regionNames.length > 0) {
      query = query.in("province", regionNames);
    }
  } else if (provincesParam?.length) {
    query = query.in("province", provincesParam);
  }

  // Rank the full filtered result set before pagination.
  if (sort !== "price_asc" && sort !== "price_desc") {
    query = query.order("onesta_featured", {
      ascending: false,
      nullsFirst: false,
    });
  }

  query = query
    .order("price", { ascending: sort !== "price_desc" })
    .order("id", { ascending: true })
    .range(from, to);

  const { data: properties, count, error } = await query;

  // PostgREST reports a requested range beyond the last row as HTTP 416.
  if (error?.code === "PGRST103") return { notFound: true };
  if (error) throw new Error("Property catalogue query failed");

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  if (page > totalPages || (totalCount === 0 && hasFilters(context.query)))
    return { notFound: true };

  const currentPage = Math.min(page, totalPages);

  return {
    props: {
      properties: (properties ?? []) as unknown as Property[],
      country: countryOption.label,
      ...(regionScope ? { regionSlug: regionScope.slug } : {}),
      ...(cityScope ? { citySlug: cityScope.slug } : {}),
      totalCount,
      totalPages,
      currentPage,
      perPage: limit,
      query: context.query as Record<string, string | string[]>,
    },
  };
};

function validFilters(query: Record<string, any>) {
  for (const [key, value] of Object.entries(query)) {
    if (
      ["country", "title", "city", "page"].includes(key) ||
      /^(utm_[a-z_]+|gclid|fbclid|msclkid|_gl)$/.test(key)
    )
      continue;
    if (
      !FILTER_KEYS.includes(key) ||
      typeof value !== "string" ||
      value.length > 500
    )
      return false;
    if (["baths", "beds"].includes(key) && !/^\d+(,\d+)*$/.test(value))
      return false;
    if (
      /^(price|beds|baths)(Min|Max)$/.test(key) &&
      (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value)))
    )
      return false;
    if (
      key === "sort" &&
      !["recommended", "price_asc", "price_desc"].includes(value)
    )
      return false;
    if (key === "market" && !["true", "false"].includes(value)) return false;
    if (key === "type" && !/^[a-zA-Z ,/-]+$/.test(value)) return false;
    if (key === "location" && !/^[a-zA-Z0-9_, -]+$/.test(value)) return false;
  }
  for (const key of ["price", "beds", "baths"]) {
    if (
      query[key + "Min"] !== undefined &&
      query[key + "Max"] !== undefined &&
      Number(query[key + "Min"]) > Number(query[key + "Max"])
    )
      return false;
  }
  return true;
}
