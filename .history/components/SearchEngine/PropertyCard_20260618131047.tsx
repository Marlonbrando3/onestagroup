import Link from "next/link";
import { useState } from "react";
import { IoMdPin } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { MdIosShare } from "react-icons/md";
import ResultsSlider from "./ResultsSlider";
import {
  typeDictionarySingular,
  validTitleOrEmpty,
} from "../../lib/titlesDictionary";
import { HomeRedHatDisplayFont as Red_Hat_DisplayFont } from "@/fonts/homeFonts";
import { getCoastLabelFromProvince } from "@/lib/regionMap";

type PropertyProps = {
  property: any;
  onBrokenImages?: (externalId: string | number) => void;
};

function slugify(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatPrice(price: number | string | null | undefined) {
  const numeric = Number(price || 0);
  if (!numeric) return "Konsultacja";
  return `${numeric.toLocaleString("pl-PL")} €`;
}

function formatValue(value: unknown, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function formatDistanceToSea(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return (
    <p className="text-gray-900 font-900 text-[13px]">
      {Math.round(numeric).toLocaleString("pl-PL")} m do morza{" "}
    </p>
  );
}

export default function PropertyCard({
  property,
  onBrokenImages,
}: PropertyProps) {
  const [copiedShowed, setCopiedShowed] = useState(false);

  const market = property?.new_build ? "RYNEK PIERWOTNY" : "RYNEK WTÓRNY";
  const countryName =
    typeof property?.country === "string"
      ? property.country
      : property?.country?.name || "hiszpania";

  const countrySlug = slugify(countryName);
  const propertyType =
    property?.type && property.type in typeDictionarySingular
      ? typeDictionarySingular[
          property.type as keyof typeof typeDictionarySingular
        ]
      : "Nieruchomość";
  const generatedTitle = `${propertyType} w ${property?.town || "Hiszpanii"}`;
  const listingTitle =
    validTitleOrEmpty(property?.title) ||
    validTitleOrEmpty(property?.headerAdvertisement) ||
    generatedTitle;
  const slug = slugify(listingTitle);
  const locationLabel = getCoastLabelFromProvince(property?.province);
  const distanceToSeaLabel = formatDistanceToSea(property?.distance_to_sea_m);

  const detailHref = {
    pathname: `/nieruchomosci/${countrySlug}/${slug}`,
    query: { id: property?.external_id },
  };

  const share = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/nieruchomosci/${countrySlug}/${slug}?id=${property?.external_id}`
        : `/nieruchomosci/${countrySlug}/${slug}?id=${property?.external_id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Zobacz tę nieruchomość",
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShowed(true);
        setTimeout(() => setCopiedShowed(false), 1500);
      }
    } catch {}
  };

  const stats = [
    {
      label: "Sypialnie",
      value: formatValue(property?.beds),
      Icon: IoBedOutline,
    },
    {
      label: "Łazienki",
      value: formatValue(property?.baths),
      Icon: PiBathtubLight,
    },
    {
      label: "Basen",
      value: property?.pool === true ? "Tak" : "Nie",
      Icon: FaSwimmingPool,
    },
    {
      label: "Powierzchnia",
      value: property?.surface_built ? `${property.surface_built} m²` : "-",
      Icon: BiArea,
    },
  ];

  return (
    <article
      className={`${Red_Hat_DisplayFont.className} group flex h-full flex-col overflow-hidden border border-[#e5dac7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8ddca]">
        <ResultsSlider
          date={property?.updated_at}
          region={property?.province}
          countrySlug={countrySlug}
          images={property?.images}
          market={market}
          deliveryDate={property?.vacantFromDate}
          propertyId={property?.external_id}
          propertyTitle={listingTitle}
          slug={slug}
          onAllImagesFailed={() => onBrokenImages?.(property?.external_id)}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="relative flex-1 p-3">
          <button
            type="button"
            onClick={share}
            aria-label="Udostępnij nieruchomość"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-[#e5dac7] bg-[#f7f3ec] text-[#182334] transition hover:border-[#b8954c] hover:text-[#9b7a36]"
          >
            <MdIosShare className="h-4 w-4" />
          </button>

          {copiedShowed && (
            <div className="absolute right-3 top-12 z-20 bg-[#182334] px-3 py-2 text-xs font-semibold text-white shadow-lg">
              Skopiowano link
            </div>
          )}

          <Link href={detailHref} className="block pr-9">
            <div className="flex items-start gap-1.5 text-xs text-[#5f6b7a]">
              <IoMdPin className="mt-[2px] h-4 w-4 shrink-0 text-[#b8954c]" />
              <div>
                <p className="font-semibold text-[#182334]">
                  {locationLabel || "Wybrzeże"}
                </p>
                <p>{property?.town || "Hiszpania"}</p>
              </div>
            </div>

            <h2 className="mt-2 line-clamp-2 min-h-[42px] text-[17px] font-bold leading-[1.22] text-[#182334]">
              {listingTitle}
            </h2>

            <div className="mt-2 h-[40px]">
              {distanceToSeaLabel && (
                <p className="mt-1 text-[13px] font-sbold text-[#5f6b7a]">
                  {distanceToSeaLabel}
                </p>
              )}
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c8796]">
                ref. {property?.external_id}
              </span>
            </div>
          </Link>

          <div className="mt-3 grid grid-cols-4 gap-1 border-y border-[#e5dac7] py-2">
            {stats.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex min-w-0 items-center justify-center gap-1.5 px-1 text-center"
                title={label}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#9b7a36]" />
                <span className="truncate text-sm font-bold text-[#182334]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#e5dac7] bg-[#fbf8f2] px-3 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c8796]">
              Cena
            </p>
            <p className="text-[20px] font-extrabold leading-tight text-[#9b7a36]">
              {property?.new_build && Number(property?.price || 0) > 0 && (
                <span className="mr-1 text-xs font-bold">od</span>
              )}
              {formatPrice(property?.price)}
            </p>
          </div>
          <Link
            href={detailHref}
            className="shrink-0 border border-[#b8954c] bg-[#d6b36a] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#182334] transition hover:border-[#182334] hover:bg-[#182334] hover:text-white"
          >
            Szczegóły
          </Link>
        </div>
      </div>
    </article>
  );
}
