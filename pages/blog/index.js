import React from "react";
import HeaderBlog from "../../components/HeaderBlog";
import Head from "next/head";
import Header from "../../components/Header";
import AnalitycsTools from "@/analitycs/analitycsTools";
import BlogItems from "../../components/BlogItems";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";

export default function Blog() {
  return (
    <div>
      <Head>
        <title>Baza wiedzy - Onesta Group</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 bg-white z-20 shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlog />
      <MiniMainViewBlog />
      <BlogItems />
    </div>
  );
}
