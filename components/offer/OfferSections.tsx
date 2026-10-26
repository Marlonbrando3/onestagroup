import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  LuArchive,
  LuArrowUpDown,
  LuBaby,
  LuBadgeCheck,
  LuBath,
  LuBedDouble,
  LuCar,
  LuCheck,
  LuCookingPot,
  LuCopy,
  LuDumbbell,
  LuEye,
  LuFlag,
  LuFlame,
  LuHandshake,
  LuHouse,
  LuImages,
  LuKeyRound,
  LuLanguages,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuMountain,
  LuPercent,
  LuPhone,
  LuPlane,
  LuRuler,
  LuShieldCheck,
  LuSnowflake,
  LuSofa,
  LuSparkles,
  LuSun,
  LuTreePalm,
  LuTrophy,
  LuWaves,
  LuWifi,
  LuZap,
  LuUmbrella,
} from "react-icons/lu";
import PropertyDetailImage from "@/components/PropertyDetailImage";
import {
  FEATURE_GROUP_LABELS,
  type FeatureGroup,
  type FeatureIcon,
  type PropertyFeature,
} from "@/lib/propertyFeatures";
import styles from "@/styles/offerPage.module.css";

type Locale = "pl" | "en";

const ICONS: Record<FeatureIcon, ReactNode> = {
  pool: <LuWaves />,
  garden: <LuTreePalm />,
  sun: <LuSun />,
  terrace: <LuUmbrella />,
  bbq: <LuFlame />,
  spa: <LuSparkles />,
  gym: <LuDumbbell />,
  sport: <LuTrophy />,
  kids: <LuBaby />,
  shield: <LuShieldCheck />,
  lift: <LuArrowUpDown />,
  snow: <LuSnowflake />,
  fire: <LuFlame />,
  sofa: <LuSofa />,
  kitchen: <LuCookingPot />,
  box: <LuArchive />,
  wifi: <LuWifi />,
  home: <LuHouse />,
  car: <LuCar />,
  waves: <LuWaves />,
  view: <LuEye />,
  mountain: <LuMountain />,
  golf: <LuFlag />,
  pin: <LuMapPin />,
  plane: <LuPlane />,
  bolt: <LuZap />,
  key: <LuKeyRound />,
};

export const PHONE = { label: "+48 576 65 25 25", href: "tel:+48576652525" };
export const WHATSAPP = "https://wa.me/48576652525";

// toLocaleString("pl-PL") nie grupuje liczb 4-cyfrowych („5221”), więc grupujemy sami.
function groupThousands(n: number, locale: Locale) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : "\u00a0");
}

export function formatPrice(value: unknown, locale: Locale) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${groupThousands(n, locale)} €`;
}

export function formatDistance(m: unknown, locale: Locale) {
  const n = Number(m);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < 1000) return `${Math.round(n / 10) * 10} m`;
  const km = (n / 1000).toLocaleString(locale === "en" ? "en-GB" : "pl-PL", {
    maximumFractionDigits: 1,
  });
  return `${km} km`;
}

/* ---------- Galeria ---------- */

export function OfferGallery({
  images,
  title,
  badges,
  locale,
  onOpenGallery,
  onOpenImage,
}: {
  images: unknown[];
  title: string;
  badges: { label: string; gold?: boolean }[];
  locale: Locale;
  onOpenGallery: () => void;
  onOpenImage: (index: number) => void;
}) {
  const list = Array.isArray(images) ? images : [];
  const shown = list.slice(0, 5);
  return (
    <div className={styles.gallery}>
      {shown.map((image, index) => (
        <button
          key={index}
          type="button"
          className={styles.shot}
          onClick={() => onOpenImage(index)}
          aria-label={
            locale === "en" ? `Open photo ${index + 1}` : `Otwórz zdjęcie ${index + 1}`
          }
        >
          <PropertyDetailImage
            image={image}
            alt={index === 0 ? title : `${title} — ${index + 1}`}
            main={index === 0}
          />
        </button>
      ))}
      {badges.length > 0 && (
        <div className={styles.badges}>
          {badges.map((b) => (
            <span key={b.label} className={`${styles.badge} ${b.gold ? styles.badgeGold : ""}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}
      {list.length > 1 && (
        <button type="button" className={styles.allPhotos} onClick={onOpenGallery}>
          <LuImages aria-hidden="true" />
          {locale === "en" ? `All photos (${list.length})` : `Wszystkie zdjęcia (${list.length})`}
        </button>
      )}
    </div>
  );
}

/* ---------- Numer oferty ---------- */

export function CopyRef({ value, locale }: { value: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyRef}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      title={locale === "en" ? "Copy reference" : "Kopiuj numer oferty"}
    >
      {locale === "en" ? "Ref." : "Nr oferty"} {value}
      {copied ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
    </button>
  );
}

/* ---------- Najważniejsze parametry ---------- */

export type Fact = { label: string; value: string; icon: ReactNode };

export function factsFor(p: any, terrace: number | null, typeLabel: string, locale: Locale): Fact[] {
  const en = locale === "en";
  const facts: Fact[] = [{ label: en ? "Type" : "Typ", value: typeLabel, icon: <LuHouse /> }];
  const area = Number(p.surface_built);
  if (area > 0) facts.push({ label: en ? "Built area" : "Powierzchnia", value: `${Math.round(area)} m²`, icon: <LuRuler /> });
  if (p.beds != null && Number(p.beds) > 0)
    facts.push({ label: en ? "Bedrooms" : "Sypialnie", value: String(p.beds), icon: <LuBedDouble /> });
  if (p.baths != null && Number(p.baths) > 0)
    facts.push({ label: en ? "Bathrooms" : "Łazienki", value: String(p.baths), icon: <LuBath /> });
  if (terrace && terrace > 1)
    facts.push({ label: en ? "Terrace" : "Taras", value: `${terrace} m²`, icon: <LuUmbrella /> });
  const sea = formatDistance(p.distance_to_sea_m, locale);
  if (sea) facts.push({ label: en ? "To the beach" : "Do plaży", value: sea, icon: <LuWaves /> });
  if (p.pool) facts.push({ label: en ? "Pool" : "Basen", value: en ? "Yes" : "Tak", icon: <LuSparkles /> });
  facts.push({
    label: en ? "Market" : "Rynek",
    value: p.new_build ? (en ? "New build" : "Pierwotny") : en ? "Resale" : "Wtórny",
    icon: <LuKeyRound />,
  });
  return facts;
}

export function OfferFacts({ facts, locale }: { facts: Fact[]; locale: Locale }) {
  return (
    <section className={styles.card} aria-label={locale === "en" ? "Key facts" : "Najważniejsze parametry"}>
      <dl className={styles.facts}>
        {facts.map((f) => (
          <div className={styles.fact} key={f.label}>
            <span className={styles.factIcon} aria-hidden="true">{f.icon}</span>
            <div>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Cechy ---------- */

const GROUP_ORDER: FeatureGroup[] = ["outdoor", "interior", "parking", "area"];

export function OfferFeatures({ features, locale }: { features: PropertyFeature[]; locale: Locale }) {
  const en = locale === "en";
  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: features.filter((f) => f.group === g),
  })).filter((g) => g.items.length);
  return (
    <section id="cechy" className={styles.card} aria-labelledby="offer-features">
      <div className={styles.cardHead}>
        <h2 id="offer-features">{en ? "Property features" : "Cechy nieruchomości"}</h2>
      </div>
      {groups.length ? (
        <div className={styles.featureGroups}>
          {groups.map(({ group, items }) => (
            <div className={styles.featureGroup} key={group}>
              <h3>{FEATURE_GROUP_LABELS[group][locale]}</h3>
              <ul className={styles.featureList}>
                {items.map((f) => (
                  <li key={f.key}>
                    {ICONS[f.icon]}
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          {en
            ? "Ask us for the full specification of this property — we will send it within a day."
            : "Zapytaj nas o pełną specyfikację tej nieruchomości — prześlemy ją w ciągu dnia."}
        </p>
      )}
    </section>
  );
}

/* ---------- Lokalizacja ---------- */

export function OfferLocation({
  property,
  place,
  locale,
  cityLink,
  regionLink,
}: {
  property: any;
  place: string;
  locale: Locale;
  cityLink?: { name: string; path: string } | null;
  regionLink?: { name: string; path: string } | null;
}) {
  const en = locale === "en";
  const hasCoords =
    property.latitude != null && property.longitude != null &&
    property.latitude !== "" && property.longitude !== "";
  const query = hasCoords ? `${property.latitude},${property.longitude}` : place;
  const sea = formatDistance(property.distance_to_sea_m, locale);
  return (
    <section id="lokalizacja" className={styles.card} aria-labelledby="offer-location">
      <div className={styles.cardHead}>
        <h2 id="offer-location">{en ? "Location" : "Lokalizacja"}</h2>
      </div>
      <div className={styles.locationGrid}>
        <ul className={styles.locationList}>
          <li><LuMapPin aria-hidden="true" /><span>{place}</span></li>
          {sea && (
            <li>
              <LuWaves aria-hidden="true" />
              <span>{en ? `About ${sea} to the beach` : `Ok. ${sea} do plaży`}</span>
            </li>
          )}
          {cityLink && (
            <li>
              <LuHouse aria-hidden="true" />
              <span>
                <Link className={styles.textLink} href={cityLink.path}>
                  {en ? `All properties in ${cityLink.name}` : `Wszystkie oferty w ${cityLink.name}`}
                </Link>
              </span>
            </li>
          )}
          {regionLink && (
            <li>
              <LuSun aria-hidden="true" />
              <span>
                <Link className={styles.textLink} href={regionLink.path}>
                  {en ? `Properties on the ${regionLink.name}` : `Nieruchomości na ${regionLink.name}`}
                </Link>
              </span>
            </li>
          )}
          <li>
            <LuShieldCheck aria-hidden="true" />
            <span>
              {en
                ? "The exact address is shared before the viewing."
                : "Dokładny adres przekazujemy przed oglądaniem."}
            </span>
          </li>
        </ul>
        <div className={styles.map}>
          <iframe
            title={en ? "Map" : "Mapa"}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=12`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Cena i kontakt (kolumna boczna) ---------- */

export function OfferPriceCard({
  price,
  area,
  facts,
  locale,
  onAsk,
}: {
  price: unknown;
  area: unknown;
  facts: Fact[];
  locale: Locale;
  onAsk: () => void;
}) {
  const en = locale === "en";
  const formatted = formatPrice(price, locale);
  const perMeter =
    formatted && Number(area) > 0
      ? `${groupThousands(Math.round(Number(price) / Number(area)), locale)} € / m²`
      : null;
  const mini = facts.filter((f) => /Sypialnie|Łazienki|Powierzchnia|Bedrooms|Bathrooms|Built area/.test(f.label));
  return (
    <div className={styles.priceCard}>
      <p className={styles.priceLabel}>{en ? "Price" : "Cena"}</p>
      <p className={styles.price}>{formatted || (en ? "Price on request" : "Cena na zapytanie")}</p>
      {perMeter && <p className={styles.perMeter}>{perMeter}</p>}
      {mini.length > 0 && (
        <div className={styles.miniFacts}>
          {mini.map((f) => (
            <span key={f.label}>{f.icon}{f.value} {f.label === "Powierzchnia" || f.label === "Built area" ? "" : f.label.toLowerCase()}</span>
          ))}
        </div>
      )}
      <p className={styles.priceNote}>
        <LuPercent aria-hidden="true" />
        <span>
          {en
            ? "0% commission for the buyer — you pay the price shown, we handle the purchase in Polish or English."
            : "0 zł prowizji od kupującego — płacisz cenę z oferty, a my prowadzimy zakup po polsku."}
        </span>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onAsk}>
          <LuMessageCircle aria-hidden="true" />
          {en ? "Ask about this property" : "Zapytaj o tę ofertę"}
        </button>
        <a className={styles.secondary} href={PHONE.href}>
          <LuPhone aria-hidden="true" />
          {PHONE.label}
        </a>
        <a className={`${styles.secondary} ${styles.whatsapp}`} href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          <LuMessageCircle aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

const AGENTS = [
  { name: "Marek Marszałek", role: "CEO, doradca", roleEn: "CEO, advisor", image: "/images/agency/team-marek.webp", phone: "+48 576 65 25 25", phoneHref: "+48576652525", email: "marek.marszalek@onesta.com.pl" },
  { name: "Karolina Bakowicz", role: "Doradca klienta", roleEn: "Client advisor", image: "/images/agency/team-karolina.webp", phone: "+48 505 055 846", phoneHref: "+48505055846", email: "biuro@onesta.com.pl" },
];

export function OfferAgents({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className={styles.agentsCard}>
      <p>{en ? "Your advisors" : "Twoi doradcy"}</p>
      {AGENTS.map((a) => (
        <div className={styles.agent} key={a.name}>
          <div className={styles.agentPhoto}>
            <Image src={a.image} alt={a.name} fill sizes="56px" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
          </div>
          <div>
            <p className={styles.agentName}>{a.name}</p>
            <div className={styles.agentLinks}>
              <a href={`tel:${a.phoneHref}`}><LuPhone aria-hidden="true" />{a.phone}</a>
              <a href={`mailto:${a.email}`}><LuMail aria-hidden="true" />{en ? "Email" : "E-mail"}</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Dlaczego z Onestą ---------- */

export function OfferTrust({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const items = en
    ? [
        { icon: <LuPercent />, title: "0% buyer commission", text: "Our fee is covered by the seller or developer. You pay the price shown in the listing." },
        { icon: <LuLanguages />, title: "Everything explained clearly", text: "Calls, contracts and paperwork in Polish or English, with lawyers and translators in Spain." },
        { icon: <LuHandshake />, title: "From reservation to keys", text: "NIE number, bank account, notary and handover — we guide you through the whole purchase." },
      ]
    : [
        { icon: <LuPercent />, title: "0 zł prowizji od kupującego", text: "Nasze wynagrodzenie pokrywa sprzedający lub deweloper. Płacisz cenę z ogłoszenia." },
        { icon: <LuLanguages />, title: "Wszystko po polsku", text: "Rozmowy, umowy i formalności w Twoim języku — z prawnikami i tłumaczami na miejscu." },
        { icon: <LuHandshake />, title: "Od rezerwacji do kluczy", text: "Numer NIE, konto w banku, notariusz i odbiór — przeprowadzimy Cię przez cały zakup." },
      ];
  return (
    <section className={styles.trust} aria-labelledby="offer-trust">
      <div className={styles.trustInner}>
        <div>
          <p className={styles.eyebrow}>{en ? "Buying with Onesta" : "Kupujesz z Onestą"}</p>
          <h2 id="offer-trust">{en ? "Safely, with no extra fees" : "Bezpiecznie i bez dopłat"}</h2>
        </div>
        <ul className={styles.trustList}>
          {items.map((i) => (
            <li key={i.title}>
              <span className={styles.trustIcon} aria-hidden="true">{i.icon}</span>
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Zapytanie ---------- */

export function OfferInquiry({ locale, children }: { locale: Locale; children: ReactNode }) {
  const en = locale === "en";
  const points = en
    ? ["Current availability and the price list", "Floor plans and full specification", "A video call or an on-site viewing"]
    : ["Aktualna dostępność i cennik", "Rzuty i pełna specyfikacja", "Rozmowa wideo lub oglądanie na miejscu"];
  return (
    <section id="zapytanie" className={styles.card} aria-labelledby="offer-inquiry">
      <div className={styles.inquiry}>
        <div>
          <p className={styles.eyebrow}>{en ? "Interested?" : "Zainteresowany?"}</p>
          <h2 id="offer-inquiry" style={{ marginTop: 10 }}>
            {en ? "Ask about this property" : "Zapytaj o tę ofertę"}
          </h2>
          <p className={styles.lead}>
            {en
              ? "Leave your details — we will reply the same or next business day."
              : "Zostaw kontakt — odezwiemy się tego samego lub następnego dnia roboczego."}
          </p>
          <ul className={styles.inquiryPoints}>
            {points.map((p) => (
              <li key={p}><LuBadgeCheck aria-hidden="true" />{p}</li>
            ))}
          </ul>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/* ---------- Pasek na telefonie ---------- */

export function OfferMobileBar({ price, locale, onAsk }: { price: unknown; locale: Locale; onAsk: () => void }) {
  const en = locale === "en";
  return (
    <div className={styles.mobileBar}>
      <div>
        <strong>{formatPrice(price, locale) || (en ? "Price on request" : "Cena na zapytanie")}</strong>
        <span>{en ? "0% buyer commission" : "0 zł prowizji od kupującego"}</span>
      </div>
      <button type="button" className={styles.primary} onClick={onAsk}>
        {en ? "Ask" : "Zapytaj"}
      </button>
    </div>
  );
}

