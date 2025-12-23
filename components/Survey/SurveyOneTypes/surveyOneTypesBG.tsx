import React, { useState } from "react";
import DataSurvey from "../../../data/survey.json";
import SurveyOneTypes from "./surveyOneTypesItem";
import { useMyContext } from "@/components/context/myContext";

type Page = {
  PageNumber: any;
  setPageNumber: any;
  ArrowTypes: any;
  setArrowTypes: any;
};

export default function SurveyOneTypesBG({
  PageNumber,
  setPageNumber,
  ArrowTypes,
  setArrowTypes,
}: Page) {
  // const handleStartingSurvey = () => {
  //   if (ArrowTypes.length > 0) {
  //     setPageNumber(4);
  //   }
  // };

  const Types = DataSurvey.filter((i) => i.type === "TypeOfProperty");

  console.log(ArrowTypes);

  const showedTypes = Types[0].options.map((i) => (
    <SurveyOneTypes
      key={i.id}
      types={i}
      ArrowTypes={ArrowTypes}
      setArrowTypes={setArrowTypes}
      PageNumber={PageNumber}
      setPageNumber={setPageNumber}
    />
  ));

  return (
    <div className="w-full md:h-[86.7vh] h-screen md:w-[800px] flex items-center md:justify-center justify-center mx-auto">
      <div className="bg-white w-[90%] h-auto rounded-2xl flex flex-col md:flex-row md:flex-wrap items-center justify-center py-[20px] shadow-[0px_0px_25px_10px_rgba(0,0,0,0.3)] md:space-x-2">
        <p className="mx-[30px] text-center text-[18px] md:text-[22px] font-semibold mb-[15px] inline">
          Jakiego rodzaju nieruchomości szukasz?{" "}
          {/* <p className="inline font-thin text-[16px]">(wielokrotny wybór)</p> */}
        </p>
        {showedTypes}
        {/* <div
          onClick={handleStartingSurvey}
          className={`${
            ArrowTypes.length === 0 ? "bg-gray-200" : "bg-green-500"
          } text-[22px] w-[140px] h-[35px] place-items-center grid text-white rounded-md mt-[10px] cursor-pointer`}
        >
          Dalej
        </div> */}
      </div>
    </div>
  );
}
