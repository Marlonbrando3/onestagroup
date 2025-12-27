import React from "react";
import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../../components/Header";
import Link from "next/link";
import Footer from "../../components/Footer";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function Zarzadzanie() {
  const [searchShow, setSearchShow] = useState(true);

  return (
    <>
      <AnalitycsTools />
      <Head>
        <title>
          Nieruchomości Costa Blanca - informacje ogólne. - Onesta Group
        </title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      {/* <MiniHomeView /> */}
      <div className="w-10/12 mx-auto my-20">
        <h1 className="text-2xl font-bold">
          Nieruchomości Costa Blanca - podstawowe informacje.
        </h1>
        <br></br>
        Costa Blanca to popularny region w Hiszpanii, który przyciąga wiele osób
        zainteresowanych zakupem nieruchomości w Hiszpanii, w ostatnim czasie
        szczególnie polaków. <br></br>
        Położona na wschodnim wybrzeżu Hiszpanii, Costa Blanca oferuje piękne
        plaże, klimat sprzyjający przez większość roku i wiele udogodnień, które
        przyciągają turystów z całego świata tj. dobra komunikacja do lotniska w
        Alicante, które jest w centrum regionu.<br></br>
        Szukając nieruchomości na Costa Blanca można znaleźć ich wiele:
        apartamenty, domy i wille, które są dostępne w różnych cenach i
        lokalizacjach. Najbardziej popularne miejsca na zakup nieruchomości na
        Costa Blanca to m.in. miasta takie jak południowa część tego regionu -
        San Pedro del Pinatar, Santiago de La Ribera, Torrevieja, La Mana, Punta
        Prima, Mil Palmeras. Część północna - Altea, Benidorm, Calp, Moraira.
        {/* Najciekawszym i jednocześnie historycznym miastem w Hiszpanii, gdzie warto jest rozejrzeć się za swoją pierwszą nieruchomością w Hiszpanii jest San Pedro del Pinatar, o który można poczytać klikając TUTAJ. */}
        <br></br>
        <br></br>
        <p className="font-bold">
          Uśrednione ceny nieruchomości na Costa Blanca w wybranych
          miejscowościach:
        </p>
        <br></br>
        <div>
          <p>
            <b>Moraira:</b> ok 2344 / m2. Kwoty wynajmu: wysokie
          </p>
          <p>
            <b>Santa Pola:</b> ok 1666 / m2. Kwoty wynajmu: średnie
          </p>
          <p>
            <b>Altea:</b> ok 2049 / m2. Kwoty wynajmu: wysokie
          </p>
          <p>
            <b>Calpe:</b> ok 2057 / m2. Kwoty wynajmu: średnie
          </p>
          <p>
            <b>Benidorm:</b> ok 2156 / m2. Kwoty wynajmu: wysokie
          </p>
          <p>
            <b>Torrevieja:</b> ok 1683 / m2. Kwoty wynajmu: niskie
          </p>
          <p>
            <b>Pillar De La Horadada:</b> ok 2164 / m2. Kwoty wynajmu: średnie
          </p>
          <p>
            <b>Torre De La Horadada:</b> ok 2153 / m2. Kwoty wynajmu: średnie
          </p>
          <p>
            <b>Orihuela Costa:</b> ok 2073 / m2. Kwoty wynajmu: średnie
          </p>
          <p>
            <b>San Pedro del Pinatar:</b> ok 2050 / m2. Kwoty wynajmu:
            średnie-wyższe
          </p>
          <p>
            <b>San Diego de La Ribera:</b> ok 2050 / m2. Kwoty wynajmu:
            średni-wyższe
          </p>
          <p>
            <b>Orihuela Costa:</b> ok 2073 / m2. Kwoty wynajmu: średnie
          </p>
        </div>
        <br></br>
        <br></br>
        <b>Poznaj San Pedro del Pinatar</b>{" "}
        <a
          href="https//onesta.com.pl/blog/region-san-pedro-del-pinatar"
          className="text-blue-900 font-bold underline"
        >
          klikając tutaj
        </a>
        , wg. naszych klientów jedno z ciekawszych miejsc do zakupu
        nieruchomości w Hiszpanii.
        <br></br>
        Ceny nieruchomości na Costa Blanca różnią się w zależności od
        lokalizacji, typu nieruchomości oraz standardu wykończenia. Jednakże, w
        porównaniu do innych regionów w Hiszpanii, są stosunkowo atrakcyjne.
        Mało tego, region uznawany jako mało deszczowy pozwala na zaplanowanie
        wakacji z założeniem, że pogoda nie zaskoczy nas negatywnie np. ulewą,
        dotyczy to głównie południowej części Costa Blanca. Północna część Costa
        Blanca jest regionem nieco bardziej zielonym ale im wyżej się
        przemieszczamy - nieco chłodniejszym, za to południowa jego część to
        wysokie temperatury przez całą dobę i i prawie zawsze słońce.
        <br></br>
        <br></br>W ostatnich latach ceny nieruchomości w tym regionie wzrosły,
        co może być spowodowane rosnącym zainteresowaniem inwestorów z różnych
        krajów. Niemniej i tak są one dobre w stosunku do np. Costa del Sol,
        gdzie trzeba się liczyć z cenami wyższymi o ok. 20%. Ponadto zakup
        nieruchomości na Costa Blanca cechuje się jednym z wyższych, jeśli nie
        najwyższym ROI czyli zwrotem z inwestycji na poziomie 6-7% netto (
        <b>
          <a
            href="https://onesta.com.pl/hiszpania?page=1"
            className="text-blue-900 underline font-bold"
          >
            owe nieruchomości znajdziesz po kliknięciu tutaj
          </a>
        </b>
        ), czyli po odjęciu wszystkich kosztów i podatków. W zakres usług dla
        nabywców oferowanych przez agencje nieruchomości na Costa Blanca wchodzi
        m.in. znalezienie odpowiedniej nieruchomości, pomoc w uzyskaniu kredytu
        hipotecznego, przeprowadzenie negocjacji oraz kompleksowa obsługa
        transakcji. Podsumowując, zakup nieruchomości na Costa Blanca to dobry
        wybór dla osób szukających miejsca do zamieszkania lub inwestycji w
        Hiszpanii. Oferta nieruchomości jest bogata i zróżnicowana, a agencje
        nieruchomości oferują kompleksowe usługi, które ułatwiają proces zakupu.
      </div>
      <ContactFormBlogPost temat="Nieruchomości Costa Blanca - podstawowe informacje." />
      <br></br>
      <br></br>
      <Footer />
    </>
  );
}
