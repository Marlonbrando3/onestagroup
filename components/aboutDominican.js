import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutSpain() {
  return (
    <div className="w-screen h-auto py-[40px]">
      <h2 className="lg:w-[1100px] w-[90%] mx-auto text-left text-[34px] py-[30px] leading-[35px]">
        Jak wygląda rynek nieruchomości w Hiszpanii?
      </h2>
      <div className="lg:w-[1100px] w-[90%] mx-auto h-full flex justify-center">
        <div className="hidden lg:block min-w-[300px] h-[500px] relative rounded-l-[20px] overflow-hidden object-cover">
          <Image src="/Spains_properties_market.png" alt="nieruchomosci-w-hiszpanii" fill></Image>
        </div>
        <div className="ml-[20px]">
          Inwestowanie w <strong>Nieruchomości w Hiszpanii</strong> dla Polaków stało się bardzo
          atrakcyjną możliwością. Od kilku lat ten region świata przeżywa prawdziwy rozkwit, a
          wyłącznie od 2023 roku poziom zakupu <strong>nieruchomości w Hiszpanii</strong> wzrół o
          kilkaset proces. Polacy zostali zmobilizowani do rozważania tego kierunku między innymi
          przez konflikt na bliskim wschodzie. Wiele osób przyspieszyło swoje plany o zakupie swojej
          własnej <strong>nieruchomości w Hiszpanii</strong>, ponieważ właśnie Hiszpania jako
          najdalej wysunięte Państwo w Europie dawało poczucie bezpiecznej inwestycji i faktycznie
          tak jest. Nie zapowiada się również aby w najbliższych latach co się zmieniło. Mimo tego,
          że rynek <strong>nieruchomości w Hiszpanii</strong> wskutek trendu został lekko
          wydrenowany i czas oczekiwania na oddanie do użytku nowych inwestycji wzrósł z 3 do 12
          miesięcy, to nadal nie daje się zauważyć spadku zainteresownia zakupem, wręcz przeciwnie.
          Ceny nieruchomości wzrosły o kolejne 5%, a to dlatego, że dla wielu lub dla zdecydowanej
          większości kupujących zakup nieruchomości w Hiszpanii to prócz dobrej inwestycji również
          często spełnienie ważnego marzenia, a te nie mają ceny. <br></br>
          <br></br>
          Od koncówki 2023 roku zauważamy również duży wzrost agencji, które powstały aby sprzedawać{" "}
          <strong>nieruchomości w Hiszpanii</strong> co powoduje, że jakość obsługi oraz
          bezpieczeństwo w sprzedaży spadło odwrotnie proporcjonalnie do wzrostu liczby ofert.
          Dostrzegliśmy to i chcemy zaznaczyć, że grupa <strong>Onesta</strong> powstała z myślą i
          zamiarem orientacji na klienta i wystepowanie w Jego imieniu w procesie zakupu/sprzedaży.
          Dzieleniu się z wiedzą, byciem uczciwą, elastyczną, organizacją. Po wielu procesach
          sprzedaży nieruchomości w Hiszpanii, które przeprowadziliśmy lub przy których byliśmy
          obecni, wiemy czego chcą (i nie chcą) nasi klienci.<br></br>
          <br></br>
          Zapraszamy do rozpoczęcia przygody od przeczytania o tym jak zacząć (klik) poszukiwania
          swojej pierwszej{" "}
          <Link href="/blog/jak-kupic-nieruchomosc-w-hiszpanii" className="underline font-bold">
            Nieruchomości w Hiszpanii
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
