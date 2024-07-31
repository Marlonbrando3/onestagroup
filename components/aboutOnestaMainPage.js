import Image from "next/image";

export default function AboutOnestaMainPage() {
  return (
    <div className="w-screen h-auto py-[140px]">
      <div className="lg:w-[1200px] w-[90vw] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[400px] h-[350px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/bg_about.jpeg" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px] text-[18px] md:mt-[20px] mt-auto">
          <h1 className="w-[80%] text-right text-[34px] py-[10px] leading-[35px] mx-auto mb-[30px] ">
            Multibroker <span className="font-bold">Onesta Group</span>
            <br></br>inny niż wszystkie
          </h1>
          <p className="md:pl-[80px]">
            <b>Dla Ciebie oznacza to równowagę w procesie poszukiwań</b> poprzez - współpracę z
            zespołem z 15 letnim doświadczeniem w sprzedaży i budowaniu relacji z klientami. Z
            organizacją, która słucha swoich rozmówców i wychodzi na przeciw Ich potrzebom.
            Przeszukujemy rynek i znajdujemy oferty wpisujące się w Twoje preferencje. <br></br>
            <br></br>W ramach współpracy ofertujemy Ci nasz czas, uwagę i cierpliwość wraz z
            ofertami setek innych agencji lub agentów na rynku m.in. Hiszpańskim - wszystko w jednym
            miejscu.
          </p>
        </div>
      </div>
    </div>
  );
}
