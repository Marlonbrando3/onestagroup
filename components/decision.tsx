import React from "react";
import { QuicksandSans } from "../fonts/fonts";

export default function Decision() {
  return (
    <div className={`${QuicksandSans.className} md:w-full w-[90vw] mx-auto py-[40px] border-b`}>
      <div>
        <div className="text-[24px] font-semibold leading-[30px]">
          Decyzja o zakupie - co dalej?
        </div>
        <div className="bg-orange-400 w-[85vw] md:w-[600px] h-auto py-[5px] -ml-[40px] italic text-white pl-[40px] rounded-r-xl leading-[20px] flex items-center font-bold my-[20px]">
          Rezerwacja nieruchomości to koszt ok 3000 euro i rozpoczęcia prac formalnych.
        </div>
        <div className="leading-[20px]">
          W zdecydowanej więkoszści przypadków, zakupiona nieruchomość ma być wynajmowana. <br></br>
          Wymaga ona zazwyczaj przynajmniej odświeżenia (rynek wtórny) lub umeblowania (rynek
          pierwotny). Nasi partnerzy specjalizujący się w tych zadaniach porzygotują (odnowią lub
          umeblują) nieruchomość{" "}
          <strong>aby była gotowa to daleszego wynajmu lub wprowadzena się.</strong>
          <br></br>
          <br></br> W czasie pobyty lub bezpośrednio przed aktem notarialnym konieczne jest
          <strong>
            wyrobienie numeru N.I.E, który jest określany mianem hiszpańskiego numeru NIP (lub
            pesel).
          </strong>
          <br></br>
          Kupujący jest przeprowadzany przez ten proces.
        </div>
      </div>
    </div>
  );
}
