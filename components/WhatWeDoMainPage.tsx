import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import WhatWeDo from "./whatWeDo/whatWeDo";
import { BsPersonHearts } from "react-icons/bs";

import Image from "next/image";

export default function WhatWeDoMainPage() {
  return (
    <div className="bg-cover w-screen md:[mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)]">
      <div
        className={`${MontserratSans.className} w-[90vw] md:h-[1000px]  mx-auto flex flex-wrap `}
      >
        <div className="w-full h-[100px]">
          <p className="md:text-[32px] text-[22px] text-[#275278] w-auto font-[400] h-full items-center lg:inline-flex">
            6 powodów dla których{" "}
            <span className="font-[800]"> &nbsp;zechcesz z nami pracować.</span>
          </p>
        </div>
        <div className="hidden md:visible w-[320px] h-[800px] bg-[#275278] relative rounded-[10px]">
          <div className="bg-red-900 absolute bottom-[200px] left-10 w-[150px] h-[150px] bg-[url('/mini_second.png')] bg-cover rounded-md shadow-[-70px_-70px_0px_-50px_rgba(233,183,95,1)]"></div>
          <div className="absolute bottom-[50px] left-[90px] w-[180px] h-[180px] z-20 bg-[url('/middleOne.png')] bg-cover rounded-md"></div>
          <div className="bg-[#C04F30] absolute w-[50px] h-[50px] bottom-5 right-5 z-20"></div>
          {/* <div className="bg-orange-300 absolute bottom-[5px] left-[150px] w-[150px] h-[150px] bg-[url('/deal.png')] bg-cover rounded-md"></div> */}
          <p className="text-white font-[400] text-[28px] p-[40px] leading-[35px]">
            Dołącz do procesu, który stworzyliśmy z myślą{" "}
            <span className="font-[700]">
              o Twoim komforcie i bezpieczeństwie.
            </span>
          </p>
        </div>
        <div className="flex-1 md:h-[800px] flex flex-wrap items-center justify-evenly">
          <WhatWeDo
            icon={
              <BsPersonHearts className="md:w-[100px] md:h-[90px] w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="handshake"
            t="Reprezentujemy Ciebie, nie dewelopera."
            d="Zawsze występujemy w imieniu klienta i pracujemy zgodnie z Jego
            intencjami. W skutek tego nie lobbujemy konkretnych projektów tylko
            te spełniające oczekiwania klientów."
          />
          <WhatWeDo
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="etaps"
            t="Realizujemy każdy etap procesu zakupu."
            d="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500"
          />
          <WhatWeDo
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="side"
            t="Jesteśmy zawsze obok i do dyspozycji."
            d="Kontakt z nami nie kończy się podpisaniu rezerwacji, jesteśmy z Tobą na kazdym kroku procesu od zakupu do umeblowania oraz ew. wynajmu."
          />

          <WhatWeDo
            icon={
              <BsPersonHearts className="w-[100px] h-[90px] w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="protect"
            t="Dbamy o Twój komfort i bezpieczeństwo"
            d="Relacyjność i zrozumienie przez empatyczny zespół to coś co skutkuje dobrą komunikacją i efektywną pracą z oczekiwanymi efekami."
          />
          <WhatWeDo
            icon={
              <BsPersonHearts className="w-[100px] h-[90px]  w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="colab"
            t="Nie musisz szukać ofert w kilku biurach na raz."
            d="Współpracujemy ze wszystkimi deweloperami. Gwarantujemy Ci dostęp do każdej oferty z rynku pierwotnego na wybrzeżach na których działamy. "
          />
          <WhatWeDo
            icon={
              <BsPersonHearts className="w-[100px] h-[90px]  w-[70px] h-[70px] text-[#E9B75F]" />
            }
            img="lawer"
            t="Mamy zaplecze prawne oraz opcje kredytowe."
            d="Relacyjność i zrozumienie przez empatyczny zespół to coś co skutkuje dobrą komunikacją i efektywną pracą z oczekiwanymi efekami."
          />
        </div>
      </div>
    </div>
  );
}
