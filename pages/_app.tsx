import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRef } from "react";
import { MyContextProvider } from "@/components/context/myContext";

export default function App({ Component, pageProps }: AppProps) {
  const cookiesWindow = useRef<any>();

  const checkCookiesOnLoad = async () => {
    let res = await fetch("https://onesta.com.pl/api/setClientCookie");
    const results = await res.json();
    const status = results.status;

    if (status !== 200) {
      setTimeout(() => {
        cookiesWindow.current.style.display = "block";
      }, 4000);
    }
  };
  // checkCookiesOnLoad();

  return (
    <MyContextProvider>
      <Component {...pageProps} cookiesWindow={cookiesWindow} />
    </MyContextProvider>
  );
}
