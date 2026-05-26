import React from "react";
import { useState } from "react";
import Head from "next/head";
import HeaderAboutUs from "../components/HeaderAboutUs";
import MiniHomeViewAboutUs from "../components/SearchEngine/MiniHomeViewAboutUs";
import ContactFormMain from "../components/ContactFormMain";
import Footer from "../components/Footer";
import Ourteammain from "@/components/ourteammain/ourteammain";
import AboutUsInspired from "@/components/AboutUsInspired";

export default function Aboutus() {
  const [searchShow, setSearchShow] = useState(true);
  return (
    <>
      <Head>
        <title>O Nas - Onesta Group</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="main-index">
        <div className="w-full h-14 fixed top-0 md:bg-gray-800/[0.4] z-20 bg-white shadow-xl">
          <Header searchShow={searchShow} />
        </div>
      </div>
      <MiniHomeViewAboutUs />
      <AboutUsInspired />
      <Ourteammain />
      <div className="w-10/12 mx-auto my-[30px]">
        <ContactFormMain />
      </div>
      <Footer />
    </>
  );
}
