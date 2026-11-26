import CrmLayout from "@/components/crm/CrmLayout";
import { PARTNER_CATEGORIES, partnerCategoryLabel } from "@/components/crm/partnerCategories";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Firmy partnerskie, którym przekazujemy dane klientów (biura na wybrzeżach, umeblowanie, zarządzanie najmem…)
type Partner = {
  id: string;
  name: string;
  category: string;
  region: string | null;
  contact: string | null;
  role: "administrator" | "processor";
  clause_accepted_at: string | null;
  clause_note: string | null;
  archived: boolean;
};

const empty = {
  id: "",
  name: "",
  category: "biuro",
  region: "",
  contact: "",
  role: "administrator" as Partner["role"],
  clauseAcceptedAt: "",
  clauseNote: "",
  archived: false,
};

export default function CrmPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<typeof empty | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const api = useCallback(async (init?: RequestInit) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch("/api/crm/partners", {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Błąd.");
    return result;
  }, []);

  const load = useCallback(async () => {
    try {
      setPartners((await api()).partners || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!form) return;
    setBusy(true);
    setError("");
    try {
      await api({ method: form.id ? "PATCH" : "POST", body: JSON.stringify(form) });
      setForm(null);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Błąd.");
    } finally {
      setBusy(false);
    }
  }

  const visible = partners.filter((partner) => showArchived || !partner.archived);

  return (
    <CrmLayout active="partners">
      <section className="ptPage">
        <header className="ptHeader">
          <Link href="/crm">← Wróć do lejka</Link>
          <h1>Partnerzy</h1>
          <p>
            Firmy, którym przekazujemy dane klientów (biura na wybrzeżach, umeblowanie, zarządzanie najmem, prawnicy…). Przed
            pierwszym przekazaniem wyślij partnerowi klauzulę ochrony danych i odnotuj tu datę jej potwierdzenia. Każde przekazanie
            danych konkretnego klienta odnotowuje się w jego karcie („Przekazania danych”).
          </p>
        </header>

        {error ? <p className="ptError">{error}</p> : null}

        <div className="ptToolbar">
          <button className="primary" type="button" onClick={() => setForm({ ...empty })}>
            + Dodaj partnera
          </button>
          <label>
            <input checked={showArchived} type="checkbox" onChange={(event) => setShowArchived(event.target.checked)} />
            Pokaż zarchiwizowanych
          </label>
        </div>

        {form ? (
          <div className="ptCard ptForm">
            <h2>{form.id ? "Edycja partnera" : "Nowy partner"}</h2>
            <div className="ptGrid">
              <label>
                <span>Nazwa firmy</span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                <span>Rodzaj</span>
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  {PARTNER_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Region / wybrzeże</span>
                <input
                  placeholder="np. Costa Blanca"
                  value={form.region}
                  onChange={(event) => setForm({ ...form, region: event.target.value })}
                />
              </label>
              <label>
                <span>Kontakt (osoba, e-mail, telefon)</span>
                <input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} />
              </label>
              <label>
                <span>Rola wobec danych</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value as Partner["role"] })}
                >
                  <option value="administrator">Samodzielny administrator (ma własny kontakt z klientem) – typowe</option>
                  <option value="processor">Przetwarza na nasze zlecenie (bez własnego kontaktu z klientem) – umowa powierzenia</option>
                </select>
              </label>
              <label>
                <span>Klauzula ochrony danych potwierdzona (data)</span>
                <input
                  type="date"
                  value={form.clauseAcceptedAt}
                  onChange={(event) => setForm({ ...form, clauseAcceptedAt: event.target.value })}
                />
              </label>
              <label className="ptWide">
                <span>Notatka (np. „potwierdzone mailem od …”, „podpisana umowa z …”)</span>
                <input value={form.clauseNote} onChange={(event) => setForm({ ...form, clauseNote: event.target.value })} />
              </label>
              {form.id ? (
                <label className="ptCheck">
                  <input checked={form.archived} type="checkbox" onChange={(event) => setForm({ ...form, archived: event.target.checked })} />
                  Zarchiwizuj (nie współpracujemy już)
                </label>
              ) : null}
            </div>
            <div className="ptActions">
              <button type="button" onClick={() => setForm(null)}>
                Anuluj
              </button>
              <button className="primary" disabled={busy || !form.name.trim()} type="button" onClick={save}>
                Zapisz
              </button>
            </div>
          </div>
        ) : null}

        <div className="ptCard">
          {visible.length ? (
            <ul className="ptList">
              {visible.map((partner) => (
                <li key={partner.id} className={partner.archived ? "archived" : ""}>
                  <div>
                    <strong>{partner.name}</strong>
                    <small>
                      {partnerCategoryLabel(partner.category)}
                      {partner.region ? ` · ${partner.region}` : ""}
                      {partner.contact ? ` · ${partner.contact}` : ""}
                    </small>
                  </div>
                  <span className={`ptBadge ${partner.clause_accepted_at ? "ok" : "missing"}`}>
                    {partner.clause_accepted_at ? `klauzula ✓ ${partner.clause_accepted_at}` : "brak klauzuli"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        id: partner.id,
                        name: partner.name,
                        category: partner.category,
                        region: partner.region || "",
                        contact: partner.contact || "",
                        role: partner.role,
                        clauseAcceptedAt: partner.clause_accepted_at || "",
                        clauseNote: partner.clause_note || "",
                        archived: partner.archived,
                      })
                    }
                  >
                    Edytuj
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ptMuted">Nie dodano jeszcze żadnych partnerów.</p>
          )}
        </div>
      </section>
      <style jsx>{`
        .ptPage {
          align-content: start;
          background: #f7f7f8;
          color: #21232c;
          display: grid;
          gap: 14px;
          min-height: 100vh;
          padding: 22px clamp(12px, 4vw, 40px) 60px;
        }
        .ptHeader,
        .ptCard,
        .ptToolbar,
        .ptError {
          max-width: 860px;
          width: 100%;
        }
        .ptHeader {
          display: grid;
          gap: 6px;
        }
        .ptHeader :global(a) {
          color: #3c61c4;
          font-size: 13px;
          text-decoration: none;
        }
        .ptHeader h1 {
          font-size: 24px;
          margin: 4px 0 0;
        }
        .ptHeader p,
        .ptMuted {
          color: #5b5f66;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }
        .ptError {
          background: #fdeeee;
          border-radius: 8px;
          color: #a83434;
          margin: 0;
          padding: 10px 12px;
        }
        .ptToolbar {
          align-items: center;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }
        .ptToolbar label,
        .ptCheck {
          align-items: center;
          display: flex;
          font-size: 13px;
          gap: 6px;
        }
        .ptCard {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          display: grid;
          gap: 12px;
          padding: 16px 18px;
        }
        .ptCard h2 {
          font-size: 16px;
          margin: 0;
        }
        .ptGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .ptGrid label:not(.ptCheck) {
          display: grid;
          gap: 5px;
        }
        .ptGrid span {
          color: #5b5f66;
          font-size: 12px;
          font-weight: 600;
        }
        .ptWide {
          grid-column: 1 / -1;
        }
        .ptGrid input:not([type="checkbox"]),
        .ptGrid select {
          border: 1px solid #d5d9de;
          border-radius: 6px;
          font: inherit;
          font-size: 13px;
          min-height: 36px;
          padding: 0 10px;
        }
        .ptActions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        button {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          min-height: 36px;
          padding: 0 14px;
        }
        button.primary {
          background: #2f9e62;
          border-color: #2f9e62;
          color: #ffffff;
        }
        button:disabled {
          opacity: 0.55;
        }
        .ptList {
          display: grid;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ptList li {
          align-items: center;
          border-top: 1px solid #eef0f2;
          display: grid;
          gap: 10px;
          grid-template-columns: minmax(0, 1fr) auto auto;
          padding: 10px 0;
        }
        .ptList li:first-child {
          border-top: 0;
        }
        .ptList li.archived {
          opacity: 0.5;
        }
        .ptList li div {
          display: grid;
        }
        .ptList small {
          color: #747678;
          font-size: 12px;
        }
        .ptBadge {
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          white-space: nowrap;
        }
        .ptBadge.ok {
          background: #e6f6ec;
          color: #1f7a48;
        }
        .ptBadge.missing {
          background: #fff4d6;
          color: #8a6100;
        }
        @media (max-width: 700px) {
          .ptGrid {
            grid-template-columns: 1fr;
          }
          .ptList li {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
