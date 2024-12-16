import React from "react";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Header from "../components/Header";
import MiniHomeView from "../components/SearchEngine/MiniHomeView";
import ContactFormMain from "../components/ContactFormMain";
import Footer from "../components/Footer";
import ContactFormAboutUs from "../components/ContactFormAboutUs";
import { FaRegHandshake } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { BsTranslate } from "react-icons/bs";
import { GoLaw } from "react-icons/go";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { SiPowervirtualagents } from "react-icons/si";
import HowWeWork from "../components/SearchEngine/howWeWork";

export default function Aboutus() {
  const [searchShow, setSearchShow] = useState(true);
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
      <Head>
        <title>O Nas - Onesta Group</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 md:bg-gray-800/[0.4] z-20 bg-white shadow-xl">
          <Header searchShow={searchShow} />
        </div>
      </div>
      <MiniHomeView />
      <div className="bg-gray-900/[0.0]">
        <div className="lg:w-[1000px] flex flex-col w-screen mx-auto justify-evenly">
          <Image
            src="/logotype_full.png"
            width={100}
            height={50}
            className="md:w-[400px] w-[60vw] mx-auto text-center text-[52px] pt-10 font-bold leading-[50px]"
          />
          {/* <p className="w-screen mx-auto text-center text-[52px] pt-10 font-bold leading-[50px]">
            Onesta Group
          </p> */}
          <p className="w-10/12 mx-auto text-center text-[24px] font-semibold py-[20px] leading-[30px]">
            więcej niż Broker nieruchomości
          </p>
          <div className="w-8/12 mx-auto h-1 bg-red-900"></div>
          <p className="md:w-10/12 w-[95vw] mx-auto text-center text-[26px] font-[800] leading-9 text-green-600 pt-[10px]">
            Profesjonalny, odpowiedzialny, nastawiony na kupujących Broker Nieruchomości
          </p>
          <div className="md:w-[850px] w-[90vw] mx-auto flex py-[90px] md:flex-row flex-col items-center border-b-2">
            <div className="relative h-[250px] w-[200px] rounded-[10px] overflow-hidden">
              <Image src="/Marek.png" fill />
            </div>
            <div className="lg:w-[620px] w-full md:ml-[30px] ml-[0px]">
              <p className="text-[26px] font-semibold">Marek Marszałek</p>
              <p>Założyciel</p>
              <p className="italic pt-[20px]">
                Cieszę się, że treści i usługi, które tworzymy doprowdziły Cię tutaj i chcesz poznać
                nas bliżej. To wyróżniające, dziękuję. Celem przyświecającym nam w trakcie tworzenia
                firmy była uczciwość w stosunku do naszych klientów oraz do samych siebie, stąd też
                nazwa &quot;Onesta&quot;. Wiemy, że branża pośrednictwa nieruchomości nie ma się
                dobrze jeśli mówimy o jakości, transparentności i bazie w postaci wiedzy o rynku.
                Chcemy być tego odwrotnością i ze swoim (uważam) dużym zapleczem czy też
                doświadczeniem w pracy z drugim człowiekiem, zrozumieniem Jego potrzeb oraz naszą
                pomysłowością i elastycznąścią jesteśmy w stanie zapewnić wysoką jakość naszych
                działań i usług.
              </p>
            </div>
          </div>
          <p className="w-10/12 mx-auto left-0 text-[34px] font-[800] leading-9 text-green-600 py-10">
            Nasz zespół.
          </p>
          <p className="w-10/12 mx-auto lg:text-[22px] leading-7 pb-10">
            Jesteśmy grupą ludzi, którzy kochają dalekie i ciepłe kraje oraz tamtejsze rynki
            nieruchomości.{" "}
            <span className="text-green-600 italic font-semibold">
              Pomożemy Państwu w poznaniu tych regionów świata, uczynieniu ich drugim domem, a
              proces zakupu nieruchomości - &quot;bezpiecznym&quot;.
            </span>{" "}
            Wciąż rozwijamy i aktualizujemy naszą wiedzę o rynku, atrakcjach na wybrzeżach, stylu
            życia w Hiszpanii aby dostarczyć Państwu wartościowej wiedzy. <br></br>
            <br></br>W branży nieruchomości działamy od 8 lat. <br></br>
            <span className="text-green-600 italic font-semibold">
              Stawiamy na relacyjność, otwartość, cierpliwość i zrozumienie potrzeb kupującego co
              jest naszym wyróżnikiem. W procesie sprzedaży dbamy o bezpieczeństwo, zapleczę prawne
              oraz ścisłą komunikację.
            </span>{" "}
            <br></br>Możemy zrealizować dla Ciebie procesy zakupowe oraz zarządzać nieruchomością w
            krajach: Polska, Hiszpania, Portugalia, Chorwacja, Cypr, Dubaj
          </p>
        </div>
        <ContactFormAboutUs />
        <MiniHomeView />
        <HowWeWork />
      </div>
      <div className="w-10/12 mx-auto my-[30px]">
        <ContactFormMain />
      </div>
      <Footer />
    </>
  );
}
