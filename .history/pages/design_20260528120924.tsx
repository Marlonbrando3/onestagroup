import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBed,
  FaChevronLeft,
  FaChevronRight,
  FaConciergeBell,
  FaHandshake,
  FaKey,
} from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import {
  MdCleaningServices,
  MdFactCheck,
  MdHealthAndSafety,
  MdOutlineAssignment,
  MdOutlineBedroomParent,
  MdOutlineHomeWork,
  MdOutlineLocalOffer,
  MdOutlineManageSearch,
  MdOutlineRealEstateAgent,
  MdOutlineVerified,
} from "react-icons/md";
import locationsData from "@/data/locations.json";
import { MontserratSans, Mulish_Font } from "@/fonts/fonts";
import { supabase, supabaseServer } from "@/lib/supabaseClient";

type DesignProperty = {
  external_id: string | number;
  price: number | null;
  town: string | null;
  province: string | null;
  images: Array<string | { url?: string }> | string | null;
  type?: string | null;
  headerAdvertisement?: string | null;
  country?: string | null;
};

type DesignPageProps = {
  offers: DesignProperty[];
};

type DesignMainFormData = {
  Name: string;
  Email: string;
  Phone: string;
  Message: string;
  purchaseThisYear: string;
  region: string;
  budget: string;
};

const purchaseTimingOptions = ["Tak", "Nie"];

const regionOptions = [
  "Costa Blanca/Costa Cálida",
  "Costa del Sol",
  "Costa de Almeria",
  "Jeszcze nie zdecydowałem/am",
];

const budgetOptions = [
  "250 000 - 300 000",
  "300 000 - 350 000",
  "350 000 - 450 000",
  "450 000 i więcej",
];

const stepCards = [
  {
    number: "1",
    claim: "Szerokie portfolio ofert",
    text: (
      <>
        Współpracujemy ze <strong>wszystkimi deweloperami</strong> na wybrzeżach{" "}
        <strong>Costa Blanca, Costa Calida, Costa del Sol</strong> oraz{" "}
        <strong>PONAD 100 agencjami lokalnymi</strong> oferując szeroki dostęp
        do blisko <strong>3000 ofert z rynku wtórnego.</strong>
      </>
    ),
  },
  {
    number: "2",
    claim: "Kompletny proces",
    text: (
      <>
        Prowadzimy <strong>proces zakupu nieruchomości</strong> począwszy od{" "}
        <strong>prezentacji</strong> przez{" "}
        <strong>weryfikację dokumentów</strong>, wyrobienie numeru{" "}
        <strong>N.I.E</strong>, <strong>konta w banku</strong> formalizację
        zakupu zakończoną <strong>aktem notarialnym.</strong>
      </>
    ),
  },
  {
    number: "3",
    claim: "Projektowanie wnętrz",
    text: (
      <>
        Na życzenie <strong>projektujemy wnętrza</strong> i{" "}
        <strong>meblujemy nieruchomości</strong> po czym jest ona gotowa do
        zamieszkania lub dalszego <strong>zarządzania najmem</strong> również
        prowadzonego przez odpowiedni dział w ramach naszej grupy.
      </>
    ),
  },
  {
    number: "4",
    claim: "Zarządzanie najmem",
    text: (
      <>
        W ramach <strong>zarządzania najmem</strong> korzystamy z{" "}
        <strong>własnego portalu</strong> i/lub popularnych tj.{" "}
        <strong>Booking, Airbnb</strong> oraz rekomendacji.
      </>
    ),
  },
];

const rentServices = [
  {
    text: "Profesjonalne sprzątanie po każdej rezerwacji",
    Icon: MdCleaningServices,
  },
  {
    text: "Wymiana i przygotowanie pościeli, ręczników oraz",
    Icon: FaBed,
  },
  {
    text: "Sprawdzenie wyposażenia i czystości przed przyjazdem",
    Icon: MdFactCheck,
  },
  {
    text: "Standard hotelowy + zestaw środków higienicznych",
    Icon: MdHealthAndSafety,
  },
  {
    text: "Przygotowanie dokumentów do rejestracji gości w Guarda Civil",
    Icon: MdOutlineAssignment,
  },
  {
    text: "Dbałość o jakość doświadczenia gości i budowanie",
    Icon: IoSparklesOutline,
  },
  {
    text: "Usługę rezydenta oraz pakiet powitalny dla gości",
    Icon: FaConciergeBell,
  },
];

const whyUs: Array<{ text: React.ReactNode; Icon: IconType }> = [
  {
    text: (
      <>
        <strong>Ponad 8 lat doświadczenia</strong> na rynku Hiszpańskim.
      </>
    ),
    Icon: MdOutlineVerified,
  },
  {
    text: (
      <>
        Reprezentowanie Państwa pośród{" "}
        <strong>agencji i/lub deweloperów.</strong>
      </>
    ),
    Icon: MdOutlineRealEstateAgent,
  },
  {
    text: (
      <>
        Możliwość <strong>zakupu nieruchomości z innych portali</strong> (np.
        idealista).
      </>
    ),
    Icon: MdOutlineManageSearch,
  },
  {
    text: (
      <>
        <strong>BRAK PROWIZJI</strong>
        <br></br> ze strony kupującej nieruchomość.
      </>
    ),
    Icon: FaHandshake,
  },
  {
    text: (
      <>
        Nastawienie <strong>na realizację Państwa celu</strong>, nie celu
        sprzedaży.
      </>
    ),
    Icon: FaKey,
  },
  {
    text: (
      <>
        <strong>Szeroką bazę ofert</strong>, z rynku pierwotnego i wtórnego.
      </>
    ),
    Icon: MdOutlineHomeWork,
  },
  {
    text: (
      <>
        Preselekcję ofert, ich prezentacje na miejscu,{" "}
        <strong>kompletny proces zakupu</strong>.
      </>
    ),
    Icon: MdOutlineLocalOffer,
  },
  {
    text: (
      <>
        <strong>Umeblowanie oraz dalsze zarządzanie najmem</strong>{" "}
        (opcjonalnie)
      </>
    ),
    Icon: MdOutlineBedroomParent,
  },
  {
    text: (
      <>
        <strong>Zaplecze prawne</strong> w procesie zakupu.
      </>
    ),
    Icon: MdFactCheck,
  },
];

const galleryImages = [
  {
    src: "/ex/image.png",
    fallback: "/contactformbg.webp",
    className:
      "h-[240px] md:aspect-video md:h-auto lg:col-span-4 lg:row-span-2 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_2.png",
    fallback: "/middleOne.webp",
    className:
      "h-[220px] md:aspect-video md:h-auto lg:col-span-2 lg:row-span-1 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_3.png",
    fallback: "/main_img_video.webp",
    className:
      "h-[360px] md:aspect-video md:h-auto lg:col-span-2 lg:row-span-3 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_4.png",
    fallback: "/bg_about.jpeg",
    className:
      "h-[240px] md:aspect-video md:h-auto lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_5.png",
    fallback: "/Higuericas/planes_1.png",
    className:
      "h-[240px] md:aspect-video md:h-auto lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_6.png",
    fallback: "/Higuericas/Location.jpg",
    className:
      "h-[240px] md:aspect-video md:h-auto lg:col-span-4 lg:row-span-2 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_7.png",
    fallback: "/contactformbg.png",
    className:
      "h-[330px] md:aspect-video md:h-auto lg:col-span-2 lg:row-span-3 lg:aspect-auto lg:h-auto",
  },
  {
    src: "/ex/image_8.png",
    fallback: "/bg_main_site_2.png",
    className:
      "h-[240px] md:aspect-video md:h-auto lg:col-span-4 lg:row-span-2 lg:aspect-auto lg:h-auto",
  },
];

function AccentHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-[12px] ${className}`}>
      {/* <span className="mt-[5px] h-[43px] w-[5px] shrink-0 bg-[#f15b2a] lg:h-[80px] lg:w-[7px]" /> */}
      <h2 className="text-[25px] font-[400] leading-[1.12] tracking-[0.8px] lg:text-[30px]">
        {children}
      </h2>
    </div>
  );
}

function YellowPill({
  children,
  Icon,
}: {
  children: React.ReactNode;
  Icon?: IconType;
}) {
  return (
    <div className="flex items-center gap-[12px] rounded-[16px] bg-[#ffc329] px-[16px] py-[11px] text-[14px] font-[600] leading-[1.35] shadow-[0_2px_0_rgba(0,0,0,0.08)] lg:gap-[18px] lg:rounded-[22px] lg:px-[28px] lg:py-[18px] lg:text-[22px]">
      {Icon && (
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white/75 text-[#f15b2a] lg:h-[48px] lg:w-[48px]">
          <Icon className="text-[18px] lg:text-[26px]" />
        </span>
      )}
      {children}
    </div>
  );
}

function RentServiceCard({ text, Icon }: { text: string; Icon: IconType }) {
  return (
    <div className="flex min-h-[108px] items-center rounded-[22px] bg-[#ffc329] p-[16px] text-left shadow-[0_2px_0_rgba(0,0,0,0.08)] lg:aspect-square lg:min-h-0 lg:flex-col lg:justify-center lg:rounded-[30px] lg:p-[28px] lg:text-center ">
      <span className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-white/75 text-[#f15b2a] lg:h-[78px] lg:w-[78px]">
        <Icon className="text-[34px] lg:text-[42px]" />
      </span>
      <p className="ml-[16px] text-[17px] font-[700] leading-[1.25] lg:ml-0 lg:mt-[22px] xl:text-[20px] min-[1024px]:text-[16px]">
        {text}
      </p>
    </div>
  );
}

function OfferBenefitCard({
  text,
  Icon,
}: {
  text: React.ReactNode;
  Icon: IconType;
}) {
  return (
    <div className="flex min-h-[108px] items-center p-[16px] text-left lg:min-h-0 lg:flex-row lg:justify-center lg:px-[28px] lg:text-left  border-[#FFC32A]">
      <span className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-yellow-500 text-[#f15b2a] lg:h-[78px] lg:w-[78px] mr-[20px]">
        <Icon className="text-[34px] lg:text-[42px] text-white" />
      </span>
      <p className="ml-[16px] text-[17px] font-[400] leading-[1.25] lg:ml-0 xl:text-[20px] min-[1024px]:text-[16px]">
        {text}
      </p>
    </div>
  );
}

function GalleryImage({
  image,
  index,
}: {
  image: (typeof galleryImages)[number];
  index: number;
}) {
  const [src, setSrc] = useState(image.src);

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] bg-[#f3e8df] lg:rounded-[34px] ${image.className}`}
    >
      <Image
        src={src}
        alt={`Przykład umeblowania apartamentu ${index + 1}`}
        fill
        sizes="(max-width: 1024px) 50vw, 430px"
        className="object-cover"
        onError={() => {
          if (src !== image.fallback) {
            setSrc(image.fallback);
          }
        }}
      />
    </div>
  );
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .trim();
}

function getCoastLabel(town?: string | null, province?: string | null) {
  const provinceCoasts: Record<string, string> = {
    Murcia: "Costa Calida",
    Alicante: "Costa Blanca",
    Malaga: "Costa del Sol",
    Málaga: "Costa del Sol",
    Almería: "Costa de Almeria",
  };

  if (town) {
    const townLocation = locationsData.find(
      (location) =>
        (location.type === "town" || location.type === "city") &&
        normalizeText(location.name) === normalizeText(town),
    );

    let parentId = townLocation?.parentId;
    while (parentId) {
      const parent = locationsData.find((location) => location.id === parentId);
      if (!parent) break;
      if (parent.type === "coast") return parent.name;
      parentId = parent.parentId;
    }
  }

  return province ? provinceCoasts[province] || province : "Hiszpania";
}

function getOfferImages(images: DesignProperty["images"]) {
  const parsed =
    typeof images === "string"
      ? (() => {
          try {
            return JSON.parse(images);
          } catch {
            return [images];
          }
        })()
      : images;

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((image) => {
      if (typeof image === "string") return image;
      if (image && typeof image === "object" && "url" in image) {
        return image.url;
      }
      return "";
    })
    .filter((image): image is string => typeof image === "string")
    .map((image) => image.replace(/&amp;/g, "&").trim())
    .filter(Boolean);
}

function scrollToDesignForm() {
  document
    .getElementById("design-contact-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function OfferInquiryForm({
  offer,
  onBack,
}: {
  offer: DesignProperty;
  onBack: () => void;
}) {
  const [dataForm, setDataForm] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Message: "",
  });
  const [contactTime, setContactTime] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const toggleTime = (slot: string) => {
    setContactTime((prev) =>
      prev.includes(slot)
        ? prev.filter((value) => value !== slot)
        : [...prev, slot],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!privacy) {
      alert("Zaakceptuj politykę prywatności.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Ref: `Oferta ${offer.external_id}`,
          dataForm: {
            ...dataForm,
            Message: `${dataForm.Message}\n\nOferta: ${offer.external_id}\nLokalizacja: ${
              offer.town || ""
            }, ${getCoastLabel(offer.town, offer.province)}\nCena: ${
              offer.price
                ? `${Number(offer.price).toLocaleString("pl-PL")} EUR`
                : "brak"
            }\nPreferowana pora kontaktu: ${
              contactTime.join(", ") || "brak"
            }\nZgoda marketingowa: ${marketing ? "tak" : "nie"}`,
          },
          consents: { privacy, marketing },
          source: "/design",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onClick={(event) => event.stopPropagation()}
      onSubmit={handleSubmit}
      className="flex min-h-[498px] flex-col rounded-[24px] bg-[#f3e8df] p-[18px] shadow-[0_12px_34px_rgba(0,0,0,0.12)] lg:min-h-[476px] lg:rounded-[38px] lg:p-[24px]"
    >
      <div className="flex items-start justify-between gap-[14px]">
        <div>
          <p className="text-[12px] font-[800] uppercase tracking-[0.8px] text-[#f15b2a]">
            Zapytanie o ofertę
          </p>
          <h3 className="mt-[4px] text-[22px] font-[900] leading-[1.05] lg:text-[28px]">
            nr ref. {offer.external_id}
          </h3>
          <p className="mt-[5px] text-[13px] font-[700] text-black/55">
            {offer.town || "Hiszpania"} ·{" "}
            {getCoastLabel(offer.town, offer.province)}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-white px-[12px] py-[7px] text-[12px] font-[800]"
        >
          Wróć
        </button>
      </div>

      <div className="mt-[15px] grid grid-cols-1 gap-[9px]">
        <input
          required
          type="text"
          placeholder="Imię i nazwisko *"
          value={dataForm.Name}
          onChange={(event) =>
            setDataForm((prev) => ({ ...prev, Name: event.target.value }))
          }
          className="h-[39px] rounded-[10px] border border-black/10 bg-white px-[12px] text-[13px] outline-none"
        />
        <div className="grid grid-cols-1 gap-[9px] md:grid-cols-2">
          <input
            required
            type="email"
            placeholder="Adres e-mail *"
            value={dataForm.Email}
            onChange={(event) =>
              setDataForm((prev) => ({ ...prev, Email: event.target.value }))
            }
            className="h-[39px] rounded-[10px] border border-black/10 bg-white px-[12px] text-[13px] outline-none"
          />
          <input
            required
            type="tel"
            placeholder="Telefon *"
            value={dataForm.Phone}
            onChange={(event) =>
              setDataForm((prev) => ({ ...prev, Phone: event.target.value }))
            }
            className="h-[39px] rounded-[10px] border border-black/10 bg-white px-[12px] text-[13px] outline-none"
          />
        </div>
        <textarea
          placeholder="Wiadomość"
          value={dataForm.Message}
          onChange={(event) =>
            setDataForm((prev) => ({ ...prev, Message: event.target.value }))
          }
          className="h-[78px] resize-none rounded-[10px] border border-black/10 bg-white px-[12px] py-[10px] text-[13px] outline-none"
        />
      </div>

      <div className="mt-[13px]">
        <p className="text-[12px] font-[700] text-black/70">
          Dogodna pora kontaktu:
        </p>
        <div className="mt-[8px] flex flex-wrap gap-[12px]">
          {["9-13", "13-17", "17-21"].map((slot) => (
            <label
              key={slot}
              className="inline-flex items-center gap-[7px] text-[12px] font-[700]"
            >
              <input
                type="checkbox"
                checked={contactTime.includes(slot)}
                onChange={() => toggleTime(slot)}
                className="h-[15px] w-[15px]"
              />
              {slot}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-[13px] flex flex-col gap-[8px] text-[11px] font-[600] leading-[1.35] text-black/70">
        <label className="flex items-start gap-[8px]">
          <input
            required
            type="checkbox"
            checked={privacy}
            onChange={(event) => setPrivacy(event.target.checked)}
            className="mt-[2px] h-[15px] w-[15px] shrink-0"
          />
          <span>
            Oświadczam, że zapoznałem/am się z{" "}
            <Link href="/polityka-prywatnosci" className="underline">
              Polityką Prywatności
            </Link>
            .
          </span>
        </label>
        <label className="flex items-start gap-[8px]">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)}
            className="mt-[2px] h-[15px] w-[15px] shrink-0"
          />
          <span>Wyrażam zgodę na kontakt marketingowy.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending" || status === "sent"}
        className="mt-auto h-[42px] rounded-full bg-black text-[13px] font-[900] uppercase tracking-[0.4px] text-white disabled:opacity-70"
      >
        {status === "sending"
          ? "Wysyłam..."
          : status === "sent"
            ? "Wysłano"
            : status === "error"
              ? "Spróbuj ponownie"
              : "Wyślij"}
      </button>
    </form>
  );
}

function SurveySelect({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-[64px] w-full whitespace-normal rounded-[13px] border border-black/10 bg-white px-[14px] py-[8px] text-[12px] font-[600] leading-[1.25] outline-none lg:min-h-[72px] lg:rounded-[18px] lg:px-[18px] lg:text-[15px]"
    >
      <option value="" disabled>
        {title}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function DesignContactForm() {
  const [step, setStep] = useState<"contact" | "survey">("contact");
  const [dataForm, setDataForm] = useState<DesignMainFormData>({
    Name: "",
    Email: "",
    Phone: "",
    Message: "",
    purchaseThisYear: "",
    region: "",
    budget: "",
  });
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [surveyStatus, setSurveyStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const updateField = (field: keyof DesignMainFormData, value: string) => {
    setDataForm((prev) => ({ ...prev, [field]: value }));
  };

  const sendDesignLead = async (message: string, ref: string) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Ref: ref,
        dataForm: {
          Name: dataForm.Name,
          Email: dataForm.Email,
          Phone: dataForm.Phone,
          Message: message,
        },
        consents: { privacy, marketing },
        source: "/design",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Send failed");
  };

  const handleContactSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!privacy) {
      alert("Zaakceptuj politykę prywatności.");
      return;
    }

    setContactStatus("sending");

    try {
      await sendDesignLead(
        `${dataForm.Message}\n\nPierwszy krok formularza. Zgoda marketingowa: ${
          marketing ? "tak" : "nie"
        }`,
        "Design - dane kontaktowe",
      );
      setContactStatus("sent");
      setStep("survey");
    } catch {
      setContactStatus("error");
    }
  };

  const handleSurveySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setSurveyStatus("sending");

    try {
      await sendDesignLead(
        `${dataForm.Message}\n\nCzy planuje zakup w tym roku: ${
          dataForm.purchaseThisYear || "brak odpowiedzi"
        }\nRegion: ${dataForm.region || "brak odpowiedzi"}\nBudżet: ${
          dataForm.budget || "brak odpowiedzi"
        }\nZgoda marketingowa: ${marketing ? "tak" : "nie"}`,
        "Design - ankieta",
      );
      setSurveyStatus("sent");
    } catch {
      setSurveyStatus("error");
    }
  };

  if (step === "survey") {
    return (
      <form
        onSubmit={handleSurveySubmit}
        className="flex flex-col gap-[14px] lg:gap-[18px]"
      >
        <div className="rounded-[22px] bg-[#ffc329]/55 p-[14px] lg:p-[22px]">
          <p className="mb-[14px] text-[16px] font-[900] lg:text-[22px]">
            Krótka ankieta
          </p>
          <div className="grid grid-cols-1 gap-[12px]">
            <SurveySelect
              title="Czy planujesz zakup nieruchomości w tym roku?"
              options={purchaseTimingOptions}
              value={dataForm.purchaseThisYear}
              onChange={(value) => updateField("purchaseThisYear", value)}
            />
            <SurveySelect
              title="W jakim regionie szukasz nieruchomości?"
              options={regionOptions}
              value={dataForm.region}
              onChange={(value) => updateField("region", value)}
            />
            <SurveySelect
              title="Jaki budżet maksymalny planujesz przeznaczyć na zakup?"
              options={budgetOptions}
              value={dataForm.budget}
              onChange={(value) => updateField("budget", value)}
            />
          </div>
        </div>

        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={() => setStep("contact")}
            className="h-[45px] rounded-full bg-white px-[20px] text-[13px] font-[700] uppercase tracking-[0.4px] text-black lg:h-[62px] lg:px-[30px] lg:text-[16px]"
          >
            Wróć
          </button>
          <button
            type="submit"
            disabled={surveyStatus === "sending" || surveyStatus === "sent"}
            className="h-[45px] flex-1 rounded-full bg-black text-[13px] font-[700] uppercase tracking-[0.4px] text-white disabled:opacity-70 lg:h-[62px] lg:text-[16px]"
          >
            {surveyStatus === "sending"
              ? "Wysyłam..."
              : surveyStatus === "sent"
                ? "Wysłano"
                : surveyStatus === "error"
                  ? "Spróbuj ponownie"
                  : "Wyślij"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleContactSubmit}
      className="flex flex-col gap-[12px] lg:gap-[16px]"
    >
      <input
        required
        value={dataForm.Name}
        onChange={(event) => updateField("Name", event.target.value)}
        className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[54px] lg:rounded-[18px] lg:px-[18px] lg:text-[16px]"
        placeholder="Imię i nazwisko *"
      />
      <input
        required
        type="email"
        value={dataForm.Email}
        onChange={(event) => updateField("Email", event.target.value)}
        className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[54px] lg:rounded-[18px] lg:px-[18px] lg:text-[16px]"
        placeholder="Adres e-mail *"
      />
      <input
        required
        type="tel"
        value={dataForm.Phone}
        onChange={(event) => updateField("Phone", event.target.value)}
        className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[54px] lg:rounded-[18px] lg:px-[18px] lg:text-[16px]"
        placeholder="Numer telefonu *"
      />
      <textarea
        value={dataForm.Message}
        onChange={(event) => updateField("Message", event.target.value)}
        className="h-[120px] resize-none rounded-[13px] border border-black/10 bg-white px-[14px] py-[13px] text-[13px] outline-none lg:h-[100px] lg:rounded-[18px] lg:px-[18px] lg:py-[16px] lg:text-[16px]"
        placeholder="Wiadomość"
      />

      <div className="flex flex-col gap-[10px] text-[12px] font-[600] leading-[1.35] text-black/70 lg:text-[13px]">
        <label className="flex items-start gap-[9px]">
          <input
            required
            type="checkbox"
            checked={privacy}
            onChange={(event) => setPrivacy(event.target.checked)}
            className="mt-[2px] h-[16px] w-[16px] shrink-0"
          />
          <span>
            Oświadczam, że zapoznałem/am się z{" "}
            <Link href="/polityka-prywatnosci" className="underline">
              Polityką Prywatności
            </Link>
            .
          </span>
        </label>
        <label className="flex items-start gap-[9px]">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)}
            className="mt-[2px] h-[16px] w-[16px] shrink-0"
          />
          <span>Wyrażam zgodę na kontakt marketingowy.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={contactStatus === "sending"}
        className="mt-[5px] h-[45px] rounded-full bg-black text-[13px] font-[700] uppercase tracking-[0.4px] text-white disabled:opacity-70 lg:h-[54px] lg:text-[16px]"
      >
        {contactStatus === "sending"
          ? "Wysyłam..."
          : contactStatus === "error"
            ? "Spróbuj ponownie"
            : "Dalej"}
      </button>
    </form>
  );
}

function OfferCard({ offer }: { offer: DesignProperty }) {
  const allImages = getOfferImages(offer.images);
  const images = allImages.slice(0, 3);
  const slides = [
    ...images.map((image) => ({ type: "image" as const, src: image })),
    { type: "more" as const, src: "" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const activeSlide = slides[activeIndex] || {
    type: "image" as const,
    src: "/bg_main_site_2.png",
  };
  const coast = getCoastLabel(offer.town, offer.province);

  const changeImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    direction: "prev" | "next",
  ) => {
    event.stopPropagation();
    if (slides.length <= 1) return;
    setActiveIndex((current) =>
      direction === "next"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length,
    );
  };

  const showImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.stopPropagation();
    setActiveIndex(index);
  };

  const handleMorePhotos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowInquiryForm(true);
  };

  if (showInquiryForm) {
    return (
      <OfferInquiryForm
        offer={offer}
        onBack={() => {
          setShowInquiryForm(false);
          setActiveIndex(0);
        }}
      />
    );
  }

  return (
    <div className="group overflow-hidden rounded-[24px] bg-[#f3e8df] shadow-[0_12px_34px_rgba(0,0,0,0.12)] outline-none transition-transform duration-300 hover:-translate-y-1 lg:rounded-[38px]">
      <div className="relative h-[220px] overflow-hidden bg-white lg:h-[310px]">
        {activeSlide.type === "more" ? (
          <button
            type="button"
            onClick={handleMorePhotos}
            className="flex h-full w-full flex-col items-center justify-center bg-black/80 px-[24px] text-center text-white"
          >
            <p className="text-[28px] font-[900] leading-tight lg:text-[30px]">
              Więcej informacji
            </p>
            <p className="mt-[10px] text-[13px] font-[600] text-white/75 lg:text-[15px]">
              Zostaw kontakt, a wyślemy pełne informacje o tej ofercie.
            </p>
          </button>
        ) : (
          <Image
            src={activeSlide.src}
            alt={offer.headerAdvertisement || "Przykładowa oferta"}
            fill
            sizes="(max-width: 1024px) 50vw, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-[14px] top-[14px] rounded-full bg-[#ffc329] px-[12px] py-[6px] text-[11px] font-[800] uppercase tracking-[0.4px]">
          Rynek pierwotny
        </div>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Poprzednie zdjęcie"
              onClick={(event) => changeImage(event, "prev")}
              className="absolute left-[12px] top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md"
            >
              <FaChevronLeft className="text-[13px]" />
            </button>
            <button
              type="button"
              aria-label="Następne zdjęcie"
              onClick={(event) => changeImage(event, "next")}
              className="absolute right-[12px] top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md"
            >
              <FaChevronRight className="text-[13px]" />
            </button>
          </>
        )}
      </div>

      <div className="px-[18px] pb-[18px] pt-[16px] lg:px-[24px] lg:pb-[24px] lg:pt-[20px]">
        <p className="text-[13px] font-[700] uppercase tracking-[0.7px] text-black/55 lg:text-[14px]">
          {coast}
        </p>
        <div className="mt-[6px] flex flex-col xl:flex-row items-start justify-between gap-[12px]">
          <div>
            <h3 className="text-[22px] sm:text-[18px] font-[800] leading-[1.1] lg:text-[18px]">
              {offer.town || "Hiszpania"}
            </h3>
            <p className="mt-[5px] text-[12px] font-[700] text-black/50 lg:text-[13px]">
              nr ref. {offer.external_id}
            </p>
          </div>
          <p className="shrink-0 text-right text-[22px] font-[900] leading-none text-[#f15b2a] lg:text-[28px]">
            {offer.price
              ? `od ${Number(offer.price).toLocaleString("pl-PL")} €`
              : "Cena na zapytanie"}
          </p>
        </div>

        <div className="mt-[18px] flex flex-wrap items-center gap-[8px]">
          {slides.map((slide, index) => (
            <button
              key={index}
              type="button"
              onClick={
                slide.type === "more"
                  ? handleMorePhotos
                  : (event) => showImage(event, index)
              }
              className={`h-[34px] min-w-[34px] rounded-full px-[11px] text-[12px] font-[800] ${
                activeIndex === index
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {slide.type === "more" ? "Więcej informacji" : index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DesignPage({ offers }: DesignPageProps) {
  return (
    <>
      <Head>
        <title>Onesta Design</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main
        className={`${Mulish_Font.className} min-h-screen bg-white text-gray-800`}
      >
        <div className="min-h-screen w-full overflow-hidden bg-[#ebebeb]">
          <section className="relative min-h-[620px] bg-[#FFC32A] px-[24px] lg:min-h-[760px] lg:px-[70px] lg:pb-[46px]">
            <div className="absolute right-0 top-0 h-full w-[42%] bg-[#EBEBEB] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />

            <div className="relative z-10 mx-auto grid h-full max-w-[1200px] grid-cols-1 gap-[26px] lg:grid-cols-[56%_44%]">
              <div>
                <div className="flex h-[46px] w-[158px] items-center rounded-b-[20px] bg-white px-[16px] shadow-sm lg:h-[62px] lg:w-[220px] lg:px-[24px]">
                  <Image
                    src="/logotype_full_new.png"
                    alt="Onesta"
                    width={220}
                    height={70}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>

                <div className="mt-[72px] max-w-[710px] border-[#f15b2a] pl-[18px] lg:mt-[86px] lg:pl-[34px">
                  <p className="text-[20px] font-[700] leading-none lg:text-[30px]">
                    Od 8 lat
                  </p>
                  <h1 className="mt-[16px] text-[34px] font-[700] leading-[1.04] tracking-[-1px] lg:mt-[28px] lg:text-[60px] lg:tracking-[-2.4px]">
                    Pomagamy Polakom w poszukiwaniach i zakupie drugiego domu w
                    Hiszpanii
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      const target = document.getElementById(
                        "design-help-section",
                      );
                      if (!target) return;
                      const top =
                        target.getBoundingClientRect().top + window.scrollY + 0;
                      window.scrollTo({ top, behavior: "smooth" });
                    }}
                    className="mt-[26px] rounded-md bg-gray-800 border border-gray-600 text-white px-[25px] py-[13px] text-[11px] font-[700] uppercase tracking-[0.5px] lg:mt-[40px] lg:px-[42px] lg:py-[20px] lg:text-[16px]"
                  >
                    Sprawdź jak możemy Ci pomóc
                  </button>
                  <p className="mt-[13px] text-[10px] font-[500] uppercase tracking-[0.1px] lg:mt-[20px] lg:text-[14px]">
                    lub od razu zostaw kontakt{" "}
                    <span className="font-[800] underline">klikając tutaj</span>
                  </p>
                </div>
              </div>

              <div className="relative min-h-[270px] lg:min-h-[650px]">
                <div className="absolute right-[96px] top-[4px] h-[178px] w-[178px] overflow-hidden rounded-[30px] border-[8px] border-[#32384B] bg-white shadow-sm lg:right-[180px] lg:top-[56px] lg:h-[310px] lg:w-[310px] lg:rounded-[16px] lg:border-[4px]">
                  <Image
                    src="/Marek.webp"
                    alt=""
                    fill
                    objectPosition="center -60px"
                    sizes="(max-width: 1024px) 178px, 310px"
                    className="object-cover object-[50%_12%]"
                    priority
                  />
                </div>
                <div className="absolute right-[12px] top-[124px] h-[188px] w-[188px] overflow-hidden rounded-[30px] border-[8px] border-[#32384B] bg-white shadow-sm lg:right-[34px] lg:top-[302px] lg:h-[340px] lg:w-[340px] lg:rounded-[26px] lg:border-[4px]">
                  <Image
                    src="/Karolina.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 188px, 340px"
                    className="object-cover object-[50%_10%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#EBEBEB] px-[24px] pb-[62px] pt-[8px] lg:px-[70px] lg:pb-[98px]">
            <div className="mx-auto max-w-[1240px]">
              {/* <AccentHeading>
                Dlaczego <br />
                <p className="text-[#ffc329]">my?</p>
              </AccentHeading> */}
              <div className="mt-[30px] grid grid-cols-1 gap-[24px] lg:mt-[52px] md:grid-cols-[330px_1fr] lg:gap-[48px]">
                <div
                  id="design-help-section"
                  className="relative overflow-hidden w-[300px] rounded-[24px] bg-[#ffc329] h-[430px] lg:rounded-[20px] border-[5px] border-[#ffc329] mx-auto"
                >
                  <Image
                    src="/Marek.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 330px"
                    className="object-cover object-[50%_12%]"
                  />
                </div>
                <blockquote className="relative rounded-[26px] bg-white/55 px-[28px] py-[28px] shadow-sm lg:px-[42px] lg:py-[38px]">
                  <span className="absolute left-[18px] top-[8px] text-[70px] font-[900] leading-none text-[#ffc329] lg:text-[96px]">
                    “
                  </span>
                  <p className="relative z-10 border-[#f15b2a] pl-[18px] text-[15px] italic leading-[1.65] text-black/80 lg:text-[22px] lg:leading-[1.7] font-[500]">
                    Rozumiemy, że zakup nieruchomości za granicą może wiązać się
                    ze stresem co do bezpieczeństwa całego procesu, trafności
                    wyboru samej nieruchomości, lokalizacji, a nierzadko brakiem
                    znajomości rynku. Chodzi przecież o spełnienie marzenia lub
                    podjęcie często złożonej decyzji, która w efekcie powinna
                    dawać nie tylko satysfakcje ale również pozwalać na
                    efektywny wynajem.
                    <br />
                    <br />
                    To na czym nam zależy to pełna swoboda i otwartości w
                    komunikacji z klientami budowana na wzajemnym zaufaniu.
                  </p>
                </blockquote>
              </div>

              <AccentHeading className="mt-[42px] lg:mt-[76px] uppercase">
                Oferujemy Państwu
                {/* <p className="text-[#ffc329]">zaoferować Państwu:</p> */}
              </AccentHeading>
              <div className="mt-[28px] grid grid-cols-1 gap-[14px] lg:mt-[46px] lg:grid-cols-3 lg:gap-[36px]">
                {whyUs.map((item, index) => (
                  <OfferBenefitCard
                    key={index}
                    text={item.text}
                    Icon={item.Icon}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffc329] px-[24px] pb-[62px] pt-[50px] lg:px-[70px] lg:pb-[100px] lg:pt-[84px]">
            <div className="mx-auto max-w-[1200px]">
              <AccentHeading>
                9 przykładowych <p className="text-white">ofert</p>
              </AccentHeading>
              <div className="mt-[32px] grid grid-cols-1 gap-[18px] lg:mt-[54px] lg:grid-cols-3 sm:grid-cols-2 lg:gap-[26px]">
                {offers.map((offer) => (
                  <OfferCard key={offer.external_id} offer={offer} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#EBEBEB] px-[24px] pb-[54px] pt-[48px] lg:px-[70px] lg:pb-[92px] lg:pt-[86px]">
            <div className="mx-auto max-w-[1200px]">
              <AccentHeading>
                <span>
                  <span className="text-[#ffc329]">KAŻDY</span> etap zakupu w{" "}
                  <br />
                  <span className="text-[#ffc329]">JEDNYM</span> miejscu
                </span>
              </AccentHeading>

              <div className="mt-[32px] grid grid-cols-1 gap-[20px] lg:mt-[58px] lg:grid-cols-2 lg:gap-[58px]">
                {stepCards.map((card) => (
                  <article
                    key={card.number}
                    className="relative flex min-h-[170px] overflow-hidden rounded-[28px] px-[22px] py-[22px] lg:min-h-[200px] lg:rounded-[38px] lg:px-[34px] lg:py-[10px]"
                  >
                    <div className="mr-[18px] text-[#ffc329] shrink-0 text-[96px] font-[800] leading-[0.85] lg:mr-[28px] lg:text-[100px]">
                      {card.number}
                    </div>
                    <div className="flex flex-col border-l-[5px] border-[#ffc329] pl-[15px]">
                      <p className="font-[700] text-[26px] mb-[10px]">
                        {" "}
                        {card.claim}
                      </p>
                      <p className="relative z-10 self-top text-[14px] font-[400] leading-[1.45] lg:text-[18px]">
                        {card.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffc329] px-[24px] pb-[58px] pt-[50px] lg:px-[70px] lg:pb-[96px] lg:pt-[82px]">
            <div className="mx-auto max-w-[1200px]">
              <AccentHeading>
                Przykłady aranżacji{" "}
                <p className="text-white">apartamentów na wynajem.</p>
              </AccentHeading>

              <div className="mt-[32px] grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:mt-[54px] lg:grid-flow-dense lg:grid-cols-6 lg:auto-rows-[150px] lg:gap-[24px]">
                {galleryImages.map((image, index) => (
                  <GalleryImage
                    key={`${image.src}-${index}`}
                    image={image}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f3e8df] px-[24px] py-[52px] lg:px-[70px] lg:py-[88px]">
            <div className="mx-auto max-w-[1240px]">
              <AccentHeading>
                Usługa zarządzania najmem{" "}
                <p className="text-[#ffc329]">obejmuje m.in:</p>
              </AccentHeading>
              <div className="mt-[28px] grid grid-cols-1 gap-[14px] lg:mt-[46px] lg:grid-cols-4 lg:gap-[35px]">
                {rentServices.map((item) => (
                  <RentServiceCard
                    key={item.text}
                    text={item.text}
                    Icon={item.Icon}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[#ffc329] px-[24px] pb-[78px] pt-[12px] lg:px-[70px] lg:pb-[120px]">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-18px] left-1/2 h-[430px] w-[1040px] max-w-none -translate-x-1/2 text-[#6f6258]/20 lg:bottom-[-34px] lg:h-[620px] lg:w-[1540px]"
              viewBox="0 0 1540 620"
              fill="none"
            >
              <g
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M-40 170L610 12L1580 190"
                  strokeWidth="1"
                  opacity=".28"
                />
                <path
                  d="M-40 276L610 116L1580 292"
                  strokeWidth="1"
                  opacity=".22"
                />
                <path
                  d="M-40 430L610 292L1580 440"
                  strokeWidth="1"
                  opacity=".18"
                />
                <path
                  d="M160 618L610 410L1210 618"
                  strokeWidth="1"
                  opacity=".18"
                />
                <path
                  d="M636 0V620M1020 0V620M1266 0V620"
                  strokeWidth="1"
                  opacity=".18"
                />
                <path
                  d="M72 560V250L636 118L1250 258V560"
                  strokeWidth="3"
                  opacity=".55"
                />
                <path d="M636 118V560" strokeWidth="3" opacity=".55" />
                <path
                  d="M72 250L636 372L1250 258"
                  strokeWidth="2.2"
                  opacity=".42"
                />
                <path
                  d="M72 304L636 424L1250 314M72 360L636 480L1250 370"
                  strokeWidth="1.4"
                  opacity=".28"
                />
                <path
                  d="M118 226L636 96L1212 232"
                  strokeWidth="2.5"
                  opacity=".42"
                />
                <path
                  d="M148 210L636 84L1184 216"
                  strokeWidth="1.4"
                  opacity=".24"
                />
                <path
                  d="M148 304L388 250V386L148 432V304Z"
                  strokeWidth="2.2"
                  opacity=".48"
                />
                <path
                  d="M178 312L360 272V374L178 410V312Z"
                  strokeWidth="1.5"
                  opacity=".34"
                />
                <path
                  d="M254 294V394M276 288V390"
                  strokeWidth="1.2"
                  opacity=".34"
                />
                <path
                  d="M438 236L586 202V338L438 368V236Z"
                  strokeWidth="2"
                  opacity=".42"
                />
                <path
                  d="M462 242L560 220V326L462 348V242Z"
                  strokeWidth="1.3"
                  opacity=".32"
                />
                <path d="M510 232V338" strokeWidth="1.2" opacity=".32" />
                <path
                  d="M760 230L1044 292V398L760 336V230Z"
                  strokeWidth="2.2"
                  opacity=".48"
                />
                <path
                  d="M790 252L1016 302V374L790 324V252Z"
                  strokeWidth="1.5"
                  opacity=".34"
                />
                <path
                  d="M884 272V344M916 278V350"
                  strokeWidth="1.2"
                  opacity=".34"
                />
                <path
                  d="M890 410L1168 470V560H890V410Z"
                  strokeWidth="2"
                  opacity=".38"
                />
                <path
                  d="M946 452V560M1032 470V560M1112 486V560"
                  strokeWidth="1.4"
                  opacity=".28"
                />
                <path
                  d="M958 454L1018 466V532H958V454ZM1062 478L1138 494V540H1062V478Z"
                  strokeWidth="1.4"
                  opacity=".32"
                />
                <path
                  d="M72 250V620M636 118V620M1250 258V620M388 180V620M1044 210V620"
                  strokeWidth="1.2"
                  opacity=".18"
                />
                <path
                  d="M0 560H1540M80 592H1470M220 612H1320"
                  strokeWidth="1.2"
                  opacity=".24"
                />
              </g>
            </svg>
            <div
              id="design-contact-form"
              className="relative z-10 mx-auto grid max-w-[1120px] items-center gap-[28px] md:grid-cols-[0.95fr_1.05fr] lg:gap-[58px] lg:mt-[40px]"
            >
              <div className="mx-auto max-w-[430px] md:mx-0">
                <AccentHeading className="[&_h2]:text-[23px] lg:[&_h2]:text-[40px] [&_span]:h-[45px] lg:[&_span]:h-[45px]">
                  Twoja kolej :)
                </AccentHeading>
                <p className="mt-[12px] text-[15px] font-[600] leading-[1.5] text-black/75 lg:text-[18px]">
                  Potrzebujemy kilku informacji aby przygotować dla Ciebie
                  spersonalizowaną paczkę ofert, przekazać wiedzę, odpowiedzieć
                  na pytania i w efekcie przesłać dedykowane oferty.
                </p>
              </div>
              <div className="mx-auto w-full max-w-[590px] rounded-[30px] bg-[#f3e8df] px-[28px] py-[30px] shadow-[0_18px_50px_rgba(0,0,0,0.12)] md:mx-0 md:justify-self-end lg:rounded-[46px] lg:px-[45px] lg:py-[54px]">
                <DesignContactForm />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

const offerRanges = [
  { min: 270_000, max: 340_000, limit: 3, includeMax: false },
  { min: 240_000, max: 270_000, limit: 2, includeMax: false },
  { min: 340_000, max: 390_000, limit: 2, includeMax: false },
  { min: 390_000, max: 500_000, limit: 2, includeMax: true },
];

export const getServerSideProps: GetServerSideProps<
  DesignPageProps
> = async () => {
  const client = supabaseServer ?? supabase;
  const offers: DesignProperty[] = [];
  const usedExternalIds = new Set<string>();

  for (const range of offerRanges) {
    let query = client
      .from("properties")
      .select("external_id, price, town, province, images, type")
      .eq("new_build", true)
      .gte("price", range.min)
      .not("images", "is", null)
      .neq("images", "[]")
      .order("price", { ascending: true })
      .limit(range.limit + 4);

    query = range.includeMax
      ? query.lte("price", range.max)
      : query.lt("price", range.max);

    const { data, error } = await query;

    if (error) {
      console.error("Design offers query error:", error.message);
      continue;
    }

    for (const offer of data ?? []) {
      const externalId = String(offer.external_id);
      if (usedExternalIds.has(externalId)) continue;
      usedExternalIds.add(externalId);
      offers.push(offer as DesignProperty);
      if (
        offers.filter(
          (item) =>
            Number(item.price || 0) >= range.min &&
            (range.includeMax
              ? Number(item.price || 0) <= range.max
              : Number(item.price || 0) < range.max),
        ).length >= range.limit
      ) {
        break;
      }
    }
  }

  return {
    props: {
      offers: JSON.parse(JSON.stringify(offers)),
    },
  };
};
