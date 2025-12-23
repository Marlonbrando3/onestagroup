import React from "react";

type Property = {
  investition: any;
};

export default function AboutProperty({ investition }: Property) {
  return (
    <div className="py-[20px] w-full border">
      <div className="w-full mx-auto bg-white h-auto px-[15px] py-[22px] text-[17px]">
        <p className="uppercase font-bold text-[22px] mb-[10px]">O projekcie</p>
        <li>50 apartamentów</li>
        <li>Ceny od 299 000 euro</li>
        {/* niżej należy dodać te dane do Asari */}
        <li>Apartamenty, bungalowy</li>
        <li>Oddanie 2025-03</li>
        <p className="uppercase font-bold text-[22px] my-[10px]">udogodnienia</p>
        <li>Basen</li>
        <li>Restauracje</li>
        <li>Centrum handlowe</li>
        <li>Kort tenisowy</li>
      </div>
    </div>
  );
}
