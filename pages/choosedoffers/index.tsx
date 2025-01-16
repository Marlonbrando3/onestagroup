import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/choosedoffers/header";
import Menu from "@/components/choosedoffers/menu";
import GalleryContainer from "@/components/choosedoffers/galleryView/galleryContainer";
import ViewsContainer from "@/components/choosedoffers/viewsContainer";

export default function Index() {
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
    <div className="h-[89vh] md:h-screen bg-[url('/bg_calp.jpg')] bg-cover bg-center relative overflow-hidden">
      <Header handleMoreOffers={handleMoreOffers} />
      <Menu />
      <ViewsContainer
        handleMoreOffers={handleMoreOffers}
        moreoffers={moreoffers}
        moreoffersTXT={moreoffersTXT}
        moreoffersArrow={moreoffersArrow}
      />
    </div>
  );
}
