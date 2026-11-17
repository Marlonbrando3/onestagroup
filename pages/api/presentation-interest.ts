import type { NextApiRequest, NextApiResponse } from "next";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";

// Przycisk „Interesuje mnie ta oferta” w prezentacji /oferty/[token].
// Klient nic nie wpisuje — wysyłamy mail do agenta, który przygotował prezentację:
// nazwa prezentacji (np. „Oferty dla pana Marka”), numer oferty z bazy (MTI-…), nr z feedu, link.
// Ta sama skrzynka i serwer SMTP (LH.pl) co pozostałe formularze (FROM_EMAIL / EMAIL_PASS).
const FALLBACK_EMAIL = "biuro@onesta.com.pl";
const REPEAT_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number>();

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const validEmail = (value: unknown) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? value.trim() : "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false });
  }
  if (!supabaseServer) return res.status(500).json({ success: false });

  const body = (req.body ?? {}) as Record<string, unknown>;
  const token = await resolvePublicOfferListToken(body.token);
  const offerId = String(body.offerId ?? "").trim().slice(0, 120);
  if (!token || !offerId) return res.status(400).json({ success: false });

  const { data: presentation, error } = await supabaseServer
    .from("agent_offer_lists")
    .select("offers,presentation_name,agent_name,agent_email,contact_name,contact_email")
    .eq("public_token", token)
    .maybeSingle();
  if (error || !presentation || !Array.isArray(presentation.offers)) {
    return res.status(404).json({ success: false });
  }

  const offer = (presentation.offers as any[]).find((item) => String(item?.external_id) === offerId);
  if (!offer) return res.status(404).json({ success: false });

  // Ten sam klik powtórzony w krótkim czasie — nie wysyłamy drugiego maila.
  const key = `${token}:${offerId}`;
  const now = Date.now();
  if ((recent.get(key) || 0) > now - REPEAT_WINDOW_MS) return res.status(200).json({ success: true });

  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;
  if (!fromEmail || !pass) {
    console.error("presentation-interest: brak FROM_EMAIL / EMAIL_PASS");
    return res.status(500).json({ success: false });
  }

  const recipients = [
    ...new Set([validEmail(presentation.agent_email), validEmail(presentation.contact_email)].filter(Boolean)),
  ];
  if (!recipients.length) recipients.push(FALLBACK_EMAIL);

  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "onesta.com.pl");
  const proto = host.startsWith("localhost") ? "http" : "https";
  const offerUrl = `${proto}://${host}/oferty/${encodeURIComponent(token)}/${encodeURIComponent(offerId)}`;
  const presentationUrl = `${proto}://${host}/oferty/${encodeURIComponent(token)}`;

  const presentationName = String(presentation.presentation_name || "").trim() || "prezentacja bez nazwy";
  const price = Number(offer.price) ? `${Number(offer.price).toLocaleString("pl-PL")} €` : "—";
  const location = [offer.town, offer.province].filter(Boolean).join(", ") || "—";
  const when = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });

  const rows: [string, string][] = [
    ["Prezentacja", presentationName],
    ["Numer oferty", offerId],
    ["Nr z feedu", String(offer.ref || "—")],
    ["Oferta", String(offer.title || "—")],
    ["Lokalizacja", location],
    ["Cena", price],
    ["Kliknięto", when],
  ];

  const html =
    `<p>Klient kliknął <strong>„Interesuje mnie ta oferta”</strong> w prezentacji ` +
    `<strong>${escapeHtml(presentationName)}</strong>.</p>` +
    `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows
      .map(([k, v]) => `<tr><td style="color:#657475">${escapeHtml(k)}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
      .join("") +
    `</table>` +
    `<p><a href="${escapeHtml(offerUrl)}">Zobacz ofertę w prezentacji</a> · ` +
    `<a href="${escapeHtml(presentationUrl)}">Cała prezentacja</a></p>` +
    `<p style="color:#657475;font-size:12px">Klient czeka na więcej informacji o tej ofercie.</p>`;

  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "mail-serwer141299.lh.pl",
    secure: true,
    tls: { ciphers: "SSLv3" },
    auth: { user: fromEmail, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Onesta — prezentacje" <${fromEmail}>`,
      to: recipients.join(", "),
      subject: `Zainteresowanie ofertą ${offerId} — ${presentationName}`,
      html,
    });
    recent.set(key, now);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("presentation-interest: wysyłka nie powiodła się", err);
    return res.status(500).json({ success: false });
  }
}
