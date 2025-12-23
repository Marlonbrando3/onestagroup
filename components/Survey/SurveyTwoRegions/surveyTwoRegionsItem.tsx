import React, { useEffect } from "react";
import Image from "next/image";

type Types = {
  PageNumber: any;
  setPageNumber: any;
  regions: any;
  ArrowRegions: any;
  setArrowRegions: any;
};

export default function SurveyTwoRegionsItem({
  regions,
  ArrowRegions,
  setArrowRegions,
  PageNumber,
  setPageNumber,
}: Types) {
  // const handleChangingType = () => {
  //   let data = [...ArrowRegions];

  //   console.log(types.name);

  //   if (ArrowRegions.includes(types.name)) {
  //     let updatedArray = data.filter((i: any) => i !== types.name);
  //     data = updatedArray;
  //     setArrowRegions(data);
  //   } else if (!ArrowRegions.includes(types.name)) {
  //     data.push(types.name);
  //     setArrowRegions(data);
  //   }
  // };

  const handleChosingOptions = (e: any) => {
    setArrowRegions(e);
    setPageNumber(5);
  };

  console.log(ArrowRegions);

  return (
    <div
      onClick={() => handleChosingOptions(regions.name)}
      className="h-[100px] w-[90%] md:w-[43%] bg-white my-[5px] border-orange-300 border rounded-xl flex justify-center items-center cursor-pointer duration-200 hover:shadow-[0px_0px_12px_0px_rgba(0, 0, 0, 0.3)] p-[5px]"
    >
      <div className="border-yellow-800 h-full w-full flex items-center justify-between">
        <div className="h-full w-[104px] border rounded-xl overflow-hidden relative">
          {/* {ArrowRegions.includes(types.name) && (
            <div className="w-full h-full absolute top-0 z-10 bg-white/[0.7]">
              <Image src="/Survey/Types/checked.png" objectFit="cover" fill alt="bungalow" />
            </div>
          )} */}
          <Image src={`/${regions.photo}`} objectFit="cover" fill alt="bungalow" />
        </div>
        <p className="ml-[20px] w-[40%] font-semibold text-[18px] leading-[24px] flex-1">
          {regions.name}
        </p>
      </div>
    </div>
  );
}
