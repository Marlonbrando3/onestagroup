import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";

// Filtr „Regiony i miasta” w panelu agenta: wiele wybrzeży i wiele miast naraz, checkboxami.
// Zaznaczenie wybrzeża = wszystkie jego oferty. Zaznaczenie miasta = oferty z tego miasta.
// Wybrzeża i miasta jak w menu „Oferty”; w filtrach przechowujemy ich identyfikatory.
export type AgentCoast = { id: string; name: string; count: number; towns: { id: string; name: string; count: number }[] };

type Props = {
  coasts: AgentCoast[];
  regions: string[];
  towns: string[];
  onChange: (next: { regions: string[]; towns: string[] }) => void;
};

const townsLabel = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return "1 miasto";
  return `${n} ${last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? "miasta" : "miast"}`;
};

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function LocationMultiSelect({ coasts, regions, towns, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const q = normalize(query.trim());
  const visible = useMemo(
    () =>
      coasts
        .map((coast) => {
          // Tekst pasuje do nazwy wybrzeża (np. „costa blanca”) → wszystkie jego miasta.
          // W przeciwnym razie szukamy po nazwach miast.
          const coastMatches = !q || normalize(coast.name).includes(q);
          return {
            ...coast,
            towns: coastMatches ? coast.towns : coast.towns.filter((town) => normalize(town.name).includes(q)),
            coastMatches,
          };
        })
        .filter((coast) => coast.coastMatches || coast.towns.length),
    [coasts, q],
  );

  const coastNames = useMemo(() => new Map(coasts.map((coast) => [coast.id, coast.name])), [coasts]);
  const townNames = useMemo(
    () => new Map(coasts.flatMap((coast) => coast.towns.map((town) => [town.id, town.name] as const))),
    [coasts],
  );

  // Zaznaczenie wybrzeża = cały region (wszystkie jego oferty), a jego miasta są wtedy zaznaczone.
  // Odznaczenie jednego miasta przy zaznaczonym wybrzeżu zamienia wybrzeże na pozostałe miasta.
  const toggleRegion = (coast: AgentCoast) => {
    const coastTownIds = coast.towns.map((town) => town.id);
    const withoutCoastTowns = towns.filter((id) => !coastTownIds.includes(id));
    if (regions.includes(coast.id)) {
      onChange({ regions: regions.filter((id) => id !== coast.id), towns: withoutCoastTowns });
    } else {
      onChange({ regions: [...regions, coast.id], towns: withoutCoastTowns });
    }
  };
  const toggleTown = (coast: AgentCoast, townId: string) => {
    if (regions.includes(coast.id)) {
      onChange({
        regions: regions.filter((id) => id !== coast.id),
        towns: [
          ...towns.filter((id) => !coast.towns.some((town) => town.id === id)),
          ...coast.towns.map((town) => town.id).filter((id) => id !== townId),
        ],
      });
      return;
    }
    const nextTowns = towns.includes(townId) ? towns.filter((id) => id !== townId) : [...towns, townId];
    // Wszystkie miasta wybrzeża zaznaczone ręcznie = zaznacz całe wybrzeże.
    if (coast.towns.length > 1 && coast.towns.every((town) => nextTowns.includes(town.id))) {
      onChange({
        regions: [...regions, coast.id],
        towns: nextTowns.filter((id) => !coast.towns.some((town) => town.id === id)),
      });
      return;
    }
    onChange({ regions, towns: nextTowns });
  };
  const toggleExpanded = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const removeRegion = (id: string) => onChange({ regions: regions.filter((item) => item !== id), towns });
  const removeTown = (id: string) => onChange({ regions, towns: towns.filter((item) => item !== id) });

  const selectedCount = regions.length + towns.length;
  const summary = selectedCount
    ? [...regions.map((id) => coastNames.get(id) || id), ...towns.map((id) => townNames.get(id) || id)]
        .slice(0, 2)
        .join(", ") + (selectedCount > 2 ? ` +${selectedCount - 2}` : "")
    : "Wszystkie regiony i miasta";

  return (
    <div ref={rootRef} className="relative md:col-span-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="agentFilterInput flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedCount ? "font-bold text-[#182334]" : ""}`}>{summary}</span>
        <FaChevronDown className={`shrink-0 text-[10px] text-[#9b7a36] transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-2 max-h-[460px] overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white shadow-[0_20px_50px_rgba(24,35,52,0.18)] md:right-auto md:w-[min(560px,92vw)]">
          <div className="border-b border-[#eee6da] p-3">
            <label className="flex items-center gap-2 rounded-xl border border-[#ddd3c4] bg-[#fbf8f3] px-3">
              <FaSearch className="text-[11px] text-[#9b7a36]" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Szukaj miasta lub regionu"
                className="h-10 w-full bg-transparent text-[13px] outline-none"
              />
            </label>
          </div>

          <div className="max-h-[340px] overflow-y-auto p-2">
            {visible.length === 0 && (
              <p className="px-3 py-6 text-center text-[12px] text-slate-500">Brak wyników dla „{query}”.</p>
            )}
            {visible.map((coast) => {
              const isOpen = Boolean(q) || expanded.includes(coast.id);
              const coastChecked = regions.includes(coast.id);
              const chosenTowns = coast.towns.filter((town) => towns.includes(town.id)).length;
              const partly = !coastChecked && chosenTowns > 0;
              return (
                <div key={coast.id} className="rounded-xl">
                  <div className="flex items-center gap-1 rounded-xl px-1 py-1 hover:bg-[#f8f4ed]">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(coast.id)}
                      disabled={!coast.towns.length}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? `Zwiń miasta: ${coast.name}` : `Pokaż miasta: ${coast.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9b7a36] hover:bg-white disabled:opacity-0"
                    >
                      <FaChevronRight className={`text-[11px] transition ${isOpen ? "rotate-90" : ""}`} aria-hidden="true" />
                    </button>
                    <input
                      type="checkbox"
                      checked={coastChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = partly;
                      }}
                      onChange={() => toggleRegion(coast)}
                      aria-label={`Cały region: ${coast.name}`}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#182334]"
                    />
                    <button
                      type="button"
                      onClick={() => toggleExpanded(coast.id)}
                      className="flex flex-1 items-center gap-2 px-2 py-1.5 text-left"
                    >
                      <span className="text-[13px] font-extrabold text-[#182334]">{coast.name}</span>
                      <span className="text-[11px] font-semibold text-slate-400">{coast.count}</span>
                      {partly && (
                        <span className="rounded-full bg-[#f3e7d1] px-2 py-0.5 text-[10px] font-bold text-[#7a5a22]">
                          wybrano {chosenTowns} z {coast.towns.length}
                        </span>
                      )}
                      {coast.towns.length > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-[#9b7a36]">
                          {isOpen ? "zwiń" : townsLabel(coast.towns.length)}
                        </span>
                      )}
                    </button>
                  </div>
                  {isOpen && coast.towns.length > 0 && (
                    <div className="mb-2 ml-9 grid gap-x-3 gap-y-0.5 border-l border-[#eee6da] pl-3 pr-2 sm:grid-cols-2">
                      {coast.towns.map((town) => (
                        <label
                          key={town.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] text-[#405066] hover:bg-[#f8f4ed]"
                        >
                          <input
                            type="checkbox"
                            checked={coastChecked || towns.includes(town.id)}
                            onChange={() => toggleTown(coast, town.id)}
                            className="h-3.5 w-3.5 accent-[#182334]"
                          />
                          <span className="flex-1 truncate">{town.name}</span>
                          <span className="text-[10px] text-slate-400">{town.count}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-[#eee6da] px-3 py-2.5">
            <button
              type="button"
              onClick={() => onChange({ regions: [], towns: [] })}
              className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500 hover:text-[#182334]"
              disabled={!selectedCount}
            >
              Wyczyść wybór
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#182334] px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-[#b8954c]"
            >
              Gotowe
            </button>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {regions.map((id) => (
            <button
              key={`r-${id}`}
              type="button"
              onClick={() => removeRegion(id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#182334] px-3 py-1 text-[10px] font-bold text-white"
            >
              {coastNames.get(id) || id} <FaTimes aria-hidden="true" className="text-[8px]" />
            </button>
          ))}
          {towns.map((id) => (
            <button
              key={`t-${id}`}
              type="button"
              onClick={() => removeTown(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d7cbbc] bg-[#f8f4ed] px-3 py-1 text-[10px] font-bold text-[#405066]"
            >
              {townNames.get(id) || id} <FaTimes aria-hidden="true" className="text-[8px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
