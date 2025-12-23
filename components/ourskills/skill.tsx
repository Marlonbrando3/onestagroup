import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { BiConversation } from "react-icons/bi";
import { BsCashStack } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";

type Person = {
  desc: any;
};

export default function Skill({ desc }: Person) {
  const icon =
    (desc.title === "Bezpieczeństwo" && <AiOutlineSafety className="w-[50px] h-[50px]" />) ||
    (desc.title === "Rozumiemy Twoje potrzeby" && (
      <BiConversation className="w-[50px] h-[50px]" />
    )) ||
    (desc.title === "Finansowanie" && <BsCashStack className="w-[50px] h-[50px]" />) ||
    (desc.title === "Zarządzanie" && <FaRegCalendarCheck className="w-[50px] h-[50px]" />) ||
    (desc.title === "Oferty" && <MdOutlineLocalOffer className="w-[50px] h-[50px]" />) ||
    (desc.title === "Obsługa języku Polskim" && <TbLanguage className="w-[50px] h-[50px]" />);

  return (
    <div className="md:w-[400px] h-[300px] relative flex flex-col">
      <div className="absolute rounded-[50%] bg-yellow-600 w-[80px] h-[80px] -top-[20px] md:-left-[40px] left-[10px] flex justify-center items-center">
        {icon}
      </div>
      <div className="border rounded-[15px] w-[90%] h-[90%] text-white pt-[80px] p-[15px] mx-auto">
        <p className="uppercase font-bold text-[22px] mb-[10px]">{desc.title}</p>
        <p>{desc.desc}</p>
      </div>
    </div>
  );
}
