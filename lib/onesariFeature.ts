import type { NextApiResponse } from "next";

export const onesariUsers = [
  "marek.marszalek@onesta.com.pl",
  "karolina@fenomen.nieruchomosci.pl",
];

export function isOnesariEnabled() {
  return true;
}

export function normalizeOnesariEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

export function canAccessOnesari(email?: string | null) {
  const normalizedEmail = normalizeOnesariEmail(email);
  return onesariUsers.some((user) => normalizeOnesariEmail(user) === normalizedEmail);
}

export function rejectDisabledOnesari(res: NextApiResponse) {
  return res.status(404).json({ error: "Not found" });
}
