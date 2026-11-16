import { useEffect, useState } from "react";
import { LuBath, LuBedDouble, LuMail, LuRuler, LuX } from "react-icons/lu";
import ContactOnPropertyCard from "@/components/SearchEngine/ContactOnPropertyCard";
import type { ProjectUnit } from "@/lib/projectUnits";
import styles from "@/styles/projectUnits.module.css";

// Lista mieszkań z tego samego projektu: prosta „belka” na każde mieszkanie, z ceną.
// Belki nie prowadzą do innych ofert (to ta sama inwestycja i te same wizualizacje) —
// kliknięcie otwiera okienko z formularzem kontaktowym o wybranym mieszkaniu.
// variant: "public" (strona oferty) albo "presentation" (prezentacja agenta) — różnią się ramką.

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

const formatPrice = (value: number) => `${value.toLocaleString("pl-PL").replace(/ /g, " ")} €`;

export default function ProjectUnits({
  units,
  variant = "public",
  locale = "pl",
  headingClassName,
}: {
  units: ProjectUnit[];
  variant?: "public" | "presentation";
  locale?: "pl" | "en";
  headingClassName?: string;
}) {
  const [selected, setSelected] = useState<ProjectUnit | null>(null);
  const en = locale === "en";

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  if (!units || units.length < 2) return null;

  const factsFor = (unit: ProjectUnit) =>
    [
      unit.beds !== null && {
        icon: <LuBedDouble aria-hidden="true" />,
        text: en
          ? `${unit.beds} bedroom${unit.beds === 1 ? "" : "s"}`
          : `${unit.beds} ${plural(unit.beds, "sypialnia", "sypialnie", "sypialni")}`,
      },
      unit.baths !== null && {
        icon: <LuBath aria-hidden="true" />,
        text: en
          ? `${unit.baths} bathroom${unit.baths === 1 ? "" : "s"}`
          : `${unit.baths} ${plural(unit.baths, "łazienka", "łazienki", "łazienek")}`,
      },
      unit.area !== null && { icon: <LuRuler aria-hidden="true" />, text: `${unit.area} m²` },
    ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  const summary = (unit: ProjectUnit) =>
    [unit.label, ...factsFor(unit).map((f) => f.text), unit.price ? formatPrice(unit.price) : ""]
      .filter(Boolean)
      .join(" · ");

  return (
    <section
      className={`${styles.wrap} ${variant === "presentation" ? styles.presentation : styles.public}`}
      aria-labelledby="project-units-heading"
    >
      <p className={styles.eyebrow}>{en ? "Same development" : "W tym samym projekcie"}</p>
      <h2 id="project-units-heading" className={headingClassName}>
        {en ? "Other available homes" : "Dostępne mieszkania w tej inwestycji"}
      </h2>
      <p className={styles.lead}>
        {en
          ? `${units.length} homes available in this development. Choose one to ask about it.`
          : `W tej inwestycji dostępnych jest ${units.length} ${plural(units.length, "mieszkanie", "mieszkania", "mieszkań")}. Kliknij, aby zapytać o wybrane.`}
      </p>
      <ul className={styles.list}>
        {units.map((unit) => (
          <li key={unit.externalId}>
            <button
              type="button"
              className={`${styles.row} ${unit.current ? styles.current : ""}`}
              onClick={() => setSelected(unit)}
              aria-label={`${en ? "Ask about" : "Zapytaj o"}: ${summary(unit)}`}
            >
              <span className={styles.label}>
                {unit.label}
                {unit.current && (
                  <span className={styles.badge}>{en ? "This property" : "To mieszkanie"}</span>
                )}
              </span>
              <span className={styles.facts}>
                {factsFor(unit).map(({ icon, text }) => (
                  <span key={text} className={styles.fact}>
                    {icon}
                    {text}
                  </span>
                ))}
              </span>
              {unit.price !== null && <span className={styles.price}>{formatPrice(unit.price)}</span>}
              <LuMail className={styles.ask} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-unit-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.close}
              onClick={() => setSelected(null)}
              aria-label={en ? "Close" : "Zamknij"}
            >
              <LuX aria-hidden="true" />
            </button>
            <p className={styles.eyebrow}>{en ? "Ask about this home" : "Zapytaj o to mieszkanie"}</p>
            <h3 id="project-unit-dialog-title" className={`${styles.dialogTitle} ${headingClassName || ""}`}>
              {selected.label}
            </h3>
            <p className={styles.dialogFacts}>
              {[...factsFor(selected).map((f) => f.text), selected.price ? formatPrice(selected.price) : ""]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <ContactOnPropertyCard
              key={selected.externalId}
              propertyRef={selected.externalId}
              locale={locale}
              variant="section"
            />
          </div>
        </div>
      )}
    </section>
  );
}
