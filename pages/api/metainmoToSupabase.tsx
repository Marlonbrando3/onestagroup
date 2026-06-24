import type { NextApiRequest, NextApiResponse } from "next";
import { XMLParser } from "fast-xml-parser";
import { supabaseServer } from "@/lib/supabaseClient";

export const config = {
  type: "experimental-background",
  maxDuration: 120,
};

const METAINMO_CHUNK_SIZE = 100;
const METAINMO_WRITE_DELAY_MS = 0;
const METAINMO_DELETE_CHUNK_SIZE = 200;
const METAINMO_SELECT_CHUNK_SIZE = 200;
const RETRY_DELAYS_MS = [1000, 2500, 5000, 10000, 15000];
let metainmoImportInProgress = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toText(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const text = toText(value);
  if (!text) return null;

  const normalized = text.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (!normalized) return null;

  const parsed = Number(normalized[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function toInteger(value: unknown): number | null {
  const number = toNumber(value);
  return number === null ? null : Math.round(number);
}

function toBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  const text = toText(value)?.toLowerCase();
  if (!text) return null;
  if (["1", "true", "yes", "tak"].includes(text)) return true;
  if (["0", "false", "no", "nie"].includes(text)) return false;
  return null;
}

function normalizeTimestamp(value: unknown): string {
  const text = toText(value);
  if (!text) return new Date().toISOString();
  const date = new Date(text.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function buildMetainmoExternalId(property: any): string | null {
  const rawId =
    toText(property?.id) ??
    toText(property?.ref) ??
    toText(property?.reference) ??
    toText(property?.url?.pl) ??
    toText(property?.url?.en) ??
    toText(property?.url);

  return rawId ? `MTI-${rawId}` : null;
}

function detectProperties(parsed: any): any[] {
  if (!parsed || typeof parsed !== "object") return [];
  if (parsed?.root?.property) return toArray(parsed.root.property);
  if (parsed?.properties?.property) return toArray(parsed.properties.property);
  if (parsed?.property) return toArray(parsed.property);

  const firstObjectKey = Object.keys(parsed).find(
    (key) => parsed[key] && typeof parsed[key] === "object",
  );
  if (!firstObjectKey) return [];

  const node = parsed[firstObjectKey];
  if (node?.property) return toArray(node.property);
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
    for (const [key, item] of Object.entries(value as Record<string, any>)) {
      out[key] = normalizeUrlValue(item);
    }
    return out as T;
  }
  return value;
}

function splitFeatureTokens(input: string): string[] {
  return input
    .split(/[,;|]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function extractFeatures(property: any): string[] {
  const directCandidates: any[] = [
    property?.features?.feature,
    property?.feature,
    property?.amenities?.amenity,
    property?.extras?.extra,
  ];

  const directValues = directCandidates.flatMap((candidate) => toArray(candidate));
  const directFeatures = directValues.flatMap((item) => {
    if (typeof item === "string") return splitFeatureTokens(item);
    if (item && typeof item === "object") {
      const textCandidate =
        item?.name ?? item?.value ?? item?.label ?? item?.title ?? item?.["#text"];
      return typeof textCandidate === "string" ? splitFeatureTokens(textCandidate) : [];
    }
    return [];
  });

  const keyedFlags =
    property?.features && typeof property.features === "object" && !Array.isArray(property.features)
      ? Object.entries(property.features)
          .filter(([key, value]) => key !== "feature" && toBoolean(value) === true)
          .map(([key]) => key)
      : [];

  return Array.from(new Set([...directFeatures, ...keyedFlags]));
}

function buildRawPayload(property: any) {
  return {
    id: toText(property?.id),
    complex_id: toText(property?.complex_id),
    complex: toText(property?.complex),
    complex_url: toText(property?.complex_url),
    created: toText(property?.created),
    updated: toText(property?.updated),
    company: toText(property?.company),
    category: toText(property?.category),
    street: toText(property?.street),
    distance_airport: toText(property?.distance_airport),
    hospital_distance: toText(property?.hospital_distance),
    distance_beach: toText(property?.distance_beach),
  };
}

function dedupeRowsByExternalId(rows: any[]) {
  const uniqueRows = new Map<string, any>();
  let duplicateRows = 0;
  let skippedRows = 0;

  for (const row of rows) {
    const externalId = toText(row?.external_id);
    if (!externalId) {
      skippedRows += 1;
      continue;
    }

    if (uniqueRows.has(externalId)) {
      duplicateRows += 1;
    }

    uniqueRows.set(externalId, row);
  }

  return {
    rows: Array.from(uniqueRows.values()),
    duplicateRows,
    skippedRows,
  };
}

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
      .from("properties")
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

async function deleteStaleMetainmoRows(currentExternalIds: Set<string>) {
  const staleIds: string[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabaseServer!
      .from("properties")
      .select("id,external_id")
      .eq("source", "METAINMO")
      .order("id", { ascending: true })
      .range(from, from + METAINMO_SELECT_CHUNK_SIZE - 1);

    if (error) {
      return { deletedRows: 0, error };
    }

    const rows = data || [];
    for (const row of rows) {
      if (!currentExternalIds.has(String(row.external_id))) {
        staleIds.push(String(row.id));
      }
    }

    if (rows.length < METAINMO_SELECT_CHUNK_SIZE) break;
    from += METAINMO_SELECT_CHUNK_SIZE;
    await delay(250);
  }

  let deletedRows = 0;
  for (let i = 0; i < staleIds.length; i += METAINMO_DELETE_CHUNK_SIZE) {
    const ids = staleIds.slice(i, i + METAINMO_DELETE_CHUNK_SIZE);
    const { error } = await supabaseServer!
      .from("properties")
      .delete()
      .in("id", ids);

    if (error) {
      return { deletedRows, error };
    }

    deletedRows += ids.length;
    await delay(METAINMO_WRITE_DELAY_MS);
  }

  return { deletedRows, error: null };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    stage: string,
    message: string,
    percent: number,
    processed: number | null = null,
    total: number | null = null,
  ) => {
    sendEvent({ type: "progress", stage, message, percent, processed, total });
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

    if (metainmoImportInProgress) {
      return sendError(409, {
        error: "Import Metainmo już trwa. Poczekaj na zakończenie obecnego procesu.",
      });
    }

    if (!supabaseServer) {
      return res.status(500).json({
        error: "Brak SUPABASE_SERVICE_ROLE_KEY dla endpointu serwerowego",
      });
    }

    metainmoImportInProgress = true;
    lockAcquired = true;

    sendProgress("download_xml", "Pobieram XML Metainmo...", 5);
    const response = await fetch(process.env.METAINMO_XML_URL!);

    if (!response.ok) {
      return sendError(500, { error: "Nie udało się pobrać XML" });
    }

    const xmlData = await response.text();

    sendProgress("parse_xml", "Przetwarzam XML...", 15);
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlData);
    const properties = detectProperties(parsed);

    if (!properties.length) {
      return sendError(400, {
        error: "Nie znaleziono rekordów w XML (nieznana struktura feedu).",
      });
    }

    sendProgress("map_records", "Mapuję rekordy z XML...", 28, properties.length, properties.length);
    // 🔹 mapowanie XML → struktura do Supabase
    const mapped = properties.map((property: any) => {
      const features = extractFeatures(property);
      const title =
        toText(property?.name?.pl) ??
        toText(property?.name?.en) ??
        toText(property?.name) ??
        null;
      const externalId = buildMetainmoExternalId(property);

      return {
        source: "METAINMO",
        external_id: externalId,
        complex_id:
          toText(property.complex_id) ??
          toText(property.complex_url) ??
          toText(property.complex) ??
          null,

        price: toNumber(property.price),
        currency: toText(property.currency),
        price_freq: toText(property.price_freq),

        part_ownership: toBoolean(property.part_ownership),
        leasehold: toBoolean(property.leasehold),
        new_build: true,

        type: toText(property.type),
        town: toText(property.town) ?? toText(property.city),
        province: toText(property.province) ?? toText(property.region),
        country: "Spain",
        ref: toText(property.ref),

        surface_built: toNumber(property.surface_area?.built ?? property.surface_area),
        surface_plot: toNumber(property.surface_area?.plot ?? property.plot_area),

        latitude: toNumber(property.location?.latitude ?? property.latitude),
        longitude: toNumber(property.location?.longitude ?? property.longitude),

        beds: toInteger(property.beds),
        baths: toInteger(property.baths),
        pool:
          toBoolean(property.pool) ??
          features.some((feature) => feature.toLowerCase().includes("pool")),

        urls: normalizeUrlValue(property.url ?? {}),
        descriptions: property.desc ?? {},
        features,
        images: normalizeUrlValue(toArray(property.images?.image ?? property.images)),

        date: toText(property.date) ?? toText(property.created),
        updated_at: normalizeTimestamp(property.updated ?? property.date),
        title,
        distance_to_sea_m: toInteger(property.distance_beach),
        raw_payload: buildRawPayload(property),
      };
    });

    const {
      rows: uniqueMetainmoRows,
      duplicateRows,
      skippedRows,
    } = dedupeRowsByExternalId(mapped);

    const chunkSize = METAINMO_CHUNK_SIZE;
    const totalRows = uniqueMetainmoRows.length;
    let savedRows = 0;

    sendProgress(
      "insert_rows",
      `Rozpoczynam zapis do bazy: 0/${totalRows}`,
      50,
      0,
      totalRows,
    );

    // 🔹 wysyłka do Supabase
    for (let i = 0; i < uniqueMetainmoRows.length; i += chunkSize) {
      const chunk = uniqueMetainmoRows.slice(i, i + chunkSize);

      const error = await upsertChunkWithRetry(chunk);

      if (error) {
        console.error(error);
        return sendError(500, { error: error.message || "Błąd zapisu do properties" });
      }

      savedRows += chunk.length;
      const percent =
        totalRows > 0 ? Math.min(90, 50 + Math.round((savedRows / totalRows) * 40)) : 90;
      sendProgress(
        "insert_rows",
        `Zapis do bazy: ${savedRows}/${totalRows}`,
        percent,
        savedRows,
        totalRows,
      );

      if (savedRows < totalRows) {
        await delay(METAINMO_WRITE_DELAY_MS);
      }
    }

    sendProgress(
      "delete_stale_rows",
      "Czyszczę rekordy, których nie ma już w XML...",
      94,
      savedRows,
      totalRows,
    );
    const currentExternalIds = new Set(
      uniqueMetainmoRows.map((property: any) => String(property.external_id)),
    );
    const { deletedRows, error: staleDeleteError } =
      await deleteStaleMetainmoRows(currentExternalIds);

    if (staleDeleteError) {
      console.error(staleDeleteError);
      return sendError(500, {
        error:
          staleDeleteError.message ||
          "Nowe dane zapisane, ale czyszczenie starych rekordów nie powiodło się.",
      });
    }

    const payload = {
      message: "Export do Supabase zakończony",
      total_xml: mapped.length,
      total_after_dedupe: uniqueMetainmoRows.length,
      total_saved: savedRows,
      total_deleted_stale: deletedRows,
      duplicate_external_id_rows: duplicateRows,
      skipped_missing_external_id_rows: skippedRows,
    };

    sendProgress("done", "Import METAINMO zakończony.", 100, totalRows, totalRows);
    return sendResult(payload);
  } catch (err) {
    console.error(err);
    return sendError(500, { error: "Błąd serwera" });
  } finally {
    if (lockAcquired) {
      metainmoImportInProgress = false;
    }
  }
}
