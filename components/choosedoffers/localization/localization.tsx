import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Data from "../../../data/formData.json";
import { useRouter } from "next/router";
import Properties from "../../../public/properties.json";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Localization() {
  const router = useRouter();
  const { offer } = router.query;

  const Localization = Properties.filter((i: any) => i.listingId === offer)
    .flatMap((i) => i.images)
    .filter((i) => i.description === "lokalizacja");

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
      <div className="lg:w-[700px] w-[98vw] md:h-[480px] h-[370px] bg-white rounded-xl overflow-hidden relative">
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
                <Image
                  src={`https://img.asariweb.pl/normal/${Localization[0].id}`}
                  alt="Opis obrazka"
                  width={2600}
                  height={2400}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
}
