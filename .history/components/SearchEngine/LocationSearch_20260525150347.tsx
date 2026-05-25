import { useState, useEffect, useRef } from "react";
import data from "@/data/locations.json";

type Location = {
  id: string;
  name: string;
  type: "coast" | "province" | "city";
  parentId: string | null;
  value?: any;
};

type Props = {
  value: Location[];
  onChange: (val: Location[]) => void;
  className?: string;
};

export default function LocationSearch({ value, onChange, className }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [limitMessage, setLimitMessage] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const MAX_LOCATIONS = 6;

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
    setQuery(valueInput);

    const q = valueInput.toLowerCase();

    if (!q) {
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }

    const matches = (data as Location[]).filter((l) =>
      l.name.toLowerCase().includes(q),
    );

    const expanded = matches.flatMap((m) =>
      getHierarchy(m, data as Location[]),
    );

    const unique = Array.from(new Map(expanded.map((i) => [i.id, i])).values());

    const order = { city: 1, province: 2, coast: 3 };
    unique.sort((a, b) => order[a.type] - order[b.type]);

    setResults(unique);
    setOpen(true);
    setHighlightedIndex(unique.length ? 0 : -1);
  };

  const addLocation = (loc: Location) => {
    if (value.find((s) => s.id === loc.id)) return;

    if (value.length >= MAX_LOCATIONS) {
      setLimitMessage(`Możesz wybrać maksymalnie ${MAX_LOCATIONS} lokalizacji`);
      setTimeout(() => setLimitMessage(""), 3000);
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

  return (
    <div
      ref={ref}
      className={`relative h-full  flex w-[300px] rounded-[30px] ${className ?? ""}`}
    >
      <div className="border-yellow-500 bg-white rounded-[30px] h-full flex flex-col justify-center px-3 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-gray-600">
            Lokalizacja
          </label>
          {limitMessage && (
            <p className="text-xs font-semibold text-white bg-red-500 px-1 py-0 rounded whitespace-nowrap">
              {limitMessage}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {value.map((loc) => (
            <div
              key={loc.id}
              className={`flex items-center gap-1 bg-yellow-300/[0.9] rounded-full ${
                value.length > 1 ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"
              }`}
            >
              <span>{loc.name}</span>
              <button
                onClick={() => removeLocation(loc.id)}
                className={`text-gray-600 hover:text-gray-900 font-bold leading-none ${
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
              setOpen(true);
              if (results.length > 0 && highlightedIndex === -1) {
                setHighlightedIndex(0);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="np. Alicante, Malaga, Costa Blanca..."
            className="outline-none bg-transparent flex-1 min-w-[150px] text-base md:text-sm"
          />
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow z-50 max-h-60 top-[75px] ">
          {results.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => addLocation(item)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`p-2 cursor-pointer flex justify-between ${
                idx === highlightedIndex ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <span>{item.name}</span>
              <span className="text-[14px] text-gray-600">
                {item.type === "city" && "Miasto"}
                {item.type === "province" && "Region"}
                {item.type === "coast" && "Wybrzeże"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
