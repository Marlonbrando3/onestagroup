import React from "react";
import { QuicksandSans } from "../fonts/fonts";

export default function Model() {
  return (
    <div className={`${QuicksandSans.className} md:w-full w-[90vw] mx-auto py-[40px] border-b`}>
      <div>
        <div className="text-[24px] font-semibold leading-[30px]">
          Model inwestowania w Nieruchomości w Hiszpanii
        </div>
        <div className="bg-orange-400 w-[85vw] md:w-[600px] h-auto py-[5px] -ml-[40px] italic text-white pl-[40px] rounded-r-xl leading-[20px] flex items-center font-bold my-[20px]">
          Średnie zyski z wynajmu oscylują pomiędzy 6-8% rocznie plus wzrost wartości nieruchomości{" "}
        </div>
        <div className="leading-[20px]">
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
