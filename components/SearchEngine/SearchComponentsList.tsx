import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import MainSearchInSearchEngine from "../MainSearchInSearchEngine";
import MobileFilters from "../MobileFilters";
import { IoSearch } from "react-icons/io5";
import Properties from "../../public/properties.json";

type Function = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
};

export default function SearchInput({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
}: Function) {
  const router = useRouter();

  const ShowPopUpChangedApply: any = useRef();
  const AdvancedMenu = useRef<HTMLParagraphElement>();
  const AdvancedButton = useRef<HTMLParagraphElement>();

  const [ref, setRef] = useState<string>("");

  const handleInputData = (e: any) => {
    setRef(e.target.value);
  };

  const handleSearchingOffer = () => {
    let data = [...Properties].filter((i) => i.listingId === ref.toUpperCase());
    if (data.length === 0) {
      console.log("nie ma ");
    } else console.log("DDD");
  };

  return (
    <>
      <div
        ref={searchEngine}
        className={
          "transition-all duration-500 fixed -top-[400px] lg:mt-0 flex-col items-center justify-center lg:h-[100px] h-auto w-screen lg:w-screen bg-white lg:flex lg:sticky z-30"
        }
      >
        <form className="lg:-mt-[100px] p-[10px] rounded-[20px] flex md:flex-row flex-col justify-center items-center lg:w-[1100px] h-auto md:h-auto relative shadow-[20px_35px_60px_-15px_rgba(0,0,0,0.3)] bg-white">
          <div className="h-auto flex items-center w-full mx-auto">
            <MainSearchInSearchEngine
              handleShowMobileFilters={handleShowMobileFilters}
              searchEngine={searchEngine}
              mobileButtonSearchEngine={mobileButtonSearchEngine}
            />
          </div>
          {/* <div
              ref={AdvancedMenu}
              className="static md:shadow-md md:mt-auto md:absolute left-0 bg-white md:h-[0px] h-[800px] w-[800px] flex flex-col md:flex-row duration-150 overflow-hidden justify-center items-center top-[100%]"
            >
              <div className="flex md:flex-row flex-col h-[200px] items-center justify-center">
                <PriceSearch />
                <div className="flex h-[70px] items-center justify-center">
                  <Baths />
                  <Beds />
                </div>
              </div>
              <div className="w-11/12 lg:w-11/12 md:w-11/12">
                <p>Dystans do morza</p>
                    <Range
                      apply={apply}
                      setApply={setApply}
                      seaMax={seaMax}
                      setSeaMax={setSeaMax}
                  />
              </div>
              <div className="flex md:flex-col justify-center items-center w-full">
                <Offersparameters
                  name="pool"
                  IconName={<Pool className="IconsByChoosing"/>}
                  title={"Basen"}
                  />
                <Offersparameters 
                  name="seaview"
                  IconName={<Seaview className="IconsByChoosing"/>}
                  title={"Widok na morze"}
                  />
              </div>
              <div className="flex md:flex-col justify-center items-center">
                <Offersparameters 
                  name="parking"
                  IconName={<Parking className="IconsByChoosing"/>} 
                  title={"Parking"}
                  />
                <Offersparameters 
                  name="garden"
                  IconName={<Garden className="IconsByChoosing"/>}
                  title={"Ogródek"}
                  />
               </div>
               <div className="flex md:flex-col justify-center items-center">
                  <Offersparameters 
                    name="solarium"
                    IconName={<Solarium className="IconsByChoosing"/>}
                    title={"Solarium"}
                    />
                  <Offersparameters 
                    name="balcony"
                    IconName={<Balcony className="IconsByChoosing"/>}
                    title={"Balkon"}
                  />
                </div>
            </div> */}
          {/* <div
              className="lg:absolute top-[43px] right-[40px] button-search bg-red-600 cursor-pointer float-left md:my-0"
              onClick={handleNewSearch}
            >
              Szukaj
            </div> */}
        </form>
        <div className="w-full lg:w-[1100px] flex justify-start mx-auto items-center">
          <div className="bg-white z-10 flex mt-[10px] float-left rounded-md shadow-md p-[7px]">
            <div className="w-[110px] text-[14px] leading-[16px] mr-[15px]">
              Wyszukaj po nr. referencyjnym{" "}
            </div>
            <input
              onChange={handleInputData}
              className="border rounded-md outline-none pl-[4px] text-[14px]"
              placeholder="np. 149/15982/ODS"
            ></input>
            <IoSearch
              onClick={handleSearchingOffer}
              className="cursor-pointer hover:bg-white hover:text-green-500 border border-green-500 m-auto bg-green-500 rounded-md h-[25px] w-[25px] p-[4px] ml-[4px] text-white duration-200"
            />
          </div>
        </div>
        <MobileFilters
          handleShowMobileFilters={handleShowMobileFilters}
          searchEngine={searchEngine}
          mobileButtonSearchEngine={mobileButtonSearchEngine}
        />
        <div className="flex flex-col justify-center items-center xl:mx-[45px] lg:mt-0"></div>
      </div>
    </>
  );
}
