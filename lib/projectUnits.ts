// Inne mieszkania z tego samego projektu (rynek pierwotny, feed REDSP).
//
// PODGLĄD LOKALNY: numer projektu (development_ref) i piętro nie są jeszcze w Supabase.
// Na localhoście (NODE_ENV !== "production") pobieramy feed REDSP v4 raz na 12 godzin
// i zapisujemy mapę w .cache/redsp-developments.json. Na produkcji sekcja się nie pokazuje,
// dopóki development_ref nie trafi do tabeli properties (kolejny krok, po akceptacji).
import { promises as fs } from "fs";
import path from "path";
import { supabaseServer } from "./supabaseClient";
import { propertyTypeLabel, type SiteLocale } from "./i18n";
import { publicAvailability } from "./publicListings";

const REDSP_V4_URL = "https://xml.redsp.net/files/1127/9317amm45f/dom-hisz-redsp_v4.xml";
const CACHE_FILE = path.join(process.cwd(), ".cache", "redsp-developments.json");
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

type DevelopmentIndex = {
  refToDevelopment: Record<string, string>;
  refToFloor: Record<string, number>;
  developmentToRefs: Record<string, string[]>;
};

export type ProjectUnit = {
  externalId: string;
  ref: string;
  label: string;
  beds: number | null;
  baths: number | null;
  area: number | null;
  price: number | null;
  current: boolean;
};

let memoryIndex: DevelopmentIndex | null = null;
let memoryLoadedAt = 0;
let pendingLoad: Promise<DevelopmentIndex | null> | null = null;

function parseFeed(xml: string): DevelopmentIndex {
  const index: DevelopmentIndex = { refToDevelopment: {}, refToFloor: {}, developmentToRefs: {} };
  const tag = (block: string, name: string) => {
    const match = block.match(new RegExp(`<${name}>([^<]*)</${name}>`));
    return match ? match[1].trim() : "";
  };
  for (const block of xml.split("</property>")) {
    const ref = tag(block, "ref");
    const development = tag(block, "development_ref");
    if (!ref || !development) continue;
    index.refToDevelopment[ref] = development;
    (index.developmentToRefs[development] ||= []).push(ref);
    const floor = tag(block, "floor");
    if (floor !== "" && Number.isFinite(Number(floor))) index.refToFloor[ref] = Number(floor);
  }
  return index;
}

async function readCache(): Promise<DevelopmentIndex | null> {
  try {
    const stat = await fs.stat(CACHE_FILE);
    if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
    return JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}

async function downloadIndex(): Promise<DevelopmentIndex | null> {
  try {
    const response = await fetch(REDSP_V4_URL, { headers: { "cache-control": "no-cache" } });
    if (!response.ok) return null;
    const index = parseFeed(await response.text());
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(index));
    return index;
  } catch (error) {
    console.error("projectUnits: nie udało się pobrać feedu REDSP v4", error);
    return null;
  }
}

async function loadDevelopmentIndex(): Promise<DevelopmentIndex | null> {
  if (process.env.NODE_ENV === "production") return null;
  if (memoryIndex && Date.now() - memoryLoadedAt < CACHE_TTL_MS) return memoryIndex;
  if (!pendingLoad) {
    pendingLoad = (async () => (await readCache()) ?? (await downloadIndex()))().finally(() => {
      pendingLoad = null;
    });
  }
  const index = await pendingLoad;
  if (index) {
    memoryIndex = index;
    memoryLoadedAt = Date.now();
  }
  return index;
}

// Piętro pokazujemy tylko tam, gdzie ma sens (mieszkania), nie przy domach i willach.
const FLOOR_TYPES = new Set(["Apartment", "Penthouse", "Bungalow", "apartment", "penthouse", "bungalow"]);

function floorLabel(floor: number | undefined, locale: SiteLocale) {
  if (floor === undefined) return "";
  if (floor === 0) return locale === "en" ? "ground floor" : "parter";
  return locale === "en" ? `floor ${floor}` : `${floor}. piętro`;
}

function unitLabel(type: string | null, floor: number | undefined, locale: SiteLocale) {
  const typeName =
    propertyTypeLabel[locale]?.[type || ""] || type || (locale === "en" ? "Property" : "Nieruchomość");
  const floorText = type && FLOOR_TYPES.has(type) ? floorLabel(floor, locale) : "";
  return floorText ? `${typeName} · ${floorText}` : typeName;
}

const positive = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// Zwraca pozostałe mieszkania z projektu (z bieżącym oznaczonym `current`) albo [] gdy brak danych.
export async function getProjectUnits(
  current: { external_id?: string | null; ref?: string | null; source?: string | null },
  options: { locale?: SiteLocale; publicOnly?: boolean } = {},
): Promise<ProjectUnit[]> {
  const locale = options.locale ?? "pl";
  const ref = current.ref ? String(current.ref) : "";
  if (!ref || (current.source && current.source !== "METAINMO") || !supabaseServer) return [];

  const index = await loadDevelopmentIndex();
  const development = index?.refToDevelopment[ref];
  const refs = development ? index!.developmentToRefs[development] : [];
  if (!refs || refs.length < 2) return [];

  let query: any = supabaseServer
    .from("properties")
    .select("external_id,ref,type,beds,baths,surface_built,price")
    .eq("source", "METAINMO")
    .in("ref", refs);
  if (options.publicOnly) query = publicAvailability(query);
  const { data, error } = await query;
  if (error || !Array.isArray(data) || data.length < 2) return [];

  return data
    .map((row: any) => ({
      externalId: String(row.external_id),
      ref: String(row.ref),
      label: unitLabel(row.type, index!.refToFloor[row.ref], locale),
      beds: positive(row.beds),
      baths: positive(row.baths),
      area: positive(row.surface_built),
      price: positive(row.price),
      current: String(row.external_id) === String(current.external_id),
      sortFloor: index!.refToFloor[row.ref] ?? 0,
    }))
    .sort(
      (a: any, b: any) =>
        (a.beds ?? 0) - (b.beds ?? 0) ||
        a.sortFloor - b.sortFloor ||
        (a.area ?? 0) - (b.area ?? 0),
    )
    .map(({ sortFloor, ...unit }: any) => unit as ProjectUnit);
}
