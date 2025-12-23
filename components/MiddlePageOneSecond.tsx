import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import Image from "next/image";

export default function MiddlePageOneSecond() {
  return (
    <div
      className={`${MontserratSans.className} w-[93vw] rounded-[30px] h-[340px] my-[100px] mx-auto relative overflow-hidden bg-white`}
    >
      <p className="absolute lg:top-0 font-[600] lg:text-[70px] md:text-[50px] text-[40px] text-[#275278] z-20 md:right-[0px] w-full lg:w-auto lg:leading-[70px] md:leading-[50px] leading-[40px] -bottom-[1px] my-auto grid place-items-center lg:bg-gradient-to-r md:from-white/[0.0] md:from-0%  md:via-white md:via-25% md:to-100% md:to-white bg-gradient-to-b from-white/[0.0] from-0% via-white via-25% to-100% to-white lg:pl-[200px] pt-[80px] pb-[40px] ">
        Wiele potrzeb, <br></br>jeden model.
      </p>
      <Image
        src="/differentppl.png"
        fill
        objectFit="cover"
        className="lg:pr-[500px] object-[40%_20%]"
        alt="spain"
      ></Image>
    </div>
  );
}
