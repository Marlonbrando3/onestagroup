import React, { useEffect } from "react";
import Image from "next/image";

type Types = {
  types: any;
  type: any;
  ArrowBudget: any;
  setArrowBudget: any;
};

export default function SurveyThreeBudgetItem({ types, type, ArrowBudget, setArrowBudget }: Types) {
  const handleChangingType = () => {
    let data = [...ArrowBudget];

    console.log(types.name);

    if (ArrowBudget.includes(types.name)) {
      let updatedArray = data.filter((i: any) => i !== types.name);
      data = updatedArray;
      setArrowBudget(data);
    } else if (!ArrowBudget.includes(types.name)) {
      data.push(types.name);
      setArrowBudget(data);
    }
  };

  console.log(type);

  return (
    <div
      onClick={handleChangingType}
      className="h-[100px] w-[90%] md:w-[43%] bg-white my-[5px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.3)] rounded-xl flex justify-center items-center  cursor-pointer duration-200 hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.3)]"
    >
      <div className="border-yellow-800 h-[110px] w-full flex items-center justify-center py-[6px]">
        <div className="h-full w-[100px] border rounded-xl overflow-hidden relative">
          {ArrowBudget.includes(types.name) && (
            <div className="w-full h-full absolute top-0 z-10 bg-white/[0.7]">
              <Image src="/Survey/Types/checked.png" objectFit="cover" fill alt="bungalow" />
            </div>
          )}
          <Image src={`/${types.photo}`} objectFit="cover" fill alt="bungalow" />
        </div>
        <p className="ml-[20px] w-[60%] font-semibold text-[18px] leading-[24px]">{types.name}</p>
      </div>
    </div>
  );
}