import CrmLayout from "@/components/crm/CrmLayout";
import {
  CrmActivity,
  CrmActivityStatus,
  CrmActivityType,
  CrmStatus,
  crmActivityTypes,
  crmCurrency,
  crmStatuses,
} from "@/components/crm/types";
import { useCrmActivities } from "@/components/crm/useCrmActivities";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

function formatDate(value: string | null) {
  if (!value) return "Bez terminu";
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(value));
}

function sortActivities(activities: CrmActivity[]) {
  return [...activities].sort((a, b) => {
    const aDate = a.dueDate ? `${a.dueDate}T${a.dueTime || "00:00"}` : a.createdAt;
    const bDate = b.dueDate ? `${b.dueDate}T${b.dueTime || "00:00"}` : b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

function isActivityOverdue(activity: CrmActivity) {
  return activity.status === "planned" && Boolean(activity.dueDate) && activity.dueDate! < today;
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
  } = useCrmContacts();
  const {
    activities,
    isLoading: areActivitiesLoading,
    error: activitiesError,
    addActivity,
    updateActivity,
    updateActivityStatus,
    deleteActivity,
  } = useCrmActivities(contactId);

  const contact = contacts.find((item) => item.id === contactId);
  const plannedActivities = activities.filter((activity) => activity.status === "planned");
  const doneActivities = activities.filter((activity) => activity.status === "done");
  const overdueActivities = useMemo(
    () => sortActivities(activities.filter((activity) => isActivityOverdue(activity))),
    [activities],
  );
  const sortedActivities = useMemo(() => sortActivities(activities), [activities]);
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
    status: "Zakwalifikowano" as CrmStatus,
  });
  const [form, setForm] = useState({
    type: "Zadzwoń" as CrmActivityType,
    title: "Zadzwoń",
    dueDate: today,
    dueTime: "",
    note: "",
  });
  const [openActivityMenuId, setOpenActivityMenuId] = useState("");
  const [editingActivityId, setEditingActivityId] = useState("");
  const [isSavingActivityEdit, setIsSavingActivityEdit] = useState(false);
  const [activityEditError, setActivityEditError] = useState("");
  const [activityEditForm, setActivityEditForm] = useState({
    type: "Zadzwoń" as CrmActivityType,
    title: "",
    dueDate: today,
    dueTime: "",
    note: "",
    status: "planned" as CrmActivityStatus,
  });

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
      status: contact.status,
    });
  }, [contact]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactId) return;
    const activity = await addActivity({
      contactId,
      type: form.type,
      title: form.title.trim() || form.type,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      note: form.note,
    });
    if (!activity) return;
    setForm({ type: form.type, title: form.type, dueDate: today, dueTime: "", note: "" });
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
    setOpenActivityMenuId("");
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
      setActivityEditError("Tytul dzialania jest wymagany.");
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
    setOpenActivityMenuId("");
    await deleteActivity(id);
  }

  async function handleStatusChange(status: CrmStatus) {
    if (!contactId) return;
    await updateContactStatus(contactId, status);
  }

  async function handleContactSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactId) return;
    if (!contactForm.name.trim()) {
      setContactFormError("Imie i nazwisko jest wymagane.");
      return;
    }

    setContactFormError("");
    setIsSavingContact(true);
    const updatedContact = await updateContact({
      id: contactId,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      value: Number(contactForm.maxBudget || 0),
      maxBudget: Number(contactForm.maxBudget || 0),
      country: contactForm.country,
      bedrooms: contactForm.bedrooms,
      bathrooms: contactForm.bathrooms,
      coast: contactForm.coast,
      purchaseTimeline: contactForm.purchaseTimeline,
      status: contactForm.status,
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
        status: contact.status,
      });
    }
    setContactFormError("");
    setIsEditingContact(false);
  }

  return (
    <CrmLayout active="contacts">
      <section className="crmContactPage">
        <header className="crmContactHeader">
          <Link href="/crm">← Kontakty</Link>
          <div>
            <p>Rekord klienta</p>
            <h1>{contact?.name || "Kontakt"}</h1>
            <span>{contact?.email || contact?.phone || "Ladowanie danych..."}</span>
          </div>
          {contact ? <strong>{crmCurrency.format(contact.maxBudget || contact.value)}</strong> : null}
        </header>

        {contactsError ? <p className="crmError">{contactsError}</p> : null}
        {activitiesError ? <p className="crmError">{activitiesError}</p> : null}
        {isContactLoading ? <p className="crmMuted">Ladowanie kontaktu...</p> : null}

        {contact ? (
          <div className="crmContactGrid">
            <aside className="crmContactSummary">
              <div className="crmSummaryTop">
                <div className="crmAvatarLarge">{contact.name.slice(0, 1)}</div>
                {!isEditingContact ? (
                  <button type="button" onClick={() => setIsEditingContact(true)}>
                    Edytuj
                  </button>
                ) : null}
              </div>

              {isEditingContact ? (
                <form className="crmContactEditForm" onSubmit={handleContactSave}>
                  <label>
                    Imie i nazwisko
                    <input
                      value={contactForm.name}
                      onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                    />
                  </label>
                  <label>
                    Telefon
                    <input
                      value={contactForm.phone}
                      onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })}
                    />
                  </label>
                  <label>
                    Kwota max EUR
                    <input
                      min="0"
                      type="number"
                      value={contactForm.maxBudget}
                      onChange={(event) => setContactForm({ ...contactForm, maxBudget: event.target.value })}
                    />
                  </label>
                  <label>
                    Kraj
                    <input
                      value={contactForm.country}
                      onChange={(event) => setContactForm({ ...contactForm, country: event.target.value })}
                    />
                  </label>
                  <label>
                    Sypialnie
                    <input
                      value={contactForm.bedrooms}
                      onChange={(event) => setContactForm({ ...contactForm, bedrooms: event.target.value })}
                    />
                  </label>
                  <label>
                    Łazienki
                    <input
                      value={contactForm.bathrooms}
                      onChange={(event) => setContactForm({ ...contactForm, bathrooms: event.target.value })}
                    />
                  </label>
                  <label>
                    Wybrzeże
                    <input
                      value={contactForm.coast}
                      onChange={(event) => setContactForm({ ...contactForm, coast: event.target.value })}
                    />
                  </label>
                  <label>
                    Termin zakupu
                    <input
                      value={contactForm.purchaseTimeline}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, purchaseTimeline: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Etap lejka
                    <select
                      value={contactForm.status}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, status: event.target.value as CrmStatus })
                      }
                    >
                      {crmStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  {contactFormError ? <p className="crmError">{contactFormError}</p> : null}
                  <div className="crmEditActions">
                    <button disabled={isSavingContact} type="submit">
                      {isSavingContact ? "Zapisywanie..." : "Zapisz"}
                    </button>
                    <button disabled={isSavingContact} type="button" onClick={cancelContactEdit}>
                      Anuluj
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>{contact.name}</h2>
                  <dl>
                    <div>
                      <dt>Etap lejka</dt>
                      <dd>
                        <select
                          className="crmStatusSelect"
                          value={contact.status}
                          onChange={(event) => handleStatusChange(event.target.value as CrmStatus)}
                        >
                          {crmStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{contact.email || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Telefon</dt>
                      <dd>{contact.phone || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Kwota max EUR</dt>
                      <dd>{contact.maxBudget ? crmCurrency.format(contact.maxBudget) : "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Kraj</dt>
                      <dd>{contact.country || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Sypialnie</dt>
                      <dd>{contact.bedrooms || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Łazienki</dt>
                      <dd>{contact.bathrooms || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Wybrzeże</dt>
                      <dd>{contact.coast || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Termin zakupu</dt>
                      <dd>{contact.purchaseTimeline || "Brak"}</dd>
                    </div>
                    <div>
                      <dt>Planowane</dt>
                      <dd>{plannedActivities.length}</dd>
                    </div>
                    <div>
                      <dt>Wykonane</dt>
                      <dd>{doneActivities.length}</dd>
                    </div>
                  </dl>
                </>
              )}
            </aside>

            <section className="crmActivityPanel">
              <div className="crmTabs" aria-label="Typ dzialania">
                {crmActivityTypes.map((type) => (
                  <button
                    className={form.type === type ? "active" : ""}
                    key={type}
                    type="button"
                    onClick={() => changeType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <form className="crmActivityForm" onSubmit={handleSubmit}>
                <input
                  placeholder="Tytul dzialania"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                <div className="crmFormRow">
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                  />
                  <input
                    type="time"
                    value={form.dueTime}
                    onChange={(event) => setForm({ ...form, dueTime: event.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Notatka, opis, ustalenia..."
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                />
                <button type="submit">Zapisz dzialanie</button>
              </form>

              {overdueActivities.length ? (
                <section className="crmOverduePanel">
                  <div className="crmOverdueHeader">
                    <h2>Zaległe zadania</h2>
                    <span>{overdueActivities.length}</span>
                  </div>
                  <div className="crmOverdueList">
                    {overdueActivities.map((activity) => (
                      <article className="crmOverdueCard" key={activity.id}>
                        <button
                          aria-label="Oznacz zadanie jako wykonane"
                          type="button"
                          onClick={() => updateActivityStatus(activity.id, "done")}
                        >
                          ✓
                        </button>
                        <div>
                          <strong>{activity.title}</strong>
                          <p>
                            {activity.type} · {formatDate(activity.dueDate)}
                            {activity.dueTime ? `, ${activity.dueTime.slice(0, 5)}` : ""}
                          </p>
                          {activity.note ? <small>{activity.note}</small> : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="crmTimeline">
                <div className="crmTimelineHeader">
                  <h2>Historia komunikacji</h2>
                  {areActivitiesLoading ? <span>Ladowanie...</span> : <span>{activities.length}</span>}
                </div>
                {sortedActivities.map((activity) => (
                  <div
                    className={`crmHistoryRow ${openActivityMenuId === activity.id ? "menuOpen" : ""}`}
                    key={activity.id}
                  >
                    <button
                      aria-label={
                        activity.status === "done" ? "Oznacz jako niewykonane" : "Oznacz jako wykonane"
                      }
                      className={`crmHistoryCheck ${activity.status}`}
                      type="button"
                      onClick={() =>
                        updateActivityStatus(activity.id, activity.status === "done" ? "planned" : "done")
                      }
                    >
                      {activity.status === "done" ? "✓" : ""}
                    </button>
                    <article className={`crmHistoryCard ${activity.status}`}>
                      <div className="crmHistoryTop">
                        <div>
                          <h3>{activity.title}</h3>
                          {isActivityOverdue(activity) ? <span className="crmOverdue">Zalegle</span> : null}
                        </div>
                        <div className="crmHistoryMenu">
                          <button
                            aria-expanded={openActivityMenuId === activity.id}
                            aria-label="Opcje dzialania"
                            type="button"
                            onClick={() =>
                              setOpenActivityMenuId((current) => (current === activity.id ? "" : activity.id))
                            }
                          >
                            ...
                          </button>
                          {openActivityMenuId === activity.id ? (
                            <div className="crmHistoryMenuList">
                              <button type="button" onClick={() => openActivityEdit(activity)}>
                                Edytuj
                              </button>
                              <button type="button" onClick={() => handleActivityDelete(activity.id)}>
                                Usuń
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="crmHistoryMeta">
                        <span>
                          {formatDate(activity.dueDate)}
                          {activity.dueTime ? `, ${activity.dueTime.slice(0, 5)}` : ""}
                        </span>
                        <span>Onesta</span>
                        <span>{contact.name}</span>
                        <span>{activity.type}</span>
                      </div>
                      {activity.note ? <p className="crmHistoryNote">{activity.note}</p> : null}
                    </article>
                  </div>
                ))}
                {!areActivitiesLoading && !activities.length ? (
                  <p className="crmMuted">Brak historii komunikacji dla tego kontaktu.</p>
                ) : null}
              </section>
            </section>
          </div>
        ) : null}
      </section>
      {editingActivityId ? (
        <div className="crmModalBackdrop" role="presentation">
          <section aria-modal="true" className="crmActivityModal" role="dialog">
            <header>
              <div>
                <p>Edycja dzialania</p>
                <h2>{activityEditForm.title || "Dzialanie"}</h2>
              </div>
              <button aria-label="Zamknij" type="button" onClick={closeActivityEdit}>
                ×
              </button>
            </header>

            <div className="crmTabs" aria-label="Typ dzialania">
              {crmActivityTypes.map((type) => (
                <button
                  className={activityEditForm.type === type ? "active" : ""}
                  key={type}
                  type="button"
                  onClick={() => changeEditType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <form className="crmActivityForm" onSubmit={handleActivityEditSubmit}>
              <input
                placeholder="Tytul dzialania"
                value={activityEditForm.title}
                onChange={(event) =>
                  setActivityEditForm({ ...activityEditForm, title: event.target.value })
                }
              />
              <div className="crmFormRow">
                <input
                  type="date"
                  value={activityEditForm.dueDate}
                  onChange={(event) =>
                    setActivityEditForm({ ...activityEditForm, dueDate: event.target.value })
                  }
                />
                <input
                  type="time"
                  value={activityEditForm.dueTime}
                  onChange={(event) =>
                    setActivityEditForm({ ...activityEditForm, dueTime: event.target.value })
                  }
                />
              </div>
              <select
                value={activityEditForm.status}
                onChange={(event) =>
                  setActivityEditForm({
                    ...activityEditForm,
                    status: event.target.value as CrmActivityStatus,
                  })
                }
              >
                <option value="planned">Niewykonane</option>
                <option value="done">Wykonane</option>
              </select>
              <textarea
                placeholder="Notatka, opis, ustalenia..."
                value={activityEditForm.note}
                onChange={(event) => setActivityEditForm({ ...activityEditForm, note: event.target.value })}
              />
              {activityEditError ? <p className="crmError">{activityEditError}</p> : null}
              <div className="crmModalActions">
                <button disabled={isSavingActivityEdit} type="button" onClick={closeActivityEdit}>
                  Anuluj
                </button>
                <button disabled={isSavingActivityEdit} type="submit">
                  {isSavingActivityEdit ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
      <style jsx>{`
        .crmContactPage {
          display: grid;
          gap: 18px;
          padding: 24px;
        }
        .crmContactHeader {
          align-items: center;
          display: grid;
          gap: 14px;
          grid-template-columns: auto minmax(0, 1fr) auto;
        }
        .crmContactHeader a {
          color: #1265c7;
          font-weight: 800;
        }
        .crmContactHeader p {
          color: #216e63;
          font-size: 13px;
          font-weight: 800;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .crmContactHeader h1 {
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.08;
          margin: 0;
        }
        .crmContactHeader span,
        .crmMuted {
          color: #667085;
        }
        .crmContactGrid {
          align-items: start;
          display: grid;
          gap: 18px;
          grid-template-columns: 320px minmax(0, 1fr);
        }
        .crmContactSummary,
        .crmActivityPanel {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
        }
        .crmContactSummary {
          display: grid;
          gap: 12px;
          padding: 18px;
        }
        .crmSummaryTop {
          align-items: start;
          display: flex;
          justify-content: space-between;
        }
        .crmSummaryTop button {
          background: #e7f2ef;
          border: 1px solid #b8d7d0;
          border-radius: 8px;
          color: #155149;
          font-weight: 800;
          min-height: 38px;
          padding: 0 12px;
        }
        .crmAvatarLarge {
          align-items: center;
          background: #216e63;
          border-radius: 8px;
          color: #ffffff;
          display: flex;
          font-size: 28px;
          font-weight: 800;
          height: 64px;
          justify-content: center;
          width: 64px;
        }
        .crmContactSummary h2,
        .crmContactSummary p {
          margin: 0;
        }
        .crmContactSummary p,
        .crmContactSummary dt {
          color: #667085;
        }
        .crmContactSummary dl {
          display: grid;
          gap: 10px;
          margin: 8px 0 0;
        }
        .crmContactSummary dl > div {
          border-top: 1px solid #eef1f4;
          display: grid;
          gap: 4px;
          padding-top: 10px;
        }
        .crmContactSummary dt,
        .crmContactSummary dd {
          margin: 0;
        }
        .crmContactSummary dd {
          font-weight: 800;
          overflow-wrap: anywhere;
        }
        .crmStatusSelect {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          font: inherit;
          font-weight: 800;
          min-height: 40px;
          outline: 0;
          padding: 0 10px;
          width: 100%;
        }
        .crmContactEditForm {
          display: grid;
          gap: 10px;
        }
        .crmContactEditForm label {
          color: #667085;
          display: grid;
          font-size: 13px;
          font-weight: 800;
          gap: 6px;
        }
        .crmContactEditForm input,
        .crmContactEditForm select {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #17202a;
          font: inherit;
          min-height: 42px;
          outline: 0;
          padding: 0 10px;
          width: 100%;
        }
        .crmEditActions {
          display: flex;
          gap: 8px;
        }
        .crmEditActions button {
          border-radius: 8px;
          font-weight: 800;
          min-height: 42px;
          padding: 0 14px;
        }
        .crmEditActions button:first-child {
          background: #216e63;
          border: 0;
          color: #ffffff;
        }
        .crmEditActions button:last-child {
          background: #ffffff;
          border: 1px solid #d8dee7;
          color: #1f2937;
        }
        .crmEditActions button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .crmActivityPanel {
          display: grid;
          gap: 16px;
          padding: 18px;
        }
        .crmTabs {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .crmTabs button {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #1f2937;
          font-weight: 800;
          min-height: 42px;
        }
        .crmTabs button.active {
          background: #e7f2ef;
          border-color: #216e63;
          color: #155149;
        }
        .crmActivityForm {
          display: grid;
          gap: 10px;
        }
        .crmActivityForm input,
        .crmActivityForm select,
        .crmActivityForm textarea {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          font: inherit;
          min-height: 44px;
          outline: 0;
          padding: 0 12px;
          width: 100%;
        }
        .crmActivityForm textarea {
          min-height: 120px;
          padding: 12px;
          resize: vertical;
        }
        .crmFormRow {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr 180px;
        }
        .crmActivityForm button {
          background: #216e63;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 800;
          justify-self: start;
          min-height: 44px;
          padding: 0 16px;
        }
        .crmOverduePanel {
          background: #fff7f6;
          border: 1px solid #f3b8b2;
          border-radius: 8px;
          display: grid;
          gap: 10px;
          padding: 14px;
        }
        .crmOverdueHeader {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }
        .crmOverdueHeader h2 {
          color: #b42318;
          font-size: 18px;
          margin: 0;
        }
        .crmOverdueHeader span {
          background: #fee4e2;
          border-radius: 999px;
          color: #b42318;
          font-size: 13px;
          font-weight: 900;
          padding: 3px 8px;
        }
        .crmOverdueList {
          display: grid;
          gap: 8px;
        }
        .crmOverdueCard {
          align-items: start;
          background: #ffffff;
          border: 1px solid #f3c7c2;
          border-radius: 8px;
          display: grid;
          gap: 10px;
          grid-template-columns: 34px minmax(0, 1fr);
          padding: 10px;
        }
        .crmOverdueCard > button {
          align-items: center;
          background: #ffffff;
          border: 2px solid #d92d20;
          border-radius: 999px;
          color: #d92d20;
          display: flex;
          font-size: 16px;
          font-weight: 900;
          height: 30px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          width: 30px;
        }
        .crmOverdueCard strong {
          display: block;
          font-size: 15px;
          line-height: 1.2;
        }
        .crmOverdueCard p {
          color: #b42318;
          font-size: 12px;
          font-weight: 800;
          margin: 4px 0 0;
        }
        .crmOverdueCard small {
          color: #667085;
          display: block;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 5px;
        }
        .crmTimeline {
          display: grid;
          gap: 11px;
          padding-top: 6px;
        }
        .crmTimelineHeader {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }
        .crmTimelineHeader h2 {
          margin: 0;
        }
        .crmTimelineHeader span {
          background: #eef1f4;
          border-radius: 999px;
          color: #4b5563;
          font-weight: 800;
          font-size: 13px;
          padding: 3px 8px;
        }
        .crmHistoryRow {
          align-items: start;
          display: grid;
          gap: 13px;
          grid-template-columns: 38px minmax(0, 1fr);
          position: relative;
        }
        .crmHistoryRow.menuOpen {
          z-index: 20;
        }
        .crmHistoryRow::before {
          background: #d9dde5;
          bottom: -11px;
          content: "";
          left: 18px;
          position: absolute;
          top: 38px;
          width: 2px;
        }
        .crmHistoryRow:last-of-type::before {
          display: none;
        }
        .crmHistoryCheck {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 999px;
          box-shadow: 0 3px 10px rgba(21, 32, 43, 0.12);
          color: #ffffff;
          display: flex;
          font-size: 19px;
          font-weight: 900;
          height: 38px;
          justify-content: center;
          line-height: 1;
          position: relative;
          width: 38px;
          z-index: 1;
        }
        .crmHistoryCheck.done {
          background: #2f9157;
          border-color: #2f9157;
        }
        .crmHistoryCard {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(21, 32, 43, 0.08);
          overflow: visible;
          position: relative;
        }
        .crmHistoryCard.done h3 {
          color: #242a31;
        }
        .crmHistoryTop {
          align-items: start;
          display: flex;
          gap: 10px;
          justify-content: space-between;
          padding: 13px 14px 6px;
        }
        .crmHistoryTop h3 {
          font-size: 18px;
          line-height: 1.15;
          margin: 0;
        }
        .crmHistoryTop button {
          background: transparent;
          border: 0;
          color: #667085;
          font: inherit;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 1px;
          min-height: 26px;
          padding: 0 3px;
        }
        .crmHistoryMenu {
          position: relative;
          z-index: 30;
        }
        .crmHistoryMenuList {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 12px 28px rgba(21, 32, 43, 0.14);
          display: grid;
          min-width: 118px;
          padding: 5px;
          position: absolute;
          right: 0;
          top: 28px;
          z-index: 40;
        }
        .crmHistoryMenuList button {
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #1f2937;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          min-height: 30px;
          padding: 0 8px;
          text-align: left;
        }
        .crmHistoryMenuList button:hover {
          background: #f4f6f8;
        }
        .crmHistoryMenuList button:last-child {
          color: #b42318;
        }
        .crmOverdue {
          background: #fee4e2;
          border-radius: 4px;
          color: #b42318;
          display: inline-flex;
          font-size: 10px;
          font-weight: 900;
          margin-top: 5px;
          padding: 2px 6px;
          text-transform: uppercase;
        }
        .crmHistoryMeta {
          align-items: center;
          color: #667085;
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 700;
          gap: 6px;
          padding: 0 14px 13px;
        }
        .crmHistoryMeta span:not(:last-child)::after {
          color: #98a2b3;
          content: "·";
          margin-left: 6px;
        }
        .crmHistoryNote {
          background: #fff6d7;
          border-radius: 0 0 8px 8px;
          border-top: 1px solid #eadfba;
          color: #242a31;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          margin: 0;
          padding: 13px 14px;
        }
        .crmError {
          color: #b42318;
          margin: 0;
        }
        .crmModalBackdrop {
          align-items: center;
          background: rgba(15, 23, 42, 0.52);
          bottom: 0;
          display: flex;
          justify-content: center;
          left: 0;
          padding: 24px;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 80;
        }
        .crmActivityModal {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          display: grid;
          gap: 16px;
          max-height: calc(100vh - 48px);
          max-width: 860px;
          overflow: auto;
          padding: 18px;
          width: min(860px, 100%);
        }
        .crmActivityModal header {
          align-items: start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }
        .crmActivityModal header p {
          color: #216e63;
          font-size: 13px;
          font-weight: 900;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .crmActivityModal header h2 {
          margin: 0;
        }
        .crmActivityModal header > button {
          background: #f4f6f8;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #1f2937;
          font-size: 28px;
          height: 42px;
          line-height: 1;
          width: 42px;
        }
        .crmModalActions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .crmModalActions button {
          border-radius: 8px;
          font-weight: 800;
          min-height: 44px;
          padding: 0 16px;
        }
        .crmModalActions button:first-child {
          background: #ffffff;
          border: 1px solid #d8dee7;
          color: #1f2937;
        }
        .crmModalActions button:last-child {
          background: #216e63;
          border: 0;
          color: #ffffff;
        }
        .crmModalActions button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        @media (max-width: 1000px) {
          .crmContactGrid,
          .crmContactHeader,
          .crmFormRow,
          .crmTabs {
            grid-template-columns: 1fr;
          }
          .crmHistoryRow {
            grid-template-columns: 1fr;
          }
          .crmHistoryRow::before {
            display: none;
          }
          .crmHistoryCheck {
            height: 42px;
            width: 42px;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
