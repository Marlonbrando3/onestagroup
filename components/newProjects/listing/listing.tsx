import React from "react";
import ListItem from "./listItem";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa6";
import { CiSquareMore } from "react-icons/ci";

type Property = {
  investition: any;
};

export default function Listing({ investition }: Property) {
  return (
    <div className="border w-full mx-auto bg-white">
      <p>Lista obiektów</p>
      <div className="flex w-[85vw]">
        <div className="w-[50px] h-[40px] border-gray-800 p-[8px]">
          <FaBed className="w-full h-full" />
        </div>
        <div className="w-[50px] h-[40px] border-gray-800 p-[8px]">
          <FaBath className="w-full h-full" />
        </div>
        <div className="w-[50px] h-[40px] border-gray-800 p-[8px]">
          <CiSquareMore className="w-full h-full" />
        </div>
        <div className="w-[200px] h-[40px] border-gray-800 p-[8px]">PRICE</div>
      </div>
      <ListItem />
    </div>
  );
}
