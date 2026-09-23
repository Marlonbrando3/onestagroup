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
  locale?: "pl" | "en";
};

export default function SearchInput({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
  loader,
  setLoader,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  locale = "pl",
}: FunctionProps) {
  const router = useRouter();
  const isEn = locale === "en";
  const propertiesHref = isEn
    ? "/en/properties/hiszpania"
    : "/nieruchomosci/hiszpania";

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
        className="relative mt-[20px] flex h-auto w-full flex-col items-stretch justify-center rounded-[16px] px-3 md:px-4 lg:mt-0 lg:flex-row lg:items-center lg:bg-gray-100/[0.3] lg:px-0"
      >
        <div className="h-auto flex-col items-center w-full mx-auto">
          <MainSearchInSearchEngine
            loader={loader}
            setLoader={setLoader}
            handleShowMobileFilters={handleShowMobileFilters}
            searchEngine={searchEngine}
            mobileButtonSearchEngine={mobileButtonSearchEngine}
            locale={locale}
          />
          <h2 className="mx-auto w-[90vw] max-w-[1300px] text-[28px] mt-[10px]">
            {isEn ? "Property listings" : "Oferty nieruchomości"}
          </h2>
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
