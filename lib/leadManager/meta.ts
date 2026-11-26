import { createHmac, timingSafeEqual } from "node:crypto";
import type { LmSettings } from "./settings";

// Meta Lead Ads: weryfikacja podpisu webhooka, odczyt leada z Graph API, rozbiór ankiety.
export type LmFormAnswer = { label: string; values: string[] };
export type LmIncomingLead = {
  name: string;
  phone: string;
  email?: string;
  campaignName?: string;
  formName?: string;
  source: "meta" | "diagnostic";
  metaLeadId?: string;
  metaFormId?: string;
  metaPageId?: string;
  formAnswers: LmFormAnswer[];
};

type MetaField = { name?: string; values?: string[] };
export type MetaLeadReference = { leadgenId: string; formId?: string; pageId?: string };

export function validateMetaSignature(rawBody: string, signatureHeader: string | null | undefined, appSecret: string) {
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) return false;
  const received = signatureHeader.slice("sha256=".length);
  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function extractMetaLeadReferences(payload: unknown): MetaLeadReference[] {
  if (!payload || typeof payload !== "object") return [];
  const entries = (payload as { entry?: unknown[] }).entry;
  if (!Array.isArray(entries)) return [];
  const references: MetaLeadReference[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const pageId = String((entry as { id?: unknown }).id || "") || undefined;
    const changes = (entry as { changes?: unknown[] }).changes;
    if (!Array.isArray(changes)) continue;
    for (const change of changes) {
      const typed = change as { field?: unknown; value?: { leadgen_id?: unknown; form_id?: unknown; page_id?: unknown } };
      if (!typed || typed.field !== "leadgen" || !typed.value?.leadgen_id) continue;
      references.push({
        leadgenId: String(typed.value.leadgen_id),
        formId: typed.value.form_id ? String(typed.value.form_id) : undefined,
        pageId: typed.value.page_id ? String(typed.value.page_id) : pageId,
      });
    }
  }
  return references;
}

export function normalizeMetaFieldName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const NAME_FULL = ["full_name", "name", "imie_i_nazwisko", "imie_nazwisko", "nazwisko_i_imie"];
const NAME_FIRST = ["first_name", "imie"];
const NAME_LAST = ["last_name", "nazwisko"];
const PHONE = ["phone_number", "phone", "numer_telefonu", "telefon", "nr_telefonu", "telefon_kontaktowy"];
const EMAIL = ["email", "e_mail", "adres_e_mail", "adres_email", "work_email"];
const CONTACT_FIELDS = new Set([...NAME_FULL, ...NAME_FIRST, ...NAME_LAST, ...PHONE, ...EMAIL]);

function first(fields: Map<string, string[]>, keys: string[]) {
  for (const key of keys) {
    const value = fields.get(key)?.[0]?.trim();
    if (value) return value;
  }
  return undefined;
}

function answerLabel(name: string) {
  const label = name.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  return label ? `${label.charAt(0).toLocaleUpperCase("pl-PL")}${label.slice(1)}` : "Odpowiedź";
}

// Odpowiedzi „Tak_mam_gotówkę” → „Tak mam gotówkę”
function answerValue(value: string) {
  return value.trim().replace(/_/g, " ").replace(/\s+/g, " ");
}

export function parseMetaFieldData(fieldData: MetaField[]) {
  const fields = new Map<string, string[]>();
  for (const field of fieldData) {
    if (field.name && Array.isArray(field.values)) fields.set(normalizeMetaFieldName(field.name), field.values.map(String));
  }
  const name =
    first(fields, NAME_FULL) ||
    [first(fields, NAME_FIRST), first(fields, NAME_LAST)].filter(Boolean).join(" ") ||
    "Nowy kontakt z Facebooka";
  const formAnswers: LmFormAnswer[] = fieldData.flatMap((field) => {
    if (!field.name || CONTACT_FIELDS.has(normalizeMetaFieldName(field.name))) return [];
    const values = (field.values || []).map(String).map(answerValue).filter(Boolean);
    return values.length ? [{ label: answerLabel(field.name), values }] : [];
  });
  return { name, phone: first(fields, PHONE), email: first(fields, EMAIL), formAnswers };
}

async function graphGet(path: string, params: Record<string, string>, settings: LmSettings["meta"]) {
  if (!settings.pageAccessToken) throw new Error("Brak tokenu dostępu strony Meta (Page Access Token).");
  const url = new URL(`https://graph.facebook.com/${settings.graphApiVersion}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("access_token", settings.pageAccessToken);
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  const data = (await response.json().catch(() => null)) as any;
  if (!response.ok || data?.error) throw new Error(data?.error?.message || `Meta Graph API zwróciło HTTP ${response.status}.`);
  return data;
}

export async function fetchMetaLead(reference: MetaLeadReference, settings: LmSettings["meta"]): Promise<LmIncomingLead> {
  const data = await graphGet(
    encodeURIComponent(reference.leadgenId),
    { fields: "id,created_time,field_data,form_id,campaign_name,ad_name" },
    settings,
  ).catch(async (error) => {
    // campaign_name bywa niedostępne dla tokenu strony – wtedy pytamy o podstawowe pola
    if (String(error?.message || "").includes("campaign_name")) {
      return graphGet(encodeURIComponent(reference.leadgenId), { fields: "id,created_time,field_data,form_id" }, settings);
    }
    throw error;
  });
  const parsed = parseMetaFieldData(data?.field_data || []);
  if (!parsed.phone) throw new Error("Lead Meta nie zawiera numeru telefonu.");

  let formName: string | undefined;
  const formId = reference.formId || data?.form_id;
  if (formId) {
    formName = await graphGet(encodeURIComponent(formId), { fields: "name" }, settings)
      .then((form) => (form?.name ? String(form.name) : undefined))
      .catch(() => undefined);
  }

  return {
    name: parsed.name,
    phone: parsed.phone,
    email: parsed.email,
    campaignName: data?.campaign_name ? String(data.campaign_name) : undefined,
    formName,
    source: "meta",
    metaLeadId: reference.leadgenId,
    metaFormId: formId,
    metaPageId: reference.pageId,
    formAnswers: parsed.formAnswers,
  };
}

// Subskrypcja strony do aplikacji (bez niej Meta nie wysyła leadów na webhook, nawet z poprawnym Callback URL).
// Token w konfiguracji bywa tokenem użytkownika systemowego – wtedy strony i ich tokeny bierzemy z me/accounts.
type PageInfo = { id: string; name: string; accessToken: string };

async function listManagedPages(settings: LmSettings["meta"]): Promise<PageInfo[]> {
  const me = await graphGet("me", { fields: "id,name" }, settings);
  const accounts = await graphGet("me/accounts", { fields: "id,name,access_token", limit: "100" }, settings).catch(() => null);
  const pages = (Array.isArray(accounts?.data) ? accounts.data : []).map((page: any) => ({
    id: String(page?.id || ""),
    name: String(page?.name || ""),
    accessToken: String(page?.access_token || ""),
  }));
  // Token samej strony: me = strona, brak me/accounts
  return pages.length ? pages : [{ id: String(me?.id || ""), name: String(me?.name || ""), accessToken: settings.pageAccessToken }];
}

async function pageSubscribedApps(page: PageInfo, settings: LmSettings["meta"]) {
  const data = await graphGet(`${encodeURIComponent(page.id)}/subscribed_apps`, {}, { ...settings, pageAccessToken: page.accessToken });
  return (Array.isArray(data?.data) ? data.data : []).map((app: any) => ({
    id: String(app?.id || ""),
    name: String(app?.name || ""),
    fields: Array.isArray(app?.subscribed_fields) ? (app.subscribed_fields as unknown[]).map(String) : [],
  })) as Array<{ id: string; name: string; fields: string[] }>;
}

export async function getPageSubscriptions(settings: LmSettings["meta"]) {
  const pages = await listManagedPages(settings);
  return Promise.all(
    pages.map(async (page) => {
      try {
        const apps = await pageSubscribedApps(page, settings);
        const ours = apps.find((app) => settings.appId && app.id === settings.appId);
        return { id: page.id, name: page.name, apps, subscribed: Boolean(ours?.fields.includes("leadgen")), error: "" };
      } catch (error) {
        return { id: page.id, name: page.name, apps: [], subscribed: false, error: error instanceof Error ? error.message : "Błąd" };
      }
    }),
  );
}

export async function subscribePageToLeadgen(settings: LmSettings["meta"], pageId: string) {
  const pages = await listManagedPages(settings);
  const page = pages.find((item) => item.id === pageId);
  if (!page) throw new Error("Token nie ma dostępu do tej strony.");
  const url = new URL(`https://graph.facebook.com/${settings.graphApiVersion}/${encodeURIComponent(page.id)}/subscribed_apps`);
  url.searchParams.set("subscribed_fields", "leadgen");
  url.searchParams.set("access_token", page.accessToken);
  const response = await fetch(url, { method: "POST", signal: AbortSignal.timeout(12_000) });
  const data = (await response.json().catch(() => null)) as any;
  if (!response.ok || data?.error) throw new Error(data?.error?.message || `Meta Graph API zwróciło HTTP ${response.status}.`);
  return { ok: Boolean(data?.success), pageName: page.name };
}

export async function testMetaConnection(settings: LmSettings["meta"]) {
  const data = await graphGet("me", { fields: "id,name" }, settings);
  return { id: data?.id as string | undefined, name: data?.name as string | undefined };
}
