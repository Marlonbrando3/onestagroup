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

const propertySelect =
  "id,external_id,ref,source,price,currency,type,town,province,country,surface_built,beds,baths,new_build,features,images,descriptions,date,updated_at,title,distance_to_sea_m,available_from,operation,status";

function textValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
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

function parseFeatures(value: string) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.map((feature) => String(feature).trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
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
    const form = await parseMultipartForm(req);
    const features = parseFeatures(textValue(form, "features"));
    const files = form
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!files.length) {
      return res.status(400).json({ error: "Dodaj przynajmniej jeden obraz" });
    }

    const now = new Date();
    const ref = `MAN-${now.getTime()}`;
    const externalId = `OW-${ref}`;
    const cloudinary = parseCloudinaryConfig();
    const uploadedImages = [];

    for (const [index, file] of files.entries()) {
      const uploaded = await uploadToCloudinary(file, externalId, index, cloudinary);
      uploadedImages.push(uploaded);
    }

    const market = textValue(form, "market");
    const descriptionPl = nullableText(textValue(form, "descriptionPl"));
    const descriptionEn = nullableText(textValue(form, "descriptionEn"));
    const availableFrom = nullableText(textValue(form, "availableFrom"));

    const insertPayload = {
      source: "ONESTA_FTP",
      external_id: externalId,
      complex_id: null,
      price: nullableNumber(textValue(form, "price")),
      currency: "EUR",
      price_freq: null,
      part_ownership: null,
      leasehold: null,
      new_build: market ? market === "pierwotny" : null,
      type: nullableText(textValue(form, "propertyType")),
      town: nullableText(textValue(form, "city")),
      province: nullableText(textValue(form, "coast")),
      country: nullableText(textValue(form, "country")),
      ref,
      surface_built: nullableNumber(textValue(form, "area")),
      surface_plot: null,
      latitude: null,
      longitude: null,
      beds: nullableInteger(textValue(form, "bedrooms")),
      baths: nullableInteger(textValue(form, "bathrooms")),
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
      title: nullableText(textValue(form, "title")),
      distance_to_sea_m: nullableInteger(textValue(form, "distanceToSeaM")),
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
