import React from "react";
import { QuicksandSans } from "../fonts/fonts";

export default function Whyinvestorstay() {
  return (
    <div className={`${QuicksandSans.className} md:w-full w-[90vw]  mx-auto py-[40px] border-b`}>
      <div>
        <div className="text-[24px] font-semibold leading-[30px]">
          Dlaczego pobyt inwestorski to najlepszy pomysł?
        </div>
        <div className="bg-orange-400 w-[85vw] md:w-[600px] h-auto py-[5px] -ml-[40px] italic text-white pl-[40px] rounded-r-xl leading-[20px] flex items-center font-bold my-[20px]">
          Ponad 70% osób, zmienia swoje odczucia co do wybranej pierwotnie nieruchomości gdy zobaczy
          ją na żywo.
        </div>
        <div className="leading-[20px]">
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
