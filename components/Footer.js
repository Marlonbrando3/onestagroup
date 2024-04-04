import React from "react";
import Image from "next/image";
import LogoType from "./images/logotype.png";
import { FaRegCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full lg:px-20 lg:py-2 lg:text-sm text-xs flex z-20 items-center bg-white border-t mt-10 justify-between w-12/12 mx-auto">
      <div className="flex flex-col">
        <Image src={LogoType} width={160} height={100} />
        <p className="text-md text-grey-900 font-normal clear-both">
          <FaRegCopyright className="h-3" /> Onesta Group 2024
        </p>
      </div>
      <div>
        <p>Onesta Group sp. z o.o.</p>
        <p>54-138 Wrocław</p>
        <p>ul. Wolbromska 18/1b</p>
        <p>NIP 8992922378</p>
      </div>
    </div>
  );
}
