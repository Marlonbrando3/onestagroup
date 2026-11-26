import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { partnerCategoryLabel } from "./partnerCategories";

// Karta klienta: komu przekazaliśmy jego dane (rejestr przekazań do firm partnerskich).
type Partner = { id: string; name: string; category: string; region: string | null; clause_accepted_at: string | null; archived: boolean };
type Share = {
  id: string;
  created_at: string;
  purpose: string;
  scope: string | null;
  recorded_by: string | null;
  partner: { id: string; name: string; category: string; region: string | null; clause_accepted_at: string | null } | null;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export default function CrmDataSharesPanel({ contactId }: { contactId: string }) {
  const [shares, setShares] = useState<Share[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ partnerId: "", purpose: "", scope: "imię i nazwisko, telefon, e-mail, preferencje", clientInformed: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const api = useCallback(async (url: string, init?: RequestInit) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Błąd.");
    return result;
  }, []);

  const load = useCallback(async () => {
    try {
      const [sharesResult, partnersResult] = await Promise.all([
        api(`/api/crm/data-shares?contactId=${encodeURIComponent(contactId)}`),
        api("/api/crm/partners"),
      ]);
      setShares(sharesResult.shares || []);
      setPartners((partnersResult.partners || []).filter((partner: Partner) => !partner.archived));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    }
  }, [api, contactId]);

  useEffect(() => {
    if (contactId) load();
  }, [contactId, load]);

  const selected = partners.find((partner) => partner.id === form.partnerId);

  async function save() {
    setBusy(true);
    setError("");
    try {
      await api("/api/crm/data-shares", { method: "POST", body: JSON.stringify({ contactId, ...form }) });
      setOpen(false);
      setForm({ partnerId: "", purpose: "", scope: "imię i nazwisko, telefon, e-mail, preferencje", clientInformed: false });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sharePanel">
      {shares.length ? (
        <ul>
          {shares.map((share) => (
            <li key={share.id}>
              <strong>{share.partner?.name || "Partner"}</strong>
              <small>
                {share.purpose} · {formatDate(share.created_at)}
                {share.recorded_by ? ` · ${share.recorded_by}` : ""}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="shareMuted">Dane klienta nie były przekazywane partnerom.</p>
      )}

      {open ? (
        <div className="shareForm">
          <select value={form.partnerId} onChange={(event) => setForm({ ...form, partnerId: event.target.value })}>
            <option value="">Wybierz partnera…</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name} – {partnerCategoryLabel(partner.category)}
                {partner.region ? ` (${partner.region})` : ""}
              </option>
            ))}
          </select>
          {selected && !selected.clause_accepted_at ? (
            <p className="shareWarn">Ten partner nie ma jeszcze potwierdzonej klauzuli ochrony danych – wyślij ją przed przekazaniem.</p>
          ) : null}
          <input
            placeholder="Cel, np. wycena umeblowania apartamentu"
            value={form.purpose}
            onChange={(event) => setForm({ ...form, purpose: event.target.value })}
          />
          <input
            placeholder="Zakres danych"
            value={form.scope}
            onChange={(event) => setForm({ ...form, scope: event.target.value })}
          />
          <label>
            <input
              checked={form.clientInformed}
              type="checkbox"
              onChange={(event) => setForm({ ...form, clientInformed: event.target.checked })}
            />
            Klient wie, komu i po co przekazujemy jego dane (i się zgodził)
          </label>
          <div className="shareActions">
            <button type="button" onClick={() => setOpen(false)}>
              Anuluj
            </button>
            <button className="primary" disabled={busy || !form.partnerId || !form.purpose.trim() || !form.clientInformed} type="button" onClick={save}>
              Zapisz przekazanie
            </button>
          </div>
        </div>
      ) : (
        <div className="shareActions start">
          <button type="button" onClick={() => setOpen(true)}>
            + Odnotuj przekazanie danych
          </button>
          {!partners.length ? <Link href="/crm/partnerzy">Dodaj partnerów</Link> : null}
        </div>
      )}
      {error ? <p className="shareWarn">{error}</p> : null}
      <style jsx>{`
        .sharePanel {
          display: grid;
          gap: 8px;
        }
        ul {
          display: grid;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: grid;
        }
        li strong {
          font-size: 12.5px;
        }
        li small,
        .shareMuted {
          color: #747678;
          font-size: 11.5px;
          margin: 0;
        }
        .shareForm {
          display: grid;
          gap: 6px;
        }
        .shareForm select,
        .shareForm input:not([type="checkbox"]) {
          border: 1px solid #d5d9de;
          border-radius: 6px;
          font: inherit;
          font-size: 12px;
          padding: 7px 8px;
        }
        .shareForm label {
          align-items: flex-start;
          display: flex;
          font-size: 12px;
          gap: 6px;
          line-height: 1.4;
        }
        .shareActions {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .shareActions.start {
          justify-content: space-between;
        }
        .shareActions button,
        .shareActions :global(a) {
          background: transparent;
          border: 0;
          color: #3c61c4;
          cursor: pointer;
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          padding: 0;
          text-decoration: none;
        }
        .shareActions button.primary {
          background: #2f9e62;
          border-radius: 6px;
          color: #ffffff;
          padding: 6px 10px;
        }
        .shareActions button:disabled {
          opacity: 0.5;
        }
        .shareWarn {
          color: #a35b00;
          font-size: 11.5px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
