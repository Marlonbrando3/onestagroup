import React, { useState, useRef } from "react"
import { useRouter } from "next/router"
import DataCountry from "../data/DataCountry.json"
import {
  BonheurRoyaleFont,
  Red_Hat_DisplayFont,
  MontserratSans,
} from "../fonts/fonts"
import { IoSearchOutline } from "react-icons/io5"
import Properties from "../public/properties.json"

export default function SearchButton() {
  const router = useRouter()
  const advancedSearch = useRef<any>()

  const countryData = useRef<any>()

  const [showedadvancedSearch, setshowedadvancedSearch] = useState(false)

  const [countryChoosed, setCountryChoosed] = useState("hiszpania")

  const [dataRegion, setDataRegion] = useState<any>()
  const [dataType, setDataType] = useState<any>()
  const [dataMarket, setDataMarket] = useState<any>()
  const [dataBathsmin, setDataBathsmin] = useState<any>()
  const [dataBathsmax, setDataBathsmax] = useState<any>()
  const [dataBedsmin, setDataBedsmin] = useState<any>()
  const [dataBedsmax, setDataBedsmax] = useState<any>()
  const [dataPricemin, setDataPricemin] = useState<any>()
  const [dataPricemax, setDataPricemax] = useState<any>()

  const regions = DataCountry.map((r) => {
    if (r.country === countryChoosed) {
      return r.region.map((i, index) => (
        <option key={i} className="hover:bg-orange-400" value={r.showed[index]}>
          {i}
        </option>
      ))
    }
  })

  const handleChoosingCountry = (e: any) => {
    // setQueries({ ...queries });
    let paramsName = e.target.name
    // console.log(paramsBolean)
    let paramsValues = e.target.value
    // console.log(paramsValues);

    if (
      paramsValues === "hiszpania" ||
      paramsValues === "cypr" ||
      paramsValues === "portugalia" ||
      paramsValues === "chorwacja" ||
      paramsValues === "dominikana" ||
      paramsValues === "włochy"
    ) {
      setCountryChoosed(paramsValues)
    }
  }

  const [queries, setQueries] = useState<any>("")

  const showingAdvancedFilters = () => {
    setshowedadvancedSearch(!showedadvancedSearch)
    if (showedadvancedSearch === true) {
      advancedSearch.current.style.height = "23px"
      advancedSearch.current.style.top = "-23px"
      advancedSearch.current.style.height = "300px"
      advancedSearch.current.style.top = "-230px"
    }
  }

  const CountingProperties = () => {
    let PropertiesFounded: any = Properties.filter((p) => {
      if (
        p.country.name.toLowerCase() == (countryChoosed as string) &&
        (p.section === queries.typ ||
          queries.typ === "All" ||
          queries.typ === undefined) &&
        (p.foreignLocation === queries.region ||
          queries.region === undefined ||
          queries.region === "All") &&
        (p.noOfRooms >= parseInt(queries.sypilani_od as string) ||
          queries.sypilani_od === undefined ||
          queries.sypilani_od === "All") &&
        (p.noOfRooms <= parseInt(queries.sypilani_do as string) ||
          queries.sypilani_do === undefined ||
          queries.sypilani_do === "All") &&
        (p.price.amount >= parseInt(queries.cena_od as string) ||
          queries.cena_od === undefined ||
          queries.cena_od === "All") &&
        (p.price.amount <= parseInt(queries.cena_do as string) ||
          queries.cena_do === undefined ||
          queries.cena_do === "All")
      )
        return true
    })
    // console.log(PropertiesFounded.length);
    return PropertiesFounded.length
  }

  const handleFormating = (data: any) => {
    const dataTemp = data
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/ą/g, "a")
      .replace(/ć/g, "c")
      .replace(/ę/g, "e")
      .replace(/ł/g, "l")
      .replace(/ń/g, "n")
      .replace(/ó/g, "o")
      .replace(/ś/g, "s")
      .replace(/ź/g, "z")
      .replace(/ż/g, "z")
      .replace(/á/g, "a")
    console.log(dataTemp)
    return dataTemp
  }

  const handleChoosingRegion = (e: any) => {
    if (e.target.value === "All") {
      const { region, ...rest } = queries
      setQueries(rest)
      setDataRegion("All")
    } else {
      setDataRegion(e.target.value)
      setQueries({
        ...queries,
        region: handleFormating(e.target.value),
      })
    }
  }

  const handleChangingType = (e: any) => {
    if (e.target.value === "All") {
      const { zabudowa, ...rest } = queries
      setQueries(rest)
      setDataType("All")
    } else {
      setDataType(e.target.value)
      setQueries({
        ...queries,
        zabudowa: handleFormating(e.target.value),
      })
    }
  }

  const handleChangingPriceFrom = (e: any) => {
    if (e.target.value === "All") {
      const { cena_od, ...rest } = queries
      setQueries(rest)
      setDataPricemin("All")
    } else {
      setDataPricemin(e.target.value)
      setQueries({
        ...queries,
        cena_od: handleFormating(e.target.value),
      })
    }
  }

  const handleChangingPriceTo = (e: any) => {
    if (e.target.value === "All") {
      const { cena_do, ...rest } = queries
      setQueries(rest)
      setDataPricemax("All")
    } else {
      setDataType(e.target.value)
      setQueries({
        ...queries,
        cena_do: handleFormating(e.target.value),
      })
    }
  }

  const handleChangingBedsFrom = (e: any) => {
    if (e.target.value === "All") {
      const { sypialni_od, ...rest } = queries
      setQueries(rest)
      setDataPricemax("All")
    } else {
      setDataType(e.target.value)
      setQueries({
        ...queries,
        sypialni_od: handleFormating(e.target.value),
      })
    }
  }

  const handleChangingBedsTo = (e: any) => {
    if (e.target.value === "All") {
      const { sypialni_do, ...rest } = queries
      setQueries(rest)
      setDataPricemax("All")
    } else {
      setDataType(e.target.value)
      setQueries({
        ...queries,
        sypialni_do: handleFormating(e.target.value),
      })
    }
  }

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

  const handleSearch = (e: any) => {
    const country = slugify(countryChoosed as string)

    e.preventDefault()
    router.push({
      pathname: `/nieruchomosci/${country}`,
      query: queries,
    })
  }

  const advancedSearchDiv = (
    <div
      ref={advancedSearch}
      className="z-10 absolute w-[98%]  left-0 right-0 mx-auto -top-[23px] h-[23px] flex flex-col duration-150 items-end overflow-hidden"
    >
      <div
        // onClick={showingAdvancedFilters}
        className=" text-white duration-200 mr-10 bg-orange-500 right-10 text-md px-4 rounded-t-md font-[400] cursor-pointer hover:bg-white hover:text-slate-900 text-center border-t"
      >
        {showedadvancedSearch ? (
          <p>Zwiń</p>
        ) : (
          <p>Zaawansowane wyszukiwanie (wkrótce)</p>
        )}{" "}
      </div>
      <div className="text-black bg-white right-10 w-full lg:h-[230px] h-[380px] text-md px-4 rounded-t-md font-[400] flex-wrap lg:flex-row cursor-pointer flex lg:items-center items-start justify-center pt-4">
        <div className="lg:w-1/4 w-1/2 lg:h-full h-1/3">
          <p className="mt-2 font-[600] mb-3">Rynek</p>
          <div>
            <div className="flex items-center mb-2">
              <input
                // onChange={handleQueryData}
                name="firstmarket"
                id="first"
                type="checkbox"
                data-name="pierwotny"
                className="mr-2 w-[20px] h-[20px]"
              ></input>
              <label data-for="pierwotny">Pierwotny</label>
            </div>
            <div className="flex items-center">
              <input
                // onChange={handleQueryData}
                name="secondmarket"
                id="second"
                type="checkbox"
                data-name="pierwotny"
                className="mr-2 w-[20px] h-[20px]"
              ></input>
              <label data-for="wtorny">Wtórny</label>
            </div>
          </div>
        </div>
        <div className=" lg:w-1/4 w-1/2 lg:h-full h-1/2">
          <p className="mt-2 font-[600] mb-3">Łazienek</p>
          <div className="flex justify-start">
            <div className="flex items-center">
              <input
                // onChange={handleQueryData}
                name="bathf"
                id="apartment"
                className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                placeholder="od"
                data-name="od"
              ></input>
            </div>
            <div className="flex items-center">
              <input
                // onChange={handleQueryData}
                name="batht"
                id="house"
                type="number"
                className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                placeholder="do"
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        className={`${MontserratSans.className} right-0 left-0 mx-auto absolute w-[90vw] lg:w-auto lg:top-[550px] md:top-[410px] top-[500px] flex lg:right-0 lg:left-0  border-[#fffbf7] items-center flex-col md:flex-row justify-center`}
      >
        <div className="relative bg-white">
          <form
            onSubmit={handleSearch}
            className="z-20 flex md:w-full w-full flex-wrap lg:justify-between md:justify-start md:items-start content-start text-[14px] lg:h-full  relative p-2 bg-white gap-0"
          >
            <div className="flex flex-col w-full md:w-[200px] lg:w-auto h-auto mr-[20px]">
              {/* <label data-for="country" className=" text-slate-800">
                Kraj
              </label> */}
              <select
                name="country"
                onChange={(e) => handleChoosingCountry(e)}
                ref={countryData}
                className="lg:w-[180px] w-full md:w-[95%] lg:h-[40px] h-[45px] text-[17px] font-[400] pl-2 cursor-pointer text-black tracking-[1px] hover:bg-white hover:text-gray-900 duration-200 border-[0.2px] border-[#C9AC77]"
              >
                <option value="hiszpania">Hiszpania</option>
                {/* <option value="portugalia">Portugalia</option>
              <option value="chorwacja">Chorwacja</option> */}
                <option value="dominikana">Dominikana</option>
                {/* <option value="włochy">Włochy</option> */}
                <option value="cypr">Cypr</option>
              </select>
            </div>
            <div className="flex flex-col w-full md:w-[237px] lg:w-auto mr-[20px]">
              {/* <label data-for="regions" className=" text-slate-800">
                Region
              </label> */}
              <select
                onChange={handleChoosingRegion}
                name="regions"
                className="lg:w-[260px] w-full md:w-[100%] lg:h-[40px] h-[45px] text-[17px] font-[400] pl-2 cursor-pointer duration-200 border-[0.2px] border-[#C9AC77]"
              >
                <option className="" value="All">
                  Wszystkie regiony
                </option>
                {regions}
              </select>
            </div>
            {/* <div className="flex flex-col w-full md:w-[244px] lg:w-auto items-end">
              <label data-for="country" className=" text-slate-800 w-full">
                Typ nieruchomości
              </label>
              <select
                onChange={handleChangingType}
                className="lg:w-[220px] w-[100%] md:w-[96.5%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200 border-[1px]"
              >
                <option value="All" data-name="Wszystkie typy">
                  Wszystkie typy
                </option>
                <option value="ApartmentSale" data-name="ApartmentSale">
                  Apartament
                </option>
                <option value="HouseSale" data-name="HouseSale">
                  Dom
                </option>
              </select>
            </div> */}
            {/* <div className="flex flex-col w-full md:w-[190px] lg:w-[170px] md:mt-2 lg:mt-0">
              <label data-for="country" className=" text-slate-800 w-full">
                Liczba sypialni
              </label>
              <div className="w-full flex justify-between">
                <select
                  onChange={(e) => handleChangingBedsFrom(e)}
                  className="lg:w-[80px] w-[48%] md:w-[90px] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">do</option>
                  <option value="1" data-name="1">
                    1
                  </option>
                  <option value="2" data-name="2">
                    2
                  </option>
                  <option value="3" data-name="3">
                    3
                  </option>
                  <option value="4" data-name="4">
                    4
                  </option>
                  <option value="5" data-name="5">
                    5
                  </option>
                </select>
                <select
                  onChange={handleChangingBedsTo}
                  className="lg:w-[80px] w-[48%] md:w-[90px] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">do</option>
                  <option value="1" data-name="1">
                    1
                  </option>
                  <option value="2" data-name="2">
                    2
                  </option>
                  <option value="3" data-name="3">
                    3
                  </option>
                  <option value="4" data-name="4">
                    4
                  </option>
                  <option value="5" data-name="5">
                    5
                  </option>
                </select>
              </div>
            </div> */}
            {/* <div className="flex flex-col mt-2 lg:w-auto md:w-[400px] w-full md:flex-1">
              <label data-for="country" className=" text-slate-800">
                Zakres cenowy (€ netto)
              </label>
              <div className="flex lg:w-[450px] justify-between md:justify-end items-center">
                <select
                  onChange={handleChangingPriceFrom}
                  className="lg:w-[220px] md:w-[48%] w-[50%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All" data-name="od najniższej">
                    od najniższej
                  </option>
                  <option value="100000" data-name="100000">
                    od 100 000 €
                  </option>
                  <option value="150000" data-name="150000">
                    od 150 000 €
                  </option>
                  <option value="200000" data-name="200000">
                    od 200 000 €
                  </option>
                  <option value="250000" data-name="250000">
                    od 250 000 €
                  </option>
                  <option value="300000" data-name="300000">
                    od 300 000 €
                  </option>
                  <option value="400000" data-name="400000">
                    od 400 000 €
                  </option>
                  <option value="500000" data-name="500000">
                    od 500 000 €
                  </option>
                </select>
                <div className="bg-yellow-500 h-[2px] md:w-[10px] w-[15px]"></div>
                <select
                  onChange={handleChangingPriceTo}
                  className="lg:w-[220px] md:w-[48%] w-[50%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">do najwyższej</option>
                  <option value="200000" data-name="200000">
                    do 200 000 €{" "}
                  </option>
                  <option value="250000" data-name="200000">
                    do 250 000 €
                  </option>
                  <option value="300000" data-name="300000">
                    do 300 000 €
                  </option>
                  <option value="350000" data-name="350000">
                    do 350 000 €
                  </option>
                  <option value="400000" data-name="400000">
                    do 400 000 €
                  </option>
                  <option value="450000" data-name="450000">
                    do 450 000 €
                  </option>
                  <option value="500000 i więcej" data-name="500000">
                    do 500 000 € i więcej
                  </option>
                </select>
              </div>
            </div> */}
            <button className="right-1 bottom-1 lg:w-[170px] w-[190px] text-white md:h-[50px] lg:h-[42px] bg-[#C9AC77] mx-auto lg:mx-0 text-[24px] font-[400] border-2 border-white text-center duration-200 flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <IoSearchOutline className="w-[24px] h-[24px]" />
                <p className="pl-[5px] text-[24px]">Szukaj</p>
              </div>
              {/* <p className="text-[15px] font-bold">
                pośród <span>{CountingProperties()}</span> ogłoszeń
              </p> */}
            </button>
          </form>
          {/* {advancedSearchDiv} */}
        </div>
      </div>
    </>
  )
}
