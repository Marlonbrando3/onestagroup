import React from "react";
import { QuicksandSans } from "../fonts/fonts";import Whyinvestorstay from "./whyinvestorstay";
Whyinvestorstay

export default function Whyonesta() {
  return (
    <div className={`${QuicksandSans.className} md:w-full w-[90vw] mx-auto py-[40px] border-b`}>
      <div>
        <div className="text-[24px] font-semibold leading-[30px]">Dlaczego Onesta Group?</div>
        <div className="bg-orange-400 w-[85vw] md:w-[600px] h-auto py-[5px] -ml-[40px] italic text-white pl-[40px] rounded-r-xl leading-[20px] flex items-center font-bold my-[20px]">
          Broker z dostępnością ofert z 90% rynku i parnerami w każdym aspekcie zakupu.
        </div>
        <div className="leading-[20px]">
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
