"use client";

import Script from "next/script";

export default function AnalitycsTools() {
  return (
    <>
      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          (function () {
            var loaded = false;
            var run = function () {
              if (loaded) return;
              loaded = true;
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '178665974358939');
              fbq('track', 'PageView');
            };
            var events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
            var start = function () {
              events.forEach(function(eventName) {
                window.removeEventListener(eventName, start, true);
              });
              run();
            };
            events.forEach(function(eventName) {
              window.addEventListener(eventName, start, { once: true, passive: true, capture: true });
            });
          })();
        `}
      </Script>

      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            var loaded = false;
            var run = function () {
              if (loaded) return;
              loaded = true;
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            };
            var events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
            var start = function () {
              events.forEach(function(eventName) {
                window.removeEventListener(eventName, start, true);
              });
              run();
            };
            events.forEach(function(eventName) {
              window.addEventListener(eventName, start, { once: true, passive: true, capture: true });
            });
          })(window,document,'script','dataLayer','GTM-NKPS7M7Z');
        `}
      </Script>

      {/* Hotjar - start after first interaction to avoid Lighthouse console noise */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function () {
            var loaded = false;
            var run = function () {
              if (loaded) return;
              loaded = true;
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:3555670,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            };
            var events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
            var start = function () {
              events.forEach(function(eventName) {
                window.removeEventListener(eventName, start, true);
              });
              run();
            };
            events.forEach(function(eventName) {
              window.addEventListener(eventName, start, { once: true, passive: true, capture: true });
            });
          })();
        `}
      </Script>
    </>
  );
}
