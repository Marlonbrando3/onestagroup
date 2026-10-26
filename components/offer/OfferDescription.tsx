import { useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import styles from "@/styles/offerPage.module.css";

// Opis oferty: tekst z feedu (HTML lub zwykły tekst) → bezpieczne akapity.
// Cała treść jest w HTML od razu (SEO); zwinięcie to tylko CSS.

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function formatDescription(value: unknown): string {
  const normalized = String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>\s*<\/p\s*>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "\n\n")
    .replace(/<\/h[1-6]\s*>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li\s*>/gi, "")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<\/div\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    // Numer agencji z feedu na końcu opisu, np. „(1127)”.
    .replace(/\s*\(\d{3,6}\)\s*$/, "")
    .trim();
  if (!normalized) return "";

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return "";
      // Pierwsza krótka linia akapitu bez kropki = śródtytuł (tak piszą feedy).
      const [first, ...rest] = lines;
      const isHeading =
        first.length > 3 &&
        first.length < 70 &&
        !first.startsWith("•") &&
        !/[.:;!?]$/.test(first);
      if (isHeading && rest.length)
        return `<strong>${escapeHtml(first)}</strong><p>${rest.map(escapeHtml).join("<br />")}</p>`;
      if (isHeading && lines.length === 1) return `<strong>${escapeHtml(first)}</strong>`;
      return `<p>${lines.map(escapeHtml).join("<br />")}</p>`;
    })
    .filter(Boolean)
    .join("");
}

export default function OfferDescription({
  description,
  descriptionEN,
  locale = "pl",
}: {
  description?: string | null;
  descriptionEN?: string | null;
  locale?: "pl" | "en";
}) {
  const isEn = locale === "en";
  const hasPl = Boolean(description && String(description).trim());
  const hasEn = Boolean(descriptionEN && String(descriptionEN).trim());
  const [view, setView] = useState<"pl" | "en" | "translated">(
    isEn ? "en" : hasPl ? "pl" : "en",
  );
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const html = useMemo(() => {
    if (view === "translated" && translated) return translated;
    if (view === "en") return formatDescription(descriptionEN) || formatDescription(description);
    return formatDescription(description) || formatDescription(descriptionEN);
  }, [view, translated, description, descriptionEN]);

  const translate = async () => {
    if (translated) return setView("translated");
    const source = hasPl ? description : descriptionEN;
    if (!source || translating) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translateToPolish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: source }),
      });
      const data = await res.json();
      if (!res.ok || !data?.text) throw new Error(data?.error);
      setTranslated(formatDescription(data.text));
      setView("translated");
    } catch {
      alert("Nie udało się przetłumaczyć opisu. Spróbuj ponownie za chwilę.");
    } finally {
      setTranslating(false);
    }
  };

  if (!html) return null;
  const long = html.length > 1600;

  return (
    <section id="opis" className={styles.card} aria-labelledby="offer-description">
      <div className={styles.cardHead}>
        <h2 id="offer-description">{isEn ? "About this property" : "Opis nieruchomości"}</h2>
        {!isEn && hasEn && (
          <div className={styles.langSwitch} role="group" aria-label="Język opisu">
            {hasPl ? (
              <button type="button" aria-pressed={view === "pl"} onClick={() => setView("pl")}>
                Po polsku
              </button>
            ) : (
              <button
                type="button"
                aria-pressed={view === "translated"}
                onClick={translate}
                disabled={translating}
              >
                {translating ? "Tłumaczę…" : "Przetłumacz na polski"}
              </button>
            )}
            <button type="button" aria-pressed={view === "en"} onClick={() => setView("en")}>
              Po angielsku
            </button>
          </div>
        )}
      </div>
      <div
        className={`${styles.description} ${long && !expanded ? styles.collapsed : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {long && (
        <button
          type="button"
          className={styles.moreButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? isEn ? "Show less" : "Zwiń opis"
            : isEn ? "Read the full description" : "Czytaj cały opis"}
          <LuChevronDown style={{ transform: expanded ? "rotate(180deg)" : undefined }} />
        </button>
      )}
    </section>
  );
}
