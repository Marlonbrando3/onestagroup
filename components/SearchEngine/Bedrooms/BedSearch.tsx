import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

type Query = {
  queries: any;
  setQueries: any;
  dataBedsmin: any;
  setDataBedsmin: any;
  dataBedsmax: any;
  setDataBedsmax: any;
};

export default function Bedrooms({
  setQueries,
  queries,
  dataBedsmin,
  setDataBedsmin,
  dataBedsmax,
  setDataBedsmax,
}: Query) {
  const router = useRouter();

  const [bedsMinTemp, setBedsMinTemp] = useState<any>(undefined);
  const [bedsMaxTemp, setBedsMaxTemp] = useState<any>(undefined);

  const prevMinRef = useRef<number | undefined>(bedsMinTemp);
  const prevMaxRef = useRef<number | undefined>(bedsMaxTemp);

  const { sypialni_od, sypialni_do } = router.query;

  const BedsMaxFormated = () => {
    if (bedsMaxTemp !== undefined && sypialni_do === bedsMaxTemp) {
      return true;
    }

    if (bedsMaxTemp === undefined && sypialni_do !== undefined) {
      setBedsMaxTemp(sypialni_do);
      return true; // i tak zatrzymuje find
    }
  };

  const BedsMinFormated = () => {
    if (bedsMinTemp !== undefined && sypialni_od === bedsMinTemp) {
      return true;
    }

    if (bedsMinTemp === undefined && sypialni_od !== undefined) {
      setBedsMinTemp(sypialni_od);
      return true; // i tak zatrzymuje find
    }
  };

  const setNewBedsFrom = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setBedsMinTemp(dataName);
    if (e.target.value === "All") {
      const { sypialni_od, ...rest } = queries;
      setQueries(rest);
      setDataBedsmin("All");
    } else {
      setDataBedsmin(e.target.value);
      setQueries({
        ...queries,
        sypialni_od: e.target.value,
      });
    }
  };

  const setNewBedsTo = (e: any) => {
    const dataName = e.target.selectedOptions[0].getAttribute("data-name");
    console.log(dataName);
    setBedsMaxTemp(dataName);
    if (e.target.value === "All") {
      const { sypialni_do, ...rest } = queries;
      setQueries(rest);
      setDataBedsmax("All");
    } else {
      setDataBedsmax(e.target.value);
      setQueries({
        ...queries,
        sypialni_do: e.target.value,
      });
    }
  };
  const bedsFrom = (
    <div className="w-[47%]">
      <select
        value={bedsMinTemp}
        onChange={(e) => setNewBedsFrom(e)}
        className="md:w-[60px] h-[35px] w-full rounded-[3px] outline-none border-orange-500 border-[0.8px] cursor-pointer pl-[8px] text-[15px]"
      >
        <option value="All" data-name="od">
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

  const bedsTo = (
    <div className="w-[47%]">
      <select
        value={bedsMaxTemp}
        onChange={(e) => setNewBedsTo(e)}
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
    if (bedsMinTemp !== prevMinRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana min");
      BedsMinFormated();
      prevMinRef.current = bedsMinTemp;
    } else if (bedsMaxTemp !== prevMaxRef.current) {
      // roomsMin się zmienił
      console.log("Zmiana max");
      BedsMaxFormated();
      prevMaxRef.current = bedsMaxTemp;
    } else {
      console.log("działa wszytko");
      BedsMaxFormated();
      BedsMinFormated();
    }

    console.log("fired!");
  }, [bedsMinTemp, bedsMaxTemp]);

  return (
    <>
      <div className="relative min-h-[25px] border-gray-900/[0.4] rounded-[7px] lg:m-auto lg:mx-[4px] pb-[1px] lg:w-auto w-[90vw] mx-auto ">
        <div className="lg:w-auto w-full h-auto flex flex-col justify-center">
          <p className="mx-[5px] text-[12px]">Liczba sypialni</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bedsFrom}
            <div className="lg:w-[5px] w-[6%] h-[1px] bg-yellow-500"></div>
            {bedsTo}
          </div>
        </div>
      </div>
    </>
  );
}
