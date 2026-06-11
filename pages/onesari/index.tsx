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
import { isOnesariEnabled } from "@/lib/onesariFeature";

type MainTab = "offers" | "add" | "imports";
type AddTab = "data" | "images";
type Market = "pierwotny" | "wtórny";
type PropertyType = "apartament" | "bungalow" | "szeregówka" | "penthouse" | "dom";
type SourceFilter = "all" | "Metainmo XML" | "Secondary XML" | "Onesta FTP" | "Dodane ręcznie";

type ListingForm = {
  country: string;
  city: string;
  coast: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  market: Market;
  propertyType: PropertyType;
  features: string[];
  availableFrom: string;
  title: string;
  descriptionPl: string;
  descriptionEn: string;
};

type Listing = ListingForm & {
  id: string;
  ref: string;
  source: "Metainmo XML" | "Secondary XML" | "Onesta FTP" | "Dodane ręcznie";
  price: number | null;
  currency: string;
  imageUrl: string;
  imagesCount: number;
  createdAt: string;
};

type ImageDraft = {
  id: string;
  name: string;
  size: number;
  url: string;
};

type TextField = Exclude<keyof ListingForm, "features">;

const METAINMO_PAGE_SIZE = 20;
const SECONDARY_PAGE_SIZE = 20;
const ONESTA_PAGE_SIZE = 20;

const markets: Market[] = ["pierwotny", "wtórny"];
const propertyTypes: PropertyType[] = [
  "apartament",
  "bungalow",
  "szeregówka",
  "penthouse",
  "dom",
];

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
  coast: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
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

function formatPrice(price: number | null, currency = "EUR") {
  if (!price) return "Cena do ustalenia";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(price);
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

function mapPropertyToListing(
  property: any,
  source: "Metainmo XML" | "Secondary XML" | "Onesta FTP" = "Metainmo XML",
): Listing {
  const descriptionPl = textFromDescription(property.descriptions);
  const title =
    stripHtml(property.title || property.headerAdvertisement) ||
    `${normalizePropertyType(property.type)} ${property.town || ""}`.trim() ||
    (source === "Metainmo XML"
      ? "Oferta Metainmo"
      : source === "Secondary XML"
        ? "Oferta Secondary MLS"
        : "Oferta Onesta FTP");

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

export default function OnesariPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>("offers");
  const [addTab, setAddTab] = useState<AddTab>("data");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [notice, setNotice] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [importing, setImporting] = useState<"metainmo" | "secondary" | "onesta" | null>(null);
  const [form, setForm] = useState<ListingForm>(emptyForm);
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [listings, setListings] = useState<Listing[]>(initialListings);
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
      setIsCheckingAuth(false);
    });
  }, [router]);

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
    if (isCheckingAuth || mainTab !== "offers" || sourceFilter !== "Onesta FTP") return;

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
          throw new Error(payload?.error || "Nie udało się pobrać Onesta FTP");
        }
        return payload as { data: any[]; count: number };
      })
      .then(({ data, count }) => {
        if (!isMounted) return;
        setOnestaListings((data || []).map((property) => mapPropertyToListing(property, "Onesta FTP")));
        setOnestaTotal(count ?? 0);
      })
      .catch((error: any) => {
        if (!isMounted) return;
        setOnestaError(error?.message || "Nie udało się pobrać Onesta FTP");
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
          : sourceFilter === "Onesta FTP"
            ? onestaListings
            : listings;

    return baseListings.filter((listing) => {
      if (
        sourceFilter !== "all" &&
        sourceFilter !== "Metainmo XML" &&
        sourceFilter !== "Secondary XML" &&
        sourceFilter !== "Onesta FTP" &&
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
  }, [listings, metainmoListings, onestaListings, query, secondaryListings, sourceFilter]);

  const sourceCounts = useMemo(
    () => ({
      metainmo:
        metainmoTotal ?? listings.filter((listing) => listing.source === "Metainmo XML").length,
      secondary:
        secondaryTotal ?? listings.filter((listing) => listing.source === "Secondary XML").length,
      onesta:
        onestaTotal ?? listings.filter((listing) => listing.source === "Onesta FTP").length,
      manual: listings.filter((listing) => listing.source === "Dodane ręcznie").length,
    }),
    [listings, metainmoTotal, onestaTotal, secondaryTotal],
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
    sourceCounts.metainmo + sourceCounts.secondary + sourceCounts.onesta + sourceCounts.manual;

  const sourceFilters: Array<{ label: string; value: SourceFilter; count: number }> = [
    { label: "Wszystkie", value: "all", count: allSourcesCount },
    { label: "Metainmo", value: "Metainmo XML", count: sourceCounts.metainmo },
    { label: "Secondary MLS", value: "Secondary XML", count: sourceCounts.secondary },
    { label: "Onesta FTP", value: "Onesta FTP", count: sourceCounts.onesta },
    { label: "Ręczne", value: "Dodane ręcznie", count: sourceCounts.manual },
  ];

  const totalVisibleCount =
    sourceFilter === "Metainmo XML"
      ? (metainmoTotal ?? 0)
      : sourceFilter === "Secondary XML"
        ? (secondaryTotal ?? 0)
        : sourceFilter === "Onesta FTP"
          ? (onestaTotal ?? 0)
          : filteredListings.length;
  const remoteSourceLabel =
    sourceFilter === "Metainmo XML"
      ? "Metainmo"
      : sourceFilter === "Secondary XML"
        ? "Secondary MLS"
        : sourceFilter === "Onesta FTP"
          ? "Onesta FTP"
        : "";
  const remoteSourcePage =
    sourceFilter === "Metainmo XML"
      ? metainmoPage
      : sourceFilter === "Secondary XML"
        ? secondaryPage
        : onestaPage;
  const remoteSourceTotalPages =
    sourceFilter === "Metainmo XML"
      ? metainmoTotalPages
      : sourceFilter === "Secondary XML"
        ? secondaryTotalPages
        : onestaTotalPages;
  const isRemoteSourceLoading =
    sourceFilter === "Metainmo XML"
      ? isMetainmoLoading
      : sourceFilter === "Secondary XML"
        ? isSecondaryLoading
        : isOnestaLoading;
  const remoteSourceError =
    sourceFilter === "Metainmo XML"
      ? metainmoError
      : sourceFilter === "Secondary XML"
        ? secondaryError
        : onestaError;

  function updateField(field: TextField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
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

  async function runXmlImport(kind: "metainmo" | "secondary" | "onesta") {
    const endpoint =
      kind === "metainmo"
        ? "/api/metainmoToSupabase"
        : kind === "secondary"
          ? "/api/secondaryToSupabase"
          : "/api/onestaFtpToSupabase";
    setImporting(kind);
    setImportStatus(
      kind === "metainmo"
        ? "Aktualizuję Metainmo..."
        : kind === "secondary"
          ? "Aktualizuję Secondary MLS..."
          : "Aktualizuję Onesta FTP...",
    );

    try {
      const response = await fetch(endpoint, { method: "POST" });
      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { message: raw || "Odpowiedź bez JSON" };
      }

      if (!response.ok) {
        setImportStatus(
          `${kind === "metainmo" ? "Metainmo" : kind === "secondary" ? "Secondary MLS" : "Onesta FTP"}: błąd - ${
            data?.error || data?.details || "nieznany błąd"
          }`,
        );
        return;
      }

      if (kind === "metainmo") {
        setImportStatus(
          `Metainmo OK: XML ${data?.total_xml ?? 0}, po deduplikacji ${
            data?.total_after_dedupe ?? 0
          }.`,
        );
        setMetainmoPage(1);
        setMetainmoRefreshKey((current) => current + 1);
      } else if (kind === "secondary") {
        setImportStatus(
          `Secondary MLS OK: XML ${data?.total_xml ?? 0}, zapisane ${
            data?.total_saved ?? 0
          }, usunięte stare ${data?.total_deleted_sec ?? 0}.`,
        );
        setSecondaryPage(1);
        setSecondaryRefreshKey((current) => current + 1);
      } else {
        setImportStatus(
          `Onesta FTP OK: XML ${data?.total_xml ?? 0}, zapisane ${
            data?.total_saved ?? 0
          }, usunięte stare ${data?.total_deleted_old ?? 0}.`,
        );
        setOnestaPage(1);
        setOnestaRefreshKey((current) => current + 1);
      }
    } catch (error: any) {
      setImportStatus(error?.message || "Import nie powiódł się.");
    } finally {
      setImporting(null);
    }
  }

  function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredFields: TextField[] = [
      "country",
      "city",
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

    setListings((current) => [
      {
        ...form,
        id: uid("listing"),
        ref: `MAN-${Date.now()}`,
        source: "Dodane ręcznie",
        price: null,
        currency: "EUR",
        imageUrl: images[0]?.url || "/mini_bg_about_us.webp",
        imagesCount: images.length,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
    resetDraft();
    setMainTab("offers");
    setNotice("Oferta została zapisana w lokalnym szkicu Onesari.");
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
                  if (filter.value === "Metainmo XML") setMetainmoPage(1);
                  if (filter.value === "Secondary XML") setSecondaryPage(1);
                  if (filter.value === "Onesta FTP") setOnestaPage(1);
                  setMainTab("offers");
                }}
              >
                <span>{filter.label}</span>
                <b>{filter.count}</b>
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

          {mainTab === "offers" ? (
            <>
              <section className="sourceGrid" aria-label="Źródła ogłoszeń">
                <article>
                  <span>Wszystkie oferty</span>
                  <strong>{allSourcesCount}</strong>
                </article>
                <article>
                  <span>Metainmo XML</span>
                  <strong>{sourceCounts.metainmo}</strong>
                </article>
                <article>
                  <span>Secondary XML</span>
                  <strong>{sourceCounts.secondary}</strong>
                </article>
                <article>
                  <span>Onesta FTP</span>
                  <strong>{sourceCounts.onesta}</strong>
                </article>
                <article>
                  <span>Dodane ręcznie</span>
                  <strong>{sourceCounts.manual}</strong>
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
              {sourceFilter === "Metainmo XML" ||
              sourceFilter === "Secondary XML" ||
              sourceFilter === "Onesta FTP" ? (
                <div className="paginationMeta">
                  <span>
                    {remoteSourceLabel}: {totalVisibleCount} ofert · strona{" "}
                    {remoteSourcePage} z {remoteSourceTotalPages}
                  </span>
                  {isRemoteSourceLoading ? <strong>Ładowanie...</strong> : null}
                </div>
              ) : null}
              {remoteSourceError &&
              (sourceFilter === "Metainmo XML" ||
                sourceFilter === "Secondary XML" ||
                sourceFilter === "Onesta FTP") ? (
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
              {sourceFilter === "Metainmo XML" ||
              sourceFilter === "Secondary XML" ||
              sourceFilter === "Onesta FTP" ? (
                <nav className="paginationBar" aria-label={`Paginacja ${remoteSourceLabel}`}>
                  <button
                    disabled={remoteSourcePage <= 1 || isRemoteSourceLoading}
                    type="button"
                    onClick={() => {
                      if (sourceFilter === "Metainmo XML") {
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
                      if (sourceFilter === "Metainmo XML") {
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
                  onClick={() => runXmlImport("metainmo")}
                >
                  <FaSyncAlt className={importing === "metainmo" ? "spinning" : ""} />
                  Aktualizuj Metainmo
                </button>
                <button
                  className="importButton secondary"
                  disabled={Boolean(importing)}
                  type="button"
                  onClick={() => runXmlImport("secondary")}
                >
                  <FaSyncAlt className={importing === "secondary" ? "spinning" : ""} />
                  Aktualizuj Secondary MLS
                </button>
                <button
                  className="importButton onesta"
                  disabled={Boolean(importing)}
                  type="button"
                  onClick={() => runXmlImport("onesta")}
                >
                  <FaSyncAlt className={importing === "onesta" ? "spinning" : ""} />
                  Aktualizuj Onesta FTP
                </button>
              </div>
              {importStatus ? <p className="importStatus">{importStatus}</p> : null}
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
                      <input
                        required
                        value={form.country}
                        onChange={(event) => updateField("country", event.target.value)}
                      />
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
                      Wybrzeże
                      <input
                        value={form.coast}
                        onChange={(event) => updateField("coast", event.target.value)}
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
                      {images.map((image) => (
                        <article className="imageTile" key={image.id}>
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
                <button className="onesariPrimary" type="submit">
                  <FaSave /> ZAPISZ OFERTĘ
                </button>
              </footer>
            </form>
          )}
        </section>
      </main>

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
          font-size: 12px;
          min-width: 26px;
          padding: 4px 7px;
          text-align: center;
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
          grid-template-columns: repeat(5, minmax(0, 1fr));
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
          font-size: 28px;
          line-height: 1;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
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

        .importButton.onesta {
          background: #155149;
        }

        .importStatus {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #344054;
          font-size: 13px;
          font-weight: 800;
          margin: 0;
          padding: 12px;
        }

        .spinning {
          animation: onesariSpin 0.8s linear infinite;
        }

        @keyframes onesariSpin {
          to {
            transform: rotate(360deg);
          }
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
          display: grid;
          gap: 10px;
          min-width: 0;
          padding: 10px;
          position: relative;
        }

        .imageTile img {
          aspect-ratio: 4 / 3;
          border-radius: 6px;
          display: block;
          object-fit: cover;
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
