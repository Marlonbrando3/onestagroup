export function featureLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const labels: Record<string, string> = {
    "air-conditioning": "Klimatyzacja",
    "air conditioning": "Klimatyzacja",
    "private-pool": "Prywatny basen",
    "private pool": "Prywatny basen",
    "swimming-pool": "Basen",
    "swimming pool": "Basen",
    "community-pool": "Basen wspólnotowy",
    elevator: "Winda",
    garden: "Ogród",
    terrace: "Taras",
    solarium: "Solarium",
    garage: "Garaż",
    "private-parking": "Prywatny parking",
    "underground-parking": "Parking podziemny",
    "sea-view": "Widok na morze",
    "sea views": "Widok na morze",
    "mountain-views": "Widok na góry",
    "built-in-closets": "Szafy w zabudowie",
    "storage-room": "Pomieszczenie gospodarcze",
    "video-door-entry": "Wideodomofon",
    gym: "Siłownia",
    spa: "Spa",
    sauna: "Sauna",
    playground: "Plac zabaw",
  };

  if (labels[normalized]) return labels[normalized];
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function imageUrls(value: unknown): string[] {
  let normalized = value;
  if (typeof normalized === "string") {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      normalized = [normalized];
    }
  }

  if (!Array.isArray(normalized)) return [];
  return Array.from(
    new Set(
      normalized
        .map((image: any) =>
          typeof image === "string" ? image : image?.url || image?.src || "",
        )
        .map((url) => String(url || "").trim())
        .filter(Boolean),
    ),
  );
}

export function featureValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(value.map((item) => String(item || "").trim()).filter(Boolean)),
    );
  }
  if (value && typeof value === "object") {
    const nested = (value as Record<string, unknown>).feature;
    return featureValues(nested);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export function descriptionValue(value: unknown): string {
  let raw = "";
  if (typeof value === "string") raw = value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const descriptions = value as Record<string, unknown>;
    raw = String(
      descriptions.pl ||
        descriptions.en ||
        Object.values(descriptions).find((item) => typeof item === "string") ||
        "",
    );
  }

  return raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li\s*>/gi, "")
    .replace(/<\/(p|div|h[1-6])\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
