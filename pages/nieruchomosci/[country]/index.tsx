import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Script from "next/script";
import { useRouter } from "next/router";
import DataCountry from "../../../data/DataCountry.json";
import MiniHomeView from "../../../components/SearchEngine/MiniHomeView";
import Header from "../../../components/Header";
import SearchEngine from "../../../components/SearchEngine/SearchEngine";
import Footer from "../../../components/Footer";
import ContactFormMain from "../../../components/ContactFormMain";
import MobileFilters from "@/components/MobileFilters";
import Properties from "../../../public/properties.json";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import AnalitycsTools from "@/analitycs/analitycsTools";

interface Property {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  country: { name: string };
  section: string;
  foreignLocation: string;
  mortgageMarket: string;
  noOfBathrooms: number;
  noOfRooms: number;
  price: { amount: number };
  actualisationDate: string;
}

export default function Home(props: any) {
  const router = useRouter();

  console.log(props);

  const menu = useRef<any>();
  const searchEngine = useRef<any>();
  const mobileButtonSearchEngine = useRef<any>();

  const { country } = router.query;

  const countryNames: Record<string, string> = {
    hiszpania: "Hiszpania",
    portugalia: "Portugalia",
    cypr: "Cypr",
    wlochy: "Włochy",
  };

  // Jeśli jeszcze nie gotowe
  if (!country || typeof country !== "string") return null;

  const countryName = countryNames[country.toLowerCase()] || country;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: "https://onesta.com.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: countryName,
        item: `https://onesta.com.pl/nieruchomosci/${country}`,
      },
    ],
  };

  const handleShowMobileFilters = () => {
    console.log(searchEngine.current.style.top);
    if (
      searchEngine.current.style.top === "-400px" ||
      searchEngine.current.style.top === "-460px" ||
      searchEngine.current.style.top === ""
    ) {
      searchEngine.current.style.top = "70px";
      mobileButtonSearchEngine.current.innerHTML = "Zamknij";
    } else {
      searchEngine.current.style.top = "-460px";
      mobileButtonSearchEngine.current.innerHTML = "Filtry";
    }
  };

  const title = `Nieruchomości ${
    Array.isArray(router.query.country)
      ? router.query.country[0].toUpperCase()
      : router.query.country?.toUpperCase()
  }`;

  const canonicalHref = `https://onesta.com.pl/nieruchomosci/${country}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta
          name="Description"
          content="Biura pośrednictwa sprzedaży nieruchomości, które prezetuje najciekawsze ogłoszenia w ciepłych krajach. Przeprowdzimy Cię przez cały proces zakupowy Twojego drugiego domu"
        />
        <meta
          property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
          content="image"
        />
        <meta
          property="og:title"
          content="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
        ></meta>
        <meta
          property="og:image"
          content="https://onesta.com.pl/onesta_og_img.png"
        />
      </Head>
      <WhatsAppButton />
      <div ref={menu} className="duration-700 w-full z-50 bg-white">
        <Header />
      </div>
      {/* <Newsletter /> */}
      {/* <div className="fixed w-screen h-screen bg-red-900 z-30">lalalaal</div> */}
      <MiniHomeView />
      <SearchEngine
        handleShowMobileFilters={handleShowMobileFilters}
        searchEngine={searchEngine}
        mobileButtonSearchEngine={mobileButtonSearchEngine}
        {...props}
      />
      <ContactFormMain />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const fs = require("fs");
  const path = require("path");

  const { country } = context.params as { country: string };
  const {
    zabudowa,
    region,
    rynek,
    lazienek_od,
    lazienek_do,
    sypialni_od,
    sypialni_do,
    cena_od,
    cena_do,
    page,
    sort,
  } = context.query;

  const filePath = path.join(process.cwd(), "public/properties.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const allProperties: Property[] = JSON.parse(raw);

  const formatRegion = () => {
    const data = DataCountry.find((i) => i.country === country);
    const reg = data!.query.find((i) => i.query === region);
    return reg!.querySearch;
  };

  let filtered = allProperties.filter(
    (p) =>
      p.country?.name?.toLowerCase() === country.toLowerCase() &&
      (!zabudowa ||
        zabudowa === "All" ||
        p.section.toLowerCase() == (zabudowa as string)) &&
      (!region || region === "All" || p.foreignLocation === formatRegion()) &&
      (!rynek ||
        rynek === "All" ||
        p.mortgageMarket ===
          (rynek === "pierwotny" ? "Primary" : "Secondary")) &&
      (!lazienek_od || p.noOfBathrooms >= parseInt(lazienek_od as string)) &&
      (!lazienek_do || p.noOfBathrooms <= parseInt(lazienek_do as string)) &&
      (!sypialni_od || p.noOfRooms >= parseInt(sypialni_od as string)) &&
      (!sypialni_do || p.noOfRooms <= parseInt(sypialni_do as string)) &&
      (!cena_od || p.price?.amount >= parseInt(cena_od as string)) &&
      (!cena_do || p.price?.amount <= parseInt(cena_do as string))
  );

  if (sort === "cheap") {
    filtered = filtered.sort((a, b) => b.price.amount - a.price.amount);
  } else if (sort === "expensive") {
    filtered = filtered.sort((a, b) => a.price.amount - b.price.amount);
  } else {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.actualisationDate).getTime() -
        new Date(a.actualisationDate).getTime()
    );
  }

  return {
    props: {
      properties: filtered,
      country,
      query: context.query,
    },
  };
};
