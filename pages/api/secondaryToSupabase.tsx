import type { NextApiRequest, NextApiResponse } from "next";
import { XMLParser } from "fast-xml-parser";
import { supabaseServer } from "../../lib/supabaseClient";

export const config = {
  maxDuration: 120,
};

const SECONDARY_XML_URL =
  "https://www.propmls.com/property-export/26t676x0545/export_1.xml";
const SECONDARY_TABLE = "properties";
const SECONDARY_CHUNK_SIZE = 100;
const SECONDARY_WRITE_DELAY_MS = 0;
const SECONDARY_DELETE_CHUNK_SIZE = 200;
const SECONDARY_SELECT_CHUNK_SIZE = 200;
const RETRY_DELAYS_MS = [1000, 2500, 5000, 10000, 15000];
let secondaryImportInProgress = false;

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

function isTransientSupabaseError(error: any) {
  const message = String(error?.message || error?.details || "").toLowerCase();
  const status = String(error?.status || error?.code || "");
  return (
    status.startsWith("5") ||
    message.includes("520") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("fetch failed")
  );
}

async function upsertChunkWithRetry(chunk: any[]) {
  for (let attempt = 1; attempt <= RETRY_DELAYS_MS.length + 1; attempt += 1) {
    const { error } = await supabaseServer!
      .from(SECONDARY_TABLE)
      .upsert(chunk, { onConflict: "external_id", ignoreDuplicates: false });

    if (!error) {
      return null;
    }

    if (!isTransientSupabaseError(error) || attempt > RETRY_DELAYS_MS.length) {
      return error;
    }

    await delay(RETRY_DELAYS_MS[attempt - 1]);
  }

  return { message: "Nie udało się zapisać chunku do Supabase" };
}

async function deleteStaleSecondaryRows(currentExternalIds: Set<string>) {
  const staleIds: string[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabaseServer!
      .from(SECONDARY_TABLE)
      .select("id,external_id")
      .like("external_id", "SEC-%")
      .order("id", { ascending: true })
      .range(from, from + SECONDARY_SELECT_CHUNK_SIZE - 1);

    if (error) {
      return { deletedRows: 0, error };
    }

    const rows = data || [];
    for (const row of rows) {
      if (!currentExternalIds.has(String(row.external_id))) {
        staleIds.push(String(row.id));
      }
    }

    if (rows.length < SECONDARY_SELECT_CHUNK_SIZE) break;
    from += SECONDARY_SELECT_CHUNK_SIZE;
    await delay(250);
  }

  let deletedRows = 0;
  for (let i = 0; i < staleIds.length; i += SECONDARY_DELETE_CHUNK_SIZE) {
    const ids = staleIds.slice(i, i + SECONDARY_DELETE_CHUNK_SIZE);
    const { error } = await supabaseServer!
      .from(SECONDARY_TABLE)
      .delete()
      .in("id", ids);

    if (error) {
      return { deletedRows, error };
    }

    deletedRows += ids.length;
    await delay(SECONDARY_WRITE_DELAY_MS);
  }

  return { deletedRows, error: null };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let stage = "init";
  const streamMode = req.headers["x-import-progress"] === "1";
  let streamOpen = false;
  let lockAcquired = false;

  const sendEvent = (payload: Record<string, any>) => {
    if (!streamMode) return;
    if (!streamOpen) {
      res.writeHead(200, {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      streamOpen = true;
    }
    res.write(`${JSON.stringify(payload)}\n`);
  };

  const sendProgress = (
    currentStage: string,
    message: string,
    percent: number,
    processed: number | null = null,
    total: number | null = null,
  ) => {
    sendEvent({
      type: "progress",
      stage: currentStage,
      message,
      percent,
      processed,
      total,
    });
  };

  const sendError = (status: number, payload: Record<string, any>) => {
    if (streamMode) {
      sendEvent({ type: "error", ok: false, status, ...payload });
      res.end();
      return;
    }
    return res.status(status).json(payload);
  };

  const sendResult = (payload: Record<string, any>) => {
    if (streamMode) {
      sendEvent({ type: "result", ok: true, data: payload });
      res.end();
      return;
    }
    return res.status(200).json(payload);
  };

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (secondaryImportInProgress) {
      return sendError(409, {
        error: "Import Secondary MLS już trwa. Poczekaj na zakończenie obecnego procesu.",
      });
    }

    if (!supabaseServer) {
      return res.status(500).json({
        error: "Brak SUPABASE_SERVICE_ROLE_KEY dla endpointu serwerowego",
      });
    }

    secondaryImportInProgress = true;
    lockAcquired = true;

    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      htmlEntities: false,
    });

    stage = "download_parse_xml";
    sendProgress(stage, "Pobieram XML Secondary MLS...", 5);
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
      return sendError(500, {
        error: "Nie udało się pobrać XML",
        details: lastFetchError?.message ?? "download failed",
        stage,
        attempts: maxAttempts,
      });
    }

    sendProgress(stage, "Przetwarzam XML Secondary MLS...", 18);
    const parsed = parser.parse(xmlData);
    const properties = detectProperties(parsed);

    if (!properties.length) {
      return sendError(400, {
        error: "Nie znaleziono rekordów w XML (nieznana struktura feedu).",
      });
    }

    stage = "map_records";
    sendProgress(stage, "Mapuję rekordy z XML...", 30, properties.length, properties.length);
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

    stage = "insert_rows";
    const chunkSize = SECONDARY_CHUNK_SIZE;
    let insertedRows = 0;
    sendProgress(stage, `Rozpoczynam zapis do bazy: 0/${mapped.length}`, 50, 0, mapped.length);
    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      const error = await upsertChunkWithRetry(chunk);

      if (error) {
        return sendError(500, {
          error: "Błąd zapisu do properties",
          details: error.message,
          stage,
          insertedRows,
        });
      }
      insertedRows += chunk.length;
      const percent =
        mapped.length > 0 ? Math.min(90, 50 + Math.round((insertedRows / mapped.length) * 40)) : 90;
      sendProgress(
        stage,
        `Zapis do bazy: ${insertedRows}/${mapped.length}`,
        percent,
        insertedRows,
        mapped.length,
      );

      if (insertedRows < mapped.length) {
        await delay(SECONDARY_WRITE_DELAY_MS);
      }
    }

    stage = "delete_stale_sec_rows";
    sendProgress(stage, "Czyszczę rekordy Secondary MLS spoza aktualnego XML...", 94, insertedRows, mapped.length);
    const currentExternalIds = new Set(
      mapped.map((property: any) => String(property.external_id)),
    );
    const { deletedRows, error: staleDeleteError } =
      await deleteStaleSecondaryRows(currentExternalIds);

    if (staleDeleteError) {
      return sendError(500, {
        error:
          staleDeleteError.message ||
          "Nowe dane zapisane, ale czyszczenie starych rekordów nie powiodło się.",
        stage,
        insertedRows,
      });
    }

    stage = "done";
    const payload = {
      message: "Export secondary XML do properties zakończony",
      total_xml: properties.length,
      total_mapped: mapped.length,
      total_saved: insertedRows,
      total_deleted_sec: deletedRows,
      duplicate_id_rows: duplicateIdRows,
      xml_url: SECONDARY_XML_URL,
      table: SECONDARY_TABLE,
      stage,
    };
    sendProgress(stage, "Import Secondary MLS zakończony.", 100, insertedRows, mapped.length);
    return sendResult(payload);
  } catch (err: any) {
    return sendError(500, {
      error: "Błąd serwera",
      details: err?.message ?? String(err),
      stage,
    });
  } finally {
    if (lockAcquired) {
      secondaryImportInProgress = false;
    }
  }
}
