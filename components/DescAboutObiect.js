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
  typeDictionarySingular,
  validTitleOrEmpty,
} from "@/lib/titlesDictionary";
import { getCoastLabelFromProvince, getCountryLabel } from "@/lib/regionMap";
import { countryLabel, propertyTypeLabel } from "@/lib/i18n";

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
  locale = "pl",
}) {
  const isEn = locale === "en";
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [descriptionView, setDescriptionView] = useState("default");
  const [translating, setTranslating] = useState(false);

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatDescription = (value) => {
    const normalized = String(value || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/<(ul|ol)[^>]*>\s*/gi, "<$1>")
      .replace(/\s*<\/(ul|ol)\s*>/gi, "</$1>")
      .replace(/<\/li\s*>\s*<li/gi, "</li><li")
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<p[^>]*>\s*<\/p\s*>/gi, "\n\n")
      .replace(/<h[1-6][^>]*>/gi, "\n\n")
      .replace(/<\/h[1-6]\s*>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<\/li\s*>/gi, "")
      .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
      .replace(/<\/p\s*>/gi, "\n\n")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/div\s*>/gi, "\n")
      .replace(/<div[^>]*>/gi, "")
      .replace(/<\/?(strong|b|em|i)[^>]*>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .trim();

    if (!normalized) return "";

    return normalized
      .split(/\n{2,}/)
      .map((paragraph) => {
        const lines = paragraph
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (!lines.length) return "";

        const content = lines.map((line) => escapeHtml(line)).join("<br />");
        const isHeading =
          lines.length === 1 &&
          !lines[0].startsWith("•") &&
          lines[0].length < 60 &&
          lines[0].length > 3;
        return isHeading
          ? `<p><strong>${content}</strong></p>`
          : `<p>${content}</p>`;
      })
      .filter(Boolean)
      .join("<br />");
  };

  const { type, town, price, country, province, title, headerAdvertisement } =
    propertyData;
  const typeLabel =
    propertyTypeLabel[locale]?.[type] ||
    typeDictionarySingular[type] ||
    (isEn ? "Property" : "Nieruchomość");
  const listingTitle =
    validTitleOrEmpty(title) ||
    validTitleOrEmpty(headerAdvertisement) ||
    (isEn
      ? `${typeLabel} in ${town || "Spain"}`
      : `${typeLabel} w ${town || "Hiszpanii"}`);
  const displayedCountryLabel =
    countryLabel[locale]?.[country] ||
    countryLabel[locale]?.[String(country || "").toLowerCase()] ||
    getCountryLabel(country) ||
    (isEn ? "Spain" : "Hiszpania");
  const coastLabel = getCoastLabelFromProvince(province);
  const locationLine = [coastLabel, town].filter(Boolean).join(", ");

  const translator = {
    Sauna: "Sauna",
    "Air conditioning": "Klimatyzacja",
    "air-conditioning": "Klimatyzacja",
    "Private pool": "Prywatny basen",
    "private-pool": "Prywatny basen",
    "Swimming Pool": "Basen wspólnotowy",
    "Comminity Pool": "Basen wspólnotowy",
    "swimming-pool": "Basen wspólnotowy",
    "community-pool": "Basen wspólnotowy",
    Elevator: "Winda",
    elevator: "Winda",
    Security: "Ochrona",
    security: "Ochrona",
    "Golf course": "Golf",
    "golf-course": "Pole golfowe",
    Solarium: "Solarium",
    solarium: "Solarium",
    Garden: "Ogórd",
    garden: "Ogród",
    Furniture: "Umeblowane",
    furniture: "Umeblowane",
    "Storage room": "Magazyn",
    "storage-room": "Magazyn",
    Heating: "Ogrzewanie",
    heating: "Ogrzewanie",
    Bar: "Bar Restaruacja",
    "Storage unit": "Komórka lokatorska",
    "Street Views": "Wiodok na ulice",
    "street-views": "Widok na ulicę",
    Spa: "Spa",
    Terrace: "Taras",
    terrace: "Taras",
    Jaccuzi: "Jaccuzi",
    jacuzzi: "Jacuzzi",
    "Interior Windows": "Wewnętrze okna",
    "interior-windows": "Okna wewnętrzne",
    "Exterior window": "Okna zewnętrzne",
    "Clear Views": "Czysty widok",
    "clear-views": "Otwarty widok",
    "Sea Views": "Widok na morze",
    "Widok na morze": "Widok na morze",
    "sea-view": "Widok na morze",
    GARAŻ: "Garaż",
    Basement: "Piwnica",
    basements: "Piwnica",
    Gymnasium: "Szkoła",
    gym: "Siłownia",
    "Garden Zones": "Obszary zielone",
    "Green Zones": "Obszary zielone",
    "garden-areas": "Strefy zielone",
    "landscaped-areas": "Zagospodarowane tereny zielone",
    balcon: "Balkon",
    "built-in-closets": "Szafy w zabudowie",
    "community-parking": "Parking wspólnotowy",
    "electric-vehicle-charging-station":
      "Stacja ładowania samochodów elektrycznych",
    "indoor-pool": "Basen wewnętrzny",
    "internet-installation": "Instalacja internetowa",
    "kitchen-with-island": "Kuchnia z wyspą",
    "mountain-views": "Widok na góry",
    mountains: "Góry",
    "off-street-parking": "Parking prywatny",
    "padel-court": "Kort do padla",
    playground: "Plac zabaw",
    "private-parking": "Prywatny parking",
    "shower-cabin": "Kabina prysznicowa",
    "solar-energy": "Energia słoneczna",
    "study-room": "Gabinet",
    "tv-antenna": "Antena TV",
    "underground-parking": "Parking podziemny",
    "video-door-entry": "Wideodomofon",
  };

  const normalizedFeatures = Array.isArray(features)
    ? features
    : typeof features === "string"
      ? [features]
      : [];

  const featuresComparision = normalizedFeatures.map((i) => {
    if (isEn) {
      return (
        <div className="pr-[10px] md:text-[18px] text-[15px]">
          {String(i).replace(/-/g, " ")} &nbsp;|
        </div>
      );
    }
    if (translator[i] !== undefined)
      return (
        <div className="pr-[10px] md:text-[18px] text-[15px]">
          {translator[i]} &nbsp;|
        </div>
      );
  });

  const formattedDescriptionEN = formatDescription(descriptionEN);
  const formattedDescription = formatDescription(description);
  const hasPolishDescription = Boolean(
    description && String(description).trim(),
  );

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
        : isEn
          ? formattedDescriptionEN || finalFormattedDescription
          : finalFormattedDescription;

  const hasCoordinates =
    localization?.lat !== null &&
    localization?.lat !== undefined &&
    localization?.lng !== null &&
    localization?.lng !== undefined &&
    localization?.lat !== "" &&
    localization?.lng !== "";

  const mapQuery = hasCoordinates
    ? `${localization.lat},${localization.lng}`
    : `${town || ""}, ${displayedCountryLabel}`;

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
                {displayedCountryLabel}
              </p>
              <p className="text-[20px]">{locationLine || listingTitle}</p>
              {/* <div className="text-[18px]">2 sypilanie, 2 łazienki, basen</div> */}
            </div>
          </div>
        </div>
        {/* PRICE AND MAIN FEATURES */}
        <div className="flex flex-1 min-w-[300px] flex-col text-[29px] font-[400] sm:text-right  min-h-[100px] md:pl-[20px]">
          <p className="font-[700] text-[46px] text-yellow-500 leading-[30px]">
            {price !== 0
              ? `${propertyPrice.toLocaleString().replaceAll(",", " ")} €`
              : isEn
                ? "consultation"
                : "konsutacja"}
          </p>
          <div className="flex sm:justify-end lg:mt-[20px] flex-wrap">
            <div className="text-[18px] flex items-center">
              <IoBed className="h-full w-[22px] text-yellow-500" />
              <p className="px-[7px]">
                {bedrooms} {isEn ? "bedrooms" : "sypialnie"}
              </p>
            </div>
            <div className="text-[18px] flex  items-center">
              <FaBath className="h-full w-[22px] text-yellow-500" />
              <p className="px-[7px]">
                {bathrooms} {isEn ? "bathrooms" : "łazienki"}
              </p>
            </div>
            {pool === true && (
              <div className="text-[18px] flex  items-center">
                <FaSwimmingPool className="h-full w-[22px] text-yellow-500" />
                <p className="px-[7px]">{isEn ? "pool" : "basen"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContactAgentInOfferMobile locale={locale} />
      <div className="w-full border-b-[1px] border-gray-300 clear-both"></div>
      <p className="font-[600] md:text-[18px] text-[15px] my-4">
        {" "}
        {isEn ? "PROPERTY FEATURES" : "CECHY NIERUCHOMOŚCI"}
      </p>
      <div className="flex flex-wrap mb-[20px]">{featuresComparision}</div>
      <div className="w-full border-b-[1px] border-gray-300"></div>
      <div className="my-4 flex items-center justify-between gap-3">
        <p className="font-[600] md:text-[18px] text-[15px]">
          {isEn ? "PROJECT DESCRIPTION" : "OPIS PROJEKTU"}
        </p>
        <div className="flex items-center gap-2">
          {!isEn && !hasPolishDescription && (
            <button
              type="button"
              onClick={handleTranslateToPolish}
              disabled={translating || !rawDescriptionToTranslate}
              className={`text-[13px] md:text-[14px] px-3 py-1 rounded-md bg-green-800 text-gray-600 font-bold inline-flex items-center gap-2 border ${
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
          )}
          {!isEn && (
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
          )}
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: displayedDescription,
        }}
        className="prose whitespace-normal md:text-[18px] text-[15px] md:leading-[30px] leading-[22px] font-[300] tracking-[1.1px] mb-[20px]"
      ></div>
      <p className="font-[600] md:text-[18px] text-[15px] my-4">
        {isEn ? " LOCATION" : " LOKALIZACJA"}
      </p>
      <div className="w-full border-b-[1px] border-gray-300"></div>
      <div className="w-full h-[240px] relative">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=11`}
          // width="408"
          // height="200"
          loading="lazy"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}
