import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaLessThanEqual } from "react-icons/fa";
import HomeViewClaim from "./HomeViewClaim";
import {
  BonheurRoyaleFont,
  Red_Hat_DisplayFont,
  GreatVibes,
  MontserratSans,
  PoppinsSans,
} from "../fonts/fonts";

function HomeView() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleShowingVideo = () => {
    setIsVideoLoaded(true);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Sprawdzenie, czy urządzenie to mobile
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  console.log(isMobile, isVideoLoaded);

  return (
    <div className="relative lg:h-auto md:w-screen h-auto disable overflow-hidden mx-auto">
      <div
        className={`${MontserratSans.className} absolute w-[100vw] h-auto text-center lg:top-[390px] md:top-[28vh] top-[20vh] px-[5px] md:text-[50px] text-[40px] font-[300] text-white z-40`}
      >
        <div className="lg:w-[700px] md:w-[700px] mx-auto px-auto leading-[50px] block text-left">
          Luksusowe
          <span className="font-bold ">
            <br></br>nieruchomości<br></br>
          </span>{" "}
          w ciepłych krajach
        </div>
      </div>
      {/* <div className="bottom-0 absolute w-screen h-[150px] bg-gradient-to-b from-transparent from-10% via-[#fcf7f4] via-50% to-[#fcf7f4] to-100% overflow-hidden"></div> */}
      {/* <div className="md:h-full h-[100vh] lg:w-full w-screen mx-auto duration-500 sm:-mt-10 bg-cover md:hidden visibile">
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div> */}
      <div className="w-[180vw] h-[820px] bg-green-900/[0.2] z-20 absolute"></div>
      {/* {isMobile === false && ( */}
      <>
        {isVideoLoaded === true ||
          (false && (
            <div className="w-screen h-screen -mt-[100px] bg-red-900">
              <Image
                src="/bg_blog_main.png"
                className="w-[100%] h-[100%]"
                width="1500"
                height="845"
                objectFit="contain"
              ></Image>
            </div>
          ))}
        <video
          onLoad={handleShowingVideo}
          width="100%"
          height="110%"
          src="/Timeline2.mp4"
          // src="https://www.youtube.com/embed/QSKrrqmxpaw?si=g_hflB_vSSZLszs5&autoplay=1&mute=1&showinfo=0&controls=0&vq=hd1080&loop=1&playlist=QSKrrqmxpaw"
          title="YouTube video player"
          autoPlay
          muted
          loop
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          className=" -mt-[100px] hidden md:block w-screen lg:h-[1000px] h-[800px]"
        ></video>
      </>
      {/* )} */}
      {/* </div> */}
      {/* <div className="w-[70px] h-[70px] z-50 absolute bottom-32 left-0 right-0 mx-auto md:hidden visible">
        <IoIosArrowDropdownCircle className="text-orange-400 w-full h-full" />
      </div> */}
      {/* <IoIosArrowDropdownCircle /> */}
    </div>
  );
}
export default HomeView;
