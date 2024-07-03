import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutOnestaMainPage() {
  return (
    <div className="w-screen h-auto py-[140px]">
      <h1 className="w-[60%] text-right text-[34px] py-[30px] leading-[35px] mx-auto ">
        Multibroker <span className="font-bold">Onesta Group</span>...<br></br>inna niż wszystkie
      </h1>
      <div className="lg:w-[1000px] w-[90vw] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[300px] h-[250px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/bg_about.jpeg" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px] text-[20px] md:mt-[30px] mt-auto">
          <b>Dla Ciebie oznacza to</b> współpracę z zespołem z 15 letnim doświadczeniem w sprzedaży
          i budowaniu relacji z klientami. Słuchamy.
          <br></br>Wychodzimy na przeciw Twoim potrzebom, przeszukujemy rynek, znajdujemy oferty
          wpisujące się w preferencje. <br></br>Zatem ofertujemy Ci nasz czas, uwagę i cierpliwość
          wraz z ofertami wielu agencji na rynku Hiszpańskim - wszystko w jednym miejscu.
        </div>
      </div>
    </div>
  );
}
