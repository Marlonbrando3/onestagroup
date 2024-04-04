import React, { useState, useRef, useContext } from "react";
import data from "../../../data/DataTypes.json";
import TranslatedData from "../../../data/TranslatedData.json";
import { useRouter } from "next/router";

export default function Types() {
  const router = useRouter();

  const setNewType = (e:any) => {
    router.query.type = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const TypesSearchInput = (
    <div>
      <select
        onChange={(e) => setNewType(e)}
        className="md:w-[240px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px]"
      >
        <option value="All">Wszystkie</option>
        <option value="apartment">Apartament w Bungalowie</option>
        <option value="apartment">Apartament w bloku</option>
        <option value="house">Dom/Willa</option>
      </select>
    </div>
  );

  return (
    <div className=" border-gray-900/[0.4]  min-h-[25px] relative rounded-[7px] lg:m-auto lg:mx-[4px] lg:w-auto w-[90vw] mx-auto ">
      <p className="text-[12px] ml-[5px]">Typy Nieruchomości</p>
      {TypesSearchInput}
    </div>
  );
}
