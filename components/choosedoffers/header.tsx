import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="h-[80px] lg:w-[1100px] mx-auto place-content-center">
        <div className="w-[260px] h-[70px] bg-white rounded-b-xl place-content-center">
          <div className="md:w-[90%] w-[79%] md:h-[80%] h-[60%] relative md:mx-auto">
            <Image src="/logotype_full.png" fill objectFit="contain" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
