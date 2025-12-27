import Image from "next/image";
import { useCallback, useRef } from "react";
import Head from "next/head";
import HeaderOffer from "../../../../components/HeaderOffer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import MiniHomeViewOffer from "../../../../components/SearchEngine/MiniHomeViewOffer";
import ImagesInPropetyCard from "@/components/ImagesInPropetyCard";
import { useState, useEffect } from "react";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import Descryption from "../../../../components/Descryption";
import Properties from "../../../../public/properties.json";
import Footer from "@/components/Footer";
import { TenorsSans } from "../../../../fonts/fonts";
import { CiParking1 } from "react-icons/ci";
import Form from "@/components/SearchEngine/IntresetedPopUp/form";
import { IoClose } from "react-icons/io5";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Loan from "@/components/loanCalc/loan";
import Link from "next/link";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function Property() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [PropertyImages, setPropertyImages] = useState<any[]>([]);

  const moreInfoLink = useRef<any>();
  const headerTitle = useRef<any>();
  const priceTitle = useRef<any>();
  const buttonLeft = useRef<any>();
  const buttonRight = useRef<any>();
  const photosContainer = useRef<any>();
  const photosContainerMain = useRef<any>();
  const photosRow = useRef<any>();
  const intrestedPopUp: any = useRef();

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const [actualImage, setActualImage] = useState(1);
  const [searchShow, setSearchShow] = useState(true);
  const [images, setImages] = useState<any[]>();

  let showedImage: any | undefined;
  const { title } = router.query;
  const RawTitle = Array.isArray(title) ? title[0] : title;
  const id = RawTitle?.split("-").pop();

  console.log(id);

  if (images !== undefined) {
    images?.filter((img) => {
      if (img.showed === true) {
        showedImage = img.image.replace("thumbnail", "normal");
      }
    });
  }

  useEffect(() => {
    // console.log(router);
    if (router.isReady === true) {
      const QueryId = parseInt(id as string);
      const propertyDataTemp = Properties.filter((i: any) => i.id === QueryId);

      const PropertyImages = propertyDataTemp[0]?.images.filter(
        (i: any) =>
          (i.id && i.isScheme === false && i.description === null) ||
          i.description === "strona"
      );

      //delete secheme from images

      setPropertyData(propertyDataTemp);
      setPropertyImages(PropertyImages);

      const imagesTemp = PropertyImages?.map((image: any, index: any) => {
        if (index === 0) {
          return {
            id: index + 1,
            image: `https://img.asariweb.pl/normal/${image.id}`,
            count: 1,
            showed: true,
          };
        } else
          return {
            id: index + 1,
            image: `https://img.asariweb.pl/normal/${image.id}`,
            count: 0,
            showed: false,
          };
      });

      setImages(imagesTemp);
      // console.log(imagesTemp);
    }
  }, [searchParams]);

  const [handleMarginSlider, setHandleMarginSlider] = useState(false);
  const [margin, setMargin] = useState(0);

  const handleChangeSlideLeft = () => {
    const photosCM = photosContainerMain.current.offsetWidth;
    const photosC = photosContainer.current.offsetWidth;
    const photosR = photosRow.current.offsetWidth;

    let multipler = 0;

    if (window.outerWidth > 780) {
      multipler = 2;
    } else {
      multipler = 1;
    }

    if (images !== undefined) {
      let oneImageLength = photosR / images.length;
      let cutedImage = photosCM / oneImageLength;

      let marginWork = 0;

      if (photosC - photosCM < oneImageLength * multipler) {
        marginWork = 0;
      }

      if (photosC - photosCM >= oneImageLength * multipler) {
        marginWork = margin - oneImageLength * multipler;
      }

      if (photosC === photosCM) {
        marginWork = photosR - photosCM;
      }

      if (photosC - photosR === 0) {
        marginWork =
          margin -
          (oneImageLength -
            oneImageLength * (cutedImage - Math.floor(cutedImage)));
      }

      console.log(photosR - photosC);

      photosContainer.current.style.marginLeft = `-${marginWork.toString()}px`;
      console.log(`-${margin.toString()}`);

      setTimeout(() => {
        setMargin(marginWork);
      }, 400);
    }
  };

  const handleChangeSlideRight = () => {
    // setHandleMarginSlider('true')

    const photosCM = photosContainerMain.current.offsetWidth;
    const photosC = photosContainer.current.offsetWidth;
    const photosR = photosRow.current.offsetWidth;

    if (images !== undefined) {
      let oneImageLength = photosR / images.length;
      let cutedImage = photosCM / oneImageLength;

      let multipler = 0;

      if (window.outerWidth > 780) {
        multipler = 2;
      } else {
        multipler = 1;
      }

      let marginWork = 0;

      if (photosR - photosC > oneImageLength * multipler) {
        marginWork = margin + oneImageLength * multipler;
      }
      if (photosR - photosC < oneImageLength * multipler) {
        marginWork = margin + (photosR - photosC);
      }

      if (photosR - photosC < 10) {
        marginWork = 0;
      }

      photosContainer.current.style.marginLeft = `-${marginWork.toString()}px`;
      console.log(`-${margin.toString()}`);

      setTimeout(() => {
        setMargin(marginWork);
      }, 400);
    }
  };

  const Touchstart = (e: any) => {
    setStart(e.changedTouches[0].clientX);
    // console.log(e.changedTouches[0].clientX);
  };

  const Touchend = (e: any) => {
    setEnd(e.changedTouches[0].clientX);
    // console.log(e.changedTouches[0].clientX);
  };

  const handleIntrestedPopUp = () => {
    intrestedPopUp.current.style.display = "flex";
  };

  const handleClosingIntresetedPopUp = () => {
    intrestedPopUp.current.style.display = "none";
  };

  const handleTitleOnScroll = useCallback(() => {
    const { scrollX, scrollY, innerWidth } = window;
    // console.log("yOffset", innerWidth, "scrollY", scrollY);
    if (scrollY > 30 && innerWidth > 1024 && !router.asPath?.includes("blog")) {
      headerTitle.current.style.transition = "0.3s ease-in-out";
      priceTitle.current.style.display = "block";
      // headerTitle.current.style.width = "95%";
      headerTitle.current.style.height = "80px";
      headerTitle.current.style.borderRadius = "0.5rem";
      headerTitle.current.style.justifyContent = "space-between";
      headerTitle.current.style.boxShadow = "0 3px 12px 0 rgba(0, 0, 0, 0.45)";

      headerTitle.current.style.top = "-7px";
      moreInfoLink.current.style.display = "block";

      // headerDesktop.current.style.color = "black";
    } else if (
      scrollY < 30 &&
      innerWidth > 1024 &&
      !router.asPath?.includes("blog")
    ) {
      headerTitle.current.style.transition = "0.3s ease-in-out";
      headerTitle.current.style.width = "100%";
      priceTitle.current.style.display = "none";
      headerTitle.current.style.boxShadow = "none";
      moreInfoLink.current.style.display = "none";
      headerTitle.current.style.top = "60px";
      headerTitle.current.style.justifyContent = "center";
    }
    // mobile changing title
    else if (
      scrollY > 30 &&
      innerWidth < 1024 &&
      !router.asPath?.includes("blog")
    ) {
      headerTitle.current.style.transition = "0.3s ease-in-out";
      priceTitle.current.style.display = "block";
      // headerTitle.current.style.width = "95%";
      headerTitle.current.style.height = "120px";
      headerTitle.current.style.borderRadius = "0.5rem";
      headerTitle.current.style.justifyContent = "space-between";
      headerTitle.current.style.boxShadow = "0 3px 12px 0 rgba(0, 0, 0, 0.45)";

      headerTitle.current.style.top = "-7px";
      moreInfoLink.current.style.display = "block";
    } else if (
      scrollY < 30 &&
      innerWidth < 1024 &&
      !router.asPath?.includes("blog")
    ) {
      headerTitle.current.style.transition = "0.3s ease-in-out";
      headerTitle.current.style.width = "100%";
      priceTitle.current.style.display = "none";
      headerTitle.current.style.boxShadow = "none";
      moreInfoLink.current.style.display = "none";
      headerTitle.current.style.top = "60px";
      headerTitle.current.style.justifyContent = "center";
    }
  }, []);
  useEffect(() => {
    // headerDesktop;

    window.addEventListener("scroll", handleTitleOnScroll);
    return () => {
      window.removeEventListener("scroll", handleTitleOnScroll);
    };
  });

  return (
    <>
      <AnalitycsTools />
      <Head>
        <title>Nieruchomości w Hiszpanii - Onesta Group</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div
        className={`${TenorsSans.className} max-w-[100vw] flex flex-col bg-[#fcf7f4] mx-[5px] sm:mx-auto relative overflow-x-hidden `}
      >
        <WhatsAppButton />
        <div
          ref={intrestedPopUp}
          id="intrestedPopUp"
          className="hidden w-full h-full fixed z-40 top-0 bottom-0 left-0 right-0 m-auto shadow-[10px_25px_60px_20px_rgba(0,0,0,0.3)] bg-gray-900/[0.6] justify-center items-center"
        >
          <div className="md:w-[800px] w-[90%] h-[500px] relative">
            <IoClose
              onClick={handleClosingIntresetedPopUp}
              className="absolute right-[10px] top-[10px] z-[70] cursor-pointer"
            />
            <Form
              intrestedPopUp={intrestedPopUp}
              OfferNumber={propertyData[0]?.listingId}
            />
          </div>
        </div>
        <div className="w-full  bg-white z-[999]">
          <HeaderOffer />
        </div>
        <MiniHomeViewOffer />
        <div
          ref={headerTitle}
          className="fixed left-0 right-0 flex items-center h-[80px] w-full px-auto my-[10px] mx-auto bg-white top-[60px] z-40 px-[30px] justify-center"
        >
          <div className=" md:text-[22px] text-[17px] font-bold text-start min-w-[100px]">
            <p className="lg:text-2xl text-sm">
              {propertyData[0]?.headerAdvertisement}
            </p>
            <p className="font-thin lg:text-[16px] text-[14px] italic">
              {propertyData[0]?.foreignStreet}
            </p>
            <p ref={priceTitle} className="text-orange-500 hidden text-left">
              od {propertyData[0]?.price.amount.toLocaleString()} €
            </p>
          </div>

          <Link
            ref={moreInfoLink}
            href="#contact"
            className="bg-orange-500 h-[50px] text-white place-content-center px-[10px] rounded-md hidden text-center"
          >
            Więcej informacji
          </Link>
        </div>
        <div className="lg:w-[1150px] md:w-[780px] w-full md:p-[20px] pt-5 md:pt-auto mx-auto my-0 rounded-md bg-white">
          <div className="flex flex-col lg:flex-row mx-auto">
            <div className="md:w-[740px] md:h-[570px] w-full sm:h-[470px] h-[400px] overflow-hidden mr-[20px] ">
              <div className="flex md:h-full sm:h-full h-[400px] w-full flex-col justify-between">
                <div className="lg:w-[800px] md:w-[740px] h-[500px] sm:h-full w-[700px] overflow-hidden hidden sm:block select-none relative rounded-md mx-auto">
                  <Image
                    className="w-[300px] object-cover relative"
                    src={showedImage}
                    fill
                    objectFit="cover"
                    alt="nieruchomosci-w-hiszpanii"
                  ></Image>
                </div>
                <div className="relative">
                  <div
                    onClick={handleChangeSlideLeft}
                    // ref={buttonLeft}
                    className="absolute select-none lg:w-[25px] w-[40px] sm:h-[100px] flex left-0 z-30 h-full justify-center items-center cursor-pointer duration-300"
                  >
                    <FaChevronLeft
                      className="h-[30px] w-[30px] text-yellow-500 block"
                      onClick={handleChangeSlideLeft}
                    />
                  </div>
                  <div
                    onClick={handleChangeSlideRight}
                    ref={buttonRight}
                    className="absolute select-none lg:w-[25px] w-[40px] sm:h-[100px] flex right-0 z-30 h-full justify-center items-center cursor-pointer duration-300"
                  >
                    <FaChevronRight
                      className="h-[30px] w-[30px] text-yellow-500 block"
                      onClick={handleChangeSlideRight}
                    />
                  </div>
                  <div
                    ref={photosContainerMain}
                    onTouchStart={Touchstart}
                    onTouchEnd={Touchend}
                    className="lg:w-[90%] md:w-[650px] w-[92.2vw] sm:w-[87vw] mx-auto relative flex sm:h-[134px] md:h-[100px] md:rounded-auto rounded-md overflow-hidden md:mt-[5px]"
                  >
                    <div
                      ref={photosContainer}
                      className="overflow-x-hidden duration-300 flex sm:h-[100px] h-[340px] sm:border-2 md:border-0 select-none"
                    >
                      <div
                        ref={photosRow}
                        className={
                          handleMarginSlider
                            ? "duration-300 flex flex-nowrap sm:h-[100px] h-[320px]"
                            : "flex flex-nowrap ml-0 select-none"
                        }
                      >
                        <ImagesInPropetyCard
                          mainImage={images}
                          images={images}
                          setImages={setImages}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center lg:w-[37%] w-full bg-gray-50">
              <div className="w-full h-[100px]">
                <div className="flex h-[90px] items-center">
                  <div className="h-[40px] w-[40px] flex items-center justify-center">
                    <IoMdPin className="w-[80%] h-[80%] text-yellow-600" />
                  </div>
                  <div className="flex flex-col h-full justify-center">
                    <div className="">{propertyData[0]?.country.name}</div>
                    <div className="text-[24px] font-[800]">
                      {propertyData[0]?.foreignLocation}
                      <br></br>
                      <p className="text-[16px]">
                        {" "}
                        {propertyData[0]?.foreignStreet}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between content-center">
                <div className="w-1/5 border-2 border-white h-[70px] bg-gray-50 pt-2">
                  <div className="w-full flex justify-center text-[16px]">
                    Sypalni
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mr-2">
                      <IoBedOutline className="w-[25px] h-[25px]" />
                    </div>
                    <div>{propertyData[0]?.noOfRooms}</div>
                  </div>
                </div>
                <div className="w-1/5 border-2 border-white h-16 bg-gray-50 pt-2">
                  <div className="w-full flex justify-center text-[16px]">
                    Łazienki
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mr-2">
                      <PiBathtubLight className="w-[25px] h-[25px]" />
                    </div>
                    <div>{propertyData[0]?.noOfBathrooms}</div>
                  </div>
                </div>
                <div className="w-1/5 border-2 border-white h-16 bg-gray-50  pt-2">
                  <div className="w-full flex justify-center text-[16px]">
                    Parking
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mr-2">
                      <CiParking1 className="w-[25px] h-[25px]" />
                    </div>
                    <div>1</div>
                  </div>
                </div>
                <div className="w-1/5 border-2 border-white h-16 bg-gray-50  pt-2">
                  <div className="w-full flex justify-center text-[16px]">
                    Metraż
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mr-2">
                      <BiArea className="w-[25px] h-[25px]" />
                    </div>
                    <div>{propertyData[0]?.totalArea}</div>
                  </div>
                </div>
                <div className="w-1/5 border-2 border-white h-16 bg-gray-50  pt-2">
                  <div className="w-full flex justify-center text-[16px]">
                    Basen
                  </div>
                  <div className="flex justify-center ">
                    <div className="mr-2">
                      <FaSwimmingPool className="w-[25px] h-[25px]" />
                    </div>
                    <div className="font-bold text-md">1</div>
                  </div>
                </div>
                <div className="w-full h-[240px] relative">
                  <iframe
                    src={`https://www.google.com/maps?q=${propertyData[0]?.foreignStreet}, ${propertyData[0]?.country.name}&output=embed`}
                    // width="408"
                    // height="200"
                    loading="lazy"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="bg-white w-full h-[90px] flex flex-col justify-center items-end pl-4">
                  <div className="text-[55px] font-[800] text-yellow-500 flex items-end leading-[20px]">
                    <p className="inline text-[30px] leading-[25px] pr-[5px]">
                      od
                    </p>{" "}
                    <p className="leading-[40px]">
                      {propertyData[0]?.price.amount.toLocaleString()} €
                    </p>
                  </div>
                  <p className="text-md text-black font-bold block">
                    nr ref. {propertyData[0]?.listingId}
                  </p>
                </div>
                <div
                  onClick={handleIntrestedPopUp}
                  className="w-full border rounded-[5px] border-transparent bg-blue-500 h-[60px] place-content-center grid text-white font-bold text-[24px] cursor-pointer duration-150 hover:bg-white hover:border hover:border-gray-900 hover:text-black"
                >
                  Jestem zainteresowany
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Features /> */}
        <Descryption
          description={propertyData[0]?.description}
          bedrooms={propertyData[0]?.bedrooms}
          bathrooms={propertyData[0]?.bathrooms}
          distance={propertyData[0]?.distance}
          pool={propertyData[0]?.pool}
          propertyId={propertyData[0]?.id}
          propertyRef={propertyData[0]?.listingId}
        />
        <Footer />
      </div>
    </>
  );
}
