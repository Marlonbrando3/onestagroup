import React from "react";
import { FaCheck } from "react-icons/fa";

export default function Howlooksinvestorstay() {
  return (
    <div className="md:w-full w-[90vw] mx-auto py-[120px] border-b ">
      <div>
        <div className="text-[26px] md:text-[34px] flex items-center font-semibold leading-[30px] pb-[20px]">
          <FaCheck className="mr-[20px] text-green-500 " /> Jak wygląda pobyt inwestorski?
        </div>
        <div className="text-black border-t-[3px] border-b-[3px] border-green-500 w-full md:w-[780px] h-auto py-[15px] md:-ml-[40px] md:px-[40px] leading-[30px] font-normal my-[20px] text-[26px]">
          Osoby przylatujące po konkretną nieruchomość ze zdjęcia zawyczaj wracają,{" "}
          <span className="bg-orange-400 px-[5px] text-white">
            osoby otwarte na szersze prezentacje zazwyczaj kupują.
          </span>
        </div>
        <div className="leading-[20px] md:text-[22px] md:leading-[24px]">
          <strong>Inwestor wybiera termin swojej wizyty w Hiszpanii</strong>, możemy zaoferować
          nocleg lub pomóc go znaleźć. <br></br>
          <br></br>Po wstępnym wywiadzie telefonicznym przygotowujemy oferty nieruchomości, które
          <strong> wpisują się ustalone kryteria i są dostępne w chwili wizyty</strong>. <br></br>
          <br></br>Rezerwujemy wizyty i w ciągu maksymalnie 2 dni prezentuejmy wybrane opcje
          bezpośrednio na miejscu. <br></br>
          <br></br>Ponadto zwiedzamy okolicę, prezentujemy miasta, omawiamy zalety i wady
          inwestowania a danym miejscu. <br></br>
          <br></br>Są to kilkudniowe wakacje, które są wg. nas{" "}
          <strong>
            najskuteczniejszą formą do zrozumienia tego rynku oraz wszelkich aspektów niezbędnych do
            podjęcia dobrej decyzji.
          </strong>
        </div>
      </div>
    </div>
  );
}
