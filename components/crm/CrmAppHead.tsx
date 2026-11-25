import Head from "next/head";
import { useEffect } from "react";

// Instalowalna aplikacja (PWA) dla CRM: manifest, ikony, service worker do powiadomień.
export default function CrmAppHead() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/crm-sw.js", { scope: "/crm" }).catch(() => undefined);
  }, []);

  return (
    <Head>
      <link rel="manifest" href="/crm-app/manifest.webmanifest" />
      <link rel="apple-touch-icon" href="/crm-app/apple-touch-icon.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Onesta CRM" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Head>
  );
}
