import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiRotateCcw, FiSearch } from "react-icons/fi";
import { agencyRegions } from "@/data/polishAgency";
import { buildCatalogUrl, PROPERTY_TYPES } from "@/lib/catalogRouting";
import styles from "@/styles/polishAgency.module.css";

export default function AgencyPropertySearch() {
  const router = useRouter();
  const [advanced, setAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    const fields = new FormData(event.currentTarget);
    const query = Object.fromEntries(
      ["region", "type", "priceMin", "priceMax", "market", "bedsMin", "bathsMin", "pool"].flatMap((key) => {
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
    <section id="wyszukiwarka" className={styles.searchSection} aria-labelledby="agency-search-heading">
      <div className={styles.container}>
        <form
          action="/nieruchomosci/hiszpania"
          method="get"
          onSubmit={search}
          onReset={() => { setMinPrice(""); setAdvanced(false); }}
          className={styles.propertySearch}
        >
          <div className={styles.searchTop}>
            <div className={styles.searchHeading}>
              <h2 id="agency-search-heading"><strong>Znajdź nieruchomość</strong>{" "}<span>w Hiszpanii</span></h2>
            </div>
            <div className={styles.searchFields}>
              <label htmlFor="agency-search-region">
                <span>Region</span>
                <div className={styles.searchSelect}>
                  <select id="agency-search-region" name="region" defaultValue="">
                    <option value="">Wszystkie regiony</option>
                    {agencyRegions.map(({ name, slug }) => <option key={slug} value={slug}>{name}</option>)}
                  </select>
                  <FiChevronDown aria-hidden="true" />
                </div>
              </label>
              <label htmlFor="agency-search-type">
                <span>Typ nieruchomości</span>
                <div className={styles.searchSelect}>
                  <select id="agency-search-type" name="type" defaultValue="">
                    <option value="">Wszystkie typy</option>
                    {PROPERTY_TYPES.filter((type) => type.seoEnabled).map((type) => (
                      <option key={type.slug} value={type.dbValues.join(",")}>{type.label.pl}</option>
                    ))}
                  </select>
                  <FiChevronDown aria-hidden="true" />
                </div>
              </label>
              <label htmlFor="agency-search-price-min">
                <span>Cena od (€)</span>
                <input id="agency-search-price-min" name="priceMin" type="number" inputMode="numeric" min={0} max={99999999} step={1} placeholder="Bez minimum" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
              </label>
              <label htmlFor="agency-search-price-max">
                <span>Cena do (€)</span>
                <input id="agency-search-price-max" name="priceMax" type="number" inputMode="numeric" min={minPrice || 0} max={99999999} step={1} placeholder="Bez maksimum" />
              </label>
            </div>
          </div>

          <div className={styles.searchFooter}>
            <button type="reset" className={styles.searchReset}><FiRotateCcw aria-hidden="true" /><span>Wyczyść filtry</span></button>
            <button type="button" className={styles.searchAdvancedToggle} aria-expanded={advanced} aria-controls="agency-search-advanced" onClick={() => setAdvanced(!advanced)}>
              <span><FiChevronDown aria-hidden="true" /></span>Wyszukiwanie zaawansowane
            </button>
            <button type="submit" className={styles.searchSubmit}>Wyszukaj oferty <FiSearch aria-hidden="true" /></button>
          </div>

          <div id="agency-search-advanced" className={styles.searchAdvancedFields} hidden={!advanced}>
            <label htmlFor="agency-search-market">
              <span>Rynek</span>
              <div className={styles.searchSelect}>
                <select id="agency-search-market" name="market" defaultValue="">
                  <option value="">Pierwotny i wtórny</option>
                  <option value="true">Pierwotny</option>
                  <option value="false">Wtórny</option>
                </select>
                <FiChevronDown aria-hidden="true" />
              </div>
            </label>
            <label htmlFor="agency-search-beds">
              <span>Sypialnie</span>
              <div className={styles.searchSelect}>
                <select id="agency-search-beds" name="bedsMin" defaultValue="">
                  <option value="">Dowolna liczba</option>
                  {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}+</option>)}
                </select>
                <FiChevronDown aria-hidden="true" />
              </div>
            </label>
            <label htmlFor="agency-search-baths">
              <span>Łazienki</span>
              <div className={styles.searchSelect}>
                <select id="agency-search-baths" name="bathsMin" defaultValue="">
                  <option value="">Dowolna liczba</option>
                  {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}+</option>)}
                </select>
                <FiChevronDown aria-hidden="true" />
              </div>
            </label>
            <label htmlFor="agency-search-pool">
              <span>Basen</span>
              <div className={styles.searchSelect}>
                <select id="agency-search-pool" name="pool" defaultValue="">
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
    </section>
  );
}
