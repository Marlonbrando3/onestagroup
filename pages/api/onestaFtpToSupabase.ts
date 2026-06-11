import type { NextApiRequest, NextApiResponse } from "next";
import { Writable } from "stream";
import { Client } from "basic-ftp";
import { XMLParser } from "fast-xml-parser";
import { supabaseServer } from "@/lib/supabaseClient";
import { isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";

export const config = {
  maxDuration: 120,
};

const TABLE = "properties";
const SOURCE = "ONESTA_FTP";

const PARAM_NAMES: Record<string, string> = {
  "1": "numer oferty",
  "3": "ostatnia aktualizacja",
  "5": "data wprowadzenia",
  "10": "cena ofertowa PLN",
  "13": "cena ofertowa za 1 m2",
  "19": "rodzaj mieszkania",
  "20": "typ domu",
  "26": "status oferty",
  "36": "nieruchomość",
  "43": "operacja",
  "45": "województwo",
  "46": "powiat",
  "47": "gmina",
  "48": "miejscowość",
  "49": "dzielnica",
  "52": "okolice",
  "58": "pow. użytkowa [m2]",
  "60": "kraj",
  "61": "odległość od morza [m]",
  "79": "liczba pokoi",
  "82": "przynależne",
  "83": "liczba łazienek",
  "93": "cena ofertowa EURO",
  "94": "cena ofertowa USD",
  "128": "pow. całkowita [m2]",
  "141": "waluta wiodąca",
  "161": "parking/garaż",
  "201": "szerokość geograficzna",
  "202": "długość geograficzna",
  "220": "rynek",
  "300": "ulica",
  "307": "oferta specjalna",
  "340": "identyfikator geoportal",
  "341": "świadectwo energetyczne - energia użytkowa [kWh/(m2 rok)]",
  "342": "świadectwo energetyczne - energia końcowa [kWh/(m2 rok)]",
  "343": "świadectwo energetyczne - nieodnawialna energia pierwotna [kWh/(m2 rok)]",
  "344": "świadectwo energetyczne - jednostkową wielkość emisji CO2 [t C02/(m2 rok)]",
  "345": "świadectwo energetyczne - udział odnawialnych źródeł energii w rocznym zapotrzebowaniu na energię końcową [%]",
  "349": "obsługa zdalna",
  "488": "dostępne od",
  "489": "oferta własna",
  "490": "nazwa inwestycji",
  "491": "tytuł ogłoszenia",
  "492": "zamiana",
};

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
  const text = toText(value);
  if (!text) return null;
  const parsed = Number(text.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function toInteger(value: unknown): number | null {
  const number = toNumber(value);
  return number === null ? null : Math.round(number);
}

function toBoolean(value: unknown): boolean | null {
  const text = toText(value)?.toLowerCase();
  if (!text) return null;
  if (["tak", "yes", "true", "1"].includes(text)) return true;
  if (["nie", "no", "false", "0"].includes(text)) return false;
  return null;
}

function normalizeDate(value: unknown): string | null {
  const text = toText(value);
  if (!text) return null;
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

function normalizeTimestamp(value: unknown): string | null {
  const text = toText(value);
  if (!text) return null;
  const normalized = text.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function stripHtml(value: unknown): string {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitFeatures(...values: Array<unknown>): string[] {
  const items = values
    .flatMap((value) => String(value || "").split(/[,;|]/))
    .map((value) => value.trim())
    .filter(Boolean);
  return Array.from(new Set(items));
}

function getParamMap(offer: any): Record<string, string | null> {
  const params = toArray(offer?.parameters?.p);
  const out: Record<string, string | null> = {};
  for (const param of params) {
    const id = toText(param?.["@_id"]);
    if (!id) continue;
    out[id] = toText(param?.["#text"] ?? param);
  }
  return out;
}

function buildRawParameters(params: Record<string, string | null>) {
  return Object.fromEntries(
    Object.entries(params).map(([id, value]) => [
      id,
      {
        name: PARAM_NAMES[id] ?? null,
        value,
      },
    ]),
  );
}

function buildImageUrl(fileName: string, imageBaseUrl: string) {
  if (!imageBaseUrl) {
    return `/api/onesari/ftp-image?file=${encodeURIComponent(fileName)}`;
  }
  return `${imageBaseUrl.replace(/\/+$/, "")}/${encodeURIComponent(fileName)}`;
}

function mapPictures(offer: any, imageBaseUrl: string) {
  return toArray(offer?.pictures?.picture)
    .map((picture: any) => ({
      filename: toText(picture?.unique),
      status: toInteger(picture?.status),
      weight: toInteger(picture?.weight),
      description: toText(picture?.description),
    }))
    .filter((picture) => picture.filename)
    .sort((a, b) => {
      if (a.status !== b.status) return (b.status ?? 0) - (a.status ?? 0);
      return (a.weight ?? 9999) - (b.weight ?? 9999);
    })
    .map((picture, index) => ({
      url: buildImageUrl(picture.filename!, imageBaseUrl),
      "@_id": String(index + 1),
      filename: picture.filename,
      status: picture.status,
      weight: picture.weight,
      description: picture.description,
    }));
}

function detectOffers(parsed: any): any[] {
  if (parsed?.PACKAGE?.offer) return toArray(parsed.PACKAGE.offer);
  if (parsed?.package?.offer) return toArray(parsed.package.offer);
  if (parsed?.offers?.offer) return toArray(parsed.offers.offer);
  if (parsed?.offer) return toArray(parsed.offer);
  return [];
}

function mapOffer(offer: any, imageBaseUrl: string) {
  const params = getParamMap(offer);
  const ref = toText(params["1"] ?? offer?.signature);
  if (!ref) return null;

  const title = stripHtml(params["491"]) || null;
  const description = stripHtml(offer?.description);
  const market = toText(params["220"]);
  const features = splitFeatures(params["52"], params["82"], params["161"]);
  const images = mapPictures(offer, imageBaseUrl);
  const updatedAt = normalizeTimestamp(params["3"]) ?? new Date().toISOString();

  return {
    source: SOURCE,
    external_id: `OW-${ref}`,
    complex_id: null,
    price: toNumber(params["93"]),
    currency: "EUR",
    price_freq: null,
    part_ownership: null,
    leasehold: null,
    new_build: market ? market.toUpperCase() === "PIERWOTNY" : null,
    type: toText(params["36"] ?? params["19"] ?? params["20"]),
    town: toText(params["48"]),
    province: toText(params["45"]),
    country: toText(params["60"]),
    ref,
    surface_built: toNumber(params["128"]),
    surface_plot: null,
    latitude: toNumber(params["201"]),
    longitude: toNumber(params["202"]),
    beds: toInteger(params["79"]),
    baths: toInteger(params["83"]),
    pool: features.some((feature) => feature.toLowerCase().includes("basen")),
    urls: {},
    descriptions: {
      pl: description || null,
      en: null,
    },
    features,
    images,
    date: normalizeDate(params["5"]),
    updated_at: updatedAt,
    status: toText(params["26"]),
    operation: toText(params["43"]),
    title,
    distance_to_sea_m: toInteger(params["61"]),
    available_from: normalizeDate(params["488"]),
    surface_usable: toNumber(params["58"]),
    street: toText(params["300"]),
    own_offer: toBoolean(params["489"]),
    remote_service: toBoolean(params["349"]),
    energy_usable: toNumber(params["341"]),
    energy_final: toNumber(params["342"]),
    energy_primary: toNumber(params["343"]),
    co2_emission: toNumber(params["344"]),
    renewable_energy_share: toNumber(params["345"]),
    raw_parameters: buildRawParameters(params),
    raw_pictures: images.map(({ url: _url, "@_id": _id, ...raw }) => raw),
    raw_payload: {
      signature: toText(offer?.signature),
      description: offer?.description ?? null,
    },
  };
}

function createStringWritable() {
  const chunks: Buffer[] = [];
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      callback();
    },
  });

  return {
    writable,
    getText: () => Buffer.concat(chunks).toString("utf8"),
  };
}

async function downloadFtpText(remotePath: string) {
  const host = process.env.ONESTA_FTP_HOST || "serwer141299.lh.pl";
  const user = process.env.ONESTA_FTP_USER;
  const password = process.env.ONESTA_FTP_PASSWORD;

  if (!user || !password) {
    throw new Error("Brak ONESTA_FTP_USER lub ONESTA_FTP_PASSWORD w env");
  }

  const client = new Client(30000);
  client.ftp.verbose = false;

  try {
    await client.access({
      host,
      user,
      password,
      secure: false,
    });

    const { writable, getText } = createStringWritable();
    await client.downloadTo(writable, remotePath);
    return getText();
  } finally {
    client.close();
  }
}

async function detectXmlPath() {
  const configured = process.env.ONESTA_FTP_XML_PATH;
  if (configured) return configured;

  const host = process.env.ONESTA_FTP_HOST || "serwer141299.lh.pl";
  const user = process.env.ONESTA_FTP_USER;
  const password = process.env.ONESTA_FTP_PASSWORD;
  const dir = process.env.ONESTA_FTP_XML_DIR || "properties";

  if (!user || !password) {
    throw new Error("Brak ONESTA_FTP_USER lub ONESTA_FTP_PASSWORD w env");
  }

  const client = new Client(30000);
  try {
    await client.access({ host, user, password, secure: false });
    const files = await client.list(dir);
    const xmlFile = files
      .filter((file) => file.isFile && /\.xml$/i.test(file.name))
      .filter((file) => !/definitions|definictions|cfg/i.test(file.name))
      .sort((a, b) => (b.size ?? 0) - (a.size ?? 0))[0];

    if (!xmlFile) {
      throw new Error(`Nie znaleziono XML z ofertami w katalogu FTP: ${dir}`);
    }

    return `${dir.replace(/\/+$/, "")}/${xmlFile.name}`;
  } finally {
    client.close();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isOnesariEnabled()) {
    return rejectDisabledOnesari(res);
  }

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

    const host = process.env.ONESTA_FTP_HOST || "serwer141299.lh.pl";
    const imageDir = process.env.ONESTA_FTP_IMAGE_DIR || "images";
    const imageBaseUrl = process.env.ONESTA_FTP_IMAGE_BASE_URL || "";

    stage = "download_xml";
    const xmlPath = await detectXmlPath();
    const xmlData = await downloadFtpText(xmlPath);

    stage = "parse_xml";
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      processEntities: false,
      htmlEntities: false,
      trimValues: false,
    });
    const parsed = parser.parse(xmlData);
    const offers = detectOffers(parsed);

    if (!offers.length) {
      return res.status(400).json({
        error: "Nie znaleziono ofert w XML z FTP",
        stage,
        xml_path: xmlPath,
      });
    }

    stage = "map_records";
    const mapped = offers
      .map((offer) => mapOffer(offer, imageBaseUrl))
      .filter(Boolean);

    stage = "delete_old_rows";
    const { count: deletedRows, error: countError } = await supabaseServer
      .from(TABLE)
      .select("id", { count: "exact", head: true })
      .eq("source", SOURCE);

    if (countError) {
      return res.status(500).json({
        error: "Błąd liczenia starych rekordów ONESTA_FTP",
        details: countError.message,
        stage,
      });
    }

    const { error: deleteError } = await supabaseServer
      .from(TABLE)
      .delete()
      .eq("source", SOURCE);

    if (deleteError) {
      return res.status(500).json({
        error: "Błąd usuwania starych rekordów ONESTA_FTP",
        details: deleteError.message,
        stage,
      });
    }

    stage = "insert_rows";
    const chunkSize = 100;
    let insertedRows = 0;

    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      const { error } = await supabaseServer.from(TABLE).insert(chunk);

      if (error) {
        return res.status(500).json({
          error: "Błąd zapisu do properties",
          details: error.message,
          hint: "Jeśli błąd dotyczy brakującej kolumny, uruchom SQL z scripts/onesta_ftp_properties_schema.sql w Supabase.",
          stage,
          insertedRows,
        });
      }

      insertedRows += chunk.length;
    }

    stage = "done";
    return res.status(200).json({
      message: "Import Onesta FTP do properties zakończony",
      total_xml: offers.length,
      total_mapped: mapped.length,
      total_saved: insertedRows,
      total_deleted_old: deletedRows ?? 0,
      source: SOURCE,
      xml_path: xmlPath,
      image_base_url: imageBaseUrl || "/api/onesari/ftp-image?file={filename}",
      stage,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Błąd importu Onesta FTP",
      details: err?.message ?? String(err),
      stage,
    });
  }
}
