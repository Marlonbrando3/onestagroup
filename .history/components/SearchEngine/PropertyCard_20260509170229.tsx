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
import { Red_Hat_DisplayFont } from "@/fonts/fonts";

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
    <div
      className={`${Red_Hat_DisplayFont.className} flex flex-col w-full rounded-xl shadow-lg overflow-hidden border-gray-900`}
    >
      <div className="w-full md:aspect-[4/3] aspect-[4/3] overflow-hidden relative ">
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

      <div className="flex relative flex-col w-full text-slate-800 ">
        <span className="flex justify-center absolute m-1 p-1 rounded-3xl right-0 top-0 cursor-pointer z-10 ">
          <MdIosShare onClick={share} className="w-[20px] h-[20px]" />
          {copiedShowed && (
            <div className="flex justify-center items-center p-1 right-1 w-32 absolute h-10 bg-red-700">
              <p className="text-xs text-white text-center">Skopiowano link!</p>
            </div>
          )}
        </span>

        <Link href={detailHref}>
          <div className="">
            <div className="flex pl-2 w-full h-14 lg:h-14 items-center mt-[1px] ">
              <IoMdPin className="mr-[2px] w-5 md:w-6 md:h-5 lg:w-6 h-24 lg:h-28 text-yellow-600" />
              <p className="md:text-[16px] pl-1 text-xs leading-4">
                <span className="text-[16px] font-semibold">
                  {regions[property?.province] || property?.province}
                </span>
                <br /> {property?.town}
              </p>
            </div>
            <div className="w-full md:h-16 lg:leading-6 md:pl-8 pr-12 lg:text-[18px] text-[20px] leading-[24px] pl-8 py-[1px] font-[800] ">
              <p>
                {property?.type && property.type in typeDictionary
                  ? typeDictionary[property.type as keyof typeof typeDictionary]
                  : "Nieruchomość"}
                &nbsp;w {property?.town}
              </p>
              <p className="text-[12px] mt-[2px] font-[600]">
                nr ref. {property?.external_id}
              </p>
            </div>

            <div className="flex items-center justify-between w-full pt-[1px]">
              <div className="flex flex-col items-center justify-center w-[25%] md:p-1 py-2">
                {/* <p className="w-full text-center hidden md:block text-sm">
                  Sypialnie
                </p> */}
                <div className="flex md:flex-col h-10 lg:flex-row items-center justify-center">
                  <IoBedOutline className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.beds}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[25%] md:p-1 py-2">
                {/* <p className="w-full text-center hidden md:block text-sm">
                  Łazienki
                </p> */}
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <PiBathtubLight className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.baths}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[24%] md:p-1 py-2">
                {/* <p className="w-full text-center hidden md:block text-sm">
                  Basen
                </p> */}
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <FaSwimmingPool className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.pool === true ? "Tak" : "Nie"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-[25%] md:p-1 py-2">
                {/* <p className="w-full text-center hidden md:block text-sm">
                  Pow. całk.
                </p> */}
                <div className="flex items-center h-10 md:flex-col lg:flex-row justify-center">
                  <BiArea className="w-[35px] md:w-5 lg:w-8 pr-2 md:pr-0 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base md:text-sm lg:pl-2">
                    {property?.surface_built}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-0 right-0  md:h-12 h-12 flex items-center text-2xl px-3 font-semibold border-t-yellow-500 rounded-t-md">
            <span className="ml-1 sm:text-xl text-2xl md:text-3xl text-right w-full text-yellow-600 font-[800] bg-whigrray-100te/[0.9]">
              {market === "RYNEK PIERWOTNY" &&
                property?.price!! 
                0(<p className="inline text-[20px] pr-[5px]">od</p>)}
              {Number(property?.price || 0).toLocaleString()} €
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
