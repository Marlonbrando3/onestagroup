import Image from "next/image";
import React, { useState, useRef } from "react";
import Head from "next/head";
import { Dancing, TenorsSans, GreatVibes } from "../../fonts/fonts";
import Firstview from "./firstview";

import DataSurvey from "../../data/survey.json";
import SurveyOneTypesBG from "./SurveyOneTypes/surveyOneTypesBG";
import SurveyTwoRegionsBG from "./SurveyTwoRegions/surveyTwoRegionsBG";
import SurveyThreeBugdetBG from "./SurveyThreeBudget/surveyThreeBugdetBG";
import SurveyFourDateBG from "./SurveyFourDate/surveyFourDateBG";
import Thankyoupageform from "../formPL1/thankyoupageform";

export default function Index() {
  const emptyFieldPopUp: any = useRef();

  const [PageNumber, setPageNumber] = useState<number>(3);

  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [exclusive, setExclusite] = useState("");
  const [price, setPrice] = useState("");

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
      <div
        className={`bg-[url('/bg-form.png')] h-auto bg-[length:400px_auto] md:bg-cover bg-fixed pb-[20px]`}
      >
        <div className="h-[40px] md:h-[80px] w-full ">
          <div id="logo" className="w-full h-full relative bg-white ">
            <Image
              src="/logotype_full.png"
              fill
              alt="logo"
              objectFit="contain"
              className="py-[9px] md:py-[22px]"
            ></Image>
          </div>
        </div>

        {PageNumber === 1 && <Firstview PageNumber={PageNumber} setPageNumber={setPageNumber} />}
        {PageNumber === 2 && (
          <Thankyoupageform PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
        {PageNumber === 3 && (
          <SurveyOneTypesBG PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
        {PageNumber === 4 && (
          <SurveyTwoRegionsBG PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
        {PageNumber === 5 && (
          <SurveyThreeBugdetBG PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
        {PageNumber === 6 && (
          <SurveyFourDateBG PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
      </div>
    </>
  );
}
