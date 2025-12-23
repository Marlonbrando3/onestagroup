import React from "react";
import { FaCheck } from "react-icons/fa";

export default function Model() {
  return (
    <div className="md:w-full w-[90vw] mx-auto py-[120px] border-b">
      <div>
        <div className="text-[26px] md:text-[34px] flex items-center font-semibold leading-[30px] pb-[20px]">
          <FaCheck className="mr-[20px] text-green-500 " />
          Model inwestowania w Nieruchomości w Hiszpanii
        </div>
        <div className="text-black border-t-[3px] border-b-[3px] border-green-500 w-full md:w-[780px] h-auto py-[15px] md:-ml-[40px] md:px-[40px] leading-[30px] font-normal my-[20px] text-[26px]">
          Średnie zyski z wynajmu oscylują pomiędzy{" "}
          <span className="bg-orange-400 px-[5px] text-white">
            6-8% rocznie plus wzrost wartości nieruchomości{" "}
          </span>
        </div>
        <div className="leading-[20px] md:text-[22px] md:leading-[24px]">
          Najczęściej (nie zawsze) jest tak, że nieruchomości z rynku wtórnego nie spełniają
          oczekiwań kupujących, wiele zależy od przeznaczonego na zakup budżetu. <br></br>
          <br></br>Po podjęciu decyzji o zakupie wybranego apartamentu,{" "}
          <strong>następuję opłata rezerwacyjna w kowtach między 3000 a 10 000 euro</strong>, która
          blokuje nieruchomość na czas kolejnych wpłat lub starania się o kredyt.<br></br> <br></br>{" "}
          W przypadku rynku wtórnego akt notarialny ma miejsce wraz z uzyskaniem dofinansowania lub
          gotowością do wykonania przelewu.<br></br> <br></br> W przypadku rynku pierwotnego
          płatności są podzielone na 2 lub 3 transze, gdzie zazwycaj ostatnie 50% płatne jest
          dopiero przy akcie notarialnym, czyli po oddaniu nieruchomości do użytku. Po akcie
          notarialym konieczne jest odświeżenie lub umeblowanie nieruchomości, wyrobienie licencji
          turystycznej i dodanie ogłoszeń o wynajem co jest realizowane w ramach usług.
        </div>
      </div>
    </div>
  );
}
