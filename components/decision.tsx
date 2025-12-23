import React from "react";
import { FaCheck } from "react-icons/fa";

export default function Decision() {
  return (
    <div className="md:w-full w-[90vw] mx-auto py-[120px] border-b">
      <div>
        <div className="text-[26px] md:text-[34px] flex items-center font-semibold leading-[30px] pb-[20px]">
          <FaCheck className="mr-[20px] text-green-500 " /> Decyzja o zakupie - co dalej?
        </div>
        <div className="text-black border-t-[3px] border-b-[3px] border-green-500 w-full md:w-[780px] h-auto py-[15px] md:-ml-[40px] md:px-[40px] leading-[30px] font-normal my-[20px] text-[26px]">
          Rezerwacja nieruchomości to koszt ok{" "}
          <span className="bg-orange-400 px-[5px] text-white">
            3000 euro i rozpoczęcia prac formalnych.
          </span>
        </div>
        <div className="leading-[20px] md:text-[22px] md:leading-[24px]">
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
