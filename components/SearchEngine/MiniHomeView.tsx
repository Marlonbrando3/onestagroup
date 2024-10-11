import React, { useRef, useState } from "react";
import Image from "next/image";
import OurJobs from "./ourJobs";
import OurJobTXT from "@/data/OurJob.json";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function MiniHomeView() {
  return (
    <div className='lg:w-full w-[90vw] lg:h-[200px] h-[140px] bg-cover bg-center bg-[url("/bg_mini.png")] mx-auto '></div>
  );
}
