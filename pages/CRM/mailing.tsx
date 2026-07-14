import CrmLayout from "@/components/crm/CrmLayout";
import {
  emptyMailingContent,
  type MailingBlock,
  type MailingCampaign,
  type MailingContact,
  type MailingContent,
  type MailingGroup,
  type MarketingEmailStatus,
} from "@/components/crm/mailingTypes";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MailingTab = "contacts" | "groups" | "campaigns";

type CampaignDraft = {
  id?: string;
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  replyTo: string;
  groupId: string;
  content: MailingContent;
  status: string;
  scheduledAt?: string | null;
};

type ConsentEvidenceDocument = {
  integrity?: { all_packages_verified?: boolean };
  subscription?: Record<string, any>;
  evidence_packages?: Array<Record<string, any>>;
  consent_events?: Array<Record<string, any>>;
};

const newCampaign: CampaignDraft = {
  name: "Nowa kampania",
  subject: "",
  previewText: "",
  fromName: "Marek z Onesta",
  replyTo: "",
  groupId: "",
  content: emptyMailingContent,
  status: "draft",
};

const consentLabels: Record<MarketingEmailStatus, string> = {
  unknown: "Brak zapisanej zgody",
  consented: "Zgoda zapisana",
  unsubscribed: "Wypisany",
  refused: "Odmowa",
  blocked: "Zablokowany",
};

const campaignStatusLabels: Record<string, string> = {
  draft: "Szkic",
  scheduled: "Zaplanowana",
  sent: "Wysłana",
  failed: "Błąd",
};

const evidenceStatusLabels: Record<string, string> = {
  pending: "Oczekuje na potwierdzenie",
  confirmed: "Zgoda aktywna",
  unsubscribed: "Zgoda wycofana",
};

const evidenceInitiationLabels: Record<string, string> = {
  website_form: "Formularz zapisu na stronie",
  crm_phone_request: "Prośba klienta odnotowana w CRM",
};

const evidenceEventLabels: Record<string, { label: string; description: string }> = {
  subscription_requested: {
    label: "Rozpoczęto zapis",
    description: "Adres został podany w formularzu zapisu do newslettera.",
  },
  consent_invitation_requested_after_phone_conversation: {
    label: "Odnotowano prośbę klienta",
    description: "Operator CRM uruchomił proces po rozmowie z klientem.",
  },
  confirmation_email_accepted_by_smtp: {
    label: "Wysłano wiadomość potwierdzającą",
    description: "Serwer pocztowy przyjął wiadomość z linkiem do potwierdzenia.",
  },
  consent_invitation_email_accepted_by_smtp: {
    label: "Wysłano wiadomość potwierdzającą",
    description: "Serwer pocztowy przyjął wiadomość wysłaną po prośbie klienta.",
  },
  confirmation_email_failed: {
    label: "Nie udało się wysłać wiadomości",
    description: "Serwer pocztowy zgłosił błąd podczas wysyłki potwierdzenia.",
  },
  consent_invitation_email_failed: {
    label: "Nie udało się wysłać wiadomości",
    description: "Serwer pocztowy zgłosił błąd podczas wysyłki potwierdzenia.",
  },
  confirmation_page_opened: {
    label: "Otwarto stronę potwierdzenia",
    description: "Link z wiadomości został otwarty w przeglądarce.",
  },
  consent_confirmed: {
    label: "Zgoda została potwierdzona",
    description: "Odbiorca zaakceptował zgodę i zakończył proces double opt-in.",
  },
  crm_contact_marketing_consent_synced: {
    label: "Zaktualizowano kontakt w CRM",
    description: "Aktywna zgoda została przypisana do kontaktu w CRM.",
  },
  consent_withdrawn: {
    label: "Zgoda została wycofana",
    description: "Adres został wypisany i nie może otrzymywać newslettera.",
  },
  newsletter_refusal_recorded: {
    label: "Odnotowano odmowę zapisu",
    description: "Operator CRM zapisał przekazaną przez klienta odmowę newslettera.",
  },
};

const evidencePackageLabels: Record<string, string> = {
  consent_confirmed: "Pakiet potwierdzenia zgody",
  consent_withdrawn: "Pakiet wycofania zgody",
};

function formatEvidenceDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pl-PL");
}

function cloneContent(content: MailingContent): MailingContent {
  return { blocks: content.blocks.map((block) => ({ ...block })) };
}

function campaignToDraft(campaign: MailingCampaign): CampaignDraft {
  return {
    id: campaign.id,
    name: campaign.name,
    subject: campaign.subject,
    previewText: campaign.previewText,
    fromName: campaign.fromName,
    replyTo: campaign.replyTo,
    groupId: campaign.groupId || "",
    content: cloneContent(campaign.content),
    status: campaign.status,
    scheduledAt: campaign.scheduledAt,
  };
}

function createBlock(type: MailingBlock["type"]): MailingBlock {
  const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (type === "heading") return { id, type, text: "Nowy nagłówek", align: "left" };
  if (type === "button") {
    return { id, type, text: "Zobacz więcej", url: "https://onesta.com.pl", align: "left" };
  }
  if (type === "image") return { id, type, url: "https://", align: "center" };
  if (type === "divider") return { id, type };
  return { id, type, text: "Nowy akapit wiadomości.", align: "left" };
}

async function mailingApi<T>(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sesja wygasła. Zaloguj się ponownie.");
  const response = await fetch(`/api/crm/mailing/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Nie udało się wykonać operacji.");
  return payload as T;
}

export default function CrmMailingPage() {
  const [tab, setTab] = useState<MailingTab>("contacts");
  const [contacts, setContacts] = useState<MailingContact[]>([]);
  const [groups, setGroups] = useState<MailingGroup[]>([]);
  const [campaigns, setCampaigns] = useState<MailingCampaign[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CampaignDraft>(() => ({
    ...newCampaign,
    content: cloneContent(newCampaign.content),
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [consentRequestContact, setConsentRequestContact] = useState<MailingContact | null>(null);
  const [conversationContext, setConversationContext] = useState("");
  const [conversationAt, setConversationAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [phoneAgreementConfirmed, setPhoneAgreementConfirmed] = useState(false);
  const [evidenceContact, setEvidenceContact] = useState<MailingContact | null>(null);
  const [evidenceDocument, setEvidenceDocument] = useState<ConsentEvidenceDocument | null>(null);
  const [withdrawContact, setWithdrawContact] = useState<MailingContact | null>(null);
  const [withdrawEmail, setWithdrawEmail] = useState("");
  const [refusalContact, setRefusalContact] = useState<MailingContact | null>(null);
  const [refusalChannel, setRefusalChannel] = useState("phone");
  const [refusalNote, setRefusalNote] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError("");
    try {
      const [contactsResult, groupsResult, campaignsResult] = await Promise.all([
        mailingApi<{ contacts: MailingContact[] }>("contacts"),
        mailingApi<{ groups: MailingGroup[] }>("groups"),
        mailingApi<{ campaigns: MailingCampaign[] }>("campaigns"),
      ]);
      setContacts(contactsResult.contacts);
      setGroups(groupsResult.groups);
      setCampaigns(campaignsResult.campaigns);
    } catch (loadError: any) {
      setError(loadError.message || "Nie udało się wczytać mailingu.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!openActionMenuId) return;
    const closeMenu = () => setOpenActionMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [openActionMenuId]);

  const ownerOptions = useMemo(() => {
    const options = new Map<string, string>();
    contacts.forEach((contact) => options.set(contact.ownerEmail || "unassigned", contact.ownerName));
    return Array.from(options, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name, "pl"),
    );
  }, [contacts]);

  const ownerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    contacts.forEach((contact) => {
      const id = contact.ownerEmail || "unassigned";
      counts.set(id, (counts.get(id) || 0) + 1);
    });
    return counts;
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesOwner = ownerFilter === "all" || (contact.ownerEmail || "unassigned") === ownerFilter;
      const matchesQuery = !normalized || [contact.name, contact.email, contact.phone, contact.pipelineName, contact.ownerName, contact.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return matchesOwner && matchesQuery;
    });
  }, [contacts, ownerFilter, query]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedConsented = useMemo(
    () => contacts.filter((contact) => selectedSet.has(contact.id) && contact.marketingEmailStatus === "consented" && contact.marketingConsentEvidenceId && contact.email).length,
    [contacts, selectedSet],
  );

  function flash(text: string) {
    setError("");
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4500);
  }

  function toggleContact(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAllVisible() {
    const visibleIds = filteredContacts.map((contact) => contact.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return Array.from(next);
    });
  }

  async function withdrawConsent() {
    if (!withdrawContact) return;
    setIsSaving(true);
    setError("");
    try {
      const result = await mailingApi<{ contacts: MailingContact[] }>("contacts", {
        method: "PATCH",
        body: JSON.stringify({
          id: withdrawContact.id,
          marketingEmailStatus: "unsubscribed",
          confirmationEmail: withdrawEmail,
        }),
      });
      const updated = new Map(result.contacts.map((contact) => [contact.id, contact]));
      setContacts((current) => current.map((contact) => updated.get(contact.id) || contact));
      setWithdrawContact(null);
      setWithdrawEmail("");
      flash("Zgoda została wycofana i zapisana w historii kontaktu.");
      const groupsResult = await mailingApi<{ groups: MailingGroup[] }>("groups");
      setGroups(groupsResult.groups);
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function recordRefusal() {
    if (!refusalContact) return;
    setIsSaving(true);
    setError("");
    try {
      const result = await mailingApi<{ contacts: MailingContact[] }>("contacts", {
        method: "PATCH",
        body: JSON.stringify({
          id: refusalContact.id,
          marketingEmailStatus: "refused",
          refusalChannel,
          refusalNote,
        }),
      });
      const updated = new Map(result.contacts.map((contact) => [contact.id, contact]));
      setContacts((current) => current.map((contact) => updated.get(contact.id) || contact));
      setRefusalContact(null);
      setRefusalChannel("phone");
      setRefusalNote("");
      flash("Odmowa newslettera została zapisana. Kontakt nie trafi do wysyłki.");
      const groupsResult = await mailingApi<{ groups: MailingGroup[] }>("groups");
      setGroups(groupsResult.groups);
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function downloadConsentEvidence(contact: MailingContact) {
    setIsSaving(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesja wygasła. Zaloguj się ponownie.");
      const response = await fetch(`/api/crm/mailing/consent-evidence?contactId=${encodeURIComponent(contact.id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Nie udało się pobrać dowodu zgody.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dowod-zgody-${contact.email || contact.id}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      await loadData();
      flash("Pakiet dowodowy został zweryfikowany i pobrany.");
    } catch (downloadError: any) {
      setError(downloadError.message || "Nie udało się pobrać dowodu zgody.");
    } finally {
      setIsSaving(false);
    }
  }

  async function viewConsentEvidence(contact: MailingContact) {
    setIsSaving(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesja wygasła. Zaloguj się ponownie.");
      const response = await fetch(`/api/crm/mailing/consent-evidence?contactId=${encodeURIComponent(contact.id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Nie udało się pobrać dowodu zgody.");
      setEvidenceContact(contact);
      setEvidenceDocument(payload);
      await loadData();
    } catch (viewError: any) {
      setError(viewError.message || "Nie udało się pobrać dowodu zgody.");
    } finally {
      setIsSaving(false);
    }
  }

  function openConsentRequest(contact: MailingContact) {
    setConsentRequestContact(contact);
    setConversationContext("");
    setConversationAt(new Date().toISOString().slice(0, 16));
    setPhoneAgreementConfirmed(false);
    setError("");
  }

  async function sendConsentRequest() {
    if (!consentRequestContact) return;
    setIsSaving(true);
    setError("");
    try {
      await mailingApi("consent-request", {
        method: "POST",
        body: JSON.stringify({
          contactId: consentRequestContact.id,
          conversationContext,
          conversationAt: new Date(conversationAt).toISOString(),
          phoneAgreementConfirmed,
        }),
      });
      setConsentRequestContact(null);
      await loadData();
      flash(`Wysłano prośbę o potwierdzenie zapisu do ${consentRequestContact.email}.`);
    } catch (requestError: any) {
      setError(requestError.message || "Nie udało się wysłać prośby o zgodę.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveGroup() {
    if (!groupName.trim()) {
      setError("Podaj nazwę grupy.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const result = await mailingApi<{ groups: MailingGroup[] }>("groups", {
        method: editingGroupId ? "PATCH" : "POST",
        body: JSON.stringify({
          id: editingGroupId,
          name: groupName,
          description: groupDescription,
          contactIds: selectedIds,
        }),
      });
      setGroups(result.groups);
      setGroupName("");
      setGroupDescription("");
      setSelectedIds([]);
      setEditingGroupId(null);
      setTab("groups");
      flash(editingGroupId ? "Grupa została zaktualizowana." : "Grupa została utworzona.");
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function editGroup(group: MailingGroup) {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupDescription(group.description);
    setSelectedIds(group.contactIds);
    setTab("contacts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteGroup(group: MailingGroup) {
    if (!window.confirm(`Usunąć grupę „${group.name}”? Kontakty pozostaną w CRM.`)) return;
    setIsSaving(true);
    try {
      const result = await mailingApi<{ groups: MailingGroup[] }>("groups", {
        method: "DELETE",
        body: JSON.stringify({ id: group.id }),
      });
      setGroups(result.groups);
      flash("Grupa została usunięta.");
    } catch (deleteError: any) {
      setError(deleteError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function startNewCampaign() {
    setDraft({ ...newCampaign, content: cloneContent(newCampaign.content) });
  }

  function updateBlock(id: string, patch: Partial<MailingBlock>) {
    setDraft((current) => ({
      ...current,
      content: {
        blocks: current.content.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)),
      },
    }));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const blocks = [...current.content.blocks];
      const destination = index + direction;
      if (destination < 0 || destination >= blocks.length) return current;
      [blocks[index], blocks[destination]] = [blocks[destination], blocks[index]];
      return { ...current, content: { blocks } };
    });
  }

  function removeBlock(id: string) {
    setDraft((current) => ({
      ...current,
      content: { blocks: current.content.blocks.filter((block) => block.id !== id) },
    }));
  }

  async function saveCampaign(silent = false) {
    if (!draft.name.trim()) {
      setError("Podaj nazwę kampanii.");
      return null;
    }
    setIsSaving(true);
    setError("");
    try {
      const result = await mailingApi<{ campaign: MailingCampaign }>("campaigns", {
        method: draft.id ? "PATCH" : "POST",
        body: JSON.stringify(draft),
      });
      setDraft(campaignToDraft(result.campaign));
      setCampaigns((current) => {
        const exists = current.some((campaign) => campaign.id === result.campaign.id);
        return exists
          ? current.map((campaign) => (campaign.id === result.campaign.id ? result.campaign : campaign))
          : [result.campaign, ...current];
      });
      if (!silent) flash("Szkic kampanii został zapisany.");
      return result.campaign;
    } catch (saveError: any) {
      setError(saveError.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function sendTest() {
    if (!draft.subject.trim()) {
      setError("Najpierw wpisz temat wiadomości.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const result = await mailingApi<{ to: string }>("test", {
        method: "POST",
        body: JSON.stringify(draft),
      });
      flash(`Test wysłany na ${result.to}.`);
    } catch (sendError: any) {
      setError(sendError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function scheduleCampaign() {
    if (!draft.groupId || !draft.subject.trim()) {
      setError("Wybierz grupę i wpisz temat wiadomości.");
      return;
    }
    const group = groups.find((item) => item.id === draft.groupId);
    if (!group?.consentedCount) {
      setError("Ta grupa nie ma odbiorców z zapisaną zgodą.");
      return;
    }
    if (!window.confirm(`Zaplanować wysyłkę do ${group.consentedCount} odbiorców? Wysyłka ruszy najwcześniej za 10 minut.`)) return;
    const saved = await saveCampaign(true);
    if (!saved) return;
    setIsSaving(true);
    try {
      const result = await mailingApi<{ recipientCount: number; skippedCount: number; scheduledAt: string }>("send", {
        method: "POST",
        body: JSON.stringify({ campaignId: saved.id }),
      });
      await loadData();
      const date = new Intl.DateTimeFormat("pl-PL", { dateStyle: "short", timeStyle: "short" }).format(new Date(result.scheduledAt));
      flash(`Zaplanowano ${result.recipientCount} wiadomości na ${date}. Pominięto: ${result.skippedCount}.`);
    } catch (sendError: any) {
      setError(sendError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CrmLayout active="mailing">
      <section className="mailingWorkspace">
        <header className="mailingHeader">
          <div>
            <p>TYLKO ADMINISTRATOR</p>
            <h1>Mailing</h1>
            <span>Grupy odbiorców, zgody i kampanie w jednym miejscu.</span>
          </div>
          <div className="headerActions">
            <Link href="/CRM/dodaj-kontakt">+ Dodaj kontakt</Link>
            <div className="headerBadge">Resend ready</div>
          </div>
        </header>

        <nav className="mailingTabs" aria-label="Sekcje mailingu">
          <button className={tab === "contacts" ? "active" : ""} onClick={() => setTab("contacts")} type="button">Odbiorcy <span>{contacts.length}</span></button>
          <button className={tab === "groups" ? "active" : ""} onClick={() => setTab("groups")} type="button">Grupy <span>{groups.length}</span></button>
          <button className={tab === "campaigns" ? "active" : ""} onClick={() => setTab("campaigns")} type="button">Kampanie <span>{campaigns.length}</span></button>
        </nav>

        {message ? <div className="notice success">{message}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}

        {isLoading ? (
          <div className="mailingLoader"><span /><strong>Wczytywanie mailingu...</strong></div>
        ) : null}

        {!isLoading && tab === "contacts" ? (
          <div className="contactsView">
            <section className="selectionBar">
              <div>
                <strong>{editingGroupId ? "Edytujesz grupę" : "Utwórz grupę odbiorców"}</strong>
                <span>Wybrano {selectedIds.length}; gotowych do wysyłki: {selectedConsented}</span>
              </div>
              <input placeholder="Nazwa grupy" value={groupName} onChange={(event) => setGroupName(event.target.value)} />
              <input placeholder="Opis (opcjonalnie)" value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} />
              <button className="primaryButton" disabled={isSaving || !selectedIds.length} onClick={saveGroup} type="button">{editingGroupId ? "Zapisz grupę" : "Utwórz grupę"}</button>
            </section>

            <section className="contactsCard">
              <div className="contactsToolbar">
                <input placeholder="Szukaj po nazwie, e-mailu, telefonie..." value={query} onChange={(event) => setQuery(event.target.value)} />
                <select aria-label="Filtruj według właściciela" value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                  <option value="all">Wszyscy właściciele ({contacts.length})</option>
                  {ownerOptions.map((owner) => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({ownerCounts.get(owner.id) || 0})</option>
                  ))}
                </select>
                <span className="contactsCount">Wyświetlono {filteredContacts.length} z {contacts.length}</span>
              </div>
              <div className="contactHeader contactGrid">
                <label><input checked={filteredContacts.length > 0 && filteredContacts.every((contact) => selectedSet.has(contact.id))} onChange={toggleAllVisible} type="checkbox" /> Kontakt</label>
                <span>Lejek</span><span>Właściciel</span><span>Status zgody</span><span>E-mail</span><span aria-label="Menu działań" />
              </div>
              {filteredContacts.map((contact) => (
                <article className="contactGrid contactRow" key={contact.id}>
                  <label className="identity"><input checked={selectedSet.has(contact.id)} onChange={() => toggleContact(contact.id)} type="checkbox" /><span className="avatar">{contact.name.slice(0, 1).toUpperCase()}</span><strong>{contact.name}</strong></label>
                  <span className="pipelineName">{contact.pipelineName}</span>
                  <span className="ownerName" title={contact.ownerEmail}>{contact.ownerName}</span>
                  <div className="consentCell">
                    <span className={`consent ${contact.marketingEmailStatus}`}>{consentLabels[contact.marketingEmailStatus]}</span>
                    {contact.consentRequestStatus === "pending" ? (
                      <small>Prośba wysłana {contact.consentRequestSentAt ? new Intl.DateTimeFormat("pl-PL", { dateStyle: "short", timeStyle: "short" }).format(new Date(contact.consentRequestSentAt)) : ""}</small>
                    ) : null}
                  </div>
                  <span className={contact.email ? "email" : "email missing"}>{contact.email || "Brak adresu e-mail"}</span>
                  <div className="rowAction" onClick={(event) => event.stopPropagation()}>
                    <button className="actionMenuTrigger" type="button" aria-label={`Działania dla ${contact.name}`} aria-haspopup="menu" aria-expanded={openActionMenuId === contact.id} onClick={() => setOpenActionMenuId((current) => current === contact.id ? null : contact.id)}>⋮</button>
                    {openActionMenuId === contact.id ? (
                      <div className="actionMenu" role="menu">
                        <div className="actionMenuMeta"><span>Etap CRM</span><strong>{contact.status || "Brak etapu"}</strong></div>
                        {contact.marketingEmailStatus === "consented" || contact.marketingConsentEvidenceId ? (
                          <button type="button" role="menuitem" disabled={isSaving} onClick={() => { setOpenActionMenuId(null); void viewConsentEvidence(contact); }}>Pokaż dowód zgody</button>
                        ) : null}
                        {contact.marketingEmailStatus === "consented" ? (
                          <button className="dangerMenuItem" disabled={isSaving} onClick={() => { setOpenActionMenuId(null); setWithdrawContact(contact); setWithdrawEmail(""); setError(""); }} role="menuitem" type="button">Wycofaj zgodę</button>
                        ) : (
                          <button disabled={isSaving || !contact.email || contact.marketingEmailStatus === "blocked"} onClick={() => { setOpenActionMenuId(null); openConsentRequest(contact); }} role="menuitem" type="button">
                            {contact.marketingEmailStatus === "blocked" ? "Kontakt zablokowany" : contact.consentRequestStatus === "pending" ? "Wyślij prośbę ponownie" : "Uzyskaj zgodę"}
                          </button>
                        )}
                        <button className="dangerMenuItem refusalMenuItem" disabled={isSaving} onClick={() => { setOpenActionMenuId(null); setRefusalContact(contact); setRefusalChannel("phone"); setRefusalNote(""); setError(""); }} role="menuitem" type="button">
                          {contact.marketingEmailStatus === "refused" ? "Zapisz ponowną odmowę" : "Oznacz odmowę"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
              {!filteredContacts.length ? <p className="empty">Brak kontaktów pasujących do wyszukiwania.</p> : null}
            </section>
          </div>
        ) : null}

        {!isLoading && tab === "groups" ? (
          <section className="groupsGrid">
            {groups.map((group) => (
              <article className="groupCard" key={group.id}>
                <div className="groupTop"><div className="groupIcon">G</div><div><h2>{group.name}</h2><p>{group.description || "Bez opisu"}</p></div></div>
                <div className="groupStats"><span><strong>{group.memberCount}</strong> kontaktów</span><span className="ready"><strong>{group.consentedCount}</strong> gotowych</span></div>
                <div className="cardActions"><button onClick={() => editGroup(group)} type="button">Edytuj odbiorców</button><button className="dangerLink" onClick={() => deleteGroup(group)} type="button">Usuń</button></div>
              </article>
            ))}
            <button className="newGroupCard" onClick={() => { setEditingGroupId(null); setGroupName(""); setGroupDescription(""); setSelectedIds([]); setTab("contacts"); }} type="button"><strong>+</strong><span>Utwórz nową grupę</span></button>
          </section>
        ) : null}

        {!isLoading && tab === "campaigns" ? (
          <div className="campaignView">
            <aside className="campaignList">
              <button className="primaryButton newCampaign" onClick={startNewCampaign} type="button">+ Nowa kampania</button>
              {campaigns.map((campaign) => (
                <button className={`campaignItem ${draft.id === campaign.id ? "active" : ""}`} key={campaign.id} onClick={() => setDraft(campaignToDraft(campaign))} type="button">
                  <strong>{campaign.name}</strong><span>{campaignStatusLabels[campaign.status] || campaign.status}</span><small>{campaign.subject || "Bez tematu"}</small>
                </button>
              ))}
            </aside>

            <section className="campaignEditor">
              <div className="editorHeader"><div><span className={`statusBadge ${draft.status}`}>{campaignStatusLabels[draft.status] || draft.status}</span><h2>{draft.id ? "Edytuj kampanię" : "Nowa kampania"}</h2></div><div className="editorActions"><button disabled={isSaving || draft.status !== "draft"} onClick={() => saveCampaign()} type="button">Zapisz szkic</button><button disabled={isSaving || draft.status !== "draft"} onClick={sendTest} type="button">Wyślij test</button><button className="primaryButton" disabled={isSaving || draft.status !== "draft"} onClick={scheduleCampaign} type="button">Zaplanuj wysyłkę</button></div></div>

              {draft.status !== "draft" ? <div className="lockedCampaign">Ta kampania jest już zaplanowana i nie można zmieniać jej treści.{draft.scheduledAt ? ` Termin: ${new Intl.DateTimeFormat("pl-PL", { dateStyle: "short", timeStyle: "short" }).format(new Date(draft.scheduledAt))}.` : ""}</div> : null}

              <div className="campaignSettings">
                <label>Nazwa robocza<input disabled={draft.status !== "draft"} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <label>Grupa odbiorców<select disabled={draft.status !== "draft"} value={draft.groupId} onChange={(event) => setDraft((current) => ({ ...current, groupId: event.target.value }))}><option value="">Wybierz grupę</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name} — {group.consentedCount} gotowych</option>)}</select></label>
                <label className="wide">Temat wiadomości<input disabled={draft.status !== "draft"} placeholder="Krótki, konkretny temat" value={draft.subject} onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} /></label>
                <label className="wide">Preheader<input disabled={draft.status !== "draft"} placeholder="Tekst widoczny obok tematu w skrzynce" value={draft.previewText} onChange={(event) => setDraft((current) => ({ ...current, previewText: event.target.value }))} /></label>
                <label>Nazwa nadawcy<input disabled={draft.status !== "draft"} value={draft.fromName} onChange={(event) => setDraft((current) => ({ ...current, fromName: event.target.value }))} /></label>
                <label>Adres odpowiedzi<input disabled={draft.status !== "draft"} placeholder="Domyślny z konfiguracji" type="email" value={draft.replyTo} onChange={(event) => setDraft((current) => ({ ...current, replyTo: event.target.value }))} /></label>
              </div>

              <div className="builderLayout">
                <div className="blocksPanel">
                  <div className="blockToolbar"><span>Dodaj blok:</span>{(["heading", "text", "button", "image", "divider"] as MailingBlock["type"][]).map((type) => <button disabled={draft.status !== "draft"} key={type} onClick={() => setDraft((current) => ({ ...current, content: { blocks: [...current.content.blocks, createBlock(type)] } }))} type="button">{{ heading: "Nagłówek", text: "Tekst", button: "Przycisk", image: "Zdjęcie", divider: "Linia" }[type]}</button>)}</div>
                  {draft.content.blocks.map((block, index) => (
                    <article className="blockEditor" key={block.id}>
                      <div className="blockTitle"><strong>{{ heading: "Nagłówek", text: "Tekst", button: "Przycisk", image: "Zdjęcie", divider: "Linia" }[block.type]}</strong><div><button disabled={index === 0 || draft.status !== "draft"} onClick={() => moveBlock(index, -1)} type="button">↑</button><button disabled={index === draft.content.blocks.length - 1 || draft.status !== "draft"} onClick={() => moveBlock(index, 1)} type="button">↓</button><button disabled={draft.status !== "draft"} onClick={() => removeBlock(block.id)} type="button">×</button></div></div>
                      {block.type !== "divider" && block.type !== "image" ? (block.type === "text" ? <textarea disabled={draft.status !== "draft"} rows={5} value={block.text || ""} onChange={(event) => updateBlock(block.id, { text: event.target.value })} /> : <input disabled={draft.status !== "draft"} value={block.text || ""} onChange={(event) => updateBlock(block.id, { text: event.target.value })} />) : null}
                      {block.type === "button" || block.type === "image" ? <input disabled={draft.status !== "draft"} placeholder={block.type === "image" ? "https://adres-zdjecia.jpg" : "https://adres-linku.pl"} value={block.url || ""} onChange={(event) => updateBlock(block.id, { url: event.target.value })} /> : null}
                      {block.type !== "divider" ? <div className="alignment"><span>Wyrównanie:</span>{(["left", "center", "right"] as const).map((align) => <button className={block.align === align ? "active" : ""} disabled={draft.status !== "draft"} key={align} onClick={() => updateBlock(block.id, { align })} type="button">{align === "left" ? "Lewo" : align === "center" ? "Środek" : "Prawo"}</button>)}</div> : null}
                    </article>
                  ))}
                </div>

                <div className="previewPanel"><div className="previewLabel">Podgląd wiadomości</div><div className="mailPreview"><div className="inboxPreview"><strong>{draft.subject || "Temat wiadomości"}</strong><span>{draft.previewText || "Tutaj pojawi się preheader..."}</span></div><div className="previewBody">{draft.content.blocks.map((block) => {
                  const style = { textAlign: block.align || "left" } as const;
                  if (block.type === "heading") return <h2 key={block.id} style={style}>{(block.text || "").replace("{{{contact.first_name|tam}}}", "Anna")}</h2>;
                  if (block.type === "button") return <div key={block.id} style={style}><span className="previewButton">{block.text || "Zobacz więcej"}</span></div>;
                  if (block.type === "image") return block.url && block.url !== "https://" ? <div key={block.id} style={style}><img alt="Podgląd" src={block.url} /></div> : <div className="imagePlaceholder" key={block.id}>Miejsce na zdjęcie</div>;
                  if (block.type === "divider") return <hr key={block.id} />;
                  return <p key={block.id} style={style}>{block.text}</p>;
                })}</div><footer>Wiadomość od Onesta. <u>Wypisz się z mailingu</u>.</footer></div></div>
              </div>
            </section>
          </div>
        ) : null}

        {consentRequestContact ? (
          <div className="modalBackdrop" role="presentation" onMouseDown={() => !isSaving && setConsentRequestContact(null)}>
            <section className="consentModal" role="dialog" aria-modal="true" aria-labelledby="consent-request-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="modalHeader">
                <div>
                  <p>INDYWIDUALNA PROŚBA O ZGODĘ</p>
                  <h2 id="consent-request-title">Wyślij link do potwierdzenia</h2>
                </div>
                <button type="button" disabled={isSaving} onClick={() => setConsentRequestContact(null)}>×</button>
              </div>
              <div className="modalBody">
                <div className="contactSummary"><strong>{consentRequestContact.name}</strong><span>{consentRequestContact.email}</span></div>
                <p className="modalExplanation">Ta wiadomość może zostać wysłana, gdy klient podczas rozmowy poprosił o przesłanie linku. CRM zapisze opis ustalenia, operatora, czas, Message-ID i wynik SMTP.</p>
                <label>Data i godzina rozmowy<input type="datetime-local" value={conversationAt} onChange={(event) => setConversationAt(event.target.value)} /></label>
                <label>Notatka z ustalenia<textarea rows={4} placeholder="Np. klient podczas rozmowy telefonicznej poprosił o przesłanie linku do newslettera." value={conversationContext} onChange={(event) => setConversationContext(event.target.value)} /></label>
                <label className="attestation"><input type="checkbox" checked={phoneAgreementConfirmed} onChange={(event) => setPhoneAgreementConfirmed(event.target.checked)} /><span>Potwierdzam, że klient podczas rozmowy poprosił o przesłanie tego linku. To nie jest wysyłka do zimnej bazy.</span></label>
                <div className="modalActions"><button type="button" disabled={isSaving} onClick={() => setConsentRequestContact(null)}>Anuluj</button><button className="primaryButton" type="button" disabled={isSaving || !phoneAgreementConfirmed || conversationContext.trim().length < 10} onClick={sendConsentRequest}>{isSaving ? "Wysyłanie…" : "Wyślij prośbę"}</button></div>
              </div>
            </section>
          </div>
        ) : null}

        {withdrawContact ? (
          <div className="modalBackdrop" role="presentation" onMouseDown={() => !isSaving && setWithdrawContact(null)}>
            <section className="consentModal" role="dialog" aria-modal="true" aria-labelledby="withdraw-consent-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="modalHeader withdrawHeader">
                <div><p>OPERACJA NIEODWRACALNA W HISTORII</p><h2 id="withdraw-consent-title">Wycofaj zgodę</h2></div>
                <button type="button" disabled={isSaving} onClick={() => setWithdrawContact(null)}>×</button>
              </div>
              <div className="modalBody">
                <div className="contactSummary"><strong>{withdrawContact.name}</strong><span>{withdrawContact.email}</span></div>
                <p className="modalExplanation">Aby świadomie wycofać zgodę, wpisz ręcznie pełny adres e-mail tego kontaktu. System porówna adresy również po stronie serwera. Wklejenie lub wpisanie innego adresu nie wykona operacji.</p>
                <label>Pełny adres e-mail<input type="email" autoComplete="off" spellCheck={false} placeholder={withdrawContact.email} value={withdrawEmail} onChange={(event) => setWithdrawEmail(event.target.value)} /></label>
                <div className="typedEmailState">{withdrawEmail ? (withdrawEmail.trim().toLowerCase() === withdrawContact.email.trim().toLowerCase() ? <span className="match">✓ Adresy są zgodne</span> : <span className="mismatch">Adresy nie są zgodne</span>) : <span>Wpisz pełny adres, aby odblokować potwierdzenie.</span>}</div>
                <div className="modalActions"><button type="button" disabled={isSaving} onClick={() => setWithdrawContact(null)}>Anuluj</button><button className="dangerButton" type="button" disabled={isSaving || withdrawEmail.trim().toLowerCase() !== withdrawContact.email.trim().toLowerCase()} onClick={withdrawConsent}>{isSaving ? "Wycofywanie…" : "Potwierdź adres i wycofaj zgodę"}</button></div>
              </div>
            </section>
          </div>
        ) : null}

        {refusalContact ? (
          <div className="modalBackdrop" role="presentation" onMouseDown={() => !isSaving && setRefusalContact(null)}>
            <section className="consentModal" role="dialog" aria-modal="true" aria-labelledby="refusal-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="modalHeader withdrawHeader">
                <div><p>RĘCZNY ZAPIS DECYZJI KLIENTA</p><h2 id="refusal-title">Oznacz odmowę newslettera</h2></div>
                <button type="button" disabled={isSaving} onClick={() => setRefusalContact(null)}>×</button>
              </div>
              <div className="modalBody">
                <div className="contactSummary"><strong>{refusalContact.name}</strong><span>{refusalContact.email || "Brak adresu e-mail"}</span></div>
                <p className="modalExplanation">Kontakt zostanie oznaczony jako „Odmowa” i nie trafi do wysyłki. Jeżeli zgoda jest aktywna, system zapisze również jej wycofanie. Oczekujący link potwierdzający zostanie unieważniony.</p>
                <label>Sposób przekazania odmowy
                  <select value={refusalChannel} onChange={(event) => setRefusalChannel(event.target.value)}>
                    <option value="phone">Rozmowa telefoniczna</option>
                    <option value="email">Wiadomość e-mail</option>
                    <option value="sms">SMS / komunikator</option>
                    <option value="in_person">Rozmowa osobista</option>
                    <option value="other">Inny sposób</option>
                  </select>
                </label>
                <label>Notatka (opcjonalnie)<textarea rows={4} maxLength={1000} placeholder="Np. klient podczas rozmowy poprosił, aby nie zapisywać go do newslettera." value={refusalNote} onChange={(event) => setRefusalNote(event.target.value)} /></label>
                <div className="refusalWarning">Ta decyzja natychmiast wykluczy kontakt z newslettera. Ponowny zapis będzie wymagał nowego potwierdzenia przez klienta.</div>
                <div className="modalActions"><button type="button" disabled={isSaving} onClick={() => setRefusalContact(null)}>Anuluj</button><button className="dangerButton" type="button" disabled={isSaving} onClick={recordRefusal}>{isSaving ? "Zapisywanie…" : "Potwierdź i zapisz odmowę"}</button></div>
              </div>
            </section>
          </div>
        ) : null}

        {evidenceContact && evidenceDocument ? (
          <div className="modalBackdrop" role="presentation" onMouseDown={() => setEvidenceContact(null)}>
            <section className="consentModal evidenceModal" role="dialog" aria-modal="true" aria-labelledby="evidence-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="modalHeader">
                <div><p>DOWÓD ZGODY</p><h2 id="evidence-title">{evidenceContact.name}</h2></div>
                <button type="button" onClick={() => setEvidenceContact(null)}>×</button>
              </div>
              <div className="modalBody">
                <div className={`integrityBox ${evidenceDocument.integrity?.all_packages_verified ? "verified" : "warning"}`}><strong>{evidenceDocument.integrity?.all_packages_verified ? "✓ Integralność pakietu potwierdzona" : "Sprawdź integralność pakietu"}</strong><span>SHA-256 + podpis HMAC, rejestr append-only</span></div>
                <div className="evidenceGrid">
                  <div><span>Adres</span><strong>{evidenceDocument.subscription?.email_normalized}</strong></div>
                  <div><span>Aktualny status</span><strong>{evidenceStatusLabels[evidenceDocument.subscription?.status] || "Nieznany status"}</strong></div>
                  <div><span>Wiadomość potwierdzająca wysłana</span><strong>{formatEvidenceDate(evidenceDocument.subscription?.confirmation_sent_at)}</strong></div>
                  <div><span>Ostatnie potwierdzenie zgody</span><strong>{formatEvidenceDate(evidenceDocument.subscription?.confirmed_at)}</strong></div>
                  <div><span>Ostatnie wycofanie zgody</span><strong>{formatEvidenceDate(evidenceDocument.subscription?.unsubscribed_at)}</strong></div>
                  <div><span>Identyfikator wysłanej wiadomości</span><strong>{evidenceDocument.subscription?.confirmation_email_message_id || "—"}</strong></div>
                  <div><span>Sposób rozpoczęcia zapisu</span><strong>{evidenceInitiationLabels[evidenceDocument.subscription?.initiation_type] || "Inny sposób"}</strong></div>
                </div>
                <div className="consentTextBox"><span>Treść udzielonej zgody</span><p>{evidenceDocument.subscription?.consent_text || "—"}</p></div>
                {evidenceDocument.subscription?.invitation_context ? <div className="consentTextBox"><span>Ustalenie z rozmowy</span><p>{evidenceDocument.subscription.invitation_context}</p><small>Zapisał: {evidenceDocument.subscription.invitation_requested_by || "—"}</small></div> : null}
                <div className="evidencePackages">
                  <h3>Utworzone pakiety dowodowe</h3>
                  {(evidenceDocument.evidence_packages || []).length ? (evidenceDocument.evidence_packages || []).map((item, index) => (
                    <div key={item.id || `${item.package_type}-${index}`}>
                      <span>{formatEvidenceDate(item.created_at)}</span>
                      <strong>{evidencePackageLabels[item.package_type] || "Pakiet dowodowy"}</strong>
                      <small>{item.integrity_verified ? "✓ Integralność potwierdzona" : "Integralność wymaga sprawdzenia"}</small>
                    </div>
                  )) : <p>Pakiet dowodowy nie został jeszcze utworzony.</p>}
                </div>
                <div className="eventTimeline">
                  <h3>Historia zgody</h3>
                  {(evidenceDocument.consent_events || []).map((event) => {
                    const presentation = evidenceEventLabels[event.event_type] || {
                      label: "Zdarzenie systemowe",
                      description: "Szczegóły techniczne są dostępne w pełnym pliku dowodowym.",
                    };
                    return <div key={event.id}><span>{formatEvidenceDate(event.occurred_at)}</span><strong>{presentation.label}</strong><small>{presentation.description}</small></div>;
                  })}
                </div>
                <div className="modalActions"><button type="button" onClick={() => setEvidenceContact(null)}>Zamknij</button><button className="primaryButton" type="button" onClick={() => downloadConsentEvidence(evidenceContact)}>Pobierz pełny JSON</button></div>
              </div>
            </section>
          </div>
        ) : null}
      </section>

      <style jsx>{`
        .mailingWorkspace{align-content:start;display:grid;gap:20px;min-width:0;padding:24px 28px 50px}.mailingHeader{align-items:center;display:flex;justify-content:space-between}.mailingHeader p{color:#216e63;font-size:12px;font-weight:900;letter-spacing:.08em;margin:0 0 5px}.mailingHeader h1{font-size:42px;line-height:1;margin:0 0 8px}.mailingHeader span{color:#667085;font-size:14px}.headerBadge{background:#e7f2ef;border-radius:999px;color:#155149;font-size:12px;font-weight:800;padding:8px 12px}.mailingTabs{border-bottom:1px solid #d8dee7;display:flex;gap:26px}.mailingTabs button{background:none;border:0;border-bottom:3px solid transparent;color:#667085;cursor:pointer;font:inherit;font-size:14px;font-weight:800;padding:10px 2px 12px}.mailingTabs button.active{border-bottom-color:#216e63;color:#17202a}.mailingTabs button span{background:#e8eef3;border-radius:999px;font-size:11px;margin-left:4px;padding:2px 7px}.notice{border-radius:8px;font-size:14px;font-weight:700;padding:12px 15px}.notice.success{background:#e7f2ef;color:#155149}.notice.error{background:#fef3f2;color:#b42318}.mailingLoader{align-items:center;background:#fff;border:1px solid #d8dee7;border-radius:10px;display:flex;gap:12px;justify-content:center;min-height:300px}.mailingLoader span{animation:spin .8s linear infinite;border:2px solid #d7e4e1;border-radius:50%;border-top-color:#216e63;height:23px;width:23px}.mailingLoader strong{color:#667085;font-size:13px}@keyframes spin{to{transform:rotate(360deg)}}button,input,select,textarea{font:inherit}.primaryButton{background:#216e63!important;border-color:#216e63!important;color:#fff!important}.primaryButton:disabled,button:disabled{cursor:not-allowed!important;opacity:.45}.selectionBar{align-items:end;background:#fff;border:1px solid #d8dee7;border-radius:10px;display:grid;gap:12px;grid-template-columns:minmax(190px,1fr) minmax(160px,240px) minmax(160px,240px) auto;padding:16px}.selectionBar div{display:grid;gap:4px}.selectionBar span{color:#667085;font-size:12px}.selectionBar input,.contactsToolbar>input,.campaignSettings input,.campaignSettings select,.blockEditor input,.blockEditor textarea{background:#fff;border:1px solid #d8dee7;border-radius:7px;min-height:40px;outline:none;padding:8px 11px;width:100%}.selectionBar button,.editorActions button,.cardActions button,.blockToolbar button,.bulkActions button{background:#fff;border:1px solid #cfd7e2;border-radius:7px;cursor:pointer;font-size:12px;font-weight:800;min-height:38px;padding:0 12px}.contactsView{display:grid;gap:16px}.contactsCard{background:#fff;border:1px solid #d8dee7;border-radius:10px;overflow:hidden}.contactsToolbar{align-items:center;display:flex;gap:14px;justify-content:space-between;padding:14px 16px}.contactsToolbar>input{max-width:530px}.bulkActions{display:flex;gap:8px}.contactGrid{align-items:center;display:grid;gap:14px;grid-template-columns:minmax(250px,1.3fr) minmax(170px,.8fr) minmax(190px,.9fr) minmax(220px,1fr);padding:13px 16px}.contactHeader{background:#f9fafb;color:#667085;font-size:11px;font-weight:900;text-transform:uppercase}.contactHeader label,.identity{align-items:center;display:flex;gap:12px}.contactRow{border-top:1px solid #eaecf0;font-size:13px}.identity{min-width:0}.identity strong{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.avatar{align-items:center;background:#e8eef3;border-radius:7px;color:#2f4658;display:flex;font-weight:900;height:34px;justify-content:center;width:34px}.crmStage{white-space:nowrap}.consent{border:1px solid #d8dee7;border-radius:999px;font-size:12px;font-weight:800;max-width:190px;padding:7px 10px}.consent.consented{background:#e7f2ef;color:#155149}.consent.unsubscribed,.consent.refused,.consent.blocked{background:#fef3f2;color:#b42318}.consent.unknown{background:#f2f4f7;color:#667085}.email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.email.missing{color:#98a2b3}.empty{color:#667085;padding:30px;text-align:center}.groupsGrid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}.groupCard,.newGroupCard{background:#fff;border:1px solid #d8dee7;border-radius:10px;min-height:210px;padding:20px}.groupTop{display:flex;gap:13px}.groupIcon{align-items:center;background:#e7f2ef;border-radius:9px;color:#155149;display:flex;font-weight:900;height:42px;justify-content:center;width:42px}.groupCard h2{font-size:18px;margin:1px 0 5px}.groupCard p{color:#667085;font-size:13px;margin:0}.groupStats{border-bottom:1px solid #eaecf0;border-top:1px solid #eaecf0;display:flex;gap:24px;margin:24px 0 14px;padding:13px 0}.groupStats span{color:#667085;font-size:12px}.groupStats strong{color:#17202a;font-size:18px;margin-right:4px}.groupStats .ready strong{color:#216e63}.cardActions{display:flex;justify-content:space-between}.cardActions button{border:0;padding:0}.dangerLink{color:#b42318}.newGroupCard{align-items:center;color:#216e63;cursor:pointer;display:flex;flex-direction:column;gap:8px;justify-content:center}.newGroupCard strong{font-size:34px}.newGroupCard span{font-weight:800}.campaignView{align-items:start;display:grid;gap:18px;grid-template-columns:240px minmax(0,1fr)}.campaignList{display:grid;gap:8px;position:sticky;top:24px}.newCampaign{border:0;border-radius:8px;cursor:pointer;font-weight:800;min-height:42px}.campaignItem{background:#fff;border:1px solid #d8dee7;border-radius:8px;cursor:pointer;display:grid;gap:4px;padding:12px;text-align:left}.campaignItem.active{border-color:#216e63;box-shadow:0 0 0 2px rgba(33,110,99,.12)}.campaignItem span{color:#216e63;font-size:10px;font-weight:900;text-transform:uppercase}.campaignItem small{color:#667085;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.campaignEditor{background:#fff;border:1px solid #d8dee7;border-radius:10px;min-width:0;overflow:hidden}.editorHeader{align-items:center;border-bottom:1px solid #eaecf0;display:flex;gap:18px;justify-content:space-between;padding:18px 20px}.editorHeader h2{font-size:21px;margin:5px 0 0}.statusBadge{color:#667085;font-size:10px;font-weight:900;text-transform:uppercase}.statusBadge.scheduled,.statusBadge.sent{color:#216e63}.editorActions{display:flex;gap:8px}.lockedCampaign{background:#fffaeb;color:#7a2e0e;font-size:13px;font-weight:700;padding:12px 20px}.campaignSettings{background:#f9fafb;border-bottom:1px solid #eaecf0;display:grid;gap:13px;grid-template-columns:1fr 1fr;padding:18px 20px}.campaignSettings label{color:#475467;display:grid;font-size:11px;font-weight:800;gap:6px}.campaignSettings .wide{grid-column:1/-1}.builderLayout{align-items:start;display:grid;grid-template-columns:minmax(360px,1fr) minmax(320px,.85fr)}.blocksPanel{border-right:1px solid #eaecf0;display:grid;gap:12px;padding:18px}.blockToolbar{display:flex;flex-wrap:wrap;gap:6px}.blockToolbar span{align-self:center;color:#667085;font-size:11px;font-weight:800;margin-right:4px}.blockToolbar button{min-height:32px;padding:0 9px}.blockEditor{border:1px solid #d8dee7;border-radius:8px;display:grid;gap:9px;padding:12px}.blockTitle{align-items:center;display:flex;justify-content:space-between}.blockTitle strong{font-size:12px}.blockTitle div{display:flex;gap:4px}.blockTitle button,.alignment button{background:#f2f4f7;border:0;border-radius:5px;cursor:pointer;font-size:12px;height:27px;min-width:27px}.blockEditor textarea{resize:vertical}.alignment{align-items:center;display:flex;gap:5px}.alignment span{color:#667085;font-size:10px;margin-right:4px}.alignment button.active{background:#216e63;color:#fff}.previewPanel{background:#eef1f4;min-height:100%;padding:18px;position:sticky;top:0}.previewLabel{color:#667085;font-size:11px;font-weight:900;margin-bottom:10px;text-transform:uppercase}.mailPreview{background:#fff;border-radius:9px;box-shadow:0 10px 28px rgba(21,32,43,.12);overflow:hidden}.inboxPreview{background:#f9fafb;border-bottom:1px solid #eaecf0;display:grid;gap:3px;padding:12px 18px}.inboxPreview strong{font-size:13px}.inboxPreview span{color:#667085;font-size:11px}.previewBody{padding:28px}.previewBody h2{color:#17202a;font-size:25px;line-height:1.2;margin:0 0 18px}.previewBody p{color:#344054;font-size:14px;line-height:1.6;margin:0 0 18px;white-space:pre-wrap}.previewBody hr{border:0;border-top:1px solid #d8dee7;margin:22px 0}.previewBody img{border-radius:7px;height:auto;max-width:100%}.previewButton{background:#216e63;border-radius:7px;color:#fff;display:inline-block;font-size:13px;font-weight:800;margin:4px 0 20px;padding:11px 16px}.imagePlaceholder{align-items:center;background:#f2f4f7;border-radius:7px;color:#98a2b3;display:flex;height:130px;justify-content:center;margin-bottom:18px}.mailPreview footer{border-top:1px solid #eaecf0;color:#667085;font-size:10px;padding:17px;text-align:center}
        @media(max-width:1100px){.selectionBar{grid-template-columns:1fr 1fr}.campaignView{grid-template-columns:1fr}.campaignList{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));position:static}.builderLayout{grid-template-columns:1fr}.blocksPanel{border-right:0}.previewPanel{position:static}.contactGrid{grid-template-columns:minmax(230px,1.2fr) minmax(150px,.7fr) minmax(180px,.8fr) minmax(190px,1fr)}}@media(max-width:760px){.mailingWorkspace{padding:18px 14px}.mailingHeader{align-items:flex-start;gap:12px}.mailingHeader h1{font-size:34px}.selectionBar,.campaignSettings{grid-template-columns:1fr}.campaignSettings .wide{grid-column:auto}.contactsToolbar,.editorHeader{align-items:stretch;flex-direction:column}.bulkActions,.editorActions{flex-wrap:wrap}.contactHeader{display:none}.contactGrid{grid-template-columns:1fr}.contactRow{gap:9px}.builderLayout{display:block}.mailingTabs{gap:16px;overflow-x:auto}.headerBadge{display:none}}
        .consent{display:inline-block}.consentCell{align-items:flex-start;display:flex;flex-direction:column;gap:5px}.consentCell button{background:none;border:0;color:#216e63;cursor:pointer;font-size:11px;font-weight:800;padding:0;text-decoration:underline}.consentCell small{color:#667085;font-size:10px;line-height:1.35}.headerActions{align-items:center;display:flex;gap:10px}.headerActions>a{background:#216e63;border-radius:7px;color:#fff;font-size:12px;font-weight:800;padding:10px 14px;text-decoration:none}.modalBackdrop{align-items:center;background:rgba(16,24,40,.62);display:flex;inset:0;justify-content:center;padding:20px;position:fixed;z-index:200}.consentModal{background:#fff;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.3);max-height:92vh;max-width:650px;overflow:auto;width:100%}.evidenceModal{max-width:820px}.modalHeader{align-items:flex-start;background:#182334;color:#fff;display:flex;justify-content:space-between;padding:22px 24px}.modalHeader p{color:#d8b66a;font-size:10px;font-weight:900;letter-spacing:.16em;margin:0}.modalHeader h2{font-size:22px;margin:5px 0 0}.modalHeader>button{background:none;border:0;color:#fff;cursor:pointer;font-size:28px;line-height:1}.modalBody{display:grid;gap:16px;padding:22px 24px}.contactSummary{background:#f2f4f7;border-radius:8px;display:grid;gap:3px;padding:13px}.contactSummary span,.modalExplanation{color:#667085;font-size:13px;line-height:1.6}.modalBody>label:not(.attestation){color:#475467;display:grid;font-size:11px;font-weight:800;gap:6px}.modalBody input[type=datetime-local],.modalBody textarea{border:1px solid #d8dee7;border-radius:7px;outline:none;padding:10px;width:100%}.attestation{align-items:flex-start;background:#fffaeb;border:1px solid #fedf89;border-radius:8px;color:#7a2e0e;display:flex;font-size:12px;font-weight:700;gap:10px;line-height:1.55;padding:13px}.attestation input{height:18px;margin-top:1px;width:18px}.modalActions{display:flex;gap:8px;justify-content:flex-end}.modalActions button{background:#fff;border:1px solid #cfd7e2;border-radius:7px;cursor:pointer;font-size:12px;font-weight:800;min-height:40px;padding:0 15px}.integrityBox{border-radius:8px;display:grid;gap:3px;padding:14px}.integrityBox.verified{background:#e7f2ef;color:#155149}.integrityBox.warning{background:#fffaeb;color:#7a2e0e}.integrityBox span{font-size:11px}.evidenceGrid{display:grid;gap:10px;grid-template-columns:1fr 1fr}.evidenceGrid>div,.consentTextBox{border:1px solid #eaecf0;border-radius:8px;display:grid;gap:4px;padding:12px}.evidenceGrid span,.consentTextBox>span{color:#667085;font-size:10px;font-weight:900;text-transform:uppercase}.evidenceGrid strong{font-size:12px;overflow-wrap:anywhere}.consentTextBox p{font-size:13px;line-height:1.65;margin:3px 0}.consentTextBox small{color:#667085}.evidencePackages,.eventTimeline{border-top:1px solid #eaecf0;padding-top:15px}.evidencePackages h3,.eventTimeline h3{font-size:14px;margin:0 0 10px}.evidencePackages>div,.eventTimeline>div{border-left:2px solid #d8b66a;display:grid;gap:3px;margin:0 0 8px;padding:5px 0 5px 12px}.evidencePackages>div{border:1px solid #eaecf0;border-left:3px solid #216e63;border-radius:7px;padding:10px 12px}.evidencePackages span,.eventTimeline span{color:#667085;font-size:10px}.evidencePackages strong,.eventTimeline strong{font-size:12px;overflow-wrap:anywhere}.evidencePackages small{color:#216e63;font-size:10px;font-weight:800}.eventTimeline small{color:#667085;font-size:11px;line-height:1.45}.evidencePackages>p{color:#667085;font-size:12px;margin:0}@media(max-width:760px){.evidenceGrid{grid-template-columns:1fr}.modalBackdrop{padding:8px}.modalBody,.modalHeader{padding:18px}.headerActions .headerBadge{display:none}}
        .contactGrid{grid-template-columns:minmax(230px,1.2fr) minmax(130px,.65fr) minmax(180px,.8fr) minmax(210px,1fr) minmax(150px,.7fr)}.rowAction{display:flex;justify-content:flex-start}.rowAction button{background:#fff;border:1px solid #216e63;border-radius:7px;color:#216e63;cursor:pointer;font-size:11px;font-weight:900;min-height:36px;padding:0 11px}.rowAction .withdrawButton{border-color:#d92d20;color:#b42318}.withdrawHeader{background:#7a271a}.modalBody input[type=email],.modalBody select{background:#fff;border:1px solid #d8dee7;border-radius:7px;min-height:44px;outline:none;padding:10px;width:100%}.typedEmailState{background:#f2f4f7;border-radius:7px;color:#667085;font-size:12px;font-weight:700;padding:10px}.typedEmailState .match{color:#155149}.typedEmailState .mismatch{color:#b42318}.refusalWarning{background:#fef3f2;border:1px solid #fecdca;border-radius:8px;color:#912018;font-size:12px;font-weight:700;line-height:1.55;padding:13px}.modalActions .dangerButton{background:#b42318;border-color:#b42318;color:#fff}@media(max-width:1100px){.contactGrid{grid-template-columns:minmax(210px,1.1fr) minmax(120px,.6fr) minmax(170px,.8fr) minmax(190px,.9fr) minmax(140px,.65fr)}}@media(max-width:760px){.contactGrid{grid-template-columns:1fr}}
        .contactsToolbar{display:grid;grid-template-columns:minmax(280px,1fr) minmax(200px,280px) auto}.contactsToolbar>input{max-width:none}.contactsToolbar>select{background:#fff;border:1px solid #d8dee7;border-radius:7px;min-height:40px;outline:none;padding:8px 11px;width:100%}.contactsCount{color:#667085;font-size:11px;font-weight:800;white-space:nowrap}.contactGrid{gap:12px;grid-template-columns:minmax(220px,1.15fr) minmax(130px,.65fr) minmax(130px,.65fr) minmax(175px,.8fr) minmax(200px,1fr) minmax(145px,.7fr)}.pipelineName,.crmStage{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pipelineName{color:#344054;font-weight:700}@media(max-width:1100px){.contactsCard{overflow-x:auto}.contactGrid{grid-template-columns:minmax(200px,1.05fr) minmax(115px,.6fr) minmax(120px,.6fr) minmax(165px,.75fr) minmax(180px,.9fr) minmax(135px,.65fr);min-width:1020px}}@media(max-width:760px){.contactsToolbar{display:grid;grid-template-columns:1fr}.contactsCount{white-space:normal}.contactGrid{grid-template-columns:1fr;min-width:0}}
        .contactsCard{overflow:visible}.ownerName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rowAction{justify-content:flex-end;position:relative}.rowAction .actionMenuTrigger{align-items:center;background:#fff;border:1px solid #d8dee7;border-radius:7px;color:#344054;display:flex;font-size:22px;height:36px;justify-content:center;line-height:1;padding:0;width:36px}.rowAction .actionMenuTrigger:hover{background:#f2f4f7;border-color:#98a2b3}.actionMenu{background:#fff;border:1px solid #d8dee7;border-radius:9px;box-shadow:0 14px 36px rgba(16,24,40,.18);display:grid;min-width:245px;overflow:hidden;position:absolute;right:0;top:42px;z-index:30}.actionMenuMeta{background:#f9fafb;border-bottom:1px solid #eaecf0;display:grid;gap:3px;padding:11px 13px}.actionMenuMeta span{color:#667085;font-size:9px;font-weight:900;text-transform:uppercase}.actionMenuMeta strong{font-size:12px}.rowAction .actionMenu>button{background:#fff;border:0;border-radius:0;color:#344054;font-size:12px;font-weight:800;justify-content:flex-start;min-height:40px;padding:9px 13px;text-align:left;width:100%}.rowAction .actionMenu>button:hover:not(:disabled){background:#f2f4f7}.rowAction .actionMenu>.dangerMenuItem{color:#b42318}.rowAction .actionMenu>.refusalMenuItem{background:#fef3f2}.rowAction .actionMenu>.refusalMenuItem:hover:not(:disabled){background:#fee4e2}.rowAction .actionMenu>button+button{border-top:1px solid #f2f4f7}@media(max-width:760px){.actionMenu{position:static;width:100%}.rowAction{align-items:flex-end;flex-direction:column}}
      `}</style>
    </CrmLayout>
  );
}
