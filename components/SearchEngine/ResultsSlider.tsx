// ResultsSlider.tsx
import { useState, useRef, useMemo, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

type Images = {
  date: string | null;
  images: any;
  market: string;
  countrySlug: string;
  deliveryDate: any;
  region: any;
  propertyId: string | number;
  propertyTitle: string;
  slug: string;
  onAllImagesFailed?: () => void;
};

export default function ResultsSlider({
  propertyId,
  images,
  market,
  countrySlug,
  deliveryDate,
  date,
  slug,
  onAllImagesFailed: _onAllImagesFailed,
}: Images) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const imagesArray = (() => {
    try {
      if (typeof images === "string") {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return Array.isArray(images) ? images : images ? [images] : [];
    } catch {
      return [];
    }
  })();

  const slides = useMemo(() => {
    const base: Array<{ key: string; type: "image" | "more"; url: string }> =
      imagesArray.slice(0, 3).map((img: any, i: number) => ({
        key: `img-${i}`,
        type: "image" as const,
        url: typeof img === "string" ? img : img?.url,
      }));

    if (imagesArray.length > 3) {
      base.push({ key: "more", type: "more", url: "" });
    }

    return base;
  }, [imagesArray]);

  useEffect(() => {
    if (index > slides.length - 1) setIndex(0);
  }, [slides.length, index]);

  const next = () => {
    if (slides.length <= 1) return;
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    if (slides.length <= 1) return;
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    if (diff > 50) next();
    if (diff < -50) prev();

    setTouchStartX(null);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8ddca]">
      <div className="absolute left-3 top-3 z-10 bg-white/95 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b7a36] shadow-sm">
        {market}
      </div>

      {market === "RYNEK PIERWOTNY" && deliveryDate && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#334155] shadow-sm">
          Data aktualizacji {String(date || "").slice(0, 10)}
        </div>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-0 z-10 flex h-full w-12 items-center justify-center opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
        >
          <div className="grid h-9 w-9 place-items-center bg-white/90 shadow-sm">
            <FaChevronLeft className="h-4 w-4 text-[#182334]" />
          </div>
        </button>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-0 z-10 flex h-full w-12 items-center justify-center opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
        >
          <div className="grid h-9 w-9 place-items-center bg-white/90 shadow-sm">
            <FaChevronRight className="h-4 w-4 text-[#182334]" />
          </div>
        </button>
      )}

      <div
        ref={viewportRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="h-full w-full overflow-hidden"
      >
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          <div className="absolute flex items-center justify-center p-4 h-full w-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-300 border-t-orange-500" />
          </div>
          {slides.map((slide) =>
            slide.type === "more" ? (
              <Link
                key={slide.key}
                href={{
                  pathname: `/nieruchomosci/${countrySlug}/${slug}`,
                  query: { id: propertyId },
                }}
                className="min-w-full h-full flex items-center justify-center bg-red-500/70 text-3xl text-white font-[700]"
              >
                Więcej zdjęć
              </Link>
            ) : (
              <Link
                key={slide.key}
                href={{
                  pathname: `/nieruchomosci/${countrySlug}/${slug}`,
                  query: { id: propertyId },
                }}
                className="min-w-full h-full relative"
              >
                <Image
                className="object-cover"
                  src={slide.url || "/placeholder.jpg"}
                  alt="Zdjęcie nieruchomości"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 44vw, 25vw"
                />
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
