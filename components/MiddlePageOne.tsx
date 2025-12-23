import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import Image from "next/image";

export default function MiddlePageOne() {
  return (
    <div
      className={`${MontserratSans.className} w-[93vw] rounded-[30px] md:h-[340px] h-[300px] my-[100px] relative `}
    >
      <p className="absolute top-0 font-[600] md:text-[70px] text-[40px] text-[#275278] w-full md:w-auto z-30 md:right-[60px] text-center right-[0%] md:leading-[70px] leading-[40px] md:top-0 bottom-0 my-auto grid place-items-center top-[50%] md:text-right bg-gradient-to-b from-white/[0.0] from-0% via-white via-25% to-100% to-white md:bg-gradient-to-b md:from-white/[0.0] md:from-0% md:via-transparent md:via-25% md:to-100% md:to-transparent md:pt-[80px] md:pb-[80px]">
        Twoje marzenia, <br></br>nasze cele.
      </p>
      <Image
        src="/MiddleOne.png"
        fill
        // objectFit="cover"
        className="object-cover md:object-[60%_65%] object-[0%_100%] rounded-[30px] right-0 pb-[50px] md:pb-0"
        alt="spain"
      ></Image>
    </div>
  );
}
