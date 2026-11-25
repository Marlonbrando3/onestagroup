import { isAllowedPropertyImageUrl } from "./propertyImageSources";
const FALLBACK_PROPERTY_IMAGE = "/placeholder.jpg";

export function propertyImageUrl(
  image: unknown,
  fallback = FALLBACK_PROPERTY_IMAGE,
): string {
  const candidate =
    typeof image === "string"
      ? image
      : image && typeof image === "object"
        ? String(
            (image as Record<string, unknown>).url ||
              (image as Record<string, unknown>).src ||
              "",
          )
        : "";
  const normalized = candidate.trim();

  if (
    normalized.startsWith("/") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("http://")
  ) {
    return normalized;
  }

  return fallback;
}

// Czy zdjęcie może iść przez optymalizację (Netlify Image CDN)? Tak dla plików lokalnych
// i hostów z listy (lib/propertyImageSources.ts + netlify.toml). Zdjęcia z innych serwerów
// (np. nowa agencja w feedzie) pokazujemy bez optymalizacji, prosto ze źródła — od razu, bez mrugania.
export function isOptimizedPropertyImage(image: unknown): boolean {
  const sourceUrl = propertyImageUrl(image);
  if (!(sourceUrl.startsWith("https://") || sourceUrl.startsWith("http://"))) return true;
  try {
    return isAllowedPropertyImageUrl(new URL(sourceUrl));
  } catch {
    return false;
  }
}

export function optimizedPropertyImageUrl(image: unknown): string {
  // Hosty z listy idą do next/image (Netlify Image CDN), pozostałe zwracamy bez zmian —
  // komponent ustawia wtedy `unoptimized` (patrz isOptimizedPropertyImage).
  return propertyImageUrl(image);
}
