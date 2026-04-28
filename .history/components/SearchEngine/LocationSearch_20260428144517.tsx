import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const ref = useRef<HTMLDivElement>(null);

  const childrenByParent = useMemo(() => {
    const map = new Map<string, Location[]>();
    for (const loc of data as Location[]) {
      if (!loc.parentId) continue;
      if (!map.has(loc.parentId)) map.set(loc.parentId, []);
      map.get(loc.parentId)!.push(loc);
    }
    return map;
  }, []);

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

  const getDescendants = (id: string): Location[] => {
    const out: Location[] = [];
    const stack = [...(childrenByParent.get(id) ?? [])];

    while (stack.length) {
      const node = stack.pop()!;
      out.push(node);
      const kids = childrenByParent.get(node.id) ?? [];
      stack.push(...kids);
    }

    return out;
  };

  const serializeForQuery = (selected: Location[]) => {
    const ids = new Set<string>();

    for (const loc of selected) {
      ids.add(loc.id);

      if (loc.type !== "city") {
        for (const d of getDescendants(loc.id)) {
          ids.add(d.id);
        }
      }
    }

    return Array.from(ids).join(",");
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

    const updated = [...value, loc];
    onChange(updated);

    const serialized = serializeForQuery(updated);

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          location: serialized,
        },
      },
      undefined,
      { shallow: false },
    );

    setQuery("");
    setResults([]);
    setOpen(false);
    setHighlightedIndex(-1);
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
      className={`relative md:mr-[10px] flex-1 ${className ?? ""}`}
    >
      <div className="border border-yellow-500 p-2 bg-white">
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
          placeholder="np. wybrzeże, miasto, prowincja..."
          className="w-full outline-none"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow z-50 max-h-60 overflow-auto">
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
                {item.type === "town" && "Miasto"}
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
