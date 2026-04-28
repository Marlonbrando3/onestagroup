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
};

export default function ResultsSlider({
  propertyId,
  images,
  market,
  countrySlug,
  deliveryDate,
  date,
  slug,
}: Images) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const imagesArray = Array.isArray(images) ? images : images ? [images] : [];

  const slides = useMemo(() => {
    const base = imagesArray.slice(0, 4).map((img: any, i: number) => ({
      key: `img-${i}`,
      type: "image" as const,
      url: typeof img === "string" ? img : img?.url,
    }));

    if (imagesArray.length > 4) {
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
    <div className="h-full w-full relative bg-white overflow-hidden">
      <div className="absolute text-[14px] md:text-[16px] z-10 bg-white text-orange-400 top-2 px-[12px] font-semibold rounded-r-md h-[26px] leading-[26px] shadow-sm">
        {market}
      </div>

      {market === "RYNEK PIERWOTNY" && deliveryDate && (
        <div className="bg-white absolute z-10 text-[12px] md:text-[14px] text-blue-600 bottom-2 px-[12px] font-normal rounded-r-md h-[24px] leading-[24px]">
          Data aktualizacji {String(date || "").slice(0, 10)}
        </div>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="flex items-center z-10 justify-center absolute w-10 h-full left-0"
        >
          <div className="w-10 h-10 bg-white rounded-full grid place-items-center ml-1">
            <FaChevronLeft className="w-[20px] h-[20px] text-black" />
          </div>
        </button>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={next}
          className="flex items-center z-10 justify-center absolute w-10 h-full right-0"
        >
          <div className="w-10 h-10 bg-white rounded-full grid place-items-center mr-1">
            <FaChevronRight className="w-[20px] h-[20px] text-black" />
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
          className="h-full flex transition-transform duration-300"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
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
                  priority
                />
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
