import React from "react";
import {
  Red_Hat_DisplayFont,
  MontserratSans,
  GwendolynSans,
} from "../fonts/fonts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import Image from "next/image";

export default function HomeViewAlt() {
  return (
    <div className="w-screen md:h-screen h-auto flex bg-[url('/coast_2.svg')] bg-cover ">
      <div className=" md:w-[50%] w-[98vw] mx-auto">
        <div className="md:mt-[100px] mt-[70px]">
          <p className="md:pl-[40px] md:mr-[50px] ml-[10px] text-[34px] md:leading-[34px] leading-[24px] mb-[30px]">
            {/* <span className="font-bold">Onesta Group</span> */}
            <br></br>
            <span
              className={`${MontserratSans.className} text-[20px] md:text-[32px] bg-[#E9B75F] text-white font-[500]`}
            >
              &nbsp;Luksusowe &nbsp; <br></br>&nbsp;nieruchomości w ciepłych
              krajach &nbsp;
            </span>{" "}
            <br></br>
            <br></br>
            <p
              className={`${MontserratSans.className} text-[18px] md:text-[28px] leading-[20px] md:leading-[28px] text-[#275278] font-[400]`}
            >
              Poszukujesz{" "}
              <span className="font-[800]">bezpiecznego i mądrego</span>{" "}
              <br></br>proces poszukiwań i zakupu?
            </p>
          </p>
          <p
            className={`${MontserratSans.className} md:pl-[40px] md:mr-[50px] ml-[10px] text-[14px]`}
          >
            Właśnie w tym celu powstała Onesta Group. <br></br>
            Rozumiejąc rynek oraz jego zawiłości dostrzegamy, że przyszli
            nabywcy nieruchomości poszukują kogoś kto będzie dla Nich oparciem
            na każdym etapie procesu zakupu nie tylko przy sprzedaży. Dzięki
            doskonałej komunikacji i naszym metodom jesteśmy obecni w całym
            prociesie zapewniając Jego bezpieczeństwo i bezbolesność.
          </p>{" "}
          <br></br>
          {/* <p
            className={`${BonheurRoyaleFont.className} w-[80%] mx-auto text-[50px] text-[#2C2B5D] font-bold text-left`}
          >
            Zapraszamy do współpracy!
          </p> */}
          <div
            className={`${Red_Hat_DisplayFont.className} font-bold md:h-[50px] w-[80%] md:pl-[45px] mx-auto md:mx-0`}
          >
            <div className="w-auto h-auto border-gray-900 flex">
              <div className="h-[100px] w-[100px] mr-[15px] relative rounded-md overflow-hidden">
                {" "}
                <Image
                  src="/Marek.png"
                  fill
                  objectFit="cover"
                  objectPosition="top"
                  alt="onesta_Marek"
                ></Image>
              </div>

              <div className="h-[100px] w-[100px] mr-[15px] relative rounded-md overflow-hidden">
                <Image
                  src="/Karolina.png"
                  fill
                  objectFit="cover"
                  objectPosition="top"
                  alt="onesta_Karolina"
                ></Image>
              </div>
              <div className="shadow-md h-[100px] w-[100px] ">
                <div className="h-[100px] w-[100px] mr-[15px] relative rounded-md overflow-hidden">
                  {" "}
                  <Image
                    src="/Przemek.png"
                    fill
                    objectFit="cover"
                    objectPosition="top"
                    alt="onesta_Przemek"
                  ></Image>
                </div>
              </div>
            </div>
            <div className="hidden md:block cursor-pointer border-[#275278] text-[18px] font-[400] mt-[60px] text-left w-[280px] py-[1px] hover:bg-[#E9B75F] duration-200 leading-[20px] relative">
              Przewijaj stronę dalej <br></br> aby dowiedzieć się więcej
              <div className="scroll-downs text-black">
                <div className="mousey">
                  <div className="scroller"></div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className="md:w-[50%] hidden md:block mt-[130px]">
        {/* <div className="cursor-pointer border border-gray-900 w-[300px] text-center text-[26px] float-end mr-[10%] flex items-center justify-center mt-[40px] -mb-[40px]">
          <p>Przeglądaj oferty</p>{" "}
          <MdOutlineKeyboardArrowRight className="ml-[2px] text-[1.5em]" />
        </div> */}
        <div className="top-0 relative">
          {/* <div className="absolute bottom-0">
            <span className="bg-white text-[26px]">Luksusowe</span> <br></br>
            <span className="bg-white text-[26px]">nieruchomości</span>
            <br></br>
            <span className="bg-white text-[26px]">
              Hiszpania, Cypr, Dominikana, Dubaj
            </span>
          </div> */}
          <video
            //   onLoad={handleShowingVideo}
            width="90%"
            height="110%"
            src="/Timeline2.mp4"
            title="YouTube video player"
            frameborder="0"
            autoPlay
            muted
            loop
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            className="w-[90%] lg:h-[560px] h-[800px] clear-both object-cover rounded-[10px] border"
          ></video>{" "}
        </div>
      </div>
    </div>
  );
}
