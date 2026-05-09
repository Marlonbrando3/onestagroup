import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import locationsData from "@/data/locations.json";
import MiniHomeView from "../../../components/SearchEngine/MiniHomeView";
import HeaderListings from "../../../components/HeaderListings";
import SearchEngine from "../../../components/SearchEngine/SearchEngine";
import Footer from "../../../components/Footer";
import ContactFormMain from "../../../components/ContactFormMain";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Consultation from "@/components/consulatation/consultation";
import RecommendedOffersPopup from "../../../components/SearchEngine/RecommendedOffersPopup";

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
  surface_built: number;
  pool: boolean;
  headerAdvertisement: string;
  vacantFromDate: string | null;
  updated_at: string;
  country: string;
}

interface PageProps {
  properties: Property[];
  country: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  query: Record<string, string | string[]>;
}

export default function ListingsPage(props: PageProps) {
  const router = useRouter();
  const { country } = router.query;

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
    mobileButtonSearchEngine.current.innerHTML = next ? "Zamknij" : "Filtry";
  };

  const title = `Nieruchomości ${country.toUpperCase()}`;

  return (
    <div className="bg-gray-100/[0.3] w-full overflow-x-clip">
      <Head>
        <title>{title}</title>
      </Head>
      <WhatsAppButton />
      <Consultation
        handleConsultationPopUp={handleConsultationPopUp}
        ConsultationsShowed={consultationOpen}
      />
      <HeaderListings
        handleConsultationPopUp={handleConsultationPopUp}
        handleShowOffersPopup={() => {
          setShowOffersPopup(true);
          hasShownPopupRef.current = false;
        }}
      />
      <MiniHomeView />
      <RecommendedOffersPopup
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
      />

      <div ref={lastElementRef} style={{ height: 50 }} />

      {loadingMore && (
        <div className="flex items-center justify-center gap-2 mb-[50px]">
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce" />
        </div>
      )}

      <ContactFormMain />
      <Footer />
    </div>
  );
}

function getAllDescendants(id: string): string[] {
  const children = locationsData.filter((l) => l.parentId === id);
  return [id, ...children.flatMap((child) => getAllDescendants(child.id))];
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const { country } = context.params as { country: string };
  const page = Math.max(1, parseInt((context.query.page as string) || "1"));
  const limit = 20;
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

  const locationParam = location ? String(location).split(",") : [];
  const expandedIds = [
    ...new Set(locationParam.flatMap((id) => getAllDescendants(id))),
  ];

  const selectedTowns = expandedIds
    .map((id) => locationsData.find((l) => l.id === id))
    .filter((l) => l?.type === "town")
    .map((l) => l!.name);

  const selectedProvinces = expandedIds
    .map((id) => locationsData.find((l) => l.id === id))
    .filter((l) => l?.type === "province")
    .map((l) => l!.name);

  let orderColumn = "price";
  let orderAscending = true;

  if (sort === "price_desc") {
    orderColumn = "price";
    orderAscending = false;
  }

  if (!supabaseServer) {
    return {
      props: {
        properties: [],
        country,
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        perPage: 18,
        query: context.query as Record<string, string | string[]>,
      },
    };
  }

  let query = supabaseServer
    .from("properties")
    .select("*", { count: "exact" })
    .gte("price", priceFrom)
    .lte("price", priceTo)
    .not("images", "is", null)
    .neq("images", "[]")
    .in("new_build", marketType !== null ? [marketType] : [true, false])
    .order(orderColumn, { ascending: orderAscending })
    .range(from, to);

  if (typeList.length === 1) {
    query = query.ilike("type", typeList[0]);
  } else if (typeList.length > 1) {
    query = query.or(typeList.map((t) => `type.ilike.${t}`).join(","));
  }
  //asas
  if (bathsExact.length > 0) {
    query = query.in("baths", bathsExact);
  } else {
    query = query.gte("baths", bathsFrom).lte("baths", bathsTo);
  }

  if (bedsExact.length > 0) {
    query = query.in("beds", bedsExact);
  } else {
    query = query.gte("beds", bedsFrom).lte("beds", bedsTo);
  }

  if (locationParam.length > 0) {
    if (selectedTowns.length > 0 && selectedProvinces.length > 0) {
      query = query.or(
        `town.in.(${selectedTowns.map((t) => `"${t}"`).join(",")}),province.in.(${selectedProvinces.map((p) => `"${p}"`).join(",")})`,
      );
    } else if (selectedTowns.length > 0) {
      query = query.in("town", selectedTowns);
    } else if (selectedProvinces.length > 0) {
      query = query.in("province", selectedProvinces);
    }
  } else {
    query = query.in(
      "province",
      provincesParam ?? ["Alicante", "Murcia", "Malaga"],
    );
  }

  const { data: properties, count, error } = await query;

  if (error) {
    console.error("Supabase query error:", error.message);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(page, totalPages);

  return {
    props: {
      properties: properties ?? [],
      country,
      totalCount,
      totalPages,
      currentPage,
      perPage: limit,
      query: context.query as Record<string, string | string[]>,
    },
  };
};
