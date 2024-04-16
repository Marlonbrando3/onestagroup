import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import MiniHomeView from "../../components/SearchEngine/MiniHomeView";
import Header from "../../components/Header";
import SearchEngine from "../../components/SearchEngine/SearchEngine";
import Footer from "../../components/Footer";
import ContactFormMain from "../../components/ContactFormMain";
import MobileFilters from "@/components/MobileFilters";
import Properties from "../../public/properties.json";

export default function Home() {
  const menu = useRef<any>();
  const searchEngine = useRef<any>();
  const mobileButtonSearchEngine = useRef<any>();

  const handleShowMobileFilters = () => {
    console.log(searchEngine.current.style.top);
    if (searchEngine.current.style.top === "-360px") {
      searchEngine.current.style.top = "70px";
      mobileButtonSearchEngine.current.innerHTML = "Zamknij";
    } else {
      searchEngine.current.style.top = "-360px";
      mobileButtonSearchEngine.current.innerHTML = "Filtry";
    }
  };

  // let properties = propertiesWithSites

  // const NewsletterDiv = [];

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7E286CBN97">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KL7WKBWL')`}
      </Script>
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
      <div ref={menu} className=" duration-700 w-full z-50 bg-white">
        <Header />
      </div>
      {/* <Newsletter /> */}
      {/* <div className="fixed w-screen h-screen bg-red-900 z-30">lalalaal</div> */}
      <MiniHomeView />
      <SearchEngine
        handleShowMobileFilters={handleShowMobileFilters}
        searchEngine={searchEngine}
        mobileButtonSearchEngine={mobileButtonSearchEngine}
      />
      <ContactFormMain />
      <Footer />
    </>
  );
}
