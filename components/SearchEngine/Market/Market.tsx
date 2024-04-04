import React from "react";
import { useRouter } from "next/router";

export default function Types() {
  const router = useRouter();

  const setNewMarket = (e:any) => {
    router.query.market = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const MarketSearchInput = (
    <div>
      <select
        onChange={setNewMarket}
        className="md:w-[180px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px]"
      >
        <option value="">Pierwotny i wtórny</option>
        <option value="first">Pierwotny</option>
        <option value="second">Wtórny</option>
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
