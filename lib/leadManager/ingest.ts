import { supabaseServer } from "@/lib/supabaseClient";
import { sendCrmPush } from "@/lib/crmPush";
import type { LmFormAnswer, LmIncomingLead } from "./meta";
import { addLmLog, readLmSettings } from "./settings";
import { renderTemplate, sendLmSms } from "./sms";
import { createTrackedOfferLinks } from "./tracking";
import { recordConsent } from "@/lib/consents";

// Lead z Meta → szansa sprzedaży w lejku Marka (etap „Zakwalifikowano”):
// imię i nazwisko, telefon, e-mail do pól kontaktu, reszta ankiety do „Podsumowania informacji o kliencie”.
// SMS powitalny idzie do klienta, właściciel dostaje push w aplikacji CRM (bez SMS-a).

const FIRST_STAGE = "Zakwalifikowano";

// Format telefonu jak w CRM: „+48576652525” (bez spacji, zawsze z kierunkowym)
export function toCrmPhone(value: string) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.length === 9) return `+48${digits}`;
  return `+${digits}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pl-PL", { timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatLeadSummary(lead: LmIncomingLead, receivedAt = new Date()) {
  const header = [
    `Lead z Facebooka (${formatDate(receivedAt)})`,
    lead.formName ? `Formularz: ${lead.formName}` : "",
    lead.campaignName ? `Kampania: ${lead.campaignName}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const answers = lead.formAnswers.length
    ? lead.formAnswers.map((answer: LmFormAnswer) => `${answer.label}: ${answer.values.join(", ")}`).join("\n")
    : "Brak dodatkowych odpowiedzi w ankiecie.";
  return `${header}\n\n${answers}`;
}

async function findContactByPhone(phone: string) {
  if (!supabaseServer || !phone) return null;
  const digits = phone.replace(/\D/g, "");
  const tail = digits.slice(-9);
  if (tail.length < 7) return null;
  const { data } = await supabaseServer
    .from("crm_contacts")
    .select("id,name,phone,note,pipeline_owner")
    .neq("phone", "");
  return (data || []).find((row) => String(row.phone || "").replace(/\D/g, "").endsWith(tail)) || null;
}

export type LmIngestResult = {
  created: boolean;
  duplicateLead: boolean;
  existingContact: boolean;
  leadId?: string;
  contactId?: string;
  sms?: { status: string; error?: string };
};

export async function ingestLead(input: LmIncomingLead): Promise<LmIngestResult> {
  if (!supabaseServer) throw new Error("Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji.");
  const settings = await readLmSettings();
  const phone = toCrmPhone(input.phone);
  if (!phone) throw new Error("Lead nie zawiera numeru telefonu.");
  const name = input.name.trim() || "Nowy kontakt z Facebooka";
  const now = new Date();

  // 1. Zapis leada (deduplikacja po Meta Lead ID – Meta potrafi wysłać ten sam webhook kilka razy)
  const { data: leadRow, error: leadError } = await supabaseServer
    .from("lm_leads")
    .insert({
      source: input.source,
      meta_lead_id: input.metaLeadId || null,
      meta_form_id: input.metaFormId || null,
      meta_page_id: input.metaPageId || null,
      campaign_name: input.campaignName || null,
      form_name: input.formName || null,
      name,
      phone,
      email: input.email || null,
      form_answers: input.formAnswers,
      consents: input.consents || [],
    })
    .select("id")
    .single();
  if (leadError?.code === "23505") return { created: false, duplicateLead: true, existingContact: false };
  if (leadError || !leadRow) throw leadError || new Error("Nie zapisano leada.");
  const leadId = leadRow.id as string;

  // 2. Kontakt w CRM: istniejący (ten sam telefon) albo nowa szansa sprzedaży w lejku właściciela
  const summary = formatLeadSummary({ ...input, name }, now);
  const existing = await findContactByPhone(phone);
  let contactId: string;
  if (existing) {
    contactId = existing.id;
    const previous = String(existing.note || "").trim();
    await supabaseServer
      .from("crm_contacts")
      .update({
        note: previous ? `${previous}\n\n— Ponowne zgłoszenie —\n${summary}` : summary,
        last_contact: now.toISOString().slice(0, 10),
      })
      .eq("id", contactId);
  } else {
    const { data: contactRow, error: contactError } = await supabaseServer
      .from("crm_contacts")
      .insert({
        name,
        company: "Bez firmy",
        email: input.email || "",
        phone,
        owner: "Marco",
        value: 0,
        country: "",
        max_budget: 0,
        bedrooms: "",
        bathrooms: "",
        coast: "",
        purchase_timeline: "",
        note: summary,
        pipeline_owner: settings.leadOwnerEmail,
        pipeline_id: null,
        status: FIRST_STAGE,
        source: input.source === "diagnostic" ? "Lead Manager (test)" : "Facebook Lead Ads",
        last_contact: now.toISOString().slice(0, 10),
      })
      .select("id")
      .single();
    if (contactError || !contactRow) throw contactError || new Error("Nie utworzono kontaktu w CRM.");
    contactId = contactRow.id as string;
  }
  await supabaseServer
    .from("lm_leads")
    .update({ crm_contact_id: contactId, duplicate_of_existing: Boolean(existing) })
    .eq("id", leadId);

  // 2b. Zgody z formularza (checkboxy Meta) → rejestr zgód klienta
  const consentFor = (key: string) => {
    if (input.source === "diagnostic") return true; // lead testowy tworzy Marek na własny numer
    if (!key) return null;
    const found = (input.consents || []).find((item) => item.key === key);
    return found ? found.checked : false;
  };
  const smsConsent = consentFor(settings.consents.smsKey);
  const phoneConsent = consentFor(settings.consents.phoneKey);
  const consentSource = input.source === "diagnostic" ? "diagnostic" : "meta_form";
  if (smsConsent !== null) {
    await recordConsent({
      contactId,
      leadId,
      kind: "sms",
      granted: smsConsent,
      source: consentSource,
      wording: input.source === "diagnostic" ? "Lead testowy" : `Formularz Meta – pole „${settings.consents.smsKey}”`,
    });
  }
  if (phoneConsent !== null) {
    await recordConsent({
      contactId,
      leadId,
      kind: "phone",
      granted: phoneConsent,
      source: consentSource,
      wording: input.source === "diagnostic" ? "Lead testowy" : `Formularz Meta – pole „${settings.consents.phoneKey}”`,
    });
  }

  // 3. Push do właściciela lejka
  const pushOwner = existing?.pipeline_owner || settings.leadOwnerEmail;
  try {
    await sendCrmPush(pushOwner, {
      title: existing ? `🔁 Ponowne zgłoszenie z Facebooka: ${name}` : `🆕 Nowy lead z Facebooka: ${name}`,
      body: [phone, input.formName].filter(Boolean).join(" • "),
      url: `/crm/kontakt/${contactId}`,
      tag: `lead-${contactId}-${Date.now()}`,
    });
  } catch (error) {
    console.error("lead manager: push", error);
  }

  // 4. SMS powitalny do klienta (najwyżej jeden na lead) – tylko ze zgodą na SMS z formularza
  const smsAllowed = !settings.consents.requireSmsConsent || smsConsent === true;
  if (!smsAllowed) {
    await addLmLog(
      "info",
      "SMS powitalny pominięty – brak zgody na SMS",
      settings.consents.smsKey
        ? `${name} • ${phone} • w formularzu nie zaznaczono „${settings.consents.smsKey}”`
        : `${name} • ${phone} • w Lead Managerze nie ustawiono klucza zgody SMS z formularza Meta`,
      leadId,
    );
  }
  const { data: claimed } = !smsAllowed
    ? { data: null }
    : await supabaseServer
    .from("lm_leads")
    .update({ welcome_sms_claimed_at: now.toISOString() })
    .eq("id", leadId)
    .is("welcome_sms_claimed_at", null)
    .select("id");
  let sms: LmIngestResult["sms"];
  if (claimed?.length) {
    let links = { cbTop: "", costaBlanca: "", chat: "" };
    try {
      links = await createTrackedOfferLinks(leadId, contactId, !settings.sms.simulationMode);
    } catch (error) {
      console.error("lead manager: link śledzący", error);
    }
    const message = renderTemplate(settings.sms.clientTemplate, {
      name,
      firstName: name.split(/\s+/)[0],
      phone,
      company: settings.companyName,
      cbTopLink: links.cbTop,
      costaBlancaLink: links.costaBlanca,
      chatLink: links.chat,
    });
    const delivery = await sendLmSms({
      recipient: phone,
      message,
      settings: settings.sms,
      deduplicationKey: `leadwelcome${leadId}`,
    });
    await supabaseServer.from("lm_sms_deliveries").insert({
      lead_id: leadId,
      crm_contact_id: contactId,
      audience: "lead",
      provider: delivery.provider,
      recipient: delivery.recipient,
      message: delivery.message,
      status: delivery.status,
      provider_message_id: delivery.providerMessageId || null,
      error: delivery.error || null,
    });
    sms = { status: delivery.status, error: delivery.error };
    await addLmLog(
      delivery.status === "sent" ? "success" : delivery.status === "simulated" ? "info" : "error",
      delivery.status === "sent" ? "SMS powitalny wysłany" : delivery.status === "simulated" ? "SMS powitalny – symulacja" : "SMS powitalny niewysłany",
      `${name} • ${delivery.recipient}${delivery.error ? ` • ${delivery.error}` : ""}`,
      leadId,
    );
  }

  await addLmLog(
    "success",
    existing ? "Ponowne zgłoszenie – dopisano do istniejącego kontaktu" : "Nowy lead w CRM",
    `${name} • ${phone}${input.formName ? ` • ${input.formName}` : ""}${input.source === "diagnostic" ? " • TEST" : ""}`,
    leadId,
  );

  return { created: true, duplicateLead: false, existingContact: Boolean(existing), leadId, contactId, sms };
}
