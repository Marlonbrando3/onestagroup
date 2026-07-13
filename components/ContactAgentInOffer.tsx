import Image from "next/image";
import { useState } from "react";
import { FiMail, FiPhone } from "react-icons/fi";

type Agent = {
  email: string;
  image: string;
  imagePosition?: string;
  name: string;
  phone: string;
  phoneHref: string;
};

const agents: Agent[] = [
  {
    name: "Marek Marszałek",
    image: "/Marek.webp",
    imagePosition: "center 30%",
    phone: "+48 576 65 25 25",
    phoneHref: "+48576652525",
    email: "marek.marszalek@onesta.com.pl",
  },
  {
    name: "Karolina Bakowicz",
    image: "/Karolina.webp",
    imagePosition: "center 30%",
    phone: "+48 505 055 846",
    phoneHref: "+48505055846",
    email: "karolina@fenomen.nieruchomosci.pl",
  },
];

function AgentCard({ agent, locale = "pl" }: { agent: Agent; locale?: "pl" | "en" }) {
  const [showPhone, setShowPhone] = useState(false);
  const [showMail, setShowMail] = useState(false);

  return (
    <div className="flex w-full bg-gray-100 p-[10px]">
      <div className="relative h-[120px] w-[100px] shrink-0 overflow-hidden">
        <Image
          src={agent.image}
          fill
          alt={agent.name}
          sizes="100px"
          className="object-cover"
          style={{ objectPosition: agent.imagePosition || "center" }}
        />
      </div>
      <div className="ml-[20px] flex flex-1 flex-col items-center justify-center">
        <div className="w-full text-left text-[24px] font-[600]">
          {agent.name}
        </div>
        <a
          href={`tel:${agent.phoneHref}`}
          className={`w-full text-left ${showPhone ? "block" : "hidden"}`}
        >
          {agent.phone}
        </a>
        <a
          href={`mailto:${agent.email}`}
          className={`w-full text-left break-all ${showMail ? "block" : "hidden"}`}
        >
          {agent.email}
        </a>
        <div className="mt-[15px] flex w-full justify-between gap-2">
          <button
            type="button"
            className="flex w-[49%] cursor-pointer items-center border border-yellow-600 px-[10px] py-[7px] text-center text-[18px] duration-200 hover:bg-yellow-600 hover:text-white"
            onClick={() => setShowPhone(true)}
          >
            <FiPhone />
            <span className="pl-[10px]">{locale === "en" ? "Phone" : "Telefon"}</span>
          </button>
          <button
            type="button"
            className="flex w-[49%] cursor-pointer items-center border border-yellow-600 px-[10px] py-[7px] text-center text-[18px] duration-200 hover:bg-yellow-600 hover:text-white"
            onClick={() => setShowMail(true)}
          >
            <FiMail />
            <span className="pl-[10px]">Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactAgentInOffer({ locale = "pl" }: { locale?: "pl" | "en" }) {
  return (
    <div className="hidden w-full flex-col gap-3 lg:flex">
      {agents.map((agent) => (
        <AgentCard agent={agent} key={agent.email} locale={locale} />
      ))}
    </div>
  );
}
