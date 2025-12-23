import React, { useRef, useState } from "react";
import Image from "next/image";
import OurJobs from "./ourJobs";
import OurJobTXT from "@/data/OurJob.json";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function HowWeWork() {
  const aboutUsSlider: any = useRef();

  const [margin, setMargin] = useState(0);

  const handleMovingSliderForward = () => {
    const Length = OurJobTXT.length;

    console.log(margin);
    const actualMargin = margin - 350;
    if (margin > 350 * (Length - 1) * -1) {
      aboutUsSlider.current.style.marginLeft = `${actualMargin}px`;
      setMargin(margin - 350);
    }
  };
  const handleMovingSliderBack = () => {
    console.log(margin);
    const actualMargin = margin + 350;
    if (margin < 0) {
      aboutUsSlider.current.style.marginLeft = `${actualMargin}px`;
      setMargin(margin + 350);
    }
  };

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} lg:w-full w-[90vw] rounded-b-[20px] lg:h-[450px] h-[670px] bg-cover bg-center bg-[url("/palmyBGform.png")] mx-auto relative`}
    >
      <div className="absolute w-full h-full bg-slate-600/[.5]"></div>
      <div className=" h-[80%] w-[1000px] mx-auto flex z-20">
        {/* left side */}
        <div className="flex w-[300px] relative">
          {/* <div className="absolute bottom-[35px] w-full h-[100px] bg-gradient-to-t from-gray-900 to-transparent rounded-b-[5px] z-20"></div> */}
          <div className=" absolute lg:static md:w-full lg:h-[80%] w-[80%] h-[120px] my-auto mr-[20px] flex justify-end flex-col lg:rounded-l-[10px] top-1 left-1 bg-[url('/howWeWork.png')] bg-cover bg-bottom">
            <p className="text-[25px] px-[20px] text-white leading-[35px] mb-[10px]">
              <span className="bg-orange-500">
                &nbsp;Jak działamy z&nbsp; &nbsp;naszymi klientami?&nbsp;
              </span>
            </p>
            {/* <Image
              src="/arrowlong.png"
              alt="arrow"
              width={200}
              height={50}
              className="px-[20px] mt-[20px] invert brightness-200"
            ></Image> */}
          </div>
        </div>
        <div className="flex lg:w-[700px] w-full h-[100%] items-center relative overflow-hidden -ml-[300px] mt-[50px] lg:ml-auto lg:mt-auto">
          <div
            ref={aboutUsSlider}
            className="absolute border-yellow-500 lg:h-[100%] h-[380px] w-auto flex items-center justify-evenly flex-nowrap duration-300"
          >
            {OurJobTXT.map((i) => (
              <OurJobs key={i.title} cont={i} />
            ))}
          </div>
        </div>
      </div>
      {/* <div className='text-white text-5xl pl-20 mt-16'>{ActualCountry}</div> */}
      <div className="lg:w-[1000px] w-[90%] h-[80px] mx-auto flex justify-center">
        <div className="w-[230px] h-full md:float-right flex justify-evenly">
          <div
            className={`${
              margin === 0 && "bg-white/[0.2] border-white/[0.2] hover:bg-white/[0.2]"
            }  flex items-center justify-center cursor-pointer hover:bg-white/[0.5] duration-150 relative w-[80px] h-[80px] `}
          >
            <div
              className="absolute z-50 w-[80px] h-[80px] border"
              onClick={handleMovingSliderBack}
            >
              <IoIosArrowBack className="h-full w-full text-white p-[14px]" />
            </div>
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:bg-white/[0.5] duration-150 w-[80px] h-[80px]">
            <div
              className="absolute z-50 w-[80px] h-[80px] border"
              onClick={handleMovingSliderForward}
            ></div>
            <IoIosArrowForward className="h-full w-full text-white p-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
