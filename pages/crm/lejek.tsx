import CrmLayout from "@/components/crm/CrmLayout";
import {
  CrmActivity,
  CrmActivityType,
  CrmContact,
  CrmPipeline,
  CrmStatus,
  customCrmPipelineDraftStages,
  crmActivityTypes,
  crmStatuses,
  defaultCrmPipeline,
} from "@/components/crm/types";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import {
  crmUsers,
  getCrmUser,
  isCrmAdmin,
  normalizeCrmEmail,
} from "@/components/crm/users";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import {
  DragEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const today = new Date().toISOString().slice(0, 10);
const crmBudgetFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const emptyPipelineContactForm = {
  name: "",
  email: "",
  phone: "",
  maxBudget: "",
  country: "",
  bedrooms: "",
  bathrooms: "",
  coast: "",
  purchaseTimeline: "",
  label: "",
};

const emptyPipelineDraftName = "Nowy lejek";

function sortActivitiesByDueDate(activities: CrmActivity[]) {
  return [...activities].sort((a, b) => {
    const aDate = a.dueDate || "9999-12-31";
    const bDate = b.dueDate || "9999-12-31";
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    return (a.dueTime || "99:99").localeCompare(b.dueTime || "99:99");
  });
}

function getActivityTone(activity: CrmActivity) {
  // overdue: termin minął (także dzisiaj po godzinie), today: dzisiaj i jeszcze przed czasem,
  // future: późniejszy dzień albo brak terminu
  if (!activity.dueDate) return "future";
  if (activity.dueDate < today) return "overdue";
  if (activity.dueDate > today) return "future";
  if (activity.dueTime) {
    const now = new Date();
    const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (activity.dueTime.slice(0, 5) < nowTime) return "overdue";
  }
  return "today";
}

function getActivityLabel(activity: CrmActivity) {
  if (!activity.dueDate) return "Bez terminu";
  if (activity.dueDate === today) return "Dzisiaj";
  if (activity.dueDate < today) return "Zaległe";
  return "Zaplanowane";
}

function formatActivityDate(activity: CrmActivity) {
  if (!activity.dueDate) return "Bez terminu";
  const date = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(
    new Date(activity.dueDate),
  );
  return activity.dueTime ? `${date}, ${activity.dueTime.slice(0, 5)}` : date;
}

function formatActivityShortDate(activity: CrmActivity) {
  if (!activity.dueDate) return "Bez terminu";
  const time = activity.dueTime ? `, ${activity.dueTime.slice(0, 5)}` : "";
  if (activity.dueDate === today) return `Dzisiaj${time}`;
  const tomorrow = new Date(`${today}T12:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (activity.dueDate === tomorrow.toISOString().slice(0, 10)) return `Jutro${time}`;
  const date = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" }).format(
    new Date(activity.dueDate),
  );
  return `${activity.dueDate < today ? "Zaległe: " : ""}${date}${time}`;
}

function activityTypeGlyph(type: CrmActivityType) {
  const glyphs: Record<string, string> = {
    "Zadzwoń": "☎",
    "Wyślij oferty": "✉",
    "Follow up": "↻",
    Spotkanie: "👥",
    Prezentacja: "▶",
    "Brak kontaktu": "✕",
  };
  return glyphs[type] || "•";
}

function getActivityPopupPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const popupWidth = Math.min(340, window.innerWidth - 32);
  const gap = 12;
  const left =
    rect.right + gap + popupWidth <= window.innerWidth - 16
      ? rect.right + gap
      : Math.max(16, rect.left - popupWidth - gap);
  const top = Math.min(Math.max(18, rect.top - 12), window.innerHeight - 128);

  return { left, top };
}

export default function CRMPipelinePage() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [selectedPipelineId, setSelectedPipelineId] = useState(
    defaultCrmPipeline.id,
  );
  const userIsAdmin = isCrmAdmin(currentUserEmail);
  const visibleOwner = currentUserEmail
    ? userIsAdmin
      ? selectedOwner
      : currentUserEmail
    : null;
  const {
    contacts,
    isLoading: isContactsLoading,
    error,
    updateContact,
    updateContactStatus,
    deleteContact,
    reload,
  } = useCrmContacts(visibleOwner, selectedPipelineId);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState("");
  const [openActivityContactId, setOpenActivityContactId] = useState("");
  const [openActivityMode, setOpenActivityMode] = useState<"details" | "add" | "edit">(
    "details",
  );
  const [activityPopupPosition, setActivityPopupPosition] = useState({
    left: 120,
    top: 76,
  });
  const [isSavingNewActivity, setIsSavingNewActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState("");
  const [activityFormError, setActivityFormError] = useState("");
  const [activityForm, setActivityForm] = useState({
    type: "Zadzwoń" as CrmActivityType,
    title: "Zadzwoń",
    dueDate: today,
    dueTime: "",
    note: "",
    completed: false,
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<CrmStatus | null>(null);
  const [isDeleteOver, setIsDeleteOver] = useState(false);
  const [isTransferOver, setIsTransferOver] = useState(false);
  const [transferContactId, setTransferContactId] = useState("");
  const [transferOwner, setTransferOwner] = useState(crmUsers[0]?.email || "");
  const [transferError, setTransferError] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [addContactStage, setAddContactStage] = useState<CrmStatus | null>(
    null,
  );
  const [addContactPipelineId, setAddContactPipelineId] = useState(
    defaultCrmPipeline.id,
  );
  const [pipelineContactForm, setPipelineContactForm] = useState(
    emptyPipelineContactForm,
  );
  const [pipelineContactFormError, setPipelineContactFormError] = useState("");
  const [isSavingPipelineContact, setIsSavingPipelineContact] = useState(false);
  const [pipelines, setPipelines] = useState<CrmPipeline[]>([
    defaultCrmPipeline,
  ]);
  const [pipelinesError, setPipelinesError] = useState("");
  const [isPipelineEditorOpen, setIsPipelineEditorOpen] = useState(false);
  const [pipelineDraftName, setPipelineDraftName] = useState(
    emptyPipelineDraftName,
  );
  const [pipelineDraftStages, setPipelineDraftStages] = useState<CrmStatus[]>(
    customCrmPipelineDraftStages,
  );
  const [editingPipelineId, setEditingPipelineId] = useState("");
  const [isSavingPipeline, setIsSavingPipeline] = useState(false);
  const [deletePipelineConfirmation, setDeletePipelineConfirmation] =
    useState<CrmPipeline | null>(null);
  const [deletePipelineCountdown, setDeletePipelineCountdown] = useState(0);
  const [isDeletingPipeline, setIsDeletingPipeline] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [contactFilter, setContactFilter] = useState<
    "all" | "today" | "overdue" | "noTasks"
  >("all");
  const [isContactSearchOpen, setIsContactSearchOpen] = useState(false);
  const [highlightedContactIndex, setHighlightedContactIndex] = useState(0);
  const didDrag = useRef(false);
  const contactSearchRef = useRef<HTMLDivElement>(null);
  const currentCrmUser = getCrmUser(currentUserEmail);

  const activePipeline =
    pipelines.find((pipeline) => pipeline.id === selectedPipelineId) ||
    defaultCrmPipeline;
  const pipelineStages = activePipeline.stages.length
    ? activePipeline.stages
    : defaultCrmPipeline.stages;
  const addContactPipeline =
    pipelines.find((pipeline) => pipeline.id === addContactPipelineId) ||
    activePipeline;
  const addContactPipelineStages = addContactPipeline.stages.length
    ? addContactPipeline.stages
    : defaultCrmPipeline.stages;
  const addContactStageIndex = Math.max(
    0,
    addContactPipelineStages.indexOf(
      addContactStage || addContactPipelineStages[0] || "Zakwalifikowano",
    ),
  );
  const canEditActivePipeline =
    !activePipeline.isDefault &&
    normalizeCrmEmail(activePipeline.ownerEmail) === currentUserEmail;

  const plannedByContact = useMemo(() => {
    const grouped = new Map<string, CrmActivity[]>();
    activities.forEach((activity) => {
      if (activity.status !== "planned") return;
      grouped.set(activity.contactId, [
        ...(grouped.get(activity.contactId) || []),
        activity,
      ]);
    });
    return grouped;
  }, [activities]);

  function matchesContactFilter(contact: CrmContact) {
    if (contactFilter === "all") return true;
    const planned = plannedByContact.get(contact.id) || [];
    if (contactFilter === "noTasks") return planned.length === 0;
    if (contactFilter === "today") {
      return planned.some((activity) => activity.dueDate === today);
    }
    if (contactFilter === "overdue") {
      return planned.some(
        (activity) => Boolean(activity.dueDate) && activity.dueDate! < today,
      );
    }
    return true;
  }

  const columns = pipelineStages.map((status) => {
    const stageContacts = contacts.filter(
      (contact) => contact.status === status && matchesContactFilter(contact),
    );
    return {
      status,
      contacts: stageContacts,
    };
  });

  const suggestedContacts = useMemo(() => {
    const normalizedQuery = contactSearchQuery.trim().toLocaleLowerCase("pl");
    const matchingContacts = normalizedQuery
      ? contacts.filter((contact) =>
          [contact.name, contact.email, contact.phone]
            .join(" ")
            .toLocaleLowerCase("pl")
            .includes(normalizedQuery),
        )
      : contacts;

    return matchingContacts.slice(0, 8);
  }, [contactSearchQuery, contacts]);

  const oldestActivityByContactId = useMemo(() => {
    const grouped = new Map<string, CrmActivity[]>();
    activities.forEach((activity) => {
      if (activity.status !== "planned") return;
      grouped.set(activity.contactId, [
        ...(grouped.get(activity.contactId) || []),
        activity,
      ]);
    });

    const entries = Array.from(grouped.entries()).map(
      ([contactId, contactActivities]) => [
        contactId,
        sortActivitiesByDueDate(contactActivities)[0],
      ],
    );

    return new Map(entries as [string, CrmActivity][]);
  }, [activities]);

  const plannedActivitiesByContactId = useMemo(() => {
    const grouped = new Map<string, CrmActivity[]>();
    activities.forEach((activity) => {
      if (activity.status !== "planned") return;
      grouped.set(activity.contactId, [
        ...(grouped.get(activity.contactId) || []),
        activity,
      ]);
    });
    grouped.forEach((items, key) => grouped.set(key, sortActivitiesByDueDate(items)));
    return grouped;
  }, [activities]);

  const addActivityContact = openActivityMode === "add" || openActivityMode === "edit"
    ? contacts.find((contact) => contact.id === openActivityContactId) || null
    : null;

  useEffect(() => {
    if (!openActivityContactId || openActivityMode !== "details") return;

    function closeTaskPopoverOnOutsideClick(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest(".crmTaskPopover") || target.closest(".crmCardActivity"))
      ) {
        return;
      }
      setOpenActivityContactId("");
    }

    function closeTaskPopoverOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenActivityContactId("");
    }

    document.addEventListener("pointerdown", closeTaskPopoverOnOutsideClick);
    document.addEventListener("keydown", closeTaskPopoverOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeTaskPopoverOnOutsideClick);
      document.removeEventListener("keydown", closeTaskPopoverOnEscape);
    };
  }, [openActivityContactId, openActivityMode]);

  useEffect(() => {
    let ignore = false;

    async function loadCurrentUser() {
      const { data } = await supabase.auth.getUser();
      if (ignore) return;

      const email = normalizeCrmEmail(data.user?.email);
      setCurrentUserEmail(email);
      setSelectedOwner(email);
      setSelectedPipelineId(defaultCrmPipeline.id);
    }

    loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isContactSearchOpen) return;

    function closeContactSearchOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !contactSearchRef.current?.contains(event.target)
      ) {
        setIsContactSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeContactSearchOnOutsideClick);
    return () =>
      document.removeEventListener(
        "pointerdown",
        closeContactSearchOnOutsideClick,
      );
  }, [isContactSearchOpen]);

  useEffect(() => {
    setContactSearchQuery("");
    setIsContactSearchOpen(false);
    setHighlightedContactIndex(0);
  }, [selectedOwner, selectedPipelineId]);

  useEffect(() => {
    let ignore = false;

    async function loadPipelines() {
      if (!visibleOwner) {
        setPipelines([{ ...defaultCrmPipeline, ownerEmail: currentUserEmail }]);
        setSelectedPipelineId(defaultCrmPipeline.id);
        return;
      }

      setPipelinesError("");
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setPipelines([{ ...defaultCrmPipeline, ownerEmail: visibleOwner }]);
        setPipelinesError("Zaloguj sie, aby pobrac lejki.");
        return;
      }

      const response = await fetch(
        `/api/crm/pipelines?owner=${encodeURIComponent(visibleOwner)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (ignore) return;
      if (!response.ok) {
        setPipelines([{ ...defaultCrmPipeline, ownerEmail: visibleOwner }]);
        setSelectedPipelineId(defaultCrmPipeline.id);
        setPipelinesError(result.error || "Nie udalo sie pobrac lejka.");
        return;
      }

      const loadedPipelines = result.pipelines?.length
        ? (result.pipelines as CrmPipeline[])
        : [{ ...defaultCrmPipeline, ownerEmail: visibleOwner }];
      setPipelines(loadedPipelines);
      setSelectedPipelineId((current) =>
        loadedPipelines.some((pipeline) => pipeline.id === current)
          ? current
          : defaultCrmPipeline.id,
      );
    }

    loadPipelines();

    return () => {
      ignore = true;
    };
  }, [currentUserEmail, visibleOwner]);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      if (visibleOwner === null) {
        setActivities([]);
        setIsActivitiesLoading(false);
        return;
      }

      setActivitiesError("");
      setIsActivitiesLoading(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setActivities([]);
        setIsActivitiesLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (visibleOwner) {
        params.set("owner", visibleOwner);
      }
      params.set("pipelineId", selectedPipelineId);
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`/api/crm/activities${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (ignore) return;
      if (!response.ok) {
        setActivitiesError(result.error || "Nie udalo sie pobrac zadan lejka.");
        setActivities([]);
        setIsActivitiesLoading(false);
        return;
      }
      setActivities(result.activities || []);
      setIsActivitiesLoading(false);
    }

    loadActivities();

    return () => {
      ignore = true;
    };
  }, [selectedPipelineId, visibleOwner]);

  useEffect(() => {
    if (!deletePipelineConfirmation) return;

    setDeletePipelineCountdown(3);
    const interval = window.setInterval(() => {
      setDeletePipelineCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deletePipelineConfirmation]);

  function handleDragStart(event: DragEvent<HTMLElement>, contact: CrmContact) {
    didDrag.current = true;
    setDraggedId(contact.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", contact.id);
  }

  function handleDragOver(event: DragEvent<HTMLElement>, status: CrmStatus) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  }

  function handleDrop(event: DragEvent<HTMLElement>, status: CrmStatus) {
    event.preventDefault();
    const contactId = event.dataTransfer.getData("text/plain") || draggedId;
    if (contactId) {
      updateContactStatus(contactId, status);
    }
    setDraggedId(null);
    setDragOverStatus(null);
    setIsDeleteOver(false);
  }

  async function handleDeleteDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const contactId = event.dataTransfer.getData("text/plain") || draggedId;
    if (contactId) {
      await deleteContact(contactId);
    }
    setDraggedId(null);
    setDragOverStatus(null);
    setIsDeleteOver(false);
    setIsTransferOver(false);
  }

  function handleTransferDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const contactId = event.dataTransfer.getData("text/plain") || draggedId;
    const contact = contacts.find((item) => item.id === contactId);
    if (contactId) {
      const nextOwner =
        crmUsers.find((user) => user.email !== contact?.pipelineOwner)?.email ||
        crmUsers[0]?.email ||
        "";
      setTransferContactId(contactId);
      setTransferOwner(nextOwner);
      setTransferError("");
    }
    setDraggedId(null);
    setDragOverStatus(null);
    setIsDeleteOver(false);
    setIsTransferOver(false);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverStatus(null);
    setIsDeleteOver(false);
    setIsTransferOver(false);
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  }

  function openContact(event: MouseEvent<HTMLElement>, contactId: string) {
    if (didDrag.current) {
      event.preventDefault();
      return;
    }
    router.push(`/crm/kontakt/${contactId}`);
  }

  function openSearchedContact(contactId: string) {
    setIsContactSearchOpen(false);
    setContactSearchQuery("");
    router.push(`/crm/kontakt/${contactId}`);
  }

  function closeActivityPopup() {
    setOpenActivityContactId("");
    setEditingActivityId("");
    setOpenActivityMode("details");
    setActivityFormError("");
  }

  function closeTransferPopup() {
    setTransferContactId("");
    setTransferError("");
    setIsTransferring(false);
  }

  function openNewPipelineEditor() {
    if (currentUserEmail) {
      setSelectedOwner(currentUserEmail);
    }
    setEditingPipelineId("");
    setPipelineDraftName(emptyPipelineDraftName);
    setPipelineDraftStages(customCrmPipelineDraftStages);
    setPipelinesError("");
    setIsPipelineEditorOpen(true);
  }

  function openEditPipelineEditor() {
    if (!canEditActivePipeline) return;
    setEditingPipelineId(activePipeline.id);
    setPipelineDraftName(activePipeline.name);
    setPipelineDraftStages(
      activePipeline.stages.length
        ? activePipeline.stages
        : customCrmPipelineDraftStages,
    );
    setPipelinesError("");
    setIsPipelineEditorOpen(true);
  }

  function closePipelineEditor() {
    setIsPipelineEditorOpen(false);
    setEditingPipelineId("");
    setPipelinesError("");
    setIsSavingPipeline(false);
  }

  function requestDeletePipeline() {
    if (!canEditActivePipeline) return;
    setPipelinesError("");
    setDeletePipelineConfirmation(activePipeline);
  }

  function cancelDeletePipeline() {
    setDeletePipelineConfirmation(null);
    setDeletePipelineCountdown(0);
    setIsDeletingPipeline(false);
  }

  async function confirmDeletePipeline() {
    if (
      !deletePipelineConfirmation ||
      deletePipelineCountdown > 0 ||
      isDeletingPipeline
    ) {
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setPipelinesError("Zaloguj sie, aby usunac lejek.");
      return;
    }

    setIsDeletingPipeline(true);
    setPipelinesError("");
    const response = await fetch("/api/crm/pipelines", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: deletePipelineConfirmation.id }),
    });
    const result = await response.json();
    setIsDeletingPipeline(false);
    if (!response.ok) {
      setPipelinesError(result.error || "Nie udalo sie usunac lejka.");
      return;
    }

    setPipelines((current) =>
      current.filter((pipeline) => pipeline.id !== deletePipelineConfirmation.id),
    );
    setSelectedPipelineId(defaultCrmPipeline.id);
    setDeletePipelineConfirmation(null);
    setDeletePipelineCountdown(0);
    await reload();
  }

  function updatePipelineDraftStage(index: number, value: string) {
    setPipelineDraftStages((current) =>
      current.map((stage, stageIndex) =>
        stageIndex === index ? value : stage,
      ),
    );
  }

  function addPipelineDraftStage() {
    setPipelineDraftStages((current) => [...current, "Nowy etap"]);
  }

  async function savePipelineDraft() {
    const stages = pipelineDraftStages
      .map((stage) => stage.trim())
      .filter(Boolean);
    if (!pipelineDraftName.trim() || !stages.length) {
      setPipelinesError("Nazwa lejka i minimum jeden etap sa wymagane.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setPipelinesError("Zaloguj sie, aby zapisac lejek.");
      return;
    }

    setIsSavingPipeline(true);
    setPipelinesError("");
    const response = await fetch("/api/crm/pipelines", {
      method: editingPipelineId ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingPipelineId,
        name: pipelineDraftName,
        stages,
      }),
    });
    const result = await response.json();
    setIsSavingPipeline(false);
    if (!response.ok) {
      setPipelinesError(result.error || "Nie udalo sie zapisac lejka.");
      return;
    }

    const savedPipeline = result.pipeline as CrmPipeline;
    setPipelines((current) => {
      const nextPipelines = current.some(
        (pipeline) => pipeline.id === savedPipeline.id,
      )
        ? current.map((pipeline) =>
            pipeline.id === savedPipeline.id ? savedPipeline : pipeline,
          )
        : [...current, savedPipeline];
      return nextPipelines;
    });
    setSelectedPipelineId(savedPipeline.id);
    closePipelineEditor();
  }

  function openPipelineContactPopup(
    status?: CrmStatus,
    pipelineId = selectedPipelineId,
  ) {
    const nextPipeline =
      pipelines.find((pipeline) => pipeline.id === pipelineId) ||
      activePipeline;
    const nextStages = nextPipeline.stages.length
      ? nextPipeline.stages
      : defaultCrmPipeline.stages;
    setAddContactPipelineId(nextPipeline.id);
    setAddContactStage(status || nextStages[0] || "Zakwalifikowano");
    setPipelineContactForm(emptyPipelineContactForm);
    setPipelineContactFormError("");
  }

  function closePipelineContactPopup() {
    setAddContactStage(null);
    setAddContactPipelineId(selectedPipelineId);
    setPipelineContactForm(emptyPipelineContactForm);
    setPipelineContactFormError("");
    setIsSavingPipelineContact(false);
  }

  function changePipelineContactPipeline(pipelineId: string) {
    const nextPipeline =
      pipelines.find((pipeline) => pipeline.id === pipelineId) ||
      defaultCrmPipeline;
    const nextStages = nextPipeline.stages.length
      ? nextPipeline.stages
      : defaultCrmPipeline.stages;
    setAddContactPipelineId(nextPipeline.id);
    setAddContactStage((current) =>
      current && nextStages.includes(current)
        ? current
        : nextStages[0] || "Zakwalifikowano",
    );
  }

  async function addContactFromPipeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addContactStage) return;
    if (!pipelineContactForm.name.trim()) {
      setPipelineContactFormError("Imie i nazwisko jest wymagane.");
      return;
    }
    const normalizedPhone = pipelineContactForm.phone.replace(/[\s\u00a0]+/g, "");
    if (!normalizedPhone) {
      setPipelineContactFormError("Numer telefonu jest wymagany.");
      return;
    }
    if (!normalizedPhone.startsWith("+")) {
      setPipelineContactFormError("Numer telefonu musi zaczynac sie od prefixu +.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setPipelineContactFormError("Zaloguj sie, aby dodac kontakt.");
      return;
    }

    setPipelineContactFormError("");
    setPipelineContactForm((current) => ({ ...current, phone: normalizedPhone }));
    setIsSavingPipelineContact(true);
    const targetPipelineId = addContactPipelineId;
    const response = await fetch("/api/crm/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: pipelineContactForm.name,
        company: "Bez firmy",
        email: pipelineContactForm.email,
        phone: normalizedPhone,
        value: Number(pipelineContactForm.maxBudget || 0),
        maxBudget: Number(pipelineContactForm.maxBudget || 0),
        country: pipelineContactForm.country,
        bedrooms: pipelineContactForm.bedrooms,
        bathrooms: pipelineContactForm.bathrooms,
        coast: pipelineContactForm.coast,
        purchaseTimeline: pipelineContactForm.purchaseTimeline,
        pipelineOwner:
          visibleOwner === "all" || visibleOwner === null
            ? currentUserEmail
            : visibleOwner,
        pipelineId:
          targetPipelineId === defaultCrmPipeline.id ? null : targetPipelineId,
        status: addContactStage,
      }),
    });
    const result = await response.json();
    setIsSavingPipelineContact(false);
    if (!response.ok) {
      setPipelineContactFormError(result.error || "Nie udalo sie dodac kontaktu.");
      return;
    }
    await reload();
    closePipelineContactPopup();
  }

  async function moveContactToPipeline() {
    if (!transferContactId || !transferOwner) return;

    setTransferError("");
    setIsTransferring(true);
    const updated = await updateContact({
      id: transferContactId,
      pipelineOwner: transferOwner,
    });
    setIsTransferring(false);

    if (!updated) {
      setTransferError("Nie udalo sie przeniesc kontaktu.");
      return;
    }

    closeTransferPopup();
    await reload();
  }

  function changeActivityType(type: CrmActivityType) {
    setActivityForm((current) => ({
      ...current,
      type,
      title:
        current.title === current.type || !current.title.trim()
          ? type
          : current.title,
    }));
  }

  function openActivityDetailsPopup(
    event: MouseEvent<HTMLElement>,
    contactId: string,
  ) {
    setActivityPopupPosition(getActivityPopupPosition(event.currentTarget));
    setOpenActivityContactId((current) =>
      current === contactId && openActivityMode === "details" ? "" : contactId,
    );
    setOpenActivityMode("details");
  }

  function openEditActivityPopup(activity: CrmActivity) {
    setActivityFormError("");
    setEditingActivityId(activity.id);
    setActivityForm({
      type: activity.type,
      title: activity.title,
      dueDate: activity.dueDate || today,
      dueTime: activity.dueTime ? activity.dueTime.slice(0, 5) : "",
      note: activity.note || "",
      completed: activity.status === "done",
    });
    setOpenActivityMode("edit");
    setOpenActivityContactId(activity.contactId);
  }

  function openAddActivityPopup(contactId: string) {
    setEditingActivityId("");
    setActivityFormError("");
    setActivityForm({
      type: "Zadzwoń",
      title: "Zadzwoń",
      dueDate: today,
      dueTime: "",
      note: "",
      completed: false,
    });
    setOpenActivityMode("add");
    setOpenActivityContactId(contactId);
  }

  async function addActivityFromPipeline(
    event: FormEvent<HTMLFormElement>,
    contactId: string,
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (!activityForm.title.trim()) {
      setActivityFormError("Tytul zadania jest wymagany.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setActivityFormError("Zaloguj sie, aby dodac zadanie.");
      return;
    }

    setActivityFormError("");
    setIsSavingNewActivity(true);
    const isEditing = openActivityMode === "edit" && Boolean(editingActivityId);
    const response = await fetch("/api/crm/activities", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(isEditing ? { id: editingActivityId } : { contactId }),
        type: activityForm.type,
        title: activityForm.title,
        dueDate: activityForm.dueDate,
        dueTime: activityForm.dueTime,
        note: activityForm.note,
        status: activityForm.completed ? "done" : "planned",
      }),
    });
    const result = await response.json();
    setIsSavingNewActivity(false);
    if (!response.ok) {
      setActivityFormError(result.error || "Nie udalo sie dodac zadania.");
      return;
    }

    if (isEditing) {
      setActivities((current) =>
        current.map((item) => (item.id === result.activity.id ? result.activity : item)),
      );
      setEditingActivityId("");
      setOpenActivityMode("details");
      setOpenActivityContactId(contactId);
    } else {
      setActivities((current) => [result.activity, ...current]);
      setOpenActivityContactId("");
      setOpenActivityMode("details");
    }
    setActivityForm({
      type: "Zadzwoń",
      title: "Zadzwoń",
      dueDate: today,
      dueTime: "",
      note: "",
      completed: false,
    });
  }

  async function toggleActivityStatus(activity: CrmActivity) {
    setActivitiesError("");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setActivitiesError("Zaloguj sie, aby zmienic zadanie.");
      return;
    }

    const nextStatus = activity.status === "done" ? "planned" : "done";
    const previousActivities = activities;
    setActivities((current) =>
      current.map((item) =>
        item.id === activity.id ? { ...item, status: nextStatus } : item,
      ),
    );

    const response = await fetch("/api/crm/activities", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: activity.id, status: nextStatus }),
    });
    const result = await response.json();
    if (!response.ok) {
      setActivities(previousActivities);
      setActivitiesError(result.error || "Nie udalo sie zmienic zadania.");
      return;
    }

    setActivities((current) =>
      current.map((item) => (item.id === activity.id ? result.activity : item)),
    );
    if (nextStatus === "done") {
      // Po odhaczeniu zadania od razu proponujemy zaplanowanie kolejnego.
      openAddActivityPopup(activity.contactId);
      return;
    }
    setOpenActivityMode("details");
    setOpenActivityContactId(activity.contactId);
  }

  return (
    <CrmLayout active="pipeline">
      <section className="crmPipelinePage">
        <header className="crmAppHeader">
          <div className="crmAppHeaderTitle">
            <span>CRM</span>
            <h1>Szanse sprzedaży</h1>
          </div>
          <div className="crmAppHeaderSearch">
            <div className="crmContactSearch" ref={contactSearchRef}>
              <span aria-hidden="true" className="crmContactSearchIcon" />
              <input
                aria-autocomplete="list"
                aria-controls="crm-contact-suggestions"
                aria-expanded={isContactSearchOpen}
                aria-label="Szukaj klienta"
                autoComplete="off"
                placeholder="Szukaj klienta..."
                role="combobox"
                value={contactSearchQuery}
                onChange={(event) => {
                  setContactSearchQuery(event.target.value);
                  setHighlightedContactIndex(0);
                  setIsContactSearchOpen(true);
                }}
                onFocus={() => setIsContactSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsContactSearchOpen(false);
                    return;
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setIsContactSearchOpen(true);
                    setHighlightedContactIndex((current) =>
                      Math.min(
                        current + 1,
                        Math.max(suggestedContacts.length - 1, 0),
                      ),
                    );
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightedContactIndex((current) =>
                      Math.max(current - 1, 0),
                    );
                    return;
                  }
                  if (event.key === "Enter" && suggestedContacts.length) {
                    event.preventDefault();
                    openSearchedContact(
                      suggestedContacts[highlightedContactIndex]?.id ||
                        suggestedContacts[0].id,
                    );
                  }
                }}
              />
              {isContactSearchOpen ? (
                <div
                  className="crmContactSuggestions"
                  id="crm-contact-suggestions"
                  role="listbox"
                >
                  {isContactsLoading ? (
                    <p className="crmContactSearchState">Wczytywanie klientów...</p>
                  ) : suggestedContacts.length ? (
                    suggestedContacts.map((contact, index) => (
                      <button
                        aria-selected={index === highlightedContactIndex}
                        className={
                          index === highlightedContactIndex ? "highlighted" : ""
                        }
                        key={contact.id}
                        role="option"
                        type="button"
                        onMouseEnter={() => setHighlightedContactIndex(index)}
                        onClick={() => openSearchedContact(contact.id)}
                      >
                        <span className="crmContactSuggestionAvatar" aria-hidden="true">
                          {contact.name.trim().slice(0, 1).toUpperCase() || "?"}
                        </span>
                        <span className="crmContactSuggestionText">
                          <strong>{contact.name || "Klient bez nazwy"}</strong>
                          <small>
                            {contact.phone || contact.email || "Brak danych kontaktowych"}
                          </small>
                        </span>
                        <span className="crmContactSuggestionStatus">
                          {contact.status}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="crmContactSearchState">
                      Brak klientów pasujących do wyszukiwania.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="crmAppHeaderGreeting">
            {currentCrmUser ? (
              <>
                <span>
                  Dobrego dnia,{" "}
                  <strong>{currentCrmUser.label.split(" ")[0]}</strong>!
                </span>
                <span className="crmAppHeaderAvatar" aria-hidden="true">
                  {currentCrmUser.label.slice(0, 1)}
                </span>
              </>
            ) : null}
          </div>
        </header>
        <div className="crmPipelineTopbar">
          {isPipelineEditorOpen ? (
            <label>
              <span>Właściciel</span>
              <input
                aria-label="Właściciel lejka"
                className="crmPipelineOwnerLocked"
                disabled
                readOnly
                value={currentCrmUser?.label || currentUserEmail}
              />
            </label>
          ) : userIsAdmin ? (
            <label>
              <span>Właściciel</span>
              <select
                value={selectedOwner}
                onChange={(event) => setSelectedOwner(event.target.value)}
              >
                <option value="all">Wszystkie lejki</option>
                {crmUsers.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label>
            <span>Lejek</span>
            <select
              value={selectedPipelineId}
              onChange={(event) => {
                if (event.target.value === "add") {
                  openNewPipelineEditor();
                  return;
                }
                setSelectedPipelineId(event.target.value);
              }}
            >
              {pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
              <option value="add">+ Dodaj lejek</option>
            </select>
          </label>
          <button
            className="crmSalesChanceButton"
            type="button"
            onClick={() => openPipelineContactPopup()}
          >
            Szansa sprzedaży
          </button>
          <label className="crmPipelineFilter">
            <span>Filtr</span>
            <select
              value={contactFilter}
              onChange={(event) =>
                setContactFilter(event.target.value as typeof contactFilter)
              }
            >
              <option value="all">Wszystkie szanse w lejku</option>
              <option value="today">Działania na dzisiaj</option>
              <option value="overdue">Zaległe działania</option>
              <option value="noTasks">Klienci bez zaplanowanych działań</option>
            </select>
          </label>
          {canEditActivePipeline ? (
            <>
              <button
                className="crmEditPipelineButton"
                type="button"
                onClick={openEditPipelineEditor}
              >
                Edytuj lejek
              </button>
              <button
                className="crmDeletePipelineButton"
                type="button"
                onClick={requestDeletePipeline}
              >
                Usuń lejek
              </button>
            </>
          ) : null}
        </div>
        {error ? <p className="crmError">{error}</p> : null}
        {activitiesError ? <p className="crmError">{activitiesError}</p> : null}
        {pipelinesError && !isPipelineEditorOpen ? (
          <p className="crmError">{pipelinesError}</p>
        ) : null}
        {isPipelineEditorOpen ? (
          <section className="crmPipelineEditor">
            <div className="crmPipelineEditorTop">
              <input
                aria-label="Nazwa lejka"
                value={pipelineDraftName}
                onChange={(event) => setPipelineDraftName(event.target.value)}
              />
              <button
                type="button"
                onClick={savePipelineDraft}
                disabled={isSavingPipeline}
              >
                {isSavingPipeline ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                onClick={closePipelineEditor}
              >
                Anuluj
              </button>
            </div>
            {pipelinesError ? (
              <p className="crmError">{pipelinesError}</p>
            ) : null}
            <div className="crmPipelineEditorBoard">
              {pipelineDraftStages.map((stage, index) => (
                <section
                  className="crmPipelineEditorColumn"
                  key={`pipeline-stage-${index}`}
                >
                  <input
                    aria-label={`Etap ${index + 1}`}
                    value={stage}
                    onChange={(event) =>
                      updatePipelineDraftStage(index, event.target.value)
                    }
                  />
                </section>
              ))}
              <section className="crmPipelineEditorColumn addStage">
                <button type="button" onClick={addPipelineDraftStage}>
                  + Dodaj nowy etap
                </button>
              </section>
            </div>
          </section>
        ) : !currentUserEmail || isContactsLoading ? (
          <div className="crmPipelineLoading" role="status" aria-live="polite">
            <div className="crmPipelineLoaderCard">
              <span aria-hidden="true" className="crmPipelineLoader" />
              <strong>Wczytywanie kontaktów...</strong>
            </div>
          </div>
        ) : (
          <div className="crmPipelineBoard">
            {columns.map((column) => {
              const columnBudget = column.contacts.reduce(
                (sum, contact) => sum + (contact.maxBudget || 0),
                0,
              );
              const columnCount = column.contacts.length;
              const columnCountLabel = `${columnCount} ${
                columnCount === 1
                  ? "klient"
                  : columnCount % 10 >= 2 &&
                      columnCount % 10 <= 4 &&
                      (columnCount % 100 < 12 || columnCount % 100 > 14)
                    ? "klienci"
                    : "klientów"
              }`;

              return (
                <section
                  className={`crmPipelineColumn ${dragOverStatus === column.status ? "dragOver" : ""}`}
                  key={column.status}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDragOver={(event) => handleDragOver(event, column.status)}
                  onDrop={(event) => handleDrop(event, column.status)}
                >
                  <div
                    className={`crmPipelineColumnHeader ${
                      column.status === "Zakup w perspektywie"
                        ? "highlightProspect"
                        : ""
                    }`}
                  >
                    <strong title={column.status}>{column.status}</strong>
                    <span>
                      {columnBudget ? crmBudgetFormatter.format(columnBudget) : "0 €"}
                      {" · "}
                      {columnCountLabel}
                    </span>
                  </div>
                  <div className="crmPipelineCards">
                    {column.contacts.map((contact) => {
                      const activity = oldestActivityByContactId.get(
                        contact.id,
                      );
                      const isActivityOpen =
                        openActivityContactId === contact.id;

                      return (
                        <article
                          className={`crmPipelineCard ${draggedId === contact.id ? "dragging" : ""} ${
                            isActivityOpen ? "activityOpen" : ""
                          }`}
                          draggable
                          key={contact.id}
                          onClick={(event) => openContact(event, contact.id)}
                          onDragEnd={handleDragEnd}
                          onDragStart={(event) =>
                            handleDragStart(event, contact)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              router.push(`/crm/kontakt/${contact.id}`);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <strong>{contact.name}</strong>
                          {!isActivitiesLoading &&
                          contact.hasHistory === false &&
                          !activities.some((item) => item.contactId === contact.id) ? (
                            <span className="crmNewLeadBadge">Nowy lead</span>
                          ) : null}
                          <div className="crmContactInfo">
                            <span className="crmContactEuro" aria-hidden="true">
                              €
                            </span>
                            <span className="crmContactBudget">
                              {contact.maxBudget
                                ? crmBudgetFormatter.format(contact.maxBudget)
                                : "Brak kwoty"}
                            </span>
                          </div>
                          {isActivitiesLoading ? (
                            <div className="crmCardActivity">
                              <span
                                aria-label="Ladowanie zadan"
                                className="crmActivityLoader"
                              />
                            </div>
                          ) : (
                            <div className="crmCardActivity">
                              {activity ? (
                                <button
                                  aria-label={`Zadania klienta: ${activity.title}`}
                                  className={`crmActivityDot ${getActivityTone(activity)}`}
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    openActivityDetailsPopup(event, contact.id);
                                  }}
                                >
                                  <svg
                                    aria-hidden="true"
                                    fill="none"
                                    height="12"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3.4"
                                    viewBox="0 0 24 24"
                                    width="12"
                                  >
                                    <path
                                      d={
                                        getActivityTone(activity) === "overdue"
                                          ? "m15 6-6 6 6 6"
                                          : "m9 6 6 6-6 6"
                                      }
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  aria-label="Brak zaplanowanego zadania"
                                  className="crmMissingTask"
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    openActivityDetailsPopup(event, contact.id);
                                  }}
                                >
                                  !
                                </button>
                              )}
                              {isActivityOpen && openActivityMode === "details" ? (
                                <section
                                  className="crmTaskPopover"
                                  style={{
                                    left: activityPopupPosition.left,
                                    top: activityPopupPosition.top,
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {(plannedActivitiesByContactId.get(contact.id) || []).length ? (
                                    <ul className="crmTaskPopoverList">
                                      {(plannedActivitiesByContactId.get(contact.id) || []).map(
                                        (item) => (
                                          <li key={item.id}>
                                            <button
                                              aria-label="Oznacz zadanie jako wykonane"
                                              className={`crmTaskPopoverCheck ${getActivityTone(item)}`}
                                              title="Oznacz jako wykonane"
                                              type="button"
                                              onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                toggleActivityStatus(item);
                                              }}
                                            />
                                            <span className="crmTaskPopoverType" aria-hidden="true">
                                              {activityTypeGlyph(item.type)}
                                            </span>
                                            <button
                                              className="crmTaskPopoverText"
                                              title="Otwórz i edytuj zadanie"
                                              type="button"
                                              onClick={() => openEditActivityPopup(item)}
                                            >
                                              <strong title={item.title}>{item.title}</strong>
                                              <small className={getActivityTone(item)}>
                                                {formatActivityShortDate(item)} · {item.type}
                                              </small>
                                            </button>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="crmTaskPopoverEmpty">
                                      Brak zaplanowanych zadań
                                    </p>
                                  )}
                                  <button
                                    className="crmTaskPopoverAdd"
                                    type="button"
                                    onClick={() => openAddActivityPopup(contact.id)}
                                  >
                                    <span aria-hidden="true">+</span> Zaplanuj zadanie
                                  </button>
                                </section>
                              ) : null}
                            </div>
                          )}
                        </article>
                      );
                    })}
                    <button
                      aria-label={`Dodaj kontakt do etapu ${column.status}`}
                      className="crmPipelineAddContact"
                      type="button"
                      onClick={() => openPipelineContactPopup(column.status)}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        )}
        {addActivityContact ? (
          <div
            className="crmTaskModalBackdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isSavingNewActivity) {
                closeActivityPopup();
              }
            }}
          >
            <section
              aria-labelledby="crm-task-modal-title"
              aria-modal="true"
              className="crmTaskModal"
              role="dialog"
            >
              <header>
                <div>
                  <p>{openActivityMode === "edit" ? "Edycja zadania" : "Nowe zadanie"}</p>
                  <h2 id="crm-task-modal-title">{addActivityContact.name}</h2>
                </div>
                <button
                  aria-label="Zamknij"
                  className="crmActivityBannerClose"
                  type="button"
                  onClick={closeActivityPopup}
                >
                  ×
                </button>
              </header>
              <div className="crmActivityTypeTabs" aria-label="Typ zadania">
                {crmActivityTypes.map((type) => (
                  <button
                    className={activityForm.type === type ? "active" : ""}
                    key={type}
                    type="button"
                    onClick={() => changeActivityType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <form
                className="crmPipelineActivityForm"
                onSubmit={(event) => addActivityFromPipeline(event, addActivityContact.id)}
              >
                <input
                  autoFocus
                  placeholder="Tytuł zadania"
                  value={activityForm.title}
                  onChange={(event) =>
                    setActivityForm({ ...activityForm, title: event.target.value })
                  }
                />
                <div className="crmPipelineActivityDate">
                  <input
                    type="date"
                    value={activityForm.dueDate}
                    onChange={(event) =>
                      setActivityForm({ ...activityForm, dueDate: event.target.value })
                    }
                  />
                  <input
                    type="time"
                    value={activityForm.dueTime}
                    onChange={(event) =>
                      setActivityForm({ ...activityForm, dueTime: event.target.value })
                    }
                  />
                </div>
                <textarea
                  placeholder="Notatka, opis, ustalenia..."
                  value={activityForm.note}
                  onChange={(event) =>
                    setActivityForm({ ...activityForm, note: event.target.value })
                  }
                />
                <label className="crmPipelineActivityCheckbox">
                  <input
                    checked={activityForm.completed}
                    type="checkbox"
                    onChange={(event) =>
                      setActivityForm({ ...activityForm, completed: event.target.checked })
                    }
                  />
                  Oznacz zadanie jako wykonane
                </label>
                {activityFormError ? <p>{activityFormError}</p> : null}
                <button disabled={isSavingNewActivity} type="submit">
                  {isSavingNewActivity
                    ? "Zapisywanie..."
                    : openActivityMode === "edit"
                      ? "Zapisz zmiany"
                      : "Zapisz zadanie"}
                </button>
              </form>
            </section>
          </div>
        ) : null}
        <section
          aria-hidden={!draggedId}
          aria-label="Akcje przeciagania"
          className={`crmDragActions ${draggedId ? "isDragging" : ""}`}
        >
          <div
            className={`crmDeleteDropzone ${isDeleteOver ? "active" : ""}`}
            onDragLeave={() => setIsDeleteOver(false)}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setIsDeleteOver(true);
              setIsTransferOver(false);
            }}
            onDrop={handleDeleteDrop}
          >
            Usuń kontakt
          </div>
          {userIsAdmin ? (
            <div
              className={`crmTransferDropzone ${isTransferOver ? "active" : ""}`}
              onDragLeave={() => setIsTransferOver(false)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setIsTransferOver(true);
                setIsDeleteOver(false);
              }}
              onDrop={handleTransferDrop}
            >
              Przenieś do innego lejka
            </div>
          ) : null}
        </section>
        {transferContactId ? (
          <section className="crmTransferPopup" aria-label="Przenies kontakt">
            <button
              aria-label="Zamknij przenoszenie"
              type="button"
              onClick={closeTransferPopup}
            >
              ×
            </button>
            <strong>Przenieś do lejka</strong>
            <select
              value={transferOwner}
              onChange={(event) => setTransferOwner(event.target.value)}
            >
              {crmUsers.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.label}
                </option>
              ))}
            </select>
            {transferError ? <p>{transferError}</p> : null}
            <button
              disabled={isTransferring}
              type="button"
              onClick={moveContactToPipeline}
            >
              {isTransferring ? "Przenoszenie..." : "Przenieś"}
            </button>
          </section>
        ) : null}
        {addContactStage ? (
          <section
            className="crmPipelineContactModal"
            aria-label="Dodaj kontakt z lejka"
          >
            <form
              className="crmPipelineContactForm"
              onSubmit={addContactFromPipeline}
            >
              <button
                aria-label="Zamknij dodawanie kontaktu"
                className="crmPipelineContactClose"
                type="button"
                onClick={closePipelineContactPopup}
              >
                ×
              </button>
              <header className="crmPipelineContactHeader">
                <p>Nowa szansa sprzedaży</p>
                <strong>{addContactStage}</strong>
              </header>
              <div className="crmPipelineContactColumns">
                <div className="crmPipelineContactColumn">
                  <label>
                    <span>Imię i nazwisko</span>
                    <input
                      value={pipelineContactForm.name}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          name: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Adres email</span>
                    <input
                      type="email"
                      value={pipelineContactForm.email}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          email: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Numer telefonu</span>
                    <input
                      value={pipelineContactForm.phone}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          phone: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Termin zakupu</span>
                    <input
                      value={pipelineContactForm.purchaseTimeline}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          purchaseTimeline: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Lejek</span>
                    <select
                      value={addContactPipelineId}
                      onChange={(event) =>
                        changePipelineContactPipeline(event.target.value)
                      }
                    >
                      {pipelines.map((pipeline) => (
                        <option key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset className="crmPipelineStageField">
                    <legend>Etap w lejku</legend>
                    <div className="crmPipelineStagePicker">
                      {addContactPipelineStages.map((status, index) => (
                        <button
                          aria-label={`Etap w lejku: ${status}`}
                          className={`${index <= addContactStageIndex ? "filled" : ""} ${
                            addContactStage === status ? "selected" : ""
                          }`}
                          data-stage={status}
                          key={status}
                          title={status}
                          type="button"
                          onClick={() => setAddContactStage(status)}
                        >
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    <span>Etykiety</span>
                    <select
                      value={pipelineContactForm.label}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          label: event.target.value,
                        })
                      }
                    >
                      <option value="">Brak etykiety</option>
                      <option value="Gorący lead">Gorący lead</option>
                      <option value="Do kontaktu">Do kontaktu</option>
                      <option value="VIP">VIP</option>
                      <option value="Inwestor">Inwestor</option>
                    </select>
                  </label>
                </div>
                <div className="crmPipelineContactColumn">
                  <label>
                    <span>Kraj</span>
                    <input
                      value={pipelineContactForm.country}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          country: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Wybrzeże</span>
                    <input
                      value={pipelineContactForm.coast}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          coast: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Sypialnie</span>
                    <input
                      value={pipelineContactForm.bedrooms}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          bedrooms: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Łazienki</span>
                    <input
                      value={pipelineContactForm.bathrooms}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          bathrooms: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Kwota max EUR</span>
                    <input
                      inputMode="numeric"
                      value={pipelineContactForm.maxBudget}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          maxBudget: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              {pipelineContactFormError ? (
                <p className="crmPipelineContactError">
                  {pipelineContactFormError}
                </p>
              ) : null}
              <div className="crmPipelineContactActions">
                <button type="button" onClick={closePipelineContactPopup}>
                  Anuluj
                </button>
                <button disabled={isSavingPipelineContact} type="submit">
                  {isSavingPipelineContact ? "Zapisywanie..." : "Dodaj kontakt"}
                </button>
              </div>
            </form>
          </section>
        ) : null}
        {deletePipelineConfirmation ? (
          <section
            aria-modal="true"
            className="crmPipelineDeleteOverlay"
            role="dialog"
          >
            <div className="crmPipelineDeleteModal">
              <div>
                <p>Potwierdzenie usunięcia</p>
                <h2>Usunąć lejek „{deletePipelineConfirmation.name}”?</h2>
                <span>
                  Kontakty z tego lejka zostaną przeniesione do lejka
                  podstawowego.
                </span>
              </div>
              <div className="crmPipelineDeleteActions">
                <button type="button" onClick={cancelDeletePipeline}>
                  Anuluj
                </button>
                <button
                  disabled={deletePipelineCountdown > 0 || isDeletingPipeline}
                  type="button"
                  onClick={confirmDeletePipeline}
                >
                  {deletePipelineCountdown > 0
                    ? `Usuń za ${deletePipelineCountdown}s`
                    : isDeletingPipeline
                      ? "Usuwanie..."
                      : "Usuń lejek"}
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </section>
      <style jsx>{`
        .crmPipelinePage {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          font-size: 75%;
          gap: 10px;
          height: 100vh;
          min-width: 0;
          overflow: hidden;
          padding: 18px;
        }

        .crmPipelineTopbar {
          align-items: center;
          background: transparent;
          display: flex;
          gap: 10px;
          min-height: 38px;
          padding: 0;
        }

        .crmPipelineTopbar select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235b5f66' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-position: right 10px center;
          background-repeat: no-repeat;
          cursor: pointer;
        }

        .crmPipelineFilter {
          margin-left: auto !important;
        }

        .crmPipelineFilter select {
          min-width: 260px;
        }

        .crmPipelineTopbar label {
          align-items: center;
          color: #4b5563;
          display: flex;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          margin: 0;
        }

        .crmPipelineTopbar select,
        .crmPipelineTopbar input {
          appearance: none;
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          min-width: 210px;
          padding: 7px 28px 7px 10px;
        }

        .crmPipelineTopbar input.crmPipelineOwnerLocked {
          background: #e4e7ec;
          color: #667085;
          cursor: not-allowed;
          font-weight: 800;
          padding-right: 10px;
        }

        .crmAppHeader {
          align-items: center;
          border-bottom: 1px solid #e3e6ea;
          display: grid;
          flex: 0 0 auto;
          gap: 16px;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 460px) minmax(0, 1fr);
          margin: -18px -18px 0;
          padding: 10px 18px;
        }

        .crmAppHeaderTitle {
          align-items: baseline;
          display: flex;
          gap: 8px;
          min-width: 0;
        }

        .crmAppHeaderTitle span {
          color: #8a8e94;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .crmAppHeaderTitle h1 {
          color: #21232c;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmAppHeaderSearch {
          min-width: 0;
        }

        .crmAppHeaderGreeting {
          align-items: center;
          color: #5b5f66;
          display: flex;
          font-size: 14px;
          gap: 10px;
          justify-content: flex-end;
          min-width: 0;
          white-space: nowrap;
        }

        .crmAppHeaderGreeting strong {
          color: #21232c;
          font-weight: 700;
        }

        .crmAppHeaderAvatar {
          align-items: center;
          background: #216e63;
          border-radius: 999px;
          color: #ffffff;
          display: flex;
          font-size: 13px;
          font-weight: 800;
          height: 32px;
          justify-content: center;
          width: 32px;
        }

        .crmContactSearch {
          position: relative;
          width: 100%;
          z-index: 40;
        }

        .crmContactSearch input {
          appearance: none;
          background: #f4f6f8;
          border: 1px solid #d5d9df;
          border-radius: 8px;
          color: #17202a;
          font: inherit;
          font-size: 14px;
          min-height: 38px;
          outline: 0;
          padding: 8px 12px 8px 36px;
          width: 100%;
        }

        .crmContactSearch input:focus {
          background: #ffffff;
          border-color: #216e63;
          box-shadow: 0 0 0 3px rgba(33, 110, 99, 0.12);
        }

        .crmPipelineTopbar .crmContactSearch input {
          min-height: 34px;
          min-width: 0;
          outline: 0;
          padding: 7px 12px 7px 34px;
          width: 100%;
        }

        .crmPipelineTopbar .crmContactSearch input:focus {
          border-color: #216e63;
          box-shadow: 0 0 0 3px rgba(33, 110, 99, 0.12);
        }

        .crmContactSearchIcon {
          border: 2px solid #667085;
          border-radius: 999px;
          height: 11px;
          left: 13px;
          pointer-events: none;
          position: absolute;
          top: 12px;
          width: 11px;
          z-index: 1;
        }

        .crmContactSearchIcon::after {
          background: #667085;
          content: "";
          height: 2px;
          left: 8px;
          position: absolute;
          top: 8px;
          transform: rotate(45deg);
          transform-origin: left center;
          width: 6px;
        }

        .crmContactSuggestions {
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 8px;
          box-shadow: 0 16px 36px rgba(21, 32, 43, 0.16);
          left: 0;
          margin-top: 6px;
          max-height: 370px;
          overflow-y: auto;
          padding: 5px;
          position: absolute;
          right: 0;
          top: 100%;
        }

        .crmContactSuggestions button {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #17202a;
          cursor: pointer;
          display: grid;
          font: inherit;
          gap: 9px;
          grid-template-columns: 32px minmax(0, 1fr) auto;
          padding: 8px;
          text-align: left;
          width: 100%;
        }

        .crmContactSuggestions button:hover,
        .crmContactSuggestions button.highlighted {
          background: #edf5f3;
        }

        .crmContactSuggestionAvatar {
          align-items: center;
          background: #dcebe7;
          border-radius: 999px;
          color: #216e63;
          display: flex;
          font-size: 12px;
          font-weight: 900;
          height: 32px;
          justify-content: center;
          width: 32px;
        }

        .crmContactSuggestionText {
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .crmContactSuggestionText strong,
        .crmContactSuggestionText small {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmContactSuggestionText strong {
          font-size: 12px;
        }

        .crmContactSuggestionText small {
          color: #667085;
          font-size: 10px;
        }

        .crmContactSuggestionStatus {
          background: #eef2f6;
          border-radius: 999px;
          color: #475467;
          font-size: 9px;
          font-weight: 800;
          max-width: 110px;
          overflow: hidden;
          padding: 4px 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmContactSearchState {
          color: #667085;
          font-size: 11px;
          margin: 0;
          padding: 12px;
          text-align: center;
        }

        .crmSalesChanceButton,
        .crmEditPipelineButton {
          background: #216e63;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          min-height: 34px;
          padding: 0 12px;
        }

        .crmDeletePipelineButton {
          background: #d92d20;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          min-height: 34px;
          padding: 0 12px;
        }

        .crmPipelineEditor {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          gap: 10px;
          min-height: 0;
          min-width: 0;
        }

        .crmPipelineEditorTop {
          align-items: center;
          background: #f4f6f8;
          border-radius: 8px;
          display: grid;
          flex: 0 0 auto;
          gap: 10px;
          grid-template-columns: 280px max-content max-content;
          justify-content: start;
          padding: 8px;
        }

        .crmPipelineEditorTop input {
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          min-height: 36px;
          padding: 0 10px;
        }

        .crmPipelineEditorTop button {
          border: 0;
          border-radius: 6px;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          min-height: 36px;
          min-width: 142px;
          padding: 0 12px;
        }

        .crmPipelineEditorTop button:nth-of-type(1) {
          background: #216e63;
          color: #ffffff;
        }

        .crmPipelineEditorTop button:nth-of-type(2) {
          background: #e4e7ec;
          color: #344054;
        }

        .crmPipelineEditorTop button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .crmPipelineEditorBoard {
          display: grid;
          flex: 1 1 auto;
          gap: 5px;
          grid-auto-columns: minmax(120px, 1fr);
          grid-auto-flow: column;
          min-height: 0;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .crmPipelineEditorColumn {
          background: #f4f6f8;
          border-radius: 8px;
          display: grid;
          min-height: 220px;
          padding: 8px;
        }

        .crmPipelineEditorColumn input {
          align-self: start;
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 10px;
          width: 100%;
        }

        .crmPipelineEditorColumn.addStage button {
          align-self: start;
          background: #ffffff;
          border: 0;
          border-radius: 8px;
          color: #216e63;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 10px;
        }

        .crmPipelineLoading {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          justify-content: center;
          min-height: 220px;
        }

        .crmPipelineLoaderCard {
          align-items: center;
          background: #ffffff;
          border: 1px solid #e5e9ee;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(21, 32, 43, 0.09);
          color: #667085;
          display: flex;
          font-size: 13px;
          gap: 11px;
          padding: 16px 20px;
        }

        .crmPipelineLoader {
          animation: crmPipelineLoaderSpin 0.8s linear infinite;
          border: 2px solid #d7e4e1;
          border-radius: 999px;
          border-top-color: #216e63;
          height: 22px;
          width: 22px;
        }

        @keyframes crmPipelineLoaderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .crmPipelineBoard {
          flex: 1 1 auto;
          display: grid;
          gap: 5px;
          grid-auto-columns: minmax(120px, 1fr);
          grid-auto-flow: column;
          min-height: 0;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .crmDragActions {
          bottom: 18px;
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          left: 82px;
          opacity: 0;
          pointer-events: none;
          position: fixed;
          right: 18px;
          transform: translateY(calc(100% + 24px));
          transition:
            opacity 0.16s ease,
            transform 0.16s ease;
          z-index: 30;
        }

        .crmDragActions.isDragging {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .crmDeleteDropzone,
        .crmTransferDropzone {
          align-items: center;
          border-radius: 8px;
          display: flex;
          font-size: 13px;
          font-weight: 900;
          height: 52px;
          justify-content: center;
        }

        .crmDeleteDropzone {
          background: #fff1f0;
          border: 2px dashed #d92d20;
          color: #b42318;
        }

        .crmDeleteDropzone.active {
          background: #fee4e2;
          box-shadow: 0 16px 34px rgba(180, 35, 24, 0.18);
          transform: translateY(-2px);
        }

        .crmTransferDropzone {
          background: #f2f4f7;
          border: 2px dashed #98a2b3;
          color: #475467;
        }

        .crmTransferDropzone.active {
          background: #e4e7ec;
          box-shadow: 0 16px 34px rgba(52, 64, 84, 0.16);
          transform: translateY(-2px);
        }

        .crmTransferPopup {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          bottom: 108px;
          box-shadow: 0 22px 60px rgba(21, 32, 43, 0.2);
          color: #17202a;
          display: grid;
          gap: 10px;
          left: 50%;
          min-width: 320px;
          padding: 14px;
          position: fixed;
          transform: translateX(-50%);
          z-index: 80;
        }

        .crmTransferPopup > button:first-child {
          align-items: center;
          background: #f4f6f8;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #4b5563;
          display: flex;
          font-size: 20px;
          font-weight: 900;
          height: 28px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          position: absolute;
          right: 8px;
          top: 8px;
          width: 28px;
        }

        .crmTransferPopup strong {
          font-size: 16px;
          padding-right: 34px;
        }

        .crmTransferPopup select {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          min-height: 38px;
          padding: 0 10px;
        }

        .crmTransferPopup p {
          color: #b42318;
          font-size: 12px;
          font-weight: 800;
          margin: 0;
        }

        .crmTransferPopup > button:last-child {
          background: #475467;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          font: inherit;
          font-weight: 900;
          min-height: 38px;
        }

        .crmTransferPopup > button:last-child:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .crmPipelineContactModal {
          align-items: center;
          background: rgba(21, 32, 43, 0.28);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 20px;
          position: fixed;
          z-index: 180;
        }

        .crmPipelineContactForm {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(21, 32, 43, 0.24);
          color: #17202a;
          display: grid;
          gap: 12px;
          max-height: calc(100vh - 40px);
          max-width: min(820px, calc(100vw - 40px));
          overflow-y: auto;
          padding: 16px;
          position: relative;
          width: min(820px, calc(100vw - 40px));
        }

        .crmPipelineContactClose {
          align-items: center;
          background: #f4f6f8;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #4b5563;
          display: flex;
          font-size: 20px;
          font-weight: 900;
          height: 28px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          position: absolute;
          right: 10px;
          top: 10px;
          width: 28px;
        }

        .crmPipelineContactHeader {
          display: grid;
          gap: 3px;
          padding-right: 36px;
        }

        .crmPipelineContactHeader p {
          color: #216e63;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0;
          margin: 0;
          text-transform: uppercase;
        }

        .crmPipelineContactHeader strong {
          font-size: 18px;
          line-height: 1.15;
        }

        .crmPipelineContactColumns {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .crmPipelineContactColumn {
          align-content: start;
          display: grid;
          gap: 9px;
          min-width: 0;
        }

        .crmPipelineContactForm label {
          color: #4b5563;
          display: grid;
          font-size: 11px;
          font-weight: 900;
          gap: 4px;
          margin: 0;
        }

        .crmPipelineContactForm label span,
        .crmPipelineStageField legend {
          color: #4b5563;
          font-size: 11px;
          font-weight: 900;
        }

        .crmPipelineContactForm input,
        .crmPipelineContactForm select {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #17202a;
          font: inherit;
          font-size: 13px;
          min-height: 40px;
          outline: 0;
          padding: 0 12px;
          width: 100%;
        }

        .crmPipelineStageField {
          border: 0;
          display: grid;
          gap: 6px;
          margin: 0;
          min-width: 0;
          padding: 0;
        }

        .crmPipelineStagePicker {
          display: flex;
          height: 59px;
          min-width: 0;
          overflow-x: auto;
          overflow-y: visible;
          padding: 10px 0 10px;
        }

        .crmPipelineStagePicker button {
          background: transparent;
          border: 0;
          color: transparent;
          flex: 0 0 42px;
          height: 30px;
          margin-right: -8px;
          min-width: 42px;
          overflow: visible;
          padding: 0;
          position: relative;
        }

        .crmPipelineStagePicker button::before {
          background: #dedede;
          border-radius: 4px;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 50%,
            calc(100% - 10px) 100%,
            0 100%,
            10px 50%
          );
          content: "";
          inset: 0;
          position: absolute;
          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }

        .crmPipelineStagePicker button:first-child::before {
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 50%,
            calc(100% - 10px) 100%,
            0 100%
          );
        }

        .crmPipelineStagePicker button:last-child {
          margin-right: 0;
        }

        .crmPipelineStagePicker button:last-child::before {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 10px 50%);
        }

        .crmPipelineStagePicker button.filled::before {
          background: #2f8b4f;
        }

        .crmPipelineStagePicker button.selected::before {
          background: #007f39;
        }

        .crmPipelineStagePicker button:hover::before,
        .crmPipelineStagePicker button:focus-visible::before {
          transform: translateY(-1px);
        }

        .crmPipelineStagePicker button::after {
          background: #24242a;
          border-radius: 4px;
          color: #ffffff;
          content: attr(data-stage);
          font-size: 11px;
          font-weight: 800;
          left: 50%;
          line-height: 0;
          opacity: 0;
          padding: 6px 8px;
          pointer-events: none;
          position: absolute;
          top: calc(100% + 6px);
          transform: translateX(-50%);
          transition: opacity 0.12s ease;
          white-space: nowrap;
          z-index: 8;
        }

        .crmPipelineStagePicker button:hover::after,
        .crmPipelineStagePicker button:focus-visible::after {
          opacity: 1;
        }

        .crmPipelineStagePicker button span {
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }

        .crmPipelineContactError {
          color: #b42318;
          font-size: 12px;
          font-weight: 800;
          margin: 0;
        }

        .crmPipelineContactActions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .crmPipelineContactActions button {
          border: 0;
          border-radius: 8px;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 14px;
        }

        .crmPipelineContactActions button:first-child {
          background: #e4e7ec;
          color: #344054;
        }

        .crmPipelineContactActions button:last-child {
          background: #216e63;
          color: #ffffff;
        }

        .crmPipelineContactActions button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .crmPipelineDeleteOverlay {
          align-items: center;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 18px;
          position: fixed;
          z-index: 190;
        }

        .crmPipelineDeleteModal {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(21, 32, 43, 0.24);
          display: grid;
          gap: 18px;
          max-width: 520px;
          padding: 20px;
          width: min(100%, 520px);
        }

        .crmPipelineDeleteModal p {
          color: #b42318;
          font-size: 12px;
          font-weight: 900;
          margin: 0 0 4px;
          text-transform: uppercase;
        }

        .crmPipelineDeleteModal h2 {
          color: #17202a;
          font-size: 22px;
          line-height: 1.15;
          margin: 0;
        }

        .crmPipelineDeleteModal span {
          color: #667085;
          display: block;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
          margin-top: 8px;
        }

        .crmPipelineDeleteActions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .crmPipelineDeleteActions button {
          border: 0;
          border-radius: 8px;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 14px;
        }

        .crmPipelineDeleteActions button:first-child {
          background: #e4e7ec;
          color: #344054;
        }

        .crmPipelineDeleteActions button:last-child {
          background: #d92d20;
          color: #ffffff;
        }

        .crmPipelineDeleteActions button:disabled {
          cursor: wait;
          opacity: 0.55;
        }

        .crmPipelineColumn {
          background: #f4f6f8;
          border: 0;
          border-radius: 8px;
          box-shadow: none;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          min-height: 0;
          min-width: 0;
          overflow: hidden;
          padding: 0;
          position: relative;
          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
        }

        .crmPipelineColumn.dragOver {
          background: #f6fbfa;
          border-color: #78b8ac;
          box-shadow: 0 16px 34px rgba(21, 81, 73, 0.14);
        }

        .crmPipelineColumnHeader {
          align-items: start;
          background: #f4f6f8;
          border-bottom: 1px solid #dfe4ea;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.75);
          display: grid;
          gap: 3px;
          min-width: 0;
          padding: 9px 10px 8px;
          position: sticky;
          top: 0;
          z-index: 4;
        }

        .crmPipelineColumnHeader.highlightProspect {
          background: #f8f2ea;
        }

        .crmPipelineColumnHeader.highlightProspect span {
          color: #8a6c45;
        }

        .crmPipelineColumnHeader strong {
          color: #21232c;
          display: -webkit-box;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.2;
          min-height: 36px;
          overflow: hidden;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .crmPipelineColumnHeader span {
          align-items: center;
          color: #5b5f66;
          display: flex;
          font-size: 12px;
          font-weight: 600;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .crmPipelineCards {
          align-items: stretch;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 4px;
        }

        @supports (-moz-appearance: none) {
          .crmPipelineCards {
            scrollbar-color: #c7cfd8 transparent;
            scrollbar-width: thin;
          }
        }

        .crmPipelineCards::-webkit-scrollbar {
          width: 4px;
        }

        .crmPipelineCards::-webkit-scrollbar-track {
          background: transparent;
        }

        .crmPipelineCards::-webkit-scrollbar-thumb {
          background: #c7cfd8;
          border: 1px solid #f4f6f8;
          border-radius: 999px;
        }

        .crmPipelineAddContact {
          align-items: center;
          background: #ffffff;
          border: 0;
          border-radius: 8px;
          color: #667085;
          display: grid;
          flex: 0 0 auto;
          font-size: 24px;
          font-weight: 800;
          height: 36px;
          line-height: 1;
          opacity: 0;
          padding: 0;
          place-items: center;
          pointer-events: none;
          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease,
            opacity 0.15s ease;
          visibility: hidden;
          width: 100%;
        }

        .crmPipelineColumn:hover .crmPipelineAddContact,
        .crmPipelineColumn:focus-within .crmPipelineAddContact {
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .crmPipelineAddContact:hover,
        .crmPipelineAddContact:focus-visible {
          background: #e7f2ef;
          color: #155149;
          outline: 0;
        }

        .crmPipelineAddContact span {
          display: block;
          height: 24px;
          line-height: 24px;
          transform: translateY(-2px);
        }

        .crmPipelineCard {
          background: #ffffff;
          border: 1px solid #dcdfe4;
          border-radius: 5.5px;
          color: #21232c;
          display: grid;
          flex: 0 0 auto;
          gap: 4px;
          min-height: 58px;
          min-width: 0;
          padding: 8px 10px 31px;
          position: relative;
          text-align: left;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            opacity 0.15s ease;
          width: 100%;
          z-index: 1;
          box-shadow: 0 1px 3px rgba(21, 32, 43, 0.08);
        }

        .crmPipelineCard:hover {
          border-color: #c3c7cd;
          box-shadow: 0 4px 12px rgba(21, 32, 43, 0.12);
        }

        .crmPipelineCard.activityOpen {
          z-index: 35;
        }

        .crmPipelineCard:focus-visible {
          border-color: #216e63;
          outline: 2px solid rgba(33, 110, 99, 0.24);
          outline-offset: 2px;
        }

        .crmPipelineCard.dragging {
          opacity: 0.45;
          transform: scale(0.98);
        }

        .crmPipelineCard strong {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.005em;
          line-height: 1.3;
          overflow-wrap: normal;
          white-space: normal;
          word-break: normal;
        }

        .crmCardActivity {
          bottom: 8px;
          position: absolute;
          right: 8px;
        }

        .crmContactInfo {
          align-items: center;
          bottom: 8px;
          display: flex;
          gap: 6px;
          left: 10px;
          max-width: calc(100% - 32px);
          position: absolute;
          z-index: 3;
        }

        .crmNewLeadBadge {
          background: #3c61c4;
          border-radius: 999px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          justify-self: start;
          letter-spacing: 0.04em;
          line-height: 1;
          padding: 4px 8px;
          text-transform: uppercase;
        }

        .crmContactEuro {
          align-items: center;
          background: #eef1f4;
          border-radius: 999px;
          color: #4b5563;
          display: flex;
          flex: 0 0 auto;
          font-size: 11px;
          font-weight: 800;
          height: 18px;
          justify-content: center;
          line-height: 1;
          width: 18px;
        }

        .crmContactBudget {
          color: #3b3f45;
          display: block;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          max-width: 110px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmActivityDot {
          align-items: center;
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          flex: 0 0 auto;
          height: 16px;
          justify-content: center;
          line-height: 0;
          padding: 0;
          width: 16px;
        }

        .crmActivityDot svg {
          display: block;
          flex: 0 0 auto;
        }

        .crmActivityDot:hover {
          filter: brightness(0.92);
        }

        .crmActivityDot.overdue {
          background: #e5484d;
        }

        .crmActivityDot.today {
          background: #08a742;
        }

        .crmActivityDot.future {
          background: #b4b8be;
        }

        .crmActivityLoader {
          animation: crmActivityLoaderSpin 0.75s linear infinite;
          border: 2px solid #d8dee7;
          border-radius: 999px;
          border-top-color: #216e63;
          display: block;
          height: 18px;
          width: 18px;
        }

        @keyframes crmActivityLoaderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .crmMissingTask {
          align-items: center;
          background: #f7c948;
          border: 0;
          clip-path: polygon(50% 0, 100% 92%, 0 92%);
          color: #7a4a00;
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 17px;
          justify-content: center;
          line-height: 1;
          padding: 4px 0 0;
          width: 18px;
        }

        .crmMissingTask.static {
          height: 17px;
          margin-top: 1px;
          padding-top: 4px;
          width: 18px;
        }

        .crmActivityBanner {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(21, 32, 43, 0.24);
          color: #17202a;
          display: grid;
          gap: 10px;
          max-height: calc(100vh - 112px);
          max-width: min(520px, calc(100vw - 140px));
          min-width: min(380px, calc(100vw - 140px));
          overflow-y: auto;
          padding: 14px;
          position: fixed;
          width: min(520px, calc(100vw - 140px));
          z-index: 120;
        }

        .crmActivityBannerClose {
          align-items: center;
          background: #f4f6f8;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #4b5563;
          display: flex;
          font-size: 20px;
          font-weight: 900;
          height: 28px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          position: absolute;
          right: 8px;
          top: 8px;
          width: 28px;
        }

        .crmActivityBannerClose:hover {
          background: #e8eef3;
          color: #17202a;
        }

        .crmActivityBannerTop {
          align-items: start;
          display: grid;
          gap: 10px;
          grid-template-columns: 24px minmax(0, 1fr);
        }

        .crmActivityBannerCheck {
          align-items: center;
          background: #ffffff;
          border: 2px solid #b9bdc4;
          border-radius: 999px;
          color: #ffffff;
          display: flex;
          font-size: 15px;
          font-weight: 900;
          height: 24px;
          justify-content: center;
          line-height: 1;
          margin-top: 1px;
          padding: 0;
          width: 24px;
        }

        .crmActivityBannerCheck.overdue {
          border-color: #dc3b38;
        }

        .crmActivityBannerCheck.today {
          border-color: #b9bdc4;
        }

        .crmActivityBannerCheck.future {
          border-color: #2f9157;
        }

        .crmActivityBannerCheck.done {
          background: #2f9157;
          border-color: #2f9157;
        }

        .crmActivityBanner strong {
          display: block;
          font-size: 18px;
          line-height: 1.15;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmActivityBanner p {
          color: #667085;
          font-size: 13px;
          font-weight: 800;
          margin: 4px 0 0;
        }

        .crmActivityBanner small {
          background: #fff6d7;
          border-radius: 6px;
          color: #242a31;
          display: block;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
          padding: 10px;
        }

        .crmActivityBanner > button:not(.crmActivityBannerClose) {
          background: #f4f6f8;
          border: 0;
          border-radius: 6px;
          color: #1f2937;
          font: inherit;
          font-size: 15px;
          font-weight: 900;
          min-height: 42px;
          padding: 0 12px;
          text-align: left;
        }

        .crmTaskPopover {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(21, 32, 43, 0.18);
          color: #21232c;
          display: grid;
          max-height: calc(100vh - 40px);
          overflow: hidden;
          position: fixed;
          width: min(340px, calc(100vw - 32px));
          z-index: 120;
        }

        .crmTaskPopoverList {
          display: grid;
          list-style: none;
          margin: 0;
          max-height: 320px;
          overflow-y: auto;
          padding: 4px 0;
        }

        .crmTaskPopoverList li {
          align-items: center;
          display: grid;
          gap: 10px;
          grid-template-columns: 18px 18px minmax(0, 1fr);
          padding: 9px 14px;
        }

        .crmTaskPopoverList li + li {
          border-top: 1px solid #f0f1f3;
        }

        .crmTaskPopoverCheck {
          background: #ffffff;
          border: 1.5px solid #9ea2a8;
          border-radius: 999px;
          cursor: pointer;
          height: 18px;
          padding: 0;
          width: 18px;
        }

        .crmTaskPopoverCheck:hover {
          background: #e6f6ec;
          border-color: #08a742;
        }

        .crmTaskPopoverCheck.overdue {
          border-color: #dc3b38;
        }

        .crmTaskPopoverType {
          color: #5b5f66;
          font-size: 14px;
          line-height: 1;
          text-align: center;
        }

        .crmTaskPopoverText {
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: inherit;
          cursor: pointer;
          display: grid;
          font: inherit;
          gap: 2px;
          margin: -4px -6px;
          min-width: 0;
          padding: 4px 6px;
          text-align: left;
        }

        .crmTaskPopoverText:hover {
          background: #f1f3f5;
        }

        .crmTaskPopoverText:hover strong {
          color: #2b4ba1;
        }

        .crmTaskPopoverText strong {
          font-size: 14px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmTaskPopoverText small {
          color: #747678;
          font-size: 12px;
        }

        .crmTaskPopoverText small.overdue {
          color: #c0392b;
          font-weight: 600;
        }

        .crmTaskPopoverText small.today {
          color: #08a742;
          font-weight: 600;
        }

        .crmTaskPopoverEmpty {
          color: #747678;
          font-size: 13px;
          margin: 0;
          padding: 14px;
        }

        .crmTaskPopoverAdd {
          align-items: center;
          background: #ffffff;
          border: 0;
          border-top: 1px solid #e3e6ea;
          color: #21232c;
          cursor: pointer;
          display: flex;
          font: inherit;
          font-size: 14px;
          font-weight: 500;
          gap: 10px;
          padding: 12px 14px;
          text-align: left;
        }

        .crmTaskPopoverAdd span {
          font-size: 18px;
          line-height: 1;
          width: 18px;
        }

        .crmTaskPopoverAdd:hover {
          background: #f7f7f8;
        }

        .crmTaskModalBackdrop {
          align-items: center;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 20px;
          position: fixed;
          z-index: 140;
        }

        .crmTaskModal {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.3);
          display: grid;
          gap: 12px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 18px;
          position: relative;
          width: min(560px, 100%);
        }

        .crmTaskModal header {
          align-items: start;
          display: flex;
          justify-content: space-between;
          padding-right: 30px;
        }

        .crmTaskModal header p {
          color: #747678;
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 2px;
          text-transform: uppercase;
        }

        .crmTaskModal header h2 {
          font-size: 20px;
          margin: 0;
        }

        .crmTaskModal .crmActivityTypeTabs {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .crmActivityTypeTabs {
          display: grid;
          gap: 5px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .crmActivityTypeTabs button {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #1f2937;
          font-size: 11px;
          font-weight: 900;
          min-height: 34px;
          overflow: hidden;
          padding: 0 5px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmActivityTypeTabs button.active {
          background: #e7f2ef;
          border-color: #216e63;
          color: #155149;
        }

        .crmPipelineActivityForm {
          display: grid;
          gap: 8px;
        }

        .crmPipelineActivityForm input,
        .crmPipelineActivityForm textarea {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          font-size: 13px;
          min-height: 38px;
          outline: 0;
          padding: 0 10px;
          width: 100%;
        }

        .crmPipelineActivityForm textarea {
          min-height: 82px;
          padding: 10px;
          resize: vertical;
        }

        .crmPipelineActivityCheckbox {
          align-items: center;
          color: #4b5563;
          display: flex;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          line-height: 1.25;
        }

        .crmPipelineActivityForm .crmPipelineActivityCheckbox input {
          accent-color: #216e63;
          flex: 0 0 auto;
          height: 16px;
          min-height: 0;
          padding: 0;
          width: 16px;
        }

        .crmPipelineActivityForm p {
          color: #b42318;
          font-size: 12px;
          font-weight: 800;
          margin: 0;
        }

        .crmPipelineActivityDate {
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr 120px;
        }

        .crmPipelineActivityForm button {
          background: #216e63;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 12px;
        }

        .crmPipelineActivityForm button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .crmError {
          color: #b42318;
          margin: 0 0 12px;
        }

        @media (max-width: 1100px) {
          .crmDragActions {
            left: 12px;
          }
        }

        @media (max-width: 760px) {
          .crmAppHeader {
            grid-template-columns: 1fr;
          }

          .crmAppHeaderGreeting {
            justify-content: flex-start;
          }

          .crmPipelineTopbar {
            align-items: stretch;
            flex-direction: column;
          }

          .crmPipelineTopbar label,
          .crmPipelineTopbar select,
          .crmContactSearch,
          .crmSalesChanceButton,
          .crmEditPipelineButton,
          .crmDeletePipelineButton {
            width: 100%;
          }

          .crmContactSearch {
            margin-left: 0;
            max-width: none;
            min-width: 0;
          }

          .crmPipelineContactColumns {
            grid-template-columns: 1fr;
          }

          .crmPipelineContactActions {
            justify-content: stretch;
          }

          .crmPipelineContactActions button {
            flex: 1 1 0;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
