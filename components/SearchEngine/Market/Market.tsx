import React, { useState, useEffect } from "react";
import DataCountry from "../../../data/DataCountry.json";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataMarket: any;
  setDataMarket: any;
};

export default function Types({ setQueries, queries, dataMarket, setDataMarket }: Query) {
  const router = useRouter();

  const { rynek } = router.query;

  const marketTypes = [
    { query: "wtorny", name: "Wtórny" },
    { query: "pierwotny", name: "Pierwotny" },
  ];

  const [marketTemp, setMarketTemp] = useState<any>(undefined);

  const RegionFormated = () => {
    const data = marketTypes.find((i) => {
      if (marketTemp !== undefined && i.query === marketTemp) {
        return true;
      }

      if (marketTemp === undefined && i.query === rynek) {
        setMarketTemp(i.query);
        return true;
      }
    });
  };

  const setNewMarket = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    setMarketTemp(dataName);
    if (e.target.value === "All") {
      const { rynek, ...rest } = queries;
      setQueries(rest);
      setDataMarket("All");
    } else {
      setDataMarket(e.target.value);
      setQueries({
        ...queries,
        rynek: e.target.value
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

  useEffect(() => {
    RegionFormated();
    console.log("fired!");
  }, [marketTemp]);

  const MarketSearchInput = (
    <div>
      <select
        value={marketTemp}
        onChange={(e) => setNewMarket(e)}
        className="md:w-[180px] w-[90vw] h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
      >
        <option value="All" data-name="pierwotny i wtorny">
          Pierwotny i wtórny
        </option>
        <option value="pierwotny" data-name="pierwotny">
          Pierwotny
        </option>
        <option value="wtorny" data-name="wtorny">
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
