import type { NextApiRequest, NextApiResponse } from "next";
import type { MailingBlock, MailingContent } from "@/components/crm/mailingTypes";
import { isCrmAdmin, normalizeCrmEmail } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

export const mailingMigrationMessage =
  "Brak tabel mailingu w Supabase. Uruchom scripts/crm_mailing_schema.sql w Supabase SQL Editor.";

export async function requireCrmAdmin(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseServer) {
    res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
    return null;
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Brak autoryzacji. Zaloguj się ponownie." });
    return null;
  }

  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Sesja wygasła albo jest nieprawidłowa." });
    return null;
  }

  if (!isCrmAdmin(data.user.email)) {
    res.status(403).json({ error: "Mailing jest dostępny wyłącznie dla administratora." });
    return null;
  }

  return { email: normalizeCrmEmail(data.user.email) };
}

export function handleMailingDatabaseError(
  res: NextApiResponse,
  error: { message: string; code?: string },
) {
  const message = error.message || "Nieznany błąd bazy danych.";
  const missingSchema =
    message.includes("Could not find the table") ||
    message.includes("crm_mailing_") ||
    message.includes("marketing_email_status") ||
    error.code === "42P01" ||
    error.code === "42703";
  return res.status(500).json({ error: missingSchema ? mailingMigrationMessage : message });
}

export function normalizeMailingContent(value: unknown): MailingContent {
  const blocks = Array.isArray((value as MailingContent | undefined)?.blocks)
    ? (value as MailingContent).blocks
    : [];
  return {
    blocks: blocks
      .filter((block): block is MailingBlock => Boolean(block && typeof block === "object"))
      .slice(0, 60)
      .map((block, index) => ({
        id: String(block.id || `block-${index}`),
        type: ["heading", "text", "button", "image", "divider"].includes(block.type)
          ? block.type
          : "text",
        text: String(block.text || "").slice(0, 12000),
        url: String(block.url || "").slice(0, 2000),
        align: ["left", "center", "right"].includes(String(block.align))
          ? block.align
          : "left",
      })),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value: string) {
  const url = value.trim();
  if (/^https?:\/\//i.test(url)) return escapeHtml(url);
  return "https://onesta.com.pl";
}

function renderBlock(block: MailingBlock) {
  const align = block.align || "left";
  const text = escapeHtml(block.text || "").replaceAll("\n", "<br />");
  if (block.type === "heading") {
    return `<h2 style="margin:0 0 18px;color:#17202a;font-size:28px;line-height:1.2;text-align:${align}">${text}</h2>`;
  }
  if (block.type === "button") {
    return `<div style="margin:8px 0 24px;text-align:${align}"><a href="${safeUrl(block.url || "")}" style="background:#216e63;border-radius:8px;color:#ffffff;display:inline-block;font-size:15px;font-weight:700;padding:13px 20px;text-decoration:none">${text || "Zobacz więcej"}</a></div>`;
  }
  if (block.type === "image") {
    return `<div style="margin:0 0 24px;text-align:${align}"><img alt="" src="${safeUrl(block.url || "")}" style="border:0;border-radius:8px;display:inline-block;height:auto;max-width:100%" /></div>`;
  }
  if (block.type === "divider") {
    return '<hr style="border:0;border-top:1px solid #d8dee7;margin:26px 0" />';
  }
  return `<p style="color:#344054;font-size:16px;line-height:1.65;margin:0 0 20px;text-align:${align}">${text}</p>`;
}

export function renderMailingHtml(content: MailingContent, previewText = "") {
  const body = normalizeMailingContent(content).blocks.map(renderBlock).join("");
  const hiddenPreview = escapeHtml(previewText);
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#f4f6f8;margin:0;padding:0"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${hiddenPreview}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8"><tr><td align="center" style="padding:30px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;max-width:640px"><tr><td style="padding:34px 34px 24px">${body}</td></tr><tr><td style="border-top:1px solid #eaecf0;color:#667085;font-size:12px;line-height:1.5;padding:22px 34px;text-align:center">Wiadomość od Onesta. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#216e63">Wypisz się z mailingu</a>.</td></tr></table></td></tr></table></body></html>`;
}

export async function resendJson<T>(path: string, init: RequestInit = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Brak RESEND_API_KEY. Dodaj klucz Resend w zmiennych środowiskowych.");
  }
  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers || {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as T & { message?: string; name?: string };
  if (!response.ok) {
    throw new Error(data.message || data.name || `Resend zwrócił błąd ${response.status}.`);
  }
  return data;
}

export function getMailingSender() {
  const email = String(process.env.MAILING_FROM_EMAIL || "").trim();
  const name = String(process.env.MAILING_FROM_NAME || "Marek z Onesta").trim();
  if (!email) {
    throw new Error("Brak MAILING_FROM_EMAIL w zmiennych środowiskowych.");
  }
  return { email, name, formatted: `${name} <${email}>` };
}

export function splitContactName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

export function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
