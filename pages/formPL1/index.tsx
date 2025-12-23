import Image from "next/image";
import React, { useState, useRef } from "react";
import Head from "next/head";
import Script from "next/script";
import Firstview from "../../components/Survey/firstview";
import SurveyOneTypesBG from "../../components/Survey/SurveyOneTypes/surveyOneTypesBG";
import SurveyTwoRegionsBG from "../../components/Survey/SurveyTwoRegions/surveyTwoRegionsBG";
import SurveyThreeBugdetBG from "../../components/Survey/SurveyThreeBudget/surveyThreeBugdetBG";
import SurveyFourDateBG from "../../components/Survey/SurveyFourDate/surveyFourDateBG";
import Thankyoupageform from "../../components/Survey/thankyoupageform";
import Thankyoupageafter from "@/components/Survey/SurveyFourDate/thankyoupageafter";
import Hotjar from "@hotjar/browser";

export default function Index() {
  const emptyFieldPopUp: any = useRef();

  const siteId = 3555670;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

  const [PageNumber, setPageNumber] = useState<number>(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");

  const [ArrowTypes, setArrowTypes] = useState();
  const [ArrowRegions, setArrowRegions] = useState();
  const [ArrowBudget, setArrowBudget] = useState();
  const [ArrowTime, setArrowTime] = useState();

  return (
    <>
      {" "}
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
                  fbq('trackCustom', 'Form www (thx page)')
                `}
      </Script>
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

        {PageNumber === 1 && (
          <Firstview
            PageNumber={PageNumber}
            setPageNumber={setPageNumber}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            msg={msg}
            setMsg={setMsg}
            email={email}
            setEmail={setEmail}
          />
        )}
        {PageNumber === 2 && (
          <Thankyoupageform PageNumber={PageNumber} setPageNumber={setPageNumber} />
        )}
        {PageNumber === 3 && (
          <SurveyOneTypesBG
            PageNumber={PageNumber}
            setPageNumber={setPageNumber}
            ArrowTypes={ArrowTypes}
            setArrowTypes={setArrowTypes}
          />
        )}
        {PageNumber === 4 && (
          <SurveyTwoRegionsBG
            PageNumber={PageNumber}
            setPageNumber={setPageNumber}
            ArrowRegions={ArrowRegions}
            setArrowRegions={setArrowRegions}
          />
        )}
        {PageNumber === 5 && (
          <SurveyThreeBugdetBG
            PageNumber={PageNumber}
            setPageNumber={setPageNumber}
            ArrowBudget={ArrowBudget}
            setArrowBudget={setArrowBudget}
          />
        )}
        {PageNumber === 6 && (
          <SurveyFourDateBG
            PageNumber={PageNumber}
            setPageNumber={setPageNumber}
            ArrowTime={ArrowTime}
            setArrowTime={setArrowTime}
          />
        )}
        {PageNumber === 7 && (
          <Thankyoupageafter
            PageNumber={PageNumber}
            ArrowTime={ArrowTime}
            ArrowTypes={ArrowTypes}
            ArrowRegions={ArrowRegions}
            ArrowBudget={ArrowBudget}
            name={name}
            phone={phone}
            msg={msg}
            email={email}
          />
        )}
      </div>
    </>
  );
}
