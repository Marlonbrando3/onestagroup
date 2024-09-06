import Image from "next/image";
import { useCallback, useRef } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../../components/Header";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import MiniHomeView from "../../components/SearchEngine/MiniHomeView";
import ImagesInPropetyCard from "@/components/ImagesInPropetyCard";
import { useState, useEffect } from "react";
import React from "react";
import Features from "../../components/Features";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import Descryption from "../../components/Descryption";
import Properties from "../../public/properties.json";
import Footer from "@/components/Footer";

export default function Property() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [PropertyImages, setPropertyImages] = useState<any[]>([]);

  const buttonLeft = useRef<any>();
  const buttonRight = useRef<any>();
  const photosContainer = useRef<any>();
  const photosContainerMain = useRef<any>();
  const photosRow = useRef<any>();

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const [actualImage, setActualImage] = useState(1);
  const [searchShow, setSearchShow] = useState(true);
  const [images, setImages] = useState<any[]>();

  let showedImage: any | undefined;

  if (images !== undefined) {
    images?.filter((img) => {
      if (img.showed === true) {
        showedImage = img.image;
      }
    });
  }

  useEffect(() => {
    console.log(router);
    if (router.isReady === true) {
      const QueryIdTemp: any = searchParams.get("id");
      const QueryId = parseInt(QueryIdTemp);
      const propertyDataTemp = Properties.filter((i) => i.id === QueryId);
      console.log(propertyDataTemp);
      const PropertyImages = propertyDataTemp[0]?.images.filter((i) => i.id);

      setPropertyData(propertyDataTemp);
      setPropertyImages(PropertyImages);

      const imagesTemp = PropertyImages?.map((image, index) => {
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
      console.log(imagesTemp);
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
          margin - (oneImageLength - oneImageLength * (cutedImage - Math.floor(cutedImage)));
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

      console.log(photosR - photosC);

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

      console.log(marginWork);

      photosContainer.current.style.marginLeft = `-${marginWork.toString()}px`;
      console.log(`-${margin.toString()}`);

      setTimeout(() => {
        setMargin(marginWork);
      }, 400);
    }
  };

  const Touchstart = (e: any) => {
    setStart(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientX);
  };

  const Touchend = (e: any) => {
    setEnd(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientX);
  };

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-P4VZ7P7VZ5"></Script>
      <Script id="google-analitycs">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P4VZ7P7VZ5');
              `}
      </Script>
      <Script id="facebook-pixel">
        {`!function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '178665974358939');
                  fbq('track', 'PageView');
                `}
      </Script>
      {/* <!-- Hotjar Tracking Code for https://onesta.com.pl --> */}
      <Script id="hotjar">
        {`
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:3555670,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
      </Script>
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
      <div className="max-w-[100vw] flex flex-col bg-gray-100 mx-[5px] sm:mx-auto">
        <div className="fixed w-full bg-white z-50">
          <Header />
        </div>
        <MiniHomeView />
        <div className="flex items-center justify-center h-[80px] w-full px-auto my-[10px] mx-auto bg-white">
          <p className="block w-12/12 text-lg lg:text-2xl font-bold lg:mx-auto mx-4">
            {propertyData[0]?.headerAdvertisement}
          </p>
        </div>
        <div className="lg:w-[1150px] md:w-[780px] max-w-full md:p-[20px] pt-5 md:pt-auto mx-auto my-0 rounded-md bg-white">
          <div className="flex flex-col lg:flex-row mx-auto">
            <div className="md:w-[740px] md:h-[500px] w-full sm:h-[470px] h-[400px]  overflow-hidden mr-[20px] border">
              <div className="flex md:h-full sm:h-full h-[400px] w-full flex-col justify-between">
                <div className="lg:w-[800px] md:w-[740px] h-[500px] sm:h-full w-[700px] overflow-hidden hidden sm:block select-none relative rounded-xl mx-auto">
                  <Image
                    className="w-[400px] object-cover"
                    src={showedImage}
                    fill
                    // responsive
                    alt="photo"
                  ></Image>
                </div>
                <div className="relative">
                  <div
                    onClick={handleChangeSlideLeft}
                    // ref={buttonLeft}
                    className="absolute select-none lg:w-[25px] w-[40px] sm:h-[100px] flex left-0 z-40 h-full justify-center items-center cursor-pointer duration-300"
                  >
                    <FaChevronLeft
                      className="h-[20px] w-[20px] text-black block"
                      onClick={handleChangeSlideLeft}
                    />
                  </div>
                  <div
                    onClick={handleChangeSlideRight}
                    ref={buttonRight}
                    className="absolute select-none lg:w-[25px] w-[40px] sm:h-[100px] flex right-0 z-40 h-full justify-center items-center cursor-pointer duration-300"
                  >
                    <FaChevronRight
                      className="h-[20px] w-[20px] text-black block"
                      onClick={handleChangeSlideRight}
                    />
                  </div>
                  <div
                    ref={photosContainerMain}
                    onTouchStart={Touchstart}
                    onTouchEnd={Touchend}
                    className="lg:w-[90%] md:w-[650px] w-[92.2vw] sm:w-[87vw] mx-auto relative flex sm:h-[134px] md:h-[100px] md:rounded-auto rounded-md overflow-hidden"
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
            <div className="flex flex-col justify-center lg:w-[45%] w-full bg-gray-50">
              <div className="w-full h-[100px]">
                <div className="flex h-[90px] items-center">
                  <div className="h-12 w-10 flex items-center justify-center">
                    <IoMdPin />
                  </div>
                  <div className="flex flex-col h-full justify-center">
                    <div className="">{propertyData[0]?.country.name}</div>
                    <div className="text-xl font-bold">
                      {propertyData[0]?.foreignLocation}, {propertyData[0]?.foreignStreet}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between content-center">
                <div className="w-1/4 border-2 border-white h-16 bg-gray-50 pt-2">
                  <div className="w-full flex justify-center text-sm">Sypalni</div>
                  <div className="flex h-full justify-center">
                    <div className="mr-2">
                      <IoBedOutline />
                    </div>
                    <div>{propertyData[0]?.noOfRooms}</div>
                  </div>
                </div>
                <div className="w-1/4 border-2 border-white h-16 bg-gray-50 pt-2">
                  <div className="w-full flex justify-center text-sm">Łazienki</div>
                  <div className="flex justify-center ">
                    <div className="mr-2">
                      <PiBathtubLight />
                    </div>
                    <div>{propertyData[0]?.noOfBathrooms}</div>
                  </div>
                </div>
                <div className="w-1/4 border-2 border-white h-16 bg-gray-50  pt-2">
                  <div className="w-full flex justify-center text-xs">Do Morza</div>
                  <div className="flex justify-center  ">
                    <div className="mr-2">
                      <FaSwimmingPool />
                    </div>
                  </div>
                </div>
                <div className="w-1/4 border-2 border-white h-16 bg-gray-50  pt-2">
                  <div className="w-full flex justify-center text-xs">Basen</div>
                  <div className="flex justify-center ">
                    <div className="mr-2">
                      <FaSwimmingPool />
                    </div>
                    <div className="font-bold text-md"></div>
                  </div>
                </div>
                <div className="w-full h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25218.815183534534!2d-0.80644335!3d37.8052257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6311deec8d2e83%3A0x8f550cb3fefae865!2sSantiago+de+la+ribera,+Spain!5e0!3m2!1sen!2spl!4v1712163502571!5m2!1sen!2spl&zoom=1222"
                    width="438"
                    height="254"
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="bg-white w-full h-20 flex flex-col justify-center items-end pl-4">
                  <p className="text-5xl font-bold text-yellow-500">
                    od {propertyData[0]?.price.amount.toLocaleString()} €
                  </p>
                  <p className="text-md text-black font-bold block">
                    nr ref. {propertyData[0]?.listingId}
                  </p>
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
