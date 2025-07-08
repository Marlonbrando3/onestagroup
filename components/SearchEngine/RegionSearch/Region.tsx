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
    // setQueries({ ...queries, region: e.target.value });
  };

  return (
    <div className=" border-gray-900/[0.4] relative min-h-[25px] lg:m-auto lg:mx-[4px] rounded-[7px] w-[90vw] md:w-auto mx-auto m-[4px]">
      <p className="text-[12px] ml-[5px]">Regiony</p>
      {
        <div className="">
          <select
            value={dataRegion || region}
            onChange={(e) => setNewRegion(e)}
            className="md:w-[180px] w-[90vw] bg-transparent outline-none shadow-none rounded-[3px] h-[35px] border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
          >
            <option value="wszystkie-regiony">Wszystkie</option>
            {data.map((c) => {
              if (c.country === country) {
                // console.log(c.region);
                return c.region.map((r, i) => (
                  <option key={r} value={c.showed[i]}>
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
