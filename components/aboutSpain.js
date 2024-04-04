import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutSpain() {
  return (
    <div className="w-screen h-auto py-[40px]">
      <h1 className="w-full text-center text-[34px] py-[30px] leading-[30px]">
        Jeśli szukasz nieruchomości w Hiszpanii
      </h1>
      <div className="lg:w-[1000px] w-[90vw] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[300px] h-[500px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/nieruchomosci-w-hiszpanii.jpeg" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px]">
          Inwestowanie w <strong>Nieruchomości w Hiszpanii</strong> stało się bardzo atrakcyjną
          opcją. W ostatnich 2 lat ten region świata przeżył prawdziwy rozkwit. Pod od początku 2023
          roku zakupu <strong>nieruchomości w Hiszpanii</strong> wzrół o kilkaset proces. Polacy
          zostali zmobilizowani do rozważania tego kierunku między innymi przez konflikt na
          wschodzie. Wiele osób przyspieszyło swoje plany o zakupie swojej własnej{" "}
          <strong>nieruchomości w Hiszpanii</strong>, ponieważ jako najdalej wysunięte Państwa w
          Europie dawało poczucie beziecznej inwestycji i faktycznie tak jest, nie zapowiada się
          również aby w najbliższych latach co się zmieniło. Mimo tego, że rynek{" "}
          <strong>nieruchomości w Hiszpanii</strong> zostal lekko wydrenowany i czas oczekiwania na
          oddanie do użytku nowych inwestycji wzrósł z 3 do 17 miesięcy, to nadal nie daje
          się zauważyć spadku zainteresownia tym regione, Ceny nieruchomości wzrosły o 5%, ponieważ
          dalej szukając swojego drugiego <strong>domu w Hiszpanii</strong> nie liczymy tak bardzo
          pieniędzy tylko marzenia. A one przecież ceny nie mają. <br></br>
          <br></br>
          Ma to swoje negatywne konswekcje bo wszędzie tam gdzie rynek kwitnie pojawią się
          nadużycia. Od koncówki 2022 roku zauważamy duży wzrost agencji, które powstały aby
          sprzedawać <strong>nieruchomości w Hiszpanii</strong> co powoduje, że jakość obsługi oraz
          bezpieczeństwo w sprzedaży spadło proporcjonalnie ofert. Dostrzegliśmy to chcemy
          zaznaczyć, że grupa <strong>Onesta</strong> (tłum. Uczciwość) dalej działa i utrzymuje
          usługi o swoje wartości na których powstała: orientacja na klinta i wystepowanie w Jego
          imieniu, uczciwość, elastyczność, relacyjność, wiedza. Po wielu procesach sprzedaży
          nieruchomości w Hiszpanii, które przeprowadziliśmy lub przy których byliśmy obecni, wiemy
          czego chcą (i nie chcą) nasi przyszli klienci.<br></br>
          <br></br>
          Możesz przeczytać jak zacząć (klik) poszukiwania swojej pierwszej{" "}
          <Link href="/blog/jak-kupic-nieruchomosc-w-hiszpanii" className="underline font-bold">
            Nieruchomości w Hiszpanii
          </Link>
          &nbsp; lub &nbsp;
          <strong className="md:text-[26px] leading-8 text-green-600">
            jeśli już znasz kryteria zgłosić się do nas bezpłatną konsultancje, poprzez formularz
            niżej.
          </strong>
        </div>
      </div>
    </div>
  );
}
