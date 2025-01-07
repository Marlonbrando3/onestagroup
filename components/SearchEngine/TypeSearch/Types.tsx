import React, { useEffect, useState } from "react";
import data from "../../../data/DataTypes.json";
import TranslatedData from "../../../data/TranslatedData.json";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataType: any;
  setDataType: any;
};

export default function Types({ setQueries, queries, dataType, setDataType }: Query) {
  const router = useRouter();

  const { type } = router.query;

  const setNewType = (e: any) => {
    setDataType(e.target.value);
    setQueries({ ...queries, type: e.target.value });
  };

  const TypesSearchInput = (
    <div>
      <select
        value={dataType || type}
        onChange={(e) => setNewType(e)}
        className="md:w-[240px] w-[90vw] h-[35px] rounded-md outline-none border-yellow-500 border-[0.8px] cursor-pointer pl-[3px] text-[15px]"
      >
        <option value="All">Wszystkie</option>
        <option value="ApartmentSale">Apartament w Bungalowie</option>
        <option value="ApartmentSale">Apartament w bloku</option>
        <option value="HouseSale">Dom/Willa</option>
      </select>
    </div>
  );

  return (
    <div className=" border-gray-900/[0.4] min-h-[25px] relative rounded-[7px] lg:m-auto lg:mx-[4px] lg:w-auto w-[90vw] mx-auto ">
      <p className="text-[12px] ml-[5px]">Typy Nieruchomości</p>
      {TypesSearchInput}
    </div>
  );
}
