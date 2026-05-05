import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MainSearchInSearchEngine from "../MainSearchInSearchEngine";
import { MdKeyboardArrowRight } from "react-icons/md";
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

  const { country } = router.query;

  const RefOffers = useRef<any>();
  const [ref, setRef] = useState<string>("");
  const [filteredProperties, setFilteredProperties]: any = useState();

  return (
    <div
      // ref={searchEngine}
      className={`${Red_Hat_DisplayFont.className}
  w-full bg-white z-20
  relative md:static
  `}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="rounded-[7px] flex flex-col lg:flex-row justify-center items-stretch lg:items-center w-full h-auto relative lg:bg-gray-100/[0.3] px-3 md:px-4 lg:px-0"
      >
        <div className="h-auto flex-col items-center w-full mx-auto">
          <MainSearchInSearchEngine
            loader={loader}
            setLoader={setLoader}
            handleShowMobileFilters={handleShowMobileFilters}
            searchEngine={searchEngine}
            mobileButtonSearchEngine={mobileButtonSearchEngine}
          />
          <div className="px-[30px] py-[10px] w-[90vw] max-w-[1300px] z-30 relative flex items-center ">
            <Link href="/">Strona startowa</Link>
            <MdKeyboardArrowRight className="md:mx-[10px] h-[20px] w-[20px] text-gray-400" />
            <Link href="#">Nieruchomości</Link>
            <MdKeyboardArrowRight className="md:mx-[10px] h-[20px] w-[20px] text-gray-400" />{" "}
            <Link href="/nieruchomosci/hiszpania" className="capitalize">
              {country}
            </Link>
          </div>
          <p className="mx-auto w-[1300px] -mt-[20px] text-[28px]">
            Wyjątkowe nieruchomości w Hiszpanii
          </p>
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
