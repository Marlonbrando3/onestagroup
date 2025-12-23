import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutCyprus() {
  return (
    <div className="w-screen h-auto py-[40px]">
      <h2 className="lg:w-[1100px] w-[90%] mx-auto text-left text-[34px] py-[30px] leading-[35px]">
        Nieruchomości Cypr - dlaczego warto inwestować?
      </h2>
      <div className="lg:w-[1100px] w-[90%] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[300px] h-[500px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/Spains_properties_market.png" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px]">
          Dlaczego warto inwestować w <strong>nieruchomości na Cyprze</strong>? Cypr to nie tylko
          jedno z najpiękniejszych miejsc w Europie, ale także wyjątkowa lokalizacja inwestycyjna.
          Coraz więcej osób z Polski i całej Europy poszukuje{" "}
          <strong>apartamentów i domów na sprzedaż na Cyprze</strong>. <br></br>
          <br></br>Dlaczego właśnie <strong>nieruchomości na Cyprze</strong> cieszą się rosnącym
          zainteresowaniem? <br></br>1. Słońce przez cały rok Południowy Cypr oferuje ponad 320
          słonecznych dni w roku. To idealne miejsce dla tych, którzy marzą o ucieczce od zimy –
          niezależnie, czy szukasz apartamentu wakacyjnego, czy planujesz stałą przeprowadzkę.{" "}
          <br></br>2. Stabilność i bezpieczeństwo Cypr Południowy, jako część Unii Europejskiej,
          zapewnia pełną ochronę prawną dla właścicieli nieruchomości. Proces zakupu jest
          przejrzysty i bezpieczny również dla obcokrajowców. <br></br>3. Wciąż atrakcyjne ceny w
          porównaniu do Hiszpanii czy Portugalii, <strong>nieruchomości na Cyprze</strong> nadal
          pozostają atrakcyjne cenowo. <br></br>Można tu znaleźć zarówno luksusowe apartamenty na
          sprzedaż, jak i przystępne domy na sprzedaż Cypr, idealne pod wynajem krótkoterminowy lub
          długoterminowy. <br></br>4. Zwolnienia podatkowe i ulgi System podatkowy Cypru jest
          wyjątkowo przyjazny inwestorom. Niskie podatki, brak podatku od darowizn i spadków, a
          także możliwości odliczeń sprawiają, że <strong>nieruchomości na Cyprze</strong> to nie
          tylko nowy styl życia, ale i opłacalna inwestycja. <br></br>5. Styl życia i infrastruktura
          Znakomite jedzenie, gościnni mieszkańcy, wysoki standard życia i nowoczesna infrastruktura
          – to wszystko sprawia, że Cypr nieruchomości na sprzedaż stają się synonimem wygody,
          relaksu i prestiżu. 6. Idealne pod wynajem Lokalny rynek turystyczny kwitnie. Wysokie
          obłożenie w sezonie (i poza nim) sprawia, że wiele osób kupuje apartamenty na Cyprze z
          myślą o wynajmie krótkoterminowym. To doskonały sposób na pasywny dochód. Jeśli szukasz
          nieruchomości Cypr – zapoznaj się z naszą aktualną ofertą. Znajdziesz tu sprawdzone domy
          na sprzedaż Cypr, luksusowe wille z widokiem na morze, jak i nowoczesne cypr apartamenty
          na sprzedaż w atrakcyjnych lokalizacjach. Chcesz dopisać coś bardziej unikalnego do
          konkretnego typu oferty (np. pod wynajem, dla emeryta, pod pasywny dochód)? Daj znać –
          przygotuję oddzielne wersje.
          <Link href="/blog/jak-kupic-nieruchomosc-w-hiszpanii" className="underline font-bold">
            Nieruchomości Cypr
          </Link>
          &nbsp; lub &nbsp;
          <strong className="font-bold">
            jeśli wolisz porozmawaić zgłoś się do nas na bezpłatną konsultancje, poprzez formularz
            niżej lub w menu strony.
          </strong>
        </div>
      </div>
    </div>
  );
}
