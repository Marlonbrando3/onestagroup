import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../../fonts/fonts";
import processDesc from "../../data/processDesc.json";

type data = { t: any; name: any; descChoosed: any; onclick: any };

export default function ProcessStepsElements({
  t,
  name,
  descChoosed,
  onclick,
}: data) {
  const content = processDesc.filter((i) => name === i.name);

  console.log(content);
  return (
    <>
      <div
        className={`${MontserratSans.className} border border-[#275278] w-[90vw] md:w-auto font-[800] h-[45px] px-[15px] place-items-center grid text-[15px] border-gray-900 cursor-pointer hover:text-white hover:bg-[#275278] hover:border-[#275278] duration-300 uppercase rounded-[3px]`}
        onMouseEnter={() => onclick(name)}
      >
        {t}
      </div>
      <div
        data-name={name}
        className={`${
          descChoosed === name
            ? "h-auto md:py-[10px]"
            : "h-[0px] overflow-hidden py-[0px]"
        }  md:hidden transition-all duration-400 w-[90vw] mx-auto  font-[500] `}
      >
        {content[0].description}
      </div>
    </>
  );
}
