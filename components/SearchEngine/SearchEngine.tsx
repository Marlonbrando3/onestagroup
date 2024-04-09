import React from "react";
import SearchComponentsList from "./SearchComponentsList";
import SearchResults from "./SearchResults";

type Function = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
};

export default function SearchEngine({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
}: Function) {
  return (
    <>
      <div className="flex flex-col items-start justify-center w-full pt-4 bg-gray-400/[0.1]">
        <SearchComponentsList
          handleShowMobileFilters={handleShowMobileFilters}
          mobileButtonSearchEngine={mobileButtonSearchEngine}
          searchEngine={searchEngine}
        />
        <SearchResults />
      </div>
    </>
  );
}
