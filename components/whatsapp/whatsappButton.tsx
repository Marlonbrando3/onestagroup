import React from "react";
import Link from "next/link";
import { RiWhatsappFill } from "react-icons/ri";

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/+48567752525"
      className="cursor-pointer fixed w-auto min-h-[50px] bottom-10 right-10 bg-white shadow-[0px_5px_20px_-5px_rgba(0,0,0,0.3)] z-10 flex rounded-3xl px-[20px] py-[5px] items-center border border-orange-500 hover:bg-orange-400 duration-200 hover:text-white"
    >
      <p className="mr-[9px] leading-6 hover:text-white duration-200">
        Porozmawiaj z nami na <br></br>
        <b className="text-[24px] leading-2">Whats App</b>
      </p>
      <RiWhatsappFill className="w-[40px] h-[40px] text-green-500" />
    </Link>
  );
}
