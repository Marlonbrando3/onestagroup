import React from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../components/Header";
import HomeView from "../components/HomeView";
import SearchBarMainPage from "../components/SearchBarMainPage";
import WhatsAppButton from "../components/whatsapp/whatsappButton";
import Aboutus from "../components/indexComponents/Aboutus";
import Cookies from "../analitycs/cookies";
import Footer from "../components/Footer";
import RecommendedOffers from "@/components/recommendedOffers";
import AboutOnestaMainPage from "../components/aboutOnestaMainPage";
import AboutOurOffers from "../components/aboutOurOffers";
import HomeViewClaim from "@/components/HomeViewClaim";

import Hotjar from "@hotjar/browser";
import Ourteammain from "@/components/ourteammain/ourteammain";
import { useState, useEffect, useRef } from "react";
import EduMainPage from "./eduMainPage/eduMainPage";
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
      <Cookies />
      <Script id="gtm">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KL7WKBWL');`}
      </Script>
      <Script id="GTM-conversion-form">
        {`
          function gtagSendEvent(url) {
            var callback = function () {
              if (typeof url === 'string') {
                window.location = url;
              }
            };
            gtag('event', 'conversion_event_submit_lead_form', {
              'event_callback': callback,
              'event_timeout': 2000,
              // <event_parameters>
            });
            return false;
          }
        `}
      </Script>
      <Script id="google-analitycs">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7E286CBN97');
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
        {/* <HomeViewClaim /> */}
        {/* <SearchBarMainPage /> */}
        {/* <AboutOurOffers />
        <AboutOnestaMainPage /> */}
        {/* <MainTheme /> */}
        {/* <RecommendedOffers /> */}
        {/* <EduMainPage /> */}
        {/* <Ourteammain /> */}
        {/* <Aboutus /> */}
        <Footer />
      </div>
    </>
  );
}
