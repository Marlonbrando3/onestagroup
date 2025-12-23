import React from "react";
import { FaCheck } from "react-icons/fa";

export default function Whyinvestorstay() {
  return (
    <div className="md:w-full w-[90vw]  mx-auto py-[120px] border-b">
      <div>
        <div className="text-[26px] md:text-[34px] flex items-center font-semibold leading-[30px] pb-[20px]">
          <FaCheck className="mr-[20px] text-green-500 " /> Dlaczego pobyt inwestorski to najlepszy
          pomysł?
        </div>
        <div className="text-black border-t-[3px] border-b-[3px] border-green-500 w-full md:w-[780px] h-auto py-[15px] md:-ml-[40px] md:px-[40px] leading-[30px] font-normal my-[20px] text-[26px]">
          <span className="bg-orange-400 px-[5px] text-white">Ponad 70% osób</span>, zmienia swoje
          odczucia i/lub preferencje co do wybranej pierwotnie nieruchomości{" "}
          <span className="bg-orange-400 px-[5px] text-white">gdy zobaczy ją na żywo.</span>
        </div>
        <div className="leading-[20px] md:text-[22px] md:leading-[24px]">
          Jest to rozwiązanie dla tych poszukujących, którzy rozumieją, że przeglądanie ofert to
          zbyt mało aby podjąć jakąkolwiek decyzję. Odczucia zbudowane na bazie zdjęć i wybranie tak
          nieruchomości, często skutkuje zmianą tych odczuć gdy jest ona oglądana &quot;na
          żywo&quot;.
          <br></br>
          <br></br> Wizyty z nastawieniem na <strong>np. 2 wybrane nieruchomości</strong> stosunkowo
          często kończą się
          <strong> powrotem do domu bez zakupu.</strong> Naszym zdaniem pobyt inwestorski i
          otwartość na oferty są konieczne w procesie zakupu. <br></br>
          <br></br>
          <strong>Dlaczego?</strong>
          <br></br>
          <br></br> Prócz zdjęć lub wizualizacji, bardzo dużą rolę ma otoczenie nieruchomości,
          charakter miasta, okoliczne atrakcje, styl życia danego miasta, plaże, sklepy,
          dotychczasowa skuteczność wynajmu w tym regionie itd. <br></br>
          <br></br>Połowa zakupu to nieruchomość, <strong>druga połowa to otoczenie</strong>. Są to
          aspekty, których nie widać na zdjęciach, a znacząco wpływają one na atrakcyjności nie
          tylko apartamentów ale późniejszą atrakcyjność dla wynajmujących - jeśli zależy Państwu na
          późniejszym wynajmie. <br></br>
          <br></br>Pobyt inwestorski gwarantuje cześciowe zrozumienie rynku nieruchomości i podjęcie
          świadomej, szybszej i lepszej decyzji.
        </div>
      </div>
    </div>
  );
}
