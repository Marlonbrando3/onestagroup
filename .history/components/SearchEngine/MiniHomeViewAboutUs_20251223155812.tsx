import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GreatVibes, Red_Hat_DisplayFont, MoonDance } from "../../fonts/fonts";

export default function MiniHomeViewAboutUs() {
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
    <div
      className={`${Red_Hat_DisplayFont.className} lg:w-full w-full md:h-[310px] h-[210px] mx-auto mb-[50px]`}
    >
      {/* <div className=" bg-white w-full h-[60px]"></div> */}
      <div className=" bg-white w-full h-[250px] bg-[url('/mini_bg_about_us.png')] bg-cover md:bg-[center_620px] bg-[center_320px] relative">
        {/* <div className="absolute w-full h-full bg-gray-900/[0.5] z-0"></div> */}
        <div className="lg:w-[1100px] w-[90%] mx-auto z-10 relative h-full">
          <div className="w-full h-full place-content-center grid">
            <h2 className="md:text-[49px] text-[34px] text-white bg-gradient-to-r from-gray-900/[0.4] to-gray-900/[0.5] leading-[30px] lg:leading-[49px] text-center">
              Poznaj Onesta Group
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
