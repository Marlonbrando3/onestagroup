import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { buildCatalogUrl, catalogRoutePath } from "@/lib/catalogRouting";
import type { SiteLocale } from "@/lib/i18n";
import {
  MENU_COUNTRY_COASTS,
  menuLocationById,
  navigationCountries,
  navigationLocationHref,
  navigationPropertyTypes,
  navigationRegionLabel,
  staticMenuTowns,
  type MenuScope,
  type MenuTown,
} from "@/lib/propertyNavigation";
import styles from "./PropertiesNavigation.module.css";

type Country = "hiszpania" | "cypr";
const PHONE = "+48576652525";
const PHONE_LABEL = "+48 576 65 25 25";

// ---------- live offer counts (one request per page view, CDN-cached for 1h) ----------
type LiveData = { towns: Record<string, MenuTown[]>; coastTotals: Record<string, number>; countryTotals: Record<string, number> };
let liveRequest: Promise<LiveData | null> | null = null;
function loadLive() {
  if (!liveRequest)
    liveRequest = fetch("/api/menu-locations")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => (data?.towns ? (data as LiveData) : null))
      .catch(() => null);
  return liveRequest;
}

/** Server HTML uses the curated town list; the browser swaps in live ranking and counts. */
function useMenuData() {
  const [live, setLive] = useState<LiveData | null>(null);
  useEffect(() => {
    let active = true;
    const run = () => loadLive().then((data) => { if (active && data) setLive(data); });
    const w = window as any;
    const handle = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500);
    return () => {
      active = false;
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);
  return {
    towns: (coastId: string): MenuTown[] => (live ? live.towns[coastId] || [] : staticMenuTowns(coastId)),
    coastTotal: (coastId: string): number | null => live?.coastTotals[coastId] ?? null,
    countryTotal: (country: Country): number | null => live?.countryTotals[country] ?? null,
  };
}

// ---------- helpers ----------
const countryEntry = (country: Country) => navigationCountries.find((item) => item.slug === country);
const regionOf = (country: Country, id: string) => countryEntry(country)?.regions.find((item) => item.id === id);
const coastName = (country: Country, id: string, locale: SiteLocale) => navigationRegionLabel(regionOf(country, id)?.name || id, locale);
const coastHref = (country: Country, id: string, locale: SiteLocale) => {
  const coast = menuLocationById(id);
  return coast ? navigationLocationHref(country, coast, locale) : catalogRoutePath({ country }, locale);
};
const townHref = (country: Country, id: string, locale: SiteLocale) => {
  const town = menuLocationById(id);
  return town ? navigationLocationHref(country, town, locale) : buildCatalogUrl(country, { location: id }, locale)!;
};
const formatCount = (count: number, locale: SiteLocale) => count.toLocaleString(locale === "en" ? "en-GB" : "pl-PL");
const countryLabel = (country: Country, locale: SiteLocale) =>
  locale === "en" ? (country === "hiszpania" ? "Spain" : "Cyprus") : country === "hiszpania" ? "Hiszpania" : "Cypr";
const locationsLabel = (country: Country, locale: SiteLocale) =>
  locale === "en" ? `Locations in ${countryLabel(country, locale)}` : country === "hiszpania" ? "Lokalizacje w Hiszpanii" : "Lokalizacje na Cyprze";

function CountedLink({ href, label, count, locale, onNavigate }: { href: string; label: ReactNode; count: number | null; locale: SiteLocale; onNavigate: () => void }) {
  return (
    <Link prefetch={false} href={href} onClick={onNavigate}>
      <span>{label}</span>
      {count !== null && <span className={styles.count}>{formatCount(count, locale)}</span>}
    </Link>
  );
}

function TownList({ country, towns, locale, onNavigate, className }: { country: Country; towns: MenuTown[]; locale: SiteLocale; onNavigate: () => void; className?: string }) {
  return (
    <ul className={className}>
      {towns.map((town) => (
        <li key={town.id}><CountedLink href={townHref(country, town.id, locale)} label={town.name} count={town.count} locale={locale} onNavigate={onNavigate} /></li>
      ))}
    </ul>
  );
}

function marketLinks(country: Country, locale: SiteLocale) {
  const en = locale === "en";
  return [
    {
      href: buildCatalogUrl(country, { market: "false" }, locale)!,
      title: en ? "Resale properties" : "Rynek wtórny",
      text: en ? "Ready-to-move-in apartments, houses and villas" : "Gotowe do zamieszkania apartamenty, domy i wille",
    },
    {
      href: buildCatalogUrl(country, { market: "true" }, locale)!,
      title: en ? "New developments" : "Nowe inwestycje",
      text: en ? "New builds straight from developers" : "Inwestycje deweloperskie prosto od deweloperów",
    },
  ];
}

function otherDestinations(scope: Country, locale: SiteLocale) {
  const links: { href: string; label: string }[] = [];
  const other: Country = scope === "hiszpania" ? "cypr" : "hiszpania";
  if (countryEntry(other)) links.push({ href: catalogRoutePath({ country: other }, locale), label: countryLabel(other, locale) });
  const mallorca = regionOf("hiszpania", "mallorca");
  if (scope === "hiszpania" && mallorca) links.push({ href: navigationLocationHref("hiszpania", mallorca, locale), label: navigationRegionLabel(mallorca.name, locale) });
  return links;
}

const countryDescription = (country: Country, locale: SiteLocale) =>
  country === "hiszpania"
    ? locale === "en" ? "Costa Blanca, Costa del Sol, Costa Cálida, Costa de Almería" : "Costa Blanca, Costa del Sol, Costa Cálida, Costa de Almería"
    : locale === "en" ? "Paphos and the south of the island" : "Pafos i południe wyspy";

// ---------- desktop panel bodies ----------
function CountryBody({ country, locale, data, close }: { country: Country; locale: SiteLocale; data: ReturnType<typeof useMenuData>; close: () => void }) {
  const isEn = locale === "en";
  const coasts = MENU_COUNTRY_COASTS[country];
  return (
    <>
      <div className={styles.markets}>
        <p className={styles.label}>{isEn ? "Markets" : "Rynki"}</p>
        <ul className={styles.marketList}>
          {marketLinks(country, locale).map((market, index) => (
            <li key={market.href}>
              <Link prefetch={false} href={market.href} onClick={close} className={styles.market}>
                <span className={styles.marketNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span><span className={styles.marketTitle}>{market.title}</span><span className={styles.marketText}>{market.text}</span></span>
                <FiArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.label}>{isEn ? "Property types" : "Typy nieruchomości"}</p>
        <ul className={styles.chips}>
          {navigationPropertyTypes.map((type) => (
            <li key={type.slug}><Link prefetch={false} href={catalogRoutePath({ country, propertyType: type.slug }, locale)} onClick={close}>{type.label[locale]}</Link></li>
          ))}
        </ul>
        <p className={styles.label}>{isEn ? "Other destinations" : "Inne kierunki"}</p>
        <ul className={styles.inlineLinks}>
          {otherDestinations(country, locale).map((link) => (
            <li key={link.href}><Link prefetch={false} href={link.href} onClick={close}>{link.label}<FiArrowUpRight aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </div>
      <div className={styles.locations}>
        <p className={styles.label}>{locationsLabel(country, locale)}</p>
        <div className={coasts.length > 1 ? styles.coasts : styles.coastsSingle}>
          {coasts.map((coastId) => (
            <div key={coastId}>
              <Link prefetch={false} href={coastHref(country, coastId, locale)} onClick={close} className={styles.coastHeading}>
                {coastName(country, coastId, locale)}<FiArrowUpRight aria-hidden="true" />
              </Link>
              <TownList country={country} towns={data.towns(coastId)} locale={locale} onNavigate={close} className={styles.towns} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AllCountriesBody({ locale, data, close }: { locale: SiteLocale; data: ReturnType<typeof useMenuData>; close: () => void }) {
  const isEn = locale === "en";
  const countries: Country[] = ["hiszpania", "cypr"];
  const mallorca = regionOf("hiszpania", "mallorca");
  return (
    <>
      <div className={styles.markets}>
        <p className={styles.label}>{isEn ? "Countries" : "Kraje"}</p>
        <ul className={styles.marketList}>
          {countries.map((country, index) => {
            const total = data.countryTotal(country);
            return (
              <li key={country}>
                <Link prefetch={false} href={catalogRoutePath({ country }, locale)} onClick={close} className={styles.market}>
                  <span className={styles.marketNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className={styles.marketTitle}>{countryLabel(country, locale)}</span>
                    <span className={styles.marketText}>
                      {countryDescription(country, locale)}
                      {total !== null && ` · ${formatCount(total, locale)} ${isEn ? "offers" : "ofert"}`}
                    </span>
                  </span>
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.locations}>
        <p className={styles.label}>{isEn ? "Locations" : "Lokalizacje"}</p>
        <div className={styles.coasts}>
          <div>
            <Link prefetch={false} href={catalogRoutePath({ country: "hiszpania" }, locale)} onClick={close} className={styles.coastHeading}>
              {countryLabel("hiszpania", locale)}<FiArrowUpRight aria-hidden="true" />
            </Link>
            <ul className={styles.towns}>
              {MENU_COUNTRY_COASTS.hiszpania.map((coastId) => (
                <li key={coastId}>
                  <CountedLink href={coastHref("hiszpania", coastId, locale)} label={coastName("hiszpania", coastId, locale)} count={data.coastTotal(coastId)} locale={locale} onNavigate={close} />
                </li>
              ))}
              {mallorca && (
                <li><CountedLink href={navigationLocationHref("hiszpania", mallorca, locale)} label={navigationRegionLabel(mallorca.name, locale)} count={null} locale={locale} onNavigate={close} /></li>
              )}
            </ul>
          </div>
          {MENU_COUNTRY_COASTS.cypr.map((coastId) => (
            <div key={coastId}>
              <Link prefetch={false} href={catalogRoutePath({ country: "cypr" }, locale)} onClick={close} className={styles.coastHeading}>
                {countryLabel("cypr", locale)}<FiArrowUpRight aria-hidden="true" />
              </Link>
              <TownList country="cypr" towns={data.towns(coastId)} locale={locale} onNavigate={close} className={styles.towns} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ConsultationAside({ scope, locale, close, onConsultation }: { scope: MenuScope; locale: SiteLocale; close: () => void; onConsultation?: () => void }) {
  const isEn = locale === "en";
  const where =
    scope === "hiszpania" ? (isEn ? "in Spain" : "w Hiszpanii") : scope === "cypr" ? (isEn ? "in Cyprus" : "na Cyprze") : isEn ? "abroad" : "za granicą";
  const allHref = catalogRoutePath({ country: scope === "cypr" ? "cypr" : "hiszpania" }, locale);
  return (
    <aside className={styles.cta}>
      <p className={styles.ctaLabel}>{isEn ? "Free consultation" : "Bezpłatna konsultacja"}</p>
      <p className={styles.ctaTitle}>{isEn ? "Not sure where to start?" : "Nie wiesz, od czego zacząć?"}</p>
      <p className={styles.ctaText}>
        {isEn
          ? `Tell us what you are looking for — we will shortlist offers and answer your questions about buying ${where}.`
          : `Opowiedz nam, czego szukasz — dobierzemy oferty i odpowiemy na pytania o zakup ${where}. 0% prowizji dla kupującego.`}
      </p>
      <div className={styles.ctaContacts}>
        <a href={`tel:${PHONE}`}><FiPhone aria-hidden="true" />{PHONE_LABEL}</a>
        <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" />WhatsApp</a>
      </div>
      {onConsultation && (
        <button type="button" className={styles.ctaButton} onClick={() => { close(); onConsultation(); }}>
          {isEn ? "Book a free consultation" : "Umów bezpłatną konsultację"}
        </button>
      )}
      <Link prefetch={false} href={allHref} onClick={close} className={styles.ctaAll}>
        {scope === "all" ? (isEn ? "All properties in Spain" : "Wszystkie oferty w Hiszpanii") : isEn ? "All properties" : "Wszystkie nieruchomości"}
        <FiArrowRight aria-hidden="true" />
      </Link>
    </aside>
  );
}

// ---------- desktop ----------
export function PropertiesNavigation({ locale, scope = "all", onConsultation }: { locale: SiteLocale; scope?: MenuScope; onConsultation?: () => void }) {
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const data = useMenuData();
  const close = () => setOpen(false);
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth < 1280) setOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.root}
      onPointerEnter={(event) => { cancelClose(); if (event.pointerType === "mouse") setOpen(true); }}
      // Generous delay: moving the cursor diagonally across the header must not close the panel.
      onPointerLeave={() => { cancelClose(); closeTimer.current = setTimeout(() => { if (!root.current?.contains(document.activeElement)) setOpen(false); }, 350); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={id}
        onClick={() => { cancelClose(); setOpen((value) => !value); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); requestAnimationFrame(() => document.getElementById(id)?.querySelector<HTMLAnchorElement>("a")?.focus()); }
        }}>
        {isEn ? "Offers" : "Oferty"}<FiChevronDown aria-hidden="true" />
      </button>
      <div id={id} className={styles.panel} hidden={!open}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {scope === "all"
              ? <AllCountriesBody locale={locale} data={data} close={close} />
              : <CountryBody country={scope} locale={locale} data={data} close={close} />}
            <ConsultationAside scope={scope} locale={locale} close={close} onConsultation={onConsultation} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- mobile ----------
function MobileCountry({ country, locale, data, onNavigate, withMarkets }: { country: Country; locale: SiteLocale; data: ReturnType<typeof useMenuData>; onNavigate: () => void; withMarkets: boolean }) {
  const isEn = locale === "en";
  return (
    <>
      <Link prefetch={false} className={styles.mobileAll} href={catalogRoutePath({ country }, locale)} onClick={onNavigate}>
        {isEn ? `All properties in ${countryLabel(country, locale)}` : `Wszystkie oferty – ${countryLabel(country, locale)}`}<FiArrowUpRight aria-hidden="true" />
      </Link>
      {MENU_COUNTRY_COASTS[country].map((coastId) => (
        <details key={coastId}>
          <summary>{coastName(country, coastId, locale)}<FiChevronDown aria-hidden="true" /></summary>
          <div className={styles.mobileGroup}>
            <Link prefetch={false} className={styles.mobileAll} href={coastHref(country, coastId, locale)} onClick={onNavigate}>
              {isEn ? "All in this region" : "Wszystkie w regionie"}<FiArrowUpRight aria-hidden="true" />
            </Link>
            <TownList country={country} towns={data.towns(coastId)} locale={locale} onNavigate={onNavigate} className={styles.mobileTowns} />
          </div>
        </details>
      ))}
      {withMarkets && (
        <details>
          <summary>{isEn ? "Market and property type" : "Rynek i typ nieruchomości"}<FiChevronDown aria-hidden="true" /></summary>
          <div className={styles.mobileGroup}>
            {marketLinks(country, locale).map((market) => (
              <Link key={market.href} prefetch={false} href={market.href} onClick={onNavigate}>{market.title}<FiArrowUpRight aria-hidden="true" /></Link>
            ))}
            <ul className={styles.chips}>
              {navigationPropertyTypes.map((type) => (
                <li key={type.slug}><Link prefetch={false} href={catalogRoutePath({ country, propertyType: type.slug }, locale)} onClick={onNavigate}>{type.label[locale]}</Link></li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </>
  );
}

export function MobilePropertiesNavigation({ locale, scope = "all", onNavigate }: { locale: SiteLocale; scope?: MenuScope; onNavigate: () => void }) {
  const isEn = locale === "en";
  const data = useMenuData();
  const countries: Country[] = scope === "all" ? ["hiszpania", "cypr"] : [scope];
  return (
    <div className={styles.mobile}>
      <p className={styles.mobileLabel}>{isEn ? "Offers" : "Oferty"}</p>
      {countries.map((country) =>
        scope === "all" ? (
          <details key={country}>
            <summary>{countryLabel(country, locale)}<FiChevronDown aria-hidden="true" /></summary>
            <div className={styles.mobileGroup}><MobileCountry country={country} locale={locale} data={data} onNavigate={onNavigate} withMarkets={false} /></div>
          </details>
        ) : (
          <MobileCountry key={country} country={country} locale={locale} data={data} onNavigate={onNavigate} withMarkets />
        ),
      )}
      {scope !== "all" && otherDestinations(scope, locale).map((link) => (
        <Link key={link.href} prefetch={false} className={styles.mobileRow} href={link.href} onClick={onNavigate}>{link.label}<FiArrowUpRight aria-hidden="true" /></Link>
      ))}
    </div>
  );
}
