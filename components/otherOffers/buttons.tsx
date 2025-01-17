import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Topofferslist from "../choosedoffers/topOffersList/topofferslist";
import FormPoUpIntrested from "../choosedoffers/formIntrested/formPopUpIntreseted";

type Data = {
  handlePopUpOpen: any;
  handlePopUpClosing: any;
  showPopUp: any;
};

export default function Buttons({
  handlePopUpOpen,
  handlePopUpClosing,
  showPopUp,
}: // moreOffersRef,
// moreoffersTXT,
// moreoffersArrow,
Data) {
  const [optionButton, setOptionButton]: any = useState();

  return (
    <div className="absolute top-[0vh] left-0 w-full cursor-pointer duration-200 z-20">
      <div className="md:w-[700px] w-full h-[50px] mx-auto  text-white duration-200 flex justify-evenly">
        <div
          onClick={() => {
            handlePopUpOpen("moreOffers");
            setOptionButton(1);
          }}
          className="md:w-[340px] flex items-center justify-center bg-orange-600 rounded-t-xl "
        >
          <div className="w-[30px] h-[30px]">
            <IoIosArrowUp className="w-[30px] h-[30px]" />
          </div>
          <p className="text-[18px] font-semibold ml-[2px] text-center leading-[20px] ">
            Rekomendowane oferty
          </p>
        </div>
        <div
          onClick={() => {
            handlePopUpOpen("intrested");
            setOptionButton(2);
          }}
          className="md:w-[340px] w-[49%] h-[50px] flex items-center justify-center rounded-t-xl bg-blue-600 text-white duration-200 "
        >
          <p className="text-[18px] font-semibold ml-[2px] text-center leading-[20px] ">
            Jestem zainteresowany
          </p>
        </div>
      </div>
      <div ref={showPopUp} className="absolute w-screen h-screen bg-white pt-[80px] duration-200">
        <p
          onClick={handlePopUpClosing}
          className="absolute rounded-md px-[15px] py-[4px] top-5 right-5 bg-red-500 text-white"
        >
          Zamknij
        </p>
        {optionButton === 1 && <Topofferslist />}
        {optionButton === 2 && <FormPoUpIntrested />}
      </div>
    </div>
  );
}
