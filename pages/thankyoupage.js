import { React } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Head from "next/head";
import Script from "next/script";

export default function Thankyoupage() {
  const router = useRouter();

  const handleGoingBackToSearch = () => {
    router.push({
      pathname: "https://onesta.com.pl/hiszpania?page=1",
      query: { page: 1 },
    });
  };

  return (
    <div className="w-screen h-screen">
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
                        h._hjSettings={hjid:3555670,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
      </Script>
      <Head>
        <title>Dziękujęmy- Onesta Group</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii" content="image" />
        <meta property="og:title" content="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"></meta>
        <meta property="og:image" content="https://onesta.com.pl/onesta_og_img.png" />
      </Head>
      <Header></Header>
      <div className="w-screen md:w-[900px] mx-auto text-[35px] text-center font-semibold mt-[150px]">
        Dziękujemy za poprawne uzupenienie formularza. <br></br>Wkrótce się z Państwem
        skontaktujemy.<br></br>
        <button
          onClick={handleGoingBackToSearch}
          className="duration-200 px-[10px] py-[5px] border-2 border-green-600 bg-green-600 my-[20px] text-white text-[20px] hover:bg-white hover:border-green-700 hover:text-green-700"
        >
          Wróć do wyszukiwania
        </button>
      </div>
    </div>
  );
}
