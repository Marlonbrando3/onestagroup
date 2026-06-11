export type PropertyCountryOption = {
  label: string;
  slug: string;
  dbValues: string[];
};

export const PROPERTY_COUNTRY_OPTIONS: PropertyCountryOption[] = [
  {
    label: "Cypr",
    slug: "cypr",
    dbValues: ["Cypr", "CYPR", "cypr", "Cyprus", "CYPRUS", "cyprus"],
  },
  {
    label: "Hiszpania",
    slug: "hiszpania",
    dbValues: [
      "Hiszpania",
      "HISZPANIA",
      "hiszpania",
      "Spain",
      "SPAIN",
      "spain",
      "Espana",
      "ESPANA",
      "espana",
      "España",
      "ESPAÑA",
      "españa",
    ],
  },
  {
    label: "Tajlandia",
    slug: "tajlandia",
    dbValues: [
      "Tajlandia",
      "TAJLANDIA",
      "tajlandia",
      "Thailand",
      "THAILAND",
      "thailand",
    ],
  },
];

export function normalizeCountrySlug(value: string | null | undefined) {
  const raw = String(value || "hiszpania")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return (
    PROPERTY_COUNTRY_OPTIONS.find(
      (option) =>
        option.slug === raw ||
        option.label
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ł/g, "l") === raw,
    )?.slug || "hiszpania"
  );
}

export function getPropertyCountryOption(value: string | null | undefined) {
  const slug = normalizeCountrySlug(value);
  return (
    PROPERTY_COUNTRY_OPTIONS.find((option) => option.slug === slug) ||
    PROPERTY_COUNTRY_OPTIONS[1]
  );
}
