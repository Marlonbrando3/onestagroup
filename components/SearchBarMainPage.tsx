import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import DataCountry from "../data/DataCountry.json";

export default function SearchButton() {
  const router = useRouter();
  const advancedSearch = useRef<any>();

  const country = useRef<any>();

  const [showedadvancedSearch, setshowedadvancedSearch] = useState(false);

  const [countryChoosed, setCountryChoosed] = useState("hiszpania");

  const [conditions, setconditions] = useState([
    { name: "firstmarket", value: false },
    { name: "secondmarket", value: false },
    { name: "apartment", value: false },
    { name: "house", value: false },
    { name: "bathf", value: null },
    { name: "batht", value: null },
    { name: "bedsfrom", value: null },
    { name: "bedsto", value: null },
    { name: "pf", value: null },
    { name: "pt", value: null },
  ]);

  const regions = DataCountry.map((r) => {
    if (r.country === countryChoosed) {
      return r.region.map((i) => (
        <option key={i} className="bg-white">
          {i}
        </option>
      ));
    }
  });

  const handleQueryData = (e: any) => {
    let paramsName = e.target.name;
    // console.log(paramsBolean)
    let paramsValues = e.target.value;
    console.log(paramsValues);

    if (
      paramsValues === "hiszpania" ||
      paramsValues === "portugalia" ||
      paramsValues === "chorwacja" ||
      paramsValues === "dominikana" ||
      paramsValues === "włochy"
    ) {
      setCountryChoosed(paramsValues);
    }

    setconditions(
      conditions.map((i) => {
        console.log();
        if (i.name === paramsName && (i.value === false || i.value === true)) {
          console.log(i.name);
          return {
            name: i.name,
            value: !i.value,
          };
        }
        if (i.name === paramsName && i.value !== false && i.value !== true) {
          return {
            name: i.name,
            value: paramsValues,
          };
        } else return i;
      }),
    );
  };

  const data = conditions.filter((e) => {
    if (e.value === false) return false;
    if (e.value === null) return false;
    else return true;
  });

  const querybeta = data.map((i) => {
    console.log();
    if (i.value === false || i.value === true) {
      console.log(i.name);
      return {
        [i.name]: i.value,
      };
    }
    if (i.value !== false && i.value !== true) {
      return {
        [i.name]: i.value,
      };
    } else return i;
  });

  const query = querybeta.reduce(function (result: any, currentObject: any) {
    for (var key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key];
      }
    }
    return result;
  }, {});

  console.log(query);

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push({
      pathname: `/${countryChoosed}`,
      query: query,
    });
  };

  return (
    <>
      <div className="right-0 left-0 mx-auto absolute w-[90vw] lg:w-[950px] lg:top-[410px] top-[22%] flex lg:right-0 lg:left-0 p-6 rounded-[15px] bg-white shadow-xl border-2 border-[#fffbf7] items-center flex-col md:flex-row justify-center">
        <div
          ref={advancedSearch}
          className="z-10 absolute w-[98%] left-0 right-0 mx-auto -top-[25px] h-[23px] flex flex-col duration-150 items-end overflow-hidden"
        >
          <div
            // onClick={handleAdvanceSearch}
            className=" text-white duration-200 mr-10 bg-orange-500 right-10 text-md px-4 rounded-t-md font-[400] cursor-pointer hover:bg-white hover:text-slate-900 text-center border-t"
          >
            {showedadvancedSearch ? <p>Zwiń</p> : <p>Zaawansowane (wkrótce)</p>}{" "}
          </div>
          <div className="text-black bg-white right-10 w-full lg:h-[230px] h-[380px] text-md px-4 rounded-t-md font-[400] flex-wrap lg:flex-row cursor-pointer flex lg:items-center items-start justify-center pt-4">
            <div className="lg:w-1/4 w-1/2 lg:h-full h-1/3">
              <p className="mt-2 font-[600] mb-3">Rynek</p>
              <div>
                <div className="flex items-center mb-2">
                  <input
                    onChange={handleQueryData}
                    name="firstmarket"
                    id="first"
                    type="checkbox"
                    className="mr-2 w-[20px] h-[20px]"
                  ></input>
                  <label data-for="first">Pierwotny</label>
                </div>
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="secondmarket"
                    id="second"
                    type="checkbox"
                    className="mr-2 w-[20px] h-[20px]"
                  ></input>
                  <label data-for="second">Wtórny</label>
                </div>
              </div>
            </div>
            <div className=" lg:w-1/4 w-1/2 lg:h-full h-1/3">
              <p className="mt-2 font-[600] mb-3">Typ nieruchomości</p>
              <div>
                <div className="flex items-center mb-2">
                  <input
                    onChange={handleQueryData}
                    name="apartment"
                    id="apartment"
                    type="checkbox"
                    className="mr-2 w-[20px] h-[20px]"
                  ></input>
                  <label data-for="apartment">Apartament</label>
                </div>
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="house"
                    id="house"
                    type="checkbox"
                    className="mr-2 w-[20px] h-[20px]"
                  ></input>
                  <label data-for="house">Dom</label>
                </div>
              </div>
            </div>
            <div className=" lg:w-1/4 w-1/2 lg:h-full h-1/2">
              <p className="mt-2 font-[600] mb-3">Łazienek</p>
              <div className="flex justify-start">
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="bathf"
                    id="apartment"
                    type="number"
                    className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="od"
                  ></input>
                </div>
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="batht"
                    id="house"
                    type="number"
                    className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="do"
                  ></input>
                </div>
              </div>
              <p className="mt-2 font-[600] mb-3">Sypialni</p>
              <div className="flex justify-start items-center">
                <div className="flex lg:items-center">
                  <input
                    onChange={handleQueryData}
                    id="apartment"
                    type="number"
                    className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="od"
                  ></input>
                </div>
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    id="house"
                    type="number"
                    className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="do"
                  ></input>
                </div>
              </div>
            </div>
            <div className=" lg:w-1/4 w-1/2 lg:h-full h-1/2">
              <p className="mt-2 font-[600] mb-3">Cena Euro</p>
              <div className="flex flex-col lg:justify-center justify-start ">
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="pf"
                    id="apartment"
                    type="number"
                    className=" pl-2 mr-2 w-[150px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="od"
                  ></input>
                </div>
                <div className="flex items-center">
                  <input
                    onChange={handleQueryData}
                    name="pt"
                    id="house"
                    type="number"
                    className="mt-4 pl-2 mr-2 w-[150px] h-[30px] border border-gray-700 rounded-sm"
                    placeholder="do"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-slate-800 lg:text-[26px] text-2xl lg:leading-8 md:w-[400px] mb-[40px] md:mb-0">
          Znajdź swój
          <span className="font-bold text-orange-400"> nowy dom </span> lub{" "}
          <span className="font-bold  text-orange-400"> wyjątkową inwestycję </span>
          <br></br>w ciepłych krajach
        </p>
        <form
          onSubmit={handleSearch}
          className="flex md:w-[600px] w-full flex-wrap justify-between items-center text-[14px] h-full"
        >
          <div className="flex flex-col w-1/2 lg:w-auto">
            <label data-for="country" className=" text-slate-800">
              Kraj
            </label>
            <select
              name="country"
              onChange={handleQueryData}
              ref={country}
              className="lg:w-[170px] w-[90%] h-[30px] bg-white rounded-2xl text-[14px] font-[500] pl-2 border-[1px] border-yellow-500"
            >
              <option value="hiszpania">Hiszpania</option>
              <option value="portugalia">Portugalia</option>
              <option value="chorwacja">Chorwacja</option>
              <option value="dominikana">Dominikana</option>
              <option value="włochy">Włochy</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2 lg:w-auto">
            <label data-for="regions" className=" text-slate-800">
              Region
            </label>
            <select
              name="regions"
              className="lg:w-[170px] h-[30px] bg-white rounded-2xl  text-[14px]  font-[500] pl-2 border-[1px] border-yellow-500"
            >
              <option className="bg-white">{`Wszystkie regiony`}</option>
              {regions}
            </select>
          </div>
          <div className="flex flex-col w-full lg:w-auto">
            <label data-for="country" className=" text-slate-800 w-full">
              Typ nieruchomości
            </label>
            <select className="lg:w-[170px] w-full h-[30px] bg-white rounded-2xl  text-[14px]  font-[500] pl-2 border-[1px] border-yellow-500">
              <option>Wszystkie typy</option>
              <option>Apartament</option>
              <option>Dom</option>
            </select>
          </div>
          <div className="flex flex-col mt-2 lg:w-auto w-full">
            <label data-for="country" className=" text-slate-800">
              Zakres cenowy (€ netto)
            </label>
            <div className="flex lg:w-[355px] justify-between items-center w-full">
              <select className="lg:w-[170px] w-[90%] h-[30px] bg-white rounded-2xl  text-[14px]  font-[500] pl-2 border-[1px] border-yellow-500">
                <option value="all-prices">od najniższej</option>
                <option value="200000">od 180 000 €</option>
                <option value="250000">od 250 000 €</option>
                <option value="300000">od 300 000 €</option>
                <option value="500000">od 500 000 €</option>
              </select>
              <div className="bg-yellow-500 h-[2px] md:w-[10px] w-[35px]"></div>
              <select className="lg:w-[170px] w-[90%]  h-[30px] bg-white rounded-2xl  text-[14px]  font-[500] pl-2 border-[1px] border-yellow-500">
                <option value="all-prices">do najwyższej</option>
                <option value="300000">do 300 000 €</option>
                <option value="350000">od 350 000 €</option>
                <option value="400000">od 400 000 €</option>
                <option value="450000">od 500 000 €</option>
                <option value="500000 i więcej">do 500 000 € i więcej</option>
              </select>
            </div>
          </div>
          <button className="lg:w-[170px] w-[190px] h-[30px] bg-yellow-500 text-white mt-7 rounded-2xl  text-[18px]  font-[500] mx-auto text-center">
            Szukaj
          </button>
        </form>
      </div>
    </>
  );
}
