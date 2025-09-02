import Image from "next/image";
import { BonheurRoyaleFont, Red_Hat_DisplayFont } from "../fonts/fonts";

export default function AboutOnestaMainPage() {
  return (
    <div className={`${Red_Hat_DisplayFont.className} w-screen h-auto py-[180px]`}>
      <div className="lg:w-[1050px] w-[90vw] mx-auto lg:h-[600px] flex justify-end relative">
        <div className="absolute lg:h-full h-[750px] w-[90%] bg-[url('/bg_second.png')] bg-cover rounded-[4px] bg-fixed left-0"></div>
        <div className=" w-[96%] h-[94%] top-0 bottom-0 left-0 right-0 m-auto border-[1.6px] border-orange-500 rounded-[4px] absolute "></div>
        <div className="ml-[20px] w-[600px] md:h-[600px] h-[850px] text-[18px] md:-mt-[80px] mt-auto bg-white rounded-[4px] shadow-[0_0px_10px_0_rgba(0,0,0,0.3)] relative">
          <h1 className="w-[80%] text-right text-[34px] py-[10px] leading-[35px] mx-auto mb-[30px]">
            Multibroker <span className="font-bold">Onesta Group</span>
            <br></br>
            <p className={`${BonheurRoyaleFont.className} text-[50px] text-orange-400 font-bold`}>
              ...doradzamy lepiej
            </p>
          </h1>
          <p className="md:pl-[40px] mr-[50px] ml-[10px]">
            <b>Dla Ciebie oznacza to równowagę w procesie poszukiwań</b> poprzez współpracę z
            zespołem z 15 letnim doświadczeniem w sprzedaży i budowaniu relacji z klientami. Z
            organizacją, która słucha swoich rozmówców i wychodzi na przeciw Ich potrzebom.
            Przeszukujemy rynek i znajdujemy oferty wpisujące się w Twoje preferencje. <br></br>
            <br></br>W ramach współpracy ofertujemy Ci nasz czas, uwagę i cierpliwość wraz z
            ofertami setek innych agencji lub agentów na rynku m.in. Hiszpańskim - wszystko w jednym
            miejscu.
          </p>{" "}
          <br></br>
          <p
            className={`${BonheurRoyaleFont.className} w-[80%] mx-auto text-[50px] text-orange-400 font-bold text-left`}
          >
            Zapraszamy!
          </p>
          <div
            className={`${Red_Hat_DisplayFont.className} font-bold h-[50px] w-[80%] mx-auto place-items-start`}
          >
            <div classname="w-[100px] h-auto border border-gray-900">
              <br></br>
              <p className="text-[14px] text-left w-full">Zespół</p>
              <p className="text-[18px] text-leftfont bold w-full">ONESTA GROUP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
