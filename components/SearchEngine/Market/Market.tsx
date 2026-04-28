import React, { useState, useEffect } from "react";
import DataCountry from "../../../data/DataCountry.json";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataMarket: any;
  setDataMarket: any;
};

export default function Types({
  setQueries,
  queries,
  dataMarket,
  setDataMarket,
}: Query) {
  const router = useRouter();

  const { rynekpierwotny } = router.query;

  const marketTypes = [
    { query: "wtorny", name: "Wtórny" },
    { query: "pierwotny", name: "Pierwotny" },
  ];

  const [marketTemp, setMarketTemp] = useState<any>(undefined);

  const setNewMarket = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    setMarketTemp(dataName);
    if (e.target.value === "All") {
      const { rynekpierwotny, ...rest } = queries;
      setQueries(rest);
      setDataMarket("All");
    } else {
      setDataMarket(e.target.value);
      setQueries({
        ...queries,
        rynekpierwotny: e.target.value
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/ą/g, "a")
          .replace(/ć/g, "c")
          .replace(/ę/g, "e")
          .replace(/ł/g, "l")
          .replace(/ń/g, "n")
          .replace(/ó/g, "o")
          .replace(/ś/g, "s")
          .replace(/ź/g, "z")
          .replace(/ż/g, "z")
          .replace(/á/g, "a"),
      });
    }
  };

  // useEffect(() => {
  //   RegionFormated();
  // }, [marketTemp]);

  const MarketSearchInput = (
    <div>
      <select
        value={marketTemp}
        onChange={(e) => setNewMarket(e)}
        className="lg:max-w-[200px] w-[90vw] h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[10px] md:text-[17px] text-[15px]"
      >
        <option value="All" data-name="all">
          Pietworny i wtórny
        </option>
        <option value="true" data-name="true">
          Pierwotny
        </option>
        <option value="false" data-name="false">
          Wtórny
        </option>
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
