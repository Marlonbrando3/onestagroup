import React from "react";
import Image from "next/image";

type data = {
  icon: any;
  img: any;
  t: any;
  d: any;
};

export default function WhatWeDo({ icon, img, t, d }: data) {
  return (
    <div className="md:w-[33%] w-full md:h-[45%] mb-[20px] md:mb-[0px]">
      <div className="w-full md:h-[100px] h-[100px] mx-auto grid place-items-left text-black md:px-[30px] relative">
        <Image
          src={`/${img}.png`}
          fill
          objectFit="contain"
          alt="etapts"
        ></Image>
      </div>
      <p className="font-[800] text-left text-[20px] mt-[20px] md:px-[35px] text-[#275278]">
        {t}
      </p>
      <p className="mt-[20px] md:px-[30px]">{d}</p>
    </div>
  );
}
