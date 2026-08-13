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
