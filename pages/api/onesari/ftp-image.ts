import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "basic-ftp";

export const config = {
  api: {
    responseLimit: false,
  },
};

const ALLOWED_IMAGE = /^[a-zA-Z0-9._-]+\.(jpe?g|png|webp)$/i;

function contentTypeFor(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const file = String(req.query.file || "");
  if (!ALLOWED_IMAGE.test(file)) {
    return res.status(400).json({ error: "Nieprawidłowa nazwa pliku" });
  }

  const host = process.env.ONESTA_FTP_HOST || "serwer141299.lh.pl";
  const user = process.env.ONESTA_FTP_USER;
  const password = process.env.ONESTA_FTP_PASSWORD;
  const imageDir = process.env.ONESTA_FTP_IMAGE_DIR || "images";

  if (!user || !password) {
    return res.status(500).json({ error: "Brak konfiguracji FTP" });
  }

  const remotePath = `${imageDir.replace(/\/+$/, "")}/${file}`;
  const client = new Client(30000);

  try {
    await client.access({
      host,
      user,
      password,
      secure: false,
    });

    res.setHeader("Content-Type", contentTypeFor(file));
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    if (req.method === "HEAD") {
      res.status(200).end();
      return;
    }

    await client.downloadTo(res, remotePath);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(404).json({
        error: "Nie udało się pobrać obrazu z FTP",
        details: error?.message ?? String(error),
      });
    } else {
      res.end();
    }
  } finally {
    client.close();
  }
}
