import type { NextApiResponse } from "next";

export function isOnesariEnabled() {
  return process.env.ONESARI_ENABLED === "true" || process.env.NODE_ENV !== "production";
}

export function rejectDisabledOnesari(res: NextApiResponse) {
  return res.status(404).json({ error: "Not found" });
}
