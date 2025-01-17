import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/choosedoffers/header";
import Menu from "@/components/choosedoffers/menu";
import GalleryContainer from "@/components/choosedoffers/galleryView/galleryContainer";
import ViewsContainer from "@/components/choosedoffers/viewsContainer";

export default function Index() {
  const moreOffersRef: any = useRef(null);
  const imIntresetedRef: any = useRef(null);

  const refs: any = {
    moreOffers: moreOffersRef,
    imIntreseted: imIntresetedRef,
  };

  const moreoffersTXT: any = useRef();
  const moreoffersArrow: any = useRef();

  const [slideWidth, setSlideWidth]: any = useState();

  const handleMoreOffers = (event: any) => {
    console.log(event);
    if (
      (refs[event].current.style.top === "0vh" || refs[event].current.style.top === "") &&
      slideWidth > 600
    ) {
      console.log("1");
      refs[event].current.style.top = "-60vh";
      moreoffersTXT.current.innerHTML = "Pozostałe oferty";
      moreoffersArrow.current.style.transform = "rotate(0deg)";
    } else if (
      (refs[event].current.style.top === "0vh" || refs[event].current.style.top === "") &&
      slideWidth < 600
    ) {
      console.log("2");
      refs[event].current.style.top = "-60vh";
      moreoffersTXT.current.innerHTML = "Zamknij";
      moreoffersArrow.current.style.transform = "rotate(0deg)";
    } else {
      refs[event].current.style.top = "0vh";
      moreoffersTXT.current.innerHTML = "Rekomendowane oferty";
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
        moreOffersRef={moreOffersRef}
        imIntresetedRef={imIntresetedRef}
        moreoffersTXT={moreoffersTXT}
        moreoffersArrow={moreoffersArrow}
      />
    </div>
  );
}
