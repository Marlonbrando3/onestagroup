import React, { useState } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataMarket: any;
  setDataMarket: any;
};

export default function Types({ setQueries, queries, dataMarket, setDataMarket }: Query) {
  const router = useRouter();

  const { market } = router.query;

  const setNewMarket = (e: any) => {
    setDataMarket(e.target.value);
    setQueries({ ...queries, market: e.target.value });
  };

  const MarketSearchInput = (
    <div>
      <select
        value={dataMarket || market}
        onChange={setNewMarket}
        className="md:w-[180px] w-[90vw] h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
      >
        <option value="All">Pierwotny i wtórny</option>
        <option value="Primary">Pierwotny</option>
        <option value="Secondary">Wtórny</option>
      </select>
    </div>
  );

  return (
    <div className="border-gray-900/[0.4]  min-h-[25px] relative rounded-[7px] m-[4px] lg:m-auto lg:mx-[4px] lg:w-auto  w-[90vw] mx-auto ">
      <p className="text-[12px] ml-[5px]">Rynki</p>
      {MarketSearchInput}
    </div>
  );
}
