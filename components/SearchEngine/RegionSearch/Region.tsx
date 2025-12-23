import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import DataCountry from "../../../data/DataCountry.json";

type Query = {
  queries: any;
  setQueries: any;
  dataRegion: any;
  setDataRegion: any;
};

export default function Regions({ setQueries, queries, dataRegion, setDataRegion }: Query) {
  const router = useRouter();

  const { country, region } = router.query;
  const [regionTemp, setRegionTemp] = useState<any>(undefined);

  const RegionFormated = () => {
    const data = DataCountry.find((i) => i.country === country);
    const reg = data!.query.find((i) => {
      if (regionTemp !== undefined && i.query === regionTemp) {
        return true;
      }
      if (regionTemp === undefined && region === i.query) {
        console.log(i.querySearch);
        setRegionTemp(i.query);
        return true; // i tak zatrzymuje find
      }
    });
    // console.log(reg?.querySearch);
    return reg?.querySearch;
  };

  const setNewRegion = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    setRegionTemp(dataName);
    // console.log(regionTemp);
    if (e.target.value === "All") {
      const { region, ...rest } = queries;
      setQueries(rest);
      setDataRegion("");
    } else {
      setDataRegion(dataName);
      setQueries({
        ...queries,
        region: dataName
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
  }, [regionTemp]);

  return (
    <div className=" border-gray-900/[0.4] relative min-h-[25px] lg:m-auto lg:mx-[4px] rounded-[7px] w-[90vw] md:w-auto mx-auto m-[4px]">
      <p className="text-[12px] ml-[5px]">Regiony</p>
      {
        <div className="">
          <select
            value={regionTemp}
            onChange={(e) => setNewRegion(e)}
            className="md:w-[180px] w-[90vw] bg-transparent outline-none shadow-none rounded-[3px] h-[35px] border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
          >
            <option value="All">Wszystkie</option>
            {DataCountry.map((c) => {
              if (c.country === country) {
                // console.log(c.region);
                return c.region.map((r, index) => (
                  <option key={r} value={c.query[index].query} data-name={c.query[index].query}>
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
