import React from "react";
import Header from "@/components/newProjects/Header/header";
import Slider from "@/components/newProjects/slider/slider";
import { DMSerif, TenorsSans, QuicksandSans, GreatVibes, TinosFont } from "@/fonts/fonts";
import MainDescription from "@/components/newProjects/descriptions/mainDescription";
import AboutProperty from "@/components/newProjects/aboutProperty/aboutProperty";
import Listing from "@/components/newProjects/listing/listing";
import Properties from "../../../public/properties.json";
import cities from "../../../data/cities.json";
import City from "@/components/newProjects/aboutCity/city";
import FirstDescription from "@/components/newProjects/descriptions/firstDescription";
import SecondDescription from "@/components/newProjects/descriptions/secondDescription";
import ThirthDescription from "@/components/newProjects/descriptions/thirthDescription";

export default function index() {
  // const investition = Properties.filter((i) => i.section === "Investment");
  console.log(investition);

  // foreignStreet;

  return (
    <div className="bg-orange-100 w-screen">
      <div className={`${TenorsSans.className} w-[90vw] mx-auto`}>
        <Header />
        <Slider />
        <MainDescription investition={investition} />
        <AboutProperty investition={investition} />
        <FirstDescription investition={investition} />
        <SecondDescription investition={investition} />
        <ThirthDescription investition={investition} />
        <Listing investition={investition} />
        <City />
      </div>
    </div>
  );
}
