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
            więcej niż Biuro Nieruchomości
          </p>
          <div className="w-8/12 mx-auto h-1 bg-red-900"></div>
          <p className="md:w-10/12 w-[95vw] mx-auto text-center text-[26px] font-[800] leading-9 text-green-600 pt-[10px]">
            Profesjonalne, odpowiedzialne, nastawione na kupującego Biuro Nieruchomości
          </p>
          <div className="md:w-[850px] w-[90vw] mx-auto flex py-[90px] md:flex-row flex-col items-center border-b-2">
            <div className="relative h-[200px] w-[200px]">
              <Image src="/Maro_fota_strona.png" fill />
            </div>
            <div className="lg:w-[620px] w-full md:ml-[30px] ml-[0px]">
              <p className="text-[26px]">Marek Marszałek</p>
              <p>Założyciel</p>
              <p className="italic pt-[20px]">
                Cieszę się, że treści i usługi, które tworzymy doprowdziły Cię tutaj i chcesz poznać
                nas bliżej. To wyróżniające, dziękuję. Celem przyświecającym nam w trakcie tworzenia
                firmy była uczciwość w stosunku do naszych klientów oraz do samych siebie, stąd też
                nazwa &quot;Onesta&quot;. Wiemy, że branża pośrednictwa nieruchomości nie ma się
                dobrze jeśli mówimy o jakości, transparentności i bazie w postaci wiedzy o rynku.
                Chcemy być tego odwrotnością i ze swoim (uważam) dużym zapleczem czy też
                doświadczeniem w pracy z drugim człowiekiem, rozumieniem Jego potrzeb oraz naszą
                pomysłowością i elastycznąścią jesteśmy w stanie wysoką jakość zapewnić również
                Tobie.
              </p>
            </div>
          </div>
          <p className="w-10/12 mx-auto left-0 text-[34px] font-[800] leading-9 text-green-600 py-10">
            Nasz zespoł.
          </p>
          <p className="w-10/12 mx-auto lg:text-[22px] leading-7 pb-10">
            Jesteśmy grupą ludzi, których pasją są dalekie i ciepłe kraje oraz tamtejsze rynki
            nieruchomości.{" "}
            <span className="text-green-600 italic font-semibold">
              Chcemy uczynić je zrozumiałymi dla naszych klientów, a procesy zakupu nieruchomości -
              &quot;znośnymi&quot;.
            </span>{" "}
            Wciąż rozwijamy i aktualizujemy aby na podstawie naszych pasji dostarczyć Wam wiedzy ale
            też gotowości do działania w wypadku trudności. <br></br>
            <br></br>W branży nieruchomości działamy od 4 lat wraz ze{" "}
            <span className="text-green-600 italic font-semibold">
              sprawdzonymi partnerami w każdym z krajów posiadających również wieloletnie
              doświadczenie oraz wyspecjalizowanych w dziedzinach
            </span>{" "}
            niezbędnych do odpowiedniego wyszukiwania, realizowana procesu zakupu oraz dalszego
            wynajmu (jeśli taka jest wola klienta). Naszym celem jest bycie prawdziwymi doradcami,
            znającymi rynek i ciągle doszkalającymi się. Chcemy i dzielimy się wiedzą na rzecz
            naszych przyszłych klientów, chcemy móc odradzić jeśli decyzja zakupowa może nie być
            korzystna.<br></br>
            <br></br>
            <span className="text-green-600 italic font-semibold">
              Stawiamy na relacyjność w procesie sprzedaży i chcemy aby to nas wyróżniało na rynku.
              Nie wywieramy presji, jesteśmy uczciwi, staramy się dobrze planować kolejne kroki
            </span>{" "}
            aby żadna ze stron nie czuła się niekomfortowo. Zapraszamy do sprawdzenia jak nam to
            wychodzi. <br></br>
            <br></br>Możemy zrealizować dla Ciebie procesy zakupowe oraz zarządzanie nieruchomością
            w krajach: Polska, Hiszpania, Portugalia, Chorwacja, Cypr, Dubaj
          </p>
        </div>
        <ContactFormAboutUs />
        <MiniHomeView />
        <div className="flex flex-col w-10/12 mx-auto">
          <div className="flex w-full">
            <p className="w-full text-center text-3xl font-bold py-10">Jak działamy?</p>
          </div>
          <div className="w-full flex flex-wrap justify-between items-center ">
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  1. Rozmowa i poznanie intencji klienta
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Chcemy jak najdokładniej zrozumieć w jakim momecie jest nasz potencjalny, klient,
                  jak proces zakupowy został (lub nie) zaplanowany{" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">2. Propozycje nieruchomości</p>
                <p className="element-how-we-work-container-in-desc">
                  Chcemy jak najdokładniej zrozumieć w jakim momecie jest nasz potencjalny, klient,
                  jak proces zakupowy został (lub nie) zaplanowany{" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  3. Prezentacje wybranych nieruchomości
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Na tym etapie praktycznie zawsze spotykamy się z naszym klientem w Hiszpanii.
                  Planując wcześniej 1 lub 2 dni pokazujemy moliwe jak najbardziej dopasowane
                  nieruchomości{" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  4. Realizacja procesu sprzedaży
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Po decyzji zakupowej w pierwym kroku mamy rezerwację nieruchomości z płatnym
                  depozytem w kwocie 3000 - 10000 euro w przypadku inwestycji deweloperskiej.
                  Zaczynamy równiez (w rz){" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  5. Prezetnacje wybranych nieruchomości
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Chcemy jak najdokładniej zrozumieć w jakim momecie jest nasz potencjalny, klient,
                  jak proces zakupowy został (lub nie) zaplanowany{" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  6. Prezetnacje wybranych nieruchomości
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Chcemy jak najdokładniej zrozumieć w jakim momecie jest nasz potencjalny, klient,
                  jak proces zakupowy został (lub nie) zaplanowany{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-10/12 mx-auto my-20 ">
          <div className="flex flex-col justify-evenly w-full h-full">
            <p className="text-center text-3xl text-gray-900 font-bold py-10">Nasze kompetencje</p>
          </div>
          <div className="w-full h-full flex flex-wrap">
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <FaRegHandshake className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Relacyjna/partnerska <br></br>obsługa klienta
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <BsCashCoin className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Pomagamy uzyskać <br></br>kredyt w banku
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <BsTranslate className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Tłumacz<br></br>przysięgły
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <GoLaw className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Wsparcie<br></br>prawne
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <MdOutlineRealEstateAgent className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Współpraca z<br></br>deweloperami i
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <SiPowervirtualagents className="w-16 h-16 pr-2" />
              <p className="text-xl">
                Agenci na<br></br>miejscu
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-10/12 mx-auto">
        <ContactFormMain />
      </div>
      <Footer />
    </>
  );
}
