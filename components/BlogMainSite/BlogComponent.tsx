import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../../fonts/fonts";
import { useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDropright } from "react-icons/io";
import WhatWeDo from "../whatWeDo/whatWeDo";
import { BsPersonHearts } from "react-icons/bs";
import Image from "next/image";
import { FaQuoteRight } from "react-icons/fa";

import ProcessStepsElements from "../ProcesDescriptionsMainSite/ProcessStepsElements";
// import processDesc from "../../data/processDesc.json";
import ProcesDescription from "../ProcesDescriptionsMainSite/procesDescription";

export default function BlogComponent() {
  const strategy = useRef();
  const preselection = useRef();
  const negotiations = useRef();
  const prezentation = useRef();
  const loan = useRef();
  const notary = useRef();
  const renting = useRef();
  const law = useRef();

  const [descChoosed, setDescChoosed] = useState("strategy");

  const handleShowingDesc = (e: any) => {
    console.log(e);
    setDescChoosed(e);
  };

  return (
    <div className="bg-[url('/polygons.svg')] bg-cover w-screen mb-[100px]">
      <div
        className={`${MontserratSans.className} w-[90vw] h-auto  mx-auto flex flex-wrap`}
      >
        <div className="w-full h-[100px]">
          <p className="md:text-[32px] text-[22px] text-[#275278] w-auto font-[400] items-center md:inline-flex mb-[100px]">
            Co mówią o nas{" "}
            <span className="font-[800]"> &nbsp;nasi klienci</span>
          </p>
        </div>
        <div className="w-full relative rounded-[10px] flex flex-wrap content-start items-center gap-3 md:pr-[50px] flex justify-between">
          <div className="border-[0.5px] border-slate-900 md:w-[30%] h-auto shadow-xl rounded-md p-[30px] flex flex-col justify-between">
            <FaQuoteRight className="absolute" />
            <p className="pt-[30px]">
              Współpraca z grupą Onesta to dla nie tylko dobre ofertowanie ale
              głównie ich wnikliwość. Panowie starali się dobrze zrozumieć to
              czego potrzebuje. Zadawali dużo pytań, na wiele z nich nie
              wiedziałam, że nie znam odpowiedzi ale potrafili mnie naprowadzić
              i później przy ofertowaniu byliśmy w stanie swobodnie wybrać te
              opcje, które faktycznie były dla nas odpowiednie. <br></br>Trudnie
              nie polecić takiego podejścia.{" "}
            </p>
            <p className="font-[700] text-[16px]">Pani Anna, Wrocław</p>
          </div>
          <div className="border-[0.5px] border-slate-900 md:w-[30%] md:h-full shadow-xl rounded-md p-[30px] flex flex-col justify-between">
            <FaQuoteRight className="absolute" />
            <p className="pt-[30px]">
              Szukaliśmy czegoś do zamieszkania i częściowego wynajmu, od
              podstaw, bez wiedzy. Myślę, że bez przeprowadzenia nas przez
              proces przez zespoł Onesta raczej podjęlibyśmy nietrafioną decyzję
              lub wogóle zrezygnowali. <br></br>Udało się i jesteśmy bardzo
              zadowoleni!{" "}
            </p>
            <p className="font-[700] text-[16px]">Pan Robert, Warszwa.</p>
          </div>
          <div className="border-[0.5px] border-slate-900 md:w-[30%] md:h-full shadow-xl rounded-md p-[30px] flex flex-col justify-between">
            <FaQuoteRight className="absolute" />
            <p className="pt-[30px]">
              Panie Marku, dziękuję za tak dobrą komunikację bez Państwa
              pośrednictwa w tym temacie raczej ten proces by się nie udał.
              Szczerze polecam.
            </p>
            <p className="font-[700] text-[16px]">Pan Tomasz, Wrocław</p>
          </div>
        </div>
      </div>
    </div>
  );
}
