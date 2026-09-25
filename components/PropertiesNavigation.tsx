import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FiArrowUpRight, FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
import { catalogRoutePath } from "@/lib/catalogRouting";
import type { SiteLocale } from "@/lib/i18n";
import { normalizeLocationName, type LocationEntry } from "@/lib/locations";
import { navigationCountries, navigationLocationHref, navigationPropertyTypes, navigationRegionLabel } from "@/lib/propertyNavigation";
import styles from "./PropertiesNavigation.module.css";

const countryName = (country: typeof navigationCountries[number], locale: SiteLocale) => locale === "en" ? country.englishLabel : country.label;
const Arrow = () => <FiArrowUpRight aria-hidden="true" />;

function AlphabeticalTownLinks({ towns, country, locale, onNavigate }: {
  towns: LocationEntry[];
  country: string;
  locale: SiteLocale;
  onNavigate: () => void;
}) {
  const groups = new Map<string, LocationEntry[]>();
  for (const town of towns) {
    const letter = normalizeLocationName(town.name).charAt(0).toLocaleUpperCase(locale);
    const group = groups.get(letter) || [];
    group.push(town);
    groups.set(letter, group);
  }

  return <>{Array.from(groups, ([letter, group]) => (
    <li key={letter} className={styles.townGroup}>
      <h3 className={styles.townLetter}>{letter}</h3>
      <ul className={styles.townGroupLinks}>
        {group.map((town) => <li key={town.id}><Link prefetch={false} href={navigationLocationHref(country, town, locale)} onClick={onNavigate}>{town.name}<Arrow /></Link></li>)}
      </ul>
    </li>
  ))}</>;
}

function PropertyTypes({ locale, onNavigate }: { locale: SiteLocale; onNavigate: () => void }) {
  // This selection deliberately stays independent of the location columns.
  const [country, setCountry] = useState(navigationCountries[0].slug);
  const id = useId();
  return (
    <div>
      <div className={styles.typeCountries} role="group" aria-label={locale === "en" ? "Country for property types" : "Kraj dla typu nieruchomości"}>
        {navigationCountries.map((item) => (
          <button key={item.slug} type="button" aria-pressed={country === item.slug} aria-controls={id}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setCountry(item.slug); }}
            onClick={() => setCountry(item.slug)}>{countryName(item, locale)}</button>
        ))}
      </div>
      <ul id={id} className={styles.typeLinks}>
        {navigationPropertyTypes.map((type) => (
          <li key={type.slug}><Link prefetch={false} href={catalogRoutePath({ country, propertyType: type.slug }, locale)} onClick={onNavigate}>{type.label[locale]}<Arrow /></Link></li>
        ))}
      </ul>
    </div>
  );
}

export function PropertiesNavigation({ locale }: { locale: SiteLocale }) {
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const [countrySlug, setCountrySlug] = useState(navigationCountries[0].slug);
  const [regionId, setRegionId] = useState(navigationCountries[0].regions[0].id);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const country = navigationCountries.find((item) => item.slug === countrySlug)!;
  const region = country.regions.find((item) => item.id === regionId) || country.regions[0];
  const close = () => setOpen(false);
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const selectCountry = (slug: string) => {
    if (slug === countrySlug) return;
    setCountrySlug(slug);
    setRegionId(navigationCountries.find((item) => item.slug === slug)!.regions[0].id);
  };

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
      onPointerLeave={() => { cancelClose(); closeTimer.current = setTimeout(() => { if (!root.current?.contains(document.activeElement)) setOpen(false); }, 160); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={id}
        onClick={() => { cancelClose(); setOpen((value) => !value); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>(`[data-country-selector]`)?.focus()); }
        }}>
        {isEn ? "Offers" : "Oferty"}<FiChevronDown aria-hidden="true" />
      </button>
      <div id={id} className={styles.panel} hidden={!open}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <div><p className={styles.eyebrow}>{isEn ? "Properties with Onesta" : "Nieruchomości z Onestą"}</p><p className={styles.title}>{isEn ? "Find your place in the sun" : "Znajdź swoje miejsce w słońcu"}</p></div>
            <button type="button" className={styles.close} aria-label={isEn ? "Close offers menu" : "Zamknij menu ofert"} onClick={() => { close(); trigger.current?.focus(); }}><FiX aria-hidden="true" /></button>
          </div>
          <div className={styles.grid}>
            <div className={styles.countries}>
              <p className={styles.columnLabel}><span>01</span>{isEn ? "Country" : "Kraj"}</p>
              {navigationCountries.map((item) => (
                <button data-country-selector key={item.slug} type="button" className={styles.country} aria-pressed={countrySlug === item.slug} aria-controls={`${id}-regions`}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") selectCountry(item.slug); }} onClick={() => selectCountry(item.slug)}>
                  {countryName(item, locale)}<FiChevronRight aria-hidden="true" />
                </button>
              ))}
              <Link prefetch={false} href={catalogRoutePath({ country: countrySlug }, locale)} onClick={close} className={styles.allCountry}>{isEn ? "All properties" : "Wszystkie oferty"}<Arrow /></Link>
            </div>
            <div className={styles.regions}>
              <p className={styles.columnLabel}><span>02</span>{isEn ? "Coast & region" : "Wybrzeże i region"}</p>
              <div id={`${id}-regions`}>
                {country.regions.map((item) => (
                  <button key={item.id} type="button" className={styles.region} aria-pressed={region.id === item.id} aria-controls={`${id}-towns`}
                    onPointerEnter={(event) => { if (event.pointerType === "mouse") setRegionId(item.id); }} onClick={() => setRegionId(item.id)}>
                    {navigationRegionLabel(item.name, locale)}<FiChevronRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.towns}>
              <p className={styles.columnLabel}><span>03</span>{isEn ? "Cities & nearby areas" : "Miasta i okolice"}</p>
              <div id={`${id}-towns`}>
                <div className={styles.regionHeading}><p>{navigationRegionLabel(region.name, locale)}</p><Link prefetch={false} href={navigationLocationHref(countrySlug, region, locale)} onClick={close}>{isEn ? "View all" : "Zobacz wszystkie"}<Arrow /></Link></div>
                <ul key={region.id} className={styles.townLinks}>
                  <AlphabeticalTownLinks towns={region.towns} country={countrySlug} locale={locale} onNavigate={close} />
                </ul>
              </div>
            </div>
            <div className={styles.types}>
              <p className={styles.columnLabel}><span>04</span>{isEn ? "Property type" : "Typ nieruchomości"}</p>
              <PropertyTypes locale={locale} onNavigate={close} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobilePropertiesNavigation({ locale, onNavigate }: { locale: SiteLocale; onNavigate: () => void }) {
  const isEn = locale === "en";
  return (
    <div className={styles.mobile}>
      <p className={styles.eyebrow}>{isEn ? "Offers" : "Oferty"}</p>
      {navigationCountries.map((country) => (
        <details key={country.slug}>
          <summary>{countryName(country, locale)}<FiChevronDown aria-hidden="true" /></summary>
          <div className={styles.mobileCountry}>
            <Link prefetch={false} className={styles.mobileAll} href={catalogRoutePath({ country: country.slug }, locale)} onClick={onNavigate}>{isEn ? "All properties" : "Wszystkie oferty"}<Arrow /></Link>
            {country.regions.map((region) => (
              <details key={region.id}>
                <summary>{navigationRegionLabel(region.name, locale)}<FiChevronDown aria-hidden="true" /></summary>
                <ul className={styles.mobileTowns}>
                  <li><Link prefetch={false} className={styles.mobileAll} href={navigationLocationHref(country.slug, region, locale)} onClick={onNavigate}>{isEn ? "All in this region" : "Wszystkie w regionie"}<Arrow /></Link></li>
                  <AlphabeticalTownLinks towns={region.towns} country={country.slug} locale={locale} onNavigate={onNavigate} />
                </ul>
              </details>
            ))}
          </div>
        </details>
      ))}
      <details className={styles.mobileTypes}>
        <summary>{isEn ? "Property type" : "Typ nieruchomości"}<FiChevronDown aria-hidden="true" /></summary>
        <PropertyTypes locale={locale} onNavigate={onNavigate} />
      </details>
    </div>
  );
}
