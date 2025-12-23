import React, { useState } from "react";
import DataSurvey from "../../../data/survey.json";
import SurveyTwoRegionsItem from "./surveyTwoRegionsItem";

type Page = {
  PageNumber: any;
  setPageNumber: any;
  ArrowRegions: any;
  setArrowRegions: any;
};

export default function SurveyTwoRegionsBG({
  PageNumber,
  setPageNumber,
  ArrowRegions,
  setArrowRegions,
}: Page) {
  // const handleStartingSurvey = () => {
  //   if (ArrowRegions.length > 0) {
  //     setPageNumber(5);
  //   }
  // };

  const Regions = DataSurvey.filter((i) => i.type === "Regions");

  console.log(ArrowRegions);

  const showedTypes = Regions[0].options.map((i) => (
    <SurveyTwoRegionsItem
      key={i.id}
      regions={i}
      ArrowRegions={ArrowRegions}
      setArrowRegions={setArrowRegions}
      PageNumber={PageNumber}
      setPageNumber={setPageNumber}
    />
  ));

  return (
    <div className="w-full md:h-[86.7vh] h-screen md:w-[800px] flex items-center md:justify-center justify-center mx-auto ">
      <div className="bg-white w-[90%] h-auto rounded-2xl flex flex-col md:flex-row md:flex-wrap items-center justify-center py-[20px] shadow-[0px_0px_25px_10px_rgba(0,0,0,0.3)] md:space-x-2">
        <p className="md:mx-[30px] text-center text-[18px] md:text-[22px] font-semibold mb-[15px]">
          W jakim regionie szukasz nieruchomości?{" "}
          {/* <p className="inline  font-thin text-[16px]">(wielokrotny wybór)</p> */}
        </p>
        {showedTypes}
        {/* <div className="w-full place-items-center grid">
          <div
            onClick={handleStartingSurvey}
            className={`${
              ArrowRegions.length === 0 ? "bg-gray-300" : "bg-green-500"
            }  text-[22px] w-[140px] h-[35px] place-items-center grid text-white rounded-md mt-[10px] cursor-pointer`}
          >
            Dalej
          </div>
        </div> */}
      </div>
    </div>
  );
}
