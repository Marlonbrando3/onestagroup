import React from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../components/Header";
import WhatsAppButton from "../components/whatsapp/whatsappButton";
import Footer from "../components/Footer";
import Hotjar from "@hotjar/browser";
import { useState, useEffect, useRef } from "react";
import HomeViewAlt from "@/components/HomeViewAlt";
import MiddlePageOne from "@/components/MiddlePageOne";
import WhatWeDoMainPage from "@/components/WhatWeDoMainPage";
import RegionsMainPage from "@/components/RegionsMainPage";
import ProcessSteps from "@/components/ProcesDescriptionsMainSite/ProcessSteps";
import MiddlePageOneSecond from "@/components/MiddlePageOneSecond";
import ContactFormMiddleMail from "@/components/ContactFormMiddleMail";
import BlogComponent from "@/components/BlogMainSite/BlogComponent";
import ContactFormMain from "@/components/ContactFormMain";
import Consultation from "@/components/consulatation/consultation";
import AnalitycsTools from "@/analitycs/analitycsTools";

type AppProps = {
  cookiesWindow: any;
};

export default function FirstView({ cookiesWindow }: AppProps) {
  // const router = useRouter();
  const siteId = 3555670;
  const hotjarVersion = 6;

  const [ConsultationsShowe, setConsultationsShowed] = useState(false);

  const handleConsultationPopUp = () => {
    setConsultationsShowed(!ConsultationsShowe);
    console.log("live");
  };

  Hotjar.init(siteId, hotjarVersion);
  return (
    <>
      <AnalitycsTools />
      <Head>
        <meta
          property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
          content="image"
        />
        <title>Nieruchomości w Hiszpanii, nieruchomości Hiszpania.</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
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
        <meta
          property="og:image"
          content="https://onesta.com.pl/onesta_og_img.png"
        />
      </Head>
      <div className="main-index bg-white">
        <Script id="gtm-code">
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KL7WKBWL"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        </Script>
        {/* <Cookies cookiesWindow={cookiesWindow} /> */}
        <WhatsAppButton />
        <Consultation
          handleConsultationPopUp={handleConsultationPopUp}
          ConsultationsShowed={ConsultationsShowe}
        />
        <Header handleConsultationPopUp={handleConsultationPopUp} />
        <HomeViewAlt />
        <MiddlePageOne />
        <WhatWeDoMainPage />
        <RegionsMainPage />
        <MiddlePageOneSecond />
        <ContactFormMiddleMail
          handleConsultationPopUp={handleConsultationPopUp}
        />
        <ProcessSteps handleConsultationPopUp={handleConsultationPopUp} />
        <BlogComponent />
        <ContactFormMain />
        <Footer />
      </div>
    </>
  );
}
