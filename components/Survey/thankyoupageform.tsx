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
      <div className="text-center w-[90vw] md:w-[50%] text-[24px] border py-[30px] bg-white rounded-xl">
        <p
          className={`${GreatVibes.className} md:text-[80px] text-[50px] mb-[20px] text-yellow-600 md:leading-[90px] leading-[60px]`}
        >
          Witamy<br></br>w Onesta Group!
        </p>
        <div className="h-[1px] w-[70%] bg-gray-600 mx-auto mb-[40px]"></div>
        <p className={`text-[20px] leading-[24px] md:px-[80px] mx-auto `}>
          <p className={`${TenorsSans.className} font-bold text-[26px]`}>Dziękujemy za zaufanie!</p>{" "}
          <br />
          Pozwól nam poznać Twoje preferencje abyśmy mogli dostarczać Ci trafne oferty
          nieruchomości. Zostaniesz{" "}
          <strong className="text-red-600 font-semibold">natychmiast przekierowany</strong> do
          wybranych wcześniej ofert (nie musisz czekać na maila).
        </p>
        <div
          onClick={handleStartingSurvey}
          className="duration-200 border bg-green-500 border-green-500 w-[200px] rounded-md mx-auto text-white mt-[40px] cursor-pointer hover:bg-white hover:text-black hover:border-gray-900"
        >
          Rozpocznij
        </div>
      </div>
    </div>
  );
}
