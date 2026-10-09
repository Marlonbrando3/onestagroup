import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiRotateCcw, FiSearch, FiSliders } from "react-icons/fi";
import { agencyRegions } from "@/data/polishAgency";
import {
  buildCatalogUrl,
  csv,
  effectiveCatalogQuery,
  parseCatalogPath,
  PROPERTY_TYPES,
  queryFromUrl,
  typeForQuery,
} from "@/lib/catalogRouting";
import { SEO_CITIES } from "@/lib/seoLocations";
import { slugify } from "@/lib/publicSeo";
import {
  cityLandingScope,
  menuLocationById,
  menuTownCandidates,
  staticMenuTowns,
  type MenuTown,
} from "@/lib/propertyNavigation";
import { loadLive } from "@/components/PropertiesNavigation";
import styles from "@/styles/polishAgencyHero.module.css";

// Rynek pierwotny jest domyślny — to priorytet sprzedażowy (oferty wiszą miesiącami).
const MARKETS = [
  { value: "true", label: "Nowe inwestycje" },
  { value: "false", label: "Rynek wtórny" },
  { value: "", label: "Wszystkie" },
];

// Widełki cenowe dobrane do rozkładu ofert w Hiszpanii (każdy przedział ma kilkaset ofert).
const PRICE_RANGES = [
  { value: "-200000", label: "do 200 tys. €" },
  { value: "200000-300000", label: "200–300 tys. €" },
  { value: "300000-400000", label: "300–400 tys. €" },
  { value: "400000-500000", label: "400–500 tys. €" },
  { value: "500000-750000", label: "500–750 tys. €" },
  { value: "750000-1000000", label: "750 tys. – 1 mln €" },
  { value: "1000000-", label: "powyżej 1 mln €" },
];

const FIELDS = ["region", "location", "type", "priceMin", "priceMax", "market", "bedsMin", "bathsMin", "pool"];

const coastId = (regionSlug: string) => regionSlug.replace(/-/g, "_");
const fallbackTowns = () =>
  Object.fromEntries(agencyRegions.map(({ slug }) => [coastId(slug), staticMenuTowns(coastId(slug))]));

/** Every town with live offers (alphabetical); until it loads, the curated menu towns. */
function useSearchTowns() {
  const [towns, setTowns] = useState<Record<string, MenuTown[]>>(fallbackTowns);
  useEffect(() => {
    let active = true;
    loadLive().then((data) => {
      if (!active || !data?.searchTowns) return;
      // Keep the curated fallback for a coast the live data has nothing for.
      setTowns((current) => Object.fromEntries(Object.entries(current).map(([coast, list]) =>
        [coast, data.searchTowns![coast]?.length ? data.searchTowns![coast] : list])));
    });
    return () => { active = false; };
  }, []);
  return towns;
}

type SearchState = {
  region: string;
  city: string;
  market: string;
  type: string;
  beds: string;
  price: string;
  baths: string;
  pool: string;
};

const first = (value: string | string[] | undefined) => csv(value)[0] || "";
const bracketLabel = (price: string) => {
  const [min, max] = price.split("-").map((v) => (v ? Number(v).toLocaleString("pl-PL") : ""));
  return min && max ? `${min}–${max} €` : min ? `od ${min} €` : `do ${max} €`;
};

/** Filters currently applied in a catalogue URL, mapped onto this form's fields. */
function stateFromUrl(asPath: string, fallbackMarket: string): SearchState {
  const route = parseCatalogPath(asPath) || { country: "hiszpania" };
  const query = effectiveCatalogQuery(route, queryFromUrl(asPath));
  let region = route.region || first(query.region);
  let city = first(query.location);
  if (route.city) {
    const seoCity = SEO_CITIES.find((item) => item.slug === route.city && item.region === route.region);
    const town = seoCity && menuTownCandidates(coastId(seoCity.region)).find((candidate) =>
      seoCity.aliases.some((alias) => slugify(alias) === slugify(candidate.name)));
    city = town?.id || "";
  }
  if (city && !region) {
    const parent = menuLocationById(city)?.parentId;
    const match = agencyRegions.find(({ slug }) => coastId(slug) === parent);
    if (match) region = match.slug;
  }
  const type = typeForQuery(query.type);
  const priceMin = first(query.priceMin);
  const priceMax = first(query.priceMax);
  const market = first(query.market);
  return {
    region: agencyRegions.some(({ slug }) => slug === region) ? region : "",
    city,
    market: ["true", "false"].includes(market) ? market : asPath.includes("?") || route.region || route.city || route.propertyType ? "" : fallbackMarket,
    type: type?.seoEnabled ? type.dbValues.join(",") : "",
    beds: first(query.bedsMin) || first(query.beds),
    price: priceMin || priceMax ? `${priceMin}-${priceMax}` : "",
    baths: first(query.bathsMin) || first(query.baths),
    pool: first(query.pool),
  };
}

const EMPTY: SearchState = { region: "", city: "", market: "true", type: "", beds: "", price: "", baths: "", pool: "" };

type Props = {
  /** Catalogue pages: start from the filters in the current URL instead of the defaults. */
  syncWithUrl?: boolean;
  /** Called right before navigating (e.g. to show the catalogue's loader). */
  onNavigate?: () => void;
};

export default function AgencyPropertySearch({ syncWithUrl = false, onNavigate }: Props) {
  const router = useRouter();
  const towns = useSearchTowns();
  const fromUrl = useMemo(
    () => (syncWithUrl ? stateFromUrl(router.asPath, "") : EMPTY),
    [syncWithUrl, router.asPath],
  );
  const [state, setState] = useState<SearchState>(fromUrl);
  useEffect(() => setState(fromUrl), [fromUrl]);
  const set = (patch: Partial<SearchState>) => setState((current) => ({ ...current, ...patch }));
  const { region, city, market, price } = state;
  const [advanced, setAdvanced] = useState(Boolean(fromUrl.baths || fromUrl.pool));
  const [priceMin, priceMax] = price ? price.split("-") : ["", ""];
  const customPrice = price && !PRICE_RANGES.some((range) => range.value === price);
  // The town from the current URL stays selectable even when it is outside the list.
  const townsFor = (slug: string): MenuTown[] => {
    const list = towns[coastId(slug)] || [];
    const current = city && menuLocationById(city);
    return current && current.parentId === coastId(slug) && !list.some((town) => town.id === city)
      ? [{ id: city, name: current.name, count: null }, ...list]
      : list;
  };

  function search(event: FormEvent<HTMLFormElement>) {
    const fields = new FormData(event.currentTarget);
    const query = Object.fromEntries(
      FIELDS.flatMap((key) => {
        const value = String(fields.get(key) || "");
        return value ? [[key, value]] : [];
      }),
    );
    if (syncWithUrl) {
      const sort = first(queryFromUrl(router.asPath).sort);
      if (sort) query.sort = sort;
    }
    // A chosen town lands on its city page when one is published; otherwise ?location= in the catalogue.
    let scope = {};
    if (query.location) {
      delete query.region;
      const town = menuLocationById(query.location);
      const landing = town && cityLandingScope("hiszpania", town);
      if (landing) { scope = landing; delete query.location; }
    }
    const destination = buildCatalogUrl("hiszpania", query, "pl", scope);
    if (!destination) return;
    event.preventDefault();
    if (destination === router.asPath) return;
    onNavigate?.();
    void router.push(destination, undefined, { scroll: !syncWithUrl });
  }

  return (
    <div id="wyszukiwarka" className={styles.searchWrap}>
      <form
        action="/nieruchomosci/hiszpania"
        method="get"
        onSubmit={search}
        onReset={(event) => { event.preventDefault(); setState(syncWithUrl ? { ...EMPTY, market: "" } : EMPTY); setAdvanced(false); }}
        className={styles.search}
        aria-label="Wyszukaj nieruchomość w Hiszpanii"
      >
        <fieldset className={styles.markets}>
          <legend className={styles.srOnly}>Rynek</legend>
          {MARKETS.map(({ value, label }) => (
            <label key={label} className={market === value ? styles.marketActive : undefined}>
              <input
                type="radio"
                name="market"
                value={value}
                checked={market === value}
                onChange={() => set({ market: value })}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span>Region</span>
            <div className={styles.select}>
              <select name="region" value={region} onChange={(event) => set({ region: event.target.value, city: "" })}>
                <option value="">Całe wybrzeże</option>
                {agencyRegions.map(({ name, slug }) => <option key={slug} value={slug}>{name}</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Miasto</span>
            <div className={styles.select}>
              <select name="location" value={city} onChange={(event) => set({ city: event.target.value })}>
                <option value="">Dowolne</option>
                {region
                  ? townsFor(region).map((town) => <option key={town.id} value={town.id}>{town.name}</option>)
                  : agencyRegions.map(({ name, slug }) => (
                      <optgroup key={slug} label={name}>
                        {townsFor(slug).map((town) => <option key={town.id} value={town.id}>{town.name}</option>)}
                      </optgroup>
                    ))}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Typ</span>
            <div className={styles.select}>
              <select name="type" value={state.type} onChange={(event) => set({ type: event.target.value })}>
                <option value="">Każdy typ</option>
                {PROPERTY_TYPES.filter((type) => type.seoEnabled).map((type) => (
                  <option key={type.slug} value={type.dbValues.join(",")}>{type.label.pl}</option>
                ))}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Sypialnie</span>
            <div className={styles.select}>
              <select name="bedsMin" value={state.beds} onChange={(event) => set({ beds: event.target.value })}>
                <option value="">Dowolnie</option>
                {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}+</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Cena</span>
            <div className={styles.select}>
              <select value={price} onChange={(event) => set({ price: event.target.value })}>
                <option value="">Dowolna</option>
                {customPrice && <option value={price}>{bracketLabel(price)}</option>}
                {PRICE_RANGES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
            {/* Widełki trafiają do katalogu jako zwykłe priceMin / priceMax (działa też bez JS). */}
            <input type="hidden" name="priceMin" value={priceMin} disabled={!priceMin} />
            <input type="hidden" name="priceMax" value={priceMax} disabled={!priceMax} />
          </label>
          <button type="submit" className={styles.submit}>
            <FiSearch aria-hidden="true" />
            Szukaj
          </button>
        </div>

        <div className={styles.searchFooter}>
          <button
            type="button"
            className={styles.advancedToggle}
            aria-expanded={advanced}
            aria-controls="agency-search-advanced"
            onClick={() => setAdvanced(!advanced)}
          >
            <FiSliders aria-hidden="true" />
            Więcej filtrów
            <FiChevronDown aria-hidden="true" className={styles.chevron} />
          </button>
          <button type="reset" className={styles.reset}>
            <FiRotateCcw aria-hidden="true" />
            Wyczyść
          </button>
        </div>

        <div id="agency-search-advanced" className={styles.advanced} hidden={!advanced}>
          <label className={styles.field}>
            <span>Łazienki</span>
            <div className={styles.select}>
              <select name="bathsMin" value={state.baths} onChange={(event) => set({ baths: event.target.value })}>
                <option value="">Dowolnie</option>
                {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}+</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Basen</span>
            <div className={styles.select}>
              <select name="pool" value={state.pool} onChange={(event) => set({ pool: event.target.value })}>
                <option value="">Bez znaczenia</option>
                <option value="true">Z basenem</option>
                <option value="false">Bez basenu</option>
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
        </div>
      </form>
    </div>
  );
}
