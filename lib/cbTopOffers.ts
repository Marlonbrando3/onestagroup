export const CBTOP_SOURCE_PRESENTATION_TOKEN =
  "E7uM5XiSJYDMhesEXq0T-Pqk";

export const CBTOP_PROPERTY_IDS = [
  "MTI-2600-115-10-115",
  "MTI-1719-115-10-115",
  "MTI-1503-87-10-115",
  "MTI-2257-115-10-115",
  "MTI-3236-115-10-115",
  "MTI-3237-115-10-115",
  "MTI-3231-115-10-115",
  "MTI-2433-115-10-115",
  "MTI-3225-115-10-115",
  "MTI-3196-115-10-115",
  "MTI-3202-115-10-115",
  "MTI-994-115-10-115",
  "MTI-1874-115-10-115",
  "MTI-1271-87-10-115",
  "MTI-2631-115-10-115",
  "MTI-3126-115-10-115",
  "MTI-1412-87-10-115",
  "MTI-3210-115-10-115",
  "MTI-3139-115-10-115",
  "MTI-3049-115-10-115",
] as const;

const CBTOP_PROPERTY_ID_SET = new Set<string>(CBTOP_PROPERTY_IDS);

export function isCbTopPropertyId(value: unknown): value is string {
  return CBTOP_PROPERTY_ID_SET.has(String(value || "").trim());
}
