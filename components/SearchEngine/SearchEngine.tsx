import { useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import SearchComponentsList from "./SearchComponentsList";
import SearchResults from "./SearchResults";

export default function SearchEngine() {
  const router = useRouter();

  //a./ll countries, regions, Cities

  return (
    <>
      {/* <div
        className={
          showSearchComponentsOnMobile === false
            ? "z-10 flex flex-col items-start justify-start transition w-full bg-white"
            : "h-full -top-full overflow-hidden"
        }
      > */}
      {/* <div className="flex items-center w-full justify-center md:py-4 py-2 bg-white">
                    <p className="text-xs w-[1100px] mx-auto font-normal">{router.query.country.charAt(0).toUpperCase() + router.query.country.slice(1)} -  Przeglądasz pośród {PropertiesLength} ogłoszeń.</p>
                </div> */}
      <div className="flex flex-col items-start justify-center w-full pt-4 bg-gray-400/[0.1]">
        <SearchComponentsList />
        {/* <div className="flex items-center w-full justify-center md:py-4 py-2 bg-white">
              <p className="text-xs w-[1100px] mx-auto font-normal">
                {router.query.country.charAt(0).toUpperCase() + router.query.country.slice(1)} -
                Przeglądasz pośród {PropertiesLength} ogłoszeń.
              </p>
            </div> */}
        <SearchResults />
      </div>
      {/* </div> */}
    </>
  );
}
