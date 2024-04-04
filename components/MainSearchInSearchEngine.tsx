import { useRouter } from "next/router";
import { useRef, useState } from "react";
import CountrySearch from "./SearchEngine/Country/CountrySearch";
import Region from "./SearchEngine/RegionSearch/Region";
import Types from "./SearchEngine/TypeSearch/Types";
import Market from "./SearchEngine/Market/Market";
import Bathrooms from "./SearchEngine/Bathrooms/BathSearch";
import Bedrooms from "./SearchEngine/Bedrooms/BedSearch";
import PriceSearch from "./SearchEngine/PriceSearch/PriceSearch";
import { IoSearch } from "react-icons/io5";

export default function Home() {
  const router = useRouter();
  const AdvancedButton = useRef();

  const [city, setCity] = useState([]);

  const handleRegionMenu = useRef();

  let regionsToShow = [router.query.region];

  // const handleDeleteParam = (e) => {
  //   const params = new URLSearchParams(router.query);
  //   params.delete("region");
  //   const queryString = params.toString();
  //   const path = `/[country]${queryString ? `?${queryString}` : ""}`;
  //   // console.log(queryString)

  //   router.push(path, "", { scroll: false });
  // };

  const ShowMoreMenu = () => {
    // showMore();
  };

  const handleNewSearch = () => {
    // console.log(JSON.stringify(SearchFilters));
    // let newSearch = {};
    // const test = SearchFilters.map((i) => {
    //   Object.keys(i).map((key, value) => {
    //     if (Object.values(i).toString() !== "") {
    //       newSearch[key] = i[key];
    //     }
    //   });
    // }
    // router.push({
    //   pathname: `/${router.query.country}`,
    //   query: newSearch,
    // });
  };

  return (
    <>
      <div id="search-wrapper" className="flex flex-col  mx-auto">
        <div className="flex flex-col justify-end w-full">
          <div
            id="search-params-wrapper"
            className="flex md:w-full mt-0 flex-col lg:flex-row mx-auto lg:flex-wrap items-center justify-between"
          >
            <CountrySearch />
            <Region />
            {/* <City /> */}
            <Types />
            <Market />
            <Bathrooms />
            <Bedrooms />
            <PriceSearch />
            {/* <div
              // onClick={ShowMoreMenu}
              ref={AdvancedButton}
              className="invisible md:visible right-[110px] top-[50%] w-[160px] text-[14px] flex items-center justify-center float-right bg-white border-gray-600 hover:bg-slate-500 hover:text-white px-[26px] duration-150 rounded-sm cursor-pointer m-2 text-center"
            >
              <p>więcej filtrów (wkrótce)</p>
            </div> */}
            <div
              className="h-[40px] w-[170px] text-white rounded-3xl bg-yellow-500 cursor-pointer flex items-center justify-center mt-[14px]"
              onClick={handleNewSearch}
            >
              <IoSearch />
              Szukaj
            </div>
          </div>
        </div>
      </div>
      {/* </MainSearch.Provider> */}
    </>
  );
}
