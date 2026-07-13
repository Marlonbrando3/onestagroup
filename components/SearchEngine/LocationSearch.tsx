import { useState, useEffect, useRef } from "react";
import data from "@/data/locations.json";

type Location = {
  id: string;
  name: string;
  type: "coast" | "province" | "town" | "city";
  parentId: string | null;
  country?: string;
  value?: any;
};

type Props = {
  value: Location[];
  onChange: (val: Location[]) => void;
  className?: string;
  countrySlug?: string;
  locale?: "pl" | "en";
};

function getLocationCountry(location: Location) {
  return location.country || "hiszpania";
}

export default function LocationSearch({
  value,
  onChange,
  className,
  countrySlug = "hiszpania",
  locale = "pl",
}: Props) {
  const isEn = locale === "en";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [limitMessage, setLimitMessage] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const MAX_LOCATIONS = 6;
  const isLimitReached = value.length >= MAX_LOCATIONS;

  const countryLocations = (data as Location[]).filter(
    (location) => getLocationCountry(location) === countrySlug,
  );

  const getHierarchy = (loc: Location, all: Location[]) => {
    const res = [loc];
    let current = loc;

    while (current.parentId) {
      const parent = all.find((l) => l.id === current.parentId);
      if (!parent) break;
      res.push(parent);
      current = parent;
    }

    return res;
  };

  const handleSearch = (valueInput: string) => {
    if (isLimitReached) {
      setOpen(false);
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }

    setQuery(valueInput);

    const q = valueInput.toLowerCase();

    if (!q) {
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }

    const matches = countryLocations.filter((l) =>
      l.name.toLowerCase().includes(q),
    );

    const expanded = matches.flatMap((m) => getHierarchy(m, countryLocations));

    const unique = Array.from(new Map(expanded.map((i) => [i.id, i])).values());

    const order = { town: 1, city: 1, province: 2, coast: 3 };
    unique.sort((a, b) => order[a.type] - order[b.type]);

    setResults(unique);
    setOpen(true);
    setHighlightedIndex(unique.length ? 0 : -1);
  };

  const addLocation = (loc: Location) => {
    if (value.find((s) => s.id === loc.id)) return;

    if (isLimitReached) {
      setLimitMessage(
        isEn
          ? `You can select up to ${MAX_LOCATIONS} locations`
          : `Możesz wybrać maksymalnie ${MAX_LOCATIONS} lokalizacji`,
      );
      return;
    }

    const updated = [...value, loc];
    onChange(updated);

    setQuery("");
    setResults([]);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const removeLocation = (locId: string) => {
    const updated = value.filter((l) => l.id !== locId);
    onChange(updated);
    if (updated.length < MAX_LOCATIONS) {
      setLimitMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        addLocation(results[highlightedIndex]);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setHighlightedIndex(-1);
    setLimitMessage("");
  }, [countrySlug]);

  return (
    <div
      ref={ref}
      className={`relative flex h-full w-[300px] ${className ?? ""}`}
    >
      <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-white pr-3 transition hover:bg-[#fbf8f2]">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-semibold text-[#5f6b7a] md:text-xs">
            {isEn ? "Location" : "Lokalizacja"}
          </label>
          {(isLimitReached || limitMessage) && (
            <p className="whitespace-nowrap bg-[#182334] px-2 py-1 text-[10px] font-semibold text-white">
              {isEn
                ? `You can select up to ${MAX_LOCATIONS} locations`
                : `Możesz wybrać maksymalnie ${MAX_LOCATIONS} lokalizacji`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {value.map((loc) => (
            <div
              key={loc.id}
              className={`flex items-center gap-1 border border-[#d7c8ad] bg-[#f7f3ec] text-[#182334] ${
                value.length > 1
                  ? "px-1.5 py-0.5 text-xs"
                  : "px-2 py-1 text-sm"
              }`}
            >
              <span>{loc.name}</span>
              <button
                onClick={() => removeLocation(loc.id)}
                className={`font-bold leading-none text-[#7c8796] hover:text-[#182334] ${
                  value.length > 1 ? "text-[16px]" : "text-[22px]"
                }`}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (isLimitReached) return;
              setOpen(true);
              if (results.length > 0 && highlightedIndex === -1) {
                setHighlightedIndex(0);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              countrySlug === "cypr"
                ? isEn
                  ? "e.g. Paphos, Peyia, Southern Cyprus..."
                  : "np. Pafos, Peja, Cypr Południowy..."
                : isEn
                  ? "e.g. Alicante, Malaga, Costa Blanca..."
                  : "np. Alicante, Malaga, Costa Blanca..."
            }
            disabled={isLimitReached}
            className={`${isLimitReached && "hidden"} min-w-[150px] flex-1 bg-transparent text-base text-[#182334] outline-none placeholder:text-[#9aa3af] md:text-sm`}
          />
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-[75px] z-50 mt-2 max-h-60 w-full overflow-y-auto border border-[#e5dac7] bg-[#f7f3ec] shadow-xl">
          {results.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => addLocation(item)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`flex cursor-pointer justify-between p-3 text-sm transition ${
                idx === highlightedIndex ? "bg-white" : "hover:bg-white"
              }`}
            >
              <span className="font-semibold text-[#182334]">{item.name}</span>
              <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b7a36]">
                {(item.type === "town" || item.type === "city") &&
                  (isEn ? "Town" : "Miasto")}
                {item.type === "province" && (isEn ? "Region" : "Region")}
                {item.type === "coast" && (isEn ? "Coast" : "Wybrzeże")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
