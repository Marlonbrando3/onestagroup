import Head from "next/head";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { BiArea } from "react-icons/bi";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiX,
} from "react-icons/fi";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { AGENT_OFFER_CARD_COLUMNS, type AgentOffer } from "@/lib/agentOffers";
import {
  CBTOP_PROPERTY_IDS,
  CBTOP_SOURCE_PRESENTATION_TOKEN,
} from "@/lib/cbTopOffers";
import { propertyTypeLabel } from "@/lib/i18n";
import { optimizedPropertyImageUrl } from "@/lib/propertyImages";
import { getCoastLabelFromProvince, getCountryLabel } from "@/lib/regionMap";
import { supabaseServer } from "@/lib/supabaseClient";
import { validTitleOrEmpty } from "@/lib/titlesDictionary";
import Logotype from "@/public/logotype_full_new.png";

type CbTopPageProps = {
  offers: CbTopCardOffer[];
  socialImage: string;
};

type CbTopCardOffer = AgentOffer & {
  imageCount: number;
};

type DetailStatus = "idle" | "loading" | "ready" | "error";

const PHONE_NUMBER = "+48 576 65 25 25";
const PHONE_HREF = "tel:+48576652525";

function imageUrls(value: unknown): string[] {
  let normalized = value;
  if (typeof normalized === "string") {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      normalized = [normalized];
    }
  }

  if (!Array.isArray(normalized)) return [];
  return Array.from(
    new Set(
      normalized
        .map((image: any) =>
          typeof image === "string" ? image : image?.url || image?.src || "",
        )
        .map((url) => String(url || "").trim())
        .filter(
          (url) =>
            url.startsWith("/") ||
            url.startsWith("https://") ||
            url.startsWith("http://"),
        ),
    ),
  );
}

function displayImageUrl(value: string | undefined) {
  return optimizedPropertyImageUrl(value || "/logotype_full_new.png");
}

function formatPrice(value: number | null | undefined) {
  const numeric = Number(value || 0);
  return numeric ? `${numeric.toLocaleString("pl-PL")} €` : "Cena na zapytanie";
}

function typeLabel(offer: AgentOffer) {
  return propertyTypeLabel.pl[offer.type || ""] || offer.type || "Nieruchomość";
}

function offerTitle(offer: AgentOffer) {
  return (
    validTitleOrEmpty(offer.title) ||
    `${typeLabel(offer)} w ${offer.town || offer.province || "Hiszpanii"}`
  );
}

function descriptionValue(value: unknown): string {
  let raw = "";
  if (typeof value === "string") raw = value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const descriptions = value as Record<string, unknown>;
    raw = String(
      descriptions.pl ||
        descriptions.en ||
        Object.values(descriptions).find((item) => typeof item === "string") ||
        "",
    );
  }

  return raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li\s*>/gi, "")
    .replace(/<\/(p|div|h[1-6])\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function featureValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(value.map((item) => String(item || "").trim()).filter(Boolean)),
    );
  }
  if (value && typeof value === "object") {
    return featureValues((value as Record<string, unknown>).feature);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function featureLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const labels: Record<string, string> = {
    "air-conditioning": "Klimatyzacja",
    "air conditioning": "Klimatyzacja",
    "private-pool": "Prywatny basen",
    "private pool": "Prywatny basen",
    "swimming-pool": "Basen",
    "swimming pool": "Basen",
    "community-pool": "Basen wspólnotowy",
    elevator: "Winda",
    garden: "Ogród",
    terrace: "Taras",
    solarium: "Solarium",
    garage: "Garaż",
    "private-parking": "Prywatny parking",
    "underground-parking": "Parking podziemny",
    "sea-view": "Widok na morze",
    "sea views": "Widok na morze",
    "mountain-views": "Widok na góry",
    "built-in-closets": "Szafy w zabudowie",
    "storage-room": "Pomieszczenie gospodarcze",
    gym: "Siłownia",
    spa: "Spa",
    sauna: "Sauna",
  };

  if (labels[normalized]) return labels[normalized];
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

function PropertyCard({
  offer,
  index,
  onOpen,
}: {
  offer: CbTopCardOffer;
  index: number;
  onOpen: (offer: AgentOffer) => void;
}) {
  const images = imageUrls(offer.images);
  const title = offerTitle(offer);
  const coast = getCoastLabelFromProvince(offer.province);

  return (
    <article className="group h-full overflow-hidden rounded-[22px] border border-[#e2d8ca] bg-white shadow-[0_10px_35px_rgba(24,35,52,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(24,35,52,0.14)]">
      <button
        type="button"
        onClick={() => onOpen(offer)}
        className="flex h-full w-full flex-col text-left"
        aria-haspopup="dialog"
        aria-label={`Otwórz szczegóły: ${title}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#dcd5ca]">
          <Image
            fill
            src={displayImageUrl(images[0])}
            alt={`${title} — zdjęcie nieruchomości`}
            sizes="(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 390px"
            quality={70}
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
            {...(index === 0
              ? { preload: true }
              : { loading: "lazy" as const })}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101b2b]/65 via-transparent to-[#101b2b]/10" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/95 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#182334] shadow-sm">
              Top {String(index + 1).padStart(2, "0")}
            </span>
            {offer.new_build ? (
              <span className="rounded-full bg-[#d6b66f] px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#182334] shadow-sm">
                Nowa inwestycja
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#f3d891]">
                {coast || offer.province || "Hiszpania"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold">
                <FiMapPin aria-hidden="true" /> {offer.town || "Hiszpania"}
              </p>
            </div>
            {offer.imageCount > 1 ? (
              <span className="rounded-full border border-white/25 bg-[#101b2b]/55 px-3 py-2 text-[9px] font-bold backdrop-blur-sm">
                {offer.imageCount} zdjęć
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#9b7a36]">
            {typeLabel(offer)} · ref. {offer.external_id}
          </p>
          <h2
            className={`${HomePlayfairSans.className} mt-2 line-clamp-2 min-h-[58px] text-[25px] font-semibold leading-[1.12] tracking-[-0.02em] text-[#182334]`}
          >
            {title}
          </h2>

          <div className="mt-5 grid grid-cols-4 border-y border-[#ebe4da] py-3">
            <CardFact
              Icon={IoBedOutline}
              value={offer.beds ?? "—"}
              label="syp."
            />
            <CardFact
              Icon={PiBathtubLight}
              value={offer.baths ?? "—"}
              label="łaz."
            />
            <CardFact
              Icon={BiArea}
              value={offer.surface_built ? `${offer.surface_built}` : "—"}
              label="m²"
            />
            <CardFact
              Icon={FaSwimmingPool}
              value={offer.pool ? "Tak" : "Nie"}
              label="basen"
            />
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                {offer.new_build ? "Cena od" : "Cena"}
              </p>
              <p className="mt-1 text-[23px] font-extrabold tracking-[-0.03em] text-[#9b7a36]">
                {formatPrice(offer.price)}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#182334] text-white transition duration-300 group-hover:bg-[#d6b66f] group-hover:text-[#182334]">
              <FiArrowRight aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

function CardFact({
  Icon,
  value,
  label,
}: {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center border-r border-[#ebe4da] px-1 last:border-r-0">
      <Icon className="h-4 w-4 text-[#b8954c]" aria-hidden={true} />
      <p className="mt-1.5 truncate text-[12px] font-extrabold text-[#26364b]">
        {value}{" "}
        <span className="text-[8px] font-bold text-slate-400">{label}</span>
      </p>
    </div>
  );
}

function PropertyModal({
  offer,
  status,
  onClose,
}: {
  offer: AgentOffer;
  status: DetailStatus;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const images = imageUrls(offer.images);
  const gallery = images.length ? images : ["/logotype_full_new.png"];
  const activeImage = gallery[imageIndex] || gallery[0];
  const title = offerTitle(offer);
  const coast = getCoastLabelFromProvince(offer.province);
  const country =
    getCountryLabel(offer.country) || offer.country || "Hiszpania";
  const description = descriptionValue(offer.descriptions);
  const features = featureValues(offer.features).slice(0, 14);

  useEffect(() => {
    setImageIndex(0);
    setImageLoading(true);
  }, [offer.external_id]);

  useEffect(() => {
    setImageLoading(true);
  }, [activeImage]);

  useEffect(() => {
    thumbnailRefs.current[imageIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [imageIndex]);

  const previousImage = () => {
    setImageLoading(true);
    setImageIndex((current) => (current - 1 + gallery.length) % gallery.length);
  };
  const nextImage = () => {
    setImageLoading(true);
    setImageIndex((current) => (current + 1) % gallery.length);
  };
  const selectImage = (index: number) => {
    if (index === imageIndex) return;
    setImageLoading(true);
    setImageIndex(index);
  };

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted || formStatus === "sending") return;

    setFormStatus("sending");
    try {
      const response = await fetch("/api/formFromProperty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: offer.external_id,
          name: contactForm.fullName.trim(),
          mail: contactForm.email.trim(),
          phone: contactForm.phone.trim(),
          massege: `Proszę o kontakt w sprawie oferty ${offer.external_id} z prezentacji /cbtop.`,
          ref: offer.external_id,
          consents: {
            rodo: privacyAccepted,
            marketing: false,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload?.status !== 200) {
        throw new Error("Nie udało się wysłać formularza");
      }

      trackGoogleAdsContactConversion();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  const facts = [
    { label: "Sypialnie", value: offer.beds ?? "—", Icon: IoBedOutline },
    { label: "Łazienki", value: offer.baths ?? "—", Icon: PiBathtubLight },
    {
      label: "Powierzchnia",
      value: offer.surface_built ? `${offer.surface_built} m²` : "—",
      Icon: BiArea,
    },
    {
      label: "Basen",
      value: offer.pool ? "Tak" : "Nie",
      Icon: FaSwimmingPool,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#09111f]/80 p-0 backdrop-blur-[6px] sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="cbtop-modal-panel relative h-full w-full overflow-hidden bg-[#f5f1ea] shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:h-[92vh] sm:max-w-[1380px] sm:rounded-[26px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cbtop-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#182334] shadow-lg transition hover:bg-[#182334] hover:text-white sm:right-5 sm:top-5"
          aria-label="Zamknij szczegóły oferty"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1.12fr)_minmax(430px,0.88fr)]">
          <div className="relative h-[42vh] min-h-[310px] overflow-hidden bg-[#141f2e] lg:h-full lg:min-h-0">
            <Image
              key={activeImage}
              fill
              src={displayImageUrl(activeImage)}
              alt={`${title} — zdjęcie ${imageIndex + 1}`}
              sizes="(max-width: 1023px) 100vw, 58vw"
              quality={75}
              loading="eager"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center bg-[#141f2e] transition-opacity duration-300 ${
                imageLoading ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-live="polite"
              aria-label={imageLoading ? "Ładowanie zdjęcia" : undefined}
            >
              <div className="flex flex-col items-center gap-3 text-white">
                <span className="cbtop-image-loader h-11 w-11 rounded-full border-2 border-white/20 border-t-[#e2c477]" />
                <span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-white/65">
                  Ładowanie zdjęcia
                </span>
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#09111f]/45 to-transparent" />

            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 sm:left-6 sm:top-6">
              <span className="rounded-full border border-white/25 bg-[#09111f]/55 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                {imageIndex + 1} / {gallery.length}
              </span>
            </div>

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#182334] shadow-lg transition hover:bg-[#d6b66f] sm:left-6"
                  aria-label="Poprzednie zdjęcie"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#182334] shadow-lg transition hover:bg-[#d6b66f] sm:right-6"
                  aria-label="Następne zdjęcie"
                >
                  <FiChevronRight />
                </button>
              </>
            ) : null}

            {gallery.length > 1 ? (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#09111f] via-[#09111f]/90 to-transparent pb-4 pt-14 sm:pb-6 sm:pt-20">
                <div className="mx-auto mb-2 flex w-[92%] items-center justify-between px-1 text-white/70">
                  <span className="text-[8px] font-extrabold uppercase tracking-[0.16em]">
                    Galeria · {gallery.length} zdjęć
                  </span>
                  <span className="hidden text-[8px] font-bold uppercase tracking-[0.1em] sm:block">
                    Przewiń, aby zobaczyć więcej
                  </span>
                </div>
                <div className="cbtop-gallery-strip mx-auto flex w-[94%] snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-2 pt-1">
                  {gallery.map((image, index) => (
                    <button
                      ref={(element) => {
                        thumbnailRefs.current[index] = element;
                      }}
                      data-gallery-index={index}
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => selectImage(index)}
                      className={`group/thumb relative h-14 w-[76px] shrink-0 snap-center overflow-hidden rounded-xl border transition duration-200 sm:h-16 sm:w-[92px] ${
                        imageIndex === index
                          ? "-translate-y-1 border-[#e8ca7d] opacity-100 shadow-[0_8px_22px_rgba(0,0,0,0.35)] ring-2 ring-[#e8ca7d]/25"
                          : "border-white/15 opacity-55 hover:border-white/50 hover:opacity-100"
                      }`}
                      aria-label={`Pokaż zdjęcie ${index + 1}`}
                      aria-current={imageIndex === index ? "true" : undefined}
                    >
                      <Image
                        fill
                        src={displayImageUrl(image)}
                        alt=""
                        sizes="92px"
                        quality={70}
                        loading="lazy"
                        className="object-cover transition duration-300 group-hover/thumb:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#09111f]/75 px-1 text-[7px] font-extrabold text-white backdrop-blur-sm">
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="cbtop-details-scroll h-full overflow-y-auto overscroll-contain">
            <div className="px-6 pb-10 pt-8 sm:px-9 sm:pb-12 sm:pt-10 lg:px-11">
              <div className="flex flex-wrap items-center gap-2 pr-12">
                <span className="rounded-full bg-[#e9ddc7] px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#7d6029]">
                  Selekcja Onesta
                </span>
                {status === "loading" ? (
                  <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#d6b66f]" />
                    Pobieramy pełne dane
                  </span>
                ) : null}
              </div>

              <p className="mt-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#9b7a36]">
                <FiMapPin aria-hidden="true" />
                {[country, coast, offer.town].filter(Boolean).join(" · ")}
              </p>
              <h2
                id="cbtop-modal-title"
                className={`${HomePlayfairSans.className} mt-3 text-[36px] font-semibold leading-[1.06] tracking-[-0.035em] text-[#182334] sm:text-[46px]`}
              >
                {title}
              </h2>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Numer oferty: {offer.external_id}
              </p>

              <div className="mt-7 rounded-2xl bg-[#182334] px-6 py-5 text-white shadow-lg">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#d6b66f]">
                  {offer.new_build ? "Cena od" : "Cena"}
                </p>
                <p className="mt-1 text-[32px] font-extrabold tracking-[-0.035em]">
                  {formatPrice(offer.price)}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white sm:grid-cols-4">
                {facts.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="flex min-h-[92px] flex-col items-center justify-center border-b border-r border-[#e8e0d5] px-3 py-4 text-center last:border-r-0 sm:border-b-0"
                  >
                    <Icon
                      className="h-5 w-5 text-[#b8954c]"
                      aria-hidden="true"
                    />
                    <strong className="mt-2 text-[14px] text-[#26364b]">
                      {value}
                    </strong>
                    <span className="mt-1 text-[7px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {offer.distance_to_sea_m ? (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#ddd3c4] bg-white px-5 py-4">
                  <FiMapPin
                    className="shrink-0 text-[#b8954c]"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] font-bold text-[#455468]">
                    Około{" "}
                    {Number(offer.distance_to_sea_m).toLocaleString("pl-PL")} m
                    od morza
                  </p>
                </div>
              ) : null}

              <div className="mt-9 border-t border-[#ddd3c4] pt-8">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">
                  O nieruchomości
                </p>
                <h3
                  className={`${HomePlayfairSans.className} mt-2 text-[29px] font-semibold text-[#182334]`}
                >
                  Najważniejsze informacje
                </h3>
                <p className="mt-5 whitespace-pre-line text-[13px] leading-7 text-[#566477]">
                  {description ||
                    (status === "loading"
                      ? "Pobieramy szczegółowy opis nieruchomości…"
                      : "Zapytaj doradcę Onesta o pełny opis, dostępność i aktualne warunki tej nieruchomości.")}
                </p>
                {status === "error" ? (
                  <p className="mt-3 text-[10px] font-semibold text-[#9b7a36]">
                    Nie udało się pobrać części danych. Podstawowe informacje są
                    nadal aktualne.
                  </p>
                ) : null}
              </div>

              {features.length ? (
                <div className="mt-8 border-t border-[#ddd3c4] pt-8">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">
                    Udogodnienia
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span
                        key={feature}
                        className="flex items-center gap-2 rounded-full border border-[#ddcfbb] bg-white px-4 py-2.5 text-[9px] font-bold text-[#405066]"
                      >
                        <FiCheck
                          className="text-[#9b7a36]"
                          aria-hidden="true"
                        />
                        {featureLabel(feature)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-9 overflow-hidden rounded-[24px] bg-[#182334] px-6 py-7 text-white shadow-[0_18px_45px_rgba(24,35,52,0.18)] sm:px-8 sm:py-8">
                {formStatus === "success" ? (
                  <div className="flex min-h-[310px] flex-col items-center justify-center text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d6b66f] text-[#182334]">
                      <FiCheckCircle className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#d6b66f]">
                      Wiadomość wysłana
                    </p>
                    <h3
                      className={`${HomePlayfairSans.className} mt-2 text-[31px] font-semibold leading-tight`}
                    >
                      Dziękujemy za kontakt
                    </h3>
                    <p className="mt-3 max-w-sm text-[11px] leading-5 text-slate-300">
                      Doradca Onesta skontaktuje się z Tobą w sprawie oferty{" "}
                      {offer.external_id}.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#d6b66f]">
                      Chcesz poznać szczegóły?
                    </p>
                    <h3
                      className={`${HomePlayfairSans.className} mt-2 text-[29px] font-semibold leading-tight`}
                    >
                      Zapytaj o tę ofertę
                    </h3>
                    <p className="mt-3 text-[11px] leading-5 text-slate-300">
                      Zostaw kontakt. Potwierdzimy dostępność, cenę i odpowiemy
                      na pytania.
                    </p>

                    <form
                      className="mt-6 space-y-3"
                      onSubmit={submitContactForm}
                    >
                      <label className="block">
                        <span className="mb-1.5 block text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                          Imię i nazwisko
                        </span>
                        <input
                          required
                          type="text"
                          autoComplete="name"
                          value={contactForm.fullName}
                          onChange={(event) => {
                            setContactForm((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }));
                            if (formStatus === "error") setFormStatus("idle");
                          }}
                          placeholder="Jan Kowalski"
                          className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 text-[12px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-[#d6b66f] focus:bg-white/[0.11]"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                          Adres e-mail
                        </span>
                        <input
                          required
                          type="email"
                          autoComplete="email"
                          value={contactForm.email}
                          onChange={(event) => {
                            setContactForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }));
                            if (formStatus === "error") setFormStatus("idle");
                          }}
                          placeholder="jan@email.pl"
                          className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 text-[12px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-[#d6b66f] focus:bg-white/[0.11]"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                          Telefon{" "}
                          <span className="normal-case tracking-normal text-slate-500">
                            (opcjonalnie)
                          </span>
                        </span>
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={contactForm.phone}
                          onChange={(event) => {
                            setContactForm((current) => ({
                              ...current,
                              phone: event.target.value,
                            }));
                            if (formStatus === "error") setFormStatus("idle");
                          }}
                          placeholder="+48 000 000 000"
                          className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 text-[12px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-[#d6b66f] focus:bg-white/[0.11]"
                        />
                      </label>

                      <label className="flex cursor-pointer items-start gap-3 pt-1 text-[9px] leading-4 text-slate-400">
                        <input
                          required
                          type="checkbox"
                          checked={privacyAccepted}
                          onChange={(event) =>
                            setPrivacyAccepted(event.target.checked)
                          }
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#d6b66f]"
                        />
                        <span>
                          Potwierdzam zapoznanie się z{" "}
                          <a
                            href="/polityka-prywatnosci"
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-[#d6b66f] underline underline-offset-2"
                          >
                            Polityką Prywatności
                          </a>
                          .
                        </span>
                      </label>

                      {formStatus === "error" ? (
                        <p
                          className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-[9px] font-semibold text-red-100"
                          role="alert"
                        >
                          Nie udało się wysłać formularza. Spróbuj ponownie za
                          chwilę.
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={formStatus === "sending"}
                        className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#d6b66f] px-6 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#182334] transition hover:bg-white disabled:cursor-wait disabled:opacity-65"
                      >
                        {formStatus === "sending" ? (
                          <>
                            <span className="cbtop-form-loader h-4 w-4 rounded-full border-2 border-[#182334]/20 border-t-[#182334]" />
                            Wysyłanie
                          </>
                        ) : (
                          <>
                            <FiSend aria-hidden="true" /> Wyślij zapytanie
                          </>
                        )}
                      </button>
                      <p className="text-center text-[8px] font-semibold text-slate-500">
                        Numer oferty {offer.external_id} dołączymy
                        automatycznie.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CbTopPage({ offers, socialImage }: CbTopPageProps) {
  const [activeOffer, setActiveOffer] = useState<AgentOffer | null>(null);
  const [detailStatus, setDetailStatus] = useState<DetailStatus>("idle");
  const detailCache = useRef(new Map<string, AgentOffer>());
  const modalOpen = Boolean(activeOffer);

  useEffect(() => {
    if (!activeOffer?.external_id) return;

    const offerId = String(activeOffer.external_id);
    const cached = detailCache.current.get(offerId);
    if (cached) {
      setActiveOffer(cached);
      setDetailStatus("ready");
      return;
    }

    const controller = new AbortController();
    setDetailStatus("loading");

    void fetch(`/api/cbtop/${encodeURIComponent(offerId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload?.offer) {
          throw new Error(payload?.error || "Nie udało się pobrać oferty");
        }
        return payload.offer as AgentOffer;
      })
      .then((offer) => {
        detailCache.current.set(offerId, offer);
        setActiveOffer((current) =>
          current?.external_id === offerId ? offer : current,
        );
        setDetailStatus("ready");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setDetailStatus("error");
      });

    return () => controller.abort();
  }, [activeOffer?.external_id]);

  useEffect(() => {
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveOffer(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalOpen]);

  const openOffer = (offer: AgentOffer) => {
    const cached = detailCache.current.get(String(offer.external_id));
    setActiveOffer(cached || offer);
    setDetailStatus(cached ? "ready" : "loading");
  };

  return (
    <>
      <Head>
        <title>TOP 20 nieruchomości na Costa Blanca | Onesta Group</title>
        <meta
          name="description"
          content="20 starannie wybranych nieruchomości na Costa Blanca. Zobacz zdjęcia, ceny i szczegóły bez opuszczania prezentacji Onesta Group."
        />
        <meta name="robots" content="noindex,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Onesta Group" />
        <meta
          property="og:title"
          content="20 nieruchomości, które warto zobaczyć na Costa Blanca"
        />
        <meta
          property="og:description"
          content="Prywatna selekcja nowych nieruchomości przygotowana przez Onesta Group."
        />
        <meta property="og:url" content="https://onesta.com.pl/cbtop" />
        {socialImage ? (
          <meta property="og:image" content={socialImage} />
        ) : null}
      </Head>

      <div
        className={`${HomeMontserratSans.className} min-h-screen bg-[#f5f1ea] text-[#182334]`}
      >
        <section className="relative overflow-hidden bg-[#182334] text-white">
          <div className="absolute -right-32 -top-44 h-[420px] w-[420px] rounded-full border border-[#d6b66f]/20" />
          <div className="absolute -right-12 -top-24 h-[280px] w-[280px] rounded-full bg-[#d6b66f]/10 blur-3xl" />
          <div className="absolute -bottom-48 left-[12%] h-[320px] w-[320px] rounded-full bg-[#445d78]/30 blur-3xl" />

          <div className="relative mx-auto grid w-11/12 max-w-[1380px] gap-8 py-9 sm:py-11 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end lg:py-12">
            <div className="max-w-[870px]">
              <div className="relative mb-10 h-[44px] w-[176px] max-w-full">
                <Image
                  src={Logotype}
                  alt="Onesta Group"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                  loading="eager"
                />
              </div>
              <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#d6b66f]">
                <span className="h-px w-8 bg-[#d6b66f]" />
                ręcznie wybrane oferty · Costa Blanca
              </p>
              <h1
                className={`${HomePlayfairSans.className} mt-4 max-w-[820px] text-[39px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[54px] lg:text-[64px]`}
              >
                20 nieruchomości,
                <span className="text-[#dfc27e]">
                  {" "}
                  które warto zobaczyć teraz.
                </span>
              </h1>
              <p className="mt-5 max-w-[690px] text-[12px] leading-6 text-slate-300 sm:text-[14px] sm:leading-7">
                Wybraliśmy nowe inwestycje w najlepszych lokalizacjach Costa
                Blanca. Otwórz dowolną ofertę i obejrzyj galerię.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-6 backdrop-blur-sm sm:px-7">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#d6b66f]">
                Skontaktuj się z nami
              </p>
              <div className="mt-4 grid gap-3">
                <a
                  href={PHONE_HREF}
                  className="group/contact flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 transition hover:border-[#d6b66f]/60 hover:bg-white/[0.09]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d6b66f] text-[#182334]">
                    <FiPhone aria-hidden="true" />
                  </span>
                  <span className="text-[12px] font-extrabold tracking-[-0.01em] text-white sm:text-[14px]">
                    +48 576 652 525
                  </span>
                </a>
                <a
                  href="mailto:biuro@onesta.com.pl"
                  className="group/contact flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 transition hover:border-[#d6b66f]/60 hover:bg-white/[0.09]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d6b66f] text-[#182334]">
                    <FiMail aria-hidden="true" />
                  </span>
                  <span className="break-all text-[12px] font-extrabold tracking-[-0.01em] text-white sm:text-[14px]">
                    biuro@onesta.com.pl
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <main className="relative mx-auto w-11/12 max-w-[1380px] pb-20">
          <div className="relative -mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-[#dfd5c7] bg-white px-5 py-4 shadow-[0_12px_35px_rgba(24,35,52,0.08)] sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe4d0] text-[#9b7a36]">
                <FiCheck aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#182334]">
                  Wyselekcjonowane oferty
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Kliknij kartę, aby zobaczyć pełne szczegóły w oknie
                  prezentacji.
                </p>
              </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[#9b7a36]">
              Dostępność aktualizowana na bieżąco
            </p>
          </div>

          {offers.length ? (
            <section
              className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              aria-label="20 wybranych nieruchomości"
            >
              {offers.map((offer, index) => (
                <PropertyCard
                  key={offer.external_id}
                  offer={offer}
                  index={index}
                  onOpen={openOffer}
                />
              ))}
            </section>
          ) : (
            <section className="mt-7 rounded-3xl border border-[#dfd5c7] bg-white px-8 py-16 text-center">
              <h2
                className={`${HomePlayfairSans.className} text-[34px] font-semibold`}
              >
                Odświeżamy wybrane oferty
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-slate-500">
                Lista jest chwilowo niedostępna. Skontaktuj się z nami, a
                prześlemy aktualną selekcję bezpośrednio.
              </p>
              <a
                href={PHONE_HREF}
                className="mx-auto mt-6 flex min-h-[48px] w-fit items-center gap-2 rounded-full bg-[#182334] px-6 text-[10px] font-extrabold uppercase tracking-[0.11em] text-white"
              >
                <FiPhone /> {PHONE_NUMBER}
              </a>
            </section>
          )}

          <section className="relative mt-12 overflow-hidden rounded-[28px] bg-[#182334] px-7 py-10 text-white sm:px-11 sm:py-12">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#d6b66f]/20" />
            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-[720px]">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#d6b66f]">
                  Kolejny krok
                </p>
                <h2
                  className={`${HomePlayfairSans.className} mt-3 text-[34px] font-semibold leading-tight sm:text-[43px]`}
                >
                  Która nieruchomość pasuje do Twojego planu?
                </h2>
                <p className="mt-4 text-[12px] leading-6 text-slate-300">
                  Porównamy lokalizacje, koszty i potencjał wybranych
                  inwestycji.
                </p>
              </div>
              <a
                href={PHONE_HREF}
                className="flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#d6b66f] px-7 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#182334] transition hover:bg-white"
              >
                <FiPhone aria-hidden="true" /> Porozmawiaj z doradcą
              </a>
            </div>
          </section>

          <footer className="flex flex-col items-center justify-between gap-3 py-8 text-center text-[9px] font-semibold text-slate-400 sm:flex-row sm:text-left">
            <p>© Onesta Group · Nieruchomości za granicą kupowane świadomie.</p>
            <p>Ceny i dostępność ofert mogą ulec zmianie.</p>
          </footer>
        </main>
      </div>

      {activeOffer ? (
        <PropertyModal
          offer={activeOffer}
          status={detailStatus}
          onClose={() => setActiveOffer(null)}
        />
      ) : null}

      <style jsx global>{`
        @keyframes cbtop-modal-enter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cbtop-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .cbtop-modal-panel {
          animation: cbtop-modal-enter 220ms ease-out both;
        }

        .cbtop-image-loader,
        .cbtop-form-loader {
          animation: cbtop-spin 700ms linear infinite;
        }

        .cbtop-gallery-strip {
          scrollbar-color: rgba(226, 196, 119, 0.75) rgba(255, 255, 255, 0.08);
          scrollbar-width: thin;
        }

        .cbtop-gallery-strip::-webkit-scrollbar {
          height: 4px;
        }

        .cbtop-gallery-strip::-webkit-scrollbar-track {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
        }

        .cbtop-gallery-strip::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(226, 196, 119, 0.75);
        }

        .cbtop-details-scroll {
          scrollbar-color: rgba(184, 149, 76, 0.85) rgba(24, 35, 52, 0.08);
          scrollbar-width: thin;
        }

        .cbtop-details-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .cbtop-details-scroll::-webkit-scrollbar-track {
          border-radius: 999px;
          background: rgba(24, 35, 52, 0.08);
        }

        .cbtop-details-scroll::-webkit-scrollbar-thumb {
          border: 1px solid rgba(245, 241, 234, 0.75);
          border-radius: 999px;
          background: rgba(184, 149, 76, 0.85);
        }

        @media (prefers-reduced-motion: reduce) {
          .cbtop-modal-panel {
            animation: none;
          }

          .cbtop-image-loader,
          .cbtop-form-loader {
            animation-duration: 1.5s;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<CbTopPageProps> = async (
  context,
) => {
  if (!supabaseServer) {
    return { props: { offers: [], socialImage: "" } };
  }

  const { data: liveProperties } = await supabaseServer
    .from("properties")
    .select(AGENT_OFFER_CARD_COLUMNS)
    .in("external_id", [...CBTOP_PROPERTY_IDS]);

  const liveById = new Map(
    ((liveProperties || []) as unknown as AgentOffer[]).map((offer) => [
      String(offer.external_id),
      offer,
    ]),
  );

  let storedById = new Map<string, AgentOffer>();
  if (liveById.size < CBTOP_PROPERTY_IDS.length) {
    const { data: presentation } = await supabaseServer
      .from("agent_offer_lists")
      .select("offers")
      .eq("public_token", CBTOP_SOURCE_PRESENTATION_TOKEN)
      .maybeSingle();

    const storedOffers = Array.isArray(presentation?.offers)
      ? (presentation.offers as unknown as AgentOffer[])
      : [];
    storedById = new Map(
      storedOffers.map((offer) => [String(offer.external_id), offer]),
    );
  }

  const fullOffers = CBTOP_PROPERTY_IDS.map(
    (offerId) => liveById.get(offerId) || storedById.get(offerId),
  ).filter((offer): offer is AgentOffer => Boolean(offer));
  const firstImage = imageUrls(fullOffers[0]?.images)[0] || "";
  const offers: CbTopCardOffer[] = fullOffers.map((offer) => {
    const images = imageUrls(offer.images);
    const {
      descriptions: _descriptions,
      features: _features,
      latitude: _latitude,
      longitude: _longitude,
      surface_plot: _surfacePlot,
      ...cardOffer
    } = offer;

    return {
      ...cardOffer,
      images: images.slice(0, 1),
      imageCount: images.length,
    } as CbTopCardOffer;
  });

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=3600",
  );

  return {
    props: {
      offers,
      socialImage: firstImage.startsWith("http") ? firstImage : "",
    },
  };
};
