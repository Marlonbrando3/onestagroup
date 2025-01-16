import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Topofferslist from "../choosedoffers/topOffersList/topofferslist";

export default function Other() {
  const moreoffers: any = useRef();
  const moreoffersTXT: any = useRef();
  const moreoffersArrow: any = useRef();

  const [slideWidth, setSlideWidth]: any = useState();

  const handleMoreOffers = () => {
    // console.log(moreoffers.current.style.top);
    if (moreoffers.current.style.top === "20vh" && slideWidth > 600) {
      moreoffers.current.style.top = "94vh";
      moreoffersTXT.current.innerHTML = "Pozostałe oferty";
      moreoffersArrow.current.style.transform = "rotate(0deg)";
    } else if (moreoffers.current.style.top === "20vh" && slideWidth < 600) {
      moreoffers.current.style.top = "83vh";
      moreoffersTXT.current.innerHTML = "Pozostałe oferty";
      moreoffersArrow.current.style.transform = "rotate(0deg)";
    } else {
      moreoffers.current.style.top = "20vh";
      moreoffersTXT.current.innerHTML = "Zamknij";
      moreoffersArrow.current.style.transform = "rotate(180deg)";
    }
  };

  useEffect(() => {
    // Funkcja aktualizująca rozmiar okna
    const handleResize = () => {
      setSlideWidth(window.innerWidth);
      console.log(window.innerWidth);
    };

    // Nasłuchuj zmiany rozdzielczości
    window.addEventListener("resize", handleResize);

    // Ustaw początkowy rozmiar
    handleResize();

    // Czyszczenie nasłuchiwania
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      onClick={handleMoreOffers}
      ref={moreoffers}
      className="absolute top-[83vh] md:top-[94vh] mx-auto left-0 right-0 w-full cursor-pointer duration-200"
    >
      <div className="w-[250px] h-[50px] bg-white mx-auto flex items-center justify-center rounded-t-xl hover:bg-yellow-500 hover:text-white duration-200 border">
        <div ref={moreoffersArrow} className="w-[30px] h-[30px]">
          <IoIosArrowUp className="w-[30px] h-[30px]" />
        </div>

        <p ref={moreoffersTXT} className="text-[18px] font-bold ml-[2px]">
          Pozostałe oferty
        </p>
      </div>
      <div className="w-full h-screen bg-white pt-[30px]">
        <Topofferslist />
      </div>
    </div>
  );
}
