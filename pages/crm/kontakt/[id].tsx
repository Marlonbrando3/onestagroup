import CrmLayout from "@/components/crm/CrmLayout";
import {
  CrmActivity,
  CrmActivityStatus,
  CrmActivityType,
  CrmNote,
  CrmPipeline,
  CrmPresentation,
  CrmPresentationEvent,
  CrmStatus,
  crmActivityTypes,
  crmCurrency,
  defaultCrmPipeline,
} from "@/components/crm/types";
import { useCrmActivities } from "@/components/crm/useCrmActivities";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import { useCrmNotes } from "@/components/crm/useCrmNotes";
import { getCrmUser } from "@/components/crm/users";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

type HistoryFilter = "all" | "notes" | "presentations" | "leadmanager" | CrmActivityType;

// Wpis z Lead Managera: zgłoszenie z Facebooka, SMS powitalny, aktywność na /cbtop
type LeadActivityItem = {
  id: string;
  kind: "lead" | "sms" | "tracking";
  event?: string;
  createdAt: string;
  title: string;
  detail: string;
};

type HistoryItem =
  | { kind: "note"; id: string; date: string; note: CrmNote }
  | { kind: "activity"; id: string; date: string; activity: CrmActivity }
  | { kind: "presentation"; id: string; date: string; event: CrmPresentationEvent }
  | { kind: "lm"; id: string; date: string; lm: LeadActivityItem };

function presentationEventText(event: CrmPresentationEvent) {
  if (event.type === "interest") {
    return {
      title: "Klient kliknął „Interesuje mnie ta oferta”",
      detail: event.offerTitle || event.offerId || "",
    };
  }
  if (event.type === "offer_view") {
    return { title: "Klient obejrzał ofertę", detail: event.offerTitle || event.offerId || "" };
  }
  return { title: "Klient otworzył prezentację", detail: event.presentationName };
}

function formatDate(value: string | null) {
  if (!value) return "Bez terminu";
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const isToday = date.toISOString().slice(0, 10) === today;
  const time = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" }).format(date);
  if (isToday) return `Dziś o ${time}`;
  return `${new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(date)}, ${time}`;
}

function activityMoment(activity: CrmActivity) {
  if (activity.status === "done" && activity.completedAt) return activity.completedAt;
  if (activity.dueDate) return `${activity.dueDate}T${activity.dueTime || "00:00"}`;
  return activity.createdAt;
}

function sortPlanned(activities: CrmActivity[]) {
  return [...activities].sort((a, b) => {
    const aDate = a.dueDate ? `${a.dueDate}T${a.dueTime || "23:59"}` : "9999-12-31";
    const bDate = b.dueDate ? `${b.dueDate}T${b.dueTime || "23:59"}` : "9999-12-31";
    return aDate.localeCompare(bDate);
  });
}

function isActivityOverdue(activity: CrmActivity) {
  return activity.status === "planned" && Boolean(activity.dueDate) && activity.dueDate! < today;
}

function ActivityIcon({ type }: { type: CrmActivityType | "note" | "presentation" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: 16,
    height: 16,
    "aria-hidden": true,
  };
  if (type === "presentation") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2" />
        <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" />
      </svg>
    );
  }
  if (type === "note") {
    return (
      <svg {...common}>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5M9 12h7M9 16h5" />
      </svg>
    );
  }
  if (type === "Zadzwoń") {
    return (
      <svg {...common}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
      </svg>
    );
  }
  if (type === "Wyślij oferty") {
    return (
      <svg {...common}>
        <path d="M3 6h18v12H3z" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (type === "Spotkanie") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c2.8 0 5 2.2 5 5" />
      </svg>
    );
  }
  if (type === "Prezentacja") {
    return (
      <svg {...common}>
        <path d="M3 4h18v12H3zM12 16v4M8 20h8" />
        <path d="m10 8 4 2-4 2z" />
      </svg>
    );
  }
  if (type === "Brak kontaktu") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 8 8 8M16 8l-8 8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 4v4h4M12 8v4l3 2" />
    </svg>
  );
}

export default function CRMContactCardPage() {
  const router = useRouter();
  const contactId = typeof router.query.id === "string" ? router.query.id : "";
  const {
    contacts,
    isLoading: isContactLoading,
    error: contactsError,
    updateContact,
    updateContactStatus,
  } = useCrmContacts(contactId ? undefined : null, undefined, contactId || undefined);
  const {
    activities,
    isLoading: areActivitiesLoading,
    error: activitiesError,
    addActivity,
    updateActivity,
    updateActivityStatus,
    deleteActivity,
  } = useCrmActivities(contactId);
  const {
    notes,
    error: notesError,
    addNote,
    updateNote,
    deleteNote,
  } = useCrmNotes(contactId);

  const contact = contacts.find((item) => item.id === contactId);
  const [linkedPresentations, setLinkedPresentations] = useState<CrmPresentation[]>([]);
  const [presentationEvents, setPresentationEvents] = useState<CrmPresentationEvent[]>([]);
  const [leadActivity, setLeadActivity] = useState<LeadActivityItem[]>([]);
  const [presentationsError, setPresentationsError] = useState("");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [presentationQuery, setPresentationQuery] = useState("");
  const [presentationResults, setPresentationResults] = useState<CrmPresentation[]>([]);
  const [isSearchingPresentations, setIsSearchingPresentations] = useState(false);

  async function crmFetch(url: string, init?: RequestInit) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Wystąpił błąd.");
    return result;
  }

  async function loadContactPresentations(markSeen = false) {
    if (!contactId) return;
    try {
      const result = await crmFetch(
        `/api/crm/presentations?contactId=${encodeURIComponent(contactId)}${markSeen ? "&markSeen=1" : ""}`,
      );
      setLinkedPresentations(result.presentations || []);
      setPresentationEvents(result.events || []);
      setPresentationsError("");
    } catch (error) {
      setPresentationsError(error instanceof Error ? error.message : "Nie udało się pobrać prezentacji.");
    }
  }

  useEffect(() => {
    loadContactPresentations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  useEffect(() => {
    if (!contactId) return;
    let ignore = false;
    crmFetch(`/api/crm/lead-activity?contactId=${encodeURIComponent(contactId)}`)
      .then((result) => {
        if (!ignore) setLeadActivity(result.items || []);
      })
      .catch(() => {
        // historia z Lead Managera jest dodatkiem – brak nie blokuje karty
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  useEffect(() => {
    if (!isLinkModalOpen) return;
    let ignore = false;
    setIsSearchingPresentations(true);
    const timer = window.setTimeout(async () => {
      try {
        const result = await crmFetch(
          `/api/crm/presentations?q=${encodeURIComponent(presentationQuery)}`,
        );
        if (!ignore) setPresentationResults(result.presentations || []);
      } catch (error) {
        if (!ignore) {
          setPresentationsError(error instanceof Error ? error.message : "Nie udało się wyszukać prezentacji.");
        }
      } finally {
        if (!ignore) setIsSearchingPresentations(false);
      }
    }, 250);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLinkModalOpen, presentationQuery]);

  async function linkPresentation(presentation: CrmPresentation) {
    if (
      presentation.crmContactId &&
      presentation.crmContactId !== contactId &&
      !window.confirm("Ta prezentacja jest powiązana z innym klientem. Przepiąć ją do tego kontaktu?")
    ) {
      return;
    }
    try {
      await crmFetch("/api/crm/presentations", {
        method: "POST",
        body: JSON.stringify({ presentationId: presentation.id, contactId }),
      });
      setIsLinkModalOpen(false);
      setPresentationQuery("");
      await loadContactPresentations(true);
    } catch (error) {
      setPresentationsError(error instanceof Error ? error.message : "Nie udało się powiązać prezentacji.");
    }
  }

  async function unlinkPresentation(presentation: CrmPresentation) {
    if (!window.confirm(`Odłączyć prezentację „${presentation.name}” od tego klienta?`)) return;
    try {
      await crmFetch("/api/crm/presentations", {
        method: "DELETE",
        body: JSON.stringify({ presentationId: presentation.id }),
      });
      await loadContactPresentations();
    } catch (error) {
      setPresentationsError(error instanceof Error ? error.message : "Nie udało się odłączyć prezentacji.");
    }
  }
  const [pipeline, setPipeline] = useState<CrmPipeline>(defaultCrmPipeline);
  const stages = pipeline.stages.length ? pipeline.stages : defaultCrmPipeline.stages;
  const currentStageIndex = contact ? stages.indexOf(contact.status) : -1;

  const plannedActivities = useMemo(
    () => sortPlanned(activities.filter((activity) => activity.status === "planned")),
    [activities],
  );
  const doneActivities = useMemo(
    () => activities.filter((activity) => activity.status === "done"),
    [activities],
  );

  const historyItems = useMemo<HistoryItem[]>(() => {
    const items: HistoryItem[] = [
      ...notes.map((note) => ({ kind: "note" as const, id: `note-${note.id}`, date: note.createdAt, note })),
      ...doneActivities.map((activity) => ({
        kind: "activity" as const,
        id: `activity-${activity.id}`,
        date: activityMoment(activity),
        activity,
      })),
      ...presentationEvents.map((event) => ({
        kind: "presentation" as const,
        id: `presentation-${event.id}`,
        date: event.createdAt,
        event,
      })),
      ...leadActivity.map((lm) => ({ kind: "lm" as const, id: `lm-${lm.id}`, date: lm.createdAt, lm })),
    ];
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notes, doneActivities, presentationEvents, leadActivity]);

  const historyTypeCounts = useMemo(() => {
    const counts = new Map<CrmActivityType, number>();
    doneActivities.forEach((activity) => counts.set(activity.type, (counts.get(activity.type) || 0) + 1));
    return counts;
  }, [doneActivities]);

  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const visibleHistory = historyItems.filter((item) => {
    if (historyFilter === "all") return true;
    if (historyFilter === "notes") return item.kind === "note";
    if (historyFilter === "presentations") return item.kind === "presentation";
    if (historyFilter === "leadmanager") return item.kind === "lm";
    return item.kind === "activity" && item.activity.type === historyFilter;
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactFormError, setContactFormError] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    maxBudget: "",
    country: "",
    bedrooms: "",
    bathrooms: "",
    coast: "",
    purchaseTimeline: "",
  });
  const [form, setForm] = useState({
    type: "Zadzwoń" as CrmActivityType,
    title: "Zadzwoń",
    dueDate: today,
    dueTime: "",
    note: "",
  });
  const [composerTab, setComposerTab] = useState<"note" | "task">("task");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState("");
  const [editingNoteText, setEditingNoteText] = useState("");

  const [summaryText, setSummaryText] = useState("");
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [markNewActivityDone, setMarkNewActivityDone] = useState(false);
  const [openMenuId, setOpenMenuId] = useState("");
  const [editingActivityId, setEditingActivityId] = useState("");
  const [isSavingActivityEdit, setIsSavingActivityEdit] = useState(false);
  const [activityEditError, setActivityEditError] = useState("");
  const [initializedContactId, setInitializedContactId] = useState("");
  const [activityEditForm, setActivityEditForm] = useState({
    type: "Zadzwoń" as CrmActivityType,
    title: "",
    dueDate: today,
    dueTime: "",
    note: "",
    status: "planned" as CrmActivityStatus,
  });
  const isPageLoading =
    !router.isReady ||
    isContactLoading ||
    areActivitiesLoading ||
    Boolean(contact && initializedContactId !== contact.id);

  useEffect(() => {
    if (!openMenuId) return;
    function closeMenuOnOutsideClick(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest(".crmItemMenu")) return;
      setOpenMenuId("");
    }
    document.addEventListener("pointerdown", closeMenuOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, [openMenuId]);

  useEffect(() => {
    if (!contact) return;
    setContactForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      maxBudget: String(contact.maxBudget || 0),
      country: contact.country,
      bedrooms: contact.bedrooms,
      bathrooms: contact.bathrooms,
      coast: contact.coast,
      purchaseTimeline: contact.purchaseTimeline,
    });
    setSummaryText(contact.note || "");
    setInitializedContactId(contact.id);
  }, [contact]);

  const contactPipelineId = contact?.pipelineId || defaultCrmPipeline.id;
  const contactPipelineOwner = contact?.pipelineOwner || "";
  useEffect(() => {
    if (!contactPipelineOwner) return;
    let ignore = false;
    async function loadPipeline() {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const response = await fetch(
        `/api/crm/pipelines?owner=${encodeURIComponent(contactPipelineOwner)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await response.json();
      if (ignore || !response.ok) return;
      const loaded = (result.pipelines || []) as CrmPipeline[];
      setPipeline(loaded.find((item) => item.id === contactPipelineId) || defaultCrmPipeline);
    }
    loadPipeline();
    return () => {
      ignore = true;
    };
  }, [contactPipelineId, contactPipelineOwner]);

  async function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactId) return;
    const activity = await addActivity({
      contactId,
      type: form.type,
      title: form.title.trim() || form.type,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      note: form.note,
      status: markNewActivityDone ? "done" : "planned",
    });
    if (!activity) return;
    setForm({ type: form.type, title: form.type, dueDate: today, dueTime: "", note: "" });
    setMarkNewActivityDone(false);
    setIsComposerOpen(false);
  }

  function cancelComposer() {
    setForm({ type: "Zadzwoń", title: "Zadzwoń", dueDate: today, dueTime: "", note: "" });
    setMarkNewActivityDone(false);
    setNewNote("");
    setIsComposerOpen(false);
  }

  async function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    const saved = await addNote(newNote);
    setIsSavingNote(false);
    if (!saved) return;
    setNewNote("");
    setIsComposerOpen(false);
    setHistoryFilter((current) => (current === "all" || current === "notes" ? current : "all"));
  }

  async function handleNoteEditSave(id: string) {
    if (!editingNoteText.trim()) return;
    const saved = await updateNote(id, editingNoteText);
    if (!saved) return;
    setEditingNoteId("");
    setEditingNoteText("");
  }

  async function handleNoteDelete(id: string) {
    setOpenMenuId("");
    if (!window.confirm("Usunąć tę notatkę?")) return;
    await deleteNote(id);
  }

  async function handleSummarySave() {
    if (!contactId) return;
    setSummaryError("");
    setIsSavingSummary(true);
    const updated = await updateContact({ id: contactId, note: summaryText });
    setIsSavingSummary(false);
    if (!updated) {
      setSummaryError("Nie udało się zapisać podsumowania.");
      return;
    }
    setSummaryText(updated.note || "");
    setIsEditingSummary(false);
  }

  function changeType(type: CrmActivityType) {
    setForm((current) => ({
      ...current,
      type,
      title: current.title === current.type || !current.title.trim() ? type : current.title,
    }));
  }

  function changeEditType(type: CrmActivityType) {
    setActivityEditForm((current) => ({
      ...current,
      type,
      title: current.title === current.type || !current.title.trim() ? type : current.title,
    }));
  }

  function openActivityEdit(activity: CrmActivity) {
    setOpenMenuId("");
    setActivityEditError("");
    setEditingActivityId(activity.id);
    setActivityEditForm({
      type: activity.type,
      title: activity.title,
      dueDate: activity.dueDate || today,
      dueTime: activity.dueTime ? activity.dueTime.slice(0, 5) : "",
      note: activity.note,
      status: activity.status,
    });
  }

  function closeActivityEdit() {
    setEditingActivityId("");
    setActivityEditError("");
    setIsSavingActivityEdit(false);
  }

  async function handleActivityEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingActivityId) return;
    if (!activityEditForm.title.trim()) {
      setActivityEditError("Tytuł działania jest wymagany.");
      return;
    }
    setActivityEditError("");
    setIsSavingActivityEdit(true);
    const updatedActivity = await updateActivity({
      id: editingActivityId,
      type: activityEditForm.type,
      title: activityEditForm.title,
      dueDate: activityEditForm.dueDate,
      dueTime: activityEditForm.dueTime,
      note: activityEditForm.note,
      status: activityEditForm.status,
    });
    setIsSavingActivityEdit(false);
    if (!updatedActivity) return;
    closeActivityEdit();
  }

  async function handleActivityDelete(id: string) {
    setOpenMenuId("");
    if (!window.confirm("Usunąć to działanie?")) return;
    await deleteActivity(id);
  }

  async function handleStageClick(status: CrmStatus) {
    if (!contactId || !contact || contact.status === status) return;
    await updateContactStatus(contactId, status);
  }

  async function handleContactSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactId) return;
    if (!contactForm.name.trim()) {
      setContactFormError("Imię i nazwisko jest wymagane.");
      return;
    }
    setContactFormError("");
    const normalizedPhone = contactForm.phone.replace(/[\s ]+/g, "");
    setContactForm((current) => ({ ...current, phone: normalizedPhone }));
    setIsSavingContact(true);
    const updatedContact = await updateContact({
      id: contactId,
      name: contactForm.name,
      email: contactForm.email,
      phone: normalizedPhone,
      value: Number(contactForm.maxBudget || 0),
      maxBudget: Number(contactForm.maxBudget || 0),
      country: contactForm.country,
      bedrooms: contactForm.bedrooms,
      bathrooms: contactForm.bathrooms,
      coast: contactForm.coast,
      purchaseTimeline: contactForm.purchaseTimeline,
    });
    setIsSavingContact(false);
    if (!updatedContact) return;
    setIsEditingContact(false);
  }

  function cancelContactEdit() {
    if (contact) {
      setContactForm({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        maxBudget: String(contact.maxBudget || 0),
        country: contact.country,
        bedrooms: contact.bedrooms,
        bathrooms: contact.bathrooms,
        coast: contact.coast,
        purchaseTimeline: contact.purchaseTimeline,
      });
    }
    setContactFormError("");
    setIsEditingContact(false);
  }

  function renderMenu(id: string, onEdit: () => void, onDelete: () => void) {
    return (
      <div className="crmItemMenu">
        <button
          aria-expanded={openMenuId === id}
          aria-label="Opcje"
          className="crmItemMenuToggle"
          type="button"
          onClick={() => setOpenMenuId((current) => (current === id ? "" : id))}
        >
          •••
        </button>
        {openMenuId === id ? (
          <div className="crmItemMenuList">
            <button type="button" onClick={onEdit}>
              <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
                <path d="M4 20h4L19 9l-4-4L4 16z" />
                <path d="M13.5 6.5l4 4" />
              </svg>
              Edytuj
            </button>
            <button className="danger" type="button" onClick={onDelete}>
              <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
              </svg>
              Usuń
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  const ownerLabel = contact ? getCrmUser(contact.pipelineOwner)?.label || contact.pipelineOwner : "";
  const historyTabs: { key: HistoryFilter; label: string; count: number }[] = [
    { key: "all", label: "Wszystko", count: historyItems.length },
    { key: "notes", label: "Notatki", count: notes.length },
    ...(presentationEvents.length
      ? [{ key: "presentations" as HistoryFilter, label: "Prezentacje", count: presentationEvents.length }]
      : []),
    ...(leadActivity.length
      ? [{ key: "leadmanager" as HistoryFilter, label: "Facebook i SMS", count: leadActivity.length }]
      : []),
    ...crmActivityTypes
      .filter((type) => historyTypeCounts.get(type))
      .map((type) => ({ key: type as HistoryFilter, label: type, count: historyTypeCounts.get(type) || 0 })),
  ];

  return (
    <CrmLayout active="contacts">
      {isPageLoading ? (
        <section className="crmContactLoader" aria-busy="true" aria-live="polite">
          <div className="crmContactLoaderContent">
            <span className="crmContactLoaderSpinner" aria-hidden="true" />
            <strong>Ładowanie kontaktu</strong>
            <small>Pobieramy dane klienta i historię komunikacji…</small>
          </div>
        </section>
      ) : (
        <section className="crmContactPage">
          {contact ? (
            <header className="crmDealHeader">
              <div className="crmDealTitleRow">
                <div>
                  <h1>{contact.name}</h1>
                  <span className="crmDealSub">
                    {contact.phone || contact.email || "Brak danych kontaktowych"}
                  </span>
                </div>
                <div className="crmDealHeaderRight">
                  <span className="crmDealOwner">
                    <span className="crmOwnerAvatar">{ownerLabel.slice(0, 1)}</span>
                    <span>
                      <strong>{ownerLabel}</strong>
                      <small>Opiekun</small>
                    </span>
                  </span>
                  <strong className="crmDealValue">
                    {crmCurrency.format(contact.maxBudget || contact.value)}
                  </strong>
                </div>
              </div>

              <ol className="crmStageBar" aria-label="Etap w lejku">
                {stages.map((stage, index) => {
                  const state =
                    index < currentStageIndex ? "past" : index === currentStageIndex ? "current" : "future";
                  return (
                    <li key={stage}>
                      <button
                        className={`crmStage ${state}`}
                        title={`Przenieś na etap: ${stage}`}
                        type="button"
                        onClick={() => handleStageClick(stage)}
                      >
                        <span>{stage}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="crmStageCrumb">
                {pipeline.name}
                <span aria-hidden="true">→</span>
                <strong>{currentStageIndex >= 0 ? contact.status : `${contact.status} (spoza lejka)`}</strong>
              </p>
            </header>
          ) : null}

          {contactsError ? <p className="crmError">{contactsError}</p> : null}
          {activitiesError ? <p className="crmError">{activitiesError}</p> : null}
          {notesError ? <p className="crmError">{notesError}</p> : null}
          {!contact && !contactsError ? (
            <div className="crmContactNotFound">
              <strong>Nie znaleziono kontaktu</strong>
              <span>Rekord nie istnieje albo został usunięty.</span>
            </div>
          ) : null}

          {contact ? (
            <div className="crmContactGrid">
              <aside className="crmSidebar">
                <section className="crmSideSection">
                  <div className="crmSideHeader">
                    <h2>Podsumowanie</h2>
                    {!isEditingContact ? (
                      <button className="crmLinkButton" type="button" onClick={() => setIsEditingContact(true)}>
                        Edytuj
                      </button>
                    ) : null}
                  </div>

                  {isEditingContact ? (
                    <form className="crmContactEditForm" onSubmit={handleContactSave}>
                      {(
                        [
                          ["name", "Imię i nazwisko", "text"],
                          ["email", "Email", "email"],
                          ["phone", "Telefon", "text"],
                          ["maxBudget", "Kwota max EUR", "number"],
                          ["country", "Kraj", "text"],
                          ["coast", "Wybrzeże", "text"],
                          ["bedrooms", "Sypialnie", "text"],
                          ["bathrooms", "Łazienki", "text"],
                          ["purchaseTimeline", "Termin zakupu", "text"],
                        ] as const
                      ).map(([key, label, type]) => (
                        <label key={key}>
                          {label}
                          <input
                            min={type === "number" ? "0" : undefined}
                            type={type}
                            value={contactForm[key]}
                            onChange={(event) => setContactForm({ ...contactForm, [key]: event.target.value })}
                          />
                        </label>
                      ))}
                      {contactFormError ? <p className="crmError">{contactFormError}</p> : null}
                      <div className="crmEditActions">
                        <button disabled={isSavingContact} type="button" onClick={cancelContactEdit}>
                          Anuluj
                        </button>
                        <button className="primary" disabled={isSavingContact} type="submit">
                          {isSavingContact ? "Zapisywanie..." : "Zapisz"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <dl className="crmFactList">
                      <div>
                        <dt>Budżet max</dt>
                        <dd>{contact.maxBudget ? crmCurrency.format(contact.maxBudget) : "—"}</dd>
                      </div>
                      <div>
                        <dt>Telefon</dt>
                        <dd>{contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : "—"}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : "—"}</dd>
                      </div>
                      <div>
                        <dt>Kraj</dt>
                        <dd>{contact.country || "—"}</dd>
                      </div>
                      <div>
                        <dt>Wybrzeże</dt>
                        <dd>{contact.coast || "—"}</dd>
                      </div>
                      <div>
                        <dt>Sypialnie / łazienki</dt>
                        <dd>
                          {contact.bedrooms || "—"} / {contact.bathrooms || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt>Termin zakupu</dt>
                        <dd>{contact.purchaseTimeline || "—"}</dd>
                      </div>
                      <div>
                        <dt>Źródło</dt>
                        <dd>{contact.source || "—"}</dd>
                      </div>
                      <div>
                        <dt>Dodano</dt>
                        <dd>{contact.createdAt ? formatDate(contact.createdAt) : "—"}</dd>
                      </div>
                    </dl>
                  )}
                </section>

                <section className="crmSideSection">
                  <div className="crmSideHeader">
                    <h2>Podsumowanie informacji o kliencie</h2>
                    {!isEditingSummary ? (
                      <button className="crmLinkButton" type="button" onClick={() => setIsEditingSummary(true)}>
                        {summaryText ? "Edytuj" : "Dodaj"}
                      </button>
                    ) : null}
                  </div>
                  {isEditingSummary ? (
                    <div className="crmSummaryEditor">
                      <textarea
                        autoFocus
                        placeholder="Kim jest klient, czego szuka, budżet, ważne ustalenia…"
                        value={summaryText}
                        onChange={(event) => setSummaryText(event.target.value)}
                      />
                      {summaryError ? <p className="crmError">{summaryError}</p> : null}
                      <div className="crmEditActions">
                        <button
                          disabled={isSavingSummary}
                          type="button"
                          onClick={() => {
                            setSummaryText(contact.note || "");
                            setIsEditingSummary(false);
                            setSummaryError("");
                          }}
                        >
                          Anuluj
                        </button>
                        <button className="primary" disabled={isSavingSummary} type="button" onClick={handleSummarySave}>
                          {isSavingSummary ? "Zapisywanie..." : "Zapisz"}
                        </button>
                      </div>
                    </div>
                  ) : summaryText ? (
                    <p className="crmSummaryText">{summaryText}</p>
                  ) : (
                    <p className="crmMuted">Brak podsumowania. Dodaj najważniejsze informacje o kliencie.</p>
                  )}
                </section>

                <section className="crmSideSection">
                  <div className="crmSideHeader">
                    <h2>Prezentacje</h2>
                    <button className="crmLinkButton" type="button" onClick={() => setIsLinkModalOpen(true)}>
                      + Skojarz z prezentacją
                    </button>
                  </div>
                  {presentationsError ? <p className="crmError crmInlineError">{presentationsError}</p> : null}
                  {linkedPresentations.length ? (
                    <ul className="crmLinkedPresentations">
                      {linkedPresentations.map((presentation) => {
                        const lastEvent = presentationEvents.find(
                          (event) => event.presentationId === presentation.id,
                        );
                        return (
                          <li key={presentation.id}>
                            <div>
                              <a href={`/oferty/${presentation.token}`} rel="noreferrer" target="_blank">
                                {presentation.name}
                              </a>
                              <small>
                                {presentation.offersCount} ofert · {formatDate(presentation.createdAt)}
                                {lastEvent ? ` · ostatnia aktywność: ${formatDateTime(lastEvent.createdAt)}` : " · brak aktywności"}
                              </small>
                            </div>
                            <button
                              aria-label="Odłącz prezentację"
                              title="Odłącz prezentację"
                              type="button"
                              onClick={() => unlinkPresentation(presentation)}
                            >
                              ×
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="crmMuted">
                      Brak powiązanych prezentacji. Po skojarzeniu zobaczysz tu i w historii, kiedy klient otwiera prezentację i oferty.
                    </p>
                  )}
                </section>
              </aside>

              <section className="crmMainColumn">
                <div className={`crmComposer ${isComposerOpen ? "open" : ""}`.trim()}>
                  <div className="crmComposerTabs" role="tablist">
                    <button
                      aria-selected={composerTab === "task"}
                      className={composerTab === "task" ? "active" : ""}
                      role="tab"
                      type="button"
                      onClick={() => setComposerTab("task")}
                    >
                      <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
                        <rect height="16" rx="2" width="18" x="3" y="5" />
                        <path d="M3 10h18M8 3v4M16 3v4" />
                      </svg>
                      Aktywność
                    </button>
                    <button
                      aria-selected={composerTab === "note"}
                      className={composerTab === "note" ? "active" : ""}
                      role="tab"
                      type="button"
                      onClick={() => setComposerTab("note")}
                    >
                      <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
                        <path d="M5 4h14v11l-5 5H5z" />
                        <path d="M14 20v-5h5M8 9h8M8 13h4" />
                      </svg>
                      Notatki
                    </button>
                  </div>

                  {!isComposerOpen ? (
                    <button className="crmComposerPlaceholder" type="button" onClick={() => setIsComposerOpen(true)}>
                      {composerTab === "task" ? "Kliknij, aby dodać aktywność…" : "Kliknij, aby dodać notatkę…"}
                    </button>
                  ) : composerTab === "note" ? (
                    <form className="crmNoteComposer" onSubmit={handleNoteSubmit}>
                      <textarea
                        autoFocus
                        placeholder="Przebieg rozmowy, ustalenia, preferencje klienta…"
                        value={newNote}
                        onChange={(event) => setNewNote(event.target.value)}
                      />
                      <div className="crmComposerActions">
                        <button disabled={isSavingNote} type="button" onClick={cancelComposer}>
                          Anuluj
                        </button>
                        <button className="primary" disabled={isSavingNote || !newNote.trim()} type="submit">
                          {isSavingNote ? "Zapisywanie..." : "Zapisz"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form className="crmActivityComposer" onSubmit={handleTaskSubmit}>
                      <div className="crmComposerRow">
                        <span className="crmComposerRowIcon" />
                        <input
                          autoFocus
                          className="crmComposerTitle"
                          placeholder="Tytuł działania"
                          value={form.title}
                          onChange={(event) => setForm({ ...form, title: event.target.value })}
                        />
                      </div>
                      <div className="crmComposerRow">
                        <span className="crmComposerRowIcon" />
                        <div className="crmTypeSegment" aria-label="Typ działania">
                          {crmActivityTypes.map((type) => (
                            <button
                              className={`${form.type === type ? "active" : ""} ${
                                type === "Brak kontaktu" ? "noContact" : ""
                              }`.trim()}
                              key={type}
                              type="button"
                              onClick={() => changeType(type)}
                            >
                              <ActivityIcon type={type} />
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="crmComposerRow">
                        <span className="crmComposerRowIcon" title="Termin">
                          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                        </span>
                        <div className="crmComposerWhen">
                          <input
                            aria-label="Data"
                            type="date"
                            value={form.dueDate}
                            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                          />
                          <input
                            aria-label="Godzina"
                            type="time"
                            value={form.dueTime}
                            onChange={(event) => setForm({ ...form, dueTime: event.target.value })}
                          />
                        </div>
                      </div>
                      <div className="crmComposerRow">
                        <span className="crmComposerRowIcon" title="Notatka">
                          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
                            <path d="M5 4h14v11l-5 5H5z" />
                            <path d="M14 20v-5h5" />
                          </svg>
                        </span>
                        <textarea
                          className="crmComposerNote"
                          placeholder="Notatka do działania: o czym rozmawiać, co ustalono…"
                          value={form.note}
                          onChange={(event) => setForm({ ...form, note: event.target.value })}
                        />
                      </div>
                      <div className="crmComposerRow">
                        <span className="crmComposerRowIcon" title="Status">
                          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
                            <circle cx="12" cy="12" r="9" />
                            <path d="m8 12 3 3 5-6" />
                          </svg>
                        </span>
                        <div className="crmStatusSegment" role="radiogroup" aria-label="Status">
                          <button
                            aria-checked={!markNewActivityDone}
                            className={!markNewActivityDone ? "active" : ""}
                            role="radio"
                            type="button"
                            onClick={() => setMarkNewActivityDone(false)}
                          >
                            Zaplanowane
                          </button>
                          <button
                            aria-checked={markNewActivityDone}
                            className={markNewActivityDone ? "active done" : ""}
                            role="radio"
                            type="button"
                            onClick={() => setMarkNewActivityDone(true)}
                          >
                            Wykonane
                          </button>
                        </div>
                      </div>
                      <div className="crmComposerFooter">
                        <button type="button" onClick={cancelComposer}>
                          Anuluj
                        </button>
                        <button className="primary" type="submit">
                          Zapisz
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <section className="crmBlock">
                  <h2 className="crmBlockTitle">Zaplanowane</h2>
                  {plannedActivities.length ? (
                    <div className="crmFocusList">
                      {plannedActivities.map((activity) => {
                        const overdue = isActivityOverdue(activity);
                        const menuId = `focus-${activity.id}`;
                        return (
                          <article
                            className={`crmFocusCard ${overdue ? "overdue" : ""} ${
                              openMenuId === menuId ? "menuOpen" : ""
                            }`}
                            key={activity.id}
                          >
                            <span className="crmTimelineIcon">
                              <ActivityIcon type={activity.type} />
                            </span>
                            <button
                              aria-label="Oznacz jako wykonane"
                              className="crmCheckCircle"
                              type="button"
                              onClick={() => updateActivityStatus(activity.id, "done")}
                            />
                            <div className="crmCardBody">
                              <h3>{activity.title}</h3>
                              <p className="crmMeta">
                                <span className={overdue ? "overdueText" : ""}>
                                  {formatDate(activity.dueDate)}
                                  {activity.dueTime ? `, ${activity.dueTime.slice(0, 5)}` : ""}
                                  {overdue ? " · zaległe" : ""}
                                </span>
                                <span>{activity.type}</span>
                                <span>{contact.name}</span>
                              </p>
                              {activity.note ? <p className="crmCardNote">{activity.note}</p> : null}
                            </div>
                            {renderMenu(
                              menuId,
                              () => openActivityEdit(activity),
                              () => handleActivityDelete(activity.id),
                            )}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="crmMuted crmEmptyLine">Brak zaplanowanych działań. Dodaj zadanie powyżej.</p>
                  )}
                </section>

                <section className="crmBlock">
                  <h2 className="crmBlockTitle">Historia</h2>
                  <div className="crmHistoryTabs" role="tablist">
                    {historyTabs.map((tab) => (
                      <button
                        className={historyFilter === tab.key ? "active" : ""}
                        key={tab.key}
                        role="tab"
                        type="button"
                        onClick={() => setHistoryFilter(tab.key)}
                      >
                        {tab.label}
                        {tab.key !== "all" ? ` (${tab.count})` : ""}
                      </button>
                    ))}
                  </div>

                  <div className="crmTimelineList">
                    {visibleHistory.map((item) => {
                      if (item.kind === "note") {
                        const note = item.note;
                        const menuId = item.id;
                        const isEditing = editingNoteId === note.id;
                        return (
                          <div className={`crmTimelineRow ${openMenuId === menuId ? "menuOpen" : ""}`} key={item.id}>
                            <span className="crmTimelineIcon">
                              <ActivityIcon type="note" />
                            </span>
                            <article className="crmNoteCard">
                              <div className="crmNoteTop">
                                <p className="crmMeta">
                                  <span>{formatDateTime(note.createdAt)}</span>
                                  <span>{note.createdBy || "CRM"}</span>
                                  {note.updatedAt &&
                                  new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() > 60000 ? (
                                    <span>edytowano</span>
                                  ) : null}
                                </p>
                                {!isEditing
                                  ? renderMenu(
                                      menuId,
                                      () => {
                                        setOpenMenuId("");
                                        setEditingNoteId(note.id);
                                        setEditingNoteText(note.body);
                                      },
                                      () => handleNoteDelete(note.id),
                                    )
                                  : null}
                              </div>
                              {isEditing ? (
                                <div className="crmNoteEdit">
                                  <textarea
                                    autoFocus
                                    value={editingNoteText}
                                    onChange={(event) => setEditingNoteText(event.target.value)}
                                  />
                                  <div className="crmComposerActions">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId("");
                                        setEditingNoteText("");
                                      }}
                                    >
                                      Anuluj
                                    </button>
                                    <button
                                      className="primary"
                                      disabled={!editingNoteText.trim()}
                                      type="button"
                                      onClick={() => handleNoteEditSave(note.id)}
                                    >
                                      Zapisz
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="crmNoteBody">{note.body}</p>
                              )}
                            </article>
                          </div>
                        );
                      }

                      if (item.kind === "lm") {
                        const tone =
                          item.lm.kind === "lead"
                            ? "lead"
                            : item.lm.kind === "sms"
                              ? "sms"
                              : item.lm.event === "urgent_contact_request"
                                ? "urgent"
                                : "tracking";
                        return (
                          <div className="crmTimelineRow" key={item.id}>
                            <span className={`crmTimelineIcon lm ${tone}`}>
                              {item.lm.kind === "lead" ? (
                                <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                                  <circle cx="9" cy="8" r="4" />
                                  <path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" />
                                </svg>
                              ) : item.lm.kind === "sms" ? (
                                <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                                  <path d="M4 5h16v11H9l-5 4z" />
                                </svg>
                              ) : (
                                <ActivityIcon type="presentation" />
                              )}
                            </span>
                            <article className={`crmLmEvent ${tone}`}>
                              <div className="crmCardBody">
                                <h3>{item.lm.title}</h3>
                                {item.lm.detail ? <p className="crmLmDetail">{item.lm.detail}</p> : null}
                                <p className="crmMeta">
                                  <span>{formatDateTime(item.lm.createdAt)}</span>
                                  <span>{item.lm.kind === "tracking" ? "Strona /cbtop (link z SMS-a)" : "Lead Manager"}</span>
                                </p>
                              </div>
                            </article>
                          </div>
                        );
                      }

                      if (item.kind === "presentation") {
                        const text = presentationEventText(item.event);
                        return (
                          <div className="crmTimelineRow" key={item.id}>
                            <span className={`crmTimelineIcon presentation ${item.event.type}`}>
                              <ActivityIcon type="presentation" />
                            </span>
                            <article className={`crmPresentationEvent ${item.event.type}`}>
                              <div className="crmCardBody">
                                <h3>{text.title}</h3>
                                {text.detail ? (
                                  item.event.type !== "open" && item.event.offerId ? (
                                    <a
                                      className="crmPresentationEventLink"
                                      href={`/oferty/${item.event.token}/${item.event.offerId}`}
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      {text.detail}
                                    </a>
                                  ) : (
                                    <p className="crmPresentationEventDetail">{text.detail}</p>
                                  )
                                ) : null}
                                <p className="crmMeta">
                                  <span>{formatDateTime(item.event.createdAt)}</span>
                                  <span>Prezentacja: {item.event.presentationName}</span>
                                </p>
                              </div>
                            </article>
                          </div>
                        );
                      }

                      const activity = item.activity;
                      const menuId = item.id;
                      return (
                        <div className={`crmTimelineRow ${openMenuId === menuId ? "menuOpen" : ""}`} key={item.id}>
                          <span className="crmTimelineIcon">
                            <ActivityIcon type={activity.type} />
                          </span>
                          <article className="crmActivityCard">
                            <button
                              aria-label="Oznacz jako niewykonane"
                              className="crmCheckCircle done"
                              title="Cofnij do zaplanowanych"
                              type="button"
                              onClick={() => updateActivityStatus(activity.id, "planned")}
                            >
                              ✓
                            </button>
                            <div className="crmCardBody">
                              <h3>{activity.title}</h3>
                              <p className="crmMeta">
                                <span>{formatDateTime(activityMoment(activity))}</span>
                                <span>{activity.type}</span>
                                <span>{contact.name}</span>
                              </p>
                              {activity.note ? <p className="crmCardNote">{activity.note}</p> : null}
                            </div>
                            {renderMenu(
                              menuId,
                              () => openActivityEdit(activity),
                              () => handleActivityDelete(activity.id),
                            )}
                          </article>
                        </div>
                      );
                    })}

                    {historyFilter === "all" && contact.createdAt ? (
                      <div className="crmTimelineRow crmTimelineCreated">
                        <span className="crmTimelineDot" />
                        <p>
                          <strong>Kontakt dodany:</strong> {formatDateTime(contact.createdAt)}
                        </p>
                      </div>
                    ) : null}
                    {!visibleHistory.length && historyFilter !== "all" ? (
                      <p className="crmMuted crmEmptyLine">Brak wpisów w tej kategorii.</p>
                    ) : null}
                  </div>
                </section>
              </section>
            </div>
          ) : null}
        </section>
      )}

      {isLinkModalOpen ? (
        <div
          className="crmModalBackdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsLinkModalOpen(false);
          }}
        >
          <section aria-modal="true" className="crmActivityModal crmLinkModal" role="dialog">
            <header>
              <div>
                <p>Skojarz z prezentacją</p>
                <h2>{contact?.name || "Klient"}</h2>
              </div>
              <button aria-label="Zamknij" type="button" onClick={() => setIsLinkModalOpen(false)}>
                ×
              </button>
            </header>
            <input
              autoFocus
              className="crmLinkSearch"
              placeholder="Szukaj: nazwa prezentacji, imię klienta, agent…"
              value={presentationQuery}
              onChange={(event) => setPresentationQuery(event.target.value)}
            />
            <div className="crmLinkResults">
              {isSearchingPresentations && !presentationResults.length ? (
                <p className="crmMuted">Szukam prezentacji…</p>
              ) : presentationResults.length ? (
                presentationResults.map((presentation) => {
                  const isLinkedHere = presentation.crmContactId === contactId;
                  const isLinkedElsewhere = Boolean(presentation.crmContactId) && !isLinkedHere;
                  return (
                    <button
                      className={isLinkedHere ? "linked" : ""}
                      disabled={isLinkedHere}
                      key={presentation.id}
                      type="button"
                      onClick={() => linkPresentation(presentation)}
                    >
                      <span>
                        <strong>{presentation.name}</strong>
                        <small>
                          {[presentation.clientName && `dla: ${presentation.clientName}`, presentation.agentName, `${presentation.offersCount} ofert`, formatDate(presentation.createdAt)]
                            .filter(Boolean)
                            .join(" · ")}
                        </small>
                      </span>
                      <em>
                        {isLinkedHere ? "Powiązana" : isLinkedElsewhere ? "Inny klient – przepnij" : "Skojarz"}
                      </em>
                    </button>
                  );
                })
              ) : (
                <p className="crmMuted">Nie znaleziono prezentacji.</p>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {editingActivityId ? (
        <div className="crmModalBackdrop" role="presentation">
          <section aria-modal="true" className="crmActivityModal" role="dialog">
            <header>
              <div>
                <p>Edycja działania</p>
                <h2>{activityEditForm.title || "Działanie"}</h2>
              </div>
              <button aria-label="Zamknij" type="button" onClick={closeActivityEdit}>
                ×
              </button>
            </header>
            <div className="crmTaskEditor">
              <div className="crmTypeChips" aria-label="Typ działania">
                {crmActivityTypes.map((type) => (
                  <button
                    className={`${activityEditForm.type === type ? "active" : ""} ${
                      type === "Brak kontaktu" ? "noContact" : ""
                    }`.trim()}
                    key={type}
                    type="button"
                    onClick={() => changeEditType(type)}
                  >
                    <ActivityIcon type={type} />
                    {type}
                  </button>
                ))}
              </div>
              <form className="crmActivityForm" onSubmit={handleActivityEditSubmit}>
                <div className="crmTaskScheduleRow">
                  <input
                    placeholder="Tytuł działania"
                    value={activityEditForm.title}
                    onChange={(event) => setActivityEditForm({ ...activityEditForm, title: event.target.value })}
                  />
                  <input
                    type="date"
                    value={activityEditForm.dueDate}
                    onChange={(event) => setActivityEditForm({ ...activityEditForm, dueDate: event.target.value })}
                  />
                  <input
                    type="time"
                    value={activityEditForm.dueTime}
                    onChange={(event) => setActivityEditForm({ ...activityEditForm, dueTime: event.target.value })}
                  />
                </div>
                <select
                  value={activityEditForm.status}
                  onChange={(event) =>
                    setActivityEditForm({ ...activityEditForm, status: event.target.value as CrmActivityStatus })
                  }
                >
                  <option value="planned">Zaplanowane</option>
                  <option value="done">Wykonane</option>
                </select>
                <textarea
                  placeholder="Opis, ustalenia…"
                  value={activityEditForm.note}
                  onChange={(event) => setActivityEditForm({ ...activityEditForm, note: event.target.value })}
                />
                {activityEditError ? <p className="crmError">{activityEditError}</p> : null}
                <div className="crmModalActions">
                  <button disabled={isSavingActivityEdit} type="button" onClick={closeActivityEdit}>
                    Anuluj
                  </button>
                  <button className="primary" disabled={isSavingActivityEdit} type="submit">
                    {isSavingActivityEdit ? "Zapisywanie..." : "Zapisz zmiany"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}

      <style jsx>{`
        .crmContactLoader {
          align-items: center;
          background: #f4f6f8;
          display: flex;
          justify-content: center;
          min-height: calc(100vh - 28px);
          padding: 40px 20px;
        }
        .crmContactLoaderContent {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }
        .crmContactLoaderContent strong {
          color: #17202a;
          font-size: 15px;
        }
        .crmContactLoaderContent small {
          color: #667085;
          font-size: 12px;
        }
        .crmContactLoaderSpinner {
          animation: crmContactSpin 0.8s linear infinite;
          border: 3px solid #cddbd8;
          border-radius: 50%;
          border-top-color: #216e63;
          height: 42px;
          margin-bottom: 5px;
          width: 42px;
        }
        @keyframes crmContactSpin {
          to {
            transform: rotate(360deg);
          }
        }
        .crmContactNotFound {
          align-items: center;
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: center;
          min-height: 280px;
          text-align: center;
        }
        .crmContactPage {
          background: #ffffff;
          color: #21232c;
          display: flex;
          flex-direction: column;
          font-size: 13px;
          height: 100vh;
          overflow: hidden;
        }
        .crmMuted {
          color: #747678;
          margin: 0;
        }
        .crmError {
          color: #b42318;
          margin: 8px 20px 0;
        }

        /* Header + stage bar */
        .crmDealHeader {
          background: #ffffff;
          border-bottom: 1px solid #e3e6ea;
          display: grid;
          gap: 10px;
          flex: 0 0 auto;
          padding: 14px 20px 10px;
          position: relative;
          z-index: 30;
        }
        .crmDealTitleRow {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }
        .crmDealTitleRow h1 {
          font-size: 24px;
          font-weight: 600;
          line-height: 1.15;
          margin: 0;
        }
        .crmDealSub {
          color: #747678;
          font-size: 12px;
        }
        .crmDealHeaderRight {
          align-items: center;
          display: flex;
          gap: 18px;
        }
        .crmDealOwner {
          align-items: center;
          display: flex;
          gap: 8px;
        }
        .crmDealOwner strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
        }
        .crmDealOwner small {
          color: #747678;
          font-size: 11px;
        }
        .crmOwnerAvatar {
          align-items: center;
          background: #e3e6ea;
          border-radius: 50%;
          color: #44474b;
          display: flex;
          font-weight: 700;
          height: 30px;
          justify-content: center;
          width: 30px;
        }
        .crmDealValue {
          font-size: 18px;
          font-weight: 700;
        }
        .crmStageBar {
          display: flex;
          gap: 3px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .crmStageBar li {
          flex: 1 1 0;
          min-width: 0;
        }
        .crmStage {
          align-items: center;
          background: #e3e6ea;
          border: 0;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%, 9px 50%);
          color: #5b5f66;
          cursor: pointer;
          display: flex;
          font-size: 11px;
          font-weight: 600;
          height: 26px;
          justify-content: center;
          padding: 0 14px;
          transition: filter 0.15s ease;
          width: 100%;
        }
        .crmStageBar li:first-child .crmStage {
          border-radius: 4px 0 0 4px;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%);
        }
        .crmStageBar li:last-child .crmStage {
          border-radius: 0 4px 4px 0;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 9px 50%);
        }
        .crmStage span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .crmStage.past,
        .crmStage.current {
          background: #08a742;
          color: #ffffff;
        }
        .crmStage.current {
          background: #068a36;
        }
        .crmStage:hover {
          filter: brightness(0.95);
        }
        .crmStageCrumb {
          align-items: center;
          color: #3c61c4;
          display: flex;
          font-size: 12px;
          gap: 6px;
          margin: 0;
        }
        .crmStageCrumb span {
          color: #747678;
        }
        .crmStageCrumb strong {
          font-weight: 500;
        }

        /* Layout */
        .crmContactGrid {
          display: grid;
          flex: 1 1 auto;
          grid-template-columns: 340px minmax(0, 1fr);
          min-height: 0;
        }
        .crmSidebar,
        .crmMainColumn {
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .crmSidebar {
          border-right: 1px solid #e3e6ea;
        }
        .crmSidebar::-webkit-scrollbar,
        .crmMainColumn::-webkit-scrollbar {
          width: 4px;
        }
        .crmSidebar::-webkit-scrollbar-track,
        .crmMainColumn::-webkit-scrollbar-track {
          background: transparent;
        }
        .crmSidebar::-webkit-scrollbar-thumb,
        .crmMainColumn::-webkit-scrollbar-thumb {
          background: #c7cfd8;
          border-radius: 999px;
        }
        @supports (-moz-appearance: none) {
          .crmSidebar,
          .crmMainColumn {
            scrollbar-color: #c7cfd8 transparent;
            scrollbar-width: thin;
          }
        }
        .crmSideSection {
          border-bottom: 1px solid #e3e6ea;
          display: grid;
          gap: 10px;
          padding: 16px 20px;
        }
        .crmSideHeader {
          align-items: center;
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }
        .crmSideHeader h2,
        .crmBlockTitle {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .crmLinkButton {
          background: transparent;
          border: 0;
          color: #3c61c4;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 2px 4px;
        }
        .crmFactList {
          display: grid;
          gap: 9px;
          margin: 0;
        }
        .crmFactList > div {
          display: grid;
          gap: 10px;
          grid-template-columns: 130px minmax(0, 1fr);
        }
        .crmFactList dt {
          color: #747678;
          margin: 0;
        }
        .crmFactList dd {
          margin: 0;
          overflow-wrap: anywhere;
        }
        .crmFactList a {
          color: #3c61c4;
          text-decoration: none;
        }
        .crmSummaryText {
          line-height: 1.5;
          margin: 0;
          white-space: pre-wrap;
        }
        .crmContactEditForm,
        .crmSummaryEditor {
          display: grid;
          gap: 8px;
        }
        .crmContactEditForm label {
          color: #747678;
          display: grid;
          font-size: 11px;
          gap: 4px;
        }
        .crmContactEditForm input,
        .crmSummaryEditor textarea,
        .crmActivityForm input,
        .crmActivityForm select,
        .crmActivityForm textarea,
        .crmNoteEdit textarea {
          background: #ffffff;
          border: 1px solid #c6c8cc;
          border-radius: 4px;
          color: #21232c;
          font: inherit;
          min-height: 34px;
          outline: 0;
          padding: 0 9px;
          width: 100%;
        }
        .crmSummaryEditor textarea,
        .crmActivityForm textarea,
        .crmNoteEdit textarea {
          line-height: 1.45;
          min-height: 120px;
          padding: 9px;
          resize: vertical;
        }
        .crmContactEditForm input:focus,
        .crmSummaryEditor textarea:focus,
        .crmActivityForm input:focus,
        .crmActivityForm textarea:focus,
        .crmNoteEdit textarea:focus {
          border-color: #3c61c4;
          box-shadow: 0 0 0 2px rgba(60, 97, 196, 0.15);
        }
        .crmEditActions,
        .crmComposerActions,
        .crmModalActions {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .crmEditActions button,
        .crmComposerActions button,
        .crmModalActions button {
          background: #ffffff;
          border: 1px solid #c6c8cc;
          border-radius: 4px;
          color: #21232c;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          min-height: 32px;
          padding: 0 12px;
        }
        .crmEditActions button.primary,
        .crmComposerActions button.primary,
        .crmModalActions button.primary {
          background: #08a742;
          border-color: #08a742;
          color: #ffffff;
        }
        .crmEditActions button:disabled,
        .crmComposerActions button:disabled,
        .crmModalActions button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        /* Main column */
        .crmMainColumn {
          align-content: start;
          background: #f7f7f8;
          display: grid;
          gap: 22px;
          grid-auto-rows: max-content;
          padding: 18px 22px 40px;
        }
        .crmMainColumn > * {
          min-height: min-content;
        }
        .crmComposer {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(33, 35, 44, 0.06);
          flex-shrink: 0;
          overflow: hidden;
        }
        .crmComposerTabs button {
          align-items: center;
          display: inline-flex;
          gap: 6px;
        }
        .crmComposerPlaceholder {
          background: #ffffff;
          border: 0;
          color: #8a8d93;
          cursor: text;
          display: block;
          font: inherit;
          font-size: 13px;
          padding: 16px 16px 18px;
          text-align: left;
          width: 100%;
        }
        .crmComposerPlaceholder:hover {
          background: #fafbfc;
          color: #5b5f66;
        }
        .crmActivityComposer {
          display: grid;
          gap: 10px;
          padding: 14px 16px 0;
        }
        .crmComposerRow {
          align-items: start;
          display: grid;
          gap: 10px;
          grid-template-columns: 22px minmax(0, 1fr);
        }
        .crmComposerRowIcon {
          align-items: center;
          color: #5b5f66;
          display: flex;
          height: 34px;
          justify-content: center;
        }
        .crmComposerTitle,
        .crmComposerWhen input,
        .crmComposerNote {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          font: inherit;
          font-size: 13px;
          padding: 8px 10px;
        }
        .crmComposerTitle {
          font-size: 17px;
          padding: 8px 12px;
          width: 100%;
        }
        .crmComposerTitle:focus,
        .crmComposerWhen input:focus,
        .crmComposerNote:focus {
          border-color: #3c61c4;
          box-shadow: 0 0 0 3px rgba(60, 97, 196, 0.14);
          outline: none;
        }
        .crmTypeSegment,
        .crmStatusSegment {
          border: 1px solid #d5d9de;
          border-radius: 6px;
          display: inline-flex;
          flex-wrap: wrap;
          justify-self: start;
          overflow: hidden;
        }
        .crmTypeSegment button,
        .crmStatusSegment button {
          align-items: center;
          background: #ffffff;
          border: 0;
          border-right: 1px solid #e3e6ea;
          color: #3b3e45;
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          gap: 6px;
          padding: 7px 11px;
        }
        .crmTypeSegment button:last-child,
        .crmStatusSegment button:last-child {
          border-right: 0;
        }
        .crmTypeSegment button:hover,
        .crmStatusSegment button:hover {
          background: #f4f6f8;
        }
        .crmTypeSegment button.active,
        .crmStatusSegment button.active {
          background: #eaf0fc;
          box-shadow: inset 0 0 0 1px #3c61c4;
          color: #2b4fae;
        }
        .crmTypeSegment button.noContact.active {
          background: #fdeeee;
          box-shadow: inset 0 0 0 1px #c94a4a;
          color: #a83434;
        }
        .crmStatusSegment button.active.done {
          background: #e8f6ee;
          box-shadow: inset 0 0 0 1px #2f9e62;
          color: #1f7a48;
        }
        .crmComposerWhen {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .crmComposerWhen input[type="date"] {
          min-width: 160px;
        }
        .crmComposerWhen input[type="time"] {
          min-width: 110px;
        }
        .crmComposerNote {
          background: #fff8d8;
          border-color: #f0e2a6;
          line-height: 1.5;
          min-height: 92px;
          resize: vertical;
          width: 100%;
        }
        .crmComposerFooter {
          border-top: 1px solid #e3e6ea;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin: 4px -16px 0;
          padding: 10px 16px;
        }
        .crmComposerFooter button {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          padding: 7px 14px;
        }
        .crmComposerFooter button.primary {
          background: #2f9e62;
          border-color: #2f9e62;
          color: #ffffff;
        }
        .crmComposerFooter button.primary:hover {
          background: #27875a;
        }
        .crmComposerTabs {
          border-bottom: 1px solid #e3e6ea;
          display: flex;
          gap: 4px;
          padding: 0 10px;
        }
        .crmComposerTabs button {
          background: transparent;
          border: 0;
          border-bottom: 2px solid transparent;
          color: #5b5f66;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 11px 10px 9px;
        }
        .crmComposerTabs button.active {
          border-bottom-color: #3c61c4;
          color: #21232c;
        }
        .crmNoteComposer {
          background: #fff8d8;
          display: grid;
          gap: 8px;
          padding: 12px;
        }
        .crmNoteComposer textarea {
          background: transparent;
          border: 0;
          color: #21232c;
          font: inherit;
          line-height: 1.5;
          min-height: 90px;
          outline: 0;
          resize: vertical;
          width: 100%;
        }
        .crmTaskEditor {
          display: grid;
          gap: 10px;
          padding: 12px;
        }
        .crmTypeChips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .crmTypeChips button {
          align-items: center;
          background: #ffffff;
          border: 1px solid #c6c8cc;
          border-radius: 4px;
          color: #3b3f45;
          cursor: pointer;
          display: inline-flex;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
          min-height: 30px;
          padding: 0 10px;
        }
        .crmTypeChips button.active {
          background: #eef3fd;
          border-color: #3c61c4;
          color: #2b4ba1;
        }
        .crmTypeChips button.noContact.active {
          background: #fdecec;
          border-color: #c0392b;
          color: #a12d22;
        }
        .crmActivityForm {
          display: grid;
          gap: 8px;
        }
        .crmTaskScheduleRow {
          display: grid;
          gap: 8px;
          grid-template-columns: minmax(0, 1fr) 150px 110px;
        }
        .crmComposerActions .crmCheckboxRow {
          align-items: center;
          color: #5b5f66;
          display: flex;
          font-size: 13px;
          gap: 7px;
          margin-right: auto;
        }
        .crmCheckboxRow input {
          accent-color: #08a742;
          height: 16px;
          width: 16px;
        }
        .crmBlock {
          display: grid;
          gap: 10px;
        }
        .crmEmptyLine {
          padding: 4px 2px;
        }
        .crmFocusList,
        .crmTimelineList {
          display: grid;
          gap: 10px;
        }
        .crmFocusCard,
        .crmActivityCard {
          align-items: start;
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(33, 35, 44, 0.06);
          display: grid;
          gap: 10px;
          grid-template-columns: 20px minmax(0, 1fr) auto;
          padding: 12px 12px 12px 14px;
          position: relative;
        }
        .crmFocusCard {
          grid-template-columns: 32px 20px minmax(0, 1fr) auto;
          padding-left: 10px;
        }
        .crmFocusCard.overdue {
          border-color: #f0b4ad;
        }
        .crmFocusCard.menuOpen,
        .crmTimelineRow.menuOpen {
          z-index: 20;
        }
        .crmCheckCircle {
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #9ea2a8;
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          font-size: 11px;
          font-weight: 900;
          height: 18px;
          justify-content: center;
          margin-top: 2px;
          padding: 0;
          width: 18px;
        }
        .crmCheckCircle:hover {
          border-color: #08a742;
        }
        .crmCheckCircle.done {
          background: #08a742;
          border-color: #08a742;
        }
        .crmCardBody {
          display: grid;
          gap: 4px;
          min-width: 0;
        }
        .crmCardBody h3 {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
        }
        .crmMeta {
          align-items: center;
          color: #747678;
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          gap: 6px;
          margin: 0;
        }
        .crmMeta span:not(:last-child)::after {
          color: #b4b7bc;
          content: "·";
          margin-left: 6px;
        }
        .overdueText {
          color: #c0392b;
          font-weight: 600;
        }
        .crmCardNote {
          background: #fff8d8;
          border-radius: 4px;
          color: #3b3f45;
          line-height: 1.45;
          margin: 4px 0 0;
          padding: 8px 10px;
          white-space: pre-wrap;
        }

        /* History */
        .crmHistoryTabs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .crmHistoryTabs button {
          background: transparent;
          border: 0;
          border-radius: 4px;
          color: #21232c;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 10px;
        }
        .crmHistoryTabs button:hover {
          background: #eceef1;
        }
        .crmHistoryTabs button.active {
          background: #e4ebfa;
          color: #2b4ba1;
        }
        .crmTimelineList {
          position: relative;
        }
        .crmTimelineRow {
          align-items: start;
          display: grid;
          gap: 12px;
          grid-template-columns: 32px minmax(0, 1fr);
          position: relative;
        }
        .crmTimelineRow::before {
          border-left: 1px dashed #c6c8cc;
          bottom: -12px;
          content: "";
          left: 15px;
          position: absolute;
          top: 34px;
        }
        .crmTimelineRow:last-child::before {
          display: none;
        }
        .crmTimelineIcon {
          align-items: center;
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 50%;
          color: #5b5f66;
          display: flex;
          height: 32px;
          justify-content: center;
          position: relative;
          width: 32px;
          z-index: 1;
        }
        .crmFocusCard .crmTimelineIcon {
          height: 28px;
          width: 28px;
        }
        .crmNoteCard {
          background: #fff8d8;
          border: 1px solid #f3e3a1;
          border-radius: 8px;
          display: grid;
          gap: 6px;
          padding: 10px 12px 12px 14px;
          position: relative;
        }
        .crmNoteTop {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }
        .crmNoteBody {
          color: #21232c;
          line-height: 1.5;
          margin: 0;
          white-space: pre-wrap;
        }
        .crmNoteEdit {
          display: grid;
          gap: 8px;
        }
        .crmTimelineCreated {
          align-items: center;
          color: #5b5f66;
        }
        .crmTimelineCreated p {
          margin: 0;
        }
        .crmTimelineCreated strong {
          font-weight: 600;
        }
        .crmTimelineDot {
          background: #ffffff;
          border: 1.5px solid #c6c8cc;
          border-radius: 50%;
          height: 12px;
          justify-self: center;
          width: 12px;
        }

        /* Presentations */
        .crmInlineError {
          margin: 0;
        }
        .crmLinkedPresentations {
          display: grid;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .crmLinkedPresentations li {
          align-items: start;
          border: 1px solid #e3e6ea;
          border-radius: 6px;
          display: grid;
          gap: 8px;
          grid-template-columns: minmax(0, 1fr) auto;
          padding: 8px 10px;
        }
        .crmLinkedPresentations a {
          color: #3c61c4;
          font-weight: 600;
          text-decoration: none;
        }
        .crmLinkedPresentations small {
          color: #747678;
          display: block;
          font-size: 11px;
          margin-top: 2px;
        }
        .crmLinkedPresentations button {
          background: transparent;
          border: 0;
          color: #9ea2a8;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 0 2px;
        }
        .crmLinkedPresentations button:hover {
          color: #c0392b;
        }
        .crmTimelineIcon.presentation {
          color: #3c61c4;
        }
        .crmTimelineIcon.presentation.interest {
          background: #e6f6ec;
          border-color: #9fd9b5;
          color: #08a742;
        }
        .crmPresentationEvent {
          background: #ffffff;
          border: 1px solid #d9e2f6;
          border-left: 3px solid #3c61c4;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .crmPresentationEvent.interest {
          background: #f3fbf6;
          border-color: #bfe6cd;
          border-left-color: #08a742;
        }
        .crmTimelineIcon.lm.lead {
          background: #eef3ff;
          border-color: #c9d6f6;
          color: #1877f2;
        }
        .crmTimelineIcon.lm.sms {
          color: #5b5f66;
        }
        .crmTimelineIcon.lm.urgent {
          background: #fdeeee;
          border-color: #f0b8b8;
          color: #c0392b;
        }
        .crmLmEvent {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-left: 3px solid #9aa3ad;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .crmLmEvent.lead {
          border-color: #d6e2fb;
          border-left-color: #1877f2;
        }
        .crmLmEvent.tracking {
          border-color: #d9e2f6;
          border-left-color: #3c61c4;
        }
        .crmLmEvent.urgent {
          background: #fff6f5;
          border-color: #f3c6c1;
          border-left-color: #c0392b;
        }
        .crmLmDetail {
          color: #3b3f45;
          margin: 0;
          white-space: pre-wrap;
        }
        .crmPresentationEventLink {
          color: #3c61c4;
          font-weight: 500;
          text-decoration: none;
        }
        .crmPresentationEventLink:hover {
          text-decoration: underline;
        }
        .crmPresentationEventDetail {
          color: #3b3f45;
          margin: 0;
        }
        .crmLinkModal {
          width: min(640px, 100%);
        }
        .crmLinkSearch {
          border: 1px solid #c6c8cc;
          border-radius: 6px;
          font: inherit;
          font-size: 14px;
          margin-top: 8px;
          min-height: 38px;
          outline: 0;
          padding: 0 12px;
          width: 100%;
        }
        .crmLinkSearch:focus {
          border-color: #3c61c4;
          box-shadow: 0 0 0 2px rgba(60, 97, 196, 0.15);
        }
        .crmLinkResults {
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          display: grid;
          margin-top: 8px;
          max-height: 420px;
          overflow-y: auto;
        }
        .crmLinkResults > p {
          padding: 14px;
        }
        .crmLinkResults button {
          align-items: center;
          background: #ffffff;
          border: 0;
          border-bottom: 1px solid #f0f1f3;
          cursor: pointer;
          display: grid;
          font: inherit;
          gap: 12px;
          grid-template-columns: minmax(0, 1fr) auto;
          padding: 10px 12px;
          text-align: left;
        }
        .crmLinkResults button:hover:not(:disabled) {
          background: #f5f7fb;
        }
        .crmLinkResults button:disabled {
          cursor: default;
        }
        .crmLinkResults strong {
          display: block;
          font-weight: 600;
        }
        .crmLinkResults small {
          color: #747678;
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }
        .crmLinkResults em {
          color: #3c61c4;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          white-space: nowrap;
        }
        .crmLinkResults button.linked em {
          color: #08a742;
        }

        /* Item menu (renderMenu jest poza drzewem JSX ze <style jsx>, dlatego style globalne z prefiksem crm) */
        :global(.crmItemMenu) {
          position: relative;
        }
        :global(.crmItemMenuToggle) {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #747678;
          cursor: pointer;
          display: inline-flex;
          font-size: 10px;
          height: 26px;
          justify-content: center;
          letter-spacing: 1px;
          min-width: 30px;
          padding: 0 6px;
        }
        :global(.crmItemMenuToggle:hover),
        :global(.crmItemMenuToggle[aria-expanded="true"]) {
          background: #eef0f3;
          color: #21232c;
        }
        :global(.crmItemMenuToggle:focus-visible) {
          box-shadow: 0 0 0 2px rgba(60, 97, 196, 0.35);
          outline: none;
        }
        :global(.crmItemMenuList) {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          box-shadow: 0 10px 28px rgba(33, 35, 44, 0.16);
          display: grid;
          gap: 2px;
          min-width: 150px;
          padding: 5px;
          position: absolute;
          right: 0;
          top: 30px;
          z-index: 40;
        }
        :global(.crmItemMenuList button) {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          display: flex;
          font: inherit;
          font-size: 13px;
          font-weight: 500;
          gap: 9px;
          padding: 8px 10px;
          text-align: left;
          white-space: nowrap;
          width: 100%;
        }
        :global(.crmItemMenuList button svg) {
          color: #747678;
          flex: 0 0 auto;
        }
        :global(.crmItemMenuList button:hover) {
          background: #f1f3f6;
        }
        :global(.crmItemMenuList button.danger) {
          color: #c0392b;
        }
        :global(.crmItemMenuList button.danger svg) {
          color: #c0392b;
        }
        :global(.crmItemMenuList button.danger:hover) {
          background: #fdeeee;
        }

        /* Modal */
        .crmModalBackdrop {
          align-items: center;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 19px;
          position: fixed;
          z-index: 80;
        }
        .crmActivityModal {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          display: grid;
          gap: 6px;
          max-height: calc(100vh - 48px);
          overflow: auto;
          padding: 16px;
          width: min(760px, 100%);
        }
        .crmActivityModal header {
          align-items: start;
          display: flex;
          justify-content: space-between;
        }
        .crmActivityModal header p {
          color: #747678;
          font-size: 12px;
          margin: 0 0 2px;
        }
        .crmActivityModal header h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .crmActivityModal header > button {
          background: transparent;
          border: 0;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
        }
        .crmActivityModal .crmTaskEditor {
          padding: 6px 0 0;
        }

        @media (max-width: 1000px) {
          .crmContactPage {
            height: auto;
            overflow: visible;
          }
          .crmContactGrid {
            grid-template-columns: 1fr;
          }
          .crmSidebar,
          .crmMainColumn {
            overflow: visible;
          }
          .crmSidebar {
            border-right: 0;
          }
          .crmDealTitleRow {
            align-items: start;
            flex-direction: column;
          }
          .crmStageBar {
            overflow-x: auto;
          }
          .crmStageBar li {
            flex: 0 0 auto;
          }
          .crmStage {
            min-width: 120px;
          }
          .crmTaskScheduleRow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
