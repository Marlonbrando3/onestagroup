import Head from "next/head";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { FaCheck, FaEnvelope, FaPhoneAlt, FaRegUser } from "react-icons/fa";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/SearchEngine/PropertyCard";
import InterestButton from "@/components/presentation/InterestButton";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { imageUrls } from "@/lib/presentationOffer";
import { presentationPreviewTexts } from "@/lib/presentationPreview";
import { propertyImageUrl } from "@/lib/propertyImages";
import { formatPhone } from "@/lib/phone";
import type { AgentOffer } from "@/lib/agentOffers";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";
import { useCookieYesAdvertisement, usePresentationTracking } from "@/lib/presentationTracking";
import { resolveLeadKey } from "@/lib/leadManager/tracking";
import { hasTrackingConsent } from "@/lib/consents";
import TrackingConsentBar from "@/components/presentation/TrackingConsentBar";
import { useState } from "react";

type PublicOfferListProps = {
  token: string;
  offers: AgentOffer[];
  createdAt: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  clientSalutation: "pani" | "pan" | "panstwo" | null;
  clientName: string;
  coverImages: string[];
  // Wzorzec (pula czatu): własny tytuł, bez imienia klienta; śledzenie i „Interesuje mnie” tylko z linkiem leada (?k=…)
  isTemplate: boolean;
  publicTitle: string;
  publicSubtitle: string;
  leadKey: string;
  // Czy wiemy, czyja to prezentacja (klient w CRM / link leada) i czy jest zgoda na zapisywanie oglądanych ofert
  identifiable: boolean;
  trackingConsent: boolean;
  // Podgląd linku (WhatsApp, Messenger, SMS): opis i wygenerowany obrazek z kolażem ofert
  previewDescription: string;
  previewImageUrl: string;
  pageUrl: string;
};

// Teksty nagłówka zależnie od zwrotu wybranego przez agenta. Imię klienta agent wpisuje
// już w dopełniaczu („Janowskich”, „Jana Kowalskiego”) → „Prezentacja przygotowana dla Państwa Janowskich”.
const GREETING = {
  pani: { title: "Pani", withYou: "z Panią", yours: "Pani", label: "Pani" },
  pan: { title: "Pana", withYou: "z Panem", yours: "Pana", label: "Pan" },
  panstwo: { title: "Państwa", withYou: "z Państwem", yours: "Państwa", label: "Państwo" },
} as const;

export default function PublicOfferList({
  token,
  offers,
  createdAt,
  contactName,
  contactEmail,
  contactPhone,
  clientSalutation,
  clientName,
  coverImages,
  isTemplate,
  publicTitle,
  publicSubtitle,
  leadKey,
  identifiable,
  trackingConsent,
  previewDescription,
  previewImageUrl,
  pageUrl,
}: PublicOfferListProps) {
  const [consent, setConsent] = useState(trackingConsent);
  const cookieAdvertisement = useCookieYesAdvertisement();
  usePresentationTracking(token, "open", undefined, undefined, { isTemplate, leadKey, allowed: consent || cookieAdvertisement });
  const canInterest = !isTemplate || Boolean(leadKey);
  const keyQuery = leadKey ? `?k=${encodeURIComponent(leadKey)}` : "";
  const greeting = clientSalutation ? GREETING[clientSalutation] : null;
  const claim = isTemplate
    ? "Na podstawie Twoich odpowiedzi wybraliśmy oferty, które — wierzymy — mogą spełnić Twoje oczekiwania."
    : greeting
      ? `Po rozmowie ${greeting.withYou} wyselekcjonowaliśmy oferty, które — wierzymy — spełnią ${greeting.yours} oczekiwania.`
      : "Po naszej rozmowie wyselekcjonowaliśmy oferty, które — wierzymy — spełnią Twoje oczekiwania.";
  const headingText = isTemplate
    ? publicTitle || "Oferty wybrane dla Ciebie"
    : clientName
      ? `${greeting ? `${greeting.title} ` : ""}${clientName}`
      : greeting
        ? `Oferty wybrane dla ${greeting.title}`
        : "Oferty wybrane dla Ciebie";
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  const pageTitle = `${isTemplate ? [headingText, publicSubtitle].filter(Boolean).join(" · ") : clientName ? `Prezentacja dla ${greeting ? `${greeting.title} ` : ""}${clientName}` : greeting ? `Oferty wybrane dla ${greeting.title}` : "Oferty wybrane dla Ciebie"} | Onesta Group`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={previewDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Onesta Group" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={previewDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={previewImageUrl} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pageTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className={`${HomeMontserratSans.className} min-h-screen bg-[#f5f1ea] pb-20 pt-6 text-[#182334] md:pt-8`}>
        {/* Logo i data */}
        <div className="mx-auto flex w-11/12 max-w-7xl items-center justify-between gap-4">
          <div className="relative h-[46px] w-[150px]">
            <Image src="/logotype_full_new.svg" alt="Onesta Group" fill sizes="150px" className="object-contain object-left" priority />
          </div>
          <p className="text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9b7a36]">
            Prezentacja ofert<span className="block text-[10px] font-semibold normal-case tracking-normal text-slate-500">{formattedDate}</span>
          </p>
        </div>

        {/* Nagłówek prezentacji */}
        <section className="mx-auto mt-6 grid w-11/12 max-w-7xl overflow-hidden rounded-[24px] bg-[#182334] text-white shadow-[0_20px_60px_rgba(24,35,52,0.16)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="relative px-6 py-10 sm:px-10 md:py-14 lg:px-14">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#d6b66f]/10 blur-2xl" />
            <p className="relative text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d6b66f]">
              {isTemplate ? "Wstępnie wybrane oferty" : clientName ? "Prezentacja przygotowana dla" : "Indywidualna prezentacja ofert"}
            </p>
            <h1 className={`${HomePlayfairSans.className} relative mt-4 text-[36px] font-semibold leading-[1.06] tracking-[-0.02em] md:text-[52px]`}>
              {headingText}
            </h1>
            {isTemplate && publicSubtitle ? (
              <p className={`${HomePlayfairSans.className} relative mt-3 text-[18px] font-semibold leading-tight text-[#d6b66f] md:text-[26px]`}>
                {publicSubtitle}
              </p>
            ) : null}
            <div className="relative mt-6 h-[3px] w-16 rounded-full bg-[#d6b66f]" aria-hidden="true" />
            <p className="relative mt-6 max-w-[620px] text-[16px] leading-8 text-slate-200 md:text-[18px]">{claim}</p>
            <ul className="relative mt-7 grid gap-2.5 text-[13px] text-slate-300">
              {[
                "Każdą ofertę otworzysz, by zobaczyć zdjęcia, opis i lokalizację.",
                canInterest
                  ? "Przycisk „Interesuje mnie ta oferta” — jedno kliknięcie i agent prześle więcej informacji."
                  : "Zadzwoń lub napisz do nas — przekażemy więcej informacji o każdej ofercie.",
                "0 zł prowizji dla kupującego i obsługa po polsku od pierwszej rozmowy do odbioru kluczy.",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6b66f] text-[8px] text-[#182334]">
                    <FaCheck aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-3">
                <strong className="text-[24px] text-[#d6b66f]">{offers.length}</strong>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300">
                  {offers.length === 1 ? "oferta" : offers.length % 10 >= 2 && offers.length % 10 <= 4 && (offers.length % 100 < 10 || offers.length % 100 >= 20) ? "oferty" : "ofert"}
                </span>
              </div>
              {contactName ? (
                <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-[12px] text-slate-300">
                  Przygotował(a)
                  <strong className="block text-[14px] text-white">{contactName}</strong>
                </div>
              ) : null}
            </div>
          </div>

          {/* Zdjęcia z wybranych ofert */}
          <div className="relative hidden min-h-[420px] lg:block">
            {coverImages.length ? (
              <div className={`absolute inset-0 grid gap-1 ${coverImages.length > 1 ? "grid-rows-2" : ""} ${coverImages.length > 2 ? "grid-cols-2" : ""}`}>
                {coverImages.slice(0, 3).map((image, index) => (
                  <div key={image} className={`relative overflow-hidden ${coverImages.length > 2 && index === 0 ? "col-span-2" : ""}`}>
                    <img
                      src={propertyImageUrl(image, "/logotype_full_new.png")}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a3a52] to-[#182334]" />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#182334] via-[#182334]/10 to-transparent" />
          </div>
        </section>

        {contactName || contactEmail || contactPhone ? (
          <section className="mx-auto mt-5 flex w-11/12 max-w-7xl flex-col justify-between gap-5 rounded-2xl border border-[#ddd3c4] bg-white px-6 py-5 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e6d3] text-[#9b7a36]">
                <FaRegUser aria-hidden="true" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#9b7a36]">
                  Twój agent Onesta
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold text-[#182334]">
                  {contactName || "Onesta Group"}
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="flex min-h-[43px] items-center justify-center gap-2 rounded-full border border-[#d8cbb9] px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#334155] transition hover:border-[#182334]">
                  <FaEnvelope aria-hidden="true" /> {contactEmail}
                </a>
              ) : null}
              {contactPhone ? (
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="flex min-h-[43px] items-center justify-center gap-2 rounded-full bg-[#d6b66f] px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#182334] transition hover:bg-[#182334] hover:text-white">
                  <FaPhoneAlt aria-hidden="true" /> {formatPhone(contactPhone)}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-8 grid w-11/12 max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer, index) => (
            <div key={offer.external_id} className="flex flex-col gap-4">
              <PropertyCard
                property={{ ...offer, vacantFromDate: offer.available_from }}
                detailHrefOverride={`/oferty/${token}/${encodeURIComponent(String(offer.external_id))}${keyQuery}`}
                appearance="cbtop"
                imagePriority={index === 0}
              />
              {canInterest ? (
                <div className="mt-auto">
                  <InterestButton token={token} offerId={String(offer.external_id)} leadKey={leadKey} />
                </div>
              ) : null}
            </div>
          ))}
        </section>

        {identifiable && !cookieAdvertisement ? (
          <TrackingConsentBar token={token} leadKey={leadKey} consent={consent} onChange={setConsent} />
        ) : null}

        <p className="mx-auto mt-10 w-11/12 max-w-7xl text-center text-[11px] leading-5 text-slate-500">
          Dostępność i ceny ofert mogą ulec zmianie. Skontaktuj się z agentem
          Onesta, aby potwierdzić aktualne warunki.
        </p>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PublicOfferListProps> = async (
  context,
) => {
  context.res.setHeader(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );

  if (!supabaseServer) return { notFound: true };

  const requestedToken = String(context.params?.token || "").trim();
  const token = await resolvePublicOfferListToken(requestedToken);
  if (!token) return { notFound: true };

  const requestedKey = typeof context.query.k === "string" ? context.query.k : "";
  if (token !== requestedToken) {
    return {
      redirect: {
        destination: `/oferty/${encodeURIComponent(token)}${requestedKey ? `?k=${encodeURIComponent(requestedKey)}` : ""}`,
        permanent: false,
      },
    };
  }

  const { data, error } = await supabaseServer
    .from("agent_offer_lists")
    .select(
      "offers,created_at,agent_name,agent_email,contact_name,contact_email,contact_phone,client_salutation,client_name,is_template,public_title,public_subtitle,crm_contact_id",
    )
    .eq("public_token", token)
    .maybeSingle();

  if (error || !data || !Array.isArray(data.offers)) {
    return { notFound: true };
  }

  const isTemplate = Boolean((data as any).is_template);
  const lead = isTemplate && requestedKey ? await resolveLeadKey(requestedKey) : null;
  const leadKey = lead ? requestedKey : "";
  const contactId = isTemplate ? lead?.contactId || null : (data as any).crm_contact_id || null;
  const host = String(context.req.headers["x-forwarded-host"] || context.req.headers.host || "onesta.com.pl");
  const proto = String(context.req.headers["x-forwarded-proto"] || (host.startsWith("localhost") ? "http" : "https")).split(",")[0];
  const origin = `${proto}://${host}`;
  const preview = presentationPreviewTexts({
    offers: data.offers as AgentOffer[],
    isTemplate,
    publicTitle: (data as any).public_title,
    clientSalutation: data.client_salutation,
    clientName: data.client_name,
  });

  return {
    props: {
      token,
      isTemplate,
      publicTitle: String((data as any).public_title || "").trim(),
      publicSubtitle: String((data as any).public_subtitle || "").trim(),
      leadKey,
      identifiable: Boolean(contactId),
      trackingConsent: await hasTrackingConsent(contactId),
      previewDescription: preview.description,
      // ?n= zmienia adres, gdy zmieni się liczba ofert – WhatsApp pobierze wtedy nowy obrazek.
      previewImageUrl: `${origin}/api/og/prezentacja/${encodeURIComponent(token)}.jpg?n=${(data.offers as AgentOffer[]).length}`,
      pageUrl: `${origin}/oferty/${encodeURIComponent(token)}`,
      offers: data.offers as AgentOffer[],
      createdAt: data.created_at,
      contactName: data.contact_name || data.agent_name || "",
      contactEmail: data.contact_email || data.agent_email || "",
      contactPhone: data.contact_phone || "",
      clientSalutation: ["pani", "pan", "panstwo"].includes(String(data.client_salutation))
        ? (data.client_salutation as "pani" | "pan" | "panstwo")
        : null,
      clientName: String(data.client_name || "").trim(),
      // Pierwsze zdjęcia z trzech pierwszych ofert — do kolażu w nagłówku.
      coverImages: (data.offers as AgentOffer[])
        .map((offer) => imageUrls(offer.images)[0])
        .filter(Boolean)
        .slice(0, 3),
    },
  };
};
