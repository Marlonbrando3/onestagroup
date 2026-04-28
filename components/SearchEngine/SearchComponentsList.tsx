import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import MainSearchInSearchEngine from "../MainSearchInSearchEngine";
import MobileFilters from "../MobileFilters";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import Properties from "../../public/properties.json";

type FunctionProps = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
  loader: any;
  setLoader: any;
  isMobileFiltersOpen: any;
  setIsMobileFiltersOpen: any;
};

export default function SearchInput({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
  loader,
  setLoader,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
}: FunctionProps) {
  const router = useRouter();

  const RefOffers = useRef<any>();
  const [ref, setRef] = useState<string>("");
  const [filteredProperties, setFilteredProperties]: any = useState();

  return (
    <div
      // ref={searchEngine}
      className={`${Red_Hat_DisplayFont.className}
  w-full bg-white z-30
  relative
  `}
    >
      <form className="rounded-[7px] flex flex-col lg:flex-row justify-center items-stretch lg:items-center w-full h-auto relative lg:bg-transparent px-3 md:px-4 lg:px-0">
        <div className="h-auto flex items-center w-full mx-auto">
          <MainSearchInSearchEngine
            loader={loader}
            setLoader={setLoader}
            handleShowMobileFilters={handleShowMobileFilters}
            searchEngine={searchEngine}
            mobileButtonSearchEngine={mobileButtonSearchEngine}
          />
        </div>
      </form>

      {/* <MobileFilters
        handleShowMobileFilters={handleShowMobileFilters}
        searchEngine={searchEngine}
        mobileButtonSearchEngine={mobileButtonSearchEngine}
        isOpen={isMobileFiltersOpen}
      /> */}
    </div>
  );
}
