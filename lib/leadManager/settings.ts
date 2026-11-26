import { supabaseServer } from "@/lib/supabaseClient";

// Ustawienia Lead Managera (jeden wiersz w lm_settings). Tylko po stronie serwera.
export type LmSettings = {
  companyName: string;
  leadOwnerEmail: string;
  meta: {
    enabled: boolean;
    appId: string;
    appSecret: string;
    verifyToken: string;
    pageAccessToken: string;
    graphApiVersion: string;
  };
  sms: {
    enabled: boolean;
    simulationMode: boolean;
    apiToken: string;
    senderName: string;
    clientTemplate: string;
  };
  updatedAt: string | null;
};

export const LM_SECRET_FIELDS = ["meta.appSecret", "meta.pageAccessToken", "sms.apiToken"] as const;

function mapRow(row: any): LmSettings {
  return {
    companyName: row?.company_name || "Onesta Group",
    leadOwnerEmail: row?.lead_owner_email || "marek.marszalek@onesta.com.pl",
    meta: {
      enabled: Boolean(row?.meta_enabled),
      appId: row?.meta_app_id || "",
      appSecret: row?.meta_app_secret || "",
      verifyToken: row?.meta_verify_token || "",
      pageAccessToken: row?.meta_page_access_token || "",
      graphApiVersion: row?.meta_graph_api_version || "v26.0",
    },
    sms: {
      enabled: Boolean(row?.sms_enabled),
      simulationMode: row?.sms_simulation_mode !== false,
      apiToken: row?.sms_api_token || "",
      senderName: row?.sms_sender_name || "",
      clientTemplate: row?.sms_client_template || "",
    },
    updatedAt: row?.updated_at || null,
  };
}

export async function readLmSettings(): Promise<LmSettings> {
  if (!supabaseServer) throw new Error("Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji.");
  const { data, error } = await supabaseServer.from("lm_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return mapRow(data);
}

function mask(value: string) {
  if (!value) return "";
  return value.length <= 8 ? "••••" : `••••${value.slice(-4)}`;
}

// Widok dla przeglądarki: sekrety tylko jako maska („••••abcd”) + informacja, czy są ustawione.
export function publicLmSettings(settings: LmSettings) {
  return {
    ...settings,
    meta: {
      ...settings.meta,
      appSecret: mask(settings.meta.appSecret),
      pageAccessToken: mask(settings.meta.pageAccessToken),
      hasAppSecret: Boolean(settings.meta.appSecret),
      hasPageAccessToken: Boolean(settings.meta.pageAccessToken),
    },
    sms: {
      ...settings.sms,
      apiToken: mask(settings.sms.apiToken),
      hasApiToken: Boolean(settings.sms.apiToken),
    },
  };
}

const str = (value: unknown, max = 4000) => String(value ?? "").trim().slice(0, max);

// Zapis z formularza. Puste pole sekretu = bez zmian (żeby nie trzeba było go wpisywać ponownie).
export async function saveLmSettings(input: any) {
  if (!supabaseServer) throw new Error("Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji.");
  const meta = input?.meta || {};
  const sms = input?.sms || {};
  const appId = str(meta.appId, 64);
  if (appId && !/^\d{5,30}$/.test(appId)) {
    throw new Error("App ID to sam numer aplikacji z developers.facebook.com (np. 1234567890123456) – popraw to pole.");
  }
  const payload: Record<string, unknown> = {
    id: 1,
    company_name: str(input?.companyName, 120) || "Onesta Group",
    meta_enabled: Boolean(meta.enabled),
    meta_app_id: appId,
    meta_verify_token: str(meta.verifyToken, 200),
    meta_graph_api_version: /^v\d{1,3}\.\d$/.test(str(meta.graphApiVersion)) ? str(meta.graphApiVersion) : "v26.0",
    sms_enabled: Boolean(sms.enabled),
    sms_simulation_mode: sms.simulationMode !== false,
    sms_sender_name: str(sms.senderName, 11),
    sms_client_template: str(sms.clientTemplate, 1500),
    updated_at: new Date().toISOString(),
  };
  const isNewSecret = (value: unknown) => {
    const text = str(value, 2000);
    return text && !text.startsWith("••••") ? text : null;
  };
  const appSecret = isNewSecret(meta.appSecret);
  const pageAccessToken = isNewSecret(meta.pageAccessToken);
  const apiToken = isNewSecret(sms.apiToken);
  if (appSecret) payload.meta_app_secret = appSecret;
  if (pageAccessToken) payload.meta_page_access_token = pageAccessToken;
  if (apiToken) payload.sms_api_token = apiToken;
  if (meta.clearAppSecret) payload.meta_app_secret = "";
  if (meta.clearPageAccessToken) payload.meta_page_access_token = "";
  if (sms.clearApiToken) payload.sms_api_token = "";

  const { error } = await supabaseServer.from("lm_settings").upsert(payload);
  if (error) throw error;
  return readLmSettings();
}

export async function addLmLog(level: "info" | "success" | "error", title: string, detail?: string, leadId?: string) {
  if (!supabaseServer) return;
  await supabaseServer
    .from("lm_log")
    .insert({ level, title: title.slice(0, 300), detail: detail ? detail.slice(0, 2000) : null, lead_id: leadId || null });
}
