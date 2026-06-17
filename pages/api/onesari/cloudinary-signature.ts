import crypto from "crypto";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
};

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
    const files = Array.isArray(req.body?.files) ? req.body.files : [];
    if (!files.length) {
      return res.status(400).json({ error: "Dodaj przynajmniej jeden obraz" });
    }

    const cloudinary = parseCloudinaryConfig();
    const uploadBatchId =
      typeof req.body?.uploadBatchId === "string" && req.body.uploadBatchId.trim()
        ? req.body.uploadBatchId.trim()
        : `manual-${Date.now()}`;
    const folder = `onesari/onesta-ftp/${safeSegment(uploadBatchId)}`;
    const timestamp = Math.round(Date.now() / 1000);
    const uploads = files.map((file: any, index: number) => {
      const name = typeof file?.name === "string" && file.name.trim()
        ? file.name.trim()
        : `image-${index + 1}`;
      const publicId = `${String(index + 1).padStart(3, "0")}-${safeSegment(
        fileBaseName(name),
      )}`;
      const signedParams = {
        folder,
        overwrite: "true",
        public_id: publicId,
        timestamp,
      };

      return {
        folder,
        overwrite: "true",
        public_id: publicId,
        timestamp,
        signature: signCloudinaryParams(signedParams, cloudinary.apiSecret),
      };
    });

    return res.status(200).json({
      apiKey: cloudinary.apiKey,
      cloudName: cloudinary.cloudName,
      uploads,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Nie udało się podpisać uploadu Cloudinary",
    });
  }
}
