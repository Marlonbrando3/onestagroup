import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(410).json({
    error:
      "Proxy obrazów FTP został wyłączony. Obrazy ofert są obsługiwane przez Cloudinary.",
  });
}
