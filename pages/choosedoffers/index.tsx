import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/choosedoffers/header";
import Menu from "@/components/choosedoffers/menu";
import GalleryContainer from "@/components/choosedoffers/galleryView/galleryContainer";
import ViewsContainer from "@/components/choosedoffers/viewsContainer";

export default function Index() {
  const showPopUp: any = useRef(null);

  const [slideWidth, setSlideWidth]: any = useState();

  const handlePopUpOpen = (event: any) => {
    console.log(event);
    showPopUp.current.classList.remove("top-[10vh]", "md:top-[10vh]");
    showPopUp.current.classList.add("-top-[65vh]", "md:-top-[80vh]");
  };

  const handlePopUpClosing = (event: any) => {
    console.log(event);
    showPopUp.current.classList.remove("-top-[65vh]", "md:-top-[80vh]");
    showPopUp.current.classList.add("top-[10vh]", "md:top-[10vh]");
  };

  // useEffect(() => {
  //   // Funkcja aktualizująca rozmiar okna
  //   const handleResize = () => {
  //     setSlideWidth(window.innerWidth);
  //     console.log(window.innerWidth);
  //   };

  //   // Nasłuchuj zmiany rozdzielczości
  //   window.addEventListener("resize", handleResize);

  //   // Ustaw początkowy rozmiar
  //   handleResize();

  //   // Czyszczenie nasłuchiwania
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <div className="h-[89vh] md:h-screen bg-[url('/bg_calp.jpg')] bg-cover bg-center relative overflow-hidden">
      <Header handlePopUpOpen={handlePopUpOpen} />
      <Menu />
      <ViewsContainer
        handlePopUpOpen={handlePopUpOpen}
        handlePopUpClosing={handlePopUpClosing}
        showPopUp={showPopUp}
      />
    </div>
  );
}
