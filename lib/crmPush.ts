import webpush from "web-push";
import { normalizeCrmEmail } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

// Powiadomienia push aplikacji Onesta CRM (PWA).
// Zmienne: NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, opcjonalnie VAPID_SUBJECT.

// Ograniczenie powiadomień do wybranych osób (pusta lista = wszyscy użytkownicy CRM).
// Od 25.11.2026 włączone dla wszystkich.
export const CRM_PUSH_TEST_USERS: string[] = [];

export type CrmPushPayload = { title: string; body: string; url?: string; tag?: string };

let configured = false;
export function isPushConfigured() {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:marek.marszalek@onesta.com.pl",
    publicKey,
    privateKey,
  );
  configured = true;
  return true;
}

export function isPushEnabledFor(email: string) {
  const normalized = normalizeCrmEmail(email);
  return !CRM_PUSH_TEST_USERS.length || CRM_PUSH_TEST_USERS.includes(normalized);
}

export async function sendCrmPush(email: string, payload: CrmPushPayload) {
  const normalized = normalizeCrmEmail(email);
  if (!supabaseServer || !isPushEnabledFor(normalized) || !isPushConfigured()) return 0;
  const { data: subscriptions } = await supabaseServer
    .from("crm_push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_email", normalized);
  let sent = 0;
  for (const subscription of subscriptions || []) {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
        JSON.stringify(payload),
        { TTL: 60 * 60 },
      );
      sent += 1;
      await supabaseServer
        .from("crm_push_subscriptions")
        .update({ last_success_at: new Date().toISOString() })
        .eq("id", subscription.id);
    } catch (error: any) {
      // Telefon wyrejestrował powiadomienia albo aplikacja została usunięta – sprzątamy zapis.
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await supabaseServer.from("crm_push_subscriptions").delete().eq("id", subscription.id);
      } else {
        console.error("crm push: błąd wysyłki", error?.statusCode, error?.body || error?.message);
      }
    }
  }
  return sent;
}

// Wysyłka tylko raz dla danego klucza (np. przypomnienie o konkretnym zadaniu).
export async function sendCrmPushOnce(key: string, email: string, payload: CrmPushPayload) {
  if (!supabaseServer) return 0;
  const { error } = await supabaseServer
    .from("crm_push_log")
    .insert({ key, user_email: normalizeCrmEmail(email) });
  if (error) return 0; // już wysłane (klucz istnieje)
  return sendCrmPush(email, payload);
}
