import React from "react";
import { Dancing, TenorsSans, GreatVibes } from "../../fonts/fonts";

type Page = {
  PageNumber: any;
  setPageNumber: any;
};

export default function Thankyoupageform({ PageNumber, setPageNumber }: Page) {
  const handleStartingSurvey = () => {
    setPageNumber(3);
  };

  return (
    <div className="h-screen md:w-full w-full mx-auto flex items-center justify-center py-[40px]">
      <div className="text-center w-[90vw] md:w-[70%] text-[24px] border py-[30px] bg-white rounded-xl">
        <p
          className={`${GreatVibes.className} md:text-[80px] text-[50px] mb-[20px] text-yellow-700 md:leading-[90px] leading-[60px]`}
        >
          Witamy<br></br>w Onesta Group!
        </p>
        <div className="h-[1px] w-[70%] bg-gray-600 mx-auto mb-[40px]"></div>
        <p className={`${TenorsSans.className} text-[20px] leading-[22px] font `}>
          <p className="font-bold text-[22px]">Dziękujemy za zaufanie!</p> <br />
          Pozwól nam poznać Twoje prefernecje abyśmy mogli dostarczać Ci trafne oferty
          nieruchomości.
        </p>
        <div
          onClick={handleStartingSurvey}
          className="bg-green-500 w-[200px] rounded-md mx-auto text-white mt-[40px]"
        >
          Rozpocznij
        </div>
      </div>
    </div>
  );
}
