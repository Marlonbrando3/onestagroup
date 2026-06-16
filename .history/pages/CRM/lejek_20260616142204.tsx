import CrmLayout from "@/components/crm/CrmLayout";
import {
  CrmActivity,
  CrmActivityType,
  CrmContact,
  CrmPipeline,
  CrmStatus,
  customCrmPipelineDraftStages,
  crmActivityTypes,
  crmStageProbabilities,
  crmStatuses,
  defaultCrmPipeline,
} from "@/components/crm/types";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import {
  crmUsers,
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
  value: "",
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
  if (!activity.dueDate || activity.dueDate === today) return "today";
  return activity.dueDate < today ? "overdue" : "future";
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

function formatContactInfoValue(value: string | number) {
  if (!value) return "Brak";
  return String(value);
}

function getActivityPopupPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const popupWidth = Math.min(520, Math.max(380, window.innerWidth - 140));
  const gap = 12;
  const left =
    rect.right + gap + popupWidth <= window.innerWidth - 16
      ? rect.right + gap
      : Math.max(104, rect.left - popupWidth - gap);
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
    error,
    addContact,
    updateContact,
    updateContactStatus,
    deleteContact,
    reload,
  } = useCrmContacts(visibleOwner, selectedPipelineId);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState("");
  const [openActivityContactId, setOpenActivityContactId] = useState("");
  const [openActivityMode, setOpenActivityMode] = useState<"details" | "add">(
    "details",
  );
  const [activityPopupPosition, setActivityPopupPosition] = useState({
    left: 120,
    top: 76,
  });
  const [isSavingNewActivity, setIsSavingNewActivity] = useState(false);
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
  const didDrag = useRef(false);

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

  const columns = pipelineStages.map((status) => {
    const stageContacts = contacts.filter(
      (contact) => contact.status === status,
    );
    return {
      status,
      contacts: stageContacts,
    };
  });

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

  function closeActivityPopup() {
    setOpenActivityContactId("");
    setOpenActivityMode("details");
    setActivityFormError("");
  }

  function closeTransferPopup() {
    setTransferContactId("");
    setTransferError("");
    setIsTransferring(false);
  }

  function openNewPipelineEditor() {
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

    setPipelineContactFormError("");
    setIsSavingPipelineContact(true);
    const targetPipelineId = addContactPipelineId;
    const contact = await addContact({
      name: pipelineContactForm.name,
      company: "Bez firmy",
      email: pipelineContactForm.email,
      phone: pipelineContactForm.phone,
      value: Number(
        pipelineContactForm.value || pipelineContactForm.maxBudget || 0,
      ),
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
    });
    setIsSavingPipelineContact(false);
    if (!contact) {
      setPipelineContactFormError("Nie udalo sie dodac kontaktu.");
      return;
    }
    if (targetPipelineId !== selectedPipelineId) {
      await reload();
    }
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

  function toggleMissingActivityPopup(
    event: MouseEvent<HTMLElement>,
    contactId: string,
  ) {
    setActivityPopupPosition(getActivityPopupPosition(event.currentTarget));
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
    setOpenActivityContactId((current) =>
      current === contactId && openActivityMode === "add" ? "" : contactId,
    );
  }

  function openAddActivityPopup(contactId: string) {
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
    const response = await fetch("/api/crm/activities", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactId,
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

    setActivities((current) => [result.activity, ...current]);
    setOpenActivityContactId("");
    setOpenActivityMode("details");
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

    const updatedActivities = activities.map((item) =>
      item.id === activity.id ? result.activity : item,
    );
    setActivities(updatedActivities);
    if (nextStatus === "done") {
      const hasMorePlannedActivities = updatedActivities.some(
        (item) =>
          item.contactId === activity.contactId && item.status === "planned",
      );
      if (hasMorePlannedActivities) {
        setOpenActivityMode("details");
        setOpenActivityContactId(activity.contactId);
        return;
      }
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
      setOpenActivityContactId(activity.contactId);
    }
  }

  return (
    <CrmLayout active="pipeline">
      <section className="crmPipelinePage">
        <div className="crmPipelineTopbar">
          {userIsAdmin ? (
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
          {canEditActivePipeline ? (
            <button
              className="crmEditPipelineButton"
              type="button"
              onClick={openEditPipelineEditor}
            >
              Edytuj lejek
            </button>
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
                className="w-[200px]"
              >
                {isSavingPipeline ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                onClick={closePipelineEditor}
                className="w-[200px]"
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
                  key={`${stage}-${index}`}
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
        ) : (
          <div className="crmPipelineBoard">
            {columns.map((column) => {
              const probability = crmStageProbabilities[column.status];
              const probabilityLabel =
                probability === null || typeof probability === "undefined"
                  ? "brak"
                  : `${probability}%`;

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
                    <span title={probabilityLabel}>⚖ {probabilityLabel}</span>
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
                          <div className="crmContactInfo">
                            <span className="crmContactInfoTrigger">
                              <button
                                aria-label="Preferencje klienta"
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                }}
                              >
                                i
                              </button>
                              <section className="crmContactInfoPopup">
                                <dl>
                                  <div>
                                    <dt>Kraj</dt>
                                    <dd>
                                      {formatContactInfoValue(contact.country)}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt>Kwota max</dt>
                                    <dd>
                                      {contact.maxBudget
                                        ? crmBudgetFormatter.format(
                                            contact.maxBudget,
                                          )
                                        : "Brak"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt>Sypialnie</dt>
                                    <dd>
                                      {formatContactInfoValue(contact.bedrooms)}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt>Łazienki</dt>
                                    <dd>
                                      {formatContactInfoValue(
                                        contact.bathrooms,
                                      )}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt>Wybrzeże</dt>
                                    <dd>
                                      {formatContactInfoValue(contact.coast)}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt>Termin zakupu</dt>
                                    <dd>
                                      {formatContactInfoValue(
                                        contact.purchaseTimeline,
                                      )}
                                    </dd>
                                  </div>
                                </dl>
                              </section>
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
                          ) : activity ? (
                            <div className="crmCardActivity">
                              <button
                                aria-label={`Najstarsze zadanie: ${activity.title}`}
                                className={`crmActivityDot ${getActivityTone(activity)}`}
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openActivityDetailsPopup(event, contact.id);
                                }}
                              />
                              {isActivityOpen ? (
                                <section
                                  className="crmActivityBanner"
                                  style={{
                                    left: activityPopupPosition.left,
                                    top: activityPopupPosition.top,
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    aria-label="Zamknij pop-up zadania"
                                    className="crmActivityBannerClose"
                                    type="button"
                                    onClick={closeActivityPopup}
                                  >
                                    ×
                                  </button>
                                  {openActivityMode === "details" ? (
                                    <>
                                      <div className="crmActivityBannerTop">
                                        <button
                                          aria-label={
                                            activity.status === "done"
                                              ? "Oznacz zadanie jako niewykonane"
                                              : "Oznacz zadanie jako wykonane"
                                          }
                                          className={`crmActivityBannerCheck ${activity.status} ${getActivityTone(
                                            activity,
                                          )}`}
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            toggleActivityStatus(activity);
                                          }}
                                        >
                                          {activity.status === "done"
                                            ? "✓"
                                            : ""}
                                        </button>
                                        <div>
                                          <strong>{activity.title}</strong>
                                          <p>
                                            {getActivityLabel(activity)} ·{" "}
                                            {formatActivityDate(activity)} ·
                                            Onesta
                                          </p>
                                        </div>
                                      </div>
                                      {activity.note ? (
                                        <small>{activity.note}</small>
                                      ) : null}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openAddActivityPopup(contact.id)
                                        }
                                      >
                                        + Zaplanuj działanie
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="crmActivityBannerTop">
                                        <span className="crmActivityBannerCheck today" />
                                        <div>
                                          <strong>Zaplanuj działanie</strong>
                                          <p>
                                            Dodaj kolejne zadanie bez otwierania
                                            rekordu
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className="crmActivityTypeTabs"
                                        aria-label="Typ zadania"
                                      >
                                        {crmActivityTypes.map((type) => (
                                          <button
                                            className={
                                              activityForm.type === type
                                                ? "active"
                                                : ""
                                            }
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                              changeActivityType(type)
                                            }
                                          >
                                            {type}
                                          </button>
                                        ))}
                                      </div>
                                      <form
                                        className="crmPipelineActivityForm"
                                        onSubmit={(event) =>
                                          addActivityFromPipeline(
                                            event,
                                            contact.id,
                                          )
                                        }
                                      >
                                        <input
                                          placeholder="Tytul zadania"
                                          value={activityForm.title}
                                          onChange={(event) =>
                                            setActivityForm({
                                              ...activityForm,
                                              title: event.target.value,
                                            })
                                          }
                                        />
                                        <div className="crmPipelineActivityDate">
                                          <input
                                            type="date"
                                            value={activityForm.dueDate}
                                            onChange={(event) =>
                                              setActivityForm({
                                                ...activityForm,
                                                dueDate: event.target.value,
                                              })
                                            }
                                          />
                                          <input
                                            type="time"
                                            value={activityForm.dueTime}
                                            onChange={(event) =>
                                              setActivityForm({
                                                ...activityForm,
                                                dueTime: event.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                        <textarea
                                          placeholder="Notatka, opis, ustalenia..."
                                          value={activityForm.note}
                                          onChange={(event) =>
                                            setActivityForm({
                                              ...activityForm,
                                              note: event.target.value,
                                            })
                                          }
                                        />
                                        <label className="crmPipelineActivityCheckbox">
                                          <input
                                            checked={activityForm.completed}
                                            type="checkbox"
                                            onChange={(event) =>
                                              setActivityForm({
                                                ...activityForm,
                                                completed: event.target.checked,
                                              })
                                            }
                                          />
                                          Oznacz zadanie jako wykonane
                                        </label>
                                        {activityFormError ? (
                                          <p>{activityFormError}</p>
                                        ) : null}
                                        <button
                                          disabled={isSavingNewActivity}
                                          type="submit"
                                        >
                                          {isSavingNewActivity
                                            ? "Zapisywanie..."
                                            : "Zapisz zadanie"}
                                        </button>
                                      </form>
                                    </>
                                  )}
                                </section>
                              ) : null}
                            </div>
                          ) : (
                            <div className="crmCardActivity">
                              <button
                                aria-label="Brak zaplanowanego zadania"
                                className="crmMissingTask"
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  toggleMissingActivityPopup(event, contact.id);
                                }}
                              >
                                !
                              </button>
                              {isActivityOpen ? (
                                <section
                                  className="crmActivityBanner crmAddActivityBanner"
                                  style={{
                                    left: activityPopupPosition.left,
                                    top: activityPopupPosition.top,
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    aria-label="Zamknij pop-up zadania"
                                    className="crmActivityBannerClose"
                                    type="button"
                                    onClick={closeActivityPopup}
                                  >
                                    ×
                                  </button>
                                  <div className="crmActivityBannerTop">
                                    <span className="crmMissingTask static">
                                      !
                                    </span>
                                    <div>
                                      <strong>
                                        Brak zaplanowanego zadania
                                      </strong>
                                      <p>
                                        Dodaj zadanie bez otwierania rekordu
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className="crmActivityTypeTabs"
                                    aria-label="Typ zadania"
                                  >
                                    {crmActivityTypes.map((type) => (
                                      <button
                                        className={
                                          activityForm.type === type
                                            ? "active"
                                            : ""
                                        }
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
                                    onSubmit={(event) =>
                                      addActivityFromPipeline(event, contact.id)
                                    }
                                  >
                                    <input
                                      placeholder="Tytul zadania"
                                      value={activityForm.title}
                                      onChange={(event) =>
                                        setActivityForm({
                                          ...activityForm,
                                          title: event.target.value,
                                        })
                                      }
                                    />
                                    <div className="crmPipelineActivityDate">
                                      <input
                                        type="date"
                                        value={activityForm.dueDate}
                                        onChange={(event) =>
                                          setActivityForm({
                                            ...activityForm,
                                            dueDate: event.target.value,
                                          })
                                        }
                                      />
                                      <input
                                        type="time"
                                        value={activityForm.dueTime}
                                        onChange={(event) =>
                                          setActivityForm({
                                            ...activityForm,
                                            dueTime: event.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <textarea
                                      placeholder="Notatka, opis, ustalenia..."
                                      value={activityForm.note}
                                      onChange={(event) =>
                                        setActivityForm({
                                          ...activityForm,
                                          note: event.target.value,
                                        })
                                      }
                                    />
                                    <label className="crmPipelineActivityCheckbox">
                                      <input
                                        checked={activityForm.completed}
                                        type="checkbox"
                                        onChange={(event) =>
                                          setActivityForm({
                                            ...activityForm,
                                            completed: event.target.checked,
                                          })
                                        }
                                      />
                                      Oznacz zadanie jako wykonane
                                    </label>
                                    {activityFormError ? (
                                      <p>{activityFormError}</p>
                                    ) : null}
                                    <button
                                      disabled={isSavingNewActivity}
                                      type="submit"
                                    >
                                      {isSavingNewActivity
                                        ? "Zapisywanie..."
                                        : "Zapisz zadanie"}
                                    </button>
                                  </form>
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
                    <span>Kwota</span>
                    <input
                      inputMode="numeric"
                      value={pipelineContactForm.value}
                      onChange={(event) =>
                        setPipelineContactForm({
                          ...pipelineContactForm,
                          value: event.target.value,
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
          background: #f4f6f8;
          border-radius: 8px;
          display: flex;
          gap: 10px;
          min-height: 38px;
          padding: 6px 8px;
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

        .crmPipelineTopbar select {
          appearance: none;
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 6px;
          color: #17202a;
          font: inherit;
          min-width: 210px;
          padding: 7px 28px 7px 10px;
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
          gap: 8px;
          grid-template-columns: minmax(180px, 280px) auto auto;
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
          gap: 4px;
          min-width: 0;
          padding: 8px 8px 9px;
          position: sticky;
          top: 0;
          z-index: 4;
        }

        .crmPipelineColumnHeader.highlightProspect {
          background: #fff3df;
          border-bottom-color: #f2b86b;
          box-shadow:
            inset 3px 0 0 #f59e0b,
            0 1px 0 rgba(255, 255, 255, 0.75);
        }

        .crmPipelineColumnHeader.highlightProspect span {
          color: #9a5b00;
        }

        .crmPipelineColumnHeader strong {
          display: -webkit-box;
          font-size: 13px;
          line-height: 1.15;
          min-height: 30px;
          overflow: hidden;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .crmPipelineColumnHeader span {
          align-items: center;
          color: #4b5563;
          display: flex;
          font-size: 11px;
          font-weight: 700;
          min-width: 0;
          white-space: nowrap;
        }

        .crmPipelineCards {
          align-items: stretch;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 8px;
        }

        .crmPipelineCards::-webkit-scrollbar {
          width: 8px;
        }

        .crmPipelineCards::-webkit-scrollbar-thumb {
          background: #c7cfd8;
          border: 2px solid #f4f6f8;
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
          border: 0;
          border-radius: 8px;
          color: #17202a;
          display: grid;
          flex: 0 0 auto;
          gap: 2px;
          min-height: 52px;
          min-width: 0;
          padding: 7px 7px 28px;
          position: relative;
          text-align: left;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            opacity 0.15s ease;
          width: 100%;
          z-index: 1;
          box-shadow: 0 5px 14px rgba(21, 32, 43, 0.08);
        }

        .crmPipelineCard:hover {
          box-shadow: 0 8px 20px rgba(21, 32, 43, 0.12);
        }

        .crmPipelineCard.activityOpen {
          z-index: 35;
        }

        .crmPipelineCard:has(.crmContactInfoTrigger:hover),
        .crmPipelineCard:has(.crmContactInfoTrigger:focus-within) {
          z-index: 140;
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
          font-size: 12px;
          line-height: 1.2;
          overflow-wrap: normal;
          white-space: normal;
          word-break: normal;
        }

        .crmCardActivity {
          bottom: 6px;
          position: absolute;
          right: 6px;
        }

        .crmContactInfo {
          align-items: center;
          bottom: 6px;
          display: flex;
          gap: 4px;
          left: 6px;
          max-width: calc(100% - 32px);
          position: absolute;
          z-index: 3;
        }

        .crmContactInfoTrigger {
          display: block;
          flex: 0 0 auto;
          position: relative;
        }

        .crmContactInfoTrigger > button {
          align-items: center;
          background: #eef1f4;
          border: 0;
          border-radius: 999px;
          color: #4b5563;
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 16px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          flex: 0 0 auto;
          width: 16px;
        }

        .crmContactBudget {
          color: #4b5563;
          display: block;
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
          max-width: 68px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crmContactInfoPopup {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 18px 44px rgba(21, 32, 43, 0.18);
          color: #17202a;
          display: none;
          left: -4px;
          min-width: 230px;
          opacity: 0;
          padding: 10px;
          pointer-events: none;
          position: absolute;
          top: 24px;
          transform: translateY(-4px);
          transition:
            opacity 0.14s ease,
            transform 0.14s ease;
          z-index: 145;
        }

        .crmContactInfoTrigger:hover .crmContactInfoPopup,
        .crmContactInfoTrigger:focus-within .crmContactInfoPopup {
          display: block;
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .crmContactInfoPopup dl {
          display: grid;
          gap: 7px;
          margin: 0;
        }

        .crmContactInfoPopup div {
          display: grid;
          gap: 2px;
        }

        .crmContactInfoPopup dt,
        .crmContactInfoPopup dd {
          margin: 0;
        }

        .crmContactInfoPopup dt {
          color: #667085;
          font-size: 11px;
          font-weight: 800;
        }

        .crmContactInfoPopup dd {
          color: #17202a;
          font-size: 13px;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .crmActivityDot {
          border: 0;
          border-radius: 999px;
          box-shadow: 0 3px 9px rgba(21, 32, 43, 0.16);
          height: 16px;
          width: 16px;
        }

        .crmActivityDot.overdue {
          background: #dc3b38;
        }

        .crmActivityDot.today {
          background: #b9bdc4;
        }

        .crmActivityDot.future {
          background: #2f9157;
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

        .crmAddActivityBanner {
          min-width: min(420px, calc(100vw - 140px));
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
          .crmPipelineTopbar {
            align-items: stretch;
            flex-direction: column;
          }

          .crmPipelineTopbar label,
          .crmPipelineTopbar select,
          .crmSalesChanceButton,
          .crmEditPipelineButton {
            width: 100%;
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
