import React from "react";
import { LuWaves } from "react-icons/lu";
import { FaSwimmingPool } from "react-icons/fa";
import { RiParkingBoxFill } from "react-icons/ri";
import { GiThreeLeaves } from "react-icons/gi";
import { MdOutlineStreetview } from "react-icons/md";

export default function Features() {
  return (
    <div className="flex rounded-md w-full bg-white my-[10px] mx-auto lg:py-4 lg:px-9 p-7 flex-wrap lg:w-10/12 ">
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <FaSwimmingPool /> <p className="pl-2 text-xl">Basen</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <RiParkingBoxFill /> <p className="pl-2 text-xl">Parking</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <GiThreeLeaves /> <p className="pl-2 text-xl">Ogród</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <MdOutlineStreetview /> <p className="pl-2 text-xl">Taras</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <LuWaves /> <p className="pl-2 text-xl">Blisko morza</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <MdOutlineStreetview /> <p className="pl-2 text-xl">Widok na morze</p>
      </span>
      <span className="flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1">
        <FaSwimmingPool /> <p className="pl-2 text-xl">Balkon</p>
      </span>
    </div>
  );
}
