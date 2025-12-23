import React, { useEffect } from "react";
import Image from "next/image";

type Types = {
  budget: any;
  type: any;
  PageNumber: any;
  setPageNumber: any;
  ArrowBudget: any;
  setArrowBudget: any;
};

export default function SurveyThreeBudgetItem({
  budget,
  type,
  PageNumber,
  setPageNumber,
  ArrowBudget,
  setArrowBudget,
}: Types) {
  // const handleChangingType = () => {
  //   let data = [...ArrowBudget];

  //   console.log(budget.name);

  //   if (ArrowBudget.includes(budget.name)) {
  //     let updatedArray = data.filter((i: any) => i !== budget.name);
  //     data = updatedArray;
  //     setArrowBudget(data);
  //   } else if (!ArrowBudget.includes(budget.name)) {
  //     data.push(budget.name);
  //     setArrowBudget(data);
  //   }
  // };

  const handleChosingOptions = (e: any) => {
    setArrowBudget(e);
    setPageNumber(6);
  };

  return (
    <div
      onClick={() => handleChosingOptions(budget.name)}
      className="h-[100px] w-[90%] md:w-[43%] bg-white my-[5px] border-orange-400 border rounded-xl flex justify-center items-center  cursor-pointer duration-200 hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.3)] p-[5px]"
    >
      <div className="border-yellow-800 h-full w-full flex items-center justify-center">
        <div className="h-full w-[100px] border rounded-xl overflow-hidden relative">
          {/* {ArrowBudget.includes(budget.name) && (
            <div className="w-full h-full absolute top-0 z-10 bg-white/[0.7]">
              <Image src="/Survey/Types/checked.png" objectFit="cover" fill alt="bungalow" />
            </div>
          )} */}
          <Image src={`/${budget.photo}`} objectFit="cover" fill alt="bungalow" />
        </div>
        <p className="ml-[20px] w-[60%] font-semibold text-[18px] leading-[24px] flex-1">
          {budget.name}
        </p>
      </div>
    </div>
  );
}
