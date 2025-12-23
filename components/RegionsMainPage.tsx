import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import RegionsMainPageElement from "./whatWeDo/regionsMainPageElement";
import { BsPersonHearts } from "react-icons/bs";

import Image from "next/image";

export default function RegionsMainPage() {
  return (
    <div className="bg-cover w-screen">
      <div
        className={`${MontserratSans.className} w-[90vw] h-auto mx-auto flex flex-wrap mt-[80px] `}
      >
        <div className="w-full h-[100px]">
          <p className="md:text-[32px] text-[25px]  text-[#275278] w-auto font-[400] h-full items-center lg:inline-flex">
            W którym regionie świata szukasz{" "}
            <span className="font-[800]"> &nbsp;miejsca dla siebie?</span>
          </p>
        </div>
        <div className="flex-1 h-[700px] flex flex-col flex-wrap items-center justify-between">
          <RegionsMainPageElement
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] text-[#E9B75F]" />
            }
            region="Costa Blanca"
            query="costa-blanca"
            country="Hiszpania"
            d="Zawsze występujemy w imieniu klienta i pracujemy zgodnie z Jego
            intencjami. W skutek tego nie lobbujemy konkretnych projektów tylko
            te spełniające oczekiwania klientów."
            number="60"
            img="costablanca.png"
          />
          <RegionsMainPageElement
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] text-[#E9B75F]" />
            }
            region="Costa del Sol"
            query="costa-del-sol"
            country="Hiszpania"
            d="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500"
            number="40"
            img="costadelsol.png"
          />
          <RegionsMainPageElement
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] text-[#E9B75F]" />
            }
            query="Samana"
            region="Samana"
            country="Dominikana"
            d="Kontakt z nami nie kończy się podpisaniu rezerwacji, jesteśmy z Tobą na kazdym kroku procesu od zakupu do umeblowania oraz ew. wynajmu."
            number="20"
            img="dominican.png"
          />

          <RegionsMainPageElement
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] text-[#E9B75F]" />
            }
            region="Południowy"
            country="Cypr"
            query="cypr-poludniowy"
            d="Relacyjność i zrozumienie przez empatyczny zespół to coś co skutkuje dobrą komunikacją i efektywną pracą z oczekiwanymi efekami."
            number="0"
            img="cypr.png"
          />
        </div>
      </div>
    </div>
  );
}
