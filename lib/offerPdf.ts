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
import { agencySteps } from "@/data/polishAgency";
import { formatPhone } from "./phone";

export { formatPhone };

// Broszura PDF oferty (prezentacja klienta / panel agenta).
// Strona 1: logo, duże zdjęcie, tytuł, cena, parametry, udogodnienia. Strona 2: opis.
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

// Teksty jak na /polskie-biuro-nieruchomosci-w-hiszpanii (atuty z nagłówka i sekcja „Jasne zasady”).
const AGENCY_FACTS = [
  "Na rynku od 2018 roku",
  "Pełna obsługa w języku polskim",
  "Współpracujący prawnicy, notariusze i tłumacze",
  "Bezpośrednia współpraca z deweloperami",
  "Biura w Polsce i w Hiszpanii",
  "0% prowizji dla kupującego",
  "Prowadzenie zakupu od A do Z",
  "Umeblowanie apartamentu i zarządzanie wynajmem",
];
const COST_POINTS = [
  ["Nie pobieramy prowizji za pośrednictwo w zakupie nieruchomości.", "Nasze wynagrodzenie pokrywa sprzedający, deweloper lub partner."],
  ["Oddzielnie ustalamy zakres i koszty usług dodatkowych,", "takich jak obsługa prawna, tłumaczenia, wyposażenie lub zarządzanie po zakupie."],
  ["Cena z ogłoszenia nie jest całkowitym budżetem.", "Uwzględniamy podatki i opłaty związane z zakupem oraz przyszłe wydatki: wspólnotę, media, ubezpieczenie i utrzymanie. Koszty zależą od regionu, rynku pierwotnego lub wtórnego i konkretnej transakcji."],
];

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
  // Numer oferty z naszej bazy (MTI-…), nie numer z feedu XML.
  const reference = String(offer.external_id || offer.ref);
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

  // Udogodnienia (zamiast karty agenta — agent jest w stopce i na ostatniej stronie).
  // Polskie nazwy ze wspólnego słownika cech; co nie zmieści się na okładce, idzie na stronę 2.
  const features = featureValues(offer.features);
  let featureLabels: string[] = [];
  try {
    featureLabels = normalizeFeatures(offer.features, "pl", offer).map((item: any) => clean(item.label));
  } catch {}
  if (!featureLabels.length) featureLabels = features.map((feature) => clean(featureLabel(feature)));

  // Rozmiar pastylek dobierany niżej tak, żeby wszystkie udogodnienia zmieściły się na okładce.
  let PILL_H = 8.5;
  let PILL_FONT = 9;
  const PILL_GAP = 2.5;
  // Rysuje pastylki od bieżącego y aż do `limit`; zwraca etykiety, które się nie zmieściły.
  const drawPills = (labels: string[], limit: number) => {
    let x = MARGIN;
    let rowTop = y;
    for (let index = 0; index < labels.length; index++) {
      font(PILL_FONT, false, INK);
      const label = labels[index];
      const w = Math.min(doc.getTextWidth(label) + PILL_H + 4.5, WIDTH);
      if (x + w > MARGIN + WIDTH) {
        x = MARGIN;
        rowTop += PILL_H + PILL_GAP;
      }
      if (rowTop + PILL_H > limit) {
        y = rowTop;
        return labels.slice(index);
      }
      doc.setFillColor(PAPER);
      doc.roundedRect(x, rowTop, w, PILL_H, PILL_H / 2, PILL_H / 2, "F");
      doc.setFillColor(GOLD);
      doc.circle(x + PILL_H / 2 + 0.8, rowTop + PILL_H / 2, 0.9, "F");
      doc.text(label, x + PILL_H / 2 + 4.3, rowTop + PILL_H / 2 + PILL_FONT * 0.14);
      x += w + PILL_GAP;
    }
    y = rowTop + PILL_H;
    return [] as string[];
  };


  // Ile rzędów pastylek zajmą etykiety przy danym rozmiarze czcionki.
  const pillRows = (labels: string[], size: number, height: number) => {
    let rows = labels.length ? 1 : 0;
    let x = MARGIN;
    labels.forEach((label) => {
      font(size, false, INK);
      const w = Math.min(doc.getTextWidth(label) + height + 4.5, WIDTH);
      if (x + w > MARGIN + WIDTH) {
        rows += 1;
        x = MARGIN;
      }
      x += w + PILL_GAP;
    });
    return rows;
  };

  // ---------- Strona 1: okładka ----------
  drawLogo(MARGIN, 11, 11);
  font(7.5, true, GOLD);
  doc.text("OFERTA PRZYGOTOWANA DLA CIEBIE", PAGE_W - MARGIN, 15, { align: "right", charSpace: 0.5 });
  font(8, false, MUTED);
  doc.text(date, PAGE_W - MARGIN, 20, { align: "right" });

  const heroTop = 30;
  // Wysokość zdjęcia: domyślnie 118 mm, mniejsza, gdy udogodnień jest dużo — wszystkie mają być na okładce.
  font(20, true);
  const titleLineCount = Math.min(3, doc.splitTextToSize(clean(title), WIDTH - 60).length);
  const hasFacts = [offer.surface_built, offer.beds, offer.baths, offer.surface_plot, offer.distance_to_sea_m, offer.pool]
    .some((value) => value != null && (typeof value === "boolean" || Number(value) > 0));
  const textBlockH = 12 + 8 + titleLineCount * 8.2 + 9 + (hasFacts ? 25 : 0);
  const pillsBlockH = (rows: number) => (rows ? 4 + 7 + 6 + rows * (PILL_H + PILL_GAP) - PILL_GAP : 0);
  const MIN_HERO = 72;
  const heroFor = () =>
    Math.min(118, BOTTOM - heroTop - textBlockH - pillsBlockH(pillRows(featureLabels, PILL_FONT, PILL_H)));
  if (heroFor() < MIN_HERO) {
    PILL_FONT = 8;
    PILL_H = 7.5;
  }
  if (heroFor() < MIN_HERO) {
    PILL_FONT = 7.5;
    PILL_H = 7;
  }
  const heroH = Math.max(MIN_HERO, Math.floor(heroFor()));
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

  let restFeatures: string[] = [];
  if (featureLabels.length) {
    y = Math.max(y + 4, 0);
    font(7.5, true, GOLD);
    doc.text("WYPOSAŻENIE I UDOGODNIENIA", MARGIN, y, { charSpace: 0.6 });
    y += 7;
    font(15, true);
    doc.text("Udogodnienia", MARGIN, y);
    y += 6;
    restFeatures = drawPills(featureLabels, BOTTOM);
  }

  // ---------- Strona 2: opis (i udogodnienia, które nie zmieściły się na okładce) ----------
  const description = descriptionValue(offer.descriptions);
  if (description || restFeatures.length) {
    newPage();
    if (description) {
      sectionTitle("O nieruchomości", "Poznaj tę ofertę");
      for (const block of description.split(/\n\s*\n/)) {
        paragraph(block.trim(), 10);
        y += 3;
      }
    }
    if (restFeatures.length) {
      y += 4;
      sectionTitle("Wyposażenie", "Udogodnienia (cd.)");
      let rest = restFeatures;
      while (rest.length) {
        rest = drawPills(rest, BOTTOM);
        if (rest.length) newPage();
      }
    }
  }

  // ---------- Galeria ----------
  const gallery = photos.slice(1);
  if (gallery.length) {
    const gap = 4;
    const cellW = (WIDTH - gap) / 2;
    const cellH = cellW * 0.68;
    // Galeria zaczyna się zaraz pod opisem, jeśli na stronie mieści się nagłówek i pierwszy rząd zdjęć —
    // bez pustych 2/3 strony po dłuższym opisie. Na okładce (strona 1) zawsze od nowej strony.
    const onTextPage = doc.getNumberOfPages() > 1;
    if (onTextPage && y + 8 + 16 + cellH <= BOTTOM) {
      y += 8;
    } else {
      newPage();
    }
    sectionTitle("Galeria", "Wnętrza i otoczenie");
    gallery.forEach((image, index) => {
      const col = index % 2;
      if (col === 0) ensure(cellH);
      const x = MARGIN + col * (cellW + gap);
      doc.addImage(coverCrop(image, cellW, cellH), "JPEG", x, y, cellW, cellH);
      if (col === 1 || index === gallery.length - 1) y += cellH + gap;
    });
  }

  // Akapit z pogrubionym początkiem (np. „Nie pobieramy prowizji…” + reszta zdania).
  const leadParagraph = (lead: string, rest: string, x: number, width: number) => {
    font(10, true, INK);
    const words = `${lead} ${rest}`.split(" ");
    const leadCount = lead.split(" ").length;
    let line: { text: string; bold: boolean }[] = [];
    let lineW = 0;
    const flush = () => {
      ensure(6);
      let cx = x;
      line.forEach((part) => {
        font(10, part.bold, part.bold ? INK : MUTED);
        doc.text(part.text, cx, y);
        cx += doc.getTextWidth(part.text);
      });
      y += 5.6;
      line = [];
      lineW = 0;
    };
    words.forEach((word, index) => {
      const bold = index < leadCount;
      font(10, bold);
      const piece = (line.length ? " " : "") + word;
      const w = doc.getTextWidth(piece);
      if (lineW + w > width && line.length) {
        flush();
        line.push({ text: word, bold });
        font(10, bold);
        lineW = doc.getTextWidth(word);
      } else {
        line.push({ text: piece, bold });
        lineW += w;
      }
    });
    if (line.length) flush();
  };

  // ---------- O Onesta: atuty + zasady prowizji ----------
  newPage();
  sectionTitle("Poznaj Onesta Group", "Dlaczego warto kupować z nami");
  {
    const gap = 4;
    const colW = (WIDTH - gap) / 2;
    const boxH = 13;
    AGENCY_FACTS.forEach((fact, index) => {
      const col = index % 2;
      const x = MARGIN + col * (colW + gap);
      const top = y + Math.floor(index / 2) * (boxH + 3);
      doc.setFillColor(PAPER);
      doc.roundedRect(x, top, colW, boxH, 2.5, 2.5, "F");
      doc.setFillColor(GOLD);
      doc.circle(x + 6, top + boxH / 2, 1.3, "F");
      font(9.5, index === 0 || index === 5, INK);
      const factLines: string[] = doc.splitTextToSize(fact, colW - 15);
      const firstY = top + boxH / 2 + 1.2 - ((factLines.length - 1) * 4) / 2;
      factLines.forEach((line, lineIndex) => doc.text(line, x + 11, firstY + lineIndex * 4));
    });
    y += Math.ceil(AGENCY_FACTS.length / 2) * (boxH + 3) + 10;
  }
  ensure(60);
  font(7.5, true, GOLD);
  doc.text("JASNE ZASADY", MARGIN, y, { charSpace: 0.6 });
  y += 8;
  font(16, true, INK);
  const costLead = "Prowizja od sprzedaży przy współpracy z Onesta wynosi ";
  doc.text(costLead, MARGIN, y);
  y += 9;
  font(26, true, GOLD);
  doc.text("0 zł", MARGIN, y);
  const zeroW = doc.getTextWidth("0 zł ");
  font(16, true, INK);
  doc.text("dla kupującego.", MARGIN + zeroW, y);
  y += 10;
  COST_POINTS.forEach(([lead, rest]) => {
    ensure(12);
    doc.setFillColor(GOLD);
    doc.circle(MARGIN + 1.5, y - 1.4, 1, "F");
    leadParagraph(lead, rest, MARGIN + 6, WIDTH - 6);
    y += 2.5;
  });

  // ---------- Ścieżka zakupu ----------
  newPage();
  sectionTitle("Jak pomagamy", "Od pierwszej rozmowy do odbioru kluczy");
  paragraph(
    "Wiesz, na jakim etapie jesteś, co porównujemy i kto zajmuje się kolejnymi sprawami. Przez cały proces masz polskojęzyczną obsługę Onesta.",
    10,
  );
  y += 4;
  agencySteps.forEach(({ title: stepTitle, text: stepText }, index) => {
    font(8.5, false, MUTED);
    const lines: string[] = doc.splitTextToSize(clean(stepText), WIDTH - 16);
    const blockH = 5.5 + lines.length * 3.8 + 2.5;
    ensure(blockH);
    const top = y;
    // Numer w kółku i linia łącząca kroki.
    if (index < agencySteps.length - 1) {
      doc.setDrawColor(LINE);
      doc.line(MARGIN + 5, top + 5, MARGIN + 5, top + blockH);
    }
    doc.setFillColor(INK);
    doc.circle(MARGIN + 5, top, 4.5, "F");
    font(8, true, GOLD_LIGHT);
    doc.text(`0${index + 1}`, MARGIN + 5, top + 1.4, { align: "center" });
    font(10.5, true, INK);
    doc.text(stepTitle, MARGIN + 15, top + 1.6);
    font(8.5, false, MUTED);
    let ly = top + 6.8;
    lines.forEach((line) => {
      doc.text(line, MARGIN + 15, ly);
      ly += 3.8;
    });
    y = top + blockH;
  });

  // ---------- Kontakt na koniec ----------
  const finalH = 40;
  ensure(finalH + 4);
  y += 3;
  doc.setFillColor(INK);
  doc.roundedRect(MARGIN, y, WIDTH, finalH, 3, 3, "F");
  font(7.5, true, GOLD_LIGHT);
  doc.text("Porozmawiajmy o tej ofercie".toLocaleUpperCase("pl-PL"), MARGIN + 8, y + 8.5, { charSpace: 0.6 });
  font(15, true, "#ffffff");
  doc.text(clean(contact.name || "Onesta Group"), MARGIN + 8, y + 16.5);
  font(8, false, GOLD_LIGHT);
  doc.text(contact.name ? "Agent prowadzący · Onesta Group" : "Biuro Onesta Group", MARGIN + 8, y + 21.5);
  font(10.5, true, "#ffffff");
  const phoneText = phone || "+48 576 652 525";
  doc.text(phoneText, MARGIN + 8, y + 29);
  const phoneW = doc.getTextWidth(phoneText);
  font(10, false, "#d9e1ec");
  doc.text(`·   ${contact.email || "biuro@onesta.com.pl"}`, MARGIN + 8 + phoneW + 3, y + 29);
  font(8, false, "#aeb9c8");
  doc.text("Biura: Opole, ul. Niemodlińska 58a  ·  San Javier, Calle Abel 19  ·  onesta.com.pl", MARGIN + 8, y + 35);
  if (publicUrl) {
    const label = "Zobacz ofertę online";
    font(9, true, INK);
    const w = doc.getTextWidth(label) + 12;
    const bx = PAGE_W - MARGIN - 8 - w;
    doc.setFillColor(GOLD_LIGHT);
    doc.roundedRect(bx, y + 11, w, 10, 5, 5, "F");
    doc.textWithLink(label, bx + 6, y + 17.6, { url: publicUrl });
  }
  y += finalH;

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
    String(input.offer.external_id || input.offer.ref)
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .slice(0, 80) || "oferta";
  await doc.save(`Onesta-oferta-${ref}.pdf`, { returnPromise: true });
  return { missingImages };
}
