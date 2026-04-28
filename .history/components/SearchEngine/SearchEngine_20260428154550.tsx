import React from "react";
import SearchComponentsList from "./SearchComponentsList";
import SearchResults from "../../components/SearchEngine/SearchResults";
import Pagination from "./Pagination";

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
  isMobileFiltersOpen: any;
  setIsMobileFiltersOpen: any;
  totalCount: any;
};

type SearchEngineProps = FunctionProps & ServerSideProps;

export default function SearchEngine({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
  count,
  loader,
  setLoader,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  totalCount,
  ...restProps
}: SearchEngineProps) {
  return (
    <>
      <div className="flex flex-col items-start justify-center w-full pt-4">
        <SearchComponentsList
          loader={loader}
          setLoader={setLoader}
          handleShowMobileFilters={handleShowMobileFilters}
          mobileButtonSearchEngine={mobileButtonSearchEngine}
          searchEngine={searchEngine}
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        />
        <SearchResults
          {...restProps}
          count={count}
          loader={loader}
          setLoader={setLoader}
        />
        <Pagination
          currentPage={restProps.current}
          totalPages={restProps.totalPages}
        />
      </div>
    </>
  );
}
