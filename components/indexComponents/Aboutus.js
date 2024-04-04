import React from "react";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../Header";
import MiniHomeView from "../SearchEngine/MiniHomeView";
import ContactFormMain from "../ContactFormMain";
import Footer from "../Footer";
import { FaHandsHelping } from "react-icons/fa";
import AboutSpain from "../aboutSpain";
import { MdSavings } from "react-icons/md";
import { SiGoogletranslate } from "react-icons/si";
import { GoLaw } from "react-icons/go";
import { BsFillBuildingsFill } from "react-icons/bs";
import { SiPowervirtualagents } from "react-icons/si";
import ContactFormAboutUs from "../ContactFormAboutUs";

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
      <div className="bg-gray-900/[0.0]">
        <div className="flex flex-col w-[95vw] lg:w-[1200px] md:text-[22px] text-[18px] mx-auto justify-evenly">
          <p className="w-10/12 mx-auto text-center text-[34px] font-semibold py-10">
            Onesta Group - agencja inna niż wszystkie
          </p>
          <div className="w-8/12 mx-auto h-1 bg-red-900"></div>
          <p className="md:w-10/12 mx-auto leading-8 py-10">
            Jesteśmy grupą ludzi z wieloletnią pasją do dobrych relacji, dalekich podróży, ciepłych
            krajów, nieruchomości.{" "}
            <span className="text-green-600 font-bold">
              Propagujemy inwestowanie w nieruchomości w ciepłych krajach tj. Hiszpania, Portugalia
              lub Dominikana
            </span>{" "}
            ponieważ uznaliśmy, że jest to jedna z przyjemniejszych i efektywniejszych form
            inwestowania. Taka własność w postaci mieszkania lub apartamentu w efekcie daje nie
            tylko możliwość wybrania sobie swojego drugiego domu w słonecznym kraju, spędzenia tam
            czasu ale również przyjemną i bezpieczną formę inwestowania.
            <br></br>
            <br></br>
            Zatem grupa{" "}
            <span className="text-green-600 font-bold">
              Onesta powstała z chęci uczynienia życia naszych klientów oraz naszego własnego -
              przyjemniejszym. Oparliśmy nasze idee na wartościach i potrzebach klientów i
              wystepujemy w Jego imieniu i Jego interesie u Deweloperów, agencji pośrednictwa w
              przypadku negocjacji ogłoszeń.
            </span>
            <br></br>
            <br></br>
            Na rynku nieruchomości działamy od 5 lat wraz ze sprawdzonymi partnerami w każdym z
            krajów posiadających również wieloletnie doświadczenie oraz wyspecjalizowanych w
            dziedzinach niezbędnych do odpowiedniego wyszukiwania, realizowana procesu zakupu oraz
            dalszego wynajmu (jeśli taka jest wola klienta) nieruchomości. Naszym celem jest bycie
            prawdziwymi doradcami, znającymi rynek i ciągle doszkalającymi się. <br></br>
            <br></br>Chcemy i dzielimy się wiedzą na rzecz naszych przyszłych klientów, chcemy móc
            doradzić lub odradzić jeśli decyzja zakupowa może być lub nie być korzystna.<br></br>
            <br></br>
            We współpracy z klientami stawiamy na relację, zrozumienie klienta, odnalezienie
            wspólnego języka i to nas wyróżnia. Zdajemy sobie sprawę, że nasze cechy miekkię to nasz
            wyróżnik bardzo potrzebny w czasach agresywnej sprzedaży. Nie wywieramy presji, jesteśmy
            uczciwi, staramy się dobrze planować kolejne kroki aby każda ze stron czuła się
            komfortowo. Zapraszamy do sprawdzenia jak nam to wychodzi. <br></br>
            <br></br>
            <span className="text-green-600 font-bold">
              Możemy zrealizować dla Ciebie procesy zakupowe oraz zarządzanie nieruchomością w
              krajach: Polska, Hiszpania, Portugalia, Chorwacja, Cypr, Dubaj, Dominikana.
            </span>
          </p>
        </div>
        <div className="md:w-7/12 w-[90vw] md:h-[200px] mx-auto text-lg leading-7 flex flex-col md:flex-row items-center justify-center">
          <div className="relative w-[150px] h-[150px]">
            <Image src="/Maro_fota_strona.png" fill className="object-contain" />
          </div>
          <div className="md:ml-[50px] flex flex-col items-center">
            <p className="md:w-[600px] italic leading-5 text-[15px]">
              &quot;Dziękuję, że rozważasz skorzystanie z pomocy usług Onesta Group. Skontaktuj się
              z nami i porozmawiajmy o tym co możemy dla Ciebie zrobić, a zrobimy wszystko aby
              współpraca z nami była przyjemna i skuteczna. <br></br>
              Do usłyszenia!&quot;
            </p>
            <p className="text-[18px] font-bold leading-[20px]">Marek Marszałek</p>
            <p className="text-[14px] font-bold leading-[20px]">Założyciel</p>
          </div>
        </div>
        <MiniHomeView />
        <AboutSpain />
        <ContactFormAboutUs />
        <div className="flex flex-col w-10/12 lg:w-[1200px]  mx-auto">
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
                  Na tym etapie praktycznie zawsze spotykamy się z naszym klientem w Hiszpanii lub
                  innym kraju. Planując wcześniej 1 lub 2 dni pokazujemy moliwe jak najbardziej
                  dopasowane nieruchomości{" "}
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  4. Warunki i rezerwacja nieruchomości.
                </p>
                <p className="element-how-we-work-container-in-desc">
                  Po decyzji zakupowej w pierwym kroku mamy rezerwację nieruchomości z płatnym
                  depozytem w kwocie 3000 - 10000 euro w przypadku inwestycji deweloperskiej.
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">5. Kolejne transze.</p>
                <p className="element-how-we-work-container-in-desc">
                  Rynek nieruchomości w Hiszpanii, Chorwacji czy Domonikanie przeżywa prawdziwy
                  rozkwit, dlatego płatności nastepują w transzach. Na ogół jedynie 50% kwoty
                  powinna być wpłacona przed aktem notarialnym, pozostała część po oddaniu obiektu
                  do użytku i bezpośrednio przed aktem notarialnym.
                </p>
              </div>
            </div>
            <div className="element-how-we-work-container">
              <div className="element-how-we-work-container-in">
                <p className="element-how-we-work-container-in-p">
                  6. Przekazanie kluczy i dalsze kroki
                </p>
                <p className="element-how-we-work-container-in-desc">
                  W zależności od tego jaki jest cel zakupowy, nieruchomość możemy umeblować,
                  uzyskać licencje i przekazać pod wynajem lub w całości pozostawić do dyspozuycji
                  klientowi np. wskazując jakie mogą być kolejne kroki.
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
              <FaHandsHelping className="w-[80px] h-[80px] pr-2" />
              <p className="text-xl">
                Relacyjna/partnerska <br></br>obsługa klienta
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <MdSavings className="w-[80px] h-[80px] pr-2" />
              <p className="text-xl">
                Pomagamy uzyskać <br></br>kredyt w banku
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <SiGoogletranslate className="w-[80px] h-[80px] pr-2" />
              <p className="text-xl">
                Tłumacz<br></br>przysięgły
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <GoLaw className="w-[80px] h-[80px] pr-2" />
              <p className="text-xl">
                Wsparcie<br></br>prawne
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <BsFillBuildingsFill className="w-[80px] h-[80px] pr-2" />
              <p className="text-xl">
                Współpraca z<br></br>deweloperami i
              </p>
            </div>
            <div className=" flex justify-start items-center xl:w-1/3 sm:w-1/2 w-full h-1/2 sm:py-2 py-5">
              <SiPowervirtualagents className="w-[80px] h-[80px] pr-2" />
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
      {/* <Footer /> */}
    </>
  );
}
