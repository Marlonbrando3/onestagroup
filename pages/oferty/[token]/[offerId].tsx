import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import {
  FaArrowLeft,
  FaBath,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaHome,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaSwimmingPool,
  FaTimes,
} from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { AGENT_OFFER_COLUMNS, type AgentOffer } from "@/lib/agentOffers";
import { propertyTypeLabel } from "@/lib/i18n";
import { getCoastLabelFromProvince, getCountryLabel } from "@/lib/regionMap";
import { supabaseServer } from "@/lib/supabaseClient";
import { validTitleOrEmpty } from "@/lib/titlesDictionary";
import Logotype from "@/public/logotype_full_new.png";

type PresentationOfferProps = {
  token: string;
  offer: AgentOffer;
  images: string[];
  description: string;
  features: string[];
};

function formatPrice(value: number | null) {
  const numeric = Number(value || 0);
  return numeric ? `${numeric.toLocaleString("pl-PL")} €` : "Cena na zapytanie";
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
    "video-door-entry": "Wideodomofon",
    gym: "Siłownia",
    spa: "Spa",
    sauna: "Sauna",
    playground: "Plac zabaw",
  };

  if (labels[normalized]) return labels[normalized];
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default function PresentationOfferPage({
  token,
  offer,
  images,
  description,
  features,
}: PresentationOfferProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const typeLabel =
    propertyTypeLabel.pl[offer.type || ""] || offer.type || "Nieruchomość";
  const title =
    validTitleOrEmpty(offer.title) ||
    `${typeLabel} w ${offer.town || offer.province || "Hiszpanii"}`;
  const coast = getCoastLabelFromProvince(offer.province);
  const country = getCountryLabel(offer.country) || offer.country || "Hiszpania";
  const locationLine = [coast, offer.town].filter(Boolean).join(", ");
  const hasCoordinates =
    Number.isFinite(Number(offer.latitude)) &&
    Number.isFinite(Number(offer.longitude)) &&
    Number(offer.latitude) !== 0 &&
    Number(offer.longitude) !== 0;
  const mapQuery = hasCoordinates
    ? `${offer.latitude},${offer.longitude}`
    : [offer.town, offer.province, country].filter(Boolean).join(", ");
  const galleryImages = images.length ? images : ["/logotype_full_new.png"];

  const previousImage = () => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const nextImage = () => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % galleryImages.length,
    );
  };

  const facts = [
    {
      label: "Sypialnie",
      value: offer.beds ?? "—",
      Icon: IoBedOutline,
    },
    { label: "Łazienki", value: offer.baths ?? "—", Icon: FaBath },
    {
      label: "Powierzchnia",
      value: offer.surface_built ? `${offer.surface_built} m²` : "—",
      Icon: FaRulerCombined,
    },
    {
      label: "Działka",
      value: offer.surface_plot ? `${offer.surface_plot} m²` : "—",
      Icon: FaHome,
    },
    {
      label: "Basen",
      value: offer.pool ? "Tak" : "Nie",
      Icon: FaSwimmingPool,
    },
    {
      label: "Do morza",
      value: offer.distance_to_sea_m
        ? `${Number(offer.distance_to_sea_m).toLocaleString("pl-PL")} m`
        : "—",
      Icon: FaMapMarkerAlt,
    },
  ];

  return (
    <>
      <Head>
        <title>{title} | Prezentacja Onesta</title>
        <meta name="description" content={description.slice(0, 160) || title} />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className={`${HomeMontserratSans.className} min-h-screen bg-[#f4f1eb] text-[#182334]`}>
        <div className="border-b border-[#ddd3c4] bg-white">
          <div className="mx-auto flex min-h-[72px] w-11/12 max-w-[1380px] items-center justify-between gap-4 py-3">
            <Link href={`/oferty/${token}`} className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#6b5a3d] transition hover:text-[#182334]">
              <FaArrowLeft aria-hidden="true" /> Wróć do prezentacji
            </Link>
            <div className="relative h-[42px] w-[135px]">
              <Image src={Logotype} alt="Onesta Group" fill sizes="135px" className="object-contain" priority />
            </div>
          </div>
        </div>

        <main className="mx-auto w-11/12 max-w-[1380px] pb-20 pt-8">
          <section className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-[940px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b7a36]">
                {typeLabel} · ref. {offer.external_id}
              </p>
              <h1 className={`${HomePlayfairSans.className} mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]`}>
                {title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-slate-500">
                <FaMapMarkerAlt className="text-[#b8954c]" aria-hidden="true" />
                {[country, locationLine].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-[#182334] px-6 py-5 text-white shadow-lg">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#d6b66f]">Cena</p>
              <p className="mt-1 text-[29px] font-extrabold">{formatPrice(offer.price)}</p>
            </div>
          </section>

          <section className={`grid overflow-hidden rounded-[22px] bg-[#ded6ca] shadow-[0_20px_55px_rgba(24,35,52,0.14)] ${galleryImages.length > 1 ? "h-[430px] gap-1 md:grid-cols-[1.7fr_1fr] lg:h-[570px]" : "h-[430px] lg:h-[570px]"}`}>
            <button type="button" onClick={() => setLightboxIndex(0)} className="group relative min-h-0 overflow-hidden bg-[#ddd4c5] text-left">
              <Image src={galleryImages[0]} alt={`${title} — zdjęcie 1`} fill sizes="(max-width: 768px) 100vw, 68vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" priority />
              <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#182334] shadow-lg">
                <FaExpand aria-hidden="true" /> Otwórz galerię
              </span>
            </button>

            {galleryImages.length > 1 ? (
              <div className="hidden min-h-0 grid-cols-2 grid-rows-2 gap-1 md:grid">
                {galleryImages.slice(1, 5).map((image, index) => {
                  const absoluteIndex = index + 1;
                  const remaining = galleryImages.length - 5;
                  return (
                    <button key={`${image}-${absoluteIndex}`} type="button" onClick={() => setLightboxIndex(absoluteIndex)} className="group relative min-h-0 overflow-hidden bg-[#ddd4c5]">
                      <Image src={image} alt={`${title} — zdjęcie ${absoluteIndex + 1}`} fill sizes="34vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                      {absoluteIndex === 4 && remaining > 0 ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#182334]/60 text-[20px] font-extrabold text-white">+{remaining}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="relative z-10 mx-auto -mt-5 grid max-w-[1240px] grid-cols-2 overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-[0_18px_45px_rgba(24,35,52,0.10)] sm:grid-cols-3 lg:grid-cols-6">
            {facts.map(({ label, value, Icon }) => (
              <div key={label} className="flex min-h-[100px] items-center gap-3 border-b border-r border-[#e8e0d5] px-4 py-4 last:border-r-0 sm:px-5 lg:border-b-0">
                <Icon className="shrink-0 text-[20px] text-[#b8954c]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-slate-400">{label}</p>
                  <p className="mt-1 truncate text-[14px] font-extrabold text-[#26364b]">{value}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="grid gap-7">
              <section className="rounded-2xl border border-[#ded5c8] bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-9">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">O nieruchomości</p>
                <h2 className={`${HomePlayfairSans.className} mt-2 text-[32px] font-semibold`}>Opis oferty</h2>
                <div className="mt-6 whitespace-pre-line text-[14px] leading-7 text-[#526173] sm:text-[15px]">
                  {description || "Szczegółowy opis tej nieruchomości nie został jeszcze uzupełniony."}
                </div>
              </section>

              <section className="rounded-2xl border border-[#ded5c8] bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-9">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">Wyposażenie i udogodnienia</p>
                <h2 className={`${HomePlayfairSans.className} mt-2 text-[32px] font-semibold`}>Atuty oferty</h2>
                {features.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span key={feature} className="rounded-full border border-[#ddcfbb] bg-[#f8f4ed] px-4 py-2.5 text-[10px] font-bold text-[#405066]">
                        {featureLabel(feature)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-[13px] text-slate-500">Brak dodatkowych atutów w danych oferty.</p>
                )}
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-sm lg:sticky lg:top-6">
              <div className="px-6 py-6 sm:px-8">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">Lokalizacja</p>
                <h2 className={`${HomePlayfairSans.className} mt-2 text-[29px] font-semibold`}>{locationLine || country}</h2>
                <p className="mt-3 text-[12px] leading-6 text-slate-500">{[offer.province, country].filter(Boolean).join(" · ")}</p>
              </div>
              <iframe title={`Mapa — ${locationLine || country}`} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=11`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[360px] w-full border-0" />
            </section>
          </div>
        </main>

        {lightboxIndex !== null ? (
          <div className="fixed inset-0 z-[100] flex flex-col bg-[#0c1420]/95 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Galeria zdjęć">
            <div className="flex h-12 items-center justify-between text-white">
              <p className="text-[11px] font-bold">{lightboxIndex + 1} / {galleryImages.length}</p>
              <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Zamknij galerię" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                <FaTimes />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={galleryImages[lightboxIndex]} alt={`${title} — zdjęcie ${lightboxIndex + 1}`} fill sizes="100vw" className="object-contain p-2" priority />
              {galleryImages.length > 1 ? (
                <>
                  <button type="button" onClick={previousImage} aria-label="Poprzednie zdjęcie" className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#182334] shadow-lg sm:left-5">
                    <FaChevronLeft />
                  </button>
                  <button type="button" onClick={nextImage} aria-label="Następne zdjęcie" className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#182334] shadow-lg sm:right-5">
                    <FaChevronRight />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

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
        .filter(Boolean),
    ),
  );
}

function featureValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map((item) => String(item || "").trim()).filter(Boolean)));
  }
  if (value && typeof value === "object") {
    const nested = (value as Record<string, unknown>).feature;
    return featureValues(nested);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
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

export const getServerSideProps: GetServerSideProps<PresentationOfferProps> = async (
  context,
) => {
  if (!supabaseServer) return { notFound: true };

  const token = String(context.params?.token || "").trim();
  const offerId = String(context.params?.offerId || "").trim();
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token) || !offerId) {
    return { notFound: true };
  }

  const { data: presentation, error } = await supabaseServer
    .from("agent_offer_lists")
    .select("offers")
    .eq("public_token", token)
    .maybeSingle();

  if (error || !presentation || !Array.isArray(presentation.offers)) {
    return { notFound: true };
  }

  const storedOffer = (presentation.offers as unknown as AgentOffer[]).find(
    (offer) => String(offer.external_id) === offerId,
  );
  if (!storedOffer) return { notFound: true };

  const needsEnrichment =
    !storedOffer.descriptions ||
    !storedOffer.features ||
    storedOffer.latitude === undefined ||
    storedOffer.longitude === undefined;
  let liveOffer: Partial<AgentOffer> | null = null;

  if (needsEnrichment) {
    const { data } = await supabaseServer
      .from("properties")
      .select(AGENT_OFFER_COLUMNS)
      .eq("external_id", offerId)
      .maybeSingle();
    liveOffer = (data || null) as unknown as Partial<AgentOffer> | null;
  }

  const offer = {
    ...(liveOffer || {}),
    ...storedOffer,
    descriptions: storedOffer.descriptions ?? liveOffer?.descriptions ?? null,
    features: storedOffer.features ?? liveOffer?.features ?? [],
    latitude: storedOffer.latitude ?? liveOffer?.latitude ?? null,
    longitude: storedOffer.longitude ?? liveOffer?.longitude ?? null,
    surface_plot: storedOffer.surface_plot ?? liveOffer?.surface_plot ?? null,
  } as AgentOffer;

  return {
    props: {
      token,
      offer,
      images: imageUrls(offer.images),
      description: descriptionValue(offer.descriptions),
      features: featureValues(offer.features),
    },
  };
};
