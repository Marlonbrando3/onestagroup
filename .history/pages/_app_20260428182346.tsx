import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRef } from "react";
import { MyContextProvider } from "@/components/context/myContext";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function App({ Component, pageProps }: AppProps) {
  const cookiesWindow = useRef<any>();

  return (
    <>
      <AnalitycsTools />
      <MyContextProvider>
        <Component {...pageProps} cookiesWindow={cookiesWindow} />
      </MyContextProvider>
    </>
  );
}
