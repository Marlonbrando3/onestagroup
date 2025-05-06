import React, { useState } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataBedsmin: any;
  setDataBedsmin: any;
  dataBedsmax: any;
  setDataBedsmax: any;
};

export default function Bedrooms({
  setQueries,
  queries,
  dataBedsmin,
  setDataBedsmin,
  dataBedsmax,
  setDataBedsmax,
}: Query) {
  const router = useRouter();

  const { bedsmin, bedsmax } = router.query;

  const setNewBedsFrom = (e: any) => {
    setDataBedsmin(e.target.value);
    setQueries({ ...queries, bedsmin: e.target.value });
  };

  const setNewBedsTo = (e: any) => {
    setDataBedsmax(e.target.value);
    setQueries({ ...queries, bedsmax: e.target.value });
  };

  const bedsFrom = (
    <div className="w-[47%]">
      <select
        value={bedsmin || dataBedsmin}
        onChange={setNewBedsFrom}
        className="md:w-[60px] h-[35px] w-full rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[8px] text-[15px]"
      >
        <option value="All">od</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );

  const bedsTo = (
    <div className="w-[47%]">
      <select
        value={bedsmax || dataBedsmax}
        onChange={setNewBedsTo}
        className="md:w-[60px] h-[35px] w-full rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[8px] text-[15px]"
      >
        <option value="All">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  );

  // let SummaryBeds = [];

  //hide apply button after click and change value 'from' and 'to' in searchConditions

  return (
    <>
      <div className="relative min-h-[25px] border-gray-900/[0.4] rounded-[7px] lg:m-auto lg:mx-[4px] pb-[1px] lg:w-auto w-[90vw] mx-auto ">
        <div className="lg:w-auto w-full h-auto flex flex-col justify-center">
          <p className="mx-[5px] text-[12px]">Liczba sypialni</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bedsFrom}
            <div className="lg:w-[5px] w-[6%] h-[1px] bg-yellow-500"></div>
            {bedsTo}
          </div>
        </div>
      </div>
    </>
  );
}
