import React from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataBathsmin: any;
  setDataBathsmin: any;
  dataBathsmax: any;
  setDataBathsmax: any;
};

export default function Bathrooms({
  setQueries,
  queries,
  dataBathsmin,
  setDataBathsmin,
  dataBathsmax,
  setDataBathsmax,
}: Query) {
  const router = useRouter();

  const { bathsmin, bathsmax } = router.query;

  const setNewBathFrom = (e: any) => {
    setDataBathsmin(e.target.value);
    setQueries({ ...queries, bathsmin: e.target.value });
  };

  const setNewBathTo = (e: any) => {
    // if (queries.bathmin <= e.target.value) {
    setDataBathsmax(e.target.value);
    setQueries({ ...queries, bathsmax: e.target.value });
    // }
  };

  const bathsFrom = (
    <div className="w-[47%]">
      <select
        value={bathsmin || dataBathsmin}
        onChange={setNewBathFrom}
        className="md:w-[60px] h-[35px] w-full rounded-md outline-none border-yellow-500 border-[0.8px] cursor-pointer pl-[3px] text-[15px]"
      >
        <option value="all">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );

  const bathsTo = (
    <div className="w-[47%]">
      <select
        value={bathsmax || dataBathsmax}
        onChange={setNewBathTo}
        className="md:w-[60px] h-[35px] w-full rounded-md outline-none border-yellow-500 border-[0.8px] cursor-pointer pl-[3px] text-[15px]"
      >
        <option value="all">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  );

  return (
    <>
      <div className="relative flex items-center min-h-[25px] justify-center border-gray-900/[0.4] rounded-[7px] m-[4px] lg:m-auto lg:mx-[4px] lg:w-auto w-[90vw] mx-auto ">
        <div className="lg:w-auto w-full h-auto flex flex-col justify-center">
          <p className="mx-[5px] text-[12px]">Liczba łazienek</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bathsFrom}
            <div className="lg:w-[5px] w-[6%] h-[1px] bg-yellow-500"></div>
            {bathsTo}
          </div>
        </div>
      </div>
    </>
  );
}
