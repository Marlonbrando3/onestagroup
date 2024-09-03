import React from "react";
import { QuicksandSans } from "../fonts/fonts";

export default function Howlooksinvestorstay() {
  return (
    <div className={`${QuicksandSans.className} md:w-full w-[90vw] mx-auto py-[40px] border-b`}>
      <div>
        <div className="text-[24px] font-semibold leading-[30px]">
          Jak wygląda pobyt inwestorski?
        </div>
        <div className="bg-orange-400 w-[85vw] md:w-[600px] h-auto py-[5px] -ml-[40px] italic text-white pl-[40px] rounded-r-xl leading-[20px] flex items-center font-bold my-[20px]">
          Osoby przylatujące po konkretną nieruchomość ze zdjęcia zawyczaj wracają, osoby otwarte na
          szersze prezentacje zazwyczaj kupują.
        </div>
        <div className="leading-[20px]">
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
