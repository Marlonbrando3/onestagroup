const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Writable } = require("stream");
const { Client } = require("basic-ftp");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index);
    let value = trimmed.slice(index + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    apply: false,
    limit: 5,
    maxImages: 0,
    ref: "",
    source: "ONESTA_FTP",
  };

  for (const arg of args) {
    if (arg === "--apply") options.apply = true;
    if (arg.startsWith("--limit=")) options.limit = Number(arg.split("=")[1] || options.limit);
    if (arg.startsWith("--max-images=")) options.maxImages = Number(arg.split("=")[1] || 0);
    if (arg.startsWith("--ref=")) options.ref = arg.slice("--ref=".length);
    if (arg.startsWith("--source=")) options.source = arg.slice("--source=".length);
  }

  return options;
}

function parseCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) throw new Error("Missing CLOUDINARY_URL");

  const parsed = new URL(cloudinaryUrl);
  return {
    apiKey: decodeURIComponent(parsed.username),
    apiSecret: decodeURIComponent(parsed.password),
    cloudName: parsed.hostname,
  };
}

function getFtpFileName(image) {
  const rawUrl = typeof image === "string" ? image : image?.url;
  if (!rawUrl) return "";

  try {
    const parsed = new URL(rawUrl, "http://localhost");
    const file = parsed.searchParams.get("file");
    if (file) return file;
  } catch {}

  const match = rawUrl.match(/\/([^/?#]+\.(?:jpe?g|png|webp))(?:[?#].*)?$/i);
  return match?.[1] || "";
}

function isFtpProxyImage(image) {
  const rawUrl = typeof image === "string" ? image : image?.url;
  return typeof rawUrl === "string" && rawUrl.includes("/api/onesari/ftp-image");
}

function contentTypeFor(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function safeSegment(value) {
  return String(value || "property")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "property";
}

function fileBaseName(fileName) {
  return path.basename(fileName).replace(/\.[^.]+$/, "");
}

function signCloudinaryParams(params, apiSecret) {
  const payload = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

async function downloadFtpFile(fileName) {
  const host = process.env.ONESTA_FTP_HOST || "serwer141299.lh.pl";
  const user = process.env.ONESTA_FTP_USER;
  const password = process.env.ONESTA_FTP_PASSWORD;
  const imageDir = process.env.ONESTA_FTP_IMAGE_DIR || "images";

  if (!user || !password) {
    throw new Error("Missing ONESTA_FTP_USER or ONESTA_FTP_PASSWORD");
  }

  const chunks = [];
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });

  const client = new Client(30000);
  try {
    await client.access({ host, user, password, secure: false });
    await client.downloadTo(writable, `${imageDir.replace(/\/+$/, "")}/${fileName}`);
    return Buffer.concat(chunks);
  } finally {
    client.close();
  }
}

async function uploadToCloudinary(fileName, bytes, propertyRef, config) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `onesari/onesta-ftp/${safeSegment(propertyRef)}`;
  const publicId = safeSegment(fileBaseName(fileName));
  const signedParams = {
    folder,
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(signedParams, config.apiSecret);

  const form = new FormData();
  form.append("file", new Blob([bytes], { type: contentTypeFor(fileName) }), fileName);
  form.append("api_key", config.apiKey);
  form.append("folder", folder);
  form.append("overwrite", "true");
  form.append("public_id", publicId);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
    },
  );
  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(result.error || result)}`);
  }

  return result;
}

async function main() {
  loadEnv();
  const options = parseArgs();
  const cloudinary = parseCloudinaryConfig();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  let query = supabase
    .from("properties")
    .select("id,external_id,ref,source,images")
    .eq("source", options.source)
    .order("updated_at", { ascending: false })
    .limit(options.limit);

  if (options.ref) {
    query = query.or(`external_id.eq.${options.ref},ref.eq.${options.ref}`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data || []).filter((row) =>
    Array.isArray(row.images)
      ? row.images.some(isFtpProxyImage)
      : isFtpProxyImage(row.images),
  );

  console.log(
    JSON.stringify(
      {
        mode: options.apply ? "apply" : "dry-run",
        target: "cloudinary",
        cloudName: cloudinary.cloudName,
        selectedRows: data?.length || 0,
        rowsWithFtpImages: rows.length,
        limit: options.limit,
        ref: options.ref || null,
      },
      null,
      2,
    ),
  );

  for (const row of rows) {
    const images = Array.isArray(row.images) ? row.images : [row.images];
    const nextImages = [];
    let changed = false;
    let migratedCount = 0;
    const propertyRef = String(row.external_id || row.ref || row.id || "");

    for (const image of images) {
      if (!isFtpProxyImage(image)) {
        nextImages.push(image);
        continue;
      }

      if (options.maxImages && migratedCount >= options.maxImages) {
        nextImages.push(image);
        continue;
      }

      const fileName = getFtpFileName(image);
      if (!fileName) {
        nextImages.push(image);
        continue;
      }

      console.log(`Migrating ${propertyRef}: ${fileName}`);

      if (!options.apply) {
        nextImages.push(image);
        migratedCount += 1;
        continue;
      }

      const bytes = await downloadFtpFile(fileName);
      const uploaded = await uploadToCloudinary(fileName, bytes, propertyRef, cloudinary);

      nextImages.push({
        ...(typeof image === "string" ? {} : image),
        url: uploaded.secure_url || uploaded.url,
        provider: "cloudinary",
        cloudinary_asset_id: uploaded.asset_id,
        cloudinary_public_id: uploaded.public_id,
        cloudinary_version: uploaded.version,
        original_ftp_file: fileName,
        original_ftp_url: typeof image === "string" ? image : image?.url,
      });
      changed = true;
      migratedCount += 1;
    }

    if (!options.apply) continue;
    if (!changed) continue;

    const update = await supabase
      .from("properties")
      .update({ images: nextImages })
      .eq("id", row.id);

    if (update.error) throw update.error;
    console.log(`Updated ${propertyRef}: ${migratedCount} image(s)`);
  }

  console.log("Done");
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
