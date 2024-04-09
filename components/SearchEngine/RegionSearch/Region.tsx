import React, { useState } from "react";
import { useRouter } from "next/router";
import data from "../../../data/DataCountry.json";

type Query = {
  queries: any;
  setQueries: any;
  dataRegion: any;
  setDataRegion: any;
};

export default function Regions({ setQueries, queries, dataRegion, setDataRegion }: Query) {
  const router = useRouter();

  const { country, region } = router.query;

  const setNewRegion = (e: any) => {
    setDataRegion(e.target.value);
    setQueries({ ...queries, region: e.target.value });
  };

  // const RegionSearchInput = (
  //   <div className="">
  //     <select
  //       value={region || value}
  //       onChange={(e) => setNewRegion(e)}
  //       className="md:w-[180px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px]"
  //     >
  //       <option value="All">Wszystkie</option>
  //       {data.map((c) => {
  //         if (c.country === country) {
  //           // console.log(c.region);
  //           return c.region.map((r) => (
  //             <option key={r} value={r}>
  //               {r}
  //             </option>
  //           ));
  //         }
  //       })}
  //     </select>
  //   </div>
  // );

  return (
    <div className=" border-gray-900/[0.4] relative min-h-[25px] lg:m-auto lg:mx-[4px] rounded-[7px] w-[90vw] md:w-auto mx-auto m-[4px] ">
      <p className="text-[12px] ml-[5px]">Regiony</p>
      {
        <div className="">
          <select
            value={region || dataRegion}
            onChange={(e) => setNewRegion(e)}
            className="md:w-[180px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px]"
          >
            <option value="All">Wszystkie</option>
            {data.map((c) => {
              if (c.country === country) {
                // console.log(c.region);
                return c.region.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ));
              }
            })}
          </select>
        </div>
      }
    </div>
  );
}
