import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { IoMdPin } from "react-icons/io"
import { IoBedOutline } from "react-icons/io5"
import { PiBathtubLight } from "react-icons/pi"
import { FaSwimmingPool } from "react-icons/fa"
import { BiArea } from "react-icons/bi"
import ResultsSlider from "./ResultsSlider"
import { MdIosShare } from "react-icons/md"
import DataCountry from "../../data/DataCountry.json"

type Property = {
  property: any
}

export default function PropertyCard({ property }: Property) {
  const router = useRouter()

  // console.log(property)

  const [copiedShowed, setCopiedShowed] = useState(false)

  const market =
    property.mortgageMarket === "Primary" ? "Rynek Pierwotny" : "Rynek Wtórny"

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

  const slug = slugify(property.headerAdvertisement, property.id)
  const region = () => {
    const country = property.country.name.toLowerCase()
    const data = DataCountry!.find((i) => property.country.name.toLowerCase())
    const reg = data!.query.find(
      (i) => i.querySearch === property.foreignLocation
    )
    return reg?.query
  }

  const share = () => {
    navigator.share({
      title: "Zobacz tę nieruchomość!",
      url: `/nieruchomosci/${property.country.name.toLowerCase()}/${slug}`,
    })
  }

  return (
    <div className="flex flex-col bg-gray-500 md:w-[370px] w-[92vw] mb-4 mx-2 rounded-t-md shadow-md overflow-hidden">
      <div className="w-full md:h-[270px] h-[220px] sm:h-[300px] overflow-hidden mx-auto rounded-t-md flex items-center justify-center text-4xl relative">
        <ResultsSlider
          region={region()}
          country={property.country.name}
          images={property.images}
          propertyId={property.id}
          propertyTitle={property.headerAdvertisement}
          market={market}
          deliveryDate={property.vacantFromDate}
          slug={slug}
        />
      </div>
      <div className="flex relative flex-col md:w-full w-full bg-white cursor-pointer text-slate-800">
        <span className="flex justify-center absolute m-1 p-1 rounded-3xl right-0 top-0 cursor-pointer">
          <MdIosShare onClick={share} className="w-[20px] h-[20px]" />
          {/* <div
            className={
              copiedShowed
                ? "flex justify-center items-center p-1 right-1 w-32 absolute h-10 bg-red-700"
                : "hidden"
            }
          >
            <p className="text-xs text-white text-center">Skopionwano link!</p>
          </div> */}
        </span>
        <Link
          href={{
            pathname: `/nieruchomosci/${property.country.name.toLowerCase()}/${slug}`,
          }}
        >
          <div>
            <div className="flex p-2 w-full h-14 lg:h-10 items-center mt-[8px] md-[0px]">
              <IoMdPin className="mr-[2px] w-5 md:block md:w-6 md:h-5 lg:mt-6 lg:w-6 h-24 lg:h-28 text-yellow-600" />
              <p className="md:text-[16px] pl-1 md:pt-6 text-xs p-0 leading-4">
                <span className="text-[16px] font-semibold">
                  {property.foreignLocation}
                </span>
                <br></br> {property.foreignStreet}
              </p>
            </div>
            <div className="w-full md:h-28 lg:leading-6 md:pl-8 md:pt-8 pr-12 leading-auto lg:text-[18px] text-[20px] leading-[24px] md:leading-auto pl-8 py-[1px] font-semibold">
              <p>{property.headerAdvertisement}</p>
              <p className="text-[12px] mt-[10px]">
                nr ref. {property.listingId}
              </p>
            </div>
            <div className="flex items-center justify-between w-full pt-[1px] bg-gray-900/[0.1]">
              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Sypilanie
                </p>
                <div className="flex md:flex-col h-10 lg:flex-row items-center justify-center">
                  <IoBedOutline className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base lg:text:xl md:text-sm pl-0 lg:pl-2">
                    {property.noOfRooms}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Łazienki
                </p>
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <PiBathtubLight className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base lg:text:xl md:text-sm pl-0 lg:pl-2">
                    {property.noOfBathrooms}
                  </div>
                </div>
              </div>
              {/* <div className='flex flex-col items-center justify-center lg:block md:hidden w-2/6 h-16 border-2 bg-white p-1'>
                <p className='w-full text-center text-sm'>Do plazy</p>
              <div className='flex items-center justify-center'>
                <WavesOutlinedIcon
               />
               <p className='font-semibold pl-2'>450 m</p>
               </div>
            </div> */}
              <div className="flex flex-col items-center justify-center w-[24%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Basen
                </p>
                <div className="flex md:flex-col h-10 items-center lg:flex-row justify-center">
                  <FaSwimmingPool className="w-[35px] md:w-5 pr-2 md:pr-0 lg:w-8 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base lg:text:xl md:text-sm pl-0 lg:pl-2">
                    {property.availableNeighborhoodList?.includes("Pool")
                      ? "Tak"
                      : "Nie"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-[25%] bg-white md:p-1 py-2">
                <p className="w-full text-center hidden md:block text-sm">
                  Pow. całk.
                </p>
                <div className="flex items-center h-10 md:flex-col lg:flex-row justify-center relative">
                  <BiArea className="w-[35px] md:w-5 lg:w-8 pr-2 md:pr-0 md:h-6 h-[70px] md:py-0" />
                  <div className="flex items-center font-semibold h-14 text-base lg:text:xl md:text-sm pl-0 lg:pl-2">
                    {property.totalArea}
                    {/* <span className='text-xs absolute -mt-5 ml-8'>2</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white md:h-16 h-12 flex items-center text-darkblue text-2xl px-3 font-semibold border-t-yellow-500 border-t">
              <span className="ml-1 sm:text-xl text-2xl md:text-3xl text-right w-full text-yellow-500">
                {market !== "Rynek Wtórny" && "od"}{" "}
                {property.price.amount.toLocaleString()} €
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
