import React, { useRef, useState } from "react";
import Image from "next/image";
import OurJob from "./OurJob";
import OurJobTXT from "@/data/OurJob.json";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function MiniHomeView() {
  return (
    <div className='lg:w-full w-[90vw] rounded-b-[50px] lg:h-[200px] h-[670px] bg-cover bg-center bg-[url("/palmyBGform.jpeg")] mx-auto'></div>
  );
}
