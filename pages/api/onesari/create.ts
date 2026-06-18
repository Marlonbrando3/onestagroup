import crypto from "crypto";
import path from "path";
import { Readable } from "stream";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 120,
};

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
};

type UploadedImage = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  url?: string;
  version?: number;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
};

type SavedImage = {
  url: string | null;
  provider: string;
  order: number;
  cloudinary_asset_id: string | null;
  cloudinary_public_id: string | null;
  cloudinary_version: number | null;
  original_file_name: string | null;
  bytes: number | null;
  format: string | null;
  width: number | null;
  height: number | null;
};

const propertySelect =
  "id,external_id,ref,source,price,currency,type,town,province,country,developer,investment_name,surface_built,beds,baths,new_build,features,images,descriptions,date,updated_at,title,distance_to_sea_m,available_from,operation,status";

function isFormDataPayload(payload: FormData | Record<string, unknown>): payload is FormData {
  return typeof FormData !== "undefined" && payload instanceof FormData;
}

function textValue(payload: FormData | Record<string, unknown>, key: string) {
  const value = isFormDataPayload(payload) ? payload.get(key) : payload[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function nullableNumber(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function nullableInteger(value: string) {
  const numericValue = nullableNumber(value);
  return numericValue === null ? null : Math.trunc(numericValue);
}

function featureTextValue(feature: unknown): string {
  if (typeof feature === "string") return feature.trim();
  if (typeof feature === "number" || typeof feature === "boolean") {
    return String(feature).trim();
  }
  if (!feature || typeof feature !== "object") return "";

  const featureObject = feature as Record<string, unknown>;
  const candidateKeys = ["label", "name", "title", "value", "text", "feature", "pl", "en"];
  for (const key of candidateKeys) {
    const value = featureTextValue(featureObject[key]);
    if (value) return value;
  }

  return "";
}

function normalizeFeatures(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  const normalized = values
    .map((feature) => featureTextValue(feature))
    .filter((feature) => feature && feature !== "[object Object]");

  return Array.from(new Set(normalized));
}

function parseFeatures(value: string) {
  try {
    const parsed = JSON.parse(value || "[]");
    return normalizeFeatures(parsed);
  } catch {
    return [];
  }
}

function featuresValue(payload: FormData | Record<string, unknown>) {
  const value = isFormDataPayload(payload) ? payload.get("features") : payload.features;
  if (Array.isArray(value)) return normalizeFeatures(value);
  if (typeof value === "string") return parseFeatures(value);
  return [];
}

function parseCloudinaryConfig(): CloudinaryConfig {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) throw new Error("Brak CLOUDINARY_URL");

  const parsed = new URL(cloudinaryUrl);
  return {
    apiKey: decodeURIComponent(parsed.username),
    apiSecret: decodeURIComponent(parsed.password),
    cloudName: parsed.hostname,
  };
}

function safeSegment(value: string) {
  return String(value || "property")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "property";
}

function fileBaseName(fileName: string) {
  return path.basename(fileName).replace(/\.[^.]+$/, "");
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

async function parseMultipartForm(req: NextApiRequest) {
  const contentType = req.headers["content-type"];
  if (!contentType?.includes("multipart/form-data")) {
    throw new Error("Nieprawidłowy format formularza");
  }

  const body = Readable.toWeb(req) as BodyInit;
  return new Response(body, {
    headers: { "content-type": contentType },
  }).formData();
}

async function parseJsonBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks).toString("utf8").trim();
  if (!body) return {};
  return JSON.parse(body) as Record<string, unknown>;
}

function normalizeClientImages(value: unknown): SavedImage[] {
  if (!Array.isArray(value)) return [];

  const images: SavedImage[] = [];

  value.forEach((image, index) => {
    if (!image || typeof image !== "object") return;
    const item = image as Record<string, unknown>;
    const url = typeof item.url === "string" && item.url.trim() ? item.url.trim() : null;
    if (!url) return;

    images.push({
      url,
      provider: "cloudinary",
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
      cloudinary_asset_id:
        typeof item.cloudinary_asset_id === "string" ? item.cloudinary_asset_id : null,
      cloudinary_public_id:
        typeof item.cloudinary_public_id === "string" ? item.cloudinary_public_id : null,
      cloudinary_version: Number.isFinite(Number(item.cloudinary_version))
        ? Number(item.cloudinary_version)
        : null,
      original_file_name:
        typeof item.original_file_name === "string" ? item.original_file_name : null,
      bytes: Number.isFinite(Number(item.bytes)) ? Number(item.bytes) : null,
      format: typeof item.format === "string" ? item.format : null,
      width: Number.isFinite(Number(item.width)) ? Number(item.width) : null,
      height: Number.isFinite(Number(item.height)) ? Number(item.height) : null,
    });
  });

  return images;
}

async function uploadToCloudinary(
  file: File,
  propertyRef: string,
  index: number,
  cloudinary: CloudinaryConfig,
) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `onesari/onesta-ftp/${safeSegment(propertyRef)}`;
  const publicId = `${String(index + 1).padStart(3, "0")}-${safeSegment(
    fileBaseName(file.name),
  )}`;
  const signedParams = {
    folder,
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(signedParams, cloudinary.apiSecret);

  const form = new FormData();
  form.append("file", file, file.name);
  form.append("api_key", cloudinary.apiKey);
  form.append("folder", folder);
  form.append("overwrite", "true");
  form.append("public_id", publicId);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
    },
  );
  const result = (await response.json()) as UploadedImage & {
    error?: { message?: string };
  };

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || "Cloudinary nie przyjął obrazu");
  }

  return {
    url: result.secure_url || result.url || null,
    provider: "cloudinary",
    order: index + 1,
    cloudinary_asset_id: result.asset_id || null,
    cloudinary_public_id: result.public_id || null,
    cloudinary_version: result.version || null,
    original_file_name: file.name,
    bytes: result.bytes || file.size || null,
    format: result.format || null,
    width: result.width || null,
    height: result.height || null,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isOnesariEnabled()) {
    return rejectDisabledOnesari(res);
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY" });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Brak tokenu dostępu" });
  }

  const { data: userData, error: userError } =
    await supabaseServer.auth.getUser(token);
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Brak dostępu" });
  }
  if (!canAccessOnesari(userData.user.email)) {
    return res.status(403).json({ error: "Brak dostępu do Onesari" });
  }

  try {
    const now = new Date();
    const ref = `MAN-${now.getTime()}`;
    const externalId = `OW-${ref}`;
    const contentType = req.headers["content-type"] || "";
    const isJsonRequest = contentType.includes("application/json");
    let payload: FormData | Record<string, unknown>;
    let uploadedImages: SavedImage[] = [];

    if (isJsonRequest) {
      const body = await parseJsonBody(req);
      payload =
        body.form && typeof body.form === "object" && !Array.isArray(body.form)
          ? (body.form as Record<string, unknown>)
          : body;
      uploadedImages = normalizeClientImages(body.images);
    } else {
      const form = await parseMultipartForm(req);
      payload = form;
      const files = form
        .getAll("images")
        .filter((value): value is File => value instanceof File && value.size > 0);

      const cloudinary = parseCloudinaryConfig();

      for (const [index, file] of files.entries()) {
        const uploaded = await uploadToCloudinary(file, externalId, index, cloudinary);
        uploadedImages.push(uploaded);
      }
    }

    if (!uploadedImages.length) {
      return res.status(400).json({ error: "Dodaj przynajmniej jeden obraz" });
    }

    const features = featuresValue(payload);
    const market = textValue(payload, "market");
    const descriptionPl = nullableText(textValue(payload, "descriptionPl"));
    const descriptionEn = nullableText(textValue(payload, "descriptionEn"));
    const availableFrom = nullableText(textValue(payload, "availableFrom"));

    const insertPayload = {
      source: "ONESTA_FTP",
      external_id: externalId,
      complex_id: null,
      price: nullableNumber(textValue(payload, "price")),
      currency: "EUR",
      price_freq: null,
      part_ownership: null,
      leasehold: null,
      new_build: market ? market === "pierwotny" : null,
      type: nullableText(textValue(payload, "propertyType")),
      town: nullableText(textValue(payload, "city")),
      province: nullableText(textValue(payload, "coast")),
      country: nullableText(textValue(payload, "country")),
      developer: nullableText(textValue(payload, "developer")),
      investment_name: nullableText(textValue(payload, "investmentName")),
      ref,
      surface_built: nullableNumber(textValue(payload, "area")),
      surface_plot: null,
      latitude: null,
      longitude: null,
      beds: nullableInteger(textValue(payload, "bedrooms")),
      baths: nullableInteger(textValue(payload, "bathrooms")),
      pool: features.some((feature) => feature.toLowerCase().includes("basen")),
      urls: {},
      descriptions: {
        pl: descriptionPl,
        en: descriptionEn,
      },
      features,
      images: uploadedImages,
      date: availableFrom,
      updated_at: now.toISOString(),
      status: null,
      operation: null,
      title: nullableText(textValue(payload, "title")),
      distance_to_sea_m: nullableInteger(textValue(payload, "distanceToSeaM")),
      available_from: availableFrom,
      surface_usable: null,
      street: null,
      own_offer: true,
      remote_service: null,
      energy_usable: null,
      energy_final: null,
      energy_primary: null,
      co2_emission: null,
      renewable_energy_share: null,
      raw_parameters: null,
      raw_pictures: null,
      raw_payload: {
        created_by: userData.user.id,
        created_from: "onesari_manual_form",
      },
    };

    const { data, error } = await supabaseServer
      .from("properties")
      .insert(insertPayload)
      .select(propertySelect)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ property: data });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Nie udało się zapisać oferty",
    });
  }
}
