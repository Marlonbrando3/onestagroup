import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Topofferslist from "../choosedoffers/topOffersList/topofferslist";

type Data = {
  handleMoreOffers: any;
  moreoffers: any;
  moreoffersTXT: any;
  moreoffersArrow: any;
};

export default function Other({
  handleMoreOffers,
  moreoffers,
  moreoffersTXT,
  moreoffersArrow,
}: Data) {
  const [slideWidth, setSlideWidth]: any = useState();

  return (
    <div
      onClick={handleMoreOffers}
      ref={moreoffers}
      className="absolute top-[83vh] md:top-[94vh] mx-auto left-0 right-0 w-full cursor-pointer duration-200"
    >
      <div className="w-[250px] h-[50px] mx-auto flex items-center justify-center rounded-t-xl bg-orange-600 text-white duration-200 ">
        <div ref={moreoffersArrow} className="w-[30px] h-[30px]">
          <IoIosArrowUp className="w-[30px] h-[30px]" />
        </div>

        <p ref={moreoffersTXT} className="text-[18px] font-bold ml-[2px]">
          Rekomendowane oferty
        </p>
      </div>
      <div className="w-full h-screen bg-white pt-[30px]">
        <Topofferslist />
      </div>
    </div>
  );
}
