import React, { useRef, useState, useCallback, useEffect } from "react";
import Properties from "../../../public/properties.json";
import Head from "next/head";
import { useRouter } from "next/router";
import Data from "../../../data/formData.json";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Plans() {
  const router = useRouter();
  const { offer } = router.query;

  const choosedProperty = Properties.filter((i: any) => i.listingId === offer)
    .flatMap((i) => i.images)
    .filter((i) => i.isScheme === true);

  console.log(choosedProperty);

  const [indexPlan, setIndexPlan] = useState(0);

  const handlePDFnumber = (index: any) => {
    setIndexPlan(index);
  };

  const selectedPlan = choosedProperty[indexPlan];
  console.log(selectedPlan);

  const subpage = choosedProperty.map((i, index) => (
    <p
      key={index}
      onClick={() => handlePDFnumber(index)}
      className={`${
        indexPlan === index ? "bg-orange-500 text-white border-white border" : "bg-white"
      } "cursor-pointer text-[30px] w-[40px] h-[40px] place-content-center grid mx-[2px] rounded-md cursor-pointer`}
    >
      {index + 1}
    </p>
  ));

  const [indexImage, setIndexImage] = useState(0);

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
      <div className="md:w-[700px] w-[98vw] md:h-[480px] h-[370px] rounded-xl overflow-hidden bg-white flex flex-col items-center">
        <TransformWrapper initialScale={1} minScale={1} maxScale={5}>
          {({ zoomIn, zoomOut }) => (
            <>
              <div className="flex justify-center items-center">
                <p className="mr-[15px] text-[16px] font-semibold">Powiększenie</p>
                <button
                  onClick={() => zoomIn()}
                  className="border w-[40px] h-[40px] bg-gray-100 border-gray-400 text-black rounded-md text-[20px] leading-[0px] flex items-center justify-center mr-[3px]"
                >
                  +
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="border w-[40px] h-[40px] bg-gray-100 border-gray-400 text-black rounded-md text-[20px] leading-[0px] flex items-center justify-center"
                >
                  -
                </button>
              </div>
              <TransformComponent>
                <div className="md:w-[700px] w-[98vw] md:h-[480px] h-[370px] relative">
                  <Image
                    src={`https://img.asariweb.pl/normal/${selectedPlan.id}`}
                    alt="Opis obrazka"
                    fill
                    objectFit="contain"
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
      <div className="flex mt-[10px]">
        <div className="h-full place-content-center bg-white rounded-md mr-[5px] px-[5px] font-semibold">
          Numer planu
        </div>{" "}
        {subpage}
      </div>
    </>
  );
}
