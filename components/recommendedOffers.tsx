import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import DataCountry from "../data/DataCountry.json";
import Properties from "@/public/properties.json";
import PropertyCard from "./SearchEngine/PropertyCard";
import Link from "next/link";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";

export default function RecommendedOffers() {
  const Props = Properties.filter((i) => i.generatedDescription === "Rekomendowana");
  console.log(Props);

  return (
    <>
      <div
        className={`${Red_Hat_DisplayFont.className} md:w-[1200px] w-screen h-auto mx-auto mt-[60px] md:mt-[10px]`}
      >
        <p className="text-[25px] mb-[40px] w-screen md:w-auto text-left font-semibold uppercase">
          <span className="bg-orange-500 px-[5px] text-white rounded-sm">Rekomendowane</span> oferty
        </p>
        <div className="flex md:flex-row flex-col">
          {Props.map((i: any, index: any) => (
            <PropertyCard key={index} property={i} />
          ))}
        </div>
        <div className="w-full flex">
          <Link
            href="/nieruchomosci/hiszpania"
            className="md:w-[200px] w-[170px] border-b-2 rounded-sm border-orange-400 text-[25px] text-center mx-auto mt-[40px] cursor-pointer hover:text-white hover:bg-orange-500 duration-150"
          >
            Więcej ofert
          </Link>
        </div>
      </div>
    </>
  );
}
