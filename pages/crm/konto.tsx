import CrmLayout from "@/components/crm/CrmLayout";
import CrmPushToggle from "@/components/crm/CrmPushToggle";
import {
  CrmNotificationSettings,
  reminderLeadLabel,
  reminderLeadOptions,
} from "@/components/crm/notificationSettings";
import { crmActivityTypes } from "@/components/crm/types";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

// Moje konto: ustawienia powiadomień push – osobne dla każdej osoby.
export default function CRMAccountPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [settings, setSettings] = useState<CrmNotificationSettings | null>(null);
  const [saved, setSaved] = useState<CrmNotificationSettings | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function api(init?: RequestInit) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch("/api/crm/settings", {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Nie udało się pobrać ustawień.");
    return result;
  }

  useEffect(() => {
    api()
      .then((result) => {
        setUser(result.user);
        setSettings(result.settings);
        setSaved(result.settings);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Błąd."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);

  async function save() {
    if (!settings) return;
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await api({ method: "PUT", body: JSON.stringify({ settings }) });
      setSettings(result.settings);
      setSaved(result.settings);
      setMessage("Zapisano ustawienia.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Nie udało się zapisać.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateReminder(type: string, patch: Partial<{ enabled: boolean; minutesBefore: number }>) {
    setSettings((current) =>
      current
        ? { ...current, reminders: { ...current.reminders, [type]: { ...current.reminders[type], ...patch } } }
        : current,
    );
  }

  return (
    <CrmLayout active="account">
      <section className="crmAccountPage">
        <header className="crmAccountHeader">
          <Link href="/crm">← Wróć do lejka</Link>
          <h1>Moje konto</h1>
          {user ? (
            <p>
              <strong>{user.name}</strong> · {user.email}
            </p>
          ) : null}
        </header>

        {error ? <p className="crmAccountError">{error}</p> : null}

        <div className="crmAccountCard">
          <CrmPushToggle inline />
        </div>

        {settings ? (
          <>
            <div className="crmAccountCard">
              <h2>Poranne podsumowanie dnia</h2>
              <p className="crmAccountHint">Powiadomienie z liczbą zadań na dziś i zaległych.</p>
              <div className="crmAccountRow">
                <label className="crmSwitch">
                  <input
                    checked={settings.summary.enabled}
                    type="checkbox"
                    onChange={(event) =>
                      setSettings({ ...settings, summary: { ...settings.summary, enabled: event.target.checked } })
                    }
                  />
                  Wysyłaj codziennie o godzinie
                </label>
                <input
                  className="crmTimeInput"
                  disabled={!settings.summary.enabled}
                  type="time"
                  value={settings.summary.time}
                  onChange={(event) =>
                    setSettings({ ...settings, summary: { ...settings.summary, time: event.target.value } })
                  }
                />
              </div>
            </div>

            <div className="crmAccountCard">
              <h2>Przypomnienia o zadaniach</h2>
              <p className="crmAccountHint">
                Dla każdego rodzaju zadania wybierz, czy chcesz przypomnienie i jak wcześnie. Dotyczy zadań z
                ustawioną godziną (zadania bez godziny są w porannym podsumowaniu).
              </p>
              <div className="crmReminderList">
                {crmActivityTypes.map((type) => {
                  const reminder = settings.reminders[type];
                  return (
                    <div className="crmReminderRow" key={type}>
                      <label className="crmSwitch">
                        <input
                          checked={reminder.enabled}
                          type="checkbox"
                          onChange={(event) => updateReminder(type, { enabled: event.target.checked })}
                        />
                        {type}
                      </label>
                      <select
                        disabled={!reminder.enabled}
                        value={reminder.minutesBefore}
                        onChange={(event) => updateReminder(type, { minutesBefore: Number(event.target.value) })}
                      >
                        {reminderLeadOptions.map((minutes) => (
                          <option key={minutes} value={minutes}>
                            {reminderLeadLabel(minutes)}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="crmAccountCard">
              <h2>Aktywność klientów w prezentacjach</h2>
              <p className="crmAccountHint">Dotyczy klientów powiązanych z prezentacją w CRM.</p>
              <div className="crmReminderList">
                <label className="crmSwitch">
                  <input
                    checked={settings.presentation.open}
                    type="checkbox"
                    onChange={(event) =>
                      setSettings({ ...settings, presentation: { ...settings.presentation, open: event.target.checked } })
                    }
                  />
                  Klient otworzył prezentację
                </label>
                <label className="crmSwitch">
                  <input
                    checked={settings.presentation.offerView}
                    type="checkbox"
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        presentation: { ...settings.presentation, offerView: event.target.checked },
                      })
                    }
                  />
                  Klient obejrzał ofertę
                </label>
                <label className="crmSwitch">
                  <input
                    checked={settings.presentation.interest}
                    type="checkbox"
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        presentation: { ...settings.presentation, interest: event.target.checked },
                      })
                    }
                  />
                  Klient kliknął „Interesuje mnie ta oferta” 🔥
                </label>
              </div>
            </div>

            <div className="crmAccountSave">
              {message ? <span className="ok">{message}</span> : null}
              <button disabled={!isDirty || isSaving} type="button" onClick={save}>
                {isSaving ? "Zapisywanie…" : "Zapisz ustawienia"}
              </button>
            </div>
          </>
        ) : !error ? (
          <p className="crmAccountHint">Ładowanie ustawień…</p>
        ) : null}
      </section>
      <style jsx>{`
        .crmAccountPage {
          background: #f7f7f8;
          color: #21232c;
          display: grid;
          align-content: start;
          gap: 14px;
          min-height: 100vh;
          padding: 22px clamp(12px, 4vw, 40px) 40px;
        }
        .crmAccountHeader {
          display: grid;
          gap: 4px;
          max-width: 720px;
        }
        .crmAccountHeader :global(a) {
          color: #3c61c4;
          font-size: 13px;
          text-decoration: none;
        }
        .crmAccountHeader h1 {
          font-size: 24px;
          margin: 4px 0 0;
        }
        .crmAccountHeader p {
          color: #5b5f66;
          font-size: 14px;
          margin: 0;
        }
        .crmAccountCard {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          display: grid;
          gap: 10px;
          max-width: 720px;
          padding: 16px 18px;
        }
        .crmAccountCard h2 {
          font-size: 16px;
          margin: 0;
        }
        .crmAccountHint {
          color: #747678;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }
        .crmAccountRow,
        .crmReminderRow {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
        }
        .crmReminderList {
          display: grid;
          gap: 4px;
        }
        .crmReminderRow {
          border-bottom: 1px solid #f0f1f3;
          padding: 6px 0;
        }
        .crmSwitch {
          align-items: center;
          cursor: pointer;
          display: flex;
          font-size: 14px;
          gap: 10px;
          padding: 4px 0;
        }
        .crmSwitch input {
          accent-color: #216e63;
          height: 18px;
          width: 18px;
        }
        .crmTimeInput,
        .crmReminderRow select {
          background: #ffffff;
          border: 1px solid #c6c8cc;
          border-radius: 6px;
          font: inherit;
          font-size: 14px;
          min-height: 36px;
          padding: 0 10px;
        }
        .crmReminderRow select {
          min-width: 150px;
        }
        .crmTimeInput:disabled,
        .crmReminderRow select:disabled {
          opacity: 0.45;
        }
        .crmAccountSave {
          align-items: center;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          max-width: 720px;
        }
        .crmAccountSave .ok {
          color: #08a742;
          font-size: 13px;
          font-weight: 600;
        }
        .crmAccountSave button {
          background: #216e63;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          min-height: 42px;
          padding: 0 20px;
        }
        .crmAccountSave button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .crmAccountError {
          color: #b42318;
          margin: 0;
        }
      `}</style>
    </CrmLayout>
  );
}
