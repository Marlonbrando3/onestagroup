import React, { useRef } from "react";
import Image from "next/image";
import { FiPhone } from "react-icons/fi";
import { FiMail } from "react-icons/fi";

export default function ContactAgentInOffer() {
  const phoneRef = useRef<HTMLAnchorElement | null>(null);
  const mailRef = useRef<HTMLAnchorElement | null>(null);

  const handleShowingContact = (ref: any) => {
    ref.current.style.display = "block";
    console.log(ref);
  };

  return (
    <div className="w-full h-auto p-[10px] flex bg-gray-100 lg:flex hidden">
      <div className="w-[100px] h-[120px] relative overflow-hidden">
        <Image
          src="/Marek.png"
          fill
          alt="alt"
          objectFit="cover"
          className="object-top scale-125 pt-[10px]"
        ></Image>
      </div>
      <div
        id="details"
        className="flex flex-col justify-center items-center flex-1 ml-[20px]"
      >
        <div className="text-[24px] font-[600] text-left w-full">
          Marek Marszałek
        </div>
        <a
          href="callto:+48576652525"
          className="text-left w-full hidden"
          ref={phoneRef}
        >
          +48 576 65 25 25
        </a>
        <a
          href="mailto:marek.marszalek@onesta.com.pl"
          className="text-left w-full hidden"
          ref={mailRef}
        >
          marek.marszalek@onesta.com.pl
        </a>
        <div className="flex justify-between w-full mt-[15px]">
          <div
            className="border px-[10px] py-[7px] text-center text-[18px] text-center flex items-center border-yellow-600 w-[49%] duration-200 hover:bg-yellow-600 hover:text-white cursor-pointer"
            onClick={() => handleShowingContact(phoneRef)}
          >
            <FiPhone />
            <p className="pl-[10px]">Telefon</p>
          </div>
          <div
            className="border px-[10px] py-[7px] text-center text-[18px] text-center flex items-center border-yellow-600 w-[49%] cursor-pointer duration-200 hover:bg-yellow-600 hover:text-white cursor-pointer "
            onClick={() => handleShowingContact(mailRef)}
          >
            <FiMail />
            <p className="pl-[10px]">Email</p>
          </div>
        </div>
      </div>
    </div>
  );
}
