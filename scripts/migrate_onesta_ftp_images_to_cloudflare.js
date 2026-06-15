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

async function uploadToCloudflare(fileName, bytes, metadata) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_IMAGES_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !token) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_IMAGES_API_TOKEN");
  }

  const form = new FormData();
  form.append("file", new Blob([bytes], { type: contentTypeFor(fileName) }), fileName);
  form.append("metadata", JSON.stringify(metadata));

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    },
  );
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(`Cloudflare upload failed: ${JSON.stringify(result.errors || result)}`);
  }

  return result.result;
}

async function main() {
  loadEnv();
  const options = parseArgs();

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

      console.log(`Migrating ${row.external_id || row.ref}: ${fileName}`);

      if (!options.apply) {
        nextImages.push(image);
        migratedCount += 1;
        continue;
      }

      const bytes = await downloadFtpFile(fileName);
      const uploaded = await uploadToCloudflare(fileName, bytes, {
        source: "onesta-ftp",
        property: String(row.external_id || row.ref || ""),
        originalFile: fileName,
      });

      const cloudflareUrl = uploaded.variants?.[0] || "";
      nextImages.push({
        ...(typeof image === "string" ? {} : image),
        url: cloudflareUrl,
        provider: "cloudflare_images",
        cloudflare_id: uploaded.id,
        cloudflare_variants: uploaded.variants || [],
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
    console.log(`Updated ${row.external_id || row.ref}: ${migratedCount} image(s)`);
  }

  console.log("Done");
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
