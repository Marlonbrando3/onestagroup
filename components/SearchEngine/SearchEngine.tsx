import React from "react";
import SearchComponentsList from "./SearchComponentsList";
import SearchResults from "../../components/SearchEngine/SearchResults";

type ServerSideProps = {
  properties: any;
  query: any;
  country: any;
};

type FunctionProps = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
};

type SearchEngineProps = FunctionProps & ServerSideProps;

export default function SearchEngine({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
  ...restProps
}: SearchEngineProps) {
  return (
    <>
      <div className="flex flex-col items-start justify-center w-full pt-4 bg-[#fcf7f4]">
        <SearchComponentsList
          handleShowMobileFilters={handleShowMobileFilters}
          mobileButtonSearchEngine={mobileButtonSearchEngine}
          searchEngine={searchEngine}
        />
        <SearchResults {...restProps} />
      </div>
    </>
  );
}
