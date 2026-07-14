import crypto from "crypto";
import nodemailer from "nodemailer";
import {
  encryptNewsletterArchive,
  NEWSLETTER_CONSENT_VERSION,
  NEWSLETTER_EMAIL_TEMPLATE_VERSION,
  normalizeNewsletterEmail,
} from "@/lib/newsletterDoubleOptIn";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export async function sendNewsletterConfirmationEmail(input: {
  subscriptionId: string;
  email: string;
  name: string;
  token: string;
  baseUrl: string;
  introduction?: string;
}) {
  const confirmationUrl = `${input.baseUrl}/newsletter/potwierdz?token=${encodeURIComponent(input.token)}`;
  const safeName = escapeHtml(input.name);
  const safeUrl = escapeHtml(confirmationUrl);
  const introduction =
    input.introduction ||
    "Otrzymaliśmy prośbę o zapisanie tego adresu do newslettera Onesta. Otwórz stronę potwierdzenia i wykonaj ostatni krok.";
  const subject = "Potwierdź zapis do newslettera Onesta";
  const text = `Cześć ${input.name},\n\n${introduction}\n\nPotwierdź zapis, otwierając poniższy link, a następnie klikając przycisk „Potwierdzam zapis”:\n\n${confirmationUrl}\n\nLink jest jednorazowy i ważny przez 24 godziny. Jeśli to nie Ty, zignoruj wiadomość.`;
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#f4f1eb;margin:0;padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e5dac7;max-width:620px"><tr><td style="background:#182334;color:#ffffff;padding:28px 34px"><p style="color:#d8b66a;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;margin:0;text-transform:uppercase">Newsletter Onesta</p><h1 style="font-family:Georgia,serif;font-size:30px;font-weight:500;line-height:1.2;margin:12px 0 0">Potwierdź swój zapis</h1></td></tr><tr><td style="color:#344054;font-family:Arial,sans-serif;font-size:16px;line-height:1.65;padding:34px"><p style="margin:0 0 18px">Cześć ${safeName},</p><p style="margin:0 0 24px">${escapeHtml(introduction)}</p><p style="margin:0 0 28px;text-align:center"><a href="${safeUrl}" style="background:#182334;color:#ffffff;display:inline-block;font-size:13px;font-weight:700;letter-spacing:1.4px;padding:15px 24px;text-decoration:none;text-transform:uppercase">Otwórz potwierdzenie</a></p><p style="color:#667085;font-size:13px;margin:0 0 10px">Link jest jednorazowy i ważny przez 24 godziny. Samo otwarcie linku nie aktywuje subskrypcji — na stronie trzeba świadomie potwierdzić zgodę.</p><p style="color:#667085;font-size:13px;margin:0">Jeśli to nie Ty, zignoruj tę wiadomość. Nie wyślemy newslettera bez potwierdzenia.</p></td></tr></table></td></tr></table></body></html>`;
  const emailContentHash = crypto
    .createHash("sha256")
    .update(`${text}\n---HTML---\n${html}`)
    .digest("hex");

  const fromEmail = String(process.env.FROM_EMAIL || "").trim();
  const password = String(process.env.EMAIL_PASS || "");
  if (!fromEmail || !password) throw new Error("Brak konfiguracji SMTP.");
  const transporter = nodemailer.createTransport({
    host: "mail-serwer141299.lh.pl",
    port: 465,
    secure: true,
    auth: { user: fromEmail, pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  const info = await transporter.sendMail({
    from: `Onesta <${fromEmail}>`,
    to: input.email,
    subject,
    text,
    html,
    headers: {
      "X-Onesta-Subscription-ID": input.subscriptionId,
      "X-Onesta-Consent-Version": NEWSLETTER_CONSENT_VERSION,
    },
  });
  const accepted = stringList(info.accepted);
  const rejected = stringList(info.rejected);
  if (!accepted.map(normalizeNewsletterEmail).includes(normalizeNewsletterEmail(input.email))) {
    throw new Error("Serwer SMTP nie potwierdził przyjęcia wiadomości dla odbiorcy.");
  }
  return {
    subject,
    text,
    html,
    confirmationUrl,
    emailContentHash,
    accepted,
    rejected,
    messageId: String(info.messageId || ""),
    smtpResponse: String(info.response || ""),
    envelope: info.envelope || {},
    sentAt: new Date().toISOString(),
    archive: encryptNewsletterArchive({ subject, text, html }),
    templateVersion: NEWSLETTER_EMAIL_TEMPLATE_VERSION,
  };
}
