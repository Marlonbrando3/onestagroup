import { IoIosArrowDropdownCircle } from "react-icons/io"
import { useState, useEffect } from "react"
import Image from "next/image"
import { FaLessThanEqual } from "react-icons/fa"
import {
  BonheurRoyaleFont,
  Red_Hat_DisplayFont,
  GreatVibes,
} from "../fonts/fonts"

function HomeView() {
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const handleShowingVideo = () => {
    // setIsVideoLoaded(true);
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // Sprawdzenie, czy urządzenie to mobile
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  console.log(isMobile, isVideoLoaded)

  return (
    <div className="relative lg:h-screen md:w-[1500px] h-screen disable overflow-hidden mx-auto">
      <div
        className={`${GreatVibes.className} absolute w-[100vw] h-screen text-center top-[22vh] text-[80px] font-[600] text-slate-800`}
      >
        <div className="w-full mx-auto leading-[70px] hidden lg:block">
          Znajdź swój{" "}
          <span className="font-bold text-orange-600">nowy dom</span> lub{" "}
          <span className="font-bold text-orange-600">
            <br></br>wyjątkową inwestycję
          </span>{" "}
          w ciepłych krajach
        </div>
      </div>
      <div className="bottom-0 absolute w-screen h-[25px] bg-gradient-to-b from-transparent from-10% via-[#fcf7f4] via-50% to-[#fcf7f4] to-100% overflow-hidden"></div>
      <div className='md:h-full h-[100vh] lg:w-full w-screen mx-auto duration-500 sm:-mt-10 bg-cover bg-top bg-[url("/bg_main_site.png")] md:hidden visibile'>
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div>
      {/* <div className="w-[180vw] md:w-screen md:h-screen bg-transparent z-20 absolute"></div> */}
      {isMobile === false && (
        <>
          {isVideoLoaded === false && (
            <div className="w-full h-auto -mt-[100px]">
              <Image
                src="/bg_main_site_m.png"
                className="w-[100%] h-[845px]"
                width="1500"
                height="845"
                objectFit="contain"
              ></Image>
            </div>
          )}
          {/* <iframe
            onLoad={handleShowingVideo}
            width="100%"
            height="845"
            src="https://www.youtube.com/embed/QSKrrqmxpaw?si=g_hflB_vSSZLszs5&autoplay=1&mute=1&showinfo=0&controls=0&vq=hd1080&loop=1&playlist=QSKrrqmxpaw"
            title="YouTube video player"
            frameborder="0"
            autoplay
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            className="-mt-[100px] hidden md:block"
          ></iframe> */}
        </>
      )}
      {/* </div> */}
      {/* <div className="w-[70px] h-[70px] z-50 absolute bottom-32 left-0 right-0 mx-auto md:hidden visible">
        <IoIosArrowDropdownCircle className="text-orange-400 w-full h-full" />
      </div> */}
      {/* <IoIosArrowDropdownCircle /> */}
    </div>
  )
}
export default HomeView
