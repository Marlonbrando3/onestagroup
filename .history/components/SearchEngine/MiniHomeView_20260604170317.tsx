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
      className={`${Red_Hat_DisplayFont.className} w-full lg:h-[200px] h-auto mx-auto md:text-[14px] -mt-[100px] mb-[15px] `}
    >
      <div className="w-full lg:h-[250px] h-[0px] lg:bg-[url('/bg_beach.jpg')] bg-cover bg-[right_0px_top_450px] rounded-b-[40px] px-[10px] "></div>
      {/* <div className="w-[90vw] max-w-[1400px] mx-auto h-full bg-[center_320px] bg-cover relative -mt-[70px] bg-white rounded-[20px]">
        <div className="px-[30px] py-[10px] w-[90vw] max-w-[1300px] z-30 relative flex items-center ">
          <Link href="/">Strona startowa</Link>
          <MdKeyboardArrowRight className="md:mx-[10px] h-[20px] w-[20px] text-gray-400" />
          <Link href="#">Nieruchomości</Link>
          <MdKeyboardArrowRight className="md:mx-[10px] h-[20px] w-[20px] text-gray-400" />{" "}
          <Link href="/nieruchomosci/hiszpania" className="capitalize">
            {country}
          </Link>
        </div>
        <div className="w-[90vw] max-w-[1400px] mx-auto md:text-[28px] text-[24px] font-[600] px-[30px]">
          Wyjątkowe oferty nieruchomości w Hiszpanii
        </div>
      </div> */}
    </div>
  );
}
