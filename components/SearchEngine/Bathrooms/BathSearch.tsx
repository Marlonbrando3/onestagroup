import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataBathsmin: any;
  setDataBathsmin: any;
  dataBathsmax: any;
  setDataBathsmax: any;
};

export default function Bathrooms({
  setQueries,
  queries,
  dataBathsmin,
  setDataBathsmin,
  dataBathsmax,
  setDataBathsmax,
}: Query) {
  const router = useRouter();

  const [bathMinTemp, setBathMinTemp] = useState<any>(undefined);
  const [bathMaxTemp, setBathMaxTemp] = useState<any>(undefined);

  const prevMinRef = useRef<number | undefined>(bathMinTemp);
  const prevMaxRef = useRef<number | undefined>(bathMaxTemp);

  const { lazienek_od, lazienek_do } = router.query;

  const BathMaxFormated = () => {
    if (bathMaxTemp !== undefined && lazienek_do === bathMaxTemp) {
      return true;
    }

    if (bathMaxTemp === undefined && lazienek_do !== undefined) {
      setBathMaxTemp(lazienek_do);
      return true; // i tak zatrzymuje find
    }
  };

  const BathMinFormated = () => {
    if (bathMinTemp !== undefined && lazienek_od === bathMinTemp) {
      return true;
    }

    if (bathMinTemp === undefined && lazienek_od !== undefined) {
      setBathMinTemp(lazienek_od);
      return true; // i tak zatrzymuje find
    }
  };

  const setNewBathFrom = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setBathMinTemp(dataName);
    if (e.target.value === "All") {
      const { lazienek_od, ...rest } = queries;
      setQueries(rest);
      setDataBathsmin("All");
    } else {
      setDataBathsmin(e.target.value);
      setQueries({
        ...queries,
        lazienek_od: e.target.value,
      });
    }
  };

  const setNewBathTo = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setBathMaxTemp(dataName);
    if (e.target.value === "All") {
      const { lazienek_do, ...rest } = queries;
      setQueries(rest);
      setDataBathsmax("All");
    } else {
      setDataBathsmax(e.target.value);
      setQueries({
        ...queries,
        lazienek_do: e.target.value,
      });
    }
  };

  const bathsFrom = (
    <div className="w-[47%]">
      <select
        value={bathMinTemp}
        onChange={(e) => setNewBathFrom(e)}
        className="md:w-[60px] h-[35px] w-full rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[8px] text-[15px]"
      >
        <option value="All" data-name="od">
          od
        </option>
        <option value="1" data-name="1">
          1
        </option>
        <option value="2" data-name="2">
          2
        </option>
        <option value="3" data-name="3">
          3
        </option>
      </select>
    </div>
  );

  const bathsTo = (
    <div className="w-[47%]">
      <select
        value={bathMaxTemp}
        onChange={(e) => setNewBathTo(e)}
        className="md:w-[60px] h-[35px] w-full rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[8px] text-[15px]"
      >
        <option value="All" data-name="do">
          do
        </option>
        <option value="1" data-name="1">
          1
        </option>
        <option value="2" data-name="2">
          2
        </option>
        <option value="3" data-name="3">
          3
        </option>
        <option value="4" data-name="4">
          4
        </option>
        <option value="5" data-name="5">
          5
        </option>
      </select>
    </div>
  );

  useEffect(() => {
    if (bathMinTemp !== prevMinRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana min");
      BathMinFormated();
      prevMinRef.current = bathMinTemp;
    } else if (bathMaxTemp !== prevMaxRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana max");
      BathMaxFormated();
      prevMaxRef.current = bathMaxTemp;
    } else {
      BathMinFormated();
      BathMaxFormated();
    }

    console.log("fired!");
  }, [bathMinTemp, bathMaxTemp]);

  return (
    <>
      <div className="relative flex items-center min-h-[25px] justify-center border-gray-900/[0.4] rounded-[7px] m-[4px] lg:m-auto lg:mx-[4px] lg:w-auto w-[90vw] mx-auto ">
        <div className="lg:w-auto w-full h-auto flex flex-col justify-center">
          <p className="mx-[5px] text-[12px]">Liczba łazienek</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bathsFrom}
            <div className="lg:w-[5px] w-[6%] h-[1px] bg-yellow-500"></div>
            {bathsTo}
          </div>
        </div>
      </div>
    </>
  );
}
