export const PROVINCE_TO_COAST: Record<string, string> = {
  Alicante: "Costa Blanca",
  Alacant: "Costa Blanca",
  Malaga: "Costa del Sol",
  Málaga: "Costa del Sol",
  Murcia: "Costa Calida",
  Almería: "Costa de Almeria",
  Almeria: "Costa de Almeria",
  "Costa Blanca": "Costa Blanca",
  "Costa del Sol": "Costa del Sol",
  "Costa Calida": "Costa Calida",
  "Costa de Almeria": "Costa de Almeria",
  "Cypr Południowy": "Cypr Południowy",
  Samana: "Samana",
  Samaná: "Samana",
};

export const REGION_MAP: Record<any, string[]> = Object.fromEntries(
  Object.entries(PROVINCE_TO_COAST).map(([province, coast]) => [province, [coast]]),
);

export const COUNTRY_MAP: Record<any, string[]> = {
  Spain: ["Hiszpania"],
  Hiszpania: ["Hiszpania"],
  Cypr: ["Cypr"],
  Cyprus: ["Cypr"],
  Dominikana: ["Dominikana"],
  "Dominican Republic": ["Dominikana"],
  Portugalia: ["Portugalia"],
};

export function getCoastLabelFromProvince(province?: unknown) {
  const value = String(province || "").trim();
  if (!value) return "";
  const exactMatch = PROVINCE_TO_COAST[value];
  if (exactMatch) return exactMatch;

  const normalizedValue = value.toLowerCase();
  const normalizedMatch = Object.entries(PROVINCE_TO_COAST).find(
    ([key]) => key.toLowerCase() === normalizedValue,
  );
  return normalizedMatch?.[1] || value;
}

export function getCountryLabel(country?: unknown) {
  const value = String(country || "").trim();
  if (!value) return "";
  const exactMatch = COUNTRY_MAP[value]?.[0];
  if (exactMatch) return exactMatch;

  const normalizedValue = value.toLowerCase();
  const normalizedMatch = Object.entries(COUNTRY_MAP).find(
    ([key]) => key.toLowerCase() === normalizedValue,
  );
  return normalizedMatch?.[1]?.[0] || value;
}
