import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBath,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaExpand,
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegUser,
  FaRulerCombined,
  FaSwimmingPool,
  FaTimes,
} from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { AGENT_OFFER_COLUMNS, type AgentOffer } from "@/lib/agentOffers";
import { propertyTypeLabel } from "@/lib/i18n";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { getCoastLabelFromProvince, getCountryLabel } from "@/lib/regionMap";
import { supabaseServer } from "@/lib/supabaseClient";
import { validTitleOrEmpty } from "@/lib/titlesDictionary";
import { propertyImageUrl } from "@/lib/propertyImages";
import {
  imageUrls,
  descriptionValue,
} from "@/lib/presentationOffer";
import OfferPdfButton from "@/components/agent/OfferPdfButton";
import ProjectUnits from "@/components/offer/ProjectUnits";
import ContactOnPropertyCard from "@/components/SearchEngine/ContactOnPropertyCard";
import Footer from "@/components/Footer";
import InterestButton from "@/components/presentation/InterestButton";
import { getProjectUnits, type ProjectUnit } from "@/lib/projectUnits";
import { normalizeFeatures } from "@/lib/propertyFeatures";
import type { OfferPdfContact } from "@/lib/offerPdf";
import { formatPhone } from "@/lib/phone";

type PresentationOfferProps = {
  token: string;
  offer: AgentOffer;
  images: string[];
  description: string;
  features: string[];
  contact: OfferPdfContact;
  projectUnits: ProjectUnit[];
};

function formatPrice(value: number | null) {
  const numeric = Number(value || 0);
  return numeric ? `${numeric.toLocaleString("pl-PL")} €` : "Cena na zapytanie";
}

export default function PresentationOfferPage({
  token,
  offer,
  images,
  description,
  features,
  contact,
  projectUnits,
}: PresentationOfferProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  // Czy belka „Podoba Ci się ta oferta?” jest już przyklejona do góry (znacznik nad nią zniknął z ekranu).
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [barStuck, setBarStuck] = useState(false);
  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setBarStuck(sentinel.getBoundingClientRect().top < 5);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  // Długi opis zwijamy: widać początek, dół tekstu zanika, pod spodem „Czytaj dalej”.
  const descriptionIsLong = description.length >= 900;
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
            <div className="flex flex-wrap items-center justify-end gap-3">
              <OfferPdfButton
                offer={offer}
                contact={contact}
                publicPath={`/oferty/${encodeURIComponent(token)}/${encodeURIComponent(offer.external_id)}`}
              />
              <div className="relative h-[42px] w-[135px]">
                <Image src="/logotype_full_new.svg" alt="Onesta Group" fill sizes="135px" className="object-contain" priority />
              </div>
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
              <img
                src={propertyImageUrl(galleryImages[0], "/logotype_full_new.png")}
                alt={`${title} — zdjęcie 1`}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
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
                      <img
                        src={propertyImageUrl(image, "/logotype_full_new.png")}
                        alt={`${title} — zdjęcie ${absoluteIndex + 1}`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
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

          {/* Belka przyklejona 5 px od góry. Gdy się przyklei (jedzie z klientem), z lewej wysuwa się
              „Wróć do prezentacji”, a belka zwęża się, żeby zrobić mu miejsce. */}
          <div ref={stickySentinelRef} aria-hidden="true" className="mt-8 h-px" />
          <div className="sticky top-[5px] z-30 mx-auto flex max-w-[1240px] items-stretch">
            <Link
              href={`/oferty/${token}`}
              aria-label="Wróć do prezentacji"
              tabIndex={barStuck ? 0 : -1}
              aria-hidden={!barStuck}
              className={`flex shrink-0 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-2xl border border-[#ded5c8] bg-white/95 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#182334] shadow-[0_12px_34px_rgba(24,35,52,0.12)] backdrop-blur transition-all duration-300 hover:border-[#182334] hover:bg-[#182334] hover:text-white ${
                barStuck
                  ? "mr-3 w-[56px] opacity-100 sm:w-[150px] lg:w-[200px]"
                  : "pointer-events-none mr-0 w-0 border-0 opacity-0"
              }`}
            >
              <FaArrowLeft aria-hidden="true" className="shrink-0" />
              <span className="hidden sm:inline">Wróć do prezentacji</span>
            </Link>
            <section className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-2xl border border-[#d9a7ab] bg-[#fdf6f5]/95 px-5 text-center shadow-[0_12px_34px_rgba(142,36,48,0.18)] backdrop-blur transition-[padding] duration-300 sm:flex-row sm:justify-between sm:gap-4 sm:px-8 sm:text-left ${
              barStuck ? "py-2 sm:py-[10px]" : "py-3 sm:py-4"
            }`}>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8e2430]">Podoba Ci się ta oferta?</p>
                <p className="mt-1 hidden truncate text-[14px] font-bold text-[#26364b] sm:block">
                  {barStuck ? "Daj znać — agent prześle Ci więcej informacji." : "Daj znać jednym kliknięciem — agent prześle Ci więcej informacji."}
                </p>
              </div>
              <div className="w-full sm:w-[300px] sm:shrink-0">
                <InterestButton token={token} offerId={String(offer.external_id)} variant="wide" />
              </div>
            </section>
          </div>

          <div className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="grid gap-7">
              <section className="rounded-2xl border border-[#ded5c8] bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-9">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">Wyposażenie i udogodnienia</p>
                <h2 className={`${HomePlayfairSans.className} mt-2 text-[32px] font-semibold`}>Atuty oferty</h2>
                {features.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span key={feature} className="rounded-full border border-[#ddcfbb] bg-[#f8f4ed] px-4 py-2.5 text-[10px] font-bold text-[#405066]">
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-[13px] text-slate-500">Brak dodatkowych atutów w danych oferty.</p>
                )}
              </section>

              <section className="rounded-2xl border border-[#ded5c8] bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-9">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">O nieruchomości</p>
                <h2 className={`${HomePlayfairSans.className} mt-2 text-[32px] font-semibold`}>Opis oferty</h2>
                <div className="relative mt-6">
                  <div
                    className={`whitespace-pre-line text-[14px] leading-7 text-[#526173] sm:text-[15px] ${
                      descriptionIsLong && !descriptionExpanded ? "max-h-[360px] overflow-hidden" : ""
                    }`}
                  >
                    {description || "Szczegółowy opis tej nieruchomości nie został jeszcze uzupełniony."}
                  </div>
                  {descriptionIsLong && !descriptionExpanded ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-white/0 via-white/85 to-white"
                    />
                  ) : null}
                </div>
                {descriptionIsLong ? (
                  <div className={descriptionExpanded ? "mt-5" : "relative -mt-2 flex justify-center"}>
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded((value) => !value)}
                      aria-expanded={descriptionExpanded}
                      className="inline-flex items-center gap-2.5 rounded-full bg-[#182334] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(24,35,52,0.18)] transition hover:bg-[#b8954c]"
                    >
                      {descriptionExpanded ? "Zwiń opis" : "Czytaj dalej"}
                      <FaChevronRight aria-hidden="true" className={`text-[9px] transition ${descriptionExpanded ? "-rotate-90" : "rotate-90"}`} />
                    </button>
                  </div>
                ) : null}
              </section>

              <section className="overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-sm">
                <div className="px-6 py-7 sm:px-9 sm:pt-9">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">Lokalizacja</p>
                  <h2 className={`${HomePlayfairSans.className} mt-2 text-[32px] font-semibold`}>{locationLine || country}</h2>
                  <p className="mt-3 text-[12px] leading-6 text-slate-500">{[offer.province, country].filter(Boolean).join(" · ")}</p>
                </div>
                <iframe title={`Mapa — ${locationLine || country}`} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=11`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[380px] w-full border-0 lg:h-[420px]" />
              </section>

              <ProjectUnits
                units={projectUnits}
                variant="presentation"
                headingClassName={HomePlayfairSans.className}
              />
            </div>

            {/* Kontakt do agenta — na desktopie jedzie z klientem pod przyklejonym paskiem „Podoba Ci się…”. */}
            <aside className="overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-sm lg:sticky lg:top-[96px]">
              <div className="bg-[#182334] px-6 py-6 text-white sm:px-8">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#d6b66f]">Twój agent Onesta</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d6b66f]">
                    <FaRegUser aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[20px] font-extrabold">{contact.name || "Onesta Group"}</h2>
                    <p className="mt-0.5 text-[11px] text-slate-300">{contact.name ? "Agent prowadzący · Onesta Group" : "Biuro Onesta Group"}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 px-6 py-6 sm:px-8">
                <a href={`tel:${(contact.phone || "+48576652525").replace(/[^+\d]/g, "")}`} className="flex min-h-[50px] items-center gap-3 rounded-xl border border-[#e3d9cb] px-4 text-[14px] font-extrabold text-[#182334] transition hover:border-[#182334]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e7d1] text-[12px] text-[#9b7a36]"><FaPhoneAlt aria-hidden="true" /></span>
                  {formatPhone(contact.phone || "") || "+48 576 652 525"}
                </a>
                <a href={`mailto:${contact.email || "biuro@onesta.com.pl"}`} className="flex min-h-[50px] items-center gap-3 rounded-xl border border-[#e3d9cb] px-4 text-[12px] font-semibold text-[#182334] transition hover:border-[#182334]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e7d1] text-[12px] text-[#9b7a36]"><FaEnvelope aria-hidden="true" /></span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">{contact.email || "biuro@onesta.com.pl"}</span>
                </a>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Zadzwoń lub napisz — odpowiemy na pytania o tę ofertę, koszty zakupu i termin oglądania.
                </p>
              </div>
            </aside>
          </div>
          {/* Formularz kontaktowy — na pełną szerokość treści, zdjęcie oferty w tle. */}
          <section id="zapytanie" className="relative mt-10 overflow-hidden rounded-2xl shadow-[0_20px_55px_rgba(24,35,52,0.18)]">
            <img
              src={propertyImageUrl(galleryImages[1] || galleryImages[0], "/logotype_full_new.png")}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c3512]/90 via-[#bd6322]/80 to-[#e8a052]/55" />
            <div className="relative grid items-center gap-9 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(400px,480px)] lg:gap-16 lg:px-14 lg:py-16">
              <div className="text-white">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ffe2b8]">Porozmawiajmy o tej ofercie</p>
                <h2 className={`${HomePlayfairSans.className} mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[46px] lg:text-[54px]`}>
                  Potrzebujesz więcej informacji?
                </h2>
                <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-white/90">
                  Zostaw kontakt — agent odezwie się najszybciej, jak to możliwe.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Aktualna dostępność i pełny cennik",
                    "Rzuty, specyfikacja i plan płatności",
                    "Rozmowa wideo lub oglądanie na miejscu",
                    "Obsługa po polsku, 0 zł prowizji dla kupującego",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[13px] font-semibold leading-6 text-white">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-[#9c4e1f]">
                        <FaCheck aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/25 bg-black/15 px-5 py-4 backdrop-blur">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#9c4e1f]">
                    <FaRegUser aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold">{contact.name || "Onesta Group"}</p>
                    <a href={`tel:${(contact.phone || "+48576652525").replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-[13px] text-white/90 hover:text-white">
                      <FaPhoneAlt className="text-[10px]" aria-hidden="true" />
                      {formatPhone(contact.phone || "") || "+48 576 652 525"}
                    </a>
                    <a href={`mailto:${contact.email || "biuro@onesta.com.pl"}`} className="flex items-center gap-2 break-all text-[13px] text-white/90 hover:text-white">
                      <FaEnvelope className="text-[10px]" aria-hidden="true" />
                      {contact.email || "biuro@onesta.com.pl"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 text-[#182334] shadow-2xl sm:p-8">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#9b7a36]">Formularz kontaktowy</p>
                <h3 className={`${HomePlayfairSans.className} mt-2 text-[28px] font-semibold`}>Zapytaj o tę ofertę</h3>
                <p className="mb-5 mt-1 text-[11px] uppercase tracking-[0.08em] text-slate-400">ref. {offer.external_id}</p>
                <ContactOnPropertyCard propertyRef={offer.external_id} locale="pl" variant="section" />
              </div>
            </div>
          </section>
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
              <img
                src={propertyImageUrl(galleryImages[lightboxIndex], "/logotype_full_new.png")}
                alt={`${title} — zdjęcie ${lightboxIndex + 1}`}
                className="absolute inset-0 h-full w-full object-contain p-2"
                loading="eager"
                decoding="async"
              />
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
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PresentationOfferProps> = async (
  context,
) => {
  context.res.setHeader(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );

  if (!supabaseServer) return { notFound: true };

  const requestedToken = String(context.params?.token || "").trim();
  const offerId = String(context.params?.offerId || "").trim();
  if (!offerId) return { notFound: true };

  const token = await resolvePublicOfferListToken(requestedToken);
  if (!token) return { notFound: true };

  if (token !== requestedToken) {
    return {
      redirect: {
        destination: `/oferty/${encodeURIComponent(token)}/${encodeURIComponent(offerId)}`,
        permanent: false,
      },
    };
  }

  const { data: presentation, error } = await supabaseServer
    .from("agent_offer_lists")
    .select("offers,contact_name,contact_email,contact_phone,agent_name,agent_email")
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
      // Atuty po polsku — wspólny słownik cech (lib/propertyFeatures.ts), jak na stronach ofert.
      features: normalizeFeatures(offer.features, "pl", offer).map((feature) => feature.label),
      projectUnits: await getProjectUnits(offer),
      contact: {
        name: presentation.contact_name || presentation.agent_name || "",
        email: presentation.contact_email || presentation.agent_email || "",
        phone: presentation.contact_phone || "",
      },
    },
  };
};
