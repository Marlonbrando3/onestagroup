import React from "react";
import { PlayfairSans, OutfitSans } from "@/fonts/fonts";
import { IoFlowerOutline } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { IoBed } from "react-icons/io5";
import { FaBath } from "react-icons/fa6";
import { FaSwimmingPool } from "react-icons/fa";
import ContactAgentInOffer from "./ContactAgentInOffer";
import ContactAgentInOfferMobile from "./ContactAgentInOfferMobile";

export default function DescAboutObiect({
  description,
  features,
  localization,
  bathrooms,
  bedrooms,
  pool,
  propertyPrice,
}) {
  const desc = { html: description };

  const translator = {
    Sauna: "Sauna",
    "Air conditioning": "Klimatyzacja",
    "Private pool": "Prywatny basen",
    "Swimming Pool": "Basen wspólnotowy",
    "Comminity Pool": "Basen wspólnotowy",
    Elevator: "Winda",
    Security: "Ochrona",
    "Golf course": "Golf",
    Solarium: "Solarium",
    Garden: "Ogórd",
    Furniture: "Umeblowane",
    "Storage room": "Magazyn",
    Heating: "Ogrzewanie",
    Bar: "Bar Restaruacja",
    "Storage unit": "Komórka lokatorska",
    "Street Views": "Wiodok na ulice",
    Spa: "Spa",
    Terrace: "Taras",
    Jaccuzi: "Jaccuzi",
    "Interior Windows": "Wewnętrze okna",
    "Exterior window": "Okna zewnętrzne",
    "Clear Views": "Czysty widok",
    "Sea Views": "Widok na morze",
    Basement: "Piwnica",
    Gymnasium: "Szkoła",
    "Garden Zones": "Obszary zielone",
    "Green Zones": "Obszary zielone",
  };

  console.log(features);

  const featuresComparision = features.map((i) => {
    if (translator[i] !== undefined)
      return (
        <div className="pr-[10px] md:text-[18px] text-[15px]">
          {translator[i]} &nbsp;|
        </div>
      );
  });

  console.log(localization);

  return (
    <div className="rounded-md lg:w-auto lg:mr-2 bg-white flex-1 text-[18px] tracking-[1.1px] font-[300] mx-[10px]">
      <div className="flex flex-wrap justify-start">
        {/* TITLE NAD LOCATION */}
        <div className="flex flex-col mb-[20px] md:text-[36px] text-[32px] leading-[34px] font-[400] min-h-[100px]">
          <div
            className={`${PlayfairSans.className} pb-[20px] font-[500] tracking-[0.6px] scale-x-[0.9] scale-y-[1.04] -ml-[27px]`}
          >
            Bungalowy w Torre de La Horadada
          </div>
          <div className="flex h-full items-center">
            <div className="h-full">
              <IoLocationSharp className="text-yellow-500 w-[40px] h-[40px]" />
            </div>
            <div className="h-full">
              {" "}
              <p className="text-[18px] leading-[18px] font-[600]">Hiszpania</p>
              <p className="text-[18px]">Costa Blanca, Torre de la Horadada</p>
              {/* <div className="text-[18px]">2 sypilanie, 2 łazienki, basen</div> */}
            </div>
          </div>
        </div>
        {/* PRICE AND MAIN FEATURES */}
        <div className="flex flex-1 min-w-[300px] flex-col mb-[20px] text-[29px] font-[400]  xl:text-right lg:text-left min-h-[100px] md:pl-[20px]">
          <p className="font-[700] text-[42px] text-yellow-500">
            {propertyPrice.toLocaleString().replaceAll(",", " ")} €
          </p>
          <div className="flex xl:justify-end lg:justify-start mt-[20px] flex-wrap">
            <div className="text-[18px] flex  items-center">
              <IoBed className="h-full w-[22px] text-yellow-500" />
              <p className="px-[7px]">{bathrooms} sypilanie</p>
            </div>
            <div className="text-[18px] flex  items-center">
              <FaBath className="h-full w-[22px] text-yellow-500" />
              <p className="px-[7px]">{bathrooms} łazienki</p>
            </div>
            {pool === true && (
              <div className="text-[18px] flex  items-center">
                <FaSwimmingPool className="h-full w-[22px] text-yellow-500" />
                <p className="px-[7px]">basen</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContactAgentInOfferMobile />
      <div className="w-full border-b-[1px] border-gray-300 clear-both"></div>
      <p className="font-[600] md:text-[18px] text-[15px] my-4">
        {" "}
        CECHY NIERUCHOMOŚCI
      </p>
      <div className="flex flex-wrap mb-[20px]">{featuresComparision}</div>
      <div className="w-full border-b-[1px] border-gray-300"></div>
      <p className="font-[600] md:text-[18px] text-[15px] my-4">
        {" "}
        OPIS PROJEKTU
      </p>
      <p
        dangerouslySetInnerHTML={{ __html: description }}
        className="md:text-[18px] text-[15px] md:leading-[30px] leading-[22px]  font-[300] tracking-[1.1px] mb-[20px]"
      ></p>
      <p className="font-[600] md:text-[18px] text-[15px] my-4"> LOKALIZACJA</p>
      <div className="w-full border-b-[1px] border-gray-300"></div>
      <div className="w-full h-[240px] relative">
        <iframe
          src={`https://www.google.com/maps?q=${localization.lat},${localization.lng}&output=embed&z=11`}
          // width="408"
          // height="200"
          loading="lazy"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}
