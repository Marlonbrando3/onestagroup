import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(410).json({
    error:
      "Zapis ofert do lokalnego pliku został wyłączony. Dane należy zapisywać w Supabase.",
  });
}
