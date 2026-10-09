import locations from "@/data/locations.json";
import { getCanonicalLocations, normalizeLocationName, type LocationEntry } from "./locations";
import type { SiteLocale } from "./i18n";

// Descriptive offer titles built ONLY from structured feed fields (type, beds, features,
// distance_to_sea_m). No free-text interpretation, so every claim is backed by data:
//   "Nowy bungalow z 2 sypialniami i prywatnym basenem w San Pedro del Pinatar – 800 m od plaży"
// Deterministic: the same record always yields the same title. URLs do NOT use this title.

type Gender = "m" | "f";
type Noun = { pl: string; gender: Gender; en: string; apartmentLike?: boolean };

const NOUNS: [RegExp, Noun][] = [
  [/penthouse/i, { pl: "penthouse", gender: "m", en: "penthouse", apartmentLike: true }],
  [/villa|willa/i, { pl: "willa", gender: "f", en: "villa" }],
  [/town ?house|townhouse|szeregow/i, { pl: "dom szeregowy", gender: "m", en: "townhouse" }],
  [/semi.?detached/i, { pl: "dom w zabudowie bliźniaczej", gender: "m", en: "semi-detached house" }],
  [/quad/i, { pl: "dom typu quad", gender: "m", en: "quad house" }],
  [/bungalow/i, { pl: "bungalow", gender: "m", en: "bungalow" }],
  [/finca|posiadło/i, { pl: "posiadłość", gender: "f", en: "country estate" }],
  [/country house|casas|house|dom/i, { pl: "dom", gender: "m", en: "house" }],
  [/apartment|apartament|flat|studio/i, { pl: "apartament", gender: "m", en: "apartment", apartmentLike: true }],
];
const FALLBACK: Noun = { pl: "nieruchomość", gender: "f", en: "property" };

function nounFor(type: unknown): Noun {
  const t = String(type || "");
  return NOUNS.find(([re]) => re.test(t))?.[1] || FALLBACK;
}

const canonicalTownNames = new Map(
  getCanonicalLocations(locations as LocationEntry[])
    .filter((l) => l.type === "town" || l.type === "city")
    .map((l) => [normalizeLocationName(l.name), l.name]),
);
/** "Los Alcazares" → "Los Alcázares" when the location dictionary knows the accented form. */
export function displayTown(town: unknown) {
  const raw = String(town || "").trim();
  return canonicalTownNames.get(normalizeLocationName(raw)) || raw;
}

function featureSet(features: unknown) {
  const list = Array.isArray(features) ? features.map((f) => String(f).toLowerCase()) : [];
  const has = (re: RegExp) => list.some((f) => re.test(f));
  return {
    privatePool: has(/^private pool$/),
    solarium: has(/^solarium: (yes|\d)/),
    garden: has(/^garden$/),
    seaView: has(/^views: sea/),
    firstLine: has(/^first line to the sea$/),
    golf: has(/^near golf/),
  };
}

function formatDistance(m: number, locale: SiteLocale) {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  const km = Math.round(m / 100) / 10;
  return `${locale === "en" ? String(km) : String(km).replace(".", ",")} km`;
}

export type TitleFacts = {
  type?: unknown; town?: unknown; beds?: unknown; new_build?: unknown;
  features?: unknown; distance_to_sea_m?: unknown;
};

export function descriptiveTitle(p: TitleFacts, locale: SiteLocale = "pl") {
  const en = locale === "en";
  const noun = nounFor(p.type);
  const town = displayTown(p.town);
  const beds = Number(p.beds);
  const f = featureSet(p.features);
  const sea = Number(p.distance_to_sea_m);
  const isNew = p.new_build === true;

  // One unit-level feature (distinguishes units of the same development).
  const unit = f.privatePool
    ? en ? "private pool" : "prywatnym basenem"
    : f.solarium ? (en ? "solarium" : "solarium")
    : f.garden ? (en ? "garden" : "ogrodem")
    : null;

  // One location hook, strongest first. Distances only when the feed states them (≤ 2 km).
  const hook = f.firstLine
    ? en ? "frontline beach" : "pierwsza linia od morza"
    : sea > 0 && sea <= 500 ? `${formatDistance(sea, locale)} ${en ? "from the beach" : "od plaży"}`
    : f.seaView ? (en ? "sea views" : "widok na morze")
    : sea > 0 && sea <= 2000 ? `${formatDistance(sea, locale)} ${en ? "from the beach" : "od plaży"}`
    : f.golf ? (en ? "close to golf" : "blisko pola golfowego")
    : null;

  if (en) {
    const size = beds > 0 ? `${beds}-bedroom ` : noun.apartmentLike && beds === 0 ? "studio " : "";
    const head = `${isNew ? "New " : ""}${size}${noun.en}`;
    const withUnit = unit ? `${head} with ${unit}` : head;
    const cap = withUnit.charAt(0).toUpperCase() + withUnit.slice(1);
    return `${cap}${town ? " in " + town : ""}${hook ? " – " + hook : ""}`;
  }

  const adjective = isNew ? (noun.gender === "f" ? "Nowa " : "Nowy ") : "";
  let core = adjective + noun.pl;
  if (beds > 0) core += ` z ${beds} ${beds === 1 ? "sypialnią" : "sypialniami"}`;
  else if (beds === 0 && noun.apartmentLike) core += " typu studio";
  if (unit) core += beds > 0 ? ` i ${unit}` : ` z ${unit}`;
  core = core.charAt(0).toUpperCase() + core.slice(1);
  return `${core}${town ? " w " + town : ""}${hook ? " – " + hook : ""}`;
}

// ---- Hand-written development titles (Supabase: development_titles / property_development_titles) ----
export type DevelopmentTitle = { tail_pl: string; tail_en: string | null; exceptional: boolean };

/** Unit lead + development tail: "Wyjątkowa willa z 3 sypialniami" + " w pierwszej linii pola golfowego El Soto – …" */
export function developmentTitle(p: TitleFacts, dev: DevelopmentTitle, locale: SiteLocale = "pl") {
  const noun = nounFor(p.type);
  const beds = Number(p.beds);
  if (locale === "en" && dev.tail_en) {
    const size = beds > 0 ? `${beds}-bedroom ` : noun.apartmentLike && beds === 0 ? "studio " : "";
    const lead = `${dev.exceptional ? "Exceptional " : ""}${size}${noun.en}`;
    return `${lead.charAt(0).toUpperCase()}${lead.slice(1)} ${dev.tail_en}`;
  }
  let lead = (dev.exceptional ? (noun.gender === "f" ? "wyjątkowa " : "wyjątkowy ") : "") + noun.pl;
  if (beds > 0) lead += ` z ${beds} ${beds === 1 ? "sypialnią" : "sypialniami"}`;
  else if (beds === 0 && noun.apartmentLike) lead += " typu studio";
  return `${lead.charAt(0).toUpperCase()}${lead.slice(1)} ${dev.tail_pl}`;
}
