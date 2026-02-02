import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GreatVibes, Red_Hat_DisplayFont, MoonDance } from "../../fonts/fonts";

export default function MiniHomeView() {
  const router = useRouter();
  const [country, setCountry] = useState("");

  const Dictionary = [
    { name: "portugalia", new: "w Portugalii" },
    { name: "hiszpania", new: "w Hiszpanii" },
    { name: "dominikana", new: "na Dominikanie" },
    { name: "cypr", new: "na Cyprze" },
  ];

  useEffect(() => {
    Dictionary.map((i) => {
      if (i.name === router.query.country) {
        setCountry(i.new);
      }
    });
  }, [router.isReady, router.query.country]);

  return (
    <div
      className={`${MoonDance.className} lg:w-full w-full md:h-[350px] h-[310px] mx-auto `}
    >
      <div className=" bg-white w-full h-[75px]"></div>
      <div className=" bg-white w-full h-full bg-[center_320px] relative">
        {/* <div className="absolute w-full h-full bg-gray-900/[0.5] z-0"></div> */}
        <div className="lg:pt-[20px] pt-[50px] lg:w-[1100px] w-[90%] mx-auto z-30 relative">
          <span className="w-[100px] bg-white ">
            <h1 className="md:text-[49px] text-[34px] text-white leading-[30px] lg:leading-[49px]">
              Nieruchomości {country} – domy i apartamenty na sprzedaż
            </h1>
            {router.query.country === "hiszpania" && (
              <span
                className={`${Red_Hat_DisplayFont.className} bg-white text-left rounded-[3px] mt-[20px] md:text-[18px] text-[12px] `}
              >
                {" "}
                Planujesz zakup <strong>nieruchomości w Hiszpanii</strong>?
                Znajdziesz tu atrakcyjne oferty domów, mieszkań i apartamentów w
                popularnych lokalizacjach takich jak Costa Blanca, Costa del
                Sol, Alicante czy Torrevieja itd. Hiszpański rynek nieruchomości
                oferuje świetne możliwości zarówno dla inwestorów, jak i osób
                szukających drugiego domu na słoneczne wakacje. Przeglądaj
                dostępne ogłoszenia i wybierz swoją wymarzoną nieruchomość.
              </span>
            )}
            {router.query.country === "cypr" && (
              <span
                className={`${Red_Hat_DisplayFont.className} bg-white text-left rounded-[3px] mt-[20px] md:text-[18px] text-[12px] `}
              >
                {" "}
                Odkryj wyjątkowe <strong>nieruchomości na Cyprze</strong> –
                domy, wille i apartamenty na sprzedaż w najbardziej pożądanych
                lokalizacjach wyspy. W ofercie znajdziesz zarówno nowoczesne
                apartamenty z widokiem na morze, jak i komfortowe domy na
                sprzedaż na Cyprze. Jako inwestycję lub swój drugi dom.
                Słoneczny klimat przez cały rok, bezpieczeństwo, korzystne
                warunki podatkowe i stabilny rynek. Znajdź coś dla siebie, coś
                co spełni Twoje oczekiwania. Przeglądaj aktualne oferty na
                Cyprze.
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
