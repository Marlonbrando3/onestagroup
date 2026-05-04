import React from "react";
import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../components/Header";
import Link from "next/link";
import Footer from "../components/Footer";
import ContactFormBlogPost from "../components/ContactFormBlogPost";

export default function Polityka() {
  const [searchShow, setSearchShow] = useState(true);

  return (
    <>
      <Head>
        <title>Polityka Prywatności - Onesta Group</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Header searchShow={searchShow} />
      {/* <MiniHomeView /> */}
      <div className="w-10/12 mx-auto my-20 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-8">Polityka Prywatności</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            1. Administrator danych
          </h2>
          <p>
            Administratorem danych osobowych jest Onesta Group Sp. z o.o. z
            siedzibą przy ul. Wolbromskiej 18/1b, 53-148 Wrocław.
          </p>
          <p className="mt-2">
            Kontakt: biuro@onesta.com.pl | tel. +48 669 75 25 25
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            2. Podstawa prawna przetwarzania
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>zgoda użytkownika (marketing, formularze, leady)</li>
            <li>wykonanie umowy lub działania przed jej zawarciem</li>
            <li>obowiązek prawny (np. podatki, księgowość)</li>
            <li>
              uzasadniony interes administratora (analityka, marketing własny)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Cele przetwarzania</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>kontakt z użytkownikiem i obsługa zapytań</li>
            <li>przedstawienie ofert nieruchomości</li>
            <li>realizacja usług pośrednictwa</li>
            <li>marketing (email, telefon, reklamy)</li>
            <li>analityka i optymalizacja strony</li>
            <li>obowiązki księgowe i podatkowe</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Zakres danych</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>imię i nazwisko</li>
            <li>adres e-mail</li>
            <li>numer telefonu</li>
            <li>dane z formularzy</li>
            <li>adres IP i dane techniczne urządzenia</li>
            <li>dane o aktywności na stronie</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Źródła danych</h2>
          <p>
            Dane pozyskujemy bezpośrednio od użytkownika oraz z platform
            reklamowych (np. Facebook Lead Ads).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Odbiorcy danych</h2>
          <p className="mb-2">Dane mogą być przekazywane:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>partnerom biznesowym (biura nieruchomości)</li>
            <li>firmom IT i hostingowym</li>
            <li>księgowości</li>
            <li>firmom marketingowym</li>
            <li>operatorom pocztowym i kurierskim</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Profilowanie</h2>
          <p>
            Dane mogą być wykorzystywane do profilowania w celach marketingowych
            (np. dopasowanie ofert, reklamy Facebook i Google). Profilowanie nie
            wywołuje skutków prawnych dla użytkownika.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
          <p className="mb-2">Strona wykorzystuje pliki cookies w celu:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>prawidłowego działania strony</li>
            <li>analityki (Google Analytics)</li>
            <li>marketingu (Facebook Pixel)</li>
          </ul>
          <p className="mt-2">
            Użytkownik może zarządzać cookies w ustawieniach przeglądarki.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            9. Okres przechowywania danych
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>do momentu zakończenia kontaktu lub wycofania zgody</li>
            <li>w przypadku umowy – przez czas jej trwania</li>
            <li>dane księgowe – 5 lat</li>
            <li>dane marketingowe – do momentu sprzeciwu</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">10. Prawa użytkownika</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>dostęp do danych</li>
            <li>sprostowanie danych</li>
            <li>usunięcie danych</li>
            <li>ograniczenie przetwarzania</li>
            <li>przenoszenie danych</li>
            <li>sprzeciw wobec przetwarzania</li>
            <li>cofnięcie zgody</li>
          </ul>
          <p className="mt-2">Kontakt: biuro@onesta.com.pl</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">11. Organ nadzorczy</h2>
          <p>
            Masz prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            12. Dobrowolność danych
          </h2>
          <p>
            Podanie danych jest dobrowolne, ale niezbędne do kontaktu i
            realizacji usług.
          </p>
        </section>
      </div>
    </>
  );
}
