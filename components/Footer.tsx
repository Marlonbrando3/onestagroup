import React from "react";
import Image from "next/image";
import LogoType from "./images/logotype.png";
import { FaRegCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full lg:py-2 lg:text-sm text-xs flex z-20 items-center bg-slate-700 border-t mt-10 justify-between text-white h-[40px]">
      <div className="flex md:w-[1150px] w-[90%] mx-auto justify-between">
        <div className="flex w-auto items-center">
          <Image src={LogoType} width={60} height={40} alt="logo" />
          <FaRegCopyright className="h-2 hidden md:visible" />
          <p className="hidden md:visible text-[10px] text-grey-900 font-normal clear-both">
            Onesta Group 2024
          </p>
        </div>
        {/* <div className="flex">
          <p>Onesta Group sp. z o.o.</p>
          <p> 54-138 Wrocław</p>
          <p> ul. Wolbromska 18/1b</p>
          <p> NIP 8992922378</p>
        </div> */}
        <div className="flex pl-[40px]">
          <p>Onesta Group sp. z o.o. 54-138 Wrocław ul. Wolbromska 18/1b</p>
        </div>
      </div>
    </div>
  );
}
