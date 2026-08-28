// ResultsSlider.tsx
import { useState, useRef, useMemo, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { localePath, SiteLocale } from "@/lib/i18n";
import { optimizedPropertyImageUrl } from "@/lib/propertyImages";

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
  locale?: SiteLocale;
  detailHrefOverride?: string;
  imagePriority?: boolean;
  onAllImagesFailed?: () => void;
};

export default function ResultsSlider({
  propertyId,
  images,
  market,
  countrySlug,
  deliveryDate,
  date,
  propertyTitle,
  slug,
  locale = "pl",
  detailHrefOverride,
  imagePriority = false,
  onAllImagesFailed: _onAllImagesFailed,
}: Images) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const imagesArray = useMemo(() => {
    try {
      if (typeof images === "string") {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return Array.isArray(images) ? images : images ? [images] : [];
    } catch {
      return [];
    }
  }, [images]);

  const slides = useMemo(() => {
    const hasFtpProxyImages = imagesArray.some((img: any) => {
      const url = typeof img === "string" ? img : img?.url;
      return typeof url === "string" && url.startsWith("/api/onesari/ftp-image");
    });
    const visibleImages = hasFtpProxyImages ? imagesArray.slice(0, 1) : imagesArray.slice(0, 3);
    const base: Array<{ key: string; type: "image" | "more"; url: string }> =
      visibleImages.map((img: any, i: number) => ({
        key: `img-${i}`,
        type: "image" as const,
        url: typeof img === "string" ? img : img?.url,
      }));

    if (!hasFtpProxyImages && imagesArray.length > 3) {
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
  const paths = localePath[locale];
  const isEn = locale === "en";
  const detailHref = detailHrefOverride || {
    pathname: paths.property(countrySlug, slug),
    query: { id: propertyId },
  };
  const isPrimary =
    market === "RYNEK PIERWOTNY" || market === "PRIMARY MARKET";
  const activeSlide = slides[index] ?? slides[0];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8ddca]">
      <div className="absolute left-3 top-3 z-10 bg-white/95 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b7a36] shadow-sm">
        {market}
      </div>

      {isPrimary && deliveryDate && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#334155] shadow-sm">
          {isEn ? "Updated" : "Data aktualizacji"} {String(date || "").slice(0, 10)}
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
        <div className="relative h-full">
          <div className="absolute flex items-center justify-center p-4 h-full w-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-300 border-t-orange-500" />
          </div>
          {activeSlide ? (
            activeSlide.type === "more" ? (
              <Link
                href={detailHref}
                prefetch={false}
                className="min-w-full h-full flex items-center justify-center bg-red-500/70 text-3xl text-white font-[700]"
              >
                {isEn ? "More photos" : "Więcej zdjęć"}
              </Link>
            ) : (
              <Link
                href={detailHref}
                prefetch={false}
                className="relative block h-full w-full"
              >
                <Image
                  fill
                  className="object-cover"
                  src={optimizedPropertyImageUrl(activeSlide.url)}
                  alt={
                    isEn
                      ? `${propertyTitle} - property photo`
                      : `${propertyTitle} - zdjęcie nieruchomości`
                  }
                  sizes="(max-width: 767px) 90vw, (max-width: 1023px) 30vw, 305px"
                  quality={70}
                  {...(imagePriority && index === 0
                    ? { preload: true }
                    : { loading: "lazy" as const })}
                />
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
