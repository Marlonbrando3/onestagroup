import { isAllowedPropertyImageUrl } from "./propertyImageSources";
const FALLBACK_PROPERTY_IMAGE = "/placeholder.jpg";
const PROPERTY_IMAGE_PROXY_VERSION = "2";

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

export function optimizedPropertyImageUrl(image: unknown): string {
  const sourceUrl = propertyImageUrl(image);

  if (sourceUrl.startsWith("https://") || sourceUrl.startsWith("http://")) {
    // Allow-listed hosts go straight to next/image (Netlify Image CDN, no function call).
    // Anything else keeps the old proxy, which rejects it and the card falls back to a plain <img>.
    try {
      if (isAllowedPropertyImageUrl(new URL(sourceUrl))) return sourceUrl;
    } catch {}
    return `/api/property-image?url=${encodeURIComponent(sourceUrl)}&v=${PROPERTY_IMAGE_PROXY_VERSION}`;
  }

  return sourceUrl;
}
