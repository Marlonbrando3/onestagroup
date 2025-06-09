import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GreatVibes, Red_Hat_DisplayFont, MoonDance } from "../../fonts/fonts";

export default function MiniHomeView() {
  const router = useRouter();
  const [country, setCountry] = useState("");

  const Dictionary = [
    { name: "portugalia", new: "w Portugalii" },
    { name: "hiszpania", new: "w Hiszpanii" },
    { name: "dominikana", new: "na Dominikanie" },
    { name: "cypr", new: "na Cyprze" },
  ];

  useEffect(() => {
    Dictionary.map((i) => {
      if (i.name === router.query.country) {
        setCountry(i.new);
      }
    });
  }, [router.isReady, router.query.country]);

  return (
    <div className={`${MoonDance.className} lg:w-full w-full lg:h-[300px] h-[140px] mx-auto`}>
      <div className=" bg-white w-full h-[60px]"></div>
      <div className=" bg-white w-full h-full bg-[url('/bg_2.png')] bg-cover md:bg-[center_420px] bg-[center_320px] relative">
        <div className="absolute w-full h-full bg-gray-900/[0.4] z-0"></div>
        <div className="pt-[10px] w-[1100px] mx-auto z-30 relative">
          <span className="w-[100px] bg-white border">
            <h1 className="text-[49px] text-white ">Nieruchomości {country}</h1>
            <p
              className={`${Red_Hat_DisplayFont.className} bg-white w-[370px] text-center rounded-[3px]`}
            >
              {" "}
              Wybieraj spośród setek wyjątkowych ogłoszeń
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}
