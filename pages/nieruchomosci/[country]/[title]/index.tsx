import Image from "next/image";
import { useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import HeaderOffer from "../../../../components/HeaderOffer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import MiniHomeViewOffer from "../../../../components/SearchEngine/MiniHomeViewOffer";
import ImagesInPropetyCard from "@/components/ImagesInPropetyCard";
import { useState, useEffect } from "react";
import React from "react";
import Descryption from "../../../../components/Descryption";
import Properties from "../../../../public/properties.json";
import Footer from "@/components/Footer";
import { OutfitSans, TenorsSans } from "../../../../fonts/fonts";
import { CiParking1 } from "react-icons/ci";
import Form from "@/components/SearchEngine/IntresetedPopUp/form";
import { IoClose } from "react-icons/io5";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Loan from "@/components/loanCalc/loan";
import Link from "next/link";
import AnalitycsTools from "@/analitycs/analitycsTools";
import { REGION_MAP, COUNTRY_MAP } from "@/lib/regionMap";
import Slider from "@/components/SliderInOfferPage/slider";
import Gallery from "@/components/SliderInOfferPage/gallery";
import ContactInFooterMobile from "@/components/SearchEngine/ContactInFooterMobile";

export default function Property({ propertyFromSupabase }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [propertyData, setPropertyData] = useState<any[]>([]);
  // const [PropertyImages, setPropertyImages] = useState<any[]>([]);

  const moreInfoLink = useRef<any>();
  const headerTitle = useRef<any>();
  const priceTitle = useRef<any>();
  const buttonLeft = useRef<any>();
  const buttonRight = useRef<any>();
  const photosContainer = useRef<any>();
  const photosContainerMain = useRef<any>();
  const photosRow = useRef<any>();
  const intrestedPopUp: any = useRef();

  const [images, setImages] = useState<any[]>();
  const [choosedImage, setChoosedImage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  let showedImage: any | undefined;
  const { title } = router.query;
  const RawTitle = Array.isArray(title) ? title[0] : title;

  if (images !== undefined) {
    images?.filter((img) => {
      if (img.showed === true) {
        showedImage = img.image.replace("thumbnail", "normal");
      }
    });
  }

  const handleShowingGallery = (e: any) => {
    setShowGallery(true);
    // setChoosedImage(1);
  };

  const PropertyImages = propertyFromSupabase?.images;

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
  };

  const imagesMiniData = propertyFromSupabase.images
    ?.slice(1, 7)
    .map((i: any, index: any) => {
      return (
        <div
          key={i["@_id"]}
          className="lg:w-[170px] lg:h-[170px] md:w-[121px] md:h-[122px] w-[15vw] h-[10vw] relative cursor-pointer hover:brightness-125 duration-100"
          onClick={() => handleShowingGallery(i["@_id"])}
        >
          <Image
            src={i.url}
            fill
            objectFit="cover"
            alt="alt"
            className="rounded-md"
          ></Image>
          ;
        </div>
      );
    });

  const handleChangeSlideRight = () => {
    // setHandleMarginSlider('true')

    const photosCM = photosContainerMain.current.offsetWidth;
    const photosC = photosContainer.current.offsetWidth;
    const photosR = photosRow.current.offsetWidth;
  };

  // const Touchstart = (e: any) => {
  //   setStart(e.changedTouches[0].clientX);
  // };

  // const Touchend = (e: any) => {
  //   setEnd(e.changedTouches[0].clientX);
  // };

  const handleIntrestedPopUp = () => {
    intrestedPopUp.current.style.display = "flex";
  };

  const handleClosingIntresetedPopUp = () => {
    intrestedPopUp.current.style.display = "none";
  };

  console.log(propertyFromSupabase.price);

  return (
    <>
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
        className={`${OutfitSans.className} max-w-[1350px] flex flex-col mx-[5px] sm:mx-auto relative overflow-x-hidden `}
      >
        <Gallery
          choosedImage={choosedImage}
          setChoosedImage={setChoosedImage}
          showSlider={showSlider}
          setShowSlider={setShowSlider}
          showGallery={showGallery}
          setShowGallery={setShowGallery}
          images={propertyFromSupabase.images}
        />
        <Slider
          showSlider={showSlider}
          choosedImage={choosedImage}
          setChoosedImage={setChoosedImage}
          setShowSlider={setShowSlider}
          images={propertyFromSupabase.images}
          propertyDetails={propertyFromSupabase}
        />
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
        <div className="w-full bg-white z-[90]">
          <HeaderOffer />{" "}
        </div>
        {/* <MiniHomeViewOffer /> */}
        <div className="lg:w-full md:w-[95vw] w-full pt-5 md:pt-auto mx-auto my-0 rounded-md bg-white">
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* MAIN GALLERY IMAGE */}
            <div className="md:flex-1 md:h-[255px] lg:h-[360px] md:w-[60vw] h-[200px] overflow-hidden mx-[10px]">
              <div className="flex md:h-full sm:h-full h-[900px] w-full flex-col justify-between rounded-md overflow-hidden">
                <div className="lg:w-full md:w-full md:h-[500px] h-[200px] w-[95vw] sm:block select-none relative mx-auto relative rounded-md cursor-pointer">
                  <Image
                    className="rounded-md"
                    src={propertyFromSupabase.images[0].url}
                    fill
                    objectFit="cover"
                    alt="nieruchomosci-w-hiszpanii"
                    onClick={handleShowingGallery}
                  ></Image>
                </div>
              </div>
            </div>
            {/* mini-gallery */}
            <div className="flex md:justify-start justify-between items-start lg:w-[570px] md:w-[400px] w-[95vw] lg:flex-none  flex-wrap lg:gap-5 md:gap-3 gap-0  mt-[5px] md:mt-auto">
              {imagesMiniData}
            </div>
          </div>
        </div>
        {/* <Features /> */}
        <Descryption
          localization={{
            lat: propertyFromSupabase.latitude,
            lng: propertyFromSupabase.longitude,
          }}
          propertyData={propertyFromSupabase}
          features={propertyFromSupabase.features}
          description={propertyFromSupabase.descriptions.pl}
          bedrooms={propertyFromSupabase.beds}
          bathrooms={propertyFromSupabase.baths}
          distance={propertyData[0]?.distance}
          pool={propertyFromSupabase.pool}
          propertyId={propertyData[0]?.id}
          propertyRef={propertyData[0]?.listingId}
          propertyPrice={propertyFromSupabase.price}
          propertType={propertyFromSupabase.type}
        />
        <ContactInFooterMobile propertyRef={propertyFromSupabase.external_id} />
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const id = context.query.id;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("external_id", Number(id))
    .single();

  if (error) {
    console.error(error);
  }

  return {
    props: {
      propertyFromSupabase: data ?? null,
    },
  };
}
