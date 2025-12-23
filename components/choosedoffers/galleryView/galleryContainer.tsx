import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Properties from "../../../public/properties.json";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Head from "next/head";
import { useRouter } from "next/router";
import { isNull } from "util";

export default function GalleryContainer() {
  const router = useRouter();
  const { offer } = router.query;
  console.log(offer);

  const [indexImage, setIndexImage] = useState(0);

  const miniSlider: any = useRef();
  const miniSlide: any = useRef();

  const choosedProperty = Properties.filter((i: any) => i.listingId === offer)
    .flatMap((i) => i.images)
    .filter((i) => i.isScheme === false && i.description === null);

  console.log(choosedProperty);

  const PropertyImagesArray = choosedProperty;

  const choosedImage = choosedProperty[indexImage].id;

  const [slideWidth, setSlideWidth] = useState({ width: 0 });
  // console.log(slideWidth);

  //slider varables
  const ImagesPerViewMiniSlider = 3;
  const marginPerImage: any = slideWidth;
  const jumpFor = 3 * marginPerImage;
  const propertyImagesLength = PropertyImagesArray.length;
  const marginFullLength = PropertyImagesArray.length * marginPerImage;
  const marginPerView = ImagesPerViewMiniSlider * marginPerImage;

  const [whichSliderSetIsActive, setWhichSliderSetIsActive] = useState(0);

  const [margin, setMargin] = useState(0);

  const handleChoosingImage = (index: any) => {
    setIndexImage(index);
  };

  const PropertyImages = PropertyImagesArray.map((i, index) => (
    <div
      key={index}
      ref={miniSlide}
      onClick={(e) => handleChoosingImage(index)}
      className="md:w-[186px] w-1/3 md:h-[100px] h-[79px] relative flex-none cursor-pointer"
    >
      <Image
        src={`https://img.asariweb.pl/thumbnail/${i.id}`}
        alt="nieruchomosci-w-hiszpanii"
        fill
        objectFit="cover"
        placeholder="blur"
        blurDataURL={`https://img.asariweb.pl/thumbnail/${choosedImage}`}
        className={`${
          i.id === choosedProperty[indexImage].id ? "border-orange-600" : "border-white"
        } border-[3px] hover:border-orange-400 duration-200 rounded-md`}
      />
    </div>
  ));

  // console.log(PropertyImages);

  const handleChangingSlideForward = () => {
    if (margin - marginPerView < marginFullLength !== margin >= marginFullLength - marginPerView) {
      const maringData = margin;
      const newMaring = maringData + jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
    } else {
      miniSlider.current.style.marginLeft = `0px`;
      setMargin(0);
    }
  };

  const handleChangingSlideBack = () => {
    console.log("dziala");
    if (margin !== 0) {
      const maringData = margin;
      const newMaring = maringData - jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
    }
  };

  //check on which site is your image

  const handleChangingSlideForwardMain = () => {
    // console.log(whichSliderSetIsActive);
    if (indexImage < propertyImagesLength - 1) {
      const slider = Math.floor((indexImage + 1) / ImagesPerViewMiniSlider);
      const newMaring = slider * jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
      setIndexImage(indexImage + 1);
    } else {
      setIndexImage(0);
      miniSlider.current.style.marginLeft = `0px`;
      setMargin(0);
      setWhichSliderSetIsActive(0);
    }
  };

  const handleChangingSlideBackMain = () => {
    if (indexImage > 0) {
      const slider = Math.floor((indexImage - 1) / ImagesPerViewMiniSlider);
      const newMaring = slider * jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
      setIndexImage(indexImage - 1);
    }
  };

  // touch BigIamge sliding events
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStartBig = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    console.log("ts");
  };

  const handleTouchEndBig = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 50) {
      handleChangingSlideForwardMain();
    } else {
      handleChangingSlideBackMain();
    }
  };

  // touch slider sliding events
  let touchStartXSlider = 0;
  let touchEndXSlider = 0;

  const handleTouchStartSlider = (e: React.TouchEvent) => {
    touchStartXSlider = e.touches[0].clientX;
  };

  const handleTouchEndSlider = (e: React.TouchEvent) => {
    touchEndXSlider = e.changedTouches[0].clientX;
    console.log("end " + touchEndXSlider);
    console.log("start " + touchStartXSlider);

    if (touchStartXSlider - touchEndXSlider > 50) {
      console.log("fire 1");
      handleChangingSlideForward();
      // console.log(e.changedTouches[0].clientX);
    } else if (touchStartXSlider - touchEndXSlider < -50) {
      handleChangingSlideBack();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    let touchMoveStart = e.touches[0].clientX;
    let calculate = margin;

    if (touchStartXSlider - touchMoveStart > 30) {
      calculate = margin + (touchStartXSlider - touchMoveStart);
      // console.log(TouchMoveActual);
      miniSlider.current.style.marginLeft = `-${calculate}px`;
    } else if (touchStartXSlider - touchMoveStart < -30) {
      calculate = margin + (touchStartXSlider - touchMoveStart);
      // console.log("lower");
      // console.log(touchStartXSlider - TouchMoveActual);
      miniSlider.current.style.marginLeft = `-${calculate}px`;
    }
  };

  useEffect(() => {
    // Funkcja aktualizująca rozmiar okna
    const handleResize = () => {
      setSlideWidth(miniSlide.current.offsetWidth);
      console.log(miniSlide.current.offsetWidth);
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

  if (!router.isReady) {
    return <p>Ładowanie...</p>;
  }

  return (
    <>
      <Head>
        {/* <html lang="en_US" /> */}
        <meta property="Properties in Spain" content="image" />
        <title>Zdobądź oferty nieruchomości</title>
        <meta
          name="Keywords"
          content="Nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, polska agencja nieruchomości w Hiszpanii, nieruchomości Portugalia, nieruchomości w Portugali, apartamenty w Portugalii, polska agencja nieruchomości w Portugalii, nieruchomości na Dominikanie, apartamenty Dominikana, apartamenty na Dominikanie"
        />
        <meta
          name="Description"
          content="Biuro sprzedaży nieruchomości w Hiszpanii, Portugalii, Chorwacji, Dominikanie. Przeprowdzimy Cię przez cały proces zakupowy od przedstawienia ofer poprzez proces zakupowy do finalnego zarządzania najmem jeśli tak zdecydujesz."
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta property="og:image" content="https://onesta.com.pl/onesta_og_img.png" />
        {/* <meta property="og:locale" content="en_US" /> */}
      </Head>
      <div className="md:w-[700px] w-[98vw] md:h-[480px] h-[370px] bg-white rounded-xl overflow-hidden relative">
        {/* <div className="absolute w-[100px] h-[90px] top-20 right-[10px] z-20 slider_move">
          <MdTouchApp className="w-full h-full text-white" />
        </div> */}
        <div className="md:w-[80%] w-[95%] h-[80%] mx-auto relative">
          <div
            onClick={handleChangingSlideBackMain}
            className="h-[100%] w-[50px] absolute -left-[50px] place-content-center grid cursor-pointer"
          >
            <IoIosArrowBack
              onClick={handleChangingSlideBackMain}
              className="w-[50px] h-[50px] cursor-pointer hidden md:block"
            />
          </div>
          <div
            onClick={handleChangingSlideForwardMain}
            className="h-[100%] w-[50px] absolute -right-[50px] place-content-center grid cursor-pointer"
          >
            <IoIosArrowForward
              onClick={handleChangingSlideForwardMain}
              className="w-[50px] h-[50px] cursor-pointer hidden md:block"
            />
          </div>
          <div className="font-bold text-[14px] my-[5px] md:my-[10px]">
            {indexImage + 1} / {propertyImagesLength}
          </div>
          <div
            onTouchStart={handleTouchStartBig}
            onTouchEnd={handleTouchEndBig}
            className="w-[100%] h-[80%] relative mb-[5px]"
          >
            <Image
              src={`https://img.asariweb.pl/normal/${choosedImage}`}
              fill
              objectFit="cover"
              alt="nieruchomosci-w-hiszpanii"
              className="rounded-md slider_move"
              placeholder="blur"
              blurDataURL={`https://img.asariweb.pl/normal/${choosedImage}`}
            />
          </div>
          {/* //slider mini */}
          <div className="w-full md:h-[30%] h-[28%] flex relative">
            <div
              onClick={handleChangingSlideBack}
              className={`${
                margin === 0 && "text-gray-200"
              } md:h-[100%] h-[50%] w-[40px] md:w-[50px] bg-white md:-left-[50px] -left-[5px] md:-top-[10px] place-content-center grid cursor-pointer absolute top-0 bottom-0 my-auto shadow-[0_0px_10px_0_rgba(0,0,0,0.3)] rounded-xl md:shadow-[0px]`}
            >
              <IoIosArrowBack
                onClick={handleChangingSlideBack}
                className="w-[30px] h-[30px] cursor-pointer "
              />
            </div>
            <div className="md:w-full w-[90%] overflow-hidden mx-auto">
              <div
                onTouchStart={handleTouchStartSlider}
                onTouchEnd={handleTouchEndSlider}
                onTouchMove={handleTouchMove}
                ref={miniSlider}
                className="w-full flex duration-200"
              >
                {PropertyImages}
              </div>
            </div>
            <div
              onClick={handleChangingSlideForward}
              className="md:h-[100%] h-[50%] w-[40px] md:w-[50px] absolute md:-right-[50px] -right-[5px] md:-top-[10px] place-content-center grid cursor-pointer bg-white top-0 bottom-0 my-auto shadow-[0_0px_10px_0_rgba(0,0,0,0.3)] rounded-xl md:shadow-[0px] "
            >
              <IoIosArrowForward
                onClick={handleChangingSlideForward}
                className="w-[30px] h-[30px] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
