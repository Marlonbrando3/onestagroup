import { useEffect, useRef, useState } from "react";

type PriceRange = { min: number; max: number };

type Props = {
  value: PriceRange;
  onChange: (val: PriceRange) => void;
  locale?: "pl" | "en";
};

const OPEN_ENDED_MAX = 5_000_000;

const PRICE_RANGES: Array<PriceRange & { pl: string; en: string }> = [
  { min: 0, max: 200_000, pl: "do 200 000 euro", en: "Up to €200,000" },
  {
    min: 200_000,
    max: 300_000,
    pl: "200 000 - 300 000 euro",
    en: "€200,000 - €300,000",
  },
  {
    min: 300_000,
    max: 400_000,
    pl: "300 000 - 400 000 euro",
    en: "€300,000 - €400,000",
  },
  {
    min: 400_000,
    max: 500_000,
    pl: "400 000 - 500 000 euro",
    en: "€400,000 - €500,000",
  },
  {
    min: 500_000,
    max: 700_000,
    pl: "500 000 - 700 000 euro",
    en: "€500,000 - €700,000",
  },
  {
    min: 700_000,
    max: OPEN_ENDED_MAX,
    pl: "700 000 euro i więcej",
    en: "€700,000 and more",
  },
];

function formatPrice(value: number, locale: "pl" | "en") {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pl-PL", {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00a0/g, " ");
}

export default function PriceSelect({ value, onChange, locale = "pl" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";
  const selectedRange = PRICE_RANGES.find(
    (range) => range.min === value.min && range.max === value.max,
  );
  const isAllPrices = value.min === 0 && value.max === OPEN_ENDED_MAX;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const currentLabel = isAllPrices
    ? isEn
      ? "All prices"
      : "Wszystkie ceny"
    : selectedRange
      ? selectedRange[locale]
      : value.max >= OPEN_ENDED_MAX
        ? `${isEn ? "From" : "Od"} ${formatPrice(value.min, locale)} €`
        : value.min === 0
          ? `${isEn ? "Up to" : "Do"} ${formatPrice(value.max, locale)} €`
          : `${formatPrice(value.min, locale)} - ${formatPrice(value.max, locale)} €`;

  const selectRange = (range: PriceRange) => {
    onChange(range);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative h-full w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="flex h-full w-full flex-col justify-center rounded-xl bg-white px-3 text-left"
      >
        <span className="mb-1 text-xs font-semibold text-[#5f6b7a]">
          {isEn ? "Price range" : "Zakres cenowy"}
        </span>
        <span className="flex items-center justify-between gap-2 text-sm font-semibold text-[#182334]">
          <span className="truncate normal-case tracking-normal">
            {currentLabel}
          </span>
          <svg
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={isEn ? "Price ranges" : "Zakresy cenowe"}
          className="absolute right-0 top-[calc(100%+10px)] z-[9999] w-full min-w-[270px] overflow-hidden rounded-[18px] border border-[#e5dac7] bg-[#f7f3ec] p-2 shadow-2xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={isAllPrices}
            onClick={() => selectRange({ min: 0, max: OPEN_ENDED_MAX })}
            className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
              isAllPrices
                ? "bg-[#182334] font-semibold text-white"
                : "text-[#334155] hover:bg-white"
            }`}
          >
            {isEn ? "All prices" : "Wszystkie ceny"}
          </button>

          {PRICE_RANGES.map((range) => {
            const selected =
              value.min === range.min && value.max === range.max;
            return (
              <button
                key={`${range.min}-${range.max}`}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectRange({ min: range.min, max: range.max })}
                className={`mt-1 w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "bg-[#d6b36a] font-semibold text-[#182334]"
                    : "text-[#334155] hover:bg-white"
                }`}
              >
                {range[locale]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
