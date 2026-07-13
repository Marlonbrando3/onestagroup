import { useState, useRef, useEffect } from "react";

type Props = {
  value: { min: number; max: number };
  onChange: (val: { min: number; max: number }) => void;
  locale?: "pl" | "en";
};

function formatPriceInput(num: number, locale: "pl" | "en" = "pl") {
  return `${new Intl.NumberFormat(locale === "en" ? "en-US" : "pl-PL", {
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace(/\u00a0/g, " ")} €`;
}

export default function PriceSelect({ value, onChange, locale = "pl" }: Props) {
  const isEn = locale === "en";
  const minLimit = 0;
  const maxLimit = 1500000;
  const minGap = 10000;

  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(() => ({
    min: value.min,
    max: value.max >= 5000000 ? maxLimit : value.max,
  }));
  const [draft, setDraft] = useState(() => ({
    min: formatPriceInput(value.min, locale),
    max:
      value.max >= 5000000
        ? `${formatPriceInput(maxLimit, locale)} ${isEn ? "or more" : "i więcej"}`
        : formatPriceInput(value.max, locale),
  }));
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percent = (val: number) =>
    ((val - minLimit) / (maxLimit - minLimit)) * 100;

  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  const mapRangeForParent = (range: { min: number; max: number }) => ({
    min: range.min,
    max: range.max >= maxLimit ? 5000000 : range.max,
  });

  const syncDraft = (range: { min: number; max: number }) => {
    setDraft({
      min: formatPriceInput(Math.round(range.min), locale),
      max:
        range.max >= maxLimit
          ? `${formatPriceInput(maxLimit, locale)} ${isEn ? "or more" : "i więcej"}`
          : formatPriceInput(Math.round(range.max), locale),
    });
  };

  const applyCommittedRange = (range: { min: number; max: number }) => {
    setLocal(range);
    syncDraft(range);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const mapped = mapRangeForParent(range);
    if (value.min !== mapped.min || value.max !== mapped.max) {
      onChange(mapped);
    }
  };

  const getValueFromPosition = (x: number) => {
    const rect = sliderRef.current!.getBoundingClientRect();
    let p = (x - rect.left) / rect.width;
    p = Math.max(0, Math.min(1, p));
    const raw = minLimit + p * (maxLimit - minLimit);
    if (raw > maxLimit * 0.98) return maxLimit;
    return Math.round(raw);
  };

  const handleDrag = (type: "min" | "max") => (e: MouseEvent) => {
    const val = getValueFromPosition(e.clientX);
    setLocal((prev) => {
      if (type === "min")
        return { ...prev, min: Math.min(val, prev.max - minGap) };
      return { ...prev, max: Math.max(val, prev.min + minGap) };
    });
  };

  const startDrag = (type: "min" | "max") => () => {
    const move = handleDrag(type);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const startTouchDrag = (type: "min" | "max") => (e: React.TouchEvent) => {
    e.preventDefault();
    const move = (ev: TouchEvent) => {
      const val = getValueFromPosition(ev.touches[0].clientX);
      setLocal((prev) => {
        if (type === "min")
          return { ...prev, min: Math.min(val, prev.max - minGap) };
        return { ...prev, max: Math.max(val, prev.min + minGap) };
      });
    };
    const up = () => {
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", up);
    };
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
  };

  useEffect(() => {
    if (open) return;
    setLocal({
      min: value.min,
      max: value.max >= 5000000 ? maxLimit : value.max,
    });
  }, [value, open, maxLimit]);

  useEffect(() => {
    syncDraft(local);
  }, [local.min, local.max]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const mapped = mapRangeForParent(local);
      if (value.min === mapped.min && value.max === mapped.max) return;
      onChange(mapped);
    }, 180);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [local, onChange, value.min, value.max, maxLimit]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitManualValue = (type: "min" | "max", raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    const parsed = Number(digits);

    if (!digits || !Number.isFinite(parsed)) {
      syncDraft(local);
      return;
    }

    if (type === "min") {
      const upperBound = Math.max(minLimit, local.max - minGap);
      applyCommittedRange({
        ...local,
        min: clamp(Math.round(parsed), minLimit, upperBound),
      });
      return;
    }

    const lowerBound = Math.min(maxLimit, local.min + minGap);
    applyCommittedRange({
      ...local,
      max: clamp(Math.round(parsed), lowerBound, maxLimit),
    });
  };

  return (
    <div ref={ref} className="w-full h-full lg:relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-full w-full cursor-pointer flex-col justify-center bg-white px-3 transition hover:bg-[#fbf8f2]"
      >
        <label className="mb-1 text-xs font-semibold text-[#5f6b7a]">
          {isEn ? "Price range" : "Zakres cenowy"}
        </label>
        <div className="text-sm font-semibold text-[#182334]">
          {formatPriceInput(value.min, locale)} -{" "}
          {value.max >= maxLimit
            ? `${formatPriceInput(maxLimit, locale)} ${isEn ? "or more" : "i więcej"}`
            : formatPriceInput(value.max, locale)}
        </div>
      </div>

      {open && (
        <div className="absolute -top-[250px] left-0 right-0 z-[9999] mx-auto w-[95vw] border border-[#e5dac7] bg-[#f7f3ec] p-5 shadow-2xl lg:top-[60px] lg:-left-[340px] lg:right-auto lg:w-[500px] lg:p-6">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                {isEn ? "Price range" : "Zakres cenowy"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f6b7a]">
                {isEn
                  ? "Adjust the range to narrow results to your purchase budget."
                  : "Przesuń zakres, aby zawęzić wyniki do budżetu zakupu."}
              </p>
            </div>

            <div
              ref={sliderRef}
              className="relative h-[6px] bg-[#e2d4bd]"
            >
              <div
                className="absolute h-[6px] bg-[#b8954c]"
                style={{
                  left: `${percent(local.min)}%`,
                  width: `${percent(local.max) - percent(local.min)}%`,
                }}
              />
              <div
                onMouseDown={startDrag("min")}
                onTouchStart={startTouchDrag("min")}
                className="absolute -top-[7px] h-5 w-5 cursor-pointer border-2 border-white bg-[#182334] shadow-md touch-none"
                style={{
                  left: `${percent(local.min)}%`,
                  transform: "translateX(-50%)",
                }}
              />
              <div
                onMouseDown={startDrag("max")}
                onTouchStart={startTouchDrag("max")}
                className="absolute -top-[7px] h-5 w-5 cursor-pointer border-2 border-white bg-[#182334] shadow-md touch-none"
                style={{
                  left: `${percent(local.max)}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7c8796]">
                  Min
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.min}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      min: event.target.value.replace(/[^\d]/g, ""),
                    }))
                  }
                  onBlur={() => commitManualValue("min", draft.min)}
                  onFocus={(event) => event.currentTarget.select()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="mt-2 h-11 w-full border border-[#d7c8ad] bg-white px-3 text-sm font-semibold text-[#182334] outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7c8796]">
                  Max
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.max}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      max: event.target.value.replace(/[^\d]/g, ""),
                    }))
                  }
                  onBlur={() => commitManualValue("max", draft.max)}
                  onFocus={(event) => event.currentTarget.select()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="mt-2 h-11 w-full border border-[#d7c8ad] bg-white px-3 text-sm font-semibold text-[#182334] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => applyCommittedRange({ min: 0, max: maxLimit })}
                className="h-11 border border-[#d7c8ad] bg-white px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#182334] transition hover:border-[#182334] hover:bg-[#182334] hover:text-white"
              >
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-11 flex-1 border border-[#b8954c] bg-[#d6b36a] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#182334] transition hover:border-[#182334] hover:bg-[#182334] hover:text-white"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
