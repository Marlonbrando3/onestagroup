import React from "react";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../Header";
import HowWeWork from "../SearchEngine/howWeWork";
import ContactFormMain from "../ContactFormMain";
import Footer from "../Footer";
import { FaHandsHelping } from "react-icons/fa";
import AboutSpain from "../aboutSpain";
import { MdSavings } from "react-icons/md";
import { SiGoogletranslate } from "react-icons/si";
import { GoLaw } from "react-icons/go";
import { BsFillBuildingsFill } from "react-icons/bs";
import { SiPowervirtualagents } from "react-icons/si";
import ContactFormAboutUs from "../ContactFormAboutUs";
import Skill from "../ourskills/skill";
import OurSkillsJSON from "../../data/skills.json";

export default function Aboutus() {
  const [searchShow, setSearchShow] = useState(true);

  const data = OurSkillsJSON.map((i) => <Skill key={i} desc={i} />);

  return (
    <>
      <div className="bg-gray-900/[0.0]">
        <HowWeWork />
        {/* <AboutSpain /> */}
        <ContactFormAboutUs />
        <div className="flex w-full mx-auto my-20 flex-wrap bg-slate-800 justify-center py-[70px]">
          {data}
        </div>
      </div>
      <div className="w-11/12 mx-auto">
        <ContactFormMain />
      </div>
      {/* <Footer /> */}
    </>
  );
}
