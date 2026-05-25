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

    stage = "download_xml";
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

        // this is where remote often throws "terminated"
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

    stage = "parse_xml";
    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      htmlEntities: false,
    });
    const parsed = parser.parse(xmlData);
    const properties = detectProperties(parsed);

    if (!properties.length) {
      return res.status(400).json({
        error: "Nie znaleziono rekordów w XML (nieznana struktura feedu).",
      });
    }

    stage = "map_records";
    const mapped = properties.map((property: any, index: number) => {
      const rawId =
        property?.id ??
        property?.ref ??
        property?.reference ??
        property?.listing_id ??
        property?.listingId ??
        index + 1;

      return {
        source: "SECONDARY_XML",
        external_id: `SEC-${String(rawId)}`,
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
        images: normalizeUrlValue(
          toArray(property?.images?.image ?? property?.images ?? []),
        ),
        descriptions: property?.desc ?? property?.description ?? {},
        urls: normalizeUrlValue(property?.url ?? {}),
        updated_at: new Date(),
      };
    });

    const uniqueByExternalId = Object.values(
      mapped.reduce((acc: Record<string, any>, row: any) => {
        acc[row.external_id] = row;
        return acc;
      }, {}),
    );

    stage = "delete_old_sec_rows";
    // delete only previous secondary-import rows (SEC-*)
    const deleteChunkSize = 200;
    let hasMore = true;
    while (hasMore) {
      const { data: toDelete, error: selectDeleteError } = await supabaseServer
        .from(SECONDARY_TABLE)
        .select("id")
        .like("external_id", "SEC-%")
        .range(0, deleteChunkSize - 1);

      if (selectDeleteError) {
        return res.status(500).json({
          error: "Błąd odczytu rekordów SEC-* z properties",
          details: selectDeleteError.message,
        });
      }

      if (!toDelete?.length) {
        hasMore = false;
        break;
      }

      const ids = toDelete.map((r: any) => r.id);
      const { error: deleteError } = await supabaseServer
        .from(SECONDARY_TABLE)
        .delete()
        .in("id", ids);

      if (deleteError) {
        return res.status(500).json({
          error: "Błąd usuwania rekordów SEC-* z properties",
          details: deleteError.message,
        });
      }
    }

    stage = "insert_rows";
    const chunkSize = 100;
    let insertedRows = 0;
    for (let i = 0; i < uniqueByExternalId.length; i += chunkSize) {
      const chunk = uniqueByExternalId.slice(i, i + chunkSize);
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
      total_saved: insertedRows,
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
