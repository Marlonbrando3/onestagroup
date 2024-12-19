import React, { useEffect } from "react";
import Image from "next/image";

type Types = {
  types: any;
  ArrowTime: any;
  setArrowTime: any;
};

export default function SurveyFourDateItem({ types, ArrowTime, setArrowTime }: Types) {
  const handleChangingType = () => {
    setArrowTime(types.name);
  };

  console.log(ArrowTime);

  return (
    <div
      onClick={handleChangingType}
      className="h-[80px] w-[90%] md:w-[43%] bg-white my-[5px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.3)] rounded-xl flex justify-center items-center cursor-pointer duration-200 hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.3)]"
    >
      <div
        className={`${
          ArrowTime === types.name
            ? "border-[5px] border-orange-200 "
            : "border-[5px] border-transparent"
        } border-yellow-800 h-[80px] w-full flex items-center justify-center py-[6px] rounded-md`}
      >
        {/* <div className="h-full w-[100px] border rounded-xl overflow-hidden relative">
          {ArrowTime.includes(types.name) && (
            <div className="w-full h-full absolute top-0 z-10 bg-white/[0.7]">
              <Image src="/Survey/Types/checked.png" objectFit="cover" fill alt="bungalow" />
            </div>
          )}
          <Image src={`/${types.photo}`} objectFit="cover" fill alt="bungalow" />
        </div> */}
        <p className="w-[90%] font-semibold text-[16px] leading-[24px] mx-auto text-center">
          {types.name}
        </p>
      </div>
    </div>
  );
}
