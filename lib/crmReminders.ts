import { CRM_PUSH_TEST_USERS, sendCrmPush, sendCrmPushOnce } from "@/lib/crmPush";
import { supabaseServer } from "@/lib/supabaseClient";

// Automatyczne powiadomienia CRM uruchamiane co 5 minut (netlify/functions/crm-reminders.mts).
const REMIND_BEFORE_MIN = 15;
const MORNING_SUMMARY = { hour: 8, minute: 30 };

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

  // 1. Przypomnienie 15 min przed zadaniem z godziną (dzisiaj)
  for (const activity of planned) {
    if (activity.due_date !== now.date || !activity.due_time) continue;
    const [hour, minute] = String(activity.due_time).split(":").map(Number);
    const dueMinutes = hour * 60 + minute;
    const diff = dueMinutes - now.minutes;
    if (diff > REMIND_BEFORE_MIN || diff < -5) continue;
    const contact = contactById.get(activity.contact_id);
    if (!contact?.pipeline_owner) continue;
    const time = String(activity.due_time).slice(0, 5);
    reminders += await sendCrmPushOnce(
      `reminder:${activity.id}:${activity.due_date}:${time}`,
      contact.pipeline_owner,
      {
        title: diff > 0 ? `Za ${diff} min: ${activity.title}` : `Teraz: ${activity.title}`,
        body: `${contact.name || "Klient"} · ${activity.type} · ${time}`,
        url: `/crm/kontakt/${activity.contact_id}`,
        tag: `reminder-${activity.id}`,
      },
    );
  }

  // 2. Poranne podsumowanie (od 8:30)
  if (now.minutes >= MORNING_SUMMARY.hour * 60 + MORNING_SUMMARY.minute && now.minutes < 12 * 60) {
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
