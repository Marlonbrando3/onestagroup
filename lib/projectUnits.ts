// Inne mieszkania z tego samego projektu (rynek pierwotny, feed REDSP).
// Numer projektu (development_ref) i piętro (floor) zapisuje import REDSP z feedu v4
// (pages/api/metainmoToSupabase.tsx) w tabeli properties.
import { supabaseServer } from "./supabaseClient";
import { propertyTypeLabel, type SiteLocale } from "./i18n";
import { publicAvailability } from "./publicListings";

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

// Piętro pokazujemy tylko tam, gdzie ma sens (mieszkania), nie przy domach i willach.
const FLOOR_TYPES = new Set(["Apartment", "Penthouse", "Bungalow", "apartment", "penthouse", "bungalow"]);

function floorLabel(floor: number | null, locale: SiteLocale) {
  if (floor === null || floor === undefined || !Number.isFinite(Number(floor))) return "";
  if (Number(floor) === 0) return locale === "en" ? "ground floor" : "parter";
  return locale === "en" ? `floor ${floor}` : `${floor}. piętro`;
}

function unitLabel(type: string | null, floor: number | null, locale: SiteLocale) {
  const typeName =
    propertyTypeLabel[locale]?.[type || ""] || type || (locale === "en" ? "Property" : "Nieruchomość");
  const floorText = type && FLOOR_TYPES.has(type) ? floorLabel(floor, locale) : "";
  return floorText ? `${typeName} · ${floorText}` : typeName;
}

const positive = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// Zwraca wszystkie mieszkania z projektu (bieżące oznaczone `current`) albo [] gdy brak danych.
export async function getProjectUnits(
  current: { external_id?: string | null; development_ref?: string | null; source?: string | null },
  options: { locale?: SiteLocale; publicOnly?: boolean } = {},
): Promise<ProjectUnit[]> {
  const locale = options.locale ?? "pl";
  const externalId = current.external_id ? String(current.external_id) : "";
  if (!supabaseServer || !externalId) return [];
  if (current.source && current.source !== "METAINMO") return [];

  try {
    let development = current.development_ref ? String(current.development_ref) : "";
    if (!development) {
      const { data } = await supabaseServer
        .from("properties")
        .select("development_ref")
        .eq("external_id", externalId)
        .maybeSingle();
      development = (data as any)?.development_ref || "";
    }
    if (!development) return [];

    let query: any = supabaseServer
      .from("properties")
      .select("external_id,ref,type,beds,baths,surface_built,price,floor")
      .eq("development_ref", development)
      .limit(60);
    if (options.publicOnly) query = publicAvailability(query);
    const { data, error } = await query;
    if (error || !Array.isArray(data) || data.length < 2) return [];

    return data
      .map((row: any) => ({
        externalId: String(row.external_id),
        ref: String(row.ref || ""),
        label: unitLabel(row.type, row.floor, locale),
        beds: positive(row.beds),
        baths: positive(row.baths),
        area: positive(row.surface_built),
        price: positive(row.price),
        current: String(row.external_id) === externalId,
        sortFloor: Number(row.floor) || 0,
      }))
      .sort(
        (a: any, b: any) =>
          (a.beds ?? 0) - (b.beds ?? 0) ||
          a.sortFloor - b.sortFloor ||
          (a.area ?? 0) - (b.area ?? 0),
      )
      .map(({ sortFloor, ...unit }: any) => unit as ProjectUnit);
  } catch (error) {
    console.error("projectUnits: nie udało się pobrać mieszkań z projektu", error);
    return [];
  }
}
