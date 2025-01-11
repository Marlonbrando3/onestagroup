import React, { useRef, useState, useCallback, useEffect } from "react";
import Properties from "../../../public/properties.json";
import Head from "next/head";
import Data from "../../../data/formData.json";

export default function Plans() {
  const choosedProperty = Properties.filter((i: any) => i.listingId === "6/15982/OMS");
  const PropertyImagesArray = choosedProperty[0].images;

  const [indexPDF, setIndexPDF] = useState(0);

  const handlePDFnumber = (index: any) => {
    setIndexPDF(index);
  };

  const selectedPDF = Data.find((item) => item.id === "Higuericas")?.images[indexPDF];
  console.log(selectedPDF);

  const subpage = Data.find((i) => i.id === "Higuericas")?.images.map((i, index) => (
    <p
      key={index}
      onClick={() => handlePDFnumber(index)}
      className="cursor-pointer text-[30px] w-[40px] h-[40px] place-content-center grid bg-white mx-[2px] rounded-md"
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
      <div className="lg:w-[700px] w-[98vw] md:h-[480px] h-[370px] bg-white rounded-xl overflow-hidden relative">
        <iframe src={`${selectedPDF}`} width="100%" height="500px" style={{ border: "none" }} />
      </div>
      <div className="flex mt-[10px]"> {subpage}</div>
    </>
  );
}
