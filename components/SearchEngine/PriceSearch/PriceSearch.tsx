import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataPricemin: any;
  setDataPricemin: any;
  dataPricemax: any;
  setDataPricemax: any;
};

export default function PriceSearch({
  setQueries,
  queries,
  dataPricemin,
  setDataPricemin,
  dataPricemax,
  setDataPricemax,
}: Query) {
  const router = useRouter();

  const [priceMinTemp, setPriceMinTemp] = useState<any>(undefined);
  const [priceMaxTemp, setPriceMaxTemp] = useState<any>(undefined);

  const prevMinRef = useRef<number | undefined>(priceMinTemp);
  const prevMaxRef = useRef<number | undefined>(priceMaxTemp);

  const { cena_od, cena_do } = router.query;

  const PriceMaxFormated = () => {
    if (priceMaxTemp !== undefined && cena_do === priceMaxTemp) {
      return true;
    }

    if (priceMaxTemp === undefined && cena_do !== undefined) {
      setPriceMaxTemp(cena_do);
      return true; // i tak zatrzymuje find
    }
  };

  const PriceMinFormated = () => {
    if (priceMinTemp !== undefined && cena_od === priceMinTemp) {
      return true;
    }

    if (priceMinTemp === undefined && cena_od !== undefined) {
      setPriceMinTemp(cena_od);
      return true; // i tak zatrzymuje find
    }
  };

  const setNewPriceFrom = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setPriceMinTemp(dataName);
    if (e.target.value === "All") {
      const { cena_od, ...rest } = queries;
      setQueries(rest);
      setDataPricemin("All");
    } else {
      setDataPricemin(e.target.value);
      setQueries({
        ...queries,
        cena_od: e.target.value,
      });
    }
  };

  const setNewPriceTo = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setPriceMaxTemp(dataName);
    if (e.target.value === "All") {
      const { cena_do, ...rest } = queries;
      setQueries(rest);
      setDataPricemax("All");
    } else {
      setDataPricemax(e.target.value);
      setQueries({
        ...queries,
        cena_do: e.target.value,
      });
    }
  };

  useEffect(() => {
    if (priceMinTemp !== prevMinRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana min");
      PriceMinFormated();
      prevMinRef.current = priceMinTemp;
    } else if (priceMaxTemp !== prevMaxRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana max");
      PriceMaxFormated();
      prevMaxRef.current = priceMaxTemp;
    } else {
      console.log("działa wszytko");
      PriceMinFormated();
      PriceMaxFormated();
    }

    console.log("fired!");
  }, [priceMinTemp, priceMaxTemp]);

  const PriceSearchFrom = (
    <div className="w-[47%] lg:w-auto">
      <select
        value={priceMinTemp}
        onChange={setNewPriceFrom}
        className="md:w-[170px] w-full h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
      >
        <option value="All" data-name="od najniższej">
          od najniższej
        </option>
        <option value="100000" data-name="100000">
          od 100 000 €
        </option>
        <option value="150000" data-name="150000">
          od 150 000 €
        </option>
        <option value="200000" data-name="200000">
          od 200 000 €
        </option>
        <option value="250000" data-name="250000">
          od 250 000 €
        </option>
        <option value="300000" data-name="300000">
          od 300 000 €
        </option>
        <option value="400000" data-name="400000">
          od 400 000 €
        </option>
        <option value="500000" data-name="500000">
          od 500 000 €
        </option>
      </select>
    </div>
  );

  const PriceSearchTo = (
    <div className="w-[47%] lg:w-auto">
      <select
        value={priceMaxTemp}
        onChange={setNewPriceTo}
        className="md:w-[170px] w-full h-[35px] rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[5px] text-[15px]"
      >
        <option value="All">do najwyższej</option>
        <option value="200000" data-name="200000">
          do 200 000 €{" "}
        </option>
        <option value="250000" data-name="200000">
          do 250 000 €
        </option>
        <option value="300000" data-name="300000">
          do 300 000 €
        </option>
        <option value="350000" data-name="350000">
          do 350 000 €
        </option>
        <option value="400000" data-name="400000">
          do 400 000 €
        </option>
        <option value="450000" data-name="450000">
          do 450 000 €
        </option>
        <option value="500000 i więcej" data-name="500000">
          do 500 000 € i więcej
        </option>
      </select>
    </div>
  );

  return (
    <>
      <div className=" border-gray-900/[0.4] min-h-[25px]  pb-[1px] lg:w-auto w-[90vw] rounded-[7px]">
        <div className="duration-150 lg:w-auto w-full flex flex-col justify-center mx-auto">
          <p className="mx-[5px] text-[12px]">Cena(euro)</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {PriceSearchFrom}
            <div className="lg:w-[10px] w-[6%] h-[1px] bg-yellow-500"></div>
            {PriceSearchTo}
          </div>
        </div>
      </div>
    </>
  );
}
