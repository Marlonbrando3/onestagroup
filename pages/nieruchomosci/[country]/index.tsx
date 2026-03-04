import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import DataCountry from "../../../data/DataCountry.json";
import MiniHomeView from "../../../components/SearchEngine/MiniHomeView";
import Header from "../../../components/Header";
import SearchEngine from "../../../components/SearchEngine/SearchEngine";
import Footer from "../../../components/Footer";
import ContactFormMain from "../../../components/ContactFormMain";
import AnalitycsTools from "@/analitycs/analitycsTools";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Property from "./[title]";

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
        count={props.totalCount}
        {...props}
      />
      <ContactFormMain />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = require("path");

  const { country } = context.params as { country: string };
  const page = parseInt((context.query.page as string) || "1");

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
    sort,
  } = context.query;

  //download data from Asari (without costa blanca and costa calida)
  const filePath = path.join(process.cwd(), "public/properties.json");

  //download data from supabase for Costa Blanca and Calida (full data)

  const limit = 18;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  //regions mapping with supabase
  const regionFilters: Record<any, any> = {
    "costa-blanca": ["Alicante", "Murcia"],
    "costa-del-sol": ["Malaga"],
  };

  //choosed region
  const provinces =
    region && regionFilters[region] ? regionFilters[region] : undefined;
  const bathsFrom = lazienek_od ? Number(lazienek_od) : 0;
  const bathsTo = lazienek_do ? Number(lazienek_do) : 99;
  const bedsFrom = sypialni_od ? Number(sypialni_od) : 0;
  const bedsTo = sypialni_do ? Number(sypialni_do) : 99;
  const priceFrom = cena_od ? Number(cena_od) : 0;
  const priceTo = cena_do ? Number(cena_do) : 99999999;
  // const poolFilter = basen ? true : undefined;

  let query = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .in("province", provinces ?? ["Alicante", "Murcia", "Malaga"])
    .gte("baths", bathsFrom)
    .lte("baths", bathsTo)
    .gte("beds", bedsFrom)
    .lte("beds", bedsTo)
    .gte("price", priceFrom)
    .lte("price", priceTo)
    .not("images", "is", null)
    .neq("images", "[]")
    .order("external_id", { ascending: false })
    .range(from, to);

  const { data: properties, count, error: queryError } = await query;

  return {
    props: {
      properties: properties,
      country,
      totalCount: count,
      query: context.query,
    },
  };
};
