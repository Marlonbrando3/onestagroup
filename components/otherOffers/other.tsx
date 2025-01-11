import React, { useRef } from "react";
import { IoIosArrowUp } from "react-icons/io";

export default function Other() {
  const moreoffers: any = useRef();
  const moreoffersTXT: any = useRef();
  const moreoffersArrow: any = useRef();

  const handleMoreOffers = () => {
    console.log(moreoffers.current.style.top);
    if (moreoffers.current.style.top !== "20vh") {
      moreoffers.current.style.top = "20vh";
      moreoffersTXT.current.innerHTML = "Zamknij";
      moreoffersArrow.current.style.transform = "rotate(180deg)";
    } else {
      moreoffers.current.style.top = "83vh";
      moreoffersTXT.current.innerHTML = "Pozostałe ofert";
      moreoffersArrow.current.style.transform = "rotate(0deg)";
    }
  };

  return (
    <div
      onClick={handleMoreOffers}
      ref={moreoffers}
      className="absolute top-[83vh] md:top-[94vh] mx-auto left-0 right-0 w-full duration-200"
    >
      <div className="w-[200px] h-[50px] bg-white mx-auto flex items-center justify-center rounded-t-xl">
        <div ref={moreoffersArrow} className="w-[30px] h-[30px]">
          <IoIosArrowUp className="w-[30px] h-[30px]" />
        </div>

        <p ref={moreoffersTXT} className="text-[13px] font-bold ml-[5px]">
          Pozostałe oferty
        </p>
      </div>
      <div className="w-full h-screen bg-white">
        <p className="text-center text-[30px]">TUTAJ BĘDĄ POZOSTAŁE OFERTY TOP 10</p>
      </div>
    </div>
  );
}
