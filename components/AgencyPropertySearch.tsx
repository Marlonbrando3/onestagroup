import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiRotateCcw, FiSearch, FiSliders } from "react-icons/fi";
import { agencyRegions } from "@/data/polishAgency";
import { buildCatalogUrl, PROPERTY_TYPES } from "@/lib/catalogRouting";
import styles from "@/styles/polishAgencyHero.module.css";

// Rynek pierwotny jest domyślny — to priorytet sprzedażowy (oferty wiszą miesiącami).
const MARKETS = [
  { value: "true", label: "Nowe inwestycje" },
  { value: "false", label: "Rynek wtórny" },
  { value: "", label: "Wszystkie" },
];

const FIELDS = ["region", "type", "priceMin", "priceMax", "market", "bedsMin", "bathsMin", "pool"];

export default function AgencyPropertySearch() {
  const router = useRouter();
  const [market, setMarket] = useState("true");
  const [advanced, setAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    const fields = new FormData(event.currentTarget);
    const query = Object.fromEntries(
      FIELDS.flatMap((key) => {
        const value = String(fields.get(key) || "");
        return value ? [[key, value]] : [];
      }),
    );
    const destination = buildCatalogUrl("hiszpania", query);
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
        onReset={() => { setMinPrice(""); setAdvanced(false); setMarket("true"); }}
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
              <select name="region" defaultValue="">
                <option value="">Całe wybrzeże</option>
                {agencyRegions.map(({ name, slug }) => <option key={slug} value={slug}>{name}</option>)}
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
            <span>Budżet do (€)</span>
            <input
              name="priceMax"
              type="number"
              inputMode="numeric"
              min={minPrice || 0}
              max={99999999}
              step={1000}
              placeholder="np. 350 000"
            />
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
            <span>Cena od (€)</span>
            <input
              name="priceMin"
              type="number"
              inputMode="numeric"
              min={0}
              max={99999999}
              step={1000}
              placeholder="Bez minimum"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </label>
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
