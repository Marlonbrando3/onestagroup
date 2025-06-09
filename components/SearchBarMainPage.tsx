import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import DataCountry from "../data/DataCountry.json";
import { BonheurRoyaleFont, Red_Hat_DisplayFont } from "../fonts/fonts";
import { IoSearchOutline } from "react-icons/io5";
import Properties from "../public/properties.json";

export default function SearchButton() {
  const router = useRouter();
  const advancedSearch = useRef<any>();

  const country = useRef<any>();

  const [showedadvancedSearch, setshowedadvancedSearch] = useState(false);

  const [countryChoosed, setCountryChoosed] = useState("hiszpania");

  const [dataRegion, setDataRegion] = useState();
  const [dataType, setDataType] = useState();
  const [dataMarket, setDataMarket] = useState();
  const [dataBathsmin, setDataBathsmin] = useState();
  const [dataBathsmax, setDataBathsmax] = useState();
  const [dataBedsmin, setDataBedsmin] = useState();
  const [dataBedsmax, setDataBedsmax] = useState();
  const [dataPricemin, setDataPricemin] = useState();
  const [dataPricemax, setDataPricemax] = useState();

  const regions = DataCountry.map((r) => {
    if (r.country === countryChoosed) {
      return r.region.map((i, index) => (
        <option key={i} className="bg-white" value={r.showed[index]}>
          {i}
        </option>
      ));
    }
  });

  const handleChoosingCountry = (e: any) => {
    setQueries({ ...queries, country: e.target.value });
    let paramsName = e.target.name;
    // console.log(paramsBolean)
    let paramsValues = e.target.value;
    console.log(paramsValues);

    if (
      paramsValues === "hiszpania" ||
      paramsValues === "portugalia" ||
      paramsValues === "chorwacja" ||
      paramsValues === "dominikana" ||
      paramsValues === "włochy"
    ) {
      setCountryChoosed(paramsValues);
    }

    //   console.log(p.price);
    //   console.log(p.listingId);

    //   if (
    //     p.country.name.toLowerCase() == (countryChoosed as string) &&
    //     (p.section === dataType || dataType === "All" || dataType === undefined) &&
    //     (p.foreignLocation === dataRegion || dataRegion === undefined || dataRegion === "All") &&
    //     (p.mortgageMarket === dataMarket || dataMarket === undefined || dataMarket === "All") &&
    //     (p.noOfRooms >= parseInt(dataBedsmin as string) ||
    //       dataBedsmin === undefined ||
    //       dataBedsmin === "All") &&
    //     (p.noOfRooms <= parseInt(dataBedsmax as string) ||
    //       dataBedsmax === undefined ||
    //       dataBedsmax === "All") &&
    //     (p.price.amount >= parseInt(dataPricemin as string) ||
    //       dataPricemin === undefined ||
    //       dataPricemin === "All") &&
    //     (p.price.amount <= parseInt(dataPricemax as string) ||
    //       dataPricemax === undefined ||
    //       dataPricemax === "All")
    //   )
    //     return true;
    // });

    // setconditions(
    //   conditions.map((i) => {
    //     console.log();
    //     if (i.name === paramsName && (i.value === false || i.value === true)) {
    //       console.log(i.name);
    //       return {
    //         name: i.name,
    //         value: !i.value,
    //       };
    //     }
    //     if (i.name === paramsName && i.value !== false && i.value !== true) {
    //       return {
    //         name: i.name,
    //         value: paramsValues,
    //       };
    //     } else return i;
    //   }),
    // );
  };

  const [queries, setQueries] = useState<any>({
    page: 1,
  });

  const showingAdvancedFilters = () => {
    setshowedadvancedSearch(!showedadvancedSearch);
    if (showedadvancedSearch === true) {
      advancedSearch.current.style.height = "23px";
      advancedSearch.current.style.top = "-23px";
      advancedSearch.current.style.height = "300px";
      advancedSearch.current.style.top = "-230px";
    }
  };

  // const data = conditions.filter((e) => {
  //   if (e.value === false) return false;
  //   if (e.value === null) return false;
  //   else return true;
  // });

  // const querybeta = data.map((i) => {
  //   console.log();
  //   if (i.value === false || i.value === true) {
  //     console.log(i.name);
  //     return {
  //       [i.name]: i.value,
  //     };
  //   }
  //   if (i.value !== false && i.value !== true) {
  //     return {
  //       [i.name]: i.value,
  //     };
  //   } else return i;
  // });

  // const query = querybeta.reduce(function (result: any, currentObject: any) {
  //   for (var key in currentObject) {
  //     if (currentObject.hasOwnProperty(key)) {
  //       result[key] = currentObject[key];
  //     }
  //   }
  //   return result;
  // }, {});

  const CountingProperties = () => {
    let PropertiesFounded: any = Properties.filter((p) => {
      if (
        p.country.name.toLowerCase() == (countryChoosed as string) &&
        (p.section === queries.type || queries.type === "All" || queries.type === undefined) &&
        (p.foreignLocation === queries.region ||
          queries.region === undefined ||
          queries.region === "All") &&
        (p.noOfRooms >= parseInt(queries.bedsmin as string) ||
          dataBedsmin === undefined ||
          dataBedsmin === "All") &&
        (p.noOfRooms <= parseInt(queries.bedsmax as string) ||
          queries.bedsmax === undefined ||
          queries.bedsmax === "All") &&
        (p.price.amount >= parseInt(queries.pricemin as string) ||
          queries.pricemin === undefined ||
          queries.pricemin === "All") &&
        (p.price.amount <= parseInt(queries.pricemax as string) ||
          queries.pricemax === undefined ||
          queries.pricemax === "All")
      )
        return true;
    });
    // console.log(PropertiesFounded.length);
    return PropertiesFounded.length;
  };

  const handleChoosingRegion = (e: any) => {
    setQueries({ ...queries, region: e.target.value });
    // CountingProperties();
  };
  const handleChangingType = (e: any) => {
    setQueries({ ...queries, type: e.target.value });
    // CountingProperties();
  };
  const handleChangingPriceFrom = (e: any) => {
    setQueries({ ...queries, pricemin: e.target.value });
    // CountingProperties();
  };
  const handleChangingPriceTo = (e: any) => {
    setQueries({ ...queries, pricemax: e.target.value });
    // CountingProperties();
  };

  console.log(queries);

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push({
      pathname: `nieruchomosci/${countryChoosed}`,
      query: queries,
    });
  };

  const advancedSearchDiv = (
    <div
      ref={advancedSearch}
      className="z-10 absolute w-[98%]  left-0 right-0 mx-auto -top-[23px] h-[23px] flex flex-col duration-150 items-end overflow-hidden"
    >
      <div
        // onClick={showingAdvancedFilters}
        className=" text-white duration-200 mr-10 bg-orange-500 right-10 text-md px-4 rounded-t-md font-[400] cursor-pointer hover:bg-white hover:text-slate-900 text-center border-t"
      >
        {showedadvancedSearch ? <p>Zwiń</p> : <p>Zaawansowane wyszukiwanie (wkrótce)</p>}{" "}
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
                className="mr-2 w-[20px] h-[20px]"
              ></input>
              <label data-for="first">Pierwotny</label>
            </div>
            <div className="flex items-center">
              <input
                // onChange={handleQueryData}
                name="secondmarket"
                id="second"
                type="checkbox"
                className="mr-2 w-[20px] h-[20px]"
              ></input>
              <label data-for="second">Wtórny</label>
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
                type="number"
                className=" pl-2 mr-2 lg:w-[70px] w-[60px] h-[30px] border border-gray-700 rounded-sm"
                placeholder="od"
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
  );

  return (
    <>
      <div
        className={`${Red_Hat_DisplayFont.className} right-0 left-0 mx-auto absolute w-[90vw] lg:w-[900px] md:w-[730px] lg:top-[410px] md:top-[150px] top-[22%] flex lg:right-0 lg:left-0 rounded-[4px] bg-white shadow-xl border-[#fffbf7] items-center flex-col md:flex-row justify-center`}
      >
        <div className="w-full h-full relative">
          <form
            onSubmit={handleSearch}
            className="z-20 flex md:w-full w-full flex-wrap lg:justify-between md:justify-start md:items-start content-start text-[14px] lg:h-full md:h-[250px] h-[450px] relative p-6 bg-white rounded-[4px] gap-0"
          >
            <div className="flex flex-col w-full md:w-[200px] lg:w-auto h-auto">
              <label data-for="country" className=" text-slate-800">
                Kraj
              </label>
              <select
                name="country"
                onChange={(e) => handleChoosingCountry(e)}
                ref={country}
                className="lg:w-[180px] w-full md:w-[95%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 bg-orange-400 cursor-pointer text-white tracking-[1px] hover:bg-white hover:text-gray-900 duration-200 border-orange-400 border"
              >
                <option value="hiszpania">Hiszpania</option>
                {/* <option value="portugalia">Portugalia</option>
              <option value="chorwacja">Chorwacja</option> */}
                <option value="dominikana">Dominikana</option>
                {/* <option value="włochy">Włochy</option> */}
              </select>
            </div>
            <div className="flex flex-col w-full md:w-[237px] lg:w-auto">
              <label data-for="regions" className=" text-slate-800">
                Region
              </label>
              <select
                onChange={handleChoosingRegion}
                name="regions"
                className="lg:w-[260px] w-full md:w-[100%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
              >
                <option className="bg-white" value="All">
                  Wszystkie regiony
                </option>
                {regions}
              </select>
            </div>
            <div className="flex flex-col w-full md:w-[244px] lg:w-auto items-end">
              <label data-for="country" className=" text-slate-800 w-full">
                Typ nieruchomości
              </label>
              <select
                onChange={handleChangingType}
                className="lg:w-[220px] w-[100%] md:w-[96.5%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
              >
                <option value="All">Wszystkie typy</option>
                <option value="ApartmentSale">Apartament</option>
                <option value="HouseSale">Dom</option>
              </select>
            </div>
            <div className="flex flex-col w-full md:w-[190px] lg:w-[170px] md:mt-2 lg:mt-0">
              <label data-for="country" className=" text-slate-800 w-full">
                Liczba sypialni
              </label>
              <div className="w-full flex justify-between">
                <select
                  onChange={handleChangingType}
                  className="lg:w-[80px] w-[48%] md:w-[90px] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">od</option>
                  <option value="ApartmentSale">1</option>
                  <option value="HouseSale">2</option>
                  <option value="HouseSale">3</option>
                  <option value="HouseSale">4</option>
                </select>
                <select
                  onChange={handleChangingType}
                  className="lg:w-[80px] w-[48%] md:w-[90px] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">do</option>
                  <option value="HouseSale">2</option>
                  <option value="HouseSale">3</option>
                  <option value="HouseSale">4</option>
                  <option value="HouseSale">5</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col mt-2 lg:w-auto md:w-[400px] w-full md:flex-1">
              <label data-for="country" className=" text-slate-800">
                Zakres cenowy (€ netto)
              </label>
              <div className="flex lg:w-[450px] justify-between md:justify-end items-center">
                <select
                  onChange={handleChangingPriceFrom}
                  className="lg:w-[220px] md:w-[48%] w-[50%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">od najniższej</option>
                  <option value="100000">od 100 000 €</option>
                  <option value="150000">od 150 000 €</option>
                  <option value="200000">od 200 000 €</option>
                  <option value="250000">od 250 000 €</option>
                  <option value="300000">od 300 000 €</option>
                  <option value="400000">od 400 000 €</option>
                  <option value="500000">od 500 000 €</option>
                </select>
                <div className="bg-yellow-500 h-[2px] md:w-[10px] w-[15px]"></div>
                <select
                  onChange={handleChangingPriceTo}
                  className="lg:w-[220px] md:w-[48%] w-[50%] lg:h-[40px] h-[45px] rounded-[4px] text-[17px] font-[400] pl-2 cursor-pointer border-[1px] border-yellow-500 tracking-[0.4px] hover:bg-orange-400 hover:text-white duration-200"
                >
                  <option value="All">do najwyższej</option>
                  <option value="200000">od 200 000 €</option>
                  <option value="250000">od 250 000 €</option>
                  <option value="300000">do 300 000 €</option>
                  <option value="350000">od 350 000 €</option>
                  <option value="400000">od 400 000 €</option>
                  <option value="450000">od 500 000 €</option>
                  <option value="500000 i więcej">do 500 000 € i więcej</option>
                </select>
              </div>
            </div>
            <button className="absolute right-1 bottom-1 lg:w-[220px] w-[190px] text-white lg:h-[60px] h-[62px] bg-gradient-to-r from-orange-500  to-indigo-400  mt-7 mx-auto lg:mx-0 text-[24px] font-[400] border-2 border-white text-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-500 hover:border-orange-500 duration-200 flex-col items-center justify-center rounded-l-[40px] rounded-b-[3px] rounded-r-[4px]">
              <div className="flex items-center justify-center">
                <IoSearchOutline className="w-[24px] h-[24px]" />
                <p className="pl-[5px] text-[24px]">Szukaj</p>
              </div>
              <p className="text-[15px] font-bold">
                pośród <span>{CountingProperties()}</span> ogłoszeń
              </p>
            </button>
          </form>
          {advancedSearchDiv}
        </div>
      </div>
    </>
  );
}
