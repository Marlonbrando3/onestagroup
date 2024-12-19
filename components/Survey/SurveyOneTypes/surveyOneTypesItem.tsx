import React, { useEffect } from "react";
import Image from "next/image";

type Types = {
  types: any;
  ArrowTypes: any;
  setArrowTypes: any;
};

export default function SurveyOne({ types, ArrowTypes, setArrowTypes }: Types) {
  const handleChangingType = () => {
    let data = [...ArrowTypes];

    console.log(types.name);

    if (ArrowTypes.includes(types.name)) {
      let updatedArray = data.filter((i: any) => i !== types.name);
      data = updatedArray;
      setArrowTypes(data);
    } else if (!ArrowTypes.includes(types.name) && types.name === "Jeszcze nie zdecydowałem") {
      setArrowTypes([types.name]);
    } else if (!ArrowTypes.includes(types.name) && types.name !== "Jeszcze nie zdecydowałem") {
      data.push(types.name);
      let updatedArray = data.filter((i: any) => i !== "Jeszcze nie zdecydowałem");
      updatedArray.push(types.name);
      setArrowTypes(updatedArray);
    }
  };

  return (
    <>
      {types.name === "Jeszcze nie zdecydowałem" && <p className="md:hidden">lub</p>}
      <div
        onClick={handleChangingType}
        className="h-[100px] w-[90%] md:w-[43%] bg-white my-[5px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.3)] rounded-xl flex justify-center items-center  cursor-pointer duration-200 hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.3)]"
      >
        <div className="border-yellow-800 h-[110px] w-full flex items-center justify-center py-[6px]">
          <div className="h-full w-[100px] border rounded-xl overflow-hidden relative">
            {ArrowTypes.includes(types.name) && (
              <div className="w-full h-full absolute top-0 z-10 bg-white/[0.7]">
                <Image src="/Survey/Types/checked.png" objectFit="cover" fill alt="bungalow" />
              </div>
            )}

            <Image src={`/${types.photo}`} objectFit="cover" fill alt="bungalow" />
          </div>
          <p className="ml-[20px] w-[60%] font-semibold text-[18px] leading-[24px]">{types.name}</p>
        </div>
      </div>
    </>
  );
}
