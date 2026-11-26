import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseClient";
import { sendCrmPush } from "@/lib/crmPush";
import { insertLmEvent, readLmTrackingToken } from "./tracking";

// Czat ofertowy: link z SMS-a powitalnego → /czat/<token> → 2 pytania jednokrotnego wyboru →
// prezentacja z puli (kopia dla klienta, skojarzona z kartą w CRM, więc działa śledzenie i sygnał w lejku).

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
  agentName: "Marek Marszałek",
  agentSubtitle: "Onesta Group · nieruchomości w Hiszpanii",
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
  finalText: "Gotowe! Przygotowałem dla Ciebie wybór ofert dopasowanych do Twoich odpowiedzi. Zadzwonię, gdy tylko wrócę do biura 🙂",
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

// Pula prezentacji do wyboru: prezentacje ze strefy agenta, które nie są przypisane do konkretnego klienta
export async function listChatPresentations() {
  if (!supabaseServer) return [];
  const { data } = await supabaseServer
    .from("agent_offer_lists")
    .select("id,presentation_name,public_token,offers,updated_at")
    .is("deleted_at", null)
    .is("crm_contact_id", null)
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
    if (data?.public_token) previous = { url: `/oferty/${data.public_token}`, offersCount: 0 };
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

export async function recordChatOpen(token: string) {
  if (!supabaseServer) return;
  const linked = await contactFromToken(token).catch(() => null);
  if (!linked) return;
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

function newPublicToken() {
  return crypto.randomBytes(18).toString("base64url");
}

export async function completeChat(token: string, answerIds: string[]) {
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
    // Wejście bez linku z SMS-a – pokazujemy prezentację z puli bez przypisywania
    return { url: `/oferty/${source.public_token}`, offersCount };
  }

  // Ten sam wybór drugi raz → ta sama prezentacja klienta
  const { data: existing } = await supabaseServer
    .from("lm_chat_results")
    .select("public_token,source_list_id")
    .eq("crm_contact_id", linked.contact.id)
    .eq("source_list_id", source.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing?.public_token) return { url: `/oferty/${existing.public_token}`, offersCount };

  // Kopia prezentacji dla klienta (skojarzona z kartą → śledzenie otwarć i ofert, sygnał w lejku)
  const contactName = String(linked.contact.name || "").trim();
  const publicToken = newPublicToken();
  const { data: copy, error: copyError } = await supabaseServer
    .from("agent_offer_lists")
    .insert({
      public_token: publicToken,
      agent_user_id: source.agent_user_id,
      agent_email: source.agent_email,
      agent_name: source.agent_name,
      offers: source.offers,
      contact_name: source.contact_name,
      contact_email: source.contact_email,
      contact_phone: source.contact_phone,
      presentation_name: `${String(source.presentation_name || "Prezentacja").trim()} – ${contactName || "klient z czatu"}`,
      client_salutation: null,
      client_name: firstName(contactName) || null,
      crm_contact_id: linked.contact.id,
    })
    .select("id")
    .single();
  if (copyError || !copy) throw copyError || new Error("Nie udało się przygotować prezentacji.");

  await supabaseServer.from("lm_chat_results").insert({
    lead_id: linked.leadId,
    crm_contact_id: linked.contact.id,
    answers: chosen.map(({ question, answer }) => ({ question, answer })),
    source_list_id: source.id,
    list_id: copy.id,
    public_token: publicToken,
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
    detail: `Wysłano prezentację „${String(source.presentation_name || "").trim()}” (${offersCount} ofert).`,
  });

  if (linked.contact.pipeline_owner) {
    await sendCrmPush(linked.contact.pipeline_owner, {
      title: `🎯 ${contactName || "Lead"}: ${chosen.map((item) => item.answer).join(", ")}`,
      body: `Dostał(a) prezentację „${String(source.presentation_name || "").trim()}”`,
      url: `/crm/kontakt/${linked.contact.id}`,
      tag: `chat-done-${linked.contact.id}-${Date.now()}`,
    }).catch(() => 0);
  }

  return { url: `/oferty/${publicToken}`, offersCount };
}
