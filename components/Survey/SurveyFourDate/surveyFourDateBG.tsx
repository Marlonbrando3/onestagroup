import React, { useState } from "react";
import DataSurvey from "../../../data/survey.json";
import SurveyFourDateItem from "./surveyFourDateItem";

type Page = {
  PageNumber: any;
  setPageNumber: any;
};

export default function SurveyFourDateBG({ PageNumber, setPageNumber }: Page) {
  const handleStartingSurvey = () => {
    if (ArrowTime.length > 0) {
      setPageNumber(7);
    }
  };

  const Time = DataSurvey.filter((i) => i.type === "Time");
  const [ArrowTime, setArrowTime] = useState([]);

  const showedTime = Time[0].options.map((i) => (
    <SurveyFourDateItem key={i.id} types={i} ArrowTime={ArrowTime} setArrowTime={setArrowTime} />
  ));

  return (
    <div className="w-full md:h-[86.7vh] h-screen md:w-[800px] flex items-center md:justify-center justify-center mx-auto">
      <div className="bg-white w-[90%] h-auto rounded-2xl flex flex-col md:flex-row md:flex-wrap items-center justify-center py-[20px] shadow-[0px_0px_25px_10px_rgba(0,0,0,0.3)] md:space-x-2">
        <p className="mx-[30px] text-center text-[18px] md:text-[22px] font-semibold mb-[15px] inline">
          Na jakim etapie decyzji jesteś{" "}
          <p className="inline font-thin text-[16px]">(jednokrotny wybór)</p>
        </p>
        {showedTime}
        <div className="w-full place-items-center grid">
          <div
            onClick={handleStartingSurvey}
            className={`${
              ArrowTime.length === 0 ? "bg-gray-300" : "bg-green-500"
            }  text-[22px] w-[140px] h-[35px] place-items-center grid text-white rounded-md mt-[10px] cursor-pointer`}
          >
            Dalej
          </div>
        </div>
      </div>
    </div>
  );
}
