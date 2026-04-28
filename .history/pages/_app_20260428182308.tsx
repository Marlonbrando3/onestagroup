import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

import type { AppProps } from "next/app";
import { useRef } from "react";
import { MyContextProvider } from "@/components/context/myContext";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function App({ Component, pageProps }: AppProps) {
  const cookiesWindow = useRef<any>();

  function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
      // 1. Funkcja przywracająca scroll
      const handleRouteChangeComplete = (url: string) => {
        const scrollPos = sessionStorage.getItem(`scrollPos:${url}`);
        if (scrollPos) {
          window.scrollTo(0, parseInt(scrollPos));
        }
      };

      // 2. Funkcja zapisująca scroll przed wyjściem
      const handleRouteChangeStart = () => {
        sessionStorage.setItem(
          `scrollPos:${router.asPath}`,
          window.scrollY.toString(),
        );
      };

      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.on("routeChangeComplete", handleRouteChangeComplete);

      return () => {
        router.events.off("routeChangeStart", handleRouteChangeStart);
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      };
    }, [router]);

    return <Component {...pageProps} />;
  }

  return (
    <>
      <AnalitycsTools />
      <MyContextProvider>
        <Component {...pageProps} cookiesWindow={cookiesWindow} />
      </MyContextProvider>
    </>
  );
}
