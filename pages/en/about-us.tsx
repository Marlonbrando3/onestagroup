import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import MiniHomeViewAboutUs from "@/components/SearchEngine/MiniHomeViewAboutUs";
import Footer from "@/components/Footer";
import Ourteammain from "@/components/ourteammain/ourteammain";
import AboutUsInspired from "@/components/AboutUsInspired";
import AboutUsRightForm from "@/components/AboutUsRightForm";

export default function AboutUsEnglish() {
  return (
    <>
      <Head>
        <title>About us - Onesta Group</title>
        <meta
          name="description"
          content="Meet Onesta Group: a buyer-side team supporting clients in safe overseas property purchases, from market selection to formalities and handover."
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="alternate" hrefLang="pl" href="https://onesta.com.pl/aboutus" />
        <link rel="alternate" hrefLang="en" href="https://onesta.com.pl/en/about-us" />
      </Head>
      <div className="main-index">
        <div className="w-full h-14 fixed top-0 md:bg-gray-800/[0.4] z-20 bg-white shadow-xl">
          <Header locale="en" />
        </div>
      </div>
      <MiniHomeViewAboutUs locale="en" />
      <section className="xl:w-[1250px] lg:w-[1000px] w-[90vw] mx-auto grid grid-cols-1 xl:grid-cols-[auto_400px] lg:grid-cols-[auto_300px] gap-8 items-start py-10">
        <div className="w-full">
          <AboutUsInspired embedded locale="en" />
          <Ourteammain embedded locale="en" />
        </div>
        <div className="w-full">
          <AboutUsRightForm locale="en" />
        </div>
      </section>
      <Footer locale="en" />
    </>
  );
}
