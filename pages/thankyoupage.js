import { React } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Head from "next/head";
import AnalitycsTools from "@/analitycs/analitycsTools";

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
      <AnalitycsTools />
      <Head>
        <title>Dziękujęmy- Onesta Group</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta
          property="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
          content="image"
        />
        <meta
          property="og:title"
          content="Nieruchomości w Hiszpanii, Chorwacji, Portugalii"
        ></meta>
        <meta
          property="og:image"
          content="https://onesta.com.pl/onesta_og_img.png"
        />
      </Head>
      <Header></Header>
      <div className="w-screen md:w-[900px] mx-auto text-[35px] text-center font-semibold mt-[150px]">
        Dziękujemy za poprawne uzupenienie formularza. <br></br>Wkrótce się z
        Państwem skontaktujemy.<br></br>
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
