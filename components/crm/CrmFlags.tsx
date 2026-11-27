import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeCrmEmail, isCrmAdmin } from "./users";
import type { CrmFlag } from "./types";

// Paleta kolorów flag – wszystkie dość ciemne, żeby biały napis był czytelny.
export const CRM_FLAG_PALETTE = [
  "#d63b3b",
  "#d9622b",
  "#b7791f",
  "#1f9d55",
  "#0f8a80",
  "#2f6fdb",
  "#5b4fd8",
  "#c2418f",
  "#5b6472",
  "#8a5a2b",
];

async function getAuth() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  return { headers: { Authorization: `Bearer ${token}` }, email: normalizeCrmEmail(data.session?.user?.email) };
}

// Katalog flag współdzielony między komponentami na stronie (lejek, karta klienta).
let flagCache: CrmFlag[] | null = null;

export function useCrmFlags() {
  const [flags, setFlags] = useState<CrmFlag[]>(flagCache || []);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const auth = await getAuth();
    if (!auth) return;
    setUserEmail(auth.email);
    const response = await fetch("/api/crm/flags", { headers: auth.headers });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Nie udało się pobrać flag.");
      return;
    }
    flagCache = result.flags || [];
    setFlags(flagCache || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createFlag(label: string, color: string) {
    const auth = await getAuth();
    if (!auth) return null;
    const response = await fetch("/api/crm/flags", {
      method: "POST",
      headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ label, color }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Nie udało się dodać flagi.");
      return null;
    }
    flagCache = [...(flagCache || flags), result.flag];
    setFlags(flagCache);
    setError("");
    return result.flag as CrmFlag;
  }

  async function deleteFlag(id: string) {
    const auth = await getAuth();
    if (!auth) return false;
    const response = await fetch("/api/crm/flags", {
      method: "DELETE",
      headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Nie udało się usunąć flagi.");
      return false;
    }
    flagCache = (flagCache || flags).filter((flag) => flag.id !== id);
    setFlags(flagCache);
    return true;
  }

  return { flags, userEmail, error, createFlag, deleteFlag, reload: load };
}

function FlagIcon({ size = 11 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 21V4h11.5l-1.6 4 1.6 4H7v9H5Z" />
    </svg>
  );
}

// Flagi na kafelku w lejku / w nagłówku karty (tylko do odczytu).
export function CrmFlagChips({
  flags,
  flagIds,
  max = 3,
}: {
  flags: CrmFlag[];
  flagIds?: string[];
  max?: number;
}) {
  const assigned = (flagIds || [])
    .map((id) => flags.find((flag) => flag.id === id))
    .filter(Boolean) as CrmFlag[];
  if (!assigned.length) return null;
  const visible = assigned.slice(0, max);
  const hidden = assigned.length - visible.length;
  return (
    <span className="crmFlagChips">
      {visible.map((flag) => (
        <span className="crmFlagChip" key={flag.id} style={{ background: flag.color }} title={flag.label}>
          <FlagIcon size={9} />
          <span>{flag.label}</span>
        </span>
      ))}
      {hidden > 0 ? (
        <span className="crmFlagChip more" title={assigned.slice(max).map((flag) => flag.label).join(", ")}>
          +{hidden}
        </span>
      ) : null}
      <style jsx>{`
        .crmFlagChips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          min-width: 0;
        }
        .crmFlagChip {
          align-items: center;
          border-radius: 4px;
          color: #ffffff;
          display: inline-flex;
          font-size: 10.5px;
          font-weight: 600;
          gap: 4px;
          line-height: 1;
          max-width: 100%;
          padding: 3px 6px;
        }
        .crmFlagChip span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .crmFlagChip.more {
          background: #e7eaee;
          color: #4b5563;
        }
      `}</style>
    </span>
  );
}

// Flagi + „Wysoki potencjał” na karcie klienta: przypinanie, tworzenie własnych flag z paletą kolorów.
export function CrmFlagPicker({
  flagIds,
  highPotential,
  onChangeFlags,
  onToggleHighPotential,
}: {
  flagIds: string[];
  highPotential: boolean;
  onChangeFlags: (flagIds: string[]) => void;
  onToggleHighPotential: (value: boolean) => void;
}) {
  const { flags, userEmail, error, createFlag, deleteFlag } = useCrmFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(CRM_FLAG_PALETTE[5]);
  const [isSaving, setIsSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const assigned = flagIds
    .map((id) => flags.find((flag) => flag.id === id))
    .filter(Boolean) as CrmFlag[];
  // Do wyboru: flagi podstawowe, moje i te już przypięte do tego rekordu (np. przez kogoś innego).
  const selectable = flags.filter(
    (flag) => flag.isSystem || flag.ownerEmail === userEmail || flagIds.includes(flag.id),
  );
  const canDelete = (flag: CrmFlag) => !flag.isSystem && (flag.ownerEmail === userEmail || isCrmAdmin(userEmail));

  function toggle(id: string) {
    onChangeFlags(flagIds.includes(id) ? flagIds.filter((item) => item !== id) : [...flagIds, id]);
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const label = newLabel.trim();
    if (!label || isSaving) return;
    setIsSaving(true);
    const flag = await createFlag(label, newColor);
    setIsSaving(false);
    if (flag) {
      setNewLabel("");
      onChangeFlags([...flagIds, flag.id]);
    }
  }

  return (
    <div className="crmFlagBar" ref={rootRef}>
      <button
        aria-pressed={highPotential}
        className={`crmPotentialToggle ${highPotential ? "on" : ""}`}
        title={highPotential ? "Zdejmij oznaczenie „Wysoki potencjał”" : "Oznacz jako „Wysoki potencjał”"}
        type="button"
        onClick={() => onToggleHighPotential(!highPotential)}
      >
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill={highPotential ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </svg>
        Wysoki potencjał
      </button>

      {assigned.map((flag) => (
        <span className="crmFlagTag" key={flag.id} style={{ background: flag.color }}>
          <FlagIcon />
          {flag.label}
          <button aria-label={`Zdejmij flagę ${flag.label}`} type="button" onClick={() => toggle(flag.id)}>
            ×
          </button>
        </span>
      ))}

      <button
        aria-expanded={isOpen}
        className="crmFlagAdd"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
      >
        <FlagIcon />
        {assigned.length ? "Flagi" : "Dodaj flagę"}
      </button>

      {isOpen ? (
        <div className="crmFlagPopover" role="dialog" aria-label="Flagi rekordu">
          <p className="crmFlagPopoverTitle">Flagi</p>
          <ul>
            {selectable.map((flag) => {
              const checked = flagIds.includes(flag.id);
              return (
                <li key={flag.id}>
                  <button className="crmFlagOption" type="button" onClick={() => toggle(flag.id)}>
                    <span className={`crmFlagCheck ${checked ? "on" : ""}`} style={checked ? { background: flag.color, borderColor: flag.color } : { borderColor: flag.color }}>
                      {checked ? "✓" : ""}
                    </span>
                    <span className="crmFlagDot" style={{ background: flag.color }} />
                    <span className="crmFlagOptionLabel">{flag.label}</span>
                    {flag.isSystem ? <small>podstawowa</small> : null}
                  </button>
                  {canDelete(flag) ? (
                    <button
                      aria-label={`Usuń flagę ${flag.label}`}
                      className="crmFlagDelete"
                      title="Usuń flagę (zniknie ze wszystkich rekordów)"
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Usunąć flagę „${flag.label}” ze wszystkich rekordów?`)) {
                          deleteFlag(flag.id).then((ok) => {
                            if (ok && flagIds.includes(flag.id)) onChangeFlags(flagIds.filter((id) => id !== flag.id));
                          });
                        }
                      }}
                    >
                      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                      </svg>
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <form className="crmFlagNew" onSubmit={handleCreate}>
            <label htmlFor="crm-flag-new">Nowa flaga</label>
            <div className="crmFlagNewRow">
              <input
                id="crm-flag-new"
                maxLength={40}
                placeholder="np. Kredyt w toku"
                value={newLabel}
                onChange={(event) => setNewLabel(event.target.value)}
              />
              <button disabled={!newLabel.trim() || isSaving} type="submit">
                Dodaj
              </button>
            </div>
            <div className="crmFlagPalette" role="radiogroup" aria-label="Kolor flagi">
              {CRM_FLAG_PALETTE.map((color) => (
                <button
                  aria-checked={newColor === color}
                  aria-label={`Kolor ${color}`}
                  className={newColor === color ? "on" : ""}
                  key={color}
                  role="radio"
                  style={{ background: color }}
                  type="button"
                  onClick={() => setNewColor(color)}
                />
              ))}
            </div>
            {newLabel.trim() ? (
              <span className="crmFlagPreview" style={{ background: newColor }}>
                <FlagIcon />
                {newLabel.trim()}
              </span>
            ) : null}
          </form>
          {error ? <p className="crmFlagError">{error}</p> : null}
        </div>
      ) : null}

      <style jsx>{`
        .crmFlagBar {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
          position: relative;
        }
        .crmPotentialToggle,
        .crmFlagAdd {
          align-items: center;
          background: #ffffff;
          border: 1px solid #d5d9df;
          border-radius: 999px;
          color: #4b5563;
          cursor: pointer;
          display: inline-flex;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
          height: 28px;
          padding: 0 11px;
        }
        .crmPotentialToggle:hover,
        .crmFlagAdd:hover {
          border-color: #9aa3ae;
          color: #21232c;
        }
        .crmPotentialToggle.on {
          background: #e6f6ec;
          border-color: #7fcb9c;
          color: #17723d;
        }
        .crmFlagTag {
          align-items: center;
          border-radius: 999px;
          color: #ffffff;
          display: inline-flex;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
          height: 28px;
          padding: 0 6px 0 11px;
        }
        .crmFlagTag button {
          background: rgba(255, 255, 255, 0.22);
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          font-size: 14px;
          height: 18px;
          line-height: 1;
          padding: 0;
          width: 18px;
        }
        .crmFlagTag button:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .crmFlagPopover {
          background: #ffffff;
          border: 1px solid #dcdfe4;
          border-radius: 8px;
          box-shadow: 0 12px 32px rgba(21, 32, 43, 0.16);
          left: 0;
          padding: 12px;
          position: absolute;
          top: calc(100% + 6px);
          width: 290px;
          z-index: 40;
        }
        .crmFlagPopoverTitle {
          color: #747678;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin: 0 0 6px;
          text-transform: uppercase;
        }
        .crmFlagPopover ul {
          list-style: none;
          margin: 0 0 10px;
          max-height: 220px;
          overflow-y: auto;
          padding: 0;
        }
        .crmFlagPopover li {
          align-items: center;
          display: flex;
        }
        .crmFlagOption {
          align-items: center;
          background: none;
          border: 0;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          display: flex;
          flex: 1;
          font-size: 13px;
          gap: 8px;
          min-width: 0;
          padding: 7px 6px;
          text-align: left;
        }
        .crmFlagOption:hover {
          background: #f3f5f7;
        }
        .crmFlagCheck {
          border: 1.5px solid;
          border-radius: 4px;
          color: #ffffff;
          display: grid;
          flex-shrink: 0;
          font-size: 11px;
          height: 16px;
          place-items: center;
          width: 16px;
        }
        .crmFlagDot {
          border-radius: 2px;
          flex-shrink: 0;
          height: 10px;
          width: 10px;
        }
        .crmFlagOptionLabel {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .crmFlagOption small {
          color: #8a8f96;
          font-size: 11px;
        }
        .crmFlagDelete {
          background: none;
          border: 0;
          border-radius: 6px;
          color: #8a8f96;
          cursor: pointer;
          display: grid;
          height: 28px;
          place-items: center;
          width: 28px;
        }
        .crmFlagDelete:hover {
          background: #fdecec;
          color: #c53030;
        }
        .crmFlagNew {
          border-top: 1px solid #eceef1;
          display: grid;
          gap: 8px;
          padding-top: 10px;
        }
        .crmFlagNew label {
          color: #747678;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .crmFlagNewRow {
          display: flex;
          gap: 6px;
        }
        .crmFlagNewRow input {
          border: 1px solid #d5d9df;
          border-radius: 6px;
          flex: 1;
          font-size: 13px;
          height: 32px;
          min-width: 0;
          padding: 0 9px;
        }
        .crmFlagNewRow button {
          background: #21232c;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 0 12px;
        }
        .crmFlagNewRow button:disabled {
          cursor: default;
          opacity: 0.4;
        }
        .crmFlagPalette {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .crmFlagPalette button {
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 0 1px #d5d9df;
          cursor: pointer;
          height: 22px;
          padding: 0;
          width: 22px;
        }
        .crmFlagPalette button.on {
          box-shadow: 0 0 0 2px #21232c;
        }
        .crmFlagPreview {
          align-items: center;
          border-radius: 999px;
          color: #ffffff;
          display: inline-flex;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
          height: 26px;
          justify-self: start;
          padding: 0 11px;
        }
        .crmFlagError {
          color: #c53030;
          font-size: 12px;
          margin: 8px 0 0;
        }
      `}</style>
    </div>
  );
}
