import React from "react";
import Image from "next/image";

export default function Mainview() {
  return (
    <div className="w-full h-[600px] bg-[url('/main_bg.png')] bg-cover bg-center flex items-center border-2 border-red-900">
      <div className="w-[1023px] mx-auto">
        <div className="bg-white md:w-[600px] w-[90vw] md:text-[24px] text-[20px] rounded-r-[20px]  p-[10px] pl-[20px]">
          <p className="md:text-[22px] text-[20px] text-black  leading-[32px]">
            <p className="text-orange-500 font-bold md:text-[38px] text-[30px] italice">
              2-dniowe spoktanie/prezentacje
            </p>{" "}
            na którym poznasz model inwestowania w nieruchomości w Hiszpanii oraz zobaczysz
            najciekawsze oferty.
          </p>
        </div>
      </div>
    </div>
  );
}
