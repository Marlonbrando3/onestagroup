import { useState } from "react";
import { FiArrowRight, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { calculateRental, DEFAULT_RENTAL_ASSUMPTIONS, HOLASTAY_RATES, type RentalAssumptions } from "@/lib/holastay";
import styles from "@/styles/propertyManagement.module.css";

const money = (value: number) => new Intl.NumberFormat("pl-PL", {
  style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(value);

export default function PropertyManagementCalculator() {
  const [assumptions, setAssumptions] = useState<RentalAssumptions>(DEFAULT_RENTAL_ASSUMPTIONS);
  const result = calculateRental(assumptions);
  const maxBookings = Math.min(52, Math.floor(365 / assumptions.nightsPerBooking));

  function update(field: keyof RentalAssumptions, value: number) {
    setAssumptions((current) => {
      const next = { ...current, [field]: value };
      next.bookings = Math.min(next.bookings, Math.floor(365 / next.nightsPerBooking));
      return next;
    });
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.calculatorInputs}>
        <div className={styles.calculatorTop}>
          <h3>Twój scenariusz</h3>
          <button type="button" onClick={() => setAssumptions(DEFAULT_RENTAL_ASSUMPTIONS)} className={styles.resetButton}>
            <FiRefreshCw aria-hidden="true" /> Resetuj
          </button>
        </div>
        <p className={styles.smallText}>Zmień założenia i zobacz, jak wpływają na roczne rozliczenie.</p>
        <div className={styles.rangeField}>
          <label htmlFor="rental-rate">Średnia cena za noc <output htmlFor="rental-rate">{assumptions.nightlyRate} EUR</output></label>
          <input id="rental-rate" type="range" min="30" max="300" step="5" value={assumptions.nightlyRate} onChange={(event) => update("nightlyRate", Number(event.target.value))} aria-valuetext={`${assumptions.nightlyRate} euro za noc`} />
          <div className={styles.rangeEnds}><span>30 EUR</span><span>300 EUR</span></div>
        </div>
        <div className={styles.rangeField}>
          <label htmlFor="rental-bookings">Rezerwacje w roku <output htmlFor="rental-bookings">{assumptions.bookings}</output></label>
          <input id="rental-bookings" type="range" min="0" max={maxBookings} step="1" value={assumptions.bookings} onChange={(event) => update("bookings", Number(event.target.value))} />
          <div className={styles.rangeEnds}><span>0 rezerwacji</span><span>{maxBookings} rezerwacji</span></div>
        </div>
        <div className={styles.rangeField}>
          <label htmlFor="rental-nights">Średnia długość pobytu <output htmlFor="rental-nights">{assumptions.nightsPerBooking} nocy</output></label>
          <input id="rental-nights" type="range" min="2" max="30" step="1" value={assumptions.nightsPerBooking} onChange={(event) => update("nightsPerBooking", Number(event.target.value))} />
          <div className={styles.rangeEnds}><span>2 noce</span><span>30 nocy</span></div>
        </div>
        <div className={styles.occupancy}><span>Łącznie <strong>{result.nights} nocy</strong> wynajmu</span><span>{Math.round(result.occupancy)}% roku</span></div>
        <details className={styles.assumptions} open>
          <summary>Dodatkowe koszty i podatek od usług <FiChevronDown aria-hidden="true" /></summary>
          <div className={styles.assumptionFields}>
            <label htmlFor="rental-portal">Prowizje portali / płatności (%)
              <input id="rental-portal" type="number" min="0" max="100" step="0.5" value={assumptions.portalPercent} onChange={(event) => update("portalPercent", Math.min(100, Math.max(0, Number(event.target.value) || 0)))} />
            </label>
            <label htmlFor="rental-vat">VAT/IVA od usług (%)
              <input id="rental-vat" type="number" min="0" max="100" step="0.5" value={assumptions.serviceVatPercent} onChange={(event) => update("serviceVatPercent", Math.min(100, Math.max(0, Number(event.target.value) || 0)))} />
            </label>
            <label htmlFor="rental-other" className={styles.fullField}>Pozostałe koszty roczne (EUR)
              <input id="rental-other" type="number" min="0" max="1000000" step="100" value={assumptions.annualOtherCosts} onChange={(event) => update("annualOtherCosts", Math.min(1000000, Math.max(0, Number(event.target.value) || 0)))} />
              <span>Wpisz łączny koszt mediów, wspólnoty, ubezpieczenia, napraw i innych opłat.</span>
            </label>
          </div>
          <p className={styles.assumptionNote}>21% VAT/IVA i 1 800 EUR kosztów to założenia przykładu. Prowizje portali domyślnie wynoszą 0% — wpisz stawkę dla swoich kanałów rezerwacji.</p>
        </details>
      </div>
      <div className={styles.calculatorResult}>
        <p className={styles.eyebrow}>Roczne rozliczenie · symulacja</p>
        <div aria-live="polite" aria-atomic="true">
          <p className={styles.resultLabel}>Saldo po wskazanych kosztach</p>
          <p className={styles.resultAmount}>{money(result.balance)}</p>
          <p className={styles.resultCaveat}>Przed podatkiem dochodowym i finansowaniem zakupu.</p>
        </div>
        <dl className={styles.resultRows}>
          <div><dt>Przychód z noclegów</dt><dd>{money(result.revenue)}</dd></div>
          <div><dt>Zarządzanie · {HOLASTAY_RATES.managementPercent}% netto</dt><dd>−{money(result.management)}</dd></div>
          <div><dt>Rezydent · {result.bookings} × {HOLASTAY_RATES.residentPerStay} EUR netto</dt><dd>−{money(result.resident)}</dd></div>
          <div><dt>VAT/IVA od zarządzania i rezydenta · {assumptions.serviceVatPercent}%</dt><dd>−{money(result.serviceVat)}</dd></div>
          <div><dt>Portale / płatności · {assumptions.portalPercent}%</dt><dd>−{money(result.portal)}</dd></div>
          <div><dt>Pozostałe koszty roczne</dt><dd>−{money(result.otherCosts)}</dd></div>
        </dl>
        <div className={styles.costBar} aria-hidden="true">{result.costShares.map((share, index) => <span key={index} style={{ width: `${share}%` }} />)}</div>
        <div className={styles.costLegend} aria-hidden="true"><span>HOLASTAY z VAT/IVA</span><span>Portale</span><span>Inne koszty</span><span>Saldo</span></div>
        <p className={styles.guestFeesNote}>Sprzątanie i pralnia: {HOLASTAY_RATES.cleaningPerStay + HOLASTAY_RATES.laundryPerStay} EUR netto za pobyt po stronie gościa. Poza przychodem z noclegów i saldem właściciela w tym modelu.</p>
        <a href="#kontakt-zarzadzanie" className={`${styles.button} ${styles.lightButton}`}>Omówmy Twój apartament <FiArrowRight aria-hidden="true" /></a>
      </div>
    </div>
  );
}
