import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(410).json({
    error:
      "Import FTP został wyłączony. Oferty ONESTA są obsługiwane przez Supabase, a obrazy przez Cloudinary.",
  });
}
