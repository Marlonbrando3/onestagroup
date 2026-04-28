// PropertyCard.tsx
import Link from "next/link";
import { useState } from "react";
import { IoMdPin } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { MdIosShare } from "react-icons/md";
import ResultsSlider from "./ResultsSlider";
import { typeDictionary } from "../../lib/titlesDictionary";

type PropertyProps = {
  property: any;
};

export default function PropertyCard({ property }: PropertyProps) {
  const [copiedShowed, setCopiedShowed] = useState(false);

  const regions: Record<string, string> = {
    Murcia: "Costa Calida",
    Alicante: "Costa Blanca",
    Malaga: "Costa del Sol",
    Almería: "Costa de Almeria",
  };

  const market = property?.new_build ? "RYNEK PIERWOTNY" : "RYNEK WTÓRNY";

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

  const countryName =
    typeof property?.country === "string"
      ? property.country
      : property?.country?.name || "hiszpania";

  const countrySlug = slugify(countryName);
  const slug = `${slugify(property?.type)}-${slugify(property?.town)}`;

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
          title: "Zobacz tę nieruchomość!",
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShowed(true);
        setTimeout(() => setCopiedShowed(false), 1500);
      }
    } catch {}
  };

  return (
    <div className="flex flex-col w-full bg-gray-500 rounded-t-md shadow-md overflow-hidden">
      <div className="w-full aspect-[4/3] overflow-hidden relative">
        <ResultsSlider
          date={property?.updated_at}
          region={property?.province}
          countrySlug={countrySlug}
          images={property?.images}
          market={market}
          deliveryDate={property?.vacantFromDate}
          propertyId={property?.external_id}
          propertyTitle={property?.headerAdvertisement}
          slug={slug}
        />
      </div>

      <div className="flex relative flex-col w-full bg-white text-slate-800">
        <span className="flex justify-center absolute m-1 p-1 rounded-3xl right-0 top-0 cursor-pointer z-10">
          <MdIosShare onClick={share} className="w-[20px] h-[20px]" />
          {copiedShowed && (
            <div className="flex justify-center items-center p-1 right-1 w-32 absolute h-10 bg-red-700">
              <p className="text-xs text-white text-center">Skopiowano link!</p>
            </div>
          )}
        </span>

        <Link href={detailHref}>
          <div>
            <div className="flex p-2 w-full h-14 lg:h-10 items-center mt-[8px]">
              <IoMdPin className="mr-[2px] w-5 md:w-6 md:h-5 lg:mt-6 lg:w-6 h-24 lg:h-28 text-yellow-600" />
              <p className="md:text-[16px] pl-1 md:pt-6 text-xs leading-4">
                <span className="text-[16px] font-semibold">
                  {regions[property?.province] || property?.province}
                </span>
                <br /> {property?.town}
              </p>
            </div>

            <div className="w-full md:h-28 lg:leading-6 md:pl-8 md:pt-8 pr-12 lg:text-[18px] text-[20px] leading-[24px] pl-8 py-[1px] font-semibold">
              <p>
                {property?.type && typeDictionary[property.type]
                  ? typeDictionary[property.type]
                  : "Nieruchomość"}
                &nbsp;w {property?.town}
              </p>
              <p className="text-[12px] mt-[10px]">
                nr ref. {property?.external_id}
              </p>
            </div>

            <div className="flex items-center justify-between w-full pt-[1px] bg-gray-900/[0.1]">
              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Sypialnie
                </p>
                <div className="flex md:flex-col h-10 lg:flex-row items-center justify-center">
                  <IoBedOutline className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.beds}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Łazienki
                </p>
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <PiBathtubLight className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.baths}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[24%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Basen
                </p>
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <FaSwimmingPool className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.pool === true ? "Tak" : "Nie"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Pow. całk.
                </p>
                <div className="flex items-center h-10 md:flex-col lg:flex-row justify-center">
                  <BiArea className="w-[35px] md:w-5 lg:w-8 pr-2 md:pr-0 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.surface_built}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white md:h-16 h-12 flex items-center text-2xl px-3 font-semibold border-t-yellow-500 border-t">
              <span className="ml-1 sm:text-xl text-2xl md:text-3xl text-right w-full text-yellow-500">
                {market === "RYNEK PIERWOTNY" && "od "}
                {Number(property?.price || 0).toLocaleString()} €
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
