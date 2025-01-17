import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Topofferslist from "../choosedoffers/topOffersList/topofferslist";

type Data = {
  handleMoreOffers: any;
  moreOffersRef: any;
  moreoffersTXT: any;
  moreoffersArrow: any;
};

export default function Buttons({
  handleMoreOffers,
  moreOffersRef,
  moreoffersTXT,
  moreoffersArrow,
}: Data) {
  const [slideWidth, setSlideWidth]: any = useState();

  return (
    <div
      onClick={() => handleMoreOffers("moreOffers")}
      ref={moreOffersRef}
      className="absolute top-[0vh] left-0 w-full cursor-pointer duration-200 z-20"
    >
      <div className="md:w-[700px] w-[49%] h-[50px] mx-auto  text-white duration-200 flex justify-evenly">
        <div className="md:w-[340px] flex items-center justify-center bg-orange-600 rounded-t-xl ">
          <div ref={moreoffersArrow} className="w-[30px] h-[30px]">
            <IoIosArrowUp className="w-[30px] h-[30px]" />
          </div>
          <p
            ref={moreoffersTXT}
            className="text-[18px] font-semibold ml-[2px] text-center leading-[20px] "
          >
            Rekomendowane oferty
          </p>
        </div>

        <div className="md:w-[340px] w-[49%] h-[50px] flex items-center justify-center rounded-t-xl bg-blue-600 text-white duration-200 ">
          <div ref={moreoffersArrow} className="w-[30px] h-[30px]">
            <IoIosArrowUp className="w-[30px] h-[30px]" />
          </div>
          <p
            ref={moreoffersTXT}
            className="text-[18px] font-semibold ml-[2px] text-center leading-[20px] "
          >
            Jestem zainteresowany
          </p>
        </div>
      </div>

      <div className="w-screen h-screen bg-white pt-[30px]">
        <Topofferslist />
      </div>
    </div>
  );
}
