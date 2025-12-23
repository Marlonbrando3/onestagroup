import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Header from "../../components/Header";
import HeaderBlog from "../../components/HeaderBlog";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import Blogbuttonoffers from "../../components/blogbuttonoffers";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import Footer from "../../components/Footer";
import Newsletter from "../../components/newsletter";

export default function BlogPost() {
  const temat = "Jak kupować nieruchomości w Hiszpanii (cz.2 pigułka + formalności)";

  return (
    <>
      <Newsletter />
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7E286CBN97"></Script>
      <Script id="google-analitycs">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7E286CBN97');
      `}
      </Script>
      <Script id="facebook-pixel">
        {`!function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '178665974358939');
                  fbq('track', 'PageView');
                `}
      </Script>

      {/* <!-- Hotjar Tracking Code for https://onesta.com.pl --> */}
      <Script id="hotjar">
        {`
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:3555670,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
      </Script>
      <Head>
        <title>Jak kupować nieruchomości w Hiszpanii - cz.2 - Onesta Group</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="Description"
          content="Nieruchomości Hiszpania. Pośrednictwo w sprzedaży nieruchomości w Hiszpanii. Z artykuły dowiesz się jak zmienił się rynek nierchomości w Hiszpanii."
        />
        <meta
          name="Keywords"
          content="Nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, apartamenty Hiszpania, polska agencja nieruchomości w Hiszpanii"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 bg-white z-20  shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1100px] lg:mx-auto md:px-[50px] w-[90vw] mx-auto text-[20px] leading-7 tracking-normal mb-[50px]">
        <p>
          Przygotowaliśmy dla Państwa skondensowany ale praktyczny poradnik zakupu wraz z
          formalnościami, które są niezbędne w procesie.
        </p>
        <br></br>
        <p className="font-bold">1. Ustalenie kluczowych cech nieruchomości</p>
        <br></br>
        <p>
          Pierwszym etapem jest dokładne określenie swoich oczekiwań. Zanim zaczniemy przeglądać
          dostępne nieruchomości w Hiszpanii na sprzedaż, warto odpowiedzieć sobie na kilka
          kluczowych pytań tj.:
        </p>
        <li>
          Jaki budżet chcesz przeznaczyć na zakup? Czy uwzględniasz również koszty dodatkowe, takie
          jak podatki, opłaty notarialne i prowizje?
        </li>
        <li>
          Czy zakup finansujesz gotówką, czy planujesz wziąć kredyt hipoteczny w hiszpańskim banku?
        </li>
        <li>W jakim terminie chcesz zakończyć transakcję?</li>
        <li>Czy preferujesz mieszkanie w centrum miasta, czy dom na przedmieściach?</li>
        <li>
          Jaki typ nieruchomości najbardziej odpowiada Twoim potrzebom – apartament, willa,
          bungalow, mieszkanie w bloku?
        </li>
        <li>Ile sypialni i łazienek potrzebujesz?</li>
        <li>
          Czy interesują Cię nowe inwestycje deweloperskie, czy nieruchomości z rynku wtórnego?
        </li>
        <li>
          Jakie dodatkowe elementy są kluczowe: ogród, taras, basen, widok na morze, parking,
          ochrona?
        </li>
        <li>Czy rozważasz wynajem nieruchomości w przyszłości?</li>
        <br></br>
        <p className="font-bold">
          Dokładne ustalenie preferencji pozwoli nam — jako biuro nieruchomości w Hiszpanii —
          przedstawić oferty najlepiej dopasowane do Twoich potrzeb. Sam rozmowa o tym również
          pozwala uświadomić sobie co w praktyce oznacza ustalenie tych kwestii, określić cechy
          tolerowalne na tle np. budżetu tj. odległość od morza, basen, parking itd.{" "}
          <p className="underline">
            Proces wyboru i rozważania różnych aspektów nieruchomości opisaliśmy w pierwszej części
            arykuły (link na dole strony)
          </p>
        </p>
        <br></br>
        <p className="font-bold">2. Selekcja ofert i wizyta w Hiszpanii</p>
        <br></br>
        <p>
          Po wstępnym wybraniu ofert nadchodzi czas na wizytę w Hiszpanii. Która jest absolutnie
          niezbędna w procesie nie tyle zakupu co poznania otoczena nieruchomości, urbanizacji oraz
          ustalenia różnic na tle zdjęć z ogłoszenia. Czasami rekomendujemy tę pierwszą wizytę
          traktować z dużą otwartością, ponieważ często kupowana jest inna niż pierwotnie wybrana
          nieruchomość.
        </p>
        <br></br>
        Najczęstsze kroki:
        <li>
          Przed przyjazdem przesyłamy propozycje nieruchomości, aby zawęzić listę do najciekawszych.
        </li>
        <li>
          Powiadom nas wcześniej o planowanym terminie przylotu – zorganizujemy wizyty, z reguły
          wystarcza 5-7 dni wcześniej.
        </li>
        <li>
          Sugerujemy wynajęcie samochodu dla większej mobilności i poto aby poznać otoczenie i
          miejsca na włąsną rękę o różnych porach dnia.
        </li>
        <li>Na oglądanie nieruchomości warto przeznaczyć 1–2 dni.</li>
        <li>
          Nasz agent może odebrać Cię z miejsca zakwaterowania i zawsze towarzyszy Ci podczas
          prezentacji.
        </li>
        <br></br>
        <p className="font-bold">3. Prezentacje, wybór nieruchomości i rezerwacja.</p>
        <br></br>
        <p className="font-bold">Rynek pierwotny, kroki formalne.</p>
        <li>Rezerwacja w biurze dewelopera.</li>
        <li>Opłata rezerwacyjna: 3.000–10.000 EUR.</li>
        <br></br>
        Przykładowe transze (najczęściej):
        <li>30% kwoty nieruchomości burtto przy podpisaniu umowy,</li>
        <li>70% kwoty nieruchomości burtto po ukończeniu budowy.</li>
        <li>Opłata rezerwacyjna: 3.000–10.000 EUR.</li>
        <br></br>
        Inne transze (rzadziej):
        <li>10% kwoty nieruchomości burtto przy podpisaniu,</li>
        <li>25% kwoty nieruchomości burtto druga wpłata,</li>
        <li>25% kwoty nieruchomości burtto trzecia wpłata,</li>
        <li>Gwarancja bankowa (aval bancario) chroni Twoje środki.</li>
        <br></br>
        <p className="font-bold">Rynek wtórny, kroki formalne.</p>
        <li>Składamy ofertę zakupu nieruchmości</li>
        <li>Po zaakceptowaniu podpisujemy umowę rezerwacyjną i wpłacasz zaliczkę (3–10%).</li>
        <br></br>
        <p className="font-bold">4. Formalności.</p>
        <br></br>
        <li>Założenie konta bankowego w Hiszpanii.</li>
        <li>Uzyskanie numeru NIE (hiszpański numer identyfikacyjny dla cudzoziemców).</li>
        <br></br>
        We współpracy z naszymi klientami, towarzyszymy i prowadzimy ich na każdym z tych etapów.
        Możemy również poprowadzić te sprawy w imieniu klienta na podstawie pełnomocnictwa.
        <br></br> <br></br>
        <p className="font-bold">5. Kredyt hipoteczny (opconalnie)</p>
        <br></br>
        <p>
          Możemy pomóc w uzyskaniu kredytu hipotecznego w Hiszpanii. Współpracujemy nie tylko z
          bankami ale również brokerami, którzy upraszczają proces pokazując nam kilka mozliwych
          opcji i warunków kredytownia. Poniżej założenia oraz wymogi:
        </p>
        <br></br>
        <li>Banki finansują do 70% wartości nieruchomości.</li>
        <li>Dokumenty muszą być przetłumaczone na język hiszpański przez tłumacza przysięgłego.</li>
        <br></br>
        <p>Wymagane dokumenty:</p>
        <br></br>
        <h4>Dla osób fizycznych:</h4>
        <li>Umowa o pracę</li>
        <li>Zaświadczenia o dochodach</li>
        <li>PIT-y z ostatnich 2 lat</li>
        <li>Wyciągi bankowe</li>
        <li>Raport z BIK</li>
        <li>Referencje z banku</li>
        <br></br>
        <h4>Dla firm:</h4>
        <br></br>
        <li>Zeznania podatkowe (w tym równiż PIT z ostatnich 2 lat)</li>
        <li>Bilans i rachunek zysków i strat</li>
        <li>Informacje o dywidendach</li>
        <li>Wyciągi bankowe</li>
        <br></br>
        <p className="font-bold">6. Zakończenie transakcji</p>
        <br></br>
        <p>Przygotowanie i odbiór:</p>
        <br></br>
        <li>Inspekcja nieruchomości,</li>
        <li>Inwentaryzacja umeblowania,</li>
        <li>Poprawki w razie potrzeby,</li>
        <br></br>
        <p>Podpisanie aktu notarialnego:</p>
        <br></br>
        <li>Notariusz sporządza akt po hiszpańsku,</li>
        <li>Obecność tłumacza przysięgłego jest obowiązkowa,</li>
        <li>Wymiana czeków bankierskich oraz przekazanie kluczy,</li>
        <li>Otrzymanie copia simple (odpis aktu),</li>
        <br></br>
        <p>Około miesiąc później otrzymujecie Państwo oryginał aktu z rejestru nieruchomości.</p>
        <br></br>
        <p className="font-bold">7. Koszty związane z transakcją</p>
        <br></br>
        <li>Łączne koszty zakupu to około 13% wartości nieruchomości.</li>
        <br></br>
        <p>Rynek wtórny:</p>
        <li>Costa Blanca – podatek ITP: 10%</li>
        <br></br>
        <p>Rynek pierwotny:</p>
        <li>VAT – 10%</li>
        <li>Podatek AJD – 1,2%</li>
        <br></br>
        <p>Dodatkowe opłaty:</p>
        <li>Taksa notarialna: ok. 1% + VAT</li>
        <li>Wpis do rejestru nieruchomości: ok. 0,6%</li>
        <li>Tłumacz/adwokat: ok. 1% + VAT</li>
        <li>Koszty kredytu: wycena, prowizja, podatek AJD</li>
        <br></br> <br></br>
        <p>
          <strong>Zakup nieruchomości w Hiszpanii</strong> może być prosty i bezpieczny, jeśli
          skorzystasz ze wsparcia profesjonalistów.
        </p>
        <p>
          <strong>Onesta Group</strong> – Twoja polska agencja nieruchomości w Hiszpanii – pomoże Ci
          na każdym etapie, od wyboru mieszkania po podpisanie aktu notarialnego.
        </p>
        <p>
          Szukasz nieruchomości w Hiszpanii na sprzedaż?{" "}
          <strong>Skontaktuj się z nami już dziś</strong> – spełnij swoje marzenie o własnym domu w
          Hiszpanii!
        </p>
        <br></br> <br></br>
        Jeśli jesteś na jednym z pierwszych etapów poszukiwań swojej nieruchomości wyboru
        preferencji, koniecznie zapoznaj się z artykułem mówiącym o tym jak podejść do procesu na
        tych pierwszych etapach, klikając{" "}
        <Link
          href="/blog/jak-kupic-niruchomosc-w-hiszpanii"
          className="unredline text-blue-600 italic"
        >
          Pierwsze kroki w zakupie nieruchomości
        </Link>
        <br></br> <br></br>
        <p>
          Jeśli szukasz ofert, zapraszamy tutaj{" "}
          <Link href="/" className="unredline text-blue-600 italic">
            Wyszukiwarka ofert nieruchomości w Hiszpanii
          </Link>
        </p>
      </div>
      <ContactFormBlogPost temat="Jak kupić nieruchomość w Hiszpanii cz.1" />
      <Footer />
    </>
  );
}
