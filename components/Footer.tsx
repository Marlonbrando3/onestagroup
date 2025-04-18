import React from "react";
import Image from "next/image";
import LogoType from "./images/logotype.png";

import { FaRegCopyright } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full lg:py-2 lg:text-sm text-xs flex z-20 items-center bg-[#fcf7f4] border-t mt-10 justify-between text-white h-[100px]">
      {/* <div className="w-[1100px] mx-auto flex">
        <div className="border border-black w-[400px] h-[300px]">
          <Image
            src={LogoType}
            objectFit="contian"
            className="border w-[200px] h-[100px]"
            alt="logo_onesta"
            layout="intrinsic"
          />
        </div>
        <div className="w-[700px] flex">
          <div className="border border-black w-1/3 h-[300px]"></div>
          <div className="border border-black w-1/3 h-[300px]"></div>
          <div className="border border-black w-1/3 h-[300px]"></div>
        </div>
      </div> */}
    </div>
  );
}
