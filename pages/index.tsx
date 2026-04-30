import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import { useState, useRef } from "react";
import HomeViewAlt from "@/components/HomeViewAlt";
import MiddlePageOne from "@/components/MiddlePageOne";
import WhatWeDoMainPage from "@/components/WhatWeDoMainPage";

type AppProps = {
  cookiesWindow: any;
};

const RegionsMainPage = dynamic(() => import("@/components/RegionsMainPage"));
const ProcessSteps = dynamic(
  () => import("@/components/ProcesDescriptionsMainSite/ProcessSteps")
);
const MiddlePageOneSecond = dynamic(
  () => import("@/components/MiddlePageOneSecond")
);
const ContactFormMiddleMail = dynamic(
  () => import("@/components/ContactFormMiddleMail")
);
const BlogComponent = dynamic(
  () => import("@/components/BlogMainSite/BlogComponent")
);
const ContactFormMain = dynamic(() => import("@/components/ContactFormMain"));
const Footer = dynamic(() => import("../components/Footer"));
const WhatsAppButton = dynamic(
  () => import("../components/whatsapp/whatsappButton"),
  { ssr: false }
);
const Consultation = dynamic(
  () => import("@/components/consulatation/consultation"),
  { ssr: false }
);

export default function FirstView({ cookiesWindow }: AppProps) {
  const mainLoader = useRef<any>();

  const [ConsultationsShowe, setConsultationsShowed] = useState(false);
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(false);

  const handleConsultationPopUp = () => {
    setConsultationsShowed(!ConsultationsShowe);
  };

  const loadLoader = () => (mainLoader.current.displty = "block");

  React.useEffect(() => {
    const show = () => setShowDeferredSections(true);
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(show, { timeout: 1200 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timeout = window.setTimeout(show, 700);
    return () => window.clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    const show = () => setShowEnhancements(true);
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(show, { timeout: 1800 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timeout = window.setTimeout(show, 1000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <meta
          property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
          content="image"
        />
        <title>Nieruchomości w Hiszpanii, nieruchomości Hiszpania.</title>
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
        {showEnhancements && <WhatsAppButton />}
        {showEnhancements && (
          <Consultation
            handleConsultationPopUp={handleConsultationPopUp}
            ConsultationsShowed={ConsultationsShowe}
          />
        )}
        <Header
          handleConsultationPopUp={handleConsultationPopUp}
          loadLoader={loadLoader}
        />
        <HomeViewAlt />
        <MiddlePageOne />
        {showDeferredSections && (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
