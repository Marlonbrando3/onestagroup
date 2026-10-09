import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiRotateCcw, FiSearch, FiSliders } from "react-icons/fi";
import { agencyRegions } from "@/data/polishAgency";
import { buildCatalogUrl, PROPERTY_TYPES } from "@/lib/catalogRouting";
import { cityLandingScope, menuLocationById, staticMenuTowns, type MenuTown } from "@/lib/propertyNavigation";
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
    loadLive().then((data) => { if (active && data?.searchTowns) setTowns(data.searchTowns); });
    return () => { active = false; };
  }, []);
  return towns;
}

export default function AgencyPropertySearch() {
  const router = useRouter();
  const towns = useSearchTowns();
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [market, setMarket] = useState("true");
  const [advanced, setAdvanced] = useState(false);
  const [price, setPrice] = useState("");
  const [priceMin, priceMax] = price ? price.split("-") : ["", ""];

  function search(event: FormEvent<HTMLFormElement>) {
    const fields = new FormData(event.currentTarget);
    const query = Object.fromEntries(
      FIELDS.flatMap((key) => {
        const value = String(fields.get(key) || "");
        return value ? [[key, value]] : [];
      }),
    );
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
    void router.push(destination);
  }

  return (
    <div id="wyszukiwarka" className={styles.searchWrap}>
      <form
        action="/nieruchomosci/hiszpania"
        method="get"
        onSubmit={search}
        onReset={() => { setPrice(""); setAdvanced(false); setMarket("true"); setRegion(""); setCity(""); }}
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
                onChange={() => setMarket(value)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span>Region</span>
            <div className={styles.select}>
              <select name="region" value={region} onChange={(event) => { setRegion(event.target.value); setCity(""); }}>
                <option value="">Całe wybrzeże</option>
                {agencyRegions.map(({ name, slug }) => <option key={slug} value={slug}>{name}</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Miasto</span>
            <div className={styles.select}>
              <select name="location" value={city} onChange={(event) => setCity(event.target.value)}>
                <option value="">Dowolne</option>
                {region
                  ? (towns[coastId(region)] || []).map((town) => <option key={town.id} value={town.id}>{town.name}</option>)
                  : agencyRegions.map(({ name, slug }) => (
                      <optgroup key={slug} label={name}>
                        {(towns[coastId(slug)] || []).map((town) => <option key={town.id} value={town.id}>{town.name}</option>)}
                      </optgroup>
                    ))}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Typ</span>
            <div className={styles.select}>
              <select name="type" defaultValue="">
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
              <select name="bedsMin" defaultValue="">
                <option value="">Dowolnie</option>
                {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}+</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Cena</span>
            <div className={styles.select}>
              <select value={price} onChange={(event) => setPrice(event.target.value)}>
                <option value="">Dowolna</option>
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
              <select name="bathsMin" defaultValue="">
                <option value="">Dowolnie</option>
                {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}+</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </div>
          </label>
          <label className={styles.field}>
            <span>Basen</span>
            <div className={styles.select}>
              <select name="pool" defaultValue="">
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
