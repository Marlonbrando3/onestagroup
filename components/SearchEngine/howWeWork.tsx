import React, { useRef, useState } from "react";
import Image from "next/image";
import OurJob from "./ourJob";
import OurJobTXT from "@/data/OurJob.json";

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
    <div className='lg:w-full w-[90vw] rounded-b-[50px] lg:h-[450px] h-[670px] bg-cover bg-center bg-[url("/palmyBGform.jpeg")] mx-auto'>
      <div className=" h-[80%] w-[1000px] mx-auto flex">
        {/* left side */}
        <div className="flex w-[300px] relative">
          <div className="absolute lg:static bg-white md:w-full lg:h-[80%] w-[80%] h-[120px] my-auto mr-[20px] flex justify-center flex-col lg:rounded-l-2xl top-1 left-1">
            <p className="text-[25px] px-[20px] leading-6">Jak działamy z naszymi klientami?</p>
            <Image
              src="/arrowlong.png"
              alt="arrow"
              width={200}
              height={50}
              className="px-[20px] mt-[20px]"
            ></Image>
          </div>
        </div>
        <div className="flex lg:w-[700px] w-full h-[100%] items-center relative overflow-hidden -ml-[300px] mt-[50px] lg:ml-auto lg:mt-auto">
          <div
            ref={aboutUsSlider}
            className="absolute border-yellow-500 lg:h-[100%] h-[380px] w-auto flex items-center justify-evenly flex-nowrap duration-300"
          >
            {OurJobTXT.map((i) => (
              <OurJob key={i.title} cont={i} />
            ))}
          </div>
        </div>
      </div>
      {/* <div className='text-white text-5xl pl-20 mt-16'>{ActualCountry}</div> */}
      <div className="lg:w-[1000px] w-[90%] h-[80px] mx-auto flex justify-center">
        <div className="w-[200px] h-full md:float-right flex justify-evenly">
          <div
            className={`${
              margin === 0 && "bg-white/[0.2] border-white/[0.2] hover:bg-white/[0.2]"
            } border-2 flex items-center justify-center cursor-pointer hover:bg-white/[0.5] duration-150`}
            onClick={handleMovingSliderBack}
          >
            <IoIosArrowBack
              className="h-full w-full text-white p-[14px]"
              onClick={handleMovingSliderBack}
            />
          </div>
          <div
            className="border-2 flex items-center justify-center cursor-pointer hover:bg-white/[0.5] duration-150"
            onClick={handleMovingSliderForward}
          >
            <IoIosArrowForward
              className="h-full w-full text-white p-[14px]"
              onClick={handleMovingSliderForward}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
