import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Script from "next/script";
import { useRouter } from "next/router";
import MiniHomeView from "../../../components/SearchEngine/MiniHomeView";
import Header from "../../../components/Header";
import SearchEngine from "../../../components/SearchEngine/SearchEngine";
import Footer from "../../../components/Footer";
import ContactFormMain from "../../../components/ContactFormMain";
import MobileFilters from "@/components/MobileFilters";
import Properties from "../../../public/properties.json";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";

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
        name: "Nieruchomości",
        item: "https://onesta.com.pl/nieruchomosci",
      },
      {
        "@type": "ListItem",
        position: 3,
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

  console.log(router.query.country);

  const title = `Nieruchomości ${
    Array.isArray(router.query.country)
      ? router.query.country[0].toUpperCase()
      : router.query.country?.toUpperCase()
  }`;

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script id="gtm">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KL7WKBWL');`}
      </Script>
      <Script id="google-analitycs">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7E286CBN97');
      `}
      </Script>
      <link rel="canonical" href="https://onesta.com.pl/nieruchomosci/hiszpania" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

      {/* <!-- Hotjar Tracking Code for https://onesta.com.pl --> */}
      <Script id="hotjar">
        {`(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3555670,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
                    `}
      </Script>
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
          content="Biura pośrednictwa sprzedaży nieruchomości w Hiszpanii, Portugalii, Chorwacji, Dominikanie. Przeprowdzimy Cię przez cały proces zakupowy. Nieruchomości Hiszpania, Nieruchomości Portugalia, Nieruchomości Dominikana, Nieruchomości Chorwacja."
        />
        <meta property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii" content="image" />
        <meta property="og:title" content="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"></meta>
        <meta property="og:image" content="https://onesta.com.pl/onesta_og_img.png" />
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
    type,
    region,
    market,
    bathsmin,
    bathsmax,
    bedsmin,
    bedsmax,
    pricemin,
    pricemax,
    page,
    sort,
  } = context.query;

  const filePath = path.join(process.cwd(), "public/properties.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const allProperties: Property[] = JSON.parse(raw);

  let filtered = allProperties.filter(
    (p) =>
      p.country?.name?.toLowerCase() === country.toLowerCase() &&
      (!type || type === "All" || p.section === type) &&
      (!region || region === "All" || p.foreignLocation === region) &&
      (!market || market === "All" || p.mortgageMarket === market) &&
      (!bathsmin || p.noOfBathrooms >= parseInt(bathsmin as string)) &&
      (!bathsmax || p.noOfBathrooms <= parseInt(bathsmax as string)) &&
      (!bedsmin || p.noOfRooms >= parseInt(bedsmin as string)) &&
      (!bedsmax || p.noOfRooms <= parseInt(bedsmax as string)) &&
      (!pricemin || p.price?.amount >= parseInt(pricemin as string)) &&
      (!pricemax || p.price?.amount <= parseInt(pricemax as string)),
  );

  if (sort === "cheap") {
    filtered = filtered.sort((a, b) => b.price.amount - a.price.amount);
  } else if (sort === "expensive") {
    filtered = filtered.sort((a, b) => a.price.amount - b.price.amount);
  } else {
    filtered = filtered.sort(
      (a, b) => new Date(b.actualisationDate).getTime() - new Date(a.actualisationDate).getTime(),
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
