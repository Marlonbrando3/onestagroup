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
import { optimizedPropertyImageUrl } from "./propertyImages";

export type OfferPdfContact = { name: string; email: string; phone: string };
type PdfInput = {
  offer: AgentOffer;
  contact: OfferPdfContact;
  publicUrl?: string;
};
type Photo = { data: string; width: number; height: number };

const INK = "#182334";
const GOLD = "#9b7a36";
const MUTED = "#526173";
const PAPER = "#f4f1eb";
const MARGIN = 16;
const WIDTH = 178;
const BOTTOM = 270;

let fontsPromise: Promise<string[]> | undefined;
function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      ["Regular", "Bold"].map(async (weight) => {
        const response = await fetch(`/fonts/pdf/NotoSans-${weight}.ttf`, {
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok)
          throw new Error(
            "Nie udało się załadować czcionek PDF. Spróbuj ponownie.",
          );
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = "";
        for (let i = 0; i < bytes.length; i += 8192) {
          binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
        }
        return btoa(binary);
      }),
    ).catch(() => {
      fontsPromise = undefined;
      throw new Error(
        "Nie udało się załadować czcionek PDF. Spróbuj ponownie.",
      );
    });
  }
  return fontsPromise;
}

async function loadPhoto(source: string): Promise<Photo | null> {
  let objectUrl = "";
  try {
    // Use the existing allow-listed proxy: no cross-origin canvas or arbitrary server fetches.
    const response = await fetch(optimizedPropertyImageUrl(source), {
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return null;
    const blob = await response.blob();
    if (blob.size > 25 * 1024 * 1024) return null;
    objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = objectUrl;
    await img.decode();
    const scale = Math.min(
      1,
      1600 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return {
      data: canvas.toDataURL("image/jpeg", 0.85),
      width: canvas.width,
      height: canvas.height,
    };
  } catch {
    return null;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

export async function createOfferPdf({ offer, contact, publicUrl }: PdfInput) {
  const sources = imageUrls(offer.images).slice(0, 7);
  const [fonts, photoResults] = await Promise.all([
    loadFonts(),
    // At most seven images per brochure keeps downloads practical on mobile.
    Promise.all(sources.map(loadPhoto)),
  ]);
  const photos = photoResults.filter((photo): photo is Photo => photo !== null);
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
  });
  fonts.forEach((font, index) => {
    const file = `NotoSans-${index ? "Bold" : "Regular"}.ttf`;
    doc.addFileToVFS(file, font);
    doc.addFont(file, "NotoSans", index ? "bold" : "normal");
  });
  const type =
    propertyTypeLabel.pl[offer.type || ""] || offer.type || "Nieruchomość";
  const country =
    getCountryLabel(offer.country) || offer.country || "Hiszpania";
  const title =
    validTitleOrEmpty(offer.title) ||
    `${type} - ${offer.town || offer.province || country}`;
  const reference = String(offer.ref || offer.external_id);
  const date = new Date().toLocaleDateString("pl-PL");
  doc.setFont("NotoSans", "normal");
  doc.setFontSize(10);
  const contactLines = [contact.name, contact.phone, contact.email]
    .filter(Boolean)
    .flatMap((value) => doc.splitTextToSize(value, WIDTH - 12) as string[]);
  const contactHeight = contactLines.length ? 13 + contactLines.length * 5 : 0;
  doc.setProperties({
    title,
    subject: `Oferta ${reference}`,
    author: "Onesta Group",
    creator: "Onesta Group",
  });
  let y = 0;

  function font(size = 10, bold = false, color = INK) {
    doc.setFont("NotoSans", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
  }
  function page(add = true) {
    if (add) doc.addPage();
    doc.setFillColor(INK);
    doc.rect(0, 0, 210, 3, "F");
    font(17, true);
    doc.text("ONESTA", MARGIN, 18);
    font(7, false, GOLD);
    doc.text("G R O U P", MARGIN, 23);
    font(8, false, MUTED);
    doc.text("NIERUCHOMOŚCI WYBRANE DLA CIEBIE", 194, 18, { align: "right" });
    doc.setDrawColor("#ddd3c4");
    doc.line(MARGIN, 28, 194, 28);
    y = 39;
  }
  function space(height: number) {
    if (y + height > BOTTOM) page();
  }
  function text(
    value: string,
    size = 10,
    bold = false,
    color = INK,
    width = WIDTH,
  ) {
    font(size, bold, color);
    const lines: string[] = doc.splitTextToSize(
      value.replace(/\u00a0/g, " "),
      width,
    );
    const lineHeight = size * 0.48;
    for (const line of lines) {
      space(lineHeight);
      font(size, bold, color);
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
  }
  function heading(label: string) {
    space(20);
    y += 3;
    text(label, 17, true);
    y += 5;
  }
  function photo(
    image: Photo,
    x: number,
    top: number,
    width: number,
    height: number,
  ) {
    // Fit the complete photograph instead of cutting off rooms or floor plans.
    doc.setFillColor(PAPER);
    doc.rect(x, top, width, height, "F");
    const scale = Math.min(width / image.width, height / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    doc.addImage(
      image.data,
      "JPEG",
      x + (width - w) / 2,
      top + (height - h) / 2,
      w,
      h,
    );
  }

  page(false);
  text(
    `${type.toLocaleUpperCase("pl-PL")}  /  REF. ${reference}`,
    8,
    true,
    GOLD,
  );
  y += 3;
  text(title, 22, true);
  y += 1;
  text(
    [...new Set([offer.town, offer.province, country].filter(Boolean))].join(
      " · ",
    ),
    10,
    false,
    MUTED,
  );
  y += 4;
  let price = "Cena na zapytanie";
  if (offer.price != null && Number(offer.price) > 0) {
    const currency = (offer.currency || "EUR").toUpperCase();
    try {
      price = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number(offer.price));
    } catch {
      price = `${Number(offer.price).toLocaleString("pl-PL")} ${currency}`;
    }
  }
  text(price, 22, true, GOLD);
  y += 4;
  // Adapt the hero to longer titles while keeping the agent and link together.
  const heroHeight = Math.max(
    42,
    Math.min(
      80,
      BOTTOM -
        y -
        7 -
        49 -
        (contactHeight ? contactHeight + 7 : 0) -
        (publicUrl ? 10 : 0),
    ),
  );
  space(heroHeight + 7);
  if (photos[0]) photo(photos[0], MARGIN, y, WIDTH, heroHeight);
  else {
    doc.setFillColor(PAPER);
    doc.rect(MARGIN, y, WIDTH, heroHeight, "F");
    font(13, false, MUTED);
    doc.text("Zdjęcia dostępne u agenta", 105, y + heroHeight / 2, {
      align: "center",
    });
  }
  y += heroHeight + 7;

  const number = (value: number | null, unit = "") =>
    value == null
      ? "Brak danych"
      : `${Number(value).toLocaleString("pl-PL")}${unit}`;
  const facts = [
    ["POWIERZCHNIA", number(offer.surface_built, " m²")],
    ["SYPIALNIE", number(offer.beds)],
    ["ŁAZIENKI", number(offer.baths)],
    ["DZIAŁKA", number(offer.surface_plot, " m²")],
    ["BASEN", offer.pool == null ? "Brak danych" : offer.pool ? "Tak" : "Nie"],
    ["DO MORZA", number(offer.distance_to_sea_m, " m")],
  ];
  space(42);
  facts.forEach(([label, value], index) => {
    const x = MARGIN + (index % 3) * 60;
    const top = y + Math.floor(index / 3) * 21;
    doc.setFillColor(PAPER);
    doc.roundedRect(x, top, 58, 19, 2, 2, "F");
    font(7, true, MUTED);
    doc.text(label, x + 4, top + 6);
    font(11, true);
    doc.text(value, x + 4, top + 14);
  });
  y += 49;

  if (contactHeight) {
    const height = contactHeight;
    space(height + 7 + (publicUrl ? 10 : 0));
    doc.setFillColor(INK);
    doc.roundedRect(MARGIN, y, WIDTH, height, 2, 2, "F");
    font(7, true, "#d6b66f");
    doc.text("TWÓJ AGENT ONESTA", MARGIN + 6, y + 7);
    font(10, false, "#ffffff");
    contactLines.forEach((line, i) =>
      doc.text(line, MARGIN + 6, y + 14 + i * 5),
    );
    y += height + 7;
  }
  if (publicUrl) {
    space(10);
    font(9, true, GOLD);
    doc.textWithLink("Zobacz ofertę online i pełną galerię", MARGIN, y, {
      url: publicUrl,
    });
    y += 8;
  }

  const description = descriptionValue(offer.descriptions);
  const features = featureValues(offer.features);
  if (description || features.length) {
    page();
    if (description) {
      heading("Poznaj nieruchomość");
      for (const paragraph of description.split(/\n\s*\n/)) {
        text(paragraph, 10, false, MUTED);
        y += 3;
      }
    }
    if (features.length) {
      heading("Wyposażenie i udogodnienia");
      for (const feature of features) {
        text(`• ${featureLabel(feature)}`, 10, false, MUTED);
        y += 1;
      }
    }
  }

  if (photos.length > 1) {
    page();
    heading("Wnętrza i otoczenie");
    const top = y;
    photos.slice(1).forEach((image, index) => {
      const x = MARGIN + (index % 2) * 91;
      const imageY = top + Math.floor(index / 2) * 69;
      photo(image, x, imageY, 87, 61);
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let index = 1; index <= pageCount; index++) {
    doc.setPage(index);
    doc.setDrawColor("#ddd3c4");
    doc.line(MARGIN, 278, 194, 278);
    font(7, false, MUTED);
    doc.text(
      "Ceny i dostępność mogą ulec zmianie. Potwierdź aktualne warunki u agenta.",
      MARGIN,
      283,
    );
    const shortRef =
      reference.length > 45 ? `${reference.slice(0, 42)}...` : reference;
    doc.text(`ONESTA GROUP  ·  ${shortRef}  ·  ${date}`, MARGIN, 289);
    doc.text(`${index} / ${pageCount}`, 194, 289, { align: "right" });
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
