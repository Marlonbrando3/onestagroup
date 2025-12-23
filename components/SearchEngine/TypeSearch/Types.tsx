import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataType: any;
  setDataType: any;
};

export default function Types({ setQueries, queries, dataType, setDataType }: Query) {
  const router = useRouter();

  const { zabudowa } = router.query;

  const TypeTypes = [
    { query: "apartmentSale", name: "Apartament" },
    { query: "houseSale", name: "Dom/Willa" },
  ];

  const [typeTemp, setTypeTemp] = useState<any>(undefined);

  const TypeFormated = () => {
    const reg = TypeTypes.find((i) => {
      if (typeTemp !== undefined && i.query === typeTemp) {
        return true;
      }

      if (typeTemp === undefined && zabudowa === i.query.toLowerCase()) {
        console.log(i.query);
        setTypeTemp(i.query);
        return true; // i tak zatrzymuje find
      }
    });
  };

  const setNewType = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setTypeTemp(dataName);
    if (e.target.value === "All") {
      const { zabudowa, ...rest } = queries;
      setQueries(rest);
      setDataType("All");
    } else {
      setDataType(e.target.value);
      setQueries({
        ...queries,
        zabudowa: e.target.value
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
    TypeFormated();
    console.log("fired!");
  }, [typeTemp]);

  const TypesSearchInput = (
    <div>
      <select
        value={typeTemp}
        onChange={(e) => setNewType(e)}
        className="md:w-[240px] w-[90vw] h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
      >
        <option value="All" data-name="wszystkie">
          Wszystkie
        </option>
        <option value="apartmentSale" data-name="apartmentSale">
          Apartament
        </option>
        <option value="houseSale" data-name="houseSale">
          Dom/Willa
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
