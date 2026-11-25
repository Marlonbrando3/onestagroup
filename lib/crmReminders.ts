import { CRM_PUSH_TEST_USERS, sendCrmPush, sendCrmPushOnce } from "@/lib/crmPush";
import { supabaseServer } from "@/lib/supabaseClient";
import { getCrmUserSettings } from "@/lib/crmUserSettings";
import type { CrmNotificationSettings } from "@/components/crm/notificationSettings";

// Automatyczne powiadomienia CRM uruchamiane co 5 minut (netlify/functions/crm-reminders.mts).
// Każda osoba ma własne ustawienia (/crm/konto → crm_user_settings).

function leadText(diff: number, time: string) {
  if (diff <= 0) return "Teraz";
  if (diff < 60) return `Za ${diff} min`;
  if (diff >= 720) return `Jutro o ${time}`;
  const hours = Math.round(diff / 6) / 10;
  return `Za ${String(hours).replace(".", ",")} godz.`;
}

function warsawNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return { date, minutes };
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export async function runCrmReminders() {
  if (!supabaseServer) return { reminders: 0, summaries: 0 };
  const now = warsawNow();
  let reminders = 0;
  let summaries = 0;

  const { data: activities } = await supabaseServer
    .from("crm_activities")
    .select("id,contact_id,type,title,due_date,due_time,status")
    .eq("status", "planned")
    .lte("due_date", addDays(now.date, 1));
  const planned = activities || [];
  if (!planned.length) return { reminders, summaries };

  const contactIds = Array.from(new Set(planned.map((item) => item.contact_id)));
  const { data: contacts } = await supabaseServer
    .from("crm_contacts")
    .select("id,name,pipeline_owner")
    .in("id", contactIds);
  const contactById = new Map((contacts || []).map((row) => [row.id, row]));
  const settingsCache = new Map<string, CrmNotificationSettings>();
  async function settingsFor(email: string) {
    if (!settingsCache.has(email)) settingsCache.set(email, await getCrmUserSettings(email));
    return settingsCache.get(email)!;
  }
  const tomorrow = addDays(now.date, 1);

  // 1. Przypomnienia przed zadaniem z godziną – wyprzedzenie wg ustawień danego rodzaju zadania
  for (const activity of planned) {
    if (!activity.due_time || (activity.due_date !== now.date && activity.due_date !== tomorrow)) continue;
    const contact = contactById.get(activity.contact_id);
    if (!contact?.pipeline_owner) continue;
    const reminder = (await settingsFor(contact.pipeline_owner)).reminders[activity.type];
    if (!reminder?.enabled) continue;
    const [hour, minute] = String(activity.due_time).split(":").map(Number);
    const dueMinutes = (activity.due_date === tomorrow ? 1440 : 0) + hour * 60 + minute;
    const diff = dueMinutes - now.minutes;
    if (diff > reminder.minutesBefore || diff < -5) continue;
    const time = String(activity.due_time).slice(0, 5);
    reminders += await sendCrmPushOnce(
      `reminder:${activity.id}:${activity.due_date}:${time}`,
      contact.pipeline_owner,
      {
        title: `${leadText(diff, time)}: ${activity.title}`,
        body: `${contact.name || "Klient"} · ${activity.type} · ${time}`,
        url: `/crm/kontakt/${activity.contact_id}`,
        tag: `reminder-${activity.id}`,
      },
    );
  }

  // 2. Poranne podsumowanie – o godzinie ustawionej przez daną osobę
  {
    const perUser = new Map<string, { today: number; overdue: number }>();
    for (const activity of planned) {
      if (!activity.due_date || activity.due_date > now.date) continue;
      const owner = contactById.get(activity.contact_id)?.pipeline_owner;
      if (!owner) continue;
      const counts = perUser.get(owner) || { today: 0, overdue: 0 };
      if (activity.due_date === now.date) counts.today += 1;
      else counts.overdue += 1;
      perUser.set(owner, counts);
    }
    for (const [email, counts] of perUser) {
      const summary = (await settingsFor(email)).summary;
      if (!summary.enabled) continue;
      const [summaryHour, summaryMinute] = summary.time.split(":").map(Number);
      const summaryAt = summaryHour * 60 + summaryMinute;
      if (now.minutes < summaryAt || now.minutes >= summaryAt + 180) continue;
      const total = counts.today + counts.overdue;
      summaries += await sendCrmPushOnce(`summary:${email}:${now.date}`, email, {
        title: `Dzień dobry! Masz dziś ${total} ${total === 1 ? "zadanie" : total < 5 ? "zadania" : "zadań"}`,
        body: counts.overdue
          ? `${counts.today} na dziś, ${counts.overdue} zaległe. Otwórz „Zadania na dziś”.`
          : `Wszystkie na dziś. Powodzenia! 🍀`,
        url: "/crm",
        tag: `summary-${now.date}`,
      });
    }
  }

  return { reminders, summaries, testUsers: CRM_PUSH_TEST_USERS };
}

// Aktywność klienta w prezentacji → powiadomienie do opiekuna klienta.
export async function notifyPresentationActivity(
  listId: string,
  type: "open" | "offer_view" | "interest",
  offerTitle?: string | null,
) {
  if (!supabaseServer) return;
  const { data: list } = await supabaseServer
    .from("agent_offer_lists")
    .select("crm_contact_id,presentation_name")
    .eq("id", listId)
    .maybeSingle();
  if (!list?.crm_contact_id) return;
  const { data: contact } = await supabaseServer
    .from("crm_contacts")
    .select("id,name,pipeline_owner")
    .eq("id", list.crm_contact_id)
    .maybeSingle();
  if (!contact?.pipeline_owner) return;
  const presentationSettings = (await getCrmUserSettings(contact.pipeline_owner)).presentation;
  const wanted =
    type === "interest" ? presentationSettings.interest : type === "offer_view" ? presentationSettings.offerView : presentationSettings.open;
  if (!wanted) return;
  const name = contact.name || "Klient";
  const title =
    type === "interest"
      ? `🔥 ${name}: „Interesuje mnie ta oferta”`
      : type === "offer_view"
        ? `👀 ${name} ogląda ofertę`
        : `👀 ${name} otworzył(a) prezentację`;
  const body =
    type === "open"
      ? `Prezentacja: ${list.presentation_name || "bez nazwy"}`
      : offerTitle || `Prezentacja: ${list.presentation_name || "bez nazwy"}`;
  await sendCrmPush(contact.pipeline_owner, {
    title,
    body,
    url: `/crm/kontakt/${contact.id}`,
    tag: `presentation-${contact.id}`,
  });
}
