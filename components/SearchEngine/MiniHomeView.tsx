import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GreatVibes, Red_Hat_DisplayFont, MoonDance } from "../../fonts/fonts";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function MiniHomeView() {
  const router = useRouter();

  const { country } = router.query;

  const Dictionary = [
    { name: "portugalia", new: "w Portugalii" },
    { name: "hiszpania", new: "w Hiszpanii" },
    { name: "dominikana", new: "na Dominikanie" },
    { name: "cypr", new: "na Cyprze" },
  ];
  return (
    <div
      className={`${Red_Hat_DisplayFont.className} w-full md:h-[230px] h-auto mx-auto md:text-[18px] -mt-[100px] `}
    >
      <div className="w-full md:h-[140px] h-[100px] bg-red-900 bg-[url('/bg_mini.png')] bg-cover"></div>
      <div className="w-full h-full bg-[center_320px] bg-cover relative ">
        <div className="pt-[20px] w-[90vw] max-w-[1300px] mx-auto z-30 relative flex items-center">
          <Link href="#">Strona startowa</Link>
          <MdKeyboardArrowRight className="md:mx-[10px] h-[25px] w-[25px] text-yellow-800" />
          <Link href="#">Nieruchomości</Link>
          <MdKeyboardArrowRight className="md:mx-[10px] h-[25px] w-[25px] text-yellow-800" />{" "}
          <Link href="#" className="capitalize">
            {country}
          </Link>
        </div>
        <div className="w-[90vw] max-w-[1300px] mx-auto md:text-[40px] text-[24px] font-[600]">
          Luksusowe oferty nieruchomości w Hiszpanii
        </div>
      </div>
    </div>
  );
}
