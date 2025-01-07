import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataPricemin: any;
  setDataPricemin: any;
  dataPricemax: any;
  setDataPricemax: any;
};

export default function PriceSearch({
  setQueries,
  queries,
  dataPricemin,
  setDataPricemin,
  dataPricemax,
  setDataPricemax,
}: Query) {
  const router = useRouter();

  const { pricemin, pricemax } = router.query;

  const pricesInputs = useRef<any>();

  const setNewPriceFrom = (e: any) => {
    setDataPricemin(e.target.value);
    setQueries({ ...queries, pricemin: e.target.value });
  };

  const setNewPriceTo = (e: any) => {
    setDataPricemax(e.target.value);
    setQueries({ ...queries, pricemax: e.target.value });
  };

  const PriceSearchFrom = (
    <div className="w-[47%] lg:w-auto">
      <select
        value={pricemin || dataPricemin}
        onChange={setNewPriceFrom}
        className="md:w-[170px] w-full h-[35px] rounded-md outline-none border-yellow-500 border-[0.8px] cursor-pointer pl-[3px] text-[15px]"
      >
        <option value="All">od najniższej</option>
        <option value="200000">od 200 000 €</option>
        <option value="250000">od 250 000 €</option>
        <option value="300000">od 300 000 €</option>
        <option value="400000">od 400 000 €</option>
        <option value="500000">od 500 000 €</option>
      </select>
    </div>
  );

  const PriceSearchTo = (
    <div className="w-[47%] lg:w-auto">
      <select
        value={pricemax || dataPricemax}
        onChange={setNewPriceTo}
        className="md:w-[170px] w-full h-[35px] rounded-md outline-none border-yellow-500 border-[0.8px] cursor-pointer pl-[3px] text-[15px]"
      >
        <option value="All">do najwyższej</option>
        <option value="300000">do 300 000 €</option>
        <option value="350000">od 350 000 €</option>
        <option value="400000">od 400 000 €</option>
        <option value="500000">od 500 000 €</option>
        <option value="500000 i więcej">do 500 000 € i więcej</option>
      </select>
    </div>
  );

  return (
    <>
      <div className=" border-gray-900/[0.4] min-h-[25px]  pb-[1px] lg:w-auto w-[90vw] rounded-[7px]">
        <div className="duration-150 lg:w-auto w-full flex flex-col justify-center mx-auto">
          <p className="mx-[5px] text-[12px]">Cena(euro)</p>
          <div
            ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {PriceSearchFrom}
            <div className="lg:w-[10px] w-[6%] h-[1px] bg-yellow-500"></div>
            {PriceSearchTo}
          </div>
        </div>
      </div>
    </>
  );
}
