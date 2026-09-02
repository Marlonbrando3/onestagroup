// ResultsSlider.tsx
import { useState, useRef, useMemo, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
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
  town?: string | null;
  propertyId: string | number;
  propertyTitle: string;
  slug: string;
  locale?: SiteLocale;
  detailHrefOverride?: string;
  imagePriority?: boolean;
  appearance?: "default" | "cbtop";
  onAllImagesFailed?: () => void;
};

function photoCountLabel(count: number, isEnglish: boolean) {
  if (isEnglish) return `${count} ${count === 1 ? "photo" : "photos"}`;

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const noun =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ? "zdjęcia"
      : "zdjęć";

  return `${count} ${noun}`;
}

export default function ResultsSlider({
  propertyId,
  images,
  market,
  countrySlug,
  deliveryDate,
  date,
  region,
  town,
  propertyTitle,
  slug,
  locale = "pl",
  detailHrefOverride,
  imagePriority = false,
  appearance = "default",
  onAllImagesFailed,
}: Images) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [loadedSlides, setLoadedSlides] = useState<Set<string>>(() => new Set());
  const [failedSlides, setFailedSlides] = useState<Set<string>>(() => new Set());
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
    const validImages = imagesArray
      .map((img: any, imageIndex: number) => ({
        key: `img-${imageIndex}`,
        url: typeof img === "string" ? img : img?.url,
      }))
      .filter((image) => typeof image.url === "string" && image.url.trim());
    const hasFtpProxyImages = validImages.some((image) =>
      image.url.startsWith("/api/onesari/ftp-image"),
    );
    const visibleImages = hasFtpProxyImages
      ? validImages.slice(0, 1)
      : validImages.slice(0, 3);
    const base: Array<{ key: string; type: "image" | "more"; url: string }> =
      visibleImages.map((image) => ({
        key: image.key,
        type: "image" as const,
        url: image.url,
      }));

    if (!hasFtpProxyImages && validImages.length > visibleImages.length) {
      base.push({
        key: "more",
        type: "more",
        url: validImages[visibleImages.length]?.url || visibleImages[0]?.url || "",
      });
    }

    return { items: base, totalImages: validImages.length };
  }, [imagesArray]);

  useEffect(() => {
    if (index > slides.items.length - 1) setIndex(0);
  }, [slides.items.length, index]);

  useEffect(() => {
    setLoadedSlides(new Set());
    setFailedSlides(new Set());
  }, [images]);

  const next = () => {
    if (slides.items.length <= 1) return;
    setIndex((prev) => (prev + 1) % slides.items.length);
  };

  const prev = () => {
    if (slides.items.length <= 1) return;
    setIndex((prev) => (prev - 1 + slides.items.length) % slides.items.length);
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
  const activeSlide = slides.items[index] ?? slides.items[0];
  const nextSlide = slides.items[(index + 1) % slides.items.length];
  const totalPhotosLabel = photoCountLabel(slides.totalImages, isEn);
  const isCbtopAppearance = appearance === "cbtop";
  const showImageLoader =
    activeSlide?.type === "image" && !loadedSlides.has(activeSlide.key);

  const markSlideLoaded = (key: string) => {
    setLoadedSlides((current) => {
      if (current.has(key)) return current;
      const nextLoaded = new Set(current);
      nextLoaded.add(key);
      return nextLoaded;
    });
  };

  const markSlideFailed = (key: string) => {
    markSlideLoaded(key);
    setFailedSlides((current) => {
      const nextFailed = new Set(current);
      nextFailed.add(key);
      const imageSlides = slides.items.filter((slide) => slide.type === "image");
      if (
        imageSlides.length > 0 &&
        imageSlides.every((slide) => nextFailed.has(slide.key))
      ) {
        onAllImagesFailed?.();
      }
      return nextFailed;
    });
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        isCbtopAppearance ? "bg-[#dcd5ca]" : "bg-[#e8ddca]"
      }`}
    >
      <div
        className={`absolute z-10 bg-white/95 px-3 py-2 font-bold uppercase shadow-sm ${
          isCbtopAppearance
            ? "left-4 top-4 rounded-full text-[9px] tracking-[0.14em] text-[#182334]"
            : "left-3 top-3 text-[11px] tracking-[0.12em] text-[#9b7a36]"
        }`}
      >
        {market}
      </div>

      {!isCbtopAppearance && isPrimary && deliveryDate && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#334155] shadow-sm">
          {isEn ? "Updated" : "Data aktualizacji"} {String(date || "").slice(0, 10)}
        </div>
      )}

      {slides.items.length > 1 && (
        <button
          type="button"
          onClick={prev}
          aria-label={isEn ? "Previous photo" : "Poprzednie zdjęcie"}
          className="absolute left-0 z-20 flex h-full w-12 items-center justify-center opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
        >
          <div
            className={`grid h-9 w-9 place-items-center shadow-sm ${
              isCbtopAppearance
                ? "rounded-full border border-white/25 bg-[#101b2b]/60 text-white backdrop-blur-sm"
                : "bg-white/90 text-[#182334]"
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </div>
        </button>
      )}

      {slides.items.length > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label={isEn ? "Next photo" : "Kolejne zdjęcie"}
          className="absolute right-0 z-20 flex h-full w-12 items-center justify-center opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
        >
          <div
            className={`grid h-9 w-9 place-items-center shadow-sm ${
              isCbtopAppearance
                ? "rounded-full border border-white/25 bg-[#101b2b]/60 text-white backdrop-blur-sm"
                : "bg-white/90 text-[#182334]"
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
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
          className={`relative h-full ${
            isCbtopAppearance ? "bg-[#dcd5ca]" : "bg-[#e8ddca]"
          }`}
        >
          {showImageLoader && (
            <div
              className={`absolute inset-0 z-[1] flex items-center justify-center ${
                isCbtopAppearance ? "bg-[#dcd5ca]" : "bg-[#e8ddca]"
              }`}
              aria-label={isEn ? "Loading photo" : "Ładowanie zdjęcia"}
              role="status"
            >
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8954c]/25 border-t-[#9b7a36]" />
            </div>
          )}
          {activeSlide ? (
            activeSlide.type === "more" ? (
              <Link
                href={detailHref}
                prefetch={false}
                aria-label={
                  isEn
                    ? `View all ${totalPhotosLabel}`
                    : `Zobacz wszystkie zdjęcia (${slides.totalImages})`
                }
                className="group/more relative flex h-full min-w-full items-center justify-center overflow-hidden bg-[#182334] text-white"
              >
                {activeSlide.url && (
                  <Image
                    fill
                    className="object-cover transition duration-700 group-hover/more:scale-[1.04]"
                    src={optimizedPropertyImageUrl(activeSlide.url)}
                    alt=""
                    sizes={
                      isCbtopAppearance
                        ? "(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 390px"
                        : "(max-width: 767px) 90vw, (max-width: 1023px) 30vw, 305px"
                    }
                    quality={70}
                    onLoad={() => markSlideLoaded(activeSlide.key)}
                    onError={() => markSlideFailed(activeSlide.key)}
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/70 to-[#111827]/35" />
                <span className="relative flex flex-col items-center px-14 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e2c477]">
                    {isEn ? "Full gallery" : "Pełna galeria"}
                  </span>
                  <strong className="mt-2 text-[22px] leading-tight sm:text-2xl">
                    {isEn
                      ? `View all ${totalPhotosLabel}`
                      : `Zobacz wszystkie ${totalPhotosLabel}`}
                  </strong>
                  <span className="mt-4 border border-white/45 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] backdrop-blur-sm transition group-hover/more:border-[#e2c477] group-hover/more:bg-[#b8954c]">
                    {isEn ? "Open listing" : "Otwórz ogłoszenie"}
                  </span>
                </span>
              </Link>
            ) : (
              <Link
                href={detailHref}
                prefetch={false}
                className="relative block h-full w-full"
              >
                <Image
                  fill
                  className={`object-cover ${
                    isCbtopAppearance
                      ? "transition duration-700 group-hover:scale-[1.035]"
                      : ""
                  }`}
                  src={optimizedPropertyImageUrl(activeSlide.url)}
                  alt={
                    isEn
                      ? `${propertyTitle} - property photo`
                      : `${propertyTitle} - zdjęcie nieruchomości`
                  }
                  sizes={
                    isCbtopAppearance
                      ? "(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 390px"
                      : "(max-width: 767px) 90vw, (max-width: 1023px) 30vw, 305px"
                  }
                  quality={70}
                  onLoad={() => markSlideLoaded(activeSlide.key)}
                  onError={() => markSlideFailed(activeSlide.key)}
                  {...(imagePriority && index === 0
                    ? { preload: true }
                    : { loading: "lazy" as const })}
                />
              </Link>
            )
          ) : null}

          {nextSlide?.url &&
            nextSlide.key !== activeSlide?.key &&
            loadedSlides.has(activeSlide.key) &&
            !loadedSlides.has(nextSlide.key) &&
            !failedSlides.has(nextSlide.key) && (
              <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-0"
                aria-hidden="true"
              >
                <Image
                  fill
                  src={optimizedPropertyImageUrl(nextSlide.url)}
                  alt=""
                  sizes={
                    isCbtopAppearance
                      ? "(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 390px"
                      : "(max-width: 767px) 90vw, (max-width: 1023px) 30vw, 305px"
                  }
                  quality={70}
                  loading="eager"
                  onLoad={() => markSlideLoaded(nextSlide.key)}
                  onError={() => markSlideFailed(nextSlide.key)}
                />
              </div>
            )}

          {isCbtopAppearance && activeSlide?.type === "image" ? (
            <>
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#101b2b]/65 via-transparent to-[#101b2b]/10" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#f3d891]">
                    {region || (isEn ? "Coast" : "Wybrzeże")}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold">
                    <FiMapPin aria-hidden="true" />
                    {town || (isEn ? "Property" : "Nieruchomość")}
                  </p>
                </div>
                {slides.totalImages > 1 ? (
                  <span className="rounded-full border border-white/25 bg-[#101b2b]/55 px-3 py-2 text-[9px] font-bold backdrop-blur-sm">
                    {totalPhotosLabel}
                  </span>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
