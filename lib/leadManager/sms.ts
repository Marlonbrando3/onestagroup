import type { LmSettings } from "./settings";

export type LmSmsResult = {
  provider: "smsapi" | "simulation";
  status: "sent" | "failed" | "simulated";
  recipient: string;
  message: string;
  providerMessageId?: string;
  error?: string;
};

export function renderTemplate(template: string, values: Record<string, string | undefined>) {
  return template.replace(/{{\s*([a-zA-Z]+)\s*}}/g, (_, key: string) => values[key] ?? "");
}

export function normalizeSmsPhone(phone: string) {
  const trimmed = String(phone || "").trim();
  const prefix = trimmed.startsWith("+") ? "+" : "";
  return `${prefix}${trimmed.replace(/\D/g, "")}`;
}

// Wysyłka przez SMSAPI (https://api.smsapi.pl). W trybie symulacji nic nie wychodzi.
export async function sendLmSms(input: {
  recipient: string;
  message: string;
  settings: LmSettings["sms"];
  deduplicationKey?: string;
}): Promise<LmSmsResult> {
  const base = { recipient: normalizeSmsPhone(input.recipient), message: input.message };
  const { settings } = input;
  if (settings.simulationMode) return { ...base, provider: "simulation", status: "simulated" };
  if (!settings.enabled) return { ...base, provider: "smsapi", status: "failed", error: "Wysyłka SMS jest wyłączona w ustawieniach." };
  if (!settings.apiToken) return { ...base, provider: "smsapi", status: "failed", error: "Brak tokenu API SMSAPI." };
  if (!base.recipient) return { ...base, provider: "smsapi", status: "failed", error: "Brak numeru odbiorcy." };

  const body = new URLSearchParams({ to: base.recipient, message: input.message, format: "json", encoding: "utf-8" });
  const idx = input.deduplicationKey?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 255);
  if (idx) {
    body.set("idx", idx);
    body.set("check_idx", "1");
  }
  if (settings.senderName.trim()) body.set("from", settings.senderName.trim());

  try {
    const response = await fetch("https://api.smsapi.pl/sms.do", {
      method: "POST",
      headers: { Authorization: `Bearer ${settings.apiToken}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(12_000),
    });
    const data = (await response.json().catch(() => null)) as
      | { list?: Array<{ id?: string }>; error?: number; message?: string }
      | null;
    if (!response.ok || data?.error) throw new Error(data?.message || `SMSAPI zwróciło kod HTTP ${response.status}.`);
    return { ...base, provider: "smsapi", status: "sent", providerMessageId: data?.list?.[0]?.id };
  } catch (error) {
    return { ...base, provider: "smsapi", status: "failed", error: error instanceof Error ? error.message : "Nieznany błąd SMSAPI." };
  }
}
