import { supabaseServer } from "@/lib/supabaseClient";
import { sendCrmPush } from "@/lib/crmPush";
import { insertLmEvent, readLmTrackingToken } from "./tracking";
import { hasTrackingConsent, recordConsent, TRACKING_CONSENT_WORDING } from "@/lib/consents";

// Czat ofertowy: link z SMS-a powitalnego → /czat/<token> → 2 pytania jednokrotnego wyboru →
// wzorzec prezentacji z puli z kluczem leada w linku (?k=…). Wzorzec NIE jest przypisywany do klienta –
// tylko jego aktywność trafia do karty w CRM. Dedykowane prezentacje przypisuje się ręcznie po rozmowie.

export type ChatOption = { id: string; label: string };
export type ChatQuestion = { id: string; text: string; options: ChatOption[] };
export type ChatConfig = {
  enabled: boolean;
  agentName: string;
  agentSubtitle: string;
  greeting: string;
  questions: ChatQuestion[];
  rules: Record<string, string>; // "opcja1|opcja2" → id prezentacji z puli
  defaultListId: string;
  finalText: string;
};

export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  enabled: true,
  agentName: "Asystent Onesta",
  agentSubtitle: "automatyczny asystent · odpowiada od razu",
  greeting:
    "Dzień dobry{{firstName}}! 👋\nDziękuję za zgłoszenie. Jesteśmy teraz poza biurem, ale zadbaliśmy o to, żebyś już teraz otrzymał wstępnie dobrane oferty. Odpowiedz tylko na dwa krótkie pytania.",
  questions: [
    {
      id: "budzet",
      text: "Jaki budżet planujesz przeznaczyć na zakup?",
      options: [
        { id: "300-400", label: "300–400 tys. €" },
        { id: "400-500", label: "400–500 tys. €" },
        { id: "500plus", label: "powyżej 500 tys. €" },
      ],
    },
    {
      id: "region",
      text: "Który region Cię interesuje?",
      options: [
        { id: "costa-blanca", label: "Costa Blanca" },
        { id: "costa-del-sol", label: "Costa del Sol" },
        { id: "obojetnie", label: "Jeszcze nie wiem" },
      ],
    },
  ],
  rules: {},
  defaultListId: "",
  finalText: "Gotowe! Oto wstępnie dobrane oferty dopasowane do Twoich odpowiedzi. Doradca Onesta zadzwoni do Ciebie, gdy tylko wróci do biura 🙂",
};

const str = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const slug = (value: unknown) => String(value ?? "").trim().slice(0, 40).replace(/[^a-z0-9_-]/gi, "");

export function normalizeChatConfig(input: any): ChatConfig {
  const base = DEFAULT_CHAT_CONFIG;
  const questions: ChatQuestion[] = (Array.isArray(input?.questions) ? input.questions : base.questions)
    .slice(0, 2)
    .map((question: any, index: number) => ({
      id: slug(question?.id) || `q${index + 1}`,
      text: str(question?.text, 300) || base.questions[index]?.text || "Pytanie",
      options: (Array.isArray(question?.options) ? question.options : [])
        .slice(0, 8)
        .map((option: any, optionIndex: number) => ({
          id: slug(option?.id) || `o${optionIndex + 1}`,
          label: str(option?.label, 80),
        }))
        .filter((option: ChatOption) => option.label),
    }));
  const rules: Record<string, string> = {};
  if (input?.rules && typeof input.rules === "object") {
    for (const [key, value] of Object.entries(input.rules)) {
      const id = str(value, 60);
      if (/^[0-9a-f-]{36}$/i.test(id) && /^[a-z0-9_|-]{1,90}$/i.test(key)) rules[key] = id;
    }
  }
  const defaultListId = str(input?.defaultListId, 60);
  return {
    enabled: input?.enabled !== false,
    agentName: str(input?.agentName, 80) || base.agentName,
    agentSubtitle: str(input?.agentSubtitle, 120),
    greeting: str(input?.greeting, 1000) || base.greeting,
    questions: questions.length === 2 ? questions : base.questions,
    rules,
    defaultListId: /^[0-9a-f-]{36}$/i.test(defaultListId) ? defaultListId : "",
    finalText: str(input?.finalText, 600) || base.finalText,
  };
}

export async function readChatConfig(): Promise<ChatConfig> {
  if (!supabaseServer) return DEFAULT_CHAT_CONFIG;
  const { data } = await supabaseServer.from("lm_chat_config").select("config").eq("id", 1).maybeSingle();
  const stored = data?.config;
  return stored && Object.keys(stored).length ? normalizeChatConfig(stored) : DEFAULT_CHAT_CONFIG;
}

export async function saveChatConfig(input: any) {
  if (!supabaseServer) throw new Error("Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji.");
  const config = normalizeChatConfig(input);
  const { error } = await supabaseServer
    .from("lm_chat_config")
    .upsert({ id: 1, config, updated_at: new Date().toISOString() });
  if (error) throw error;
  return config;
}

// Pula prezentacji do wyboru: wzorce ze strefy agenta (is_template)
export async function listChatPresentations() {
  if (!supabaseServer) return [];
  const { data } = await supabaseServer
    .from("agent_offer_lists")
    .select("id,presentation_name,public_token,offers,updated_at")
    .is("deleted_at", null)
    .eq("is_template", true)
    .order("updated_at", { ascending: false })
    .limit(200);
  return (data || []).map((row: any) => ({
    id: row.id as string,
    name: String(row.presentation_name || "").trim() || "Prezentacja bez nazwy",
    token: row.public_token as string,
    offersCount: Array.isArray(row.offers) ? row.offers.length : 0,
  }));
}

function firstName(name: string) {
  const first = String(name || "").trim().split(/\s+/)[0] || "";
  return first && !/^(nowy|test)$/i.test(first) ? first : "";
}

async function contactFromToken(token: string) {
  if (!supabaseServer || !token) return null;
  const payload = await readLmTrackingToken(token);
  if (!payload || payload.offerKey !== "chat") return null;
  const { data: contact } = await supabaseServer
    .from("crm_contacts")
    .select("id,name,phone,note,pipeline_owner")
    .eq("id", payload.contactId)
    .maybeSingle();
  return contact ? { contact, leadId: payload.leadId } : null;
}

// Dane do wyświetlenia czatu (bez reguł i ID prezentacji)
export async function getPublicChat(token: string) {
  const config = await readChatConfig();
  const linked = await contactFromToken(token).catch(() => null);
  const name = linked ? firstName(linked.contact.name) : "";
  let previous: { url: string; offersCount: number } | null = null;
  if (linked && supabaseServer) {
    const { data } = await supabaseServer
      .from("lm_chat_results")
      .select("public_token,list_id")
      .eq("crm_contact_id", linked.contact.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.public_token) {
      const consented = await hasTrackingConsent(linked.contact.id);
      previous = { url: `/oferty/${data.public_token}${consented ? `?k=${encodeURIComponent(token)}` : ""}`, offersCount: 0 };
    }
  }
  return {
    enabled: config.enabled,
    agentName: config.agentName,
    agentSubtitle: config.agentSubtitle,
    greeting: config.greeting.replace(/{{\s*firstName\s*}}/g, name ? `, ${name}` : ""),
    questions: config.questions,
    finalText: config.finalText,
    linked: Boolean(linked),
    previousUrl: previous?.url || null,
  };
}

// Otwarcie czatu zapisujemy tylko przy zgodzie (CRM albo CookieYes „reklamowe” w tej przeglądarce)
export async function recordChatOpen(token: string, cookieConsent: boolean) {
  if (!supabaseServer) return;
  const linked = await contactFromToken(token).catch(() => null);
  if (!linked) return;
  if (!cookieConsent && !(await hasTrackingConsent(linked.contact.id))) return;
  // Odświeżenie strony w ciągu 2 minut nie liczy się jako nowe otwarcie
  const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data: recent } = await supabaseServer
    .from("lm_tracking_events")
    .select("id")
    .eq("crm_contact_id", linked.contact.id)
    .eq("event", "chat_open")
    .gte("created_at", since)
    .limit(1);
  if (recent?.length) return;
  await insertLmEvent({
    contactId: linked.contact.id,
    leadId: linked.leadId,
    event: "chat_open",
    title: "Otworzył(a) czat ofertowy z SMS-a",
    detail: "Link „wygeneruj oferty” z SMS-a powitalnego.",
  });
  if (linked.contact.pipeline_owner) {
    await sendCrmPush(linked.contact.pipeline_owner, {
      title: `💬 ${linked.contact.name || "Lead"} otworzył(a) czat ofertowy`,
      body: "Odpowiada na pytania o budżet i region.",
      url: `/crm/kontakt/${linked.contact.id}`,
      tag: `chat-${linked.contact.id}-${Date.now()}`,
    }).catch(() => 0);
  }
}

export async function completeChat(token: string, answerIds: string[], trackingConsent: boolean) {
  if (!supabaseServer) throw new Error("Brak konfiguracji serwera.");
  const config = await readChatConfig();
  if (!config.enabled) throw new Error("Czat jest chwilowo wyłączony.");
  const chosen = config.questions.map((question, index) => {
    const option = question.options.find((item) => item.id === answerIds[index]);
    if (!option) throw new Error("Nieprawidłowa odpowiedź.");
    return { question: question.text, answer: option.label, optionId: option.id };
  });
  const key = chosen.map((item) => item.optionId).join("|");
  const sourceId = config.rules[key] || config.defaultListId;
  if (!sourceId) throw new Error("Brak przypisanej prezentacji – skontaktujemy się z Tobą wkrótce.");

  const { data: source } = await supabaseServer
    .from("agent_offer_lists")
    .select("*")
    .eq("id", sourceId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!source) throw new Error("Wybrana prezentacja nie jest już dostępna.");
  const offersCount = Array.isArray(source.offers) ? source.offers.length : 0;

  const linked = await contactFromToken(token).catch(() => null);
  if (!linked) {
    // Wejście bez linku z SMS-a – wzorzec bez śledzenia
    return { url: `/oferty/${source.public_token}`, offersCount };
  }
  // Zgoda z czatu (Tak / Nie) – zapis w rejestrze zgód; link z kluczem leada tylko przy zgodzie
  await recordConsent({
    contactId: linked.contact.id,
    leadId: linked.leadId,
    kind: "tracking",
    granted: trackingConsent,
    source: "chat",
    wording: trackingConsent ? TRACKING_CONSENT_WORDING : "Odmowa w czacie ofertowym",
  });
  const url = trackingConsent
    ? `/oferty/${source.public_token}?k=${encodeURIComponent(token)}`
    : `/oferty/${source.public_token}`;

  // Ten sam wybór drugi raz – bez ponownego zapisu i powiadomień
  const { data: existing } = await supabaseServer
    .from("lm_chat_results")
    .select("id")
    .eq("crm_contact_id", linked.contact.id)
    .eq("source_list_id", source.id)
    .limit(1)
    .maybeSingle();
  if (existing) return { url, offersCount };

  const contactName = String(linked.contact.name || "").trim();
  await supabaseServer.from("lm_chat_results").insert({
    lead_id: linked.leadId,
    crm_contact_id: linked.contact.id,
    answers: chosen.map(({ question, answer }) => ({ question, answer })),
    source_list_id: source.id,
    list_id: null,
    public_token: source.public_token,
  });

  const answersText = chosen.map((item) => `${item.question}: ${item.answer}`).join("\n");
  const previousNote = String(linked.contact.note || "").trim();
  await supabaseServer
    .from("crm_contacts")
    .update({ note: `${previousNote ? `${previousNote}\n\n` : ""}Czat ofertowy:\n${answersText}` })
    .eq("id", linked.contact.id);

  await insertLmEvent({
    contactId: linked.contact.id,
    leadId: linked.leadId,
    event: "chat_completed",
    title: `Czat ofertowy: ${chosen.map((item) => item.answer).join(", ")}`,
    detail: `Wysłano wzorzec „${String(source.presentation_name || "").trim()}” (${offersCount} ofert). ${
      trackingConsent ? "Zgoda na zapisywanie oglądanych ofert – aktywność widać w historii." : "Bez zgody na zapisywanie oglądanych ofert."
    }`,
  });

  if (linked.contact.pipeline_owner) {
    await sendCrmPush(linked.contact.pipeline_owner, {
      title: `🎯 ${contactName || "Lead"}: ${chosen.map((item) => item.answer).join(", ")}`,
      body: `Dostał(a) prezentację „${String(source.presentation_name || "").trim()}”`,
      url: `/crm/kontakt/${linked.contact.id}`,
      tag: `chat-done-${linked.contact.id}-${Date.now()}`,
    }).catch(() => 0);
  }

  return { url, offersCount };
}
