import type { NextApiRequest, NextApiResponse } from "next";
import { XMLParser } from "fast-xml-parser";
import { supabaseServer } from "@/lib/supabaseClient";

export const config = {
  maxDuration: 120,
};

const SECONDARY_XML_URL =
  "https://www.propmls.com/property-export/26t676x0545/export_1.xml";
const SECONDARY_TABLE = "properties";

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function detectProperties(parsed: any): any[] {
  if (!parsed || typeof parsed !== "object") return [];
  if (parsed?.root?.property) return toArray(parsed.root.property);
  if (parsed?.properties?.property) return toArray(parsed.properties.property);
  if (parsed?.property) return toArray(parsed.property);

  const firstObjectKey = Object.keys(parsed).find(
    (k) => parsed[k] && typeof parsed[k] === "object",
  );
  if (!firstObjectKey) return [];

  const node = parsed[firstObjectKey];
  if (node?.property) return toArray(node.property);
  if (node?.listing) return toArray(node.listing);
  return [];
}

function normalizeUrlString(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&AMP;/g, "&");
}

function normalizeUrlValue<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeUrlString(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeUrlValue(item)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [key, v] of Object.entries(value as Record<string, any>)) {
      out[key] = normalizeUrlValue(v);
    }
    return out as T;
  }
  return value;
}

function splitFeatureTokens(input: string): string[] {
  return input
    .split(/[,;|]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function extractFeatures(property: any): string[] {
  const candidates: any[] = [
    property?.features?.feature,
    property?.features,
    property?.feature,
    property?.characteristics?.characteristic,
    property?.characteristics,
    property?.extras?.extra,
    property?.extras,
    property?.amenities?.amenity,
    property?.amenities,
    property?.equipment?.item,
    property?.equipment,
  ];

  const all = candidates.flatMap((c) => toArray(c));

  const normalized = all.flatMap((item) => {
    if (!item) return [];
    if (typeof item === "string") return splitFeatureTokens(item);
    if (typeof item === "object") {
      const textCandidate =
        item?.name ??
        item?.value ??
        item?.label ??
        item?.title ??
        item?.["#text"] ??
        item?.text;
      if (typeof textCandidate === "string") {
        return splitFeatureTokens(textCandidate);
      }
    }
    return [];
  });

  return Array.from(new Set(normalized));
}

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let stage = "init";
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!supabaseServer) {
      return res.status(500).json({
        error: "Brak SUPABASE_SERVICE_ROLE_KEY dla endpointu serwerowego",
      });
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      htmlEntities: false,
    });

    stage = "download_parse_xml";
    let xmlData = "";
    let lastFetchError: any = null;
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(SECONDARY_XML_URL, {
          headers: { "cache-control": "no-cache" },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        xmlData = await response.text();

        if (!xmlData || xmlData.length < 100) {
          throw new Error("Empty or truncated XML response");
        }

        lastFetchError = null;
        break;
      } catch (err: any) {
        lastFetchError = err;
        if (attempt < maxAttempts) {
          await delay(300 * attempt);
        }
      }
    }

    if (lastFetchError || !xmlData) {
      return res.status(500).json({
        error: "Nie udało się pobrać XML",
        details: lastFetchError?.message ?? "download failed",
        stage,
        attempts: maxAttempts,
      });
    }

    const parsed = parser.parse(xmlData);
    const properties = detectProperties(parsed);

    if (!properties.length) {
      return res.status(400).json({
        error: "Nie znaleziono rekordów w XML (nieznana struktura feedu).",
      });
    }

    stage = "map_records";
    const idCollisions: Record<string, number> = {};
    let duplicateIdRows = 0;

    const mapped = properties.map((property: any, index: number) => {
      const rawId =
        property?.id ??
        property?.ref ??
        property?.reference ??
        property?.listing_id ??
        property?.listingId ??
        index + 1;
      const baseExternalId = `SEC-${String(rawId)}`;
      idCollisions[baseExternalId] = (idCollisions[baseExternalId] ?? 0) + 1;
      const occurrence = idCollisions[baseExternalId];
      if (occurrence > 1) duplicateIdRows += 1;
      const externalId =
        occurrence === 1 ? baseExternalId : `${baseExternalId}-${occurrence}`;

      const features = extractFeatures(property);

      return {
        source: "SECONDARY_XML",
        external_id: externalId,
        ref: String(rawId),
        price: Number(property?.price ?? 0) || 0,
        currency: property?.currency ?? null,
        type: property?.type ?? null,
        town: property?.town ?? property?.city ?? null,
        province: property?.province ?? property?.region ?? null,
        country: property?.country ?? null,
        new_build: false,
        beds: property?.beds ?? null,
        baths: property?.baths ?? null,
        features,
        images: normalizeUrlValue(
          toArray(property?.images?.image ?? property?.images ?? []),
        ),
        descriptions: property?.desc ?? property?.description ?? {},
        urls: normalizeUrlValue(property?.url ?? {}),
        updated_at: new Date(),
      };
    });

    stage = "delete_old_sec_rows";
    const { count: deletedRows, error: countError } = await supabaseServer
      .from(SECONDARY_TABLE)
      .select("id", { count: "exact", head: true })
      .like("external_id", "SEC-%");

    if (countError) {
      return res.status(500).json({
        error: "Błąd liczenia rekordów SEC-* w properties",
        details: countError.message,
      });
    }

    const { error: deleteError } = await supabaseServer
      .from(SECONDARY_TABLE)
      .delete()
      .like("external_id", "SEC-%");

    if (deleteError) {
      return res.status(500).json({
        error: "Błąd usuwania rekordów SEC-* z properties",
        details: deleteError.message,
      });
    }

    stage = "insert_rows";
    const chunkSize = 100;
    let insertedRows = 0;
    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      const { error } = await supabaseServer
        .from(SECONDARY_TABLE)
        .insert(chunk);

      if (error) {
        return res.status(500).json({
          error: "Błąd zapisu do properties",
          details: error.message,
          stage,
          insertedRows,
        });
      }
      insertedRows += chunk.length;
    }

    stage = "done";
    return res.status(200).json({
      message: "Export secondary XML do properties zakończony",
      total_xml: properties.length,
      total_mapped: mapped.length,
      total_saved: insertedRows,
      total_deleted_sec: deletedRows ?? 0,
      duplicate_id_rows: duplicateIdRows,
      xml_url: SECONDARY_XML_URL,
      table: SECONDARY_TABLE,
      stage,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Błąd serwera",
      details: err?.message ?? String(err),
      stage,
    });
  }
}
