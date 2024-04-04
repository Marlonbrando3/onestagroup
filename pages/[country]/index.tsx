import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import MiniHomeView from "../../components/SearchEngine/MiniHomeView";
import Header from "../../components/Header";
import SearchEngine from "../../components/SearchEngine/SearchEngine";
import Footer from "../../components/Footer";
import ContactFormMain from "../../components/ContactFormMain";
import Properties from "../../public/properties.json";

export default function Home() {
  const router = useRouter();
  const menu = useRef();

  // let properties = propertiesWithSites
  const [sitesArray, setSitesArray] = useState(["1", "1", "1"]);

  const ppp = [];

  //   region,
  //   pool,
  //   page,
  //   seaview,
  //   bungalow,
  //   apartament,
  //   house,
  //   garden,
  //   parking,
  //   balcony,
  //   solarium,
  //   pricefrom,
  //   priceto,
  //   bedf,
  //   bedt,
  //   bathf,
  //   batht,
  //   distance,
  //   type,
  // } = router.query;

  // const { showSearchComponentsOnMobile, SearchFilters, setSearchFilters } = useContext(AppContext);

  //actual choosed country from router
  const [ActualCountry, setActualCountry] = useState(router.query.country);

  //actual active site
  const [actualSite, setActualSite] = useState(1);

  //INDEX
  const [choosedCountry, setChoosedCountry] = useState({
    id: "",
    country: "",
    region: "",
    city: "",
    title: "",
    market: "",
    type: "",
    bathrooms: "",
    bedrooms: "",
    seaview: false,
    pool: false,
    parking: false,
    garden: false,
    solarium: false,
    balcony: false,
    price: "",
    distancetothesea: "",
  });

  // const properties = propertiesFromBase;

  const NewsletterDiv = [];

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7E286CBN97"></Script>
      <Script id="ga">
        {` window.dataLayer = window.dataLayer || [];
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

      {/* <!-- Hotjar Tracking Code for https://onesta.com.pl --> */}
      <Script id="hotjar">
        {`
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:3826073,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
      </Script>
      <Head>
        <title>
          Nieruchomości Hiszpania || Nieruchomości Portgualia || Nieruchomości Dominikana - Onesta
          Group
        </title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
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
      {/* <div
        className={
          showSearchComponentsOnMobile === false ? "overflow-x-hidden" : "h-0 overflow-hidden"
        }
      > */}
      <div ref={menu} className="fixed duration-700 w-full z-50 bg-white">
        <Header />
      </div>
      {/* <Newsletter /> */}
      <MiniHomeView />
      {/* <div id="shadowSearch" className='absolute w-full h-screen bg-gray-900/[0.6] z-[50]'></div> */}
      {/* <CountryIndexContext.Provider value={{ SearchFilters, setSearchFilters, PropertiesLength }}> */}
      <SearchEngine />
      <ContactFormMain />
      <Footer />
      {/* </div> */}
    </>
  );
}
