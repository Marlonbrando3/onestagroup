import React from "react";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import MiniHomeViewAboutUs from "../components/SearchEngine/MiniHomeViewAboutUs";
import Footer from "../components/Footer";
import Ourteammain from "@/components/ourteammain/ourteammain";
import AboutUsInspired from "@/components/AboutUsInspired";
import AboutUsRightForm from "@/components/AboutUsRightForm";

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
      <section className="xl:w-[1250px] min-[1205px]:w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[auto_400px] gap-8 items-start py-10">
        <div className="w-full">
          <AboutUsInspired embedded />
          <Ourteammain embedded />
        </div>
        <div className="w-full">
          <AboutUsRightForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
