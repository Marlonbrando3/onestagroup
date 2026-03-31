import React from "react";
import SearchComponentsList from "./SearchComponentsList";
import SearchResults from "../../components/SearchEngine/SearchResults";

type ServerSideProps = {
  properties: any;
  query: any;
  country: any;
  count: any;
};

type FunctionProps = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
  loader: any;
  setLoader: any;
};

type SearchEngineProps = FunctionProps & ServerSideProps;

export default function SearchEngine({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
  count,
  loader,
  setLoader,
  ...restProps
}: SearchEngineProps) {
  return (
    <>
      <div className="flex flex-col items-start justify-center w-full pt-4 bg-[#fcf7f4]">
        <SearchComponentsList
          loader={loader}
          setLoader={setLoader}
          handleShowMobileFilters={handleShowMobileFilters}
          mobileButtonSearchEngine={mobileButtonSearchEngine}
          searchEngine={searchEngine}
        />
        <SearchResults {...restProps} count={count} />
      </div>
    </>
  );
}
