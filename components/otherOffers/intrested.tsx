import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Topofferslist from "../choosedoffers/topOffersList/topofferslist";

type Data = {
  handlePopUpClosing: any;
  handleMoreOffers: any;
  imIntresetedRef: any;
};

export default function Intrested({ handleMoreOffers, imIntresetedRef, handlePopUpClosing }: Data) {
  const [slideWidth, setSlideWidth]: any = useState();

  return (
    <div
      onClick={() => handleMoreOffers("imIntreseted")}
      ref={imIntresetedRef}
      className="absolute w-full top-[0vh] md:top-[0vh] cursor-pointer duration-200 "
    >
      <div className="md:w-[700px] w-full h-[50px]  mx-auto border">
        <div className="md:w-[300px] w-[49%] h-[50px] py-[10px] flex items-center justify-center rounded-t-xl bg-blue-600 text-white duration-200 float-right">
          <p className="text-[18px] font-semibold ml-[2px] text-center leading-[20px]">
            Jestem zainteresowany
          </p>
        </div>{" "}
      </div>
      <div className="w-screen h-screen bg-white pt-[30px] ">
        <Topofferslist handlePopUpClosing={handlePopUpClosing} />
      </div>
    </div>
  );
}
