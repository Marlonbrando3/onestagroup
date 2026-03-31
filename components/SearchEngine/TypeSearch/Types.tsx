import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataType: any;
  setDataType: any;
};

export default function Types({
  setQueries,
  queries,
  dataType,
  setDataType,
}: Query) {
  const router = useRouter();

  const { zabudowa } = router.query;

  const TypeTypes = [
    { query: "apartmentSale", name: "Apartament" },
    { query: "houseSale", name: "Dom/Willa" },
  ];

  const [typeTemp, setTypeTemp] = useState<any>(undefined);

  const setNewType = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");

    setTypeTemp(dataName);
    if (e.target.value === "All") {
      const { zabudowa, ...rest } = queries;
      setQueries(rest);
      setDataType("All");
    } else {
      setDataType(e.target.value);
      setQueries({
        ...queries,
        zabudowa: e.target.value,
      });
    }
  };

  const TypesSearchInput = (
    <div>
      <select
        value={typeTemp}
        onChange={(e) => setNewType(e)}
        className="lg:w-[240px] w-[90vw] h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[10px] md:text-[17px] text-[15px]"
      >
        <option value="All" data-name="wszystkie">
          Wszystkie
        </option>
        <option value="apartment" data-name="apartment">
          Apartament
        </option>
        <option value="villa" data-name="villa">
          Dom/Willa
        </option>
        <option value="bungalow" data-name="bungalow">
          Bungalow
        </option>
        <option value="townhouse" data-name="townhouse">
          Szeregówka
        </option>
      </select>
    </div>
  );

  return (
    <div className=" border-gray-900/[0.4] min-h-[25px] relative rounded-[7px] lg:m-auto lg:mx-[4px] lg:w-auto w-[90vw] mx-auto ">
      <p className="text-[12px] ml-[5px]">Typy Nieruchomości</p>
      {TypesSearchInput}
    </div>
  );
}
