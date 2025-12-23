import React, { useState } from "react";
import DataSurvey from "../../../data/survey.json";
import SurveyThreeBudgetItem from "./surveyThreeBudgetItem";

type Page = {
  PageNumber: any;
  setPageNumber: any;
  ArrowBudget: any;
  setArrowBudget: any;
};

export default function SurveyThreeBugdetBG({
  PageNumber,
  setPageNumber,
  ArrowBudget,
  setArrowBudget,
}: Page) {
  const handleStartingSurvey = () => {
    if (ArrowBudget.length > 0) {
      setPageNumber(6);
    }
  };

  const Budget = DataSurvey.filter((i) => i.type === "Budget");

  const showedTypes = Budget[0].options.map((i) => (
    <SurveyThreeBudgetItem
      key={i.id}
      budget={i}
      PageNumber={PageNumber}
      setPageNumber={setPageNumber}
      type={Budget[0].type}
      ArrowBudget={ArrowBudget}
      setArrowBudget={setArrowBudget}
    />
  ));

  return (
    <div className="w-full md:h-[86.7vh] h-screen md:w-[800px] flex items-center md:justify-center justify-center mx-auto">
      <div className="bg-white w-[90%] h-auto rounded-2xl flex flex-col md:flex-row md:flex-wrap items-center justify-center py-[20px] shadow-[0px_0px_25px_10px_rgba(0,0,0,0.3)] md:space-x-2">
        <p className="mx-[30px] text-center text-[18px] md:text-[22px] font-semibold mb-[15px] inline w-full">
          W jakim budżecie szukasz?{" "}
          {/* <p className="inline font-thin text-[16px]">(wielokrotny wybór)</p> */}
        </p>
        {showedTypes}
        {/* <div className="w-full place-items-center grid">
          <div
            onClick={handleStartingSurvey}
            className={`${
              ArrowBudget.length === 0 ? "bg-gray-300" : "bg-green-500"
            }  text-[22px] w-[140px] h-[35px] place-items-center grid text-white rounded-md mt-[10px] cursor-pointer`}
          >
            Dalej
          </div>
        </div> */}
      </div>
    </div>
  );
}
