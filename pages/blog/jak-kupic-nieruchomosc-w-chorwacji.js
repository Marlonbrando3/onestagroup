import React from "react";
import Head from "next/head";
import Script from "next/script";
import HeaderBlog from "../../components/HeaderBlog";
import Header from "../../components/Header";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function BlogPost() {
  const temat = "Jak kupić nieruchomość w Chorwacji?";

  return (
    <>
      <Head>
        <title>Jak kupić nieruchomość w Chorwacji - Onesta Group</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <div className="lg:px-40 px-4 pt-24">
        Chcemy przedstawić Państwu proces zakupu nieruchomości w Chorwacji w
        formie ogólnej, opisowej aby pozwolić Państwu zyskać pogląd na tę sprawę
        i ocenić na ile on dla Państwa jest złożony a ile do opanowania ponad to
        co znajdziecie Państwo tutaj.<br></br>
        Przy potrzebie bardzo szczegółowego zapoznania się z procesem zapraszam
        do kontaktu mailowego za pośrednictwem formularza kontaktowego (link).
        <br></br>
        <br></br>
        <b>Mamy kilka wyzwań, które zostaną omówione</b>
        <br></br>
        <br></br>
        1. Kto może kupić nieruchomość w Chorwacji.<br></br>
        2. Umowy i formalności przy zawieraniu transakcji.<br></br>
        3. Kwestie finansowe.<br></br>
        <br></br>
        <br></br>
        <b>Kto może kupić nieruchomość w Chorwacji?</b>
        <br></br>
        <br></br>
        Sprawa z obywatelami EU jest na szczęście bardzo prosta ponieważ warunki
        zakupu nieruchomości w Chorwacji są praktycznie identyczne jak w
        przypadku obywateli Chorwacji co znacznie ułatwia sprawię. Wyjątek
        stanowi tutaj jedynie obywatele Szwajcarii i Włoch, którzy muszą
        zamieszkać w Chorwacji aby móc kupić swoją nieruchomość. Z obywatelami
        spoza UE sprawa jest nieco bardziej skomplikowana ale to na pewno nie
        jest temat na ten wątek. Wiemy, zatem, że zakup nieruchomości nie będzie
        komplikowany, jednak nie znaczy to, że będzie prosty jak kupienie butów
        BLIKiem. Przejdzmy zatem dalej. Umowy i formalności przy zwieraniu
        transakcji.<br></br>
        <br></br>
        Wiele aspektów przy zakupie domu w Chorwacji, nieruchomości w Chorwacji
        jest bardzo podobnych do tych, które mamy w Polsce. <br></br>Zobaczmy:
        <br></br>
        <br></br>
        <b>Pierwsze kroki.</b>
        <br></br>
        Jeżeli decyzja o zakupie nieruchomości w Chorwacji jest podjęta to warto
        zacząć od uzyskania numeru OBI. Jest numer podatnika, który umożliwi
        rozliczenie się z Państwem po zakupie, zaraz po tym warto założyć konto
        w jednym z Chorwackich banków aby umożliwić płynną realizację podatków,
        wypłat prowizji dla prawników, pośredników itd. Do założenia konta
        potrzebujesz poszportu.
        <br></br>
        <br></br>
        <b>Zawieramy umowę przedwstępną.</b>
        <br></br>
        Jest to taki rodzaj umowy, który wyważa intencję zakupu i jest zawieramy
        między kupującym a sprzedającym, po tej czynności następuje wpłata
        zaliczka, która zazwyczaj wynosi o 5-10% całkowitej kwoty zakupu co
        często jest równoznaczne z ustaleniem iż ogłoszenie jest zdjęte z rynku
        i portali – jeśli były. Bedzie wymagany również certyfikat własności
        obecnego właściciela (Vlastnicki List, Certificate of Ownership) nie
        starszy niż 6 m-cy.
        <br></br>
        <br></br>
        <b>Zawarcie właściwej umowy.</b>
        <br></br>
        Jeżeli jesteś gotowy do wpłaty całości kwoty z pomocą prawników oraz
        notariusza zostaje przygotowana umowa główna na zakup/sprzedaż
        nieruchomości oraz sprawdzenie aspektów prawnych. Sprawdzenie własnoścni
        nieruchomości, hipoteki, zadłużeń, prawa do uzytkownia w Chorwacji jest
        możliwe przez stornę internetową oraz podanie numer (Broj kat.cestice)
        przypisanego do nieruchomości. Zakładamy zatem, że wszystko gra i cała
        kwota trafia do sprzedającego, który wystawia potwierdzenie płatności
        (Tabuljarna Isprava). Umowa i potwierdzenie trafiają do sądu, gdzie
        zostaje zmieniony tytuł własności nieruchomości.
        <br></br>
        <br></br>
        Jedną z wyjątkowych sytuacji jest zakup nieruchomości od osoby, która ją
        odziedziczyła, tutaj warto zaangażować prawnika aby upewnił czy
        postępowanie spadkowe zostało poprawnie doprowadzone do końca i jeśli
        nie to pomógł w tym procesie.
        <br></br>
        <br></br>
        <b>Zakończenie procesu.</b>
        <br></br>
        <br></br>
        Prócz płatności, które omówimy w następnym podpukncie, nowy właściciel
        może wygenerować sobie już własny akt własności czyli wspomniany wyżej
        Vlastnicki List i zacząć cieszyć się nowym nabytkiem.
        <br></br>
        <br></br>
        <b>Kwestie finansowe.</b>
        <br></br>
        Prócz kosztów zakupu domu w Chorwacji pozostaje jeszcze konieczność
        uregulowania osób, które w procesie pomagały. Kupno nieruchomości w
        Chorwacji mimo tego, że proste praktycznie zawsze wymaga jakiejś
        eksperckiej wiedzy lub chociażby doświadczonych osób działających na
        rynku.
        <br></br>
        <br></br>
        <b>
          Koszty zakupu nieruchomości w Chorwacji kształtują się mniej więcej
          tak:
        </b>
        <br></br>- koszty notariusza – ok 0,03 – 0,005% wartości nieruchomości,
        <br></br>- koszty tłumaczenia to ok 300 Euro,<br></br>- wynagrodzenie
        agencji (jeżeli występuje) 3% netto od wartości nieruchomości,<br></br>-
        wynagrodzenie prawnika – 1-1,25% netto od wartości nieruchomości.
        <br></br>
        <br></br>
        <br></br>
        Dom w Chorwacji, apartament w Chorwacji – generalnie nie ma różnicy w
        procesie zakupu. To jest bardzo ważne to zachować ostrożność ponieważ
        jednak jeszcze kupując nieruchomość w Chorwacji można zostać oszukanym
        dlatego tak ważne jest aby zanim zdecyduje się Państwo na samodzielny
        proces zakupu upewnić się, że jest on na tyle pewny i sprawdzony, że nie
        będzie wymagał od Państwa kilkukrotnych wyjazdów do Chorwacji w celu
        prostowania formalności – byłoby to chyba droższe i bardziej
        czasochłonne niż ekspercka pomoc.
        <br></br>
        <br></br>
      </div>
    </>
  );
}
