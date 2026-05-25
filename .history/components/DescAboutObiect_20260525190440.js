import React, { useMemo, useState } from "react";
import { PlayfairSans, OutfitSans } from "@/fonts/fonts";
import { IoFlowerOutline } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { IoBed } from "react-icons/io5";
import { FaBath } from "react-icons/fa6";
import { FaSwimmingPool } from "react-icons/fa";
import ContactAgentInOffer from "./ContactAgentInOffer";
import ContactAgentInOfferMobile from "./ContactAgentInOfferMobile";
import {
  typeDictionaryPlural,
  typeDictionarySingular,
  countryDictionary,
} from "@/lib/titlesDictionary";

export default function DescAboutObiect({
  propertyData,
  description,
  descriptionEN,
  features,
  localization,
  bathrooms,
  bedrooms,
  pool,
  propertyPrice,
}) {
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [descriptionView, setDescriptionView] = useState("default");
  const [translating, setTranslating] = useState(false);

  const formatDescription = (value) =>
    value
      ?.split("\n")
      .map((line) => {
        const trimmed = line.trim();

        if (!trimmed) return "<br>";
        if (trimmed.length < 40 && trimmed.length > 3) {
          return `<br><strong>${trimmed}</strong><br>`;
        }
        return `${trimmed}<br>`;
      })
      .join("") || "";

  const { type, town, price, beds, bath, country, new_build } = propertyData;
  const typeLabel = new_build
    ? typeDictionaryPlural[type] || "Nieruchomości"
    : typeDictionarySingular[type] || "Nieruchomość";

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

  const normalizedFeatures = Array.isArray(features)
    ? features
    : typeof features === "string"
      ? [features]
      : [];

  const featuresComparision = normalizedFeatures.map((i) => {
    if (translator[i] !== undefined)
      return (
        <div className="pr-[10px] md:text-[18px] text-[15px]">
          {translator[i]} &nbsp;|
        </div>
      );
  });

  const formattedDescriptionEN = formatDescription(descriptionEN);
  const formattedDescription = formatDescription(description);

  const finalFormattedDescription =
    formattedDescription && formattedDescription.trim()
      ? formattedDescription
      : formattedDescriptionEN && formattedDescriptionEN.trim()
        ? formattedDescriptionEN
        : "";

  const rawDescriptionToTranslate = useMemo(() => {
    const source =
      description && String(description).trim() ? description : descriptionEN;
    return source && String(source).trim() ? String(source) : "";
  }, [description, descriptionEN]);

  const handleTranslateToPolish = async () => {
    if (!rawDescriptionToTranslate || translating) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translateToPolish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawDescriptionToTranslate }),
      });
      const data = await res.json();
      if (!res.ok || !data?.text) {
        alert(data?.error || "Nie udało się przetłumaczyć opisu");
        return;
      }
      setTranslatedDescription(formatDescription(data.text));
      setDescriptionView("translated");
    } catch {
      alert("Nie udało się przetłumaczyć opisu");
    } finally {
      setTranslating(false);
    }
  };

  const handleShowEnglish = () => {
    setDescriptionView("english");
  };

  const displayedDescription =
    descriptionView === "translated" && translatedDescription
      ? translatedDescription
      : descriptionView === "english"
        ? formattedDescriptionEN || finalFormattedDescription
        : finalFormattedDescription;

  return (
    <div className="rounded-md lg:w-auto lg:mr-2 bg-white flex-1 text-[18px] tracking-[1.1px] font-[300] mx-[10px]">
      <div className="flex flex-wrap justify-start">
        {/* TITLE NAD LOCATION */}
        <div className="flex flex-col md:text-[36px] text-[32px] leading-[34px] font-[400] min-h-[100px]">
          <div className="flex h-full items-center">
            <div className="h-full">
              <IoLocationSharp className="text-yellow-500 w-[40px] h-[40px]" />
            </div>
            <div className="h-full">
              {" "}
              <p className="text-[18px] leading-[18px] font-[600]">
                {country && country in countryDictionary
                  ? countryDictionary[country]
                  : "any"}
              </p>
              <p className="text-[20px]">Costa Blanca, {town}</p>
              {/* <div className="text-[18px]">2 sypilanie, 2 łazienki, basen</div> */}
            </div>
          </div>
        </div>
        {/* PRICE AND MAIN FEATURES */}
        <div className="flex flex-1 min-w-[300px] flex-col text-[29px] font-[400] sm:text-right  min-h-[100px] md:pl-[20px]">
          <p className="font-[700] text-[46px] text-yellow-500 leading-[30px]">
            {price !== 0
              ? `${propertyPrice.toLocaleString().replaceAll(",", " ")} €`
              : "konsutacja"}
          </p>
          <div className="flex sm:justify-end lg:mt-[20px] flex-wrap">
            <div className="text-[18px] flex items-center">
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
      <div className="my-4 flex items-center justify-between gap-3">
        <p className="font-[600] md:text-[18px] text-[15px]">OPIS PROJEKTU</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTranslateToPolish}
            disabled={translating || !rawDescriptionToTranslate}
            className={`text-[13px] md:text-[14px] px-3 py-1 rounded-md bg-green-500 text-white font-bold inline-flex items-center gap-2 border ${
              translating || !rawDescriptionToTranslate
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-200 hover:text-gray-800"
            }`}
          >
            {translating ? "Tłumaczenie..." : "Język Polski"}
            <span
              aria-hidden="true"
              className="inline-block w-[18px] h-[12px] border border-gray-300 overflow-hidden rounded-[1px]"
            >
              <span className="block w-full h-1/2 bg-white" />
              <span className="block w-full h-1/2 bg-red-600" />
            </span>
          </button>
          <button
            type="button"
            onClick={handleShowEnglish}
            className="text-[13px] md:text-[14px] px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-yellow-200 hover:text-gray-800 font-bold inline-flex items-center gap-2"
          >
            English description
            <span
              aria-hidden="true"
              className="inline-block w-[18px] h-[12px] border border-gray-300 overflow-hidden rounded-[1px]"
            >
              <span className="block w-full h-1/3 bg-[#012169]" />
              <span className="block w-full h-1/3 bg-white" />
              <span className="block w-full h-1/3 bg-[#C8102E]" />
            </span>
          </button>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: displayedDescription,
        }}
        className="prose whitespace-normal md:text-[18px] text-[15px] md:leading-[30px] leading-[22px] font-[300] tracking-[1.1px] mb-[20px]"
      ></div>
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
