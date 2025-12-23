import React from "react";
import { FaCheck } from "react-icons/fa";

export default function Whyonesta() {
  return (
    <div className="md:w-full w-[90vw] mx-auto py-[40px] border-b">
      <div>
        <div className="text-[26px] md:text-[34px] flex items-center font-semibold leading-[30px] pb-[20px]">
          <FaCheck className="mr-[20px] text-green-500 " /> Dlaczego Onesta Group?
        </div>
        <div className="text-black border-t-[3px] border-b-[3px] border-green-500 w-full md:w-[780px] h-auto py-[15px] md:-ml-[40px] md:px-[40px] leading-[30px] font-normal my-[20px] text-[26px]">
          Broker z dostępnością ofert z{" "}
          <span className="bg-orange-400 px-[5px] text-white">
            90% rynku i parnerami w każdym aspekcie zakupu.
          </span>
        </div>
        <div className="leading-[20px] md:text-[22px] md:leading-[24px]">
          Grupa Onesta ma za sobą ok{" "}
          <strong>
            6 lat koordynowania lub prowadzenia procesów sprzedaży.<br></br>
            <br></br>
          </strong>{" "}
          Przez ten czas zbudowaliśmy relacje oraz sprawdziliśmy szczelność procesów, efektywność
          partnerów, nauczyliśmy się tego na co zwracać uwagę. <br></br>
          <br></br>Współpracujemy z kilkoma biurami na terenie Hiszpanii oraz korzystamy z systemów
          wymany ofert co pozwala nam dotrzeć,{" "}
          <strong>przedstawić oferty z lwiej części rynku Hiszpańskiego</strong> w językach Polski,
          Angielski, Hiszpański, Rosyjski. <br></br>
          <br></br>Jesteśmy w stanie skoorynować proces od prezentacji, poprzez formalności, akt
          notarialny, umeblowanie oraz zarządzanie najmem.
        </div>
      </div>
    </div>
  );
}
