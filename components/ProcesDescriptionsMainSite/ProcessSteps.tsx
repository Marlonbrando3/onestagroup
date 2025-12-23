import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../../fonts/fonts";
import { useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDropright } from "react-icons/io";
import WhatWeDo from "../whatWeDo/whatWeDo";
import { BsPersonHearts } from "react-icons/bs";
import Image from "next/image";
import ProcessStepsElements from "./ProcessStepsElements";
// import processDesc from "../../data/processDesc.json";
import ProcesDescription from "./procesDescription";

type data = {
  handleConsultationPopUp: any;
};

export default function ProcessSteps({ handleConsultationPopUp }: data) {
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
    <div className="bg-[url('/polygons.svg')] bg-cover w-screen md:[mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] ">
      <div
        className={`${MontserratSans.className} w-[90vw] h-auto  mx-auto flex flex-wrap `}
      >
        <div className="w-full h-[100px]">
          <p className="md:text-[32px] text-[22px] text-[#275278] w-auto font-[400] items-center md:inline-flex mb-[100px]">
            Dowiedz się na czym polegają{" "}
            <span className="font-[800]"> &nbsp;etapy procesu zakupu</span>
          </p>
        </div>
        <div className="w-[820px] md:h-[700px] mb-[100px] md:mb-auto relative rounded-[10px] flex flex-wrap content-start items-center md:gap-3 gap-1 pr-[50px]">
          <ProcessStepsElements
            t="Strategia współpracy"
            name="strategy"
            data-ref={strategy}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Preselekcja ofert"
            name="preselection"
            data-ref={preselection}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Organizacja pobytu"
            name="law"
            data-ref={law}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Prezentacje"
            name="prezentation"
            data-ref={prezentation}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Negocjacje"
            name="negotiations"
            data-ref={negotiations}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Kredytowanie"
            name="loan"
            data-ref={loan}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Notariusz"
            name="notary"
            data-ref={notary}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Zaplecze prawne"
            name="law"
            data-ref={law}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcessStepsElements
            t="Umeblowanie i Zarządzanie najmem"
            name="renting"
            data-ref={renting}
            onclick={handleShowingDesc}
            descChoosed={descChoosed}
          />
          <ProcesDescription data={descChoosed} />
          <div
            onClick={handleConsultationPopUp}
            className="bg-[#275278] text-white md:text-[24px] text-[20px] px-[40px] py-[20px] font-[500] flex justify-center items-center rounded-[5px] cursor-pointer leading-[23px] mt-[50px] md:mt-0"
          >
            Zamów bezpłatną konsultację
            <IoIosArrowDropright className="w-[35px] h-[35px] mx-[10px]" />
          </div>
        </div>
        <div className="flex-1 md:h-[500px] bg-[url('/happydeal.png')] bg-[auto_800px] bg-right rounded-md"></div>
      </div>
    </div>
  );
}
