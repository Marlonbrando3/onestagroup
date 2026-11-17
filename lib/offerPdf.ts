import { jsPDF } from "jspdf";
import type { AgentOffer } from "./agentOffers";
import { propertyTypeLabel } from "./i18n";
import { getCountryLabel } from "./regionMap";
import { validTitleOrEmpty } from "./titlesDictionary";
import {
  descriptionValue,
  featureLabel,
  featureValues,
  imageUrls,
} from "./presentationOffer";
import { propertyImageUrl } from "./propertyImages";
import { normalizeFeatures } from "./propertyFeatures";

// Broszura PDF oferty (prezentacja klienta / panel agenta).
// Strona 1: logo, duże zdjęcie, tytuł, cena, parametry, agent. Strona 2: opis i udogodnienia.
// Kolejne strony: galeria. Zdjęcia idą przez nasz proxy /api/property-image (ta sama domena),
// bo bezpośrednie pobranie z serwerów deweloperów blokuje przeglądarka (CORS).

export type OfferPdfContact = { name: string; email: string; phone: string };
type PdfInput = {
  offer: AgentOffer;
  contact: OfferPdfContact;
  publicUrl?: string;
};
type Photo = { canvas: HTMLCanvasElement; width: number; height: number };

const INK = "#182334";
const GOLD = "#9b7a36";
const GOLD_LIGHT = "#d6b66f";
const MUTED = "#5f6b7a";
const LINE = "#e3d9ca";
const PAPER = "#f6f2ec";
const PAGE_W = 210;
const MARGIN = 16;
const WIDTH = PAGE_W - MARGIN * 2;
const BOTTOM = 272;
const MAX_PHOTOS = 9;
const LOGO_SRC = "/logotype_full_new.png";
const PROXY_VERSION = "2";

let fontsPromise: Promise<string[]> | undefined;
function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      ["Regular", "Bold"].map(async (weight) => {
        const response = await fetch(`/fonts/pdf/NotoSans-${weight}.ttf`, {
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw new Error("font");
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = "";
        for (let i = 0; i < bytes.length; i += 8192) {
          binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
        }
        return btoa(binary);
      }),
    ).catch(() => {
      fontsPromise = undefined;
      throw new Error("Nie udało się załadować czcionek PDF. Spróbuj ponownie.");
    });
  }
  return fontsPromise;
}

// Zdjęcie z zewnętrznego serwera zawsze przez nasz proxy (ta sama domena = brak blokady CORS).
function sameOriginImageUrl(source: unknown) {
  const url = propertyImageUrl(source);
  if (/^https?:\/\//i.test(url) && !url.startsWith(window.location.origin)) {
    return `/api/property-image?url=${encodeURIComponent(url)}&v=${PROXY_VERSION}`;
  }
  return url;
}

async function loadCanvas(url: string, maxSide: number, background?: string): Promise<Photo | null> {
  let objectUrl = "";
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.type.startsWith("image/") || blob.size > 25 * 1024 * 1024) return null;
    objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = objectUrl;
    await img.decode();
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { canvas, width: canvas.width, height: canvas.height };
  } catch {
    return null;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

// Środkowy kadr zdjęcia w proporcjach ramki (jak object-fit: cover).
function coverCrop(photo: Photo, frameW: number, frameH: number) {
  const target = frameW / frameH;
  let sw = photo.width;
  let sh = photo.height;
  if (sw / sh > target) sw = Math.round(sh * target);
  else sh = Math.round(sw / target);
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  canvas
    .getContext("2d")!
    .drawImage(photo.canvas, (photo.width - sw) / 2, (photo.height - sh) / 2, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/jpeg", 0.86);
}

// Numer telefonu z kierunkowym: polskie 9 cyfr → „+48 576 652 525”; inne numery bez zmian
// (z dodanym „+”, jeśli zaczynają się od kodu kraju).
export function formatPhone(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  const groups = (d: string) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  if (digits.length === 9 && !raw.startsWith("+")) return `+48 ${groups(digits)}`;
  if (digits.length === 11 && digits.startsWith("48")) return `+48 ${groups(digits.slice(2))}`;
  if (digits.length === 13 && digits.startsWith("0048")) return `+48 ${groups(digits.slice(4))}`;
  return raw.startsWith("+") || raw.startsWith("00") ? raw.replace(/^00/, "+") : raw;
}

export async function createOfferPdf({ offer, contact, publicUrl }: PdfInput) {
  const phone = formatPhone(contact.phone);
  const sources = imageUrls(offer.images).slice(0, MAX_PHOTOS);
  const [fonts, logo, photoResults] = await Promise.all([
    loadFonts(),
    loadCanvas(LOGO_SRC, 1100),
    Promise.all(sources.map((source) => loadCanvas(sameOriginImageUrl(source), 1800, "#ffffff"))),
  ]);
  const photos = photoResults.filter((photo): photo is Photo => photo !== null);

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true, putOnlyUsedFonts: true });
  fonts.forEach((font, index) => {
    const file = `NotoSans-${index ? "Bold" : "Regular"}.ttf`;
    doc.addFileToVFS(file, font);
    doc.addFont(file, "NotoSans", index ? "bold" : "normal");
  });
  const logoData = logo ? logo.canvas.toDataURL("image/png") : null;

  const type = propertyTypeLabel.pl[offer.type || ""] || offer.type || "Nieruchomość";
  const country = getCountryLabel(offer.country) || offer.country || "Hiszpania";
  const title = validTitleOrEmpty(offer.title) || `${type} — ${offer.town || offer.province || country}`;
  const reference = String(offer.ref || offer.external_id);
  const location = [...new Set([offer.town, offer.province, country].filter(Boolean))].join(" · ");
  const date = new Date().toLocaleDateString("pl-PL");

  doc.setProperties({ title, subject: `Oferta ${reference}`, author: "Onesta Group", creator: "Onesta Group" });

  let y = 0;
  const font = (size = 10, bold = false, color = INK) => {
    doc.setFont("NotoSans", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
  };
  const lineHeight = (size: number) => size * 0.42;
  const clean = (value: string) => value.replace(/ /g, " ");

  const drawLogo = (x: number, top: number, height: number, align: "left" | "right" = "left") => {
    if (logoData && logo) {
      const w = (logo.width / logo.height) * height;
      doc.addImage(logoData, "PNG", align === "right" ? x - w : x, top, w, height);
      return;
    }
    font(height * 1.6, true);
    doc.text("ONESTA", x, top + height * 0.8, { align });
  };

  // Nagłówek kolejnych stron: małe logo + numer oferty.
  const innerHeader = () => {
    drawLogo(MARGIN, 11, 8);
    font(8, false, MUTED);
    doc.text(`REF. ${reference}`, PAGE_W - MARGIN, 16.5, { align: "right" });
    doc.setDrawColor(LINE);
    doc.line(MARGIN, 24, PAGE_W - MARGIN, 24);
    y = 36;
  };
  const newPage = () => {
    doc.addPage();
    innerHeader();
  };
  const ensure = (height: number) => {
    if (y + height > BOTTOM) newPage();
  };
  const paragraph = (value: string, size = 10, color = MUTED, width = WIDTH, x = MARGIN) => {
    font(size, false, color);
    const lines: string[] = doc.splitTextToSize(clean(value), width);
    for (const line of lines) {
      ensure(lineHeight(size) + 1);
      font(size, false, color);
      doc.text(line, x, y);
      y += lineHeight(size) + 1.4;
    }
  };
  const sectionTitle = (eyebrow: string, label: string) => {
    ensure(24);
    font(7.5, true, GOLD);
    doc.text(eyebrow.toLocaleUpperCase("pl-PL"), MARGIN, y, { charSpace: 0.6 });
    y += 7;
    font(17, true);
    doc.text(label, MARGIN, y);
    y += 9;
  };

  // ---------- Strona 1: okładka ----------
  drawLogo(MARGIN, 11, 11);
  font(7.5, true, GOLD);
  doc.text("OFERTA PRZYGOTOWANA DLA CIEBIE", PAGE_W - MARGIN, 15, { align: "right", charSpace: 0.5 });
  font(8, false, MUTED);
  doc.text(date, PAGE_W - MARGIN, 20, { align: "right" });

  const heroTop = 30;
  const heroH = 118;
  if (photos[0]) {
    doc.addImage(coverCrop(photos[0], PAGE_W, heroH), "JPEG", 0, heroTop, PAGE_W, heroH);
  } else {
    doc.setFillColor(PAPER);
    doc.rect(0, heroTop, PAGE_W, heroH, "F");
    drawLogo(PAGE_W / 2 - 30, heroTop + heroH / 2 - 7, 14);
  }
  // Etykieta z numerem oferty na zdjęciu.
  font(8, true, "#ffffff");
  const refLabel = `REF. ${reference}`;
  const refW = doc.getTextWidth(refLabel) + 8;
  doc.setFillColor(INK);
  doc.roundedRect(MARGIN, heroTop + heroH - 13, refW, 7.5, 3.7, 3.7, "F");
  doc.text(refLabel, MARGIN + 4, heroTop + heroH - 7.9);
  if (offer.new_build) {
    const badge = "RYNEK PIERWOTNY";
    font(8, true, INK);
    const w = doc.getTextWidth(badge) + 8;
    doc.setFillColor(GOLD_LIGHT);
    doc.roundedRect(MARGIN + refW + 3, heroTop + heroH - 13, w, 7.5, 3.7, 3.7, "F");
    doc.text(badge, MARGIN + refW + 7, heroTop + heroH - 7.9);
  }

  y = heroTop + heroH + 12;
  font(8, true, GOLD);
  doc.text(type.toLocaleUpperCase("pl-PL"), MARGIN, y, { charSpace: 0.6 });
  y += 8;
  font(20, true);
  const titleLines: string[] = doc.splitTextToSize(clean(title), WIDTH - 60).slice(0, 3);
  titleLines.forEach((line) => {
    doc.text(line, MARGIN, y);
    y += 8.2;
  });
  font(10, false, MUTED);
  doc.text(doc.splitTextToSize(clean(location), WIDTH - 60)[0] || "", MARGIN, y);

  // Cena po prawej, na wysokości tytułu.
  let price = "Cena na zapytanie";
  if (offer.price != null && Number(offer.price) > 0) {
    const currency = (offer.currency || "EUR").toUpperCase();
    try {
      price = new Intl.NumberFormat("pl-PL", { style: "currency", currency, maximumFractionDigits: 0 })
        .format(Number(offer.price))
        .replace(/ /g, " ");
    } catch {
      price = `${Number(offer.price).toLocaleString("pl-PL")} ${currency}`;
    }
  }
  const priceTop = heroTop + heroH + 12;
  font(7.5, true, MUTED);
  doc.text(offer.new_build ? "CENA OD" : "CENA", PAGE_W - MARGIN, priceTop, { align: "right", charSpace: 0.5 });
  font(19, true, GOLD);
  doc.text(price, PAGE_W - MARGIN, priceTop + 9, { align: "right" });
  font(7.5, false, MUTED);
  doc.text("0% prowizji dla kupującego", PAGE_W - MARGIN, priceTop + 15, { align: "right" });

  // Parametry: tylko te, które są podane.
  y += 9;
  const num = (value: number | null | undefined, unit = "") =>
    value == null || !Number.isFinite(Number(value)) || Number(value) <= 0
      ? null
      : `${Number(value).toLocaleString("pl-PL").replace(/ /g, " ")}${unit}`;
  const facts = [
    ["Powierzchnia", num(offer.surface_built, " m²")],
    ["Sypialnie", num(offer.beds)],
    ["Łazienki", num(offer.baths)],
    ["Działka", num(offer.surface_plot, " m²")],
    ["Basen", offer.pool == null ? null : offer.pool ? "Tak" : "Nie"],
    ["Do morza", num(offer.distance_to_sea_m, " m")],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));
  if (facts.length) {
    const cols = Math.min(facts.length, 6);
    const gap = 3;
    const boxW = (WIDTH - gap * (cols - 1)) / cols;
    facts.slice(0, 6).forEach(([label, value], index) => {
      const x = MARGIN + index * (boxW + gap);
      doc.setFillColor(PAPER);
      doc.roundedRect(x, y, boxW, 18, 2.5, 2.5, "F");
      font(6.5, true, MUTED);
      doc.text(label.toLocaleUpperCase("pl-PL"), x + 4, y + 6.5, { charSpace: 0.3 });
      font(11.5, true);
      doc.text(value, x + 4, y + 13.5);
    });
    y += 25;
  }

  // Agent + link do oferty online.
  const contactRows = [contact.name, phone, contact.email].filter(Boolean);
  const cardTop = Math.max(y, 236);
  const cardH = 30;
  doc.setFillColor(INK);
  doc.roundedRect(MARGIN, cardTop, WIDTH, cardH, 3, 3, "F");
  font(7, true, GOLD_LIGHT);
  doc.text("TWÓJ AGENT ONESTA", MARGIN + 7, cardTop + 8, { charSpace: 0.5 });
  if (contactRows.length) {
    font(12, true, "#ffffff");
    doc.text(clean(contact.name || "Onesta Group"), MARGIN + 7, cardTop + 15.5);
    font(9, false, "#d9e1ec");
    doc.text([phone, contact.email].filter(Boolean).join("   ·   "), MARGIN + 7, cardTop + 22);
  } else {
    font(11, true, "#ffffff");
    doc.text("Onesta Group", MARGIN + 7, cardTop + 15.5);
    font(9, false, "#d9e1ec");
    doc.text("biuro@onesta.com.pl   ·   +48 576 652 525", MARGIN + 7, cardTop + 22);
  }
  if (publicUrl) {
    const label = "Zobacz ofertę online";
    font(9, true, INK);
    const w = doc.getTextWidth(label) + 12;
    const bx = PAGE_W - MARGIN - 7 - w;
    doc.setFillColor(GOLD_LIGHT);
    doc.roundedRect(bx, cardTop + 10, w, 10, 5, 5, "F");
    doc.textWithLink(label, bx + 6, cardTop + 16.6, { url: publicUrl });
  }

  // ---------- Strona 2: opis i udogodnienia ----------
  const description = descriptionValue(offer.descriptions);
  const features = featureValues(offer.features);
  if (description || features.length) {
    newPage();
    if (description) {
      sectionTitle("O nieruchomości", "Poznaj tę ofertę");
      for (const block of description.split(/\n\s*\n/)) {
        paragraph(block.trim(), 10);
        y += 3;
      }
    }
    if (features.length) {
      y += 4;
      sectionTitle("Wyposażenie", "Udogodnienia");
      const colW = (WIDTH - 6) / 2;
      // Polskie nazwy cech jak na stronie oferty; gdy słownik nie zna cechy — dotychczasowa etykieta.
      let labels: string[] = [];
      try {
        labels = normalizeFeatures(offer.features, "pl", offer).map((item: any) => clean(item.label));
      } catch {}
      if (!labels.length) labels = features.map((feature) => clean(featureLabel(feature)));
      for (let i = 0; i < labels.length; i += 2) {
        ensure(9);
        [labels[i], labels[i + 1]].forEach((label, col) => {
          if (!label) return;
          const x = MARGIN + col * (colW + 6);
          doc.setFillColor(GOLD);
          doc.circle(x + 1.5, y - 1.3, 0.9, "F");
          font(9.5, false, INK);
          doc.text(doc.splitTextToSize(label, colW - 6)[0], x + 5, y);
        });
        y += 7;
      }
    }
  }

  // ---------- Galeria ----------
  const gallery = photos.slice(1);
  if (gallery.length) {
    newPage();
    sectionTitle("Galeria", "Wnętrza i otoczenie");
    const gap = 4;
    const cellW = (WIDTH - gap) / 2;
    const cellH = cellW * 0.68;
    gallery.forEach((image, index) => {
      const col = index % 2;
      if (col === 0) ensure(cellH);
      const x = MARGIN + col * (cellW + gap);
      doc.addImage(coverCrop(image, cellW, cellH), "JPEG", x, y, cellW, cellH);
      if (col === 1 || index === gallery.length - 1) y += cellH + gap;
    });
  }

  // ---------- Stopka na każdej stronie ----------
  const pageCount = doc.getNumberOfPages();
  for (let index = 1; index <= pageCount; index++) {
    doc.setPage(index);
    doc.setDrawColor(LINE);
    doc.line(MARGIN, 276, PAGE_W - MARGIN, 276);
    // Dane agenta prowadzącego (gdy brak — kontakt do biura).
    const agentLine = contact.name || phone || contact.email
      ? [contact.name ? `Agent prowadzący: ${clean(contact.name)}` : "Agent prowadzący", phone, contact.email]
      : ["Onesta Group", "+48 576 652 525", "biuro@onesta.com.pl"];
    font(8, true, INK);
    doc.text(agentLine.filter(Boolean).join("   ·   "), MARGIN, 282);
    font(7, false, MUTED);
    doc.text("Onesta Group  ·  onesta.com.pl  ·  Ceny i dostępność mogą ulec zmianie.", MARGIN, 287.5);
    doc.text(`${index} / ${pageCount}`, PAGE_W - MARGIN, 287.5, { align: "right" });
  }
  return { doc, missingImages: sources.length - photos.length };
}

export async function downloadOfferPdf(input: PdfInput) {
  const { doc, missingImages } = await createOfferPdf(input);
  const ref =
    String(input.offer.ref || input.offer.external_id)
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .slice(0, 80) || "oferta";
  await doc.save(`Onesta-oferta-${ref}.pdf`, { returnPromise: true });
  return { missingImages };
}
