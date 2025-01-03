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
            ? "border-[5px] border-orange-400 "
            : "border-[5px] border-transparent"
        }  h-[80px] w-full flex items-center justify-center py-[6px] rounded-md`}
      >
        <p className="w-[90%] font-semibold text-[16px] leading-[24px] mx-auto text-center">
          {types.name}
        </p>
      </div>
    </div>
  );
}
