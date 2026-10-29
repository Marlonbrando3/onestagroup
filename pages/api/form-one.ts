import type { NextApiRequest, NextApiResponse } from "next";

// Zgłoszenia z landingu /form-one. Wysyłka przez tę samą skrzynkę i serwer SMTP (LH.pl),
// co pozostałe formularze na onesta.com.pl (FROM_EMAIL / EMAIL_PASS) — bez usług zewnętrznych.
// Odbiorca tylko tego landingu: Karolina Bakowicz.
const TO_EMAIL = "k.bakowicz@onesta.com.pl";

const clean = (value: unknown, max = 500) =>
  String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  // Pole-pułapka: wypełniają je tylko boty — udajemy sukces i nic nie wysyłamy.
  if (clean(body._honey)) return res.status(200).json({ success: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const budget = clean(body.budget, 200) || "Do ustalenia";
  const category = clean(body.category, 200) || "Strona główna";
  const offer = clean(body.offer, 60);
  const page = clean(body.page, 300);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  const consents = (body.consents ?? {}) as Record<string, unknown>;
  const rodo = consents.rodo === true;
  const marketing = consents.marketing === true;
  if (!rodo) {
    return res.status(400).json({ success: false, message: "Zaakceptuj politykę prywatności." });
  }

  if (!name || !/^[+0-9 ()\-]{7,30}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Podaj imię i nazwisko oraz poprawny numer telefonu.",
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Podaj poprawny adres e-mail." });
  }

  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;
  if (!fromEmail || !pass) {
    console.error("form-one: brak FROM_EMAIL / EMAIL_PASS");
    return res.status(500).json({ success: false, message: "MAIL_NOT_CONFIGURED" });
  }

  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "mail-serwer141299.lh.pl",
    secure: true,
    tls: { ciphers: "SSLv3" },
    auth: { user: fromEmail, pass },
  });

  const rows: [string, string][] = [
    ["Imię i nazwisko", name],
    ["Telefon", phone],
    ["E-mail", email || "—"],
    ["Budżet", budget],
    ["Kategoria", category],
    ["Oferta", offer || "—"],
    ["Strona", page || "—"],
    ["Polityka prywatności", "zaakceptowana"],
    ["Zgoda marketingowa", marketing ? "TAK" : "nie"],
    ["Data zgłoszenia", new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })],
  ];
  const html =
    `<h2 style="font-family:Arial,sans-serif">Nowe zapytanie z landingu /form-one</h2>` +
    `<table cellpadding="6" style="font-family:Arial,sans-serif;border-collapse:collapse">` +
    rows
      .map(([k, v]) => `<tr><td style="color:#657475">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
      .join("") +
    `</table>` +
    `<p style="font-family:Arial,sans-serif"><strong>Wiadomość:</strong><br>${
      message ? escapeHtml(message).replace(/\n/g, "<br>") : "—"
    }</p>`;
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nWiadomość:\n${message || "—"}`;

  try {
    await transporter.sendMail({
      from: `"Onesta — landing" <${fromEmail}>`,
      to: TO_EMAIL,
      replyTo: email || undefined,
      subject: `Onesta — zapytanie z landing page${offer ? ` (${offer})` : ""}: ${name}`,
      text,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("form-one: wysyłka nie powiodła się", err);
    return res.status(500).json({
      success: false,
      message: "Nie udało się wysłać zgłoszenia. Zadzwoń: +48 505 055 846.",
    });
  }
}
