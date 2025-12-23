import React, { useState, useRef } from "react";
import data from "../../../data/DataCountry.json";
import TranslatedData from "../../../data/TranslatedData.json";
import { MainSearch } from "../../MainSearchInSearchEngine";

export default function Types() {
  const inputRefCity = useRef();
  const ButtonCity = useRef();
  const cityRefs = useRef();
  const citylist = useRef();

  const [cities, setCities] = useState(SearchFilters.city || []);

  const handleHideCity = () => {
    citylist.current.style.height = "0px";
    ButtonCity.current.style.zIndex = "20";
  };

  const handleCityListShow = () => {
    console.log(SearchFilters.region);
    if (region.length > 0) {
      citylist.current.style.height = "300px";
    }
    cityRefs.current.style.rotate = "0deg";
    ButtonCity.current.style.zIndex = "40";
  };

  const handleCheckboxes = (e) => {
    const typeOfProperty = e.target.getAttribute("name");
    const valueOfProperty = e.target.getAttribute("value");

    console.log(typeOfProperty);
    console.log("wchodzi Cities");
    if (cities.toString().includes(valueOfProperty.toString())) {
      setCities([...cities.filter((o) => o !== valueOfProperty)]);

      Object.entries(SearchFilters).forEach(([key, value]) => {
        if (key === "city") {
          const indexOfProperty = value.indexOf(valueOfProperty);
          value.splice(indexOfProperty, 1);
        }
      });
    } else {
      Object.entries(SearchFilters).forEach(([key, value]) => {
        if (key === "city") {
          setCities([...cities, `${valueOfProperty}`]);
          SearchFilters[key] = [...SearchFilters[key], valueOfProperty];
        }
      });
    }
  };

  const ChoosedCities = SearchFilters.city.map((city) => {
    // console.log(cities.length)

    return (
      <div
        key={city}
        name="city"
        value={city}
        className={cities.length < 5 ? "choices-city" : "choices-city-many"}
      >
        <div className="whitespace-nowrap">{city}</div>
        <div
          name="city"
          value={city}
          onClick={(e) => handleCheckboxes(e)}
          className="w-[16px] h-[16px] mx-1 text-white border rounded-[50%] relative flex items-center justify-center border-white "
        >
          <div
            name="city"
            value={city}
            className="absolute border-t border-white w-8/12 h-[1px] rotate-45 m-1"
          ></div>
          <div
            name="city"
            value={city}
            className="absolute border-t border-white w-8/12 h-[1px] -rotate-45 m-1"
          ></div>
        </div>
      </div>
    );
  });

  let AllCitiesInThisRegions = city.map((city) => {
    return (
      <div
        key={city}
        name="city"
        className="flex items-center justify-center duration-150 px-2 w-full h-[30px] hover:bg-red-100/[0.5] cursor-pointer"
      >
        <input
          id={city}
          value={city}
          name="city"
          type="checkbox"
          checked={SearchFilters.city.toString().includes(city) ? true : false}
          onChange={handleCheckboxes}
          className="accent-red-500 w-[20px] h-[30px] cursor-pointer"
        ></input>
        <label
          for={city}
          key={city}
          name="city"
          value={city}
          className=" text-black cursor-pointer text-xl pl-3 w-full flex items-center"
          query={{ city: { city } }}
        >
          {city}
        </label>
      </div>
    );
  });

  return (
    <div className="border border-gray-900/[0.4] relative min-h-[25px] lg:m-auto lg:mx-[4px] rounded-[7px] m-[4px] lg:w-auto w-[90vw] mx-auto  ">
      <p className="text-[12px] ml-[5px]">Miasta</p>
      <input
        readonly="readonly"
        ref={inputRefCity}
        onFocus={handleCityListShow}
        onBlur={handleHideCity}
        className="absolute w-full bg-transparent z-30 outline-none cursor-pointer"
      ></input>
      <div id="city" className=" flex md:w-[450px] min-h-[25px] relative">
        <div
          className={
            cities.length > 0 ? "hidden" : "absolute w-full h-full flex justify-center items-center"
          }
        >
          <p className="text-gray-500 text-[14px]">Wszystkie miasta</p>
        </div>
        <div
          className={
            city.length < 5
              ? " w-full h-full flex items-center justify-center"
              : "w-full h-full flex items-center justify-center"
          }
        >
          <div
            className={
              city.length < 5
                ? "duration-150 w-[95%] min-h-[25px] flex items-center justify-start md:border-none flex-wrap overflow-hidden z-30"
                : "duration-150 w-[95%] min-h-[25px] flex items-center justify-start md:border-none flex-wrap overflow-hidden z-30"
            }
          >
            {ChoosedCities}
          </div>
          <div
            ref={ButtonCity}
            className="w-[30px] border md:border-none min-h-[25px] flex justify-center cursor-pointer items-center z-20 bg-white m-[3px] rounded-[5px]"
          >
            <div
              ref={cityRefs}
              className="w-[8px] h-[8px] rotate-45 border-r-[3px] border-b-[3px] border-gray-900"
            ></div>
          </div>
        </div>
        <div
          onMouseDown={(e) => e.preventDefault()}
          ref={citylist}
          className="duration-150 absolute  text-white w-full shadow-md left-0 top-[100%] h-[0px] border-gray-700 bg-white z-40 overflow-y-scroll"
        >
          <div>{AllCitiesInThisRegions}</div>
        </div>
      </div>
    </div>
  );
}
