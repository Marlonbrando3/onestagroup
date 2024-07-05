import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import DataCountry from "../data/DataCountry.json";
import Properties from "@/public/properties.json";
import PropertyCard from "./SearchEngine/PropertyCard";
import Link from "next/link";

export default function RecommendedOffers() {
  const Props = Properties.filter((i) => i.generatedDescription === "Rekomendowana");
  console.log(Props);

  return (
    <>
      <div className="md:w-[1200px] w-screen h-auto mx-auto">
        <p className="text-[25px] mb-[20px] w-screen md:w-auto text-center">Rekomendowane oferty</p>
        <div className="flex md:flex-row flex-col">
          {Props.map((i, index) => (
            <PropertyCard key={index} property={i} />
          ))}
        </div>
        <div className="w-full flex">
          <Link
            href="/hiszpania?page=1"
            className="md:w-[200px] w-[170px] border-2 rounded-xl border-gray-900 text-[25px] text-center mx-auto mt-[40px] cursor-pointer"
          >
            Więcej ofert
          </Link>
        </div>
      </div>
    </>
  );
}
