import { useState, useContext, useRef } from "react";
import { useRouter } from "next/router";

export default function Bathrooms({}) {
  const router = useRouter();

  const setNewBathFrom = (e) => {
    router.query.bathmin = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const setNewBathTo = (e) => {
    router.query.bathmax = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const bathsFrom = (
    <div>
      <select
        onChange={setNewBathFrom}
        className="md:w-[60px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px] "
      >
        <option value="all">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );

  const bathsTo = (
    <div>
      <select
        onChange={setNewBathTo}
        className="md:w-[60px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px] "
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
        <div className="lg:w-auto w-full h-auto flex flex-col  justify-center">
          <p className="mx-[5px] text-[12px]">Liczba łazienek</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bathsFrom}
            <div className="w-[5px] h-[1px] bg-yellow-500"></div>
            {bathsTo}
          </div>
        </div>
      </div>
    </>
  );
}
