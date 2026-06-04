import { useState, useRef, useEffect } from "react";

type Props = {
  value: { min: number; max: number };
  onChange: (val: { min: number; max: number }) => void;
};

export default function PriceSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const minLimit = 0;
  const maxLimit = 1500000;

  const percent = (val: number) =>
    ((val - minLimit) / (maxLimit - minLimit)) * 100;

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
        return { ...prev, min: Math.min(val, prev.max - 10000) };
      return { ...prev, max: Math.max(val, prev.min + 10000) };
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
          return { ...prev, min: Math.min(val, prev.max - 10000) };
        return { ...prev, max: Math.max(val, prev.min + 10000) };
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
      max: value.max >= 5000000 ? 1500000 : value.max,
    });
  }, [value, open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const mappedMax = local.max >= maxLimit ? 5000000 : local.max;
      if (value.min === local.min && value.max === mappedMax) return;
      onChange({ min: local.min, max: mappedMax });
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

  const format = (num: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div ref={ref} className="w-full h-full lg:relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-full w-full cursor-pointer flex-col justify-center bg-white px-3 transition hover:bg-[#fbf8f2]"
      >
        <label className="mb-1 text-xs font-semibold text-[#5f6b7a]">
          Zakres cenowy
        </label>
        <div className="text-sm font-semibold text-[#182334]">
          {format(value.min)} -{" "}
          {value.max >= 1500000 ? `${format(1500000)}+` : format(value.max)}
        </div>
      </div>

      {open && (
        <div className="absolute -top-[250px] left-0 right-0 z-[9999] mx-auto w-[95vw] border border-[#e5dac7] bg-[#f7f3ec] p-5 shadow-2xl lg:top-[60px] lg:-left-[340px] lg:right-auto lg:w-[500px] lg:p-6">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                Zakres cenowy
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f6b7a]">
                Przesuń zakres, aby zawęzić wyniki do budżetu zakupu.
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
                  value={format(local.min)}
                  readOnly
                  className="mt-2 h-11 w-full border border-[#d7c8ad] bg-white px-3 text-sm font-semibold text-[#182334] outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7c8796]">
                  Max
                </span>
                <input
                  value={
                    local.max >= maxLimit
                      ? `${format(maxLimit)} +`
                      : format(local.max)
                  }
                  readOnly
                  className="mt-2 h-11 w-full border border-[#d7c8ad] bg-white px-3 text-sm font-semibold text-[#182334] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLocal({ min: 0, max: 1500000 })}
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
