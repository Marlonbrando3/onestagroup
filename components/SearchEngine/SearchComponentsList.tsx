import React, { useRef } from "react";
import { useRouter } from "next/router";
import MainSearchInSearchEngine from "../MainSearchInSearchEngine";

export default function SearchInput() {
  const router = useRouter();

  const handleShowMobileFilters = () => {
    // setShowSearchComponentsOnMobile(
    //   (showSearchComponentsOnMobile) => !showSearchComponentsOnMobile,
    // );
  };

  const ShowPopUpChangedApply: any = useRef();
  const searchEngine = useRef<any>();
  const AdvancedMenu = useRef<HTMLParagraphElement>();
  const AdvancedButton = useRef<HTMLParagraphElement>();

  // const ButtonsAdvanced =
  //   AdvancedMenu.current === undefined || AdvancedMenu.current.style.height === "0px" ? (
  //     <p>więcej filtrów</p>
  //   ) : (
  //     <p>zwiń</p>
  //   );

  return (
    <>
      {/* <div ref={ShowPopUpChangedApply} className="bg-green-700 transition fixed z-40 bottom-2 right-2 text-white px-3 rounded-md hidden ">Zmiany wprowdzone!</div> */}
      <div
        ref={searchEngine}
        className={
          "transition-all duration-500 disable hidden -top-screen flex-col items-center justify-center lg:top-[70px] h-[100px] lg:w-screen bg-white lg:flex z-40"
        }
      >
        <div
          className="border-2 rounded-[10%] border-red-900 bg-white m-4 w-[30px] h-[30px] z-40 block md:hidden fixed top-0 right-0"
          onClick={handleShowMobileFilters}
        >
          <div className="w-[28px] h-[28px] text-white relative flex items-center justify-center">
            <div className="absolute border-t-2 border-red-900 w-8/12 h-[1px] rotate-45"></div>
            <div className="absolute border-t-2 border-red-900  w-8/12 h-[1px] -rotate-45"></div>
          </div>
        </div>
        <form className="lg:-mt-[100px] p-[10px] rounded-[20px] flex md:flex-row flex-col justify-center items-center lg:w-[1100px] w-screenborder-red-500/[0.5] h-[800px] md:h-auto relative shadow-[20px_35px_60px_-15px_rgba(0,0,0,0.3)] bg-white">
          <div className="h-auto flex items-center w-full">
            <MainSearchInSearchEngine />
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
        <div className="flex flex-col justify-center items-center xl:mx-[45px] lg:mt-0"></div>
      </div>
    </>
  );
}
