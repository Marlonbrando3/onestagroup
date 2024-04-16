import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutOnestaMainPage() {
  return (
    <div className="w-screen h-auto py-[40px]">
      <h1 className="w-[60%] text-right text-[34px] py-[30px] leading-[35px] mx-auto ">
        Multiagencja <span className="font-bold">Onesta Group</span>...<br></br>inna niż wszystkie
      </h1>
      <div className="lg:w-[1000px] w-[90vw] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[300px] h-[250px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/bg_about.jpeg" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px] text-[20px]">
          <b>Dla Ciebie oznacza to</b>, że współpraca z zespołem z Onesta Group to ludzie z prawie
          15 letnim doświadczeniem w sprzedaży i budowaniu relacji oraz rozumienia klienta. Słuchamy
          klientów.
          <br></br>Wychodzimy na przeciw Twoich potrzeb i przeszukujemy rynek aby znaleść coś dla
          Ciebie. <br></br>Zatem masz ludzi z nastawieniem na zrozumienie i relację oraz z ofertami
          wielu agencji - wszystko w jednym miejscu.
        </div>
      </div>
    </div>
  );
}
