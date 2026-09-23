import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function App({ Component, pageProps }: AppProps) {
  const cookiesWindow = useRef<any>();
  const router = useRouter();

  // _document sets the initial SSR language; keep it correct after client navigation.
  useEffect(() => {
    document.documentElement.lang =
      router.pathname === "/en" || router.pathname.startsWith("/en/")
        ? "en"
        : "pl";
  }, [router.pathname]);

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
      <Component {...pageProps} cookiesWindow={cookiesWindow} />
    </>
  );
}
