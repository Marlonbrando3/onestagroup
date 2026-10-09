import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { buildCatalogUrl, catalogRoutePath } from "@/lib/catalogRouting";
import type { SiteLocale } from "@/lib/i18n";
import {
  MENU_COASTS,
  menuLocationById,
  navigationCountries,
  navigationLocationHref,
  navigationPropertyTypes,
  navigationRegionLabel,
  staticMenuTowns,
  type MenuTown,
} from "@/lib/propertyNavigation";
import styles from "./PropertiesNavigation.module.css";

const SPAIN = "hiszpania";
const PHONE = "+48576652525";
const PHONE_LABEL = "+48 576 65 25 25";

// ---------- live offer counts (one request per page view, CDN-cached for 1h) ----------
let liveTownsRequest: Promise<Record<string, MenuTown[]> | null> | null = null;
function loadLiveTowns() {
  if (!liveTownsRequest)
    liveTownsRequest = fetch("/api/menu-locations")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.coasts ?? null)
      .catch(() => null);
  return liveTownsRequest;
}

/** Server HTML uses the curated list; the browser swaps in towns ranked by live counts. */
function useMenuTowns() {
  const [live, setLive] = useState<Record<string, MenuTown[]> | null>(null);
  useEffect(() => {
    let active = true;
    const run = () => loadLiveTowns().then((coasts) => { if (active && coasts) setLive(coasts); });
    const w = window as any;
    const handle = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500);
    return () => {
      active = false;
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);
  return (coastId: string): MenuTown[] => (live ? live[coastId] || [] : staticMenuTowns(coastId));
}

const spain = navigationCountries.find((country) => country.slug === SPAIN)!;
const cyprus = navigationCountries.find((country) => country.slug === "cypr");
const coastName = (id: string, locale: SiteLocale) => {
  const region = spain.regions.find((item) => item.id === id);
  return navigationRegionLabel(region?.name || id, locale);
};
const coastHref = (id: string, locale: SiteLocale) => {
  const coast = menuLocationById(id);
  return coast ? navigationLocationHref(SPAIN, coast, locale) : catalogRoutePath({ country: SPAIN }, locale);
};
const townHref = (id: string, locale: SiteLocale) => {
  const town = menuLocationById(id);
  return town ? navigationLocationHref(SPAIN, town, locale) : buildCatalogUrl(SPAIN, { location: id }, locale)!;
};
const formatCount = (count: number, locale: SiteLocale) => count.toLocaleString(locale === "en" ? "en-GB" : "pl-PL");

function TownList({ towns, locale, onNavigate, className }: { towns: MenuTown[]; locale: SiteLocale; onNavigate: () => void; className?: string }) {
  return (
    <ul className={className}>
      {towns.map((town) => (
        <li key={town.id}>
          <Link prefetch={false} href={townHref(town.id, locale)} onClick={onNavigate}>
            <span>{town.name}</span>
            {town.count !== null && <span className={styles.count}>{formatCount(town.count, locale)}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function marketLinks(locale: SiteLocale) {
  const en = locale === "en";
  return [
    {
      href: buildCatalogUrl(SPAIN, { market: "false" }, locale)!,
      title: en ? "Resale properties" : "Rynek wtórny",
      text: en ? "Ready-to-move-in apartments, houses and villas" : "Gotowe do zamieszkania apartamenty, domy i wille",
    },
    {
      href: buildCatalogUrl(SPAIN, { market: "true" }, locale)!,
      title: en ? "New developments" : "Nowe inwestycje",
      text: en ? "New builds straight from developers" : "Inwestycje deweloperskie prosto od deweloperów",
    },
  ];
}

function otherDestinations(locale: SiteLocale) {
  const en = locale === "en";
  const links: { href: string; label: string }[] = [];
  if (cyprus) links.push({ href: catalogRoutePath({ country: "cypr" }, locale), label: en ? "Cyprus" : "Cypr" });
  const mallorca = spain.regions.find((region) => region.id === "mallorca");
  if (mallorca) links.push({ href: navigationLocationHref(SPAIN, mallorca, locale), label: navigationRegionLabel(mallorca.name, locale) });
  return links;
}

export function PropertiesNavigation({ locale, onConsultation }: { locale: SiteLocale; onConsultation?: () => void }) {
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const townsFor = useMenuTowns();
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
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>(`#${CSS.escape(id)} a`)?.focus()); }
        }}>
        {isEn ? "Offers" : "Oferty"}<FiChevronDown aria-hidden="true" />
      </button>
      <div id={id} className={styles.panel} hidden={!open}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.markets}>
              <p className={styles.label}>{isEn ? "Markets" : "Rynki"}</p>
              <ul className={styles.marketList}>
                {marketLinks(locale).map((market, index) => (
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
                  <li key={type.slug}><Link prefetch={false} href={catalogRoutePath({ country: SPAIN, propertyType: type.slug }, locale)} onClick={close}>{type.label[locale]}</Link></li>
                ))}
              </ul>
              <p className={styles.label}>{isEn ? "Other destinations" : "Inne kierunki"}</p>
              <ul className={styles.inlineLinks}>
                {otherDestinations(locale).map((link) => (
                  <li key={link.href}><Link prefetch={false} href={link.href} onClick={close}>{link.label}<FiArrowUpRight aria-hidden="true" /></Link></li>
                ))}
              </ul>
            </div>

            <div className={styles.locations}>
              <p className={styles.label}>{isEn ? "Locations in Spain" : "Lokalizacje w Hiszpanii"}</p>
              <div className={styles.coasts}>
                {MENU_COASTS.map((coastId) => (
                  <div key={coastId} className={styles.coast}>
                    <Link prefetch={false} href={coastHref(coastId, locale)} onClick={close} className={styles.coastHeading}>
                      {coastName(coastId, locale)}<FiArrowUpRight aria-hidden="true" />
                    </Link>
                    <TownList towns={townsFor(coastId)} locale={locale} onNavigate={close} className={styles.towns} />
                  </div>
                ))}
              </div>
            </div>

            <aside className={styles.cta}>
              <p className={styles.ctaLabel}>{isEn ? "Free consultation" : "Bezpłatna konsultacja"}</p>
              <p className={styles.ctaTitle}>{isEn ? "Not sure where to start?" : "Nie wiesz, od czego zacząć?"}</p>
              <p className={styles.ctaText}>
                {isEn
                  ? "Tell us what you are looking for — we will shortlist offers and answer your questions about buying in Spain."
                  : "Opowiedz nam, czego szukasz — dobierzemy oferty i odpowiemy na pytania o zakup w Hiszpanii. 0% prowizji dla kupującego."}
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
              <Link prefetch={false} href={catalogRoutePath({ country: SPAIN }, locale)} onClick={close} className={styles.ctaAll}>
                {isEn ? "All properties" : "Wszystkie nieruchomości"}<FiArrowRight aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobilePropertiesNavigation({ locale, onNavigate }: { locale: SiteLocale; onNavigate: () => void }) {
  const isEn = locale === "en";
  const townsFor = useMenuTowns();
  return (
    <div className={styles.mobile}>
      <p className={styles.mobileLabel}>{isEn ? "Offers" : "Oferty"}</p>
      <Link prefetch={false} className={styles.mobileAll} href={catalogRoutePath({ country: SPAIN }, locale)} onClick={onNavigate}>
        {isEn ? "All properties in Spain" : "Wszystkie oferty w Hiszpanii"}<FiArrowUpRight aria-hidden="true" />
      </Link>
      {MENU_COASTS.map((coastId) => (
        <details key={coastId}>
          <summary>{coastName(coastId, locale)}<FiChevronDown aria-hidden="true" /></summary>
          <div className={styles.mobileGroup}>
            <Link prefetch={false} className={styles.mobileAll} href={coastHref(coastId, locale)} onClick={onNavigate}>
              {isEn ? "All in this region" : "Wszystkie w regionie"}<FiArrowUpRight aria-hidden="true" />
            </Link>
            <TownList towns={townsFor(coastId)} locale={locale} onNavigate={onNavigate} className={styles.mobileTowns} />
          </div>
        </details>
      ))}
      <details>
        <summary>{isEn ? "Market and property type" : "Rynek i typ nieruchomości"}<FiChevronDown aria-hidden="true" /></summary>
        <div className={styles.mobileGroup}>
          {marketLinks(locale).map((market) => (
            <Link key={market.href} prefetch={false} href={market.href} onClick={onNavigate}>{market.title}<FiArrowUpRight aria-hidden="true" /></Link>
          ))}
          <ul className={styles.chips}>
            {navigationPropertyTypes.map((type) => (
              <li key={type.slug}><Link prefetch={false} href={catalogRoutePath({ country: SPAIN, propertyType: type.slug }, locale)} onClick={onNavigate}>{type.label[locale]}</Link></li>
            ))}
          </ul>
        </div>
      </details>
      {otherDestinations(locale).map((link) => (
        <Link key={link.href} prefetch={false} className={styles.mobileRow} href={link.href} onClick={onNavigate}>{link.label}<FiArrowUpRight aria-hidden="true" /></Link>
      ))}
    </div>
  );
}
