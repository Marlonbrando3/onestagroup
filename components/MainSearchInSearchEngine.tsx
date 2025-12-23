import { useRouter } from "next/router"
import { useRef, useState } from "react"
import DataCountry from "../data/DataCountry.json"
import CountrySearch from "./SearchEngine/Country/CountrySearch"
import Region from "./SearchEngine/RegionSearch/Region"
import Types from "./SearchEngine/TypeSearch/Types"
import Market from "./SearchEngine/Market/Market"
import Bathrooms from "./SearchEngine/Bathrooms/BathSearch"
import Bedrooms from "./SearchEngine/Bedrooms/BedSearch"
import PriceSearch from "./SearchEngine/PriceSearch/PriceSearch"
import { IoSearch } from "react-icons/io5"

type Props = {
  handleShowMobileFilters: any
  searchEngine: any
  mobileButtonSearchEngine: any
}

export default function Home({
  mobileButtonSearchEngine,
  searchEngine,
}: Props) {
  const router = useRouter()
  const AdvancedButton = useRef()
  const searchBtn = useRef<HTMLDivElement>(null)

  const {
    region,
    zabudowa,
    rynek,
    lazienek_od,
    lazienek_do,
    sypialni_od,
    sypialni_do,
    cena_od,
    cena_do,
    page,
  } = router.query

  const [dataRegion, setDataRegion] = useState(region || "All")
  const [dataType, setDataType] = useState(zabudowa || "All")
  const [dataMarket, setDataMarket] = useState(rynek || "All")
  const [dataBathsmin, setDataBathsmin] = useState(lazienek_od || "All")
  const [dataBathsmax, setDataBathsmax] = useState(lazienek_do || "All")
  const [dataBedsmin, setDataBedsmin] = useState(sypialni_od || "All")
  const [dataBedsmax, setDataBedsmax] = useState(sypialni_do || "All")
  const [dataPricemin, setDataPricemin] = useState(cena_od || "All")
  const [dataPricemax, setDataPricemax] = useState(cena_do || "All")

  const [queries, setQueries] = useState(() => ({
    ...(region && { region }),
    ...(zabudowa && { zabudowa }),
    ...(lazienek_od && { lazienek_od }),
    ...(sypialni_od && { sypialni_od }),
    ...(sypialni_do && { sypialni_do }),
    ...(cena_od && { cena_od }),
    ...(cena_do && { cena_do }),
  }))

  function slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD") // rozkłada znaki akcentowane
      .replace(/[\u0300-\u036f]/g, "") // usuwa znaki diakrytyczne
      .replace(/ł/g, "l") // osobno: ł → l
      .replace(/[^a-z0-9\s-]/g, "") // usuwa wszystko poza literami, cyframi i myślnikami
      .trim()
      .replace(/\s+/g, "-")
  }

  const handleNewSearch = () => {
    const country = slugify(router.query.country as string)
    // const region = slugify(dataRegion as string);

    if (searchEngine.current.style.top)
      searchEngine.current.style.top = "-460px"
    router.push({
      pathname: `/nieruchomosci/${country}/`,
      query: queries,
    })
    mobileButtonSearchEngine.current.innerHTML = "Filtry"
  }

  const handleResetingSearch = () => {
    setDataRegion("All")
    setDataType("All")
    setDataMarket("All")
    setDataBathsmin("All")
    setDataBathsmax("All")
    setDataBedsmin("All")
    setDataBedsmax("All")
    setDataPricemin("All")
    setDataPricemax("All")
    router
      .push({ pathname: `/nieruchomosci/${router.query.country}` })
      .then(() => {
        window.location.reload()
      })
  }

  return (
    <>
      <div id="search-wrapper" className="flex flex-col  mx-auto">
        <div className="flex flex-col justify-end w-full">
          <div
            id="search-params-wrapper"
            className="flex w-full mt-0 flex-col lg:flex-row mx-auto lg:flex-wrap items-center justify-between"
          >
            <CountrySearch
              searchBtn={searchBtn}
              slugify={slugify}
              dataRegion={dataRegion}
            />
            <Region
              setQueries={setQueries}
              queries={queries}
              dataRegion={dataRegion}
              setDataRegion={setDataRegion}
            />
            {/* <City /> */}
            <Types
              setQueries={setQueries}
              queries={queries}
              dataType={dataType}
              setDataType={setDataType}
            />
            <Market
              setQueries={setQueries}
              queries={queries}
              dataMarket={dataMarket}
              setDataMarket={setDataMarket}
            />
            <Bathrooms
              setQueries={setQueries}
              queries={queries}
              dataBathsmin={dataBathsmin}
              setDataBathsmin={setDataBathsmin}
              dataBathsmax={dataBathsmax}
              setDataBathsmax={setDataBathsmax}
            />
            <Bedrooms
              setQueries={setQueries}
              queries={queries}
              dataBedsmin={dataBedsmin}
              setDataBedsmin={setDataBedsmin}
              dataBedsmax={dataBedsmax}
              setDataBedsmax={setDataBedsmax}
            />
            <PriceSearch
              setQueries={setQueries}
              queries={queries}
              dataPricemin={dataPricemin}
              setDataPricemin={setDataPricemin}
              dataPricemax={dataPricemax}
              setDataPricemax={setDataPricemax}
            />
            {/* <div
              // onClick={ShowMoreMenu}
              ref={AdvancedButton}
              className="invisible md:visible right-[110px] top-[50%] w-[160px] text-[14px] flex items-center justify-center float-right bg-white border-gray-600 hover:bg-slate-500 hover:text-white px-[26px] duration-150 rounded-sm cursor-pointer m-2 text-center"
            >
              <p>więcej filtrów (wkrótce)</p>
            </div> */}

            <div className="flex">
              {router.asPath.length > 20 && (
                <div
                  className="h-[40px] w-[170px] text-black rounded-3xl bg-white cursor-pointer flex items-center justify-center mt-[14px] border-[0.5px] border-gray-400"
                  onClick={handleResetingSearch}
                >
                  Wyczyść filtry
                </div>
              )}
              <div
                ref={searchBtn}
                className="ml-[10px] h-[40px] w-[170px] md:w-[210px] text-white rounded-3xl bg-gradient-to-r from-orange-500  to-indigo-400 cursor-pointer flex items-center justify-center mt-[14px]"
                onClick={handleNewSearch}
              >
                <IoSearch />
                Szukaj
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
