import React from "react";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import Image from "next/image";

export default function MissionVision() {
  return (
    <div className="lg:w-[1200px] flex w-[95vw] mx-auto justify-evenly h-auto">
      <div className="lg:w-[1100px]">
        <div className="w-full flex items-center flex-col md:flex-row my-[20px]">
          <div className="h-[100px] w-[100px] relative ">
            <Image
              src="/mission.png"
              alt="misja_firmy_Onesta_Group"
              fill
              objectFit="contain"
              className="text-orange-900 filter sepia-[100%] invert-[66%] hue-rotate-[100deg] saturate-[10%] brightness-[10%] contrast-[90%]"
            ></Image>
          </div>
          <div className="flex-1 ml-[30px] mr-[60px]">
            <p className={`${Red_Hat_DisplayFont} text-[24px] font-normal tracking-[1.4px]`}>
              Nasza misja = Twoja korzyść
            </p>
            <p>
              Naszym celem jest dostarczenie Tobie trafionych ofert z szerokiego spectrum i
              realizujemy ten pozyskując wartościowe współprace z innymi cenionymi biurami
              nieruchomości w tych krajach. W efekcie, odpowiadając na Twoje potrzeby wybieramy
              oferty z praktycznie 90% ofert na rynku w Hiszpanii (100% w ramach rynku pierwotnego)
              co daje Tobie szeroki pogląd zarówno na sytuację na rynku i jak jego możliwości.
              Równorzędnym celem Onesta Group jest zapewnienie bezpieczeństwa transakcji dlatego
              współpracujemy z prawnikami, agentami, tłumaczami, którzy zostali sprawdzeni, a ich
              jakość potwierdzona w ciągu kilkunastu (czasami kilkudziesięciu) lat pracy na tym
              rynku w swojej specjalizacji.
            </p>
          </div>
        </div>
        <div className="w-full flex items-center flex-col md:flex-row my-[20px]">
          <div className="h-[100px] w-[100px] relative ">
            <Image
              src="/collabVision.png"
              alt="misja_firmy_Onesta_Group"
              fill
              objectFit="contain"
              className="text-orange-900 filter sepia-[100%] invert-[66%] hue-rotate-[100deg] saturate-[10%] brightness-[10%] contrast-[90%]"
            ></Image>
          </div>
          <div className="flex-1 ml-[30px] mr-[60px] my-[20px]">
            <p className={`${Red_Hat_DisplayFont} text-[24px] font-normal tracking-[1.4px]`}>
              Nasza wizja = Twój komfort
            </p>
            <p>
              Naszym celem jest dostarczenie Tobie trafionych ofert z szerokiego spectrum i
              realizujemy ten pozyskując wartościowe współprace z innymi cenionymi biurami
              nieruchomości w tych krajach. W efekcie, odpowiadając na Twoje potrzeby wybieramy
              oferty z praktycznie 90% ofert na rynku w Hiszpanii (100% w ramach rynku pierwotnego)
              co daje Tobie szeroki pogląd zarówno na sytuację na rynku i jak jego możliwości.
              Równorzędnym celem Onesta Group jest zapewnienie bezpieczeństwa transakcji dlatego
              współpracujemy z prawnikami, agentami, tłumaczami, którzy zostali sprawdzeni, a ich
              jakość potwierdzona w ciągu kilkunastu (czasami kilkudziesięciu) lat pracy na tym
              rynku w swojej specjalizacji.
            </p>
          </div>
        </div>
        <div className="w-full flex items-center flex-col md:flex-row">
          <div className="h-[100px] w-[100px] relative">
            <Image
              src="/ourTeam.png"
              alt="misja_firmy_Onesta_Group"
              fill
              objectFit="contain"
              className="text-orange-900 filter sepia-[100%] invert-[66%] hue-rotate-[100deg] saturate-[10%] brightness-[10%] contrast-[90%]"
            ></Image>
          </div>
          <div className="flex-1 ml-[30px] mr-[60px] my-[20px]">
            <p className={`${Red_Hat_DisplayFont} text-[24px] font-normal tracking-[1.4px]`}>
              Nasz zespół = Twój cel
            </p>
            <p>
              Obecnie to 4 agentów, którzy mają ogromne doświadczenie głównie w sprzedaży na bazie
              relacji. Uważamy, że tylko na relacji i szczerości jesteśmy w stanie zrozumieć
              potrzeby i faktycznie pomóc. Jeśli chcesz porozmawiać o swoim procesie zakupu lub
              poszukiwań - nie wahaj się zadzwonić, każdy z nas pomoże z dużą otwartością.
            </p>
          </div>
        </div>
      </div>
      <div className="flex lg:w-[400px] relative">
        <Image src="/about_us_main_txt.png" fill objectFit="cover" alt="nieruchomości"></Image>
      </div>
    </div>
  );
}
