import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";

type Props = {
  label: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
};

export function MultiSelect({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [router.asPath]);

  // ✅ breakpoint detection (bez resize spamu)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const listener = () => setIsDesktop(media.matches);

    listener();
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((i) => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  // close on outside click (desktop only)
  useEffect(() => {
    if (!isDesktop) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop]);

  return (
    <div ref={ref} className="relative w-full h-full">
      {/* BUTTON */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-full w-full cursor-pointer flex-col justify-center bg-white px-3 duration-200 hover:bg-[#fbf8f2]"
      >
        <label className="mb-1 text-xs font-semibold text-[#5f6b7a]">
          {label}
        </label>
        <div className="truncate text-sm font-semibold text-[#182334]">
          {value.length > 0 ? value.join(", ") : "Wybierz"}
        </div>
      </div>

      {open && (
        <>
          {/* ================= DESKTOP ================= */}
          {isDesktop && (
            <div
              className={`absolute top-[calc(100%+5px)] left-0 ${
                label === "Zabudowa" ? "w-[400px]" : "w-[200px]"
              } z-10 border border-[#e5dac7] bg-[#f7f3ec] p-5 shadow-xl`}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                {label}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {options.map((item) => (
                  <div
                    key={item}
                    onClick={() => toggle(item)}
                    className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#334155]"
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center border ${
                        value.includes(item)
                          ? "border-[#182334] bg-[#182334]"
                          : "border-[#d7c8ad] bg-white"
                      }`}
                    >
                      {value.includes(item) && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= MOBILE ================= */}
          {!isDesktop &&
            typeof window !== "undefined" &&
            createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[220px]">
                {/* backdrop */}
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setOpen(false)}
                />

                {/* content */}
                <div className="relative w-[90vw] max-w-[400px] border border-[#e5dac7] bg-[#f7f3ec] p-5 shadow-xl">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                    {label}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {options.map((item) => (
                      <div
                        key={item}
                        onClick={() => toggle(item)}
                        className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#334155]"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center border ${
                            value.includes(item)
                              ? "border-[#182334] bg-[#182334]"
                              : "border-[#d7c8ad] bg-white"
                          }`}
                        >
                          {value.includes(item) && (
                            <span className="text-xs text-white">✓</span>
                          )}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  );
}
