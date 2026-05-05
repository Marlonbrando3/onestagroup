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

  console.log("data");

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
    <div ref={ref} className="relative w-full">
      {/* BUTTON */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full md:w-auto border border-yellow-500 px-3 h-[40px] flex items-center cursor-pointer bg-white hover:shadow-md duration-200 mr-[10px]"
      >
        {label}
      </div>

      {open && (
        <>
          {/* ================= DESKTOP ================= */}
          {isDesktop && (
            <div className="absolute top-[60px] left-0 w-[400px] bg-white border shadow-xl p-6 pt-2 z-50">
              <p className="text-[16px] text-gray-600 tracking-wide mb-4">
                {label}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {options.map((item) => (
                  <div
                    key={item}
                    onClick={() => toggle(item)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 border flex items-center justify-center ${
                        value.includes(item) ? "bg-black" : ""
                      }`}
                    >
                      {value.includes(item) && (
                        <span className="text-white text-xs">✓</span>
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
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[100px]">
                {/* backdrop */}
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setOpen(false)}
                />

                {/* content */}
                <div className="relative w-[90vw] max-w-[400px] bg-white border shadow-xl p-6 pt-2 rounded">
                  <p className="text-[18px] text-gray-600 tracking-wide mb-4">
                    {label}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {options.map((item) => (
                      <div
                        key={item}
                        onClick={() => toggle(item)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 border flex items-center justify-center ${
                            value.includes(item) ? "bg-black" : ""
                          }`}
                        >
                          {value.includes(item) && (
                            <span className="text-white text-xs">✓</span>
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
