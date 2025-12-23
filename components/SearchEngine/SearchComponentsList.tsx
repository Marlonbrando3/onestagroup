import React, { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import MainSearchInSearchEngine from "../MainSearchInSearchEngine"
import MobileFilters from "../MobileFilters"
import { Red_Hat_DisplayFont } from "@/fonts/fonts"
import { IoSearch } from "react-icons/io5"
import Properties from "../../public/properties.json"

type Function = {
  handleShowMobileFilters: any
  mobileButtonSearchEngine: any
  searchEngine: any
}

export default function SearchInput({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
}: Function) {
  const router = useRouter()

  const ShowPopUpChangedApply: any = useRef()
  const AdvancedMenu = useRef<HTMLParagraphElement>()
  const AdvancedButton = useRef<HTMLParagraphElement>()
  const RefOffers = useRef<any>()

  const [ref, setRef] = useState<string>("")

  const [filteredProperties, setFilteredProperties]: any = useState()

  const handleChoosingThisOffer = (e: any) => {
    const slug = slugify(e.headerAdvertisement, e.id)
    function slugify(title: string, id: string): string {
      return (
        title
          .toLowerCase()
          .normalize("NFD") // rozkłada znaki akcentowane
          .replace(/[\u0300-\u036f]/g, "") // usuwa znaki diakrytyczne
          .replace(/ł/g, "l") // osobno: ł → l
          .replace(/[^a-z0-9\s-]/g, "") // usuwa wszystko poza literami, cyframi i myślnikami
          .trim()
          .replace(/\s+/g, "-") +
        "-" +
        id
      )
    }

    const country = (
      typeof router.query.country === "string"
        ? router.query.country
        : router.query.country?.[0] || ""
    ).toLowerCase()

    console.log(e.id)
    const property = Properties.filter((i) => i.id === e.id)
    console.log(property[0].id)
    router.push({
      pathname: `/nieruchomosci/${country?.toLowerCase()}/${slug}`,
    })
  }

  const handleInputData = (e: any) => {
    const refNumber = e.target.value
    setRef(refNumber)
    console.log(RefOffers)

    console.log(refNumber.length)

    if (refNumber.length > 2) {
      RefOffers.current.style.display = "block"
    } else {
      RefOffers.current.style.display = "block"
      RefOffers.current.style.display = "none"
    }

    let data = Properties.filter((i: any) =>
      i.listingId.includes(refNumber)
    ).map((e) => (
      <div
        key={e.id}
        onClick={() => handleChoosingThisOffer(e)}
        className="flex bg-white cursor-pointer hover:bg-yellow-100 duration-100 w-full"
      >
        <div className="w-[150px] h-[70px] relative">
          <Image
            src={`https://img.asariweb.pl/thumbnail/${e.images[0].id}`}
            fill
            objectFit="cover"
            alt="img"
          ></Image>
        </div>
        <div className="flex-col p-[5px] flex-1">
          <div className="text-[12px]">
            {e.foreignLocation}, {e.foreignStreet}
          </div>
          <div className="font-semibold text-[14px] leading-[14px]">
            {e.headerAdvertisement}
          </div>
          <div className="text-[10px]">{e.listingId}</div>
        </div>
      </div>
    ))
    console.log(data)

    setFilteredProperties(data)
  }
  const handleSearchingOffer = () => {
    let data = [...Properties].filter((i) => i.listingId === ref.toUpperCase())
    if (data.length === 0) {
      console.log("nie ma ")
    } else console.log("DDD")
  }

  return (
    <>
      <div
        ref={searchEngine}
        className={`${Red_Hat_DisplayFont.className} transition-all duration-500 fixed -top-[450px] lg:mt-0 flex-col items-center justify-center lg:h-[100px] h-auto w-screen lg:w-screen bg-[#fcf7f4] lg:flex lg:sticky z-30`}
      >
        <form className="lg:-mt-[100px] p-[10px] rounded-[7px] flex md:flex-row flex-col justify-center items-center lg:w-[1100px] h-auto md:h-auto relative shadow-[20px_35px_60px_-15px_rgba(0,0,0,0.3)] bg-white">
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
          <div className="bg-white z-10 flex mt-[10px] float-left rounded-md shadow-md p-[7px] relative">
            <div
              ref={RefOffers}
              className="min-w-[400px] h-auto bg-white absolute top-[50px]"
            >
              {filteredProperties}
            </div>
            <div className="w-[110px] text-[14px] leading-[16px] mr-[15px]">
              Wyszukaj po nr. referencyjnym{" "}
            </div>
            <input
              onChange={handleInputData}
              className="border rounded-md outline-none pl-[4px] text-[14px]"
              placeholder="np. 149/15982/ODS"
            ></input>
            {/* <IoSearch
              onClick={handleSearchingOffer}
              className="cursor-pointer hover:bg-white hover:text-green-500 border border-green-500 m-auto bg-green-500 rounded-md h-[25px] w-[25px] p-[4px] ml-[4px] text-white duration-200"
            /> */}
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
  )
}
