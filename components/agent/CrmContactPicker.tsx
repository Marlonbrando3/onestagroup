import { useEffect, useRef, useState } from "react";
import { FaLink, FaTimes } from "react-icons/fa";

export type PickedCrmContact = { id: string; name: string };

type SearchResult = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  ownerLabel: string;
};

type Props = {
  accessToken: string;
  value: PickedCrmContact | null;
  onChange: (value: PickedCrmContact | null) => void;
};

// Skojarzenie prezentacji z klientem (szansą sprzedaży) w CRM.
export default function CrmContactPicker({ accessToken, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !accessToken) return;
    let ignore = false;
    setIsLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/crm/contact-search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const payload = await response.json();
        if (!ignore) setResults(response.ok ? payload.contacts || [] : []);
      } catch {
        if (!ignore) setResults([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, 220);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [accessToken, isOpen, query]);

  useEffect(() => {
    if (!isOpen) return;
    function close(event: PointerEvent) {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isOpen]);

  return (
    <div className="grid gap-2 text-[11px] font-bold text-[#334155]" ref={wrapperRef}>
      <span>Klient w CRM (szansa sprzedaży)</span>
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#b8d7d0] bg-[#eef6f3] px-3 py-3">
          <span className="flex min-w-0 items-center gap-2">
            <FaLink aria-hidden="true" className="shrink-0 text-[11px] text-[#216e63]" />
            <a
              className="truncate text-[12px] font-extrabold text-[#155149] underline-offset-2 hover:underline"
              href={`/crm/kontakt/${value.id}`}
              rel="noreferrer"
              target="_blank"
            >
              {value.name}
            </a>
          </span>
          <button
            aria-label="Odłącz klienta CRM"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#5b6b7d] hover:bg-white hover:text-red-600"
            title="Odłącz"
            type="button"
            onClick={() => onChange(null)}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            className="presentationInput"
            placeholder="Szukaj klienta: imię, nazwisko, telefon…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {isOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[300px] overflow-y-auto rounded-xl border border-[#d9d0c4] bg-white p-1 shadow-[0_16px_40px_rgba(24,35,52,0.16)]">
              {isLoading && !results.length ? (
                <p className="px-3 py-3 text-[11px] font-semibold text-slate-500">Szukam…</p>
              ) : results.length ? (
                results.map((contact) => (
                  <button
                    className="grid w-full gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-[#f5f1ea]"
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      onChange({ id: contact.id, name: contact.name });
                      setQuery("");
                      setIsOpen(false);
                    }}
                  >
                    <strong className="truncate text-[12px] text-[#182334]">{contact.name}</strong>
                    <span className="truncate text-[10px] font-semibold text-slate-500">
                      {[contact.phone || contact.email, contact.status, contact.ownerLabel].filter(Boolean).join(" · ")}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-[11px] font-semibold text-slate-500">Nie znaleziono klienta w CRM.</p>
              )}
            </div>
          ) : null}
        </div>
      )}
      <span className="text-[9px] font-medium leading-4 text-slate-400">
        Po skojarzeniu otwarcia prezentacji, kliknięte oferty i „Interesuje mnie” trafią do historii klienta w CRM.
      </span>
    </div>
  );
}
