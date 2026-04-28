import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

type Props = {
  value: { min: number; max: number };
  onChange: (val: { min: number; max: number }) => void;
};

export default function PriceSelect({ value, onChange }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value);

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
    setLocal({
      min: value.min,
      max: value.max >= 5000000 ? 1500000 : value.max,
    });
  }, [value]);

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
    <div ref={ref} className="w-full lg:relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="border border-yellow-500 px-3 h-[40px] flex items-center cursor-pointer bg-white md:mr-[10px]"
      >
        Zakres cenowy
      </div>

      {open && (
        <div className="absolute -top-[115px] left-0 right-0 w-[95vw] mx-auto lg:top-[60px] lg:-left-[340px] lg:right-auto lg:w-[500px] bg-white shadow-xl p-6 z-50">
          <div className="flex flex-col gap-6">
            <p className="text-[16px] text-gray-600 tracking-wide">
              Zakres cenowy
            </p>

            <div
              ref={sliderRef}
              className="relative h-[6px] bg-gray-300 rounded"
            >
              <div
                className="absolute h-[6px] bg-yellow-500 rounded"
                style={{
                  left: `${percent(local.min)}%`,
                  width: `${percent(local.max) - percent(local.min)}%`,
                }}
              />
              <div
                onMouseDown={startDrag("min")}
                onTouchStart={startTouchDrag("min")}
                className="absolute w-4 h-4 bg-yellow-500 rounded-full cursor-pointer -top-[5px] touch-none"
                style={{
                  left: `${percent(local.min)}%`,
                  transform: "translateX(-50%)",
                }}
              />
              <div
                onMouseDown={startDrag("max")}
                onTouchStart={startTouchDrag("max")}
                className="absolute w-4 h-4 bg-yellow-500 rounded-full cursor-pointer -top-[5px] touch-none"
                style={{
                  left: `${percent(local.max)}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            <div className="flex items-center gap-2 border">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-8 shrink-0">Min</span>
                <input
                  value={format(local.min)}
                  readOnly
                  className="border px-3 py-1 md:w-[180px] w-[120px] min-w-0"
                />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="w-8 shrink-0">Max</span>
                <input
                  value={
                    local.max >= maxLimit
                      ? `${format(maxLimit)} +`
                      : format(local.max)
                  }
                  readOnly
                  className="border px-3 py-1 md:w-[180px] w-[120px] min-w-0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLocal({ min: 0, max: 1500000 })}
                className="border px-4 py-2"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  const mappedMax = local.max >= maxLimit ? 5000000 : local.max;
                  onChange({ min: local.min, max: mappedMax });
                  router.push(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        priceMin: local.min,
                        priceMax: mappedMax,
                      },
                    },
                    undefined,
                    { shallow: false },
                  );
                  setOpen(false);
                }}
                className="bg-yellow-600 text-white py-2 flex-1"
              >
                Zastosuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
