import type { NextApiRequest, NextApiResponse } from "next";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";
import { notifyPresentationActivity } from "@/lib/crmReminders";

// Przycisk „Interesuje mnie ta oferta” w prezentacji /oferty/[token].
// Klient nic nie wpisuje — wysyłamy mail do agenta, który przygotował prezentację:
// nazwa prezentacji (np. „Oferty dla pana Marka”), numer oferty z bazy (MTI-…), nr z feedu, link.
// Ta sama skrzynka i serwer SMTP (LH.pl) co pozostałe formularze (FROM_EMAIL / EMAIL_PASS).
const FALLBACK_EMAIL = "biuro@onesta.com.pl";
// Marek Marszałek dostaje powiadomienie o każdym kliknięciu — także z prezentacji innych agentów.
const ALWAYS_NOTIFY_EMAIL = "marek.marszalek@onesta.com.pl";
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
    .select("id,offers,presentation_name,agent_user_id,agent_name,agent_email,contact_name,contact_email")
    .eq("public_token", token)
    .maybeSingle();
  if (error || !presentation || !Array.isArray(presentation.offers)) {
    return res.status(404).json({ success: false });
  }

  let offer: any = (presentation.offers as any[]).find((item) => String(item?.external_id) === offerId);
  // Mieszkanie z listy „Dostępne mieszkania w tej inwestycji” — nie ma go w prezentacji, ale należy
  // do tej samej inwestycji (development_ref) co oferta z prezentacji (parentOfferId).
  const parentOfferId = String(body.parentOfferId ?? "").trim().slice(0, 120);
  if (!offer && parentOfferId && (presentation.offers as any[]).some((item) => String(item?.external_id) === parentOfferId)) {
    const { data: rows } = await supabaseServer
      .from("properties")
      .select("external_id,ref,title,price,town,province,development_ref")
      .in("external_id", [offerId, parentOfferId]);
    const unit = rows?.find((row: any) => String(row.external_id) === offerId);
    const parent = rows?.find((row: any) => String(row.external_id) === parentOfferId);
    if (unit && parent && unit.development_ref && unit.development_ref === parent.development_ref) {
      offer = { ...unit, title: unit.title || parent.title };
    }
  }
  if (!offer) return res.status(404).json({ success: false });

  // Ten sam klik powtórzony w krótkim czasie — nie wysyłamy drugiego maila.
  const key = `${token}:${offerId}`;
  const now = Date.now();
  if ((recent.get(key) || 0) > now - REPEAT_WINDOW_MS) return res.status(200).json({ success: true });

  // Powiadomienie w strefie agenta (dzwonek obok „Wyloguj”) dla agenta, który przygotował prezentację,
  // oraz kopia dla Marka, jeśli prezentację przygotował ktoś inny.
  const creatorEmail = validEmail(presentation.agent_email);
  const notification = {
    presentation_id: presentation.id,
    presentation_name: String(presentation.presentation_name || "").trim() || null,
    public_token: token,
    offer_external_id: offerId,
    offer_ref: offer.ref ? String(offer.ref) : null,
    offer_title: offer.title ? String(offer.title).slice(0, 300) : null,
    sent_by_name: String(presentation.agent_name || presentation.contact_name || "").trim() || creatorEmail || null,
  };
  const notificationRows: Record<string, unknown>[] = [
    { ...notification, kind: "offer_interest", agent_user_id: presentation.agent_user_id || null, agent_email: creatorEmail || null },
  ];
  if (creatorEmail.toLowerCase() !== ALWAYS_NOTIFY_EMAIL) {
    notificationRows.push({ ...notification, kind: "offer_interest_copy", agent_user_id: null, agent_email: ALWAYS_NOTIFY_EMAIL });
  }
  const { error: notifyError } = await supabaseServer.from("agent_notifications").insert(notificationRows);
  // Aktywność klienta widoczna też w CRM (historia kontaktu, dzwonek, sygnał w lejku).
  const { error: eventError } = await supabaseServer.from("presentation_events").insert({
    list_id: presentation.id,
    event_type: "interest",
    offer_external_id: offerId,
    offer_title: offer.title ? String(offer.title).slice(0, 300) : null,
  });
  if (eventError) console.error("presentation-interest: nie zapisano zdarzenia CRM", eventError);
  try {
    await notifyPresentationActivity(
      presentation.id,
      "interest",
      offer.title ? String(offer.title) : offerId,
    );
  } catch (pushError) {
    console.error("presentation-interest: push", pushError);
  }
  if (notifyError) console.error("presentation-interest: nie zapisano powiadomienia", notifyError);
  const notified = !notifyError;

  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;
  if (!fromEmail || !pass) {
    console.error("presentation-interest: brak FROM_EMAIL / EMAIL_PASS");
    if (notified) {
      recent.set(key, now);
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({ success: false });
  }

  // Mail idzie na adres podany w prezentacji (kontakt dla klienta) i do agenta, który ją utworzył.
  const recipients = [
    ...new Set(
      [validEmail(presentation.contact_email), validEmail(presentation.agent_email)]
        .filter(Boolean)
        .map((email) => email.toLowerCase()),
    ),
  ];
  if (!recipients.length) recipients.push(FALLBACK_EMAIL);

  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "onesta.com.pl");
  const proto = host.startsWith("localhost") ? "http" : "https";
  const offerUrl = `${proto}://${host}/oferty/${encodeURIComponent(token)}/${encodeURIComponent(offerId)}`;
  const presentationUrl = `${proto}://${host}/oferty/${encodeURIComponent(token)}`;

  const presentationName = String(presentation.presentation_name || "").trim() || "prezentacja bez nazwy";
  const price = Number(offer.price) ? `${Number(offer.price).toLocaleString("pl-PL")} €` : "";
  const location = [offer.town, offer.province].filter(Boolean).join(", ");
  const when = new Date().toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const editorUrl = `${proto}://${host}/agent/prezentacja/${encodeURIComponent(String(presentation.id))}`;
  const details = [location, price, offer.ref ? `nr z feedu: ${offer.ref}` : ""].filter(Boolean).join(" · ");

  // Ta sama treść co powiadomienie w strefie agenta.
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.55;color:#334155;max-width:560px">` +
    `<p style="margin:0 0 4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8e2430;font-weight:bold">Nowe powiadomienie</p>` +
    `<p style="margin:0 0 16px;font-size:16px;color:#182334">Prezentacja <strong>${escapeHtml(presentationName)}</strong>: ` +
    `klient kliknął <strong>„Interesuje mnie ta oferta”</strong>.</p>` +
    `<div style="border:1px solid #ead9d6;background:#fdf6f5;border-radius:12px;padding:14px 16px;margin:0 0 16px">` +
    `<p style="margin:0;font-size:16px;font-weight:bold"><a href="${escapeHtml(offerUrl)}" style="color:#182334">${escapeHtml(offerId)}</a></p>` +
    (offer.title ? `<p style="margin:4px 0 0">${escapeHtml(offer.title)}</p>` : "") +
    (details ? `<p style="margin:4px 0 0;font-size:12px;color:#657475">${escapeHtml(details)}</p>` : "") +
    `<p style="margin:8px 0 0;font-size:12px;color:#657475">${escapeHtml(when)}` +
    (presentation.agent_name ? ` · prezentację przygotował(a): ${escapeHtml(presentation.agent_name)}` : "") +
    `</p></div>` +
    `<p style="margin:0 0 6px"><a href="${escapeHtml(offerUrl)}" style="color:#8e2430;font-weight:bold">Zobacz ofertę w prezentacji</a> · ` +
    `<a href="${escapeHtml(presentationUrl)}" style="color:#8e2430">Cała prezentacja</a> · ` +
    `<a href="${escapeHtml(editorUrl)}" style="color:#8e2430">Otwórz w strefie agenta</a></p>` +
    `<p style="margin:12px 0 0;font-size:12px;color:#657475">Klient czeka na więcej informacji o tej ofercie.</p>` +
    `</div>`;

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
      subject: `Prezentacja ${presentationName}: klient zainteresowany ofertą ${offerId}`,
      html,
    });
    recent.set(key, now);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("presentation-interest: wysyłka nie powiodła się", err);
    if (notified) {
      recent.set(key, now);
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({ success: false });
  }
}
