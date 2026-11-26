import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";

// Zgody klienta w karcie CRM: aktualny stan (SMS, telefon, śledzenie ofert), źródło i data, historia
// oraz ręczne odnotowanie wycofania/udzielenia zgody (np. klient powiedział to przez telefon).

type Entry = { granted: boolean; at: string; source: string; wording: string | null; recordedBy: string | null };
type HistoryRow = { id: string; kind: string; granted: boolean; source: string; wording: string | null; recorded_by: string | null; created_at: string };

const KINDS: Array<{ key: "sms" | "phone" | "tracking"; label: string }> = [
  { key: "phone", label: "Kontakt telefoniczny" },
  { key: "sms", label: "SMS z ofertami" },
  { key: "tracking", label: "Zapisywanie oglądanych ofert" },
];
const SOURCES: Record<string, string> = {
  meta_form: "formularz Facebook",
  chat: "czat ofertowy",
  presentation: "strona prezentacji",
  crm_manual: "odnotowane w CRM",
  diagnostic: "lead testowy",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

export default function CrmConsentPanel({ contactId }: { contactId: string }) {
  const [state, setState] = useState<Partial<Record<string, Entry>>>({});
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ kind: string; granted: boolean } | null>(null);
  const [note, setNote] = useState("");

  const api = useCallback(async (init?: RequestInit) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch(init ? "/api/crm/consents" : `/api/crm/consents?contactId=${encodeURIComponent(contactId)}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Błąd zgód.");
    return result;
  }, [contactId]);

  const load = useCallback(async () => {
    try {
      const result = await api();
      setState(result.state || {});
      setHistory(result.history || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    }
  }, [api]);

  useEffect(() => {
    if (contactId) load();
  }, [contactId, load]);

  async function change(kind: string, granted: boolean) {
    setBusy(kind);
    try {
      await api({ method: "POST", body: JSON.stringify({ contactId, kind, granted, note }) });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    } finally {
      setBusy("");
      setEditing(null);
      setNote("");
    }
  }

  return (
    <div className="consentPanel">
      {KINDS.map(({ key, label }) => {
        const entry = state[key];
        const status = !entry ? "none" : entry.granted ? "yes" : "no";
        return (
          <div className="consentRow" key={key}>
            <span className={`consentDot ${status}`} aria-hidden="true" />
            <div className="consentText">
              <strong>{label}</strong>
              <small>
                {!entry
                  ? "brak informacji o zgodzie"
                  : `${entry.granted ? "zgoda" : "brak zgody / wycofana"} · ${SOURCES[entry.source] || entry.source} · ${formatDate(entry.at)}`}
              </small>
            </div>
            <button
              disabled={busy === key}
              type="button"
              onClick={() => {
                setEditing({ kind: key, granted: !(entry?.granted ?? false) });
                setNote("");
              }}
            >
              {entry?.granted ? "Wycofaj" : "Odnotuj zgodę"}
            </button>
            {editing?.kind === key ? (
              <div className="consentEdit">
                <input
                  autoFocus
                  placeholder={editing.granted ? "Skąd zgoda? np. telefonicznie 26.11" : "Okoliczności, np. telefonicznie 26.11"}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <button type="button" onClick={() => setEditing(null)}>
                  Anuluj
                </button>
                <button className="primary" disabled={busy === key} type="button" onClick={() => change(key, editing.granted)}>
                  {editing.granted ? "Zapisz zgodę" : "Zapisz wycofanie"}
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
      {history.length ? (
        <button className="consentHistoryToggle" type="button" onClick={() => setShowHistory((current) => !current)}>
          {showHistory ? "Ukryj historię zgód" : `Historia zgód (${history.length})`}
        </button>
      ) : null}
      {showHistory ? (
        <ul className="consentHistory">
          {history.map((row) => (
            <li key={row.id}>
              <b>{KINDS.find((item) => item.key === row.kind)?.label || row.kind}</b>: {row.granted ? "zgoda" : "brak / wycofanie"} ·{" "}
              {SOURCES[row.source] || row.source} · {formatDate(row.created_at)}
              {row.recorded_by ? ` · ${row.recorded_by}` : ""}
              {row.wording ? <em>{row.wording}</em> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="consentError">{error}</p> : null}
      <style jsx>{`
        .consentPanel {
          display: grid;
          gap: 8px;
        }
        .consentRow {
          align-items: center;
          display: grid;
          gap: 8px;
          grid-template-columns: 10px minmax(0, 1fr) auto;
        }
        .consentDot {
          background: #c7cdd4;
          border-radius: 999px;
          height: 9px;
          width: 9px;
        }
        .consentDot.yes {
          background: #2f9e62;
        }
        .consentDot.no {
          background: #c94a4a;
        }
        .consentText {
          display: grid;
          min-width: 0;
        }
        .consentText strong {
          font-size: 12.5px;
        }
        .consentText small {
          color: #747678;
          font-size: 11px;
        }
        .consentRow button,
        .consentHistoryToggle {
          background: transparent;
          border: 0;
          color: #3c61c4;
          cursor: pointer;
          font: inherit;
          font-size: 11.5px;
          font-weight: 600;
          padding: 0;
          white-space: nowrap;
        }
        .consentHistoryToggle {
          justify-self: start;
        }
        .consentEdit {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          grid-column: 2 / -1;
        }
        .consentEdit input {
          border: 1px solid #d5d9de;
          border-radius: 6px;
          flex: 1 1 100%;
          font: inherit;
          font-size: 12px;
          padding: 6px 8px;
        }
        .consentEdit button {
          border: 1px solid #d5d9de !important;
          border-radius: 6px;
          color: #21232c !important;
          padding: 4px 10px !important;
        }
        .consentEdit button.primary {
          background: #2f9e62;
          border-color: #2f9e62 !important;
          color: #ffffff !important;
        }
        .consentHistory {
          display: grid;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .consentHistory li {
          color: #3b3f45;
          font-size: 11.5px;
          line-height: 1.4;
        }
        .consentHistory em {
          color: #747678;
          display: block;
          font-style: normal;
        }
        .consentError {
          color: #c0392b;
          font-size: 12px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
