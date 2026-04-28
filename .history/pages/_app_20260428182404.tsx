import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { MyContextProvider } from "@/components/context/myContext";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function App({ Component, pageProps }: AppProps) {
  const cookiesWindow = useRef<any>();

  useEffect(() => {
    // To blokuje automatyczny scroll Next.js przy przycisku "Wstecz"
    router.beforePopState((state) => {
      state.options.scroll = false;
      return true;
    });
  }, [router]);

  return (
    <>
      <AnalitycsTools />
      <MyContextProvider>
        <Component {...pageProps} cookiesWindow={cookiesWindow} />
      </MyContextProvider>
    </>
  );
}
