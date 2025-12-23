import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full h-[50px] relative">
      <div className="absolute mx-auto right-0 left-0 w-[170px] h-[60px] bg-white rounded-b-[10px] px-[10px] flex justify-center items-center">
        <div className="relative w-full h-[50px] ">
          <Image src="/logotype_full.png" fill objectFit="contain" alt="logo" />
        </div>
      </div>
    </div>
  );
}
