import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaBath,
  FaBed,
  FaChartBar,
  FaCheck,
  FaCloudUploadAlt,
  FaDatabase,
  FaImages,
  FaListUl,
  FaPlus,
  FaRegImage,
  FaRulerCombined,
  FaSave,
  FaSearch,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled } from "@/lib/onesariFeature";

type MainTab = "dashboard" | "offers" | "add" | "imports";
type AddTab = "data" | "images";
type Market = "pierwotny" | "wtórny";
type PropertyType = "apartament" | "bungalow" | "szeregówka" | "penthouse" | "dom";
type SourceFilter = "all" | "Metainmo XML" | "Secondary XML" | "Onesta Base";

type ListingForm = {
  country: string;
  city: string;
  coast: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  distanceToSeaM: string;
  price: string;
  market: Market;
  propertyType: PropertyType;
  features: string[];
  availableFrom: string;
  title: string;
  descriptionPl: string;
  descriptionEn: string;
};

type Listing = Omit<ListingForm, "distanceToSeaM" | "price"> & {
  id: string;
  ref: string;
  source: "Metainmo XML" | "Secondary XML" | "Onesta Base";
  distanceToSeaM: number | null;
  price: number | null;
  currency: string;
  imageUrl: string;
  imagesCount: number;
  createdAt: string;
};

type ImageDraft = {
  id: string;
  file: File;
  name: string;
  size: number;
  url: string;
};

type CloudinarySignature = {
  folder: string;
  overwrite: string;
  public_id: string;
  timestamp: number;
  signature: string;
};

type CloudinarySignatureResponse = {
  apiKey: string;
  cloudName: string;
  uploads: CloudinarySignature[];
};

type CloudinaryUploadResponse = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  url?: string;
  version?: number;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
  error?: {
    message?: string;
  };
};

type SavedCloudinaryImage = {
  url: string | null;
  provider: "cloudinary";
  order: number;
  cloudinary_asset_id: string | null;
  cloudinary_public_id: string | null;
  cloudinary_version: number | null;
  original_file_name: string;
  bytes: number | null;
  format: string | null;
  width: number | null;
  height: number | null;
};

type SourceCounts = {
  metainmo: number | null;
  secondary: number | null;
  onesta: number | null;
};

type ImportKind = "metainmo" | "secondary";
type ImportConfirmation = {
  kind: ImportKind;
  label: string;
} | null;
type ImportProgressState = {
  kind: ImportKind;
  percent: number;
  processed: number | null;
  total: number | null;
  stage: string;
  message: string;
  error?: boolean;
};

type TextField = Exclude<keyof ListingForm, "features">;

const METAINMO_PAGE_SIZE = 20;
const SECONDARY_PAGE_SIZE = 20;
const ONESTA_PAGE_SIZE = 20;
const ALL_PAGE_SIZE = 20;
const emptySourceCounts: SourceCounts = {
  metainmo: null,
  secondary: null,
  onesta: null,
};

const markets: Market[] = ["pierwotny", "wtórny"];
const propertyTypes: PropertyType[] = [
  "apartament",
  "bungalow",
  "szeregówka",
  "penthouse",
  "dom",
];
const countryOptions = ["Hiszpania", "Cypr", "Dominikana"];
const coastOptionsByCountry: Record<string, string[]> = {
  Hiszpania: ["Costa Blanca", "Costa del Sol", "Costa Calida", "Costa de Almeria"],
  Cypr: ["Cypr Południowy"],
  Dominikana: ["Samana"],
};

const featureOptions = [
  "ogród",
  "prywatny ogród",
  "basen",
  "blisko sklepów",
  "blisko restauracji i barów",
  "winda",
  "parking",
  "garaż",
  "blisko do morza",
  "widok na morze",
];

const emptyForm: ListingForm = {
  country: "Hiszpania",
  city: "",
  coast: "Costa Blanca",
  area: "",
  bedrooms: "",
  bathrooms: "",
  distanceToSeaM: "",
  price: "",
  market: "pierwotny",
  propertyType: "apartament",
  features: [],
  availableFrom: "",
  title: "",
  descriptionPl: "",
  descriptionEn: "",
};

const initialListings: Listing[] = [
  {
    ...emptyForm,
    id: "one-1",
    city: "Torrevieja",
    coast: "Costa Blanca",
    area: "82",
    bedrooms: "2",
    bathrooms: "2",
    distanceToSeaM: 350,
    market: "pierwotny",
    propertyType: "apartament",
    features: ["basen", "parking", "blisko do morza"],
    availableFrom: "2026-09-01",
    ref: "MTI-24110",
    title: "Apartament w nowej inwestycji",
    descriptionPl: "Jasny apartament blisko morza.",
    descriptionEn: "Bright apartment close to the sea.",
    source: "Metainmo XML",
    price: 299000,
    currency: "EUR",
    imageUrl: "/costablanca.webp",
    imagesCount: 8,
    createdAt: "2026-06-10",
  },
  {
    ...emptyForm,
    id: "one-2",
    city: "Marbella",
    coast: "Costa del Sol",
    area: "134",
    bedrooms: "3",
    bathrooms: "2",
    distanceToSeaM: 900,
    market: "wtórny",
    propertyType: "penthouse",
    features: ["widok na morze", "winda", "garaż"],
    availableFrom: "2026-07-15",
    ref: "SEC-91824",
    title: "Penthouse z widokiem na morze",
    descriptionPl: "Gotowy penthouse z dużym tarasem.",
    descriptionEn: "Move-in ready penthouse with a large terrace.",
    source: "Secondary XML",
    price: 685000,
    currency: "EUR",
    imageUrl: "/mini_bg_about_us.webp",
    imagesCount: 12,
    createdAt: "2026-06-10",
  },
];

export const getServerSideProps: GetServerSideProps = async () => {
  if (!isOnesariEnabled()) {
    return { notFound: true };
  }

  return { props: {} };
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function readJsonResponse<T>(response: Response, fallbackMessage: string) {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error(
      response.status === 413
        ? "Za duża paczka zdjęć dla tego endpointu. Zmniejsz rozmiar plików albo wyślij mniej zdjęć naraz."
        : fallbackMessage,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      response.status === 413
        ? "Za duża paczka zdjęć dla tego endpointu. Zmniejsz rozmiar plików albo wyślij mniej zdjęć naraz."
        : `${fallbackMessage} (${response.status})`,
    );
  }
}

function responseError(
  response: Response,
  payload: { error?: string } | null | undefined,
  fallbackMessage: string,
) {
  if (payload?.error) return payload.error;
  if (response.status === 413) {
    return "Za duża paczka zdjęć dla tego endpointu. Zmniejsz rozmiar plików albo wyślij mniej zdjęć naraz.";
  }
  if (response.status === 408 || response.status === 504) {
    return "Upload trwał zbyt długo. Spróbuj ponownie z mniejszymi plikami.";
  }
  return `${fallbackMessage} (${response.status})`;
}

function formatPrice(price: number | null, currency = "EUR") {
  if (!price) return "Cena do ustalenia";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function numberFromDraft(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function stripHtml(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textFromDescription(value: any) {
  if (!value) return "";
  if (typeof value === "string") return stripHtml(value);
  return stripHtml(value.pl || value.en || value.es || value["#text"] || "");
}

function imageUrlFromProperty(images: any) {
  const list = Array.isArray(images) ? images : images ? [images] : [];
  const first = list[0];
  if (!first) return "/mini_bg_about_us.webp";
  const url =
    typeof first === "string"
      ? first
      : (
    first.url ||
    first.src ||
    first.href ||
    first["@_url"] ||
    first["url_@"] ||
    first.image ||
    "/mini_bg_about_us.webp"
  );
  if (typeof url === "string" && url.startsWith("ftp://")) {
    const fileName = decodeURIComponent(url.split("/").pop() || "");
    if (fileName) return `/api/onesari/ftp-image?file=${encodeURIComponent(fileName)}`;
  }
  return url;
}

function normalizePropertyType(value: unknown): PropertyType {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("bungalow")) return "bungalow";
  if (normalized.includes("terraced") || normalized.includes("szereg")) return "szeregówka";
  if (normalized.includes("penthouse")) return "penthouse";
  if (normalized.includes("villa") || normalized.includes("house") || normalized.includes("dom")) {
    return "dom";
  }
  return "apartament";
}

function displaySourceFromProperty(source: unknown): Listing["source"] {
  if (source === "SECONDARY_XML") return "Secondary XML";
  if (source === "ONESTA_FTP") return "Onesta Base";
  return "Metainmo XML";
}

function mapPropertyToListing(
  property: any,
  source: "Metainmo XML" | "Secondary XML" | "Onesta Base" = displaySourceFromProperty(property?.source),
): Listing {
  const descriptionPl = textFromDescription(property.descriptions);
  const title =
    stripHtml(property.title || property.headerAdvertisement) ||
    `${normalizePropertyType(property.type)} ${property.town || ""}`.trim() ||
    (source === "Metainmo XML"
      ? "Oferta Metainmo"
      : source === "Secondary XML"
        ? "Oferta Secondary MLS"
        : "Oferta Onesta Base");

  return {
    ...emptyForm,
    id: String(property.id || property.external_id || property.ref || uid("property")),
    ref: String(property.ref || property.external_id || "-"),
    country: String(property.country || ""),
    city: String(property.town || ""),
    coast: String(property.province || ""),
    area: property.surface_built ? String(property.surface_built) : "",
    bedrooms: property.beds ? String(property.beds) : "",
    bathrooms: property.baths ? String(property.baths) : "",
    distanceToSeaM: Number(property.distance_to_sea_m || 0) || null,
    market: property.new_build ? "pierwotny" : "wtórny",
    propertyType: normalizePropertyType(property.type),
    features: Array.isArray(property.features) ? property.features : [],
    availableFrom: property.date ? String(property.date).slice(0, 10) : "",
    title,
    descriptionPl,
    descriptionEn: textFromDescription(property.descriptions?.en || ""),
    source,
    price: Number(property.price || 0) || null,
    currency: String(property.currency || "EUR"),
    imageUrl: imageUrlFromProperty(property.images),
    imagesCount: Array.isArray(property.images) ? property.images.length : property.images ? 1 : 0,
    createdAt: property.updated_at ? String(property.updated_at).slice(0, 10) : "",
  };
}

function CountValue({
  count,
  error,
  loading,
}: {
  count: number | null;
  error?: string;
  loading: boolean;
}) {
  if (count === null && loading) {
    return <span className="countLoader" aria-label="Ładowanie liczby" />;
  }

  if (count === null && error) {
    return (
      <span className="countError" title={error}>
        !
      </span>
    );
  }

  return <>{count ?? "–"}</>;
}

export default function OnesariPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>("dashboard");
  const [addTab, setAddTab] = useState<AddTab>("data");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [notice, setNotice] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [importing, setImporting] = useState<ImportKind | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgressState | null>(null);
  const [importConfirmation, setImportConfirmation] =
    useState<ImportConfirmation>(null);
  const [importConfirmCountdown, setImportConfirmCountdown] = useState(0);
  const [sourceTotals, setSourceTotals] = useState<SourceCounts>(emptySourceCounts);
  const [isSourceTotalsLoading, setIsSourceTotalsLoading] = useState(true);
  const [sourceTotalsError, setSourceTotalsError] = useState("");
  const [sourceTotalsRefreshKey, setSourceTotalsRefreshKey] = useState(0);
  const [form, setForm] = useState<ListingForm>(emptyForm);
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [isSavingListing, setIsSavingListing] = useState(false);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allPage, setAllPage] = useState(1);
  const [allTotal, setAllTotal] = useState<number | null>(null);
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [allError, setAllError] = useState("");
  const [metainmoListings, setMetainmoListings] = useState<Listing[]>([]);
  const [metainmoPage, setMetainmoPage] = useState(1);
  const [metainmoTotal, setMetainmoTotal] = useState<number | null>(null);
  const [isMetainmoLoading, setIsMetainmoLoading] = useState(false);
  const [metainmoError, setMetainmoError] = useState("");
  const [metainmoRefreshKey, setMetainmoRefreshKey] = useState(0);
  const [secondaryListings, setSecondaryListings] = useState<Listing[]>([]);
  const [secondaryPage, setSecondaryPage] = useState(1);
  const [secondaryTotal, setSecondaryTotal] = useState<number | null>(null);
  const [isSecondaryLoading, setIsSecondaryLoading] = useState(false);
  const [secondaryError, setSecondaryError] = useState("");
  const [secondaryRefreshKey, setSecondaryRefreshKey] = useState(0);
  const [onestaListings, setOnestaListings] = useState<Listing[]>([]);
  const [onestaPage, setOnestaPage] = useState(1);
  const [onestaTotal, setOnestaTotal] = useState<number | null>(null);
  const [isOnestaLoading, setIsOnestaLoading] = useState(false);
  const [onestaError, setOnestaError] = useState("");
  const [onestaRefreshKey, setOnestaRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      if (!canAccessOnesari(data.user.email)) {
        router.push("/login");
        return;
      }
      setIsCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    if (isCheckingAuth) return;

    let isMounted = true;
    setIsSourceTotalsLoading(true);
    setSourceTotalsError("");

    supabase.auth
      .getSession()
      .then(async ({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Brak aktywnej sesji");

        const response = await fetch("/api/onesari/counts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać liczników");
        }
        return payload as Record<keyof SourceCounts, number>;
      })
      .then((counts) => {
        if (!isMounted) return;
        setSourceTotals({
          metainmo: counts.metainmo ?? 0,
          secondary: counts.secondary ?? 0,
          onesta: counts.onesta ?? 0,
        });
        setMetainmoTotal(counts.metainmo ?? 0);
        setSecondaryTotal(counts.secondary ?? 0);
        setOnestaTotal(counts.onesta ?? 0);
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setSourceTotalsError(error?.message || "Nie udało się pobrać liczników");
        setSourceTotals(emptySourceCounts);
      })
      .finally(() => {
        if (isMounted) setIsSourceTotalsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isCheckingAuth, sourceTotalsRefreshKey]);

  useEffect(() => {
    if (isCheckingAuth || mainTab !== "offers" || sourceFilter !== "all") return;

    let isMounted = true;
    setIsAllLoading(true);
    setAllError("");

    supabase.auth
      .getSession()
      .then(async ({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Brak aktywnej sesji");

        const response = await fetch(`/api/onesari/all?page=${allPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać ogłoszeń");
        }
        return payload as { data: any[]; count: number };
      })
      .then(({ data, count }) => {
        if (!isMounted) return;
        setAllListings((data || []).map((property) => mapPropertyToListing(property)));
        setAllTotal(count ?? 0);
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setAllError(error?.message || "Nie udało się pobrać ogłoszeń");
        setAllListings([]);
        setAllTotal(0);
      })
      .finally(() => {
        if (isMounted) setIsAllLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [allPage, isCheckingAuth, mainTab, sourceFilter, sourceTotalsRefreshKey]);

  useEffect(() => {
    if (!importConfirmation) return;

    setImportConfirmCountdown(3);
    const interval = window.setInterval(() => {
      setImportConfirmCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [importConfirmation]);

  useEffect(() => {
    if (isCheckingAuth || mainTab !== "offers" || sourceFilter !== "Metainmo XML") return;

    let isMounted = true;
    setIsMetainmoLoading(true);
    setMetainmoError("");

    supabase.auth
      .getSession()
      .then(async ({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Brak aktywnej sesji");

        const response = await fetch(`/api/onesari/metainmo?page=${metainmoPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać Metainmo");
        }
        return payload as { data: any[]; count: number };
      })
      .then(({ data, count }) => {
        if (!isMounted) return;
        setMetainmoListings((data || []).map((property) => mapPropertyToListing(property)));
        setMetainmoTotal(count ?? 0);
        setSourceTotals((current) => ({ ...current, metainmo: count ?? 0 }));
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setMetainmoError(error?.message || "Nie udało się pobrać Metainmo");
        setMetainmoListings([]);
        setMetainmoTotal(0);
      })
      .finally(() => {
        if (isMounted) setIsMetainmoLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isCheckingAuth, mainTab, sourceFilter, metainmoPage, metainmoRefreshKey]);

  useEffect(() => {
    if (isCheckingAuth || mainTab !== "offers" || sourceFilter !== "Secondary XML") return;

    let isMounted = true;
    setIsSecondaryLoading(true);
    setSecondaryError("");

    supabase.auth
      .getSession()
      .then(async ({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Brak aktywnej sesji");

        const response = await fetch(`/api/onesari/secondary?page=${secondaryPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać Secondary MLS");
        }
        return payload as { data: any[]; count: number };
      })
      .then(({ data, count }) => {
        if (!isMounted) return;
        setSecondaryListings((data || []).map((property) => mapPropertyToListing(property, "Secondary XML")));
        setSecondaryTotal(count ?? 0);
        setSourceTotals((current) => ({ ...current, secondary: count ?? 0 }));
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setSecondaryError(error?.message || "Nie udało się pobrać Secondary MLS");
        setSecondaryListings([]);
        setSecondaryTotal(0);
      })
      .finally(() => {
        if (isMounted) setIsSecondaryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isCheckingAuth, mainTab, sourceFilter, secondaryPage, secondaryRefreshKey]);

  useEffect(() => {
    if (isCheckingAuth || mainTab !== "offers" || sourceFilter !== "Onesta Base") return;

    let isMounted = true;
    setIsOnestaLoading(true);
    setOnestaError("");

    supabase.auth
      .getSession()
      .then(async ({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("Brak aktywnej sesji");

        const response = await fetch(`/api/onesari/onesta?page=${onestaPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać Onesta Base");
        }
        return payload as { data: any[]; count: number };
      })
      .then(({ data, count }) => {
        if (!isMounted) return;
        setOnestaListings((data || []).map((property) => mapPropertyToListing(property, "Onesta Base")));
        setOnestaTotal(count ?? 0);
        setSourceTotals((current) => ({ ...current, onesta: count ?? 0 }));
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setOnestaError(error?.message || "Nie udało się pobrać Onesta Base");
        setOnestaListings([]);
        setOnestaTotal(0);
      })
      .finally(() => {
        if (isMounted) setIsOnestaLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isCheckingAuth, mainTab, sourceFilter, onestaPage, onestaRefreshKey]);

  const filteredListings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const baseListings =
      sourceFilter === "Metainmo XML"
        ? metainmoListings
        : sourceFilter === "Secondary XML"
          ? secondaryListings
          : sourceFilter === "Onesta Base"
            ? onestaListings
            : allListings;

    return baseListings.filter((listing) => {
      if (
        sourceFilter !== "all" &&
        sourceFilter !== "Metainmo XML" &&
        sourceFilter !== "Secondary XML" &&
        sourceFilter !== "Onesta Base" &&
        listing.source !== sourceFilter
      ) {
        return false;
      }
      if (!normalized) return true;
      return [
        listing.ref,
        listing.title,
        listing.city,
        listing.country,
        listing.coast,
        listing.market,
        listing.propertyType,
        listing.source,
        listing.features.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [allListings, metainmoListings, onestaListings, query, secondaryListings, sourceFilter]);

  const sourceCounts = useMemo(
    () => ({
      metainmo: metainmoTotal ?? sourceTotals.metainmo,
      secondary: secondaryTotal ?? sourceTotals.secondary,
      onesta: onestaTotal ?? sourceTotals.onesta,
    }),
    [metainmoTotal, onestaTotal, secondaryTotal, sourceTotals],
  );

  const metainmoTotalPages = Math.max(
    1,
    Math.ceil((metainmoTotal ?? 0) / METAINMO_PAGE_SIZE),
  );
  const secondaryTotalPages = Math.max(
    1,
    Math.ceil((secondaryTotal ?? 0) / SECONDARY_PAGE_SIZE),
  );
  const onestaTotalPages = Math.max(
    1,
    Math.ceil((onestaTotal ?? 0) / ONESTA_PAGE_SIZE),
  );

  const allSourcesCount =
    sourceCounts.metainmo === null ||
    sourceCounts.secondary === null ||
    sourceCounts.onesta === null
      ? null
      : sourceCounts.metainmo + sourceCounts.secondary + sourceCounts.onesta;

  const allTotalPages = Math.max(
    1,
    Math.ceil((allTotal ?? allSourcesCount ?? 0) / ALL_PAGE_SIZE),
  );

  const sourceFilters: Array<{ label: string; value: SourceFilter; count: number | null }> = [
    { label: "Wszystkie", value: "all", count: allSourcesCount },
    { label: "Metainmo", value: "Metainmo XML", count: sourceCounts.metainmo },
    { label: "Secondary MLS", value: "Secondary XML", count: sourceCounts.secondary },
    { label: "Onesta Base", value: "Onesta Base", count: sourceCounts.onesta },
  ];

  const totalVisibleCount =
    sourceFilter === "all"
      ? (allTotal ?? allSourcesCount ?? 0)
      : sourceFilter === "Metainmo XML"
      ? (metainmoTotal ?? 0)
      : sourceFilter === "Secondary XML"
        ? (secondaryTotal ?? 0)
        : sourceFilter === "Onesta Base"
          ? (onestaTotal ?? 0)
          : filteredListings.length;
  const remoteSourceLabel =
    sourceFilter === "all"
      ? "Wszystkie"
      : sourceFilter === "Metainmo XML"
      ? "Metainmo"
      : sourceFilter === "Secondary XML"
        ? "Secondary MLS"
        : sourceFilter === "Onesta Base"
          ? "Onesta Base"
        : "";
  const remoteSourcePage =
    sourceFilter === "all"
      ? allPage
      : sourceFilter === "Metainmo XML"
      ? metainmoPage
      : sourceFilter === "Secondary XML"
        ? secondaryPage
        : onestaPage;
  const remoteSourceTotalPages =
    sourceFilter === "all"
      ? allTotalPages
      : sourceFilter === "Metainmo XML"
      ? metainmoTotalPages
      : sourceFilter === "Secondary XML"
        ? secondaryTotalPages
        : onestaTotalPages;
  const isRemoteSourceLoading =
    sourceFilter === "all"
      ? isAllLoading
      : sourceFilter === "Metainmo XML"
      ? isMetainmoLoading
      : sourceFilter === "Secondary XML"
        ? isSecondaryLoading
        : isOnestaLoading;
  const remoteSourceError =
    sourceFilter === "all"
      ? allError
      : sourceFilter === "Metainmo XML"
      ? metainmoError
      : sourceFilter === "Secondary XML"
        ? secondaryError
        : onestaError;
  const currentCoastOptions = coastOptionsByCountry[form.country] || [];

  function updateField(field: TextField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice("");
  }

  function updateCountry(country: string) {
    const coastOptions = coastOptionsByCountry[country] || [];
    setForm((current) => ({
      ...current,
      country,
      coast: coastOptions.includes(current.coast) ? current.coast : coastOptions[0] || "",
    }));
    setNotice("");
  }

  function toggleFeature(feature: string) {
    setForm((current) => {
      const selected = current.features.includes(feature);
      return {
        ...current,
        features: selected
          ? current.features.filter((item) => item !== feature)
          : [...current.features, feature],
      };
    });
    setNotice("");
  }

  function addFiles(files: FileList | File[]) {
    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: uid("image"),
        file,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      }));

    if (!nextImages.length) return;
    setImages((current) => [...current, ...nextImages]);
    setNotice("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  }

  function moveImageBefore(draggedId: string, targetId: string) {
    if (draggedId === targetId) return;

    setImages((current) => {
      const fromIndex = current.findIndex((image) => image.id === draggedId);
      const toIndex = current.findIndex((image) => image.id === targetId);
      if (
        fromIndex === -1 ||
        toIndex === -1 ||
        fromIndex === toIndex ||
        fromIndex === toIndex - 1
      ) {
        return current;
      }

      const nextImages = [...current];
      const [draggedImage] = nextImages.splice(fromIndex, 1);
      const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      nextImages.splice(insertIndex, 0, draggedImage);
      return nextImages;
    });
  }

  function handleImageDragStart(event: DragEvent<HTMLElement>, imageId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", imageId);
    setDraggedImageId(imageId);
  }

  function handleImageDragOver(event: DragEvent<HTMLElement>, imageId: string) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";

    const activeImageId = draggedImageId || event.dataTransfer.getData("text/plain");
    if (activeImageId) moveImageBefore(activeImageId, imageId);
  }

  function handleImageDrop(event: DragEvent<HTMLElement>, imageId: string) {
    event.preventDefault();
    event.stopPropagation();

    const activeImageId = draggedImageId || event.dataTransfer.getData("text/plain");
    if (activeImageId) moveImageBefore(activeImageId, imageId);
    setDraggedImageId(null);
  }

  function handleImageDragEnd() {
    setDraggedImageId(null);
  }

  function removeImage(imageId: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.url);
      return current.filter((item) => item.id !== imageId);
    });
  }

  function resetDraft() {
    setForm(emptyForm);
    setImages([]);
    setAddTab("data");
  }

  function requestXmlImport(kind: ImportKind) {
    setImportConfirmation({
      kind,
      label: kind === "metainmo" ? "Metainmo" : "Secondary MLS",
    });
  }

  function cancelXmlImport() {
    setImportConfirmation(null);
    setImportConfirmCountdown(0);
  }

  function confirmXmlImport() {
    if (!importConfirmation || importConfirmCountdown > 0) return;
    const kind = importConfirmation.kind;
    setImportConfirmation(null);
    runXmlImport(kind);
  }

  async function runXmlImport(kind: ImportKind) {
    const endpoint =
      kind === "metainmo"
        ? "/api/metainmoToSupabase"
        : "/api/secondaryToSupabase";
    setImporting(kind);
    setImportProgress({
      kind,
      percent: 2,
      processed: 0,
      total: null,
      stage: "start",
      message:
        kind === "metainmo"
          ? "Uruchamiam import Metainmo..."
          : "Uruchamiam import Secondary MLS...",
    });
    setImportStatus(
      kind === "metainmo"
        ? "Aktualizuję Metainmo..."
        : "Aktualizuję Secondary MLS...",
    );

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "x-import-progress": "1",
        },
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalEvent: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line);

            if (event.type === "progress") {
              setImportProgress({
                kind,
                percent: Number(event.percent ?? 0),
                processed:
                  typeof event.processed === "number" ? event.processed : null,
                total: typeof event.total === "number" ? event.total : null,
                stage: String(event.stage || ""),
                message: String(event.message || ""),
              });
              setImportStatus(String(event.message || ""));
              continue;
            }

            finalEvent = event;
          }
        }

        if (buffer.trim()) {
          finalEvent = JSON.parse(buffer);
        }

        if (!finalEvent) {
          throw new Error("Brak końcowej odpowiedzi importu");
        }

        if (!response.ok) {
          const errorMessage =
            finalEvent?.error ||
            finalEvent?.details ||
            finalEvent?.message ||
            "nieznany błąd";
          setImportProgress((current) =>
            current && current.kind === kind
              ? {
                  ...current,
                  error: true,
                  message: `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${errorMessage}`,
                }
              : current,
          );
          setImportStatus(
            `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${errorMessage}`,
          );
          return;
        }

        if (finalEvent.type === "error" || finalEvent.ok === false) {
          const errorMessage =
            finalEvent?.error || finalEvent?.details || "nieznany błąd";
          setImportProgress((current) =>
            current && current.kind === kind
              ? {
                  ...current,
                  error: true,
                  message: `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${errorMessage}`,
                }
              : current,
          );
          setImportStatus(
            `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${errorMessage}`,
          );
          return;
        }

        const data = finalEvent?.data ?? finalEvent ?? {};
        setImportProgress((current) =>
          current && current.kind === kind
            ? {
                ...current,
                percent: 100,
                processed:
                  typeof current.total === "number" ? current.total : current.processed,
                message:
                  kind === "metainmo"
                    ? `Metainmo OK: XML ${data?.total_xml ?? 0}, zapisane ${
                        data?.total_saved ?? data?.total_after_dedupe ?? 0
                      }, usunięte stare ${data?.total_deleted_stale ?? 0}.`
                    : `Secondary MLS OK: XML ${data?.total_xml ?? 0}, zapisane ${
                        data?.total_saved ?? 0
                      }.`,
              }
            : current,
        );

        if (kind === "metainmo") {
          setImportStatus(
            `Metainmo OK: XML ${data?.total_xml ?? 0}, zapisane ${
              data?.total_saved ?? data?.total_after_dedupe ?? 0
            }, usunięte stare ${data?.total_deleted_stale ?? 0}.`,
          );
          setMetainmoPage(1);
          setMetainmoRefreshKey((current) => current + 1);
          setSourceTotalsRefreshKey((current) => current + 1);
        } else if (kind === "secondary") {
          setImportStatus(
            `Secondary MLS OK: XML ${data?.total_xml ?? 0}, zapisane ${
              data?.total_saved ?? 0
            }, usunięte stare ${data?.total_deleted_sec ?? 0}.`,
          );
          setSecondaryPage(1);
          setSecondaryRefreshKey((current) => current + 1);
          setSourceTotalsRefreshKey((current) => current + 1);
        }
        return;
      }

      if (!response.ok) {
        const raw = await response.text();
        let data: any = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          data = { message: raw || "Odpowiedź bez JSON" };
        }
        setImportStatus(
          `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${
            data?.error || data?.details || "nieznany błąd"
          }`,
        );
        setImportProgress((current) =>
          current && current.kind === kind
            ? {
                ...current,
                error: true,
                message: `${kind === "metainmo" ? "Metainmo" : "Secondary MLS"}: błąd - ${
                  data?.error || data?.details || "nieznany błąd"
                }`,
              }
            : current,
        );
        return;
      }
    } catch (error: any) {
      setImportStatus(error?.message || "Import nie powiódł się.");
      setImportProgress((current) =>
        current && current.kind === kind
          ? {
              ...current,
              error: true,
              message: error?.message || "Import nie powiódł się.",
            }
          : current,
      );
    } finally {
      setImporting(null);
    }
  }

  const activeImportProgress = importing ? importProgress : null;

  function renderImportFeedback() {
    if (!importStatus && !activeImportProgress) return null;

    const percent = Math.max(0, Math.min(100, Number(activeImportProgress?.percent ?? 0)));
    const toneClass = activeImportProgress?.error ? "error" : "";

    return (
      <div className={`importFeedback ${toneClass}`}>
        {activeImportProgress ? (
          <>
            <div className="importProgressMeta">
              <strong>{activeImportProgress.message}</strong>
              <span>
                {typeof activeImportProgress.processed === "number" &&
                typeof activeImportProgress.total === "number"
                  ? `${activeImportProgress.processed}/${activeImportProgress.total}`
                  : `${percent}%`}
              </span>
            </div>
            <div
              aria-hidden="true"
              className={`importProgressTrack ${toneClass}`}
            >
              <div
                className={`importProgressFill ${toneClass}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        ) : null}
        {importStatus ? <p className="importStatus">{importStatus}</p> : null}
      </div>
    );
  }

  async function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingListing) return;

    const requiredFields: TextField[] = [
      "country",
      "city",
      "coast",
      "area",
      "bedrooms",
      "bathrooms",
      "availableFrom",
      "title",
      "descriptionPl",
      "descriptionEn",
    ];
    const hasEmptyField = requiredFields.some((field) => !form[field].trim());

    if (hasEmptyField || form.features.length === 0 || images.length === 0) {
      setNotice("Uzupełnij wymagane dane, wybierz atuty i dodaj przynajmniej jeden obraz.");
      return;
    }

    setIsSavingListing(true);
    setNotice("Przygotowuję upload zdjęć do Cloudinary...");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Brak aktywnej sesji");

      const signatureResponse = await fetch("/api/onesari/cloudinary-signature", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadBatchId: uid("manual-upload"),
          files: images.map((image) => ({
            name: image.name,
            size: image.size,
            type: image.file.type,
          })),
        }),
      });
      const signatureData = await readJsonResponse<CloudinarySignatureResponse & { error?: string }>(
        signatureResponse,
        "Nie udało się przygotować uploadu zdjęć",
      );
      if (!signatureResponse.ok) {
        throw new Error(
          responseError(
            signatureResponse,
            signatureData,
            "Nie udało się przygotować uploadu zdjęć",
          ),
        );
      }
      if (!signatureData.uploads?.length || signatureData.uploads.length !== images.length) {
        throw new Error("Cloudinary nie zwrócił podpisów dla wszystkich zdjęć.");
      }

      const uploadedImages: SavedCloudinaryImage[] = [];
      for (const [index, image] of images.entries()) {
        const upload = signatureData.uploads[index];
        const cloudinaryPayload = new FormData();
        cloudinaryPayload.append("file", image.file, image.name);
        cloudinaryPayload.append("api_key", signatureData.apiKey);
        cloudinaryPayload.append("folder", upload.folder);
        cloudinaryPayload.append("overwrite", upload.overwrite);
        cloudinaryPayload.append("public_id", upload.public_id);
        cloudinaryPayload.append("timestamp", String(upload.timestamp));
        cloudinaryPayload.append("signature", upload.signature);

        setNotice(`Wysyłam zdjęcie ${index + 1}/${images.length} do Cloudinary...`);
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          {
            method: "POST",
            body: cloudinaryPayload,
          },
        );
        const uploadData = await readJsonResponse<CloudinaryUploadResponse>(
          uploadResponse,
          `Nie udało się wysłać zdjęcia ${image.name}`,
        );

        if (!uploadResponse.ok || uploadData.error) {
          throw new Error(uploadData.error?.message || `Nie udało się wysłać zdjęcia ${image.name}`);
        }

        const uploadedUrl = uploadData.secure_url || uploadData.url;
        if (!uploadedUrl) {
          throw new Error(`Cloudinary nie zwrócił URL-a dla zdjęcia ${image.name}`);
        }

        uploadedImages.push({
          url: uploadedUrl,
          provider: "cloudinary",
          order: index + 1,
          cloudinary_asset_id: uploadData.asset_id || null,
          cloudinary_public_id: uploadData.public_id || null,
          cloudinary_version: uploadData.version || null,
          original_file_name: image.name,
          bytes: uploadData.bytes || image.size || null,
          format: uploadData.format || null,
          width: uploadData.width || null,
          height: uploadData.height || null,
        });
      }

      setNotice("Zapisuję ofertę w Supabase...");
      const response = await fetch("/api/onesari/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          images: uploadedImages,
        }),
      });
      const data = await readJsonResponse<{ property?: any; error?: string }>(
        response,
        "Nie udało się zapisać oferty",
      );
      if (!response.ok) {
        throw new Error(responseError(response, data, "Nie udało się zapisać oferty"));
      }

      const nextListing = mapPropertyToListing(data.property, "Onesta Base");
      setListings((current) => [nextListing, ...current]);
      setAllListings((current) => [nextListing, ...current]);
      setOnestaListings((current) => [nextListing, ...current]);
      setAllTotal((current) => (current === null ? current : current + 1));
      setOnestaTotal((current) => (current === null ? current : current + 1));
      setSourceTotals((current) => ({
        ...current,
        onesta: current.onesta === null ? current.onesta : current.onesta + 1,
      }));
      setOnestaRefreshKey((current) => current + 1);
      setSourceTotalsRefreshKey((current) => current + 1);
      resetDraft();
      setSourceFilter("Onesta Base");
      setMainTab("offers");
      setNotice("Oferta została zapisana w Supabase, a obrazy trafiły do Cloudinary.");
    } catch (error: any) {
      setNotice(error?.message || "Nie udało się zapisać oferty.");
    } finally {
      setIsSavingListing(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="onesariShell authOnly">
        <section className="authCheck">Sprawdzanie dostępu...</section>
        <style jsx>{`
          .onesariShell {
            background: #f3f6f8;
            color: #17202a;
            min-height: 100vh;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }

          .authCheck {
            padding: 24px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Onesari | Onesta</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="onesariShell">
        <aside className="onesariSidebar" aria-label="Nawigacja Onesari">
          <div className="onesariBrand">
            <div className="onesariMark">O</div>
            <div>
              <strong>Onesari</strong>
              <span>System ogłoszeń</span>
            </div>
          </div>
          <nav className="onesariNav">
            <button
              className={mainTab === "dashboard" ? "active" : ""}
              type="button"
              onClick={() => setMainTab("dashboard")}
            >
              <FaChartBar /> Pulpit
            </button>
            <button
              className={mainTab === "offers" ? "active" : ""}
              type="button"
              onClick={() => setMainTab("offers")}
            >
              <FaListUl /> Ogłoszenia
            </button>
            <button
              className={mainTab === "add" ? "active" : ""}
              type="button"
              onClick={() => setMainTab("add")}
            >
              <FaPlus /> Dodaj ogłoszenie
            </button>
            <button
              className={mainTab === "imports" ? "active" : ""}
              type="button"
              onClick={() => setMainTab("imports")}
            >
              <FaDatabase /> Importy XML
            </button>
          </nav>
          <div className="sourceNav" aria-label="Filtry źródeł">
            <strong>Źródła</strong>
            {sourceFilters.map((filter) => (
              <button
                className={sourceFilter === filter.value ? "active" : ""}
                key={filter.value}
                type="button"
                onClick={() => {
                  setSourceFilter(filter.value);
                  if (filter.value === "all") setAllPage(1);
                  if (filter.value === "Metainmo XML") setMetainmoPage(1);
                  if (filter.value === "Secondary XML") setSecondaryPage(1);
                  if (filter.value === "Onesta Base") setOnestaPage(1);
                  setMainTab("offers");
                }}
              >
                <span>{filter.label}</span>
                <b>
                  <CountValue
                    count={filter.count}
                    error={sourceTotalsError}
                    loading={isSourceTotalsLoading}
                  />
                </b>
              </button>
            ))}
          </div>
        </aside>

        <section className="onesariWorkspace">
          <header className="onesariTopbar">
            <div>
              <p>Onesari</p>
              <h1>Zarządzanie ogłoszeniami</h1>
            </div>
            <button
              className="onesariPrimary"
              type="button"
              onClick={() => {
                setMainTab("add");
                setAddTab("data");
              }}
            >
              <FaPlus /> Dodaj ogłoszenie
            </button>
          </header>

          {mainTab === "dashboard" ? (
            <section className="dashboardPanel" aria-label="Pulpit Onesari">
              <div className="dashboardHero">
                <div>
                  <p>Pulpit</p>
                  <h2>Stan bazy ogłoszeń</h2>
                </div>
                <button
                  className="onesariPrimary"
                  type="button"
                  onClick={() => {
                    setMainTab("add");
                    setAddTab("data");
                  }}
                >
                  <FaPlus /> Dodaj ogłoszenie
                </button>
              </div>

              <section className="sourceGrid dashboardSources" aria-label="Źródła ogłoszeń">
                {sourceFilters.map((filter) => (
                  <button
                    className="sourceCardButton"
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setSourceFilter(filter.value);
                      if (filter.value === "all") setAllPage(1);
                      if (filter.value === "Metainmo XML") setMetainmoPage(1);
                      if (filter.value === "Secondary XML") setSecondaryPage(1);
                      if (filter.value === "Onesta Base") setOnestaPage(1);
                      setMainTab("offers");
                    }}
                  >
                    <span>{filter.label}</span>
                    <strong>
                      <CountValue
                        count={filter.count}
                        error={sourceTotalsError}
                        loading={isSourceTotalsLoading}
                      />
                    </strong>
                  </button>
                ))}
              </section>

              <section className="dashboardActions" aria-label="Szybkie akcje">
                <article>
                  <div>
                    <p>Importy XML</p>
                    <h3>Aktualizacja zewnętrznych źródeł</h3>
                  </div>
                  <div className="importActions compact">
                    <button
                      className="importButton metainmo"
                      disabled={Boolean(importing)}
                      type="button"
                      onClick={() => requestXmlImport("metainmo")}
                    >
                      <FaSyncAlt className={importing === "metainmo" ? "spinning" : ""} />
                      Aktualizuj Metainmo
                    </button>
                    <button
                      className="importButton secondary"
                      disabled={Boolean(importing)}
                      type="button"
                      onClick={() => requestXmlImport("secondary")}
                    >
                      <FaSyncAlt className={importing === "secondary" ? "spinning" : ""} />
                      Aktualizuj Secondary MLS
                    </button>
                  </div>
                  {renderImportFeedback()}
                </article>
              </section>
            </section>
          ) : mainTab === "offers" ? (
            <>
              <section className="sourceGrid" aria-label="Źródła ogłoszeń">
                <article>
                  <span>Wszystkie oferty</span>
                  <strong>
                    <CountValue
                      count={allSourcesCount}
                      error={sourceTotalsError}
                      loading={isSourceTotalsLoading}
                    />
                  </strong>
                </article>
                <article>
                  <span>Metainmo XML</span>
                  <strong>
                    <CountValue
                      count={sourceCounts.metainmo}
                      error={sourceTotalsError}
                      loading={isSourceTotalsLoading}
                    />
                  </strong>
                </article>
                <article>
                  <span>Secondary XML</span>
                  <strong>
                    <CountValue
                      count={sourceCounts.secondary}
                      error={sourceTotalsError}
                      loading={isSourceTotalsLoading}
                    />
                  </strong>
                </article>
                <article>
                  <span>Onesta Base</span>
                  <strong>
                    <CountValue
                      count={sourceCounts.onesta}
                      error={sourceTotalsError}
                      loading={isSourceTotalsLoading}
                    />
                  </strong>
                </article>
              </section>

              <label className="searchBox">
                <FaSearch />
                <input
                  aria-label="Szukaj ogłoszeń"
                  placeholder="Szukaj po tytule, mieście, rynku, źródle..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              {notice ? <p className="onesariNotice">{notice}</p> : null}
              {sourceFilter === "all" ||
              sourceFilter === "Metainmo XML" ||
              sourceFilter === "Secondary XML" ||
              sourceFilter === "Onesta Base" ? (
                <div className="paginationMeta">
                  <span>
                    {remoteSourceLabel}: {totalVisibleCount} ofert · strona{" "}
                    {remoteSourcePage} z {remoteSourceTotalPages}
                  </span>
                  {isRemoteSourceLoading ? <strong>Ładowanie...</strong> : null}
                </div>
              ) : null}
              {remoteSourceError &&
              (sourceFilter === "all" ||
                sourceFilter === "Metainmo XML" ||
                sourceFilter === "Secondary XML" ||
                sourceFilter === "Onesta Base") ? (
                <p className="onesariError">{remoteSourceError}</p>
              ) : null}

              <section className="listingTable" aria-label="Lista ogłoszeń">
                <div className="listingHeader">
                  <span>Ref / zdjęcie</span>
                  <span>Opis</span>
                  <span>Cena</span>
                  <span>Rynek</span>
                  <span>Źródło</span>
                  <span>Obrazy</span>
                </div>
                {filteredListings.map((listing) => (
                  <article className="listingRow" key={listing.id}>
                    <div className="listingIdentity">
                      <img alt="" src={listing.imageUrl} />
                      <div>
                        <span>REF {listing.ref}</span>
                        <strong>{listing.title}</strong>
                        <span>
                          {listing.city}, {listing.country}
                          {listing.coast ? ` · ${listing.coast}` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="listingDescription">
                      <p>{listing.descriptionPl}</p>
                      <div className="listingFacts">
                        <span>
                          <FaRulerCombined /> {listing.area} m2
                        </span>
                        <span>
                          <FaBed /> {listing.bedrooms}
                        </span>
                        <span>
                          <FaBath /> {listing.bathrooms}
                        </span>
                      </div>
                    </div>
                    <strong className="priceCell">{formatPrice(listing.price, listing.currency)}</strong>
                    <span className="pill">{listing.market}</span>
                    <span className="sourcePill">{listing.source}</span>
                    <span className="imageCounter">
                      <FaImages /> {listing.imagesCount}
                    </span>
                  </article>
                ))}
              </section>
              {sourceFilter === "all" ||
              sourceFilter === "Metainmo XML" ||
              sourceFilter === "Secondary XML" ||
              sourceFilter === "Onesta Base" ? (
                <nav className="paginationBar" aria-label={`Paginacja ${remoteSourceLabel}`}>
                  <button
                    disabled={remoteSourcePage <= 1 || isRemoteSourceLoading}
                    type="button"
                    onClick={() => {
                      if (sourceFilter === "all") {
                        setAllPage((page) => Math.max(1, page - 1));
                      } else if (sourceFilter === "Metainmo XML") {
                        setMetainmoPage((page) => Math.max(1, page - 1));
                      } else if (sourceFilter === "Secondary XML") {
                        setSecondaryPage((page) => Math.max(1, page - 1));
                      } else {
                        setOnestaPage((page) => Math.max(1, page - 1));
                      }
                    }}
                  >
                    Poprzednia
                  </button>
                  <span>
                    {remoteSourcePage} / {remoteSourceTotalPages}
                  </span>
                  <button
                    disabled={remoteSourcePage >= remoteSourceTotalPages || isRemoteSourceLoading}
                    type="button"
                    onClick={() => {
                      if (sourceFilter === "all") {
                        setAllPage((page) => Math.min(allTotalPages, page + 1));
                      } else if (sourceFilter === "Metainmo XML") {
                        setMetainmoPage((page) => Math.min(metainmoTotalPages, page + 1));
                      } else if (sourceFilter === "Secondary XML") {
                        setSecondaryPage((page) => Math.min(secondaryTotalPages, page + 1));
                      } else {
                        setOnestaPage((page) => Math.min(onestaTotalPages, page + 1));
                      }
                    }}
                  >
                    Następna
                  </button>
                </nav>
              ) : null}
            </>
          ) : mainTab === "imports" ? (
            <section className="importsPanel" aria-label="Importy XML">
              <div className="importsHeader">
                <div>
                  <p>Integracje</p>
                  <h2>Aktualizacja źródeł ogłoszeń</h2>
                </div>
                <span>Te akcje zapisują dane do Supabase przez istniejące endpointy.</span>
              </div>
              <div className="importActions">
                <button
                  className="importButton metainmo"
                  disabled={Boolean(importing)}
                  type="button"
                  onClick={() => requestXmlImport("metainmo")}
                >
                  <FaSyncAlt className={importing === "metainmo" ? "spinning" : ""} />
                  Aktualizuj Metainmo
                </button>
                <button
                  className="importButton secondary"
                  disabled={Boolean(importing)}
                  type="button"
                  onClick={() => requestXmlImport("secondary")}
                >
                  <FaSyncAlt className={importing === "secondary" ? "spinning" : ""} />
                  Aktualizuj Secondary MLS
                </button>
              </div>
              {renderImportFeedback()}
            </section>
          ) : (
            <form className="offerForm" onSubmit={saveListing}>
              <div className="formTabs">
                <div className="segmented">
                  <button
                    className={addTab === "data" ? "active" : ""}
                    type="button"
                    onClick={() => setAddTab("data")}
                  >
                    DANE
                  </button>
                  <button
                    className={addTab === "images" ? "active" : ""}
                    type="button"
                    onClick={() => setAddTab("images")}
                  >
                    OBRAZY
                  </button>
                </div>
                <span>{images.length} obrazów w szkicu</span>
              </div>

              {addTab === "data" ? (
                <section className="formPanel" aria-label="Dane ogłoszenia">
                  <div className="fieldGrid">
                    <label>
                      Kraj
                      <select
                        required
                        value={form.country}
                        onChange={(event) => updateCountry(event.target.value)}
                      >
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Wybrzeże
                      <select
                        required
                        value={form.coast}
                        onChange={(event) => updateField("coast", event.target.value)}
                      >
                        {currentCoastOptions.map((coast) => (
                          <option key={coast} value={coast}>
                            {coast}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Miasto
                      <input
                        required
                        value={form.city}
                        onChange={(event) => updateField("city", event.target.value)}
                      />
                    </label>
                    <label>
                      Metraż
                      <input
                        required
                        inputMode="decimal"
                        value={form.area}
                        onChange={(event) => updateField("area", event.target.value)}
                      />
                    </label>
                    <label>
                      Liczba sypialni
                      <input
                        required
                        inputMode="numeric"
                        value={form.bedrooms}
                        onChange={(event) => updateField("bedrooms", event.target.value)}
                      />
                    </label>
                    <label>
                      Liczba łazienek
                      <input
                        required
                        inputMode="numeric"
                        value={form.bathrooms}
                        onChange={(event) => updateField("bathrooms", event.target.value)}
                      />
                    </label>
                    <label>
                      Rynek
                      <select
                        required
                        value={form.market}
                        onChange={(event) => updateField("market", event.target.value)}
                      >
                        {markets.map((market) => (
                          <option key={market} value={market}>
                            {market}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Rodzaj nieruchomości
                      <select
                        required
                        value={form.propertyType}
                        onChange={(event) => updateField("propertyType", event.target.value)}
                      >
                        {propertyTypes.map((propertyType) => (
                          <option key={propertyType} value={propertyType}>
                            {propertyType}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Dostępne od
                      <input
                        required
                        type="date"
                        value={form.availableFrom}
                        onChange={(event) => updateField("availableFrom", event.target.value)}
                      />
                    </label>
                    <label>
                      Odległość od morza (m)
                      <input
                        inputMode="numeric"
                        min="0"
                        type="number"
                        value={form.distanceToSeaM}
                        onChange={(event) => updateField("distanceToSeaM", event.target.value)}
                      />
                    </label>
                    <label>
                      Cena
                      <input
                        inputMode="decimal"
                        min="0"
                        type="number"
                        value={form.price}
                        onChange={(event) => updateField("price", event.target.value)}
                      />
                    </label>
                    <label className="wide">
                      Tytuł
                      <input
                        required
                        value={form.title}
                        onChange={(event) => updateField("title", event.target.value)}
                      />
                    </label>
                  </div>

                  <section className="featurePicker" aria-label="Dodatkowe atuty">
                    <div className="featureHeader">
                      <strong>Dodatkowe atuty</strong>
                      <span>{form.features.length} zaznaczonych</span>
                    </div>
                    <div className="featureGrid">
                      {featureOptions.map((feature) => {
                        const selected = form.features.includes(feature);
                        return (
                          <button
                            className={selected ? "selected" : ""}
                            key={feature}
                            type="button"
                            onClick={() => toggleFeature(feature)}
                          >
                            <span>{selected ? <FaCheck /> : null}</span>
                            {feature}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <div className="textareaGrid">
                    <label>
                      Opis PL
                      <textarea
                        required
                        value={form.descriptionPl}
                        onChange={(event) => updateField("descriptionPl", event.target.value)}
                      />
                    </label>
                    <label>
                      Opis ENG
                      <textarea
                        required
                        value={form.descriptionEn}
                        onChange={(event) => updateField("descriptionEn", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
              ) : (
                <section className="formPanel" aria-label="Obrazy ogłoszenia">
                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    hidden
                    multiple
                    type="file"
                    onChange={handleFileChange}
                  />
                  <div
                    className={`uploadZone ${dragActive ? "dragActive" : ""}`}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <FaCloudUploadAlt />
                    <strong>Przeciągnij zdjęcia lub wizualizacje</strong>
                    <button
                      className="secondaryButton"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaRegImage /> Wyszukaj na dysku
                    </button>
                  </div>

                  {images.length ? (
                    <div className="imageGrid">
                      {images.map((image, index) => (
                        <article
                          aria-label={`${index + 1}. ${image.name}`}
                          className={`imageTile ${
                            draggedImageId === image.id ? "dragging" : ""
                          }`}
                          draggable
                          key={image.id}
                          onDragEnd={handleImageDragEnd}
                          onDragOver={(event) => handleImageDragOver(event, image.id)}
                          onDragStart={(event) => handleImageDragStart(event, image.id)}
                          onDrop={(event) => handleImageDrop(event, image.id)}
                        >
                          <img alt="" src={image.url} />
                          <div>
                            <strong>{image.name}</strong>
                            <span>{formatFileSize(image.size)}</span>
                          </div>
                          <button
                            aria-label={`Usuń ${image.name}`}
                            type="button"
                            onClick={() => removeImage(image.id)}
                          >
                            <FaTimes />
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="emptyImages">
                      <FaImages />
                      <span>Brak obrazów w szkicu oferty</span>
                    </div>
                  )}
                </section>
              )}

              <footer className="saveBar">
                <div>
                  <strong>{form.title || "Nowa oferta"}</strong>
                  <span>
                    {form.city || "Miasto"} · {images.length} obrazów ·{" "}
                    {form.features.length} atutów
                  </span>
                </div>
                {notice ? <p>{notice}</p> : null}
                <button className="onesariPrimary" disabled={isSavingListing} type="submit">
                  <FaSave /> {isSavingListing ? "ZAPISUJĘ..." : "ZAPISZ OFERTĘ"}
                </button>
              </footer>
            </form>
          )}
        </section>
      </main>

      {importConfirmation ? (
        <div className="confirmOverlay" role="dialog" aria-modal="true">
          <section className="confirmModal">
            <div>
              <p>Potwierdzenie importu</p>
              <h2>Aktualizować XML {importConfirmation.label}?</h2>
              <span>
                Ta akcja pobierze dane z XML i zapisze zmiany w Supabase dla tego źródła.
              </span>
            </div>
            <div className="confirmActions">
              <button
                className="secondaryButton"
                type="button"
                onClick={cancelXmlImport}
              >
                Odrzuć
              </button>
              <button
                className="confirmButton"
                disabled={importConfirmCountdown > 0 || Boolean(importing)}
                type="button"
                onClick={confirmXmlImport}
              >
                {importConfirmCountdown > 0
                  ? `Potwierdź za ${importConfirmCountdown}s`
                  : "Potwierdź aktualizację"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <style jsx>{`
        .onesariShell {
          background: #f3f6f8;
          color: #17202a;
          display: grid;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          grid-template-columns: 260px minmax(0, 1fr);
          min-height: 100vh;
        }

        .onesariSidebar {
          background: #162231;
          color: #eef4f7;
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding: 22px;
        }

        .onesariBrand {
          align-items: center;
          display: flex;
          gap: 12px;
        }

        .onesariMark {
          align-items: center;
          background: #216e63;
          border-radius: 8px;
          display: flex;
          font-weight: 900;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        .onesariBrand strong,
        .onesariBrand span {
          display: block;
        }

        .onesariBrand span,
        .onesariNav button,
        .sourceNav strong {
          color: #b7c5cf;
          font-size: 14px;
        }

        .onesariNav {
          display: grid;
          gap: 8px;
        }

        .onesariNav button {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 8px;
          display: flex;
          font: inherit;
          font-weight: 800;
          gap: 10px;
          min-height: 42px;
          padding: 10px 12px;
          text-align: left;
        }

        .onesariNav button.active,
        .onesariNav button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .sourceNav {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: grid;
          gap: 8px;
          padding-top: 18px;
        }

        .sourceNav strong {
          font-weight: 900;
          text-transform: uppercase;
        }

        .sourceNav button {
          align-items: center;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #eef4f7;
          display: flex;
          justify-content: space-between;
          min-height: 38px;
          padding: 0 10px;
        }

        .sourceNav button.active,
        .sourceNav button:hover {
          background: rgba(33, 110, 99, 0.38);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .sourceNav span {
          font-size: 13px;
          font-weight: 800;
        }

        .sourceNav b {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          min-height: 24px;
          min-width: 26px;
          padding: 4px 7px;
          text-align: center;
        }

        .dashboardPanel {
          display: grid;
          gap: 18px;
        }

        .dashboardHero,
        .dashboardActions article,
        .confirmModal {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
        }

        .dashboardHero {
          align-items: center;
          display: flex;
          gap: 18px;
          justify-content: space-between;
          padding: 18px;
        }

        .dashboardHero p,
        .dashboardActions p,
        .confirmModal p {
          color: #216e63;
          font-size: 13px;
          font-weight: 900;
          margin: 0 0 4px;
          text-transform: uppercase;
        }

        .dashboardHero h2,
        .dashboardActions h3,
        .confirmModal h2 {
          margin: 0;
        }

        .dashboardHero h2 {
          font-size: 26px;
          line-height: 1.15;
        }

        .dashboardActions article {
          display: grid;
          gap: 16px;
          padding: 18px;
        }

        .dashboardActions h3 {
          font-size: 22px;
          line-height: 1.15;
        }

        .sourceCardButton {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
          display: grid;
          gap: 6px;
          padding: 16px;
          text-align: left;
        }

        .sourceCardButton:hover {
          border-color: #216e63;
        }

        .onesariWorkspace {
          align-content: start;
          display: grid;
          gap: 18px;
          min-width: 0;
          padding: 24px;
        }

        .onesariTopbar,
        .formTabs,
        .saveBar {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .onesariTopbar p {
          color: #216e63;
          font-size: 13px;
          font-weight: 900;
          margin: 0 0 4px;
          text-transform: uppercase;
        }

        .onesariTopbar h1 {
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.08;
          margin: 0;
        }

        .onesariPrimary,
        .secondaryButton {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-weight: 900;
          gap: 8px;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
        }

        .onesariPrimary {
          background: #216e63;
          border: 0;
          color: #ffffff;
        }

        .secondaryButton {
          background: #ffffff;
          border: 1px solid #d8dee7;
          color: #17202a;
        }

        .sourceGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .sourceGrid article,
        .listingTable,
        .offerForm,
        .importsPanel {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
        }

        .sourceGrid article {
          display: grid;
          gap: 6px;
          padding: 16px;
        }

        .sourceGrid span,
        .sourceCardButton span,
        .listingIdentity span,
        .listingFacts span,
        .importsHeader span,
        .formTabs span,
        .saveBar span,
        .imageTile span,
        .emptyImages span,
        .featureHeader span {
          color: #667085;
          font-size: 13px;
        }

        .sourceGrid strong {
          align-items: center;
          display: inline-flex;
          font-size: 28px;
          min-height: 28px;
          line-height: 1;
        }

        .sourceCardButton strong {
          align-items: center;
          display: inline-flex;
          font-size: 28px;
          line-height: 1;
          min-height: 28px;
        }

        :global(.countLoader) {
          animation: onesariPulse 0.85s ease-in-out infinite;
          background: currentColor;
          border-radius: 999px;
          display: inline-block;
          height: 7px;
          opacity: 0.35;
          width: 7px;
        }

        :global(.countError) {
          color: #dc2626;
          display: inline-block;
          font-weight: 900;
        }

        .searchBox {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          display: flex;
          gap: 10px;
          max-width: 760px;
          min-height: 44px;
          padding: 0 14px;
        }

        .searchBox input {
          background: transparent;
          border: 0;
          min-height: 42px;
          outline: 0;
          width: 100%;
        }

        .onesariNotice {
          color: #155149;
          font-size: 13px;
          font-weight: 800;
          margin: 0;
        }

        .onesariError {
          color: #b42318;
          font-size: 13px;
          font-weight: 800;
          margin: 0;
        }

        .paginationMeta {
          align-items: center;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          max-width: 760px;
        }

        .paginationMeta span,
        .paginationBar span {
          color: #667085;
          font-size: 13px;
          font-weight: 800;
        }

        .paginationMeta strong {
          color: #155149;
          font-size: 13px;
        }

        .listingTable {
          overflow: hidden;
        }

        .listingHeader,
        .listingRow {
          display: grid;
          gap: 14px;
          grid-template-columns: minmax(300px, 1.05fr) minmax(250px, 1fr) 140px 110px 150px 90px;
          padding: 14px 16px;
        }

        .listingHeader {
          background: #f9fafb;
          color: #667085;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .listingRow {
          align-items: center;
          border-top: 1px solid #d8dee7;
        }

        .listingIdentity,
        .listingDescription,
        .listingFacts,
        .imageCounter {
          min-width: 0;
        }

        .listingIdentity,
        .listingFacts,
        .imageCounter {
          align-items: center;
          display: flex;
          gap: 10px;
        }

        .listingDescription {
          display: grid;
          gap: 8px;
        }

        .listingDescription p {
          color: #344054;
          display: -webkit-box;
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .listingIdentity > div:last-child {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .listingIdentity strong,
        .listingIdentity span,
        .imageTile strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .listingIdentity img {
          aspect-ratio: 4 / 3;
          border-radius: 8px;
          flex: 0 0 auto;
          height: 76px;
          object-fit: cover;
          width: 102px;
        }

        .listingFacts {
          flex-wrap: wrap;
        }

        .pill,
        .sourcePill,
        .imageCounter {
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          padding: 6px 10px;
          white-space: nowrap;
        }

        .pill {
          background: #e7f2ef;
          color: #155149;
        }

        .sourcePill {
          background: #eef2ff;
          color: #4438ca;
        }

        .imageCounter {
          background: #f1f5f9;
          color: #344054;
        }

        .priceCell {
          color: #155149;
          font-size: 15px;
          white-space: nowrap;
        }

        .paginationBar {
          align-items: center;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .paginationBar button {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #17202a;
          font-weight: 900;
          min-height: 38px;
          padding: 0 14px;
        }

        .paginationBar button:disabled {
          color: #98a2b3;
          cursor: not-allowed;
        }

        .importsPanel {
          display: grid;
          gap: 18px;
          padding: 18px;
        }

        .importsHeader {
          align-items: start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .importsHeader p {
          color: #216e63;
          font-size: 13px;
          font-weight: 900;
          margin: 0 0 4px;
          text-transform: uppercase;
        }

        .importsHeader h2 {
          font-size: 24px;
          line-height: 1.15;
          margin: 0;
        }

        .importActions {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .importActions.compact {
          max-width: 720px;
        }

        .importButton {
          align-items: center;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          display: inline-flex;
          font-weight: 900;
          gap: 10px;
          justify-content: center;
          min-height: 50px;
          padding: 0 18px;
        }

        .importButton:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .importButton.metainmo {
          background: #b45309;
        }

        .importButton.secondary {
          background: #654de6;
        }

        .importFeedback {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          display: grid;
          gap: 10px;
          padding: 12px;
        }

        .importFeedback.error {
          border-color: #f1b5b0;
          background: #fff8f7;
        }

        .importProgressMeta {
          align-items: center;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .importProgressMeta strong {
          color: #17202a;
          font-size: 13px;
          min-width: 0;
        }

        .importProgressMeta span {
          color: #667085;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .importProgressTrack {
          background: #d8dee7;
          border-radius: 999px;
          height: 8px;
          overflow: hidden;
          width: 100%;
        }

        .importProgressTrack.error {
          background: #f8d2cf;
        }

        .importProgressFill {
          background: linear-gradient(90deg, #216e63 0%, #2d8c7e 100%);
          border-radius: 999px;
          height: 100%;
          transition: width 0.24s ease;
        }

        .importProgressFill.error {
          background: linear-gradient(90deg, #d92d20 0%, #f97066 100%);
        }

        .importStatus {
          color: #344054;
          font-size: 13px;
          font-weight: 800;
          margin: 0;
        }

        .spinning {
          animation: onesariSpin 0.8s linear infinite;
        }

        @keyframes onesariSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes onesariPulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }

          50% {
            opacity: 0.75;
            transform: scale(1.15);
          }
        }

        .confirmOverlay {
          align-items: center;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 18px;
          position: fixed;
          z-index: 80;
        }

        .confirmModal {
          display: grid;
          gap: 18px;
          max-width: 520px;
          padding: 20px;
          width: min(100%, 520px);
        }

        .confirmModal span {
          color: #667085;
          display: block;
          font-size: 14px;
          line-height: 1.5;
          margin-top: 8px;
        }

        .confirmActions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .confirmButton {
          background: #b45309;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 900;
          min-height: 44px;
          padding: 0 16px;
        }

        .confirmButton:disabled {
          cursor: wait;
          opacity: 0.55;
        }

        .offerForm {
          display: grid;
          overflow: hidden;
        }

        .formTabs {
          background: #f9fafb;
          border-bottom: 1px solid #d8dee7;
          padding: 12px 14px;
        }

        .segmented {
          background: #e8eef3;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          display: flex;
          gap: 4px;
          padding: 4px;
        }

        .segmented button {
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #475467;
          font-weight: 900;
          min-height: 36px;
          padding: 0 16px;
        }

        .segmented button.active {
          background: #ffffff;
          box-shadow: 0 4px 14px rgba(21, 32, 43, 0.08);
          color: #155149;
        }

        .formPanel {
          display: grid;
          gap: 18px;
          padding: 18px;
        }

        .fieldGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .fieldGrid label,
        .textareaGrid label {
          color: #344054;
          display: grid;
          font-size: 13px;
          font-weight: 900;
          gap: 7px;
        }

        .wide {
          grid-column: span 2;
        }

        .fieldGrid input,
        .fieldGrid select,
        .textareaGrid textarea {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #17202a;
          outline: 0;
          width: 100%;
        }

        .fieldGrid input,
        .fieldGrid select {
          min-height: 44px;
          padding: 0 12px;
        }

        .textareaGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .textareaGrid textarea {
          min-height: 170px;
          padding: 12px;
          resize: vertical;
        }

        .featurePicker {
          border: 1px solid #d8dee7;
          border-radius: 8px;
          display: grid;
          gap: 12px;
          padding: 14px;
        }

        .featureHeader {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .featureGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .featureGrid button {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 999px;
          color: #344054;
          display: inline-flex;
          font-weight: 900;
          gap: 7px;
          min-height: 36px;
          padding: 0 12px;
        }

        .featureGrid button.selected {
          background: #e7f2ef;
          border-color: #9acdc4;
          color: #155149;
        }

        .featureGrid button span {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 999px;
          display: flex;
          height: 18px;
          justify-content: center;
          width: 18px;
        }

        .uploadZone {
          align-items: center;
          background: #f8fafb;
          border: 2px dashed #b8c5cf;
          border-radius: 8px;
          color: #344054;
          display: grid;
          gap: 12px;
          justify-items: center;
          min-height: 260px;
          padding: 28px;
          text-align: center;
        }

        .uploadZone.dragActive {
          background: #eef8f6;
          border-color: #216e63;
          color: #155149;
        }

        .uploadZone > :global(svg) {
          font-size: 36px;
        }

        .imageGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .imageTile {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          cursor: grab;
          display: grid;
          gap: 10px;
          min-width: 0;
          padding: 10px;
          position: relative;
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }

        .imageTile:active {
          cursor: grabbing;
        }

        .imageTile.dragging {
          border-color: #216e63;
          box-shadow: 0 12px 28px rgba(23, 32, 42, 0.14);
          opacity: 0.62;
        }

        .imageTile img {
          aspect-ratio: 4 / 3;
          border-radius: 6px;
          display: block;
          object-fit: cover;
          pointer-events: none;
          width: 100%;
        }

        .imageTile div {
          display: grid;
          gap: 3px;
          min-width: 0;
          padding-right: 34px;
        }

        .imageTile button {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #9b1c1c;
          display: flex;
          height: 32px;
          justify-content: center;
          position: absolute;
          right: 10px;
          top: 10px;
          width: 32px;
        }

        .emptyImages {
          align-items: center;
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #667085;
          display: flex;
          gap: 10px;
          min-height: 56px;
          padding: 14px;
        }

        .saveBar {
          background: #ffffff;
          border-top: 1px solid #d8dee7;
          bottom: 0;
          box-shadow: 0 -12px 28px rgba(21, 32, 43, 0.08);
          flex-wrap: wrap;
          padding: 14px;
          position: sticky;
          z-index: 10;
        }

        .saveBar div {
          display: grid;
          gap: 3px;
        }

        .saveBar p {
          color: #155149;
          font-size: 13px;
          font-weight: 900;
          margin: 0;
        }

        button {
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .onesariShell {
            grid-template-columns: 1fr;
          }

          .onesariSidebar {
            flex-direction: row;
            overflow-x: auto;
          }

          .onesariNav {
            display: flex;
          }

          .sourceNav {
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            border-top: 0;
            display: flex;
            padding-left: 16px;
            padding-top: 0;
          }

          .sourceNav strong {
            align-self: center;
          }

          .sourceGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .listingTable {
            overflow-x: auto;
          }

          .listingHeader,
          .listingRow {
            min-width: 1160px;
          }

          .fieldGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .onesariSidebar,
          .onesariWorkspace {
            padding: 16px;
          }

          .onesariTopbar,
          .formTabs,
          .paginationMeta,
          .paginationBar,
          .saveBar {
            align-items: stretch;
            flex-direction: column;
          }

          .onesariPrimary,
          .secondaryButton {
            width: 100%;
          }

          .sourceGrid,
          .importActions,
          .fieldGrid,
          .textareaGrid {
            grid-template-columns: 1fr;
          }

          .wide {
            grid-column: auto;
          }

          .listingHeader {
            display: none;
          }

          .listingRow {
            grid-template-columns: 1fr;
            min-width: 0;
          }

          .importsHeader {
            display: grid;
          }

          .pill,
          .sourcePill,
          .imageCounter {
            justify-self: start;
          }
        }
      `}</style>
    </>
  );
}
