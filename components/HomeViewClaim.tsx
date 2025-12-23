import React from "react";
import { Red_Hat_DisplayFont, BonheurRoyaleFont } from "../fonts/fonts";

export default function HomeViewClaim() {
  return (
    <div className="absolute top-[150px] left-[30px] z-30">
      <div className="ml-[20px] w-[600px] md:h-[600px] h-[850px] text-[18px] md:mt-[10px] mt-auto bg-white rounded-[4px] shadow-[0_0px_10px_0_rgba(0,0,0,0.3)] relative">
        <h1 className="w-[80%] text-left text-[34px] py-[10px] leading-[35px] mx-auto mb-[30px]">
          {/* <span className="font-bold">Onesta Group</span> */}
          <br></br>
          <p
            className={`${Red_Hat_DisplayFont.className} text-[30px] text-[#2C2B5D] font-bold`}
          >
            Bezpieczny i mądry proces poszukiwań i zakupu
          </p>
        </h1>
        <p className="md:pl-[40px] mr-[50px] ml-[10px]">
          <b>
            Poszukujesz kogoś komu będziesz mógł zaufać w procesie zakupu
            nieruchomości?
          </b>{" "}
          <br></br>
          <br></br>Właśnie w tym celu powstała Onesta Group. Rozumiejąc rynek
          oraz jego zawiłości dostrzegamy, że przyszli nabywcy nieruchomości
          poszukują kogoś kto będzie Im oparciem w procesie zakupu i na każdym
          jego etapie. Dzięki doskonalłej komunikacji i czasu jaki przeznaczamy
          dla ka
        </p>{" "}
        <br></br>
        <p
          className={`${BonheurRoyaleFont.className} w-[80%] mx-auto text-[50px] text-orange-400 font-bold text-left`}
        >
          Zapraszamy!
        </p>
        <div
          className={`${Red_Hat_DisplayFont.className} font-bold h-[50px] w-[80%] mx-auto place-items-start`}
        >
          <div className="w-[100px] h-auto border border-gray-900">
            <br></br>
            <p className="text-[14px] text-left w-full">Zespół</p>
            <p className="text-[18px] text-leftfont bold w-full">
              ONESTA GROUP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
