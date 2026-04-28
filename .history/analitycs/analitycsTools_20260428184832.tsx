"use client";

import Script from "next/script";

export default function AnalitycsTools() {
  return (
    <>
      {/* Cookie consent */}
      <Script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/2e3a14035f8a1b4efce3a26bdd1288d1/script.js"
        strategy="lazyOnload"
      />

      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="lazyOnload">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '178665974358939');
        fbq('track', 'PageView');`}
      </Script>

      {/* GTM */}
      <Script
        id="gtm"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-K6W6ZBV"
        strategy="afterInteractive"
      />

      {/* Hotjar */}
      <Script id="hotjar" strategy="lazyOnload">
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
    </>
  );
}
