import React from 'react'
import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../components/Header';
import Link from 'next/link';
import Footer from '../components/Footer';
import ContactFormBlogPost from '../components/ContactFormBlogPost';

export default function Polityka() {

  const [searchShow, setSearchShow] = useState(true);

  return (
        <>
         {/* <!-- Google tag (gtag.js) --> */}
         <Script async src="https://www.googletagmanager.com/gtag/js?id=G-P4VZ7P7VZ5"></Script>
          <Script id="google-analitycs">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P4VZ7P7VZ5');
              `}
          </Script>
        <Head>
            <title>Polityka Prywatności - Onesta Group</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1" />
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
            <link href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap" rel="stylesheet"></link>
        </Head>
        <Header
            searchShow={searchShow}
        />
        {/* <MiniHomeView /> */}
        <div className='w-10/12 mx-auto my-20'>

        <h1 className='text-2xl font-bold'>Polityka Prywatności.</h1><br></br>

        Polityka prywatności dotycząca przetwarzania danych osobowych Onesta Group Sp. z o.o.

        Zgodnie z art. 13 ROZPORZĄDZENIA PARLAMENTU EUROPEJSKIEGO I RADY (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), zwanego dalej RODO, poniżej znajdują się kwestie informacyjne dotyczące przetwarzania Pana/Pani danych osobowych w związku z realizacją usługi pośrednictwa w zakupie/sprzedaży/najmie nieruchomości. 
        <br></br> <br></br>	
        Administratorem Pana/Pani danych osobowych jest Onesta Group Sp. z o.o. 53-148 Wrocław, ul. Wolbromska 18/1b wpisana do Krajowego Rejestru Sądowego przez Sąd Rejonowy dla Wrocławia Fabrycznej we Wrocławiu, VI wydział gospodarczy Krajowego Rejestru Sądowego pod numerem KRS 0000965371, NIP: 8992922378, Regon: 521711491.
        <br></br> <br></br>
        W sprawach, które mają związek z ochroną danych osobowych można się kontaktować w poniższy sposób : <br></br>
        - mailowo na adres : biuro@onesta.com.pl <br></br>
        - telefonicznie pod numerem : +48 669 75 25 25 <br></br>
        - listownie na adres : Fenomen , ul. Wolbromska 18/1b , 53-148 Wrocław <br></br>
        <br></br> <br></br>	
        Pana/Pani dane osobowe będą przetwarzane na podstawie wyrażonej zgody. 
        <br></br> <br></br>
        Pana/Pani dane osobowe będą przetwarzane w celu kontaktu, przedstawienia oferty nieruchomości, zawarcia umowy pośrednictwa, pośrednictwa w sprzedaży lub zakupie nieruchomości, pośrednictwa finansowego, w celach marketingowych tj. mailowego informowania o nowych ofertach ciekawych nieruchomości, w celach związanych z obowiązkiem rachunkowo podatkowym, sposób korzystania z witryny internetowej nie przypasowany do użytkownika a jako dane zapisywane na logach serwera służące pomocniczo do administrowania stroną, wykorzystanie plików cookies.
            <br></br> <br></br>
        Po zakończeniu przetwarzania danych osobowych w celach wymienionych w pkt. 4  dane nie będą dalej przetwarzane, chyba że w celu ewentualnego dochodzenia roszczeń. 
            <br></br> <br></br>
        Podstawą prawną do przetwarzania danych osobowych jest : 
            <br></br> <br></br>
        - art. 6 ust. 1. Lit. a RODO, (osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów)  ; <br></br>
        - art. 6 ust. 1. Lit. b RODO (przetwarzanie jest niezbędne do wykonania umowy, której stroną jest osoba, której dane dotyczą, lub do podjęcia działań na żądanie osoby, której dane dotyczą, przed zawarciem umowy) ; <br></br>
        - art. 6 ust. 1. Lit. a RODO (przetwarzanie jest niezbędne do wypełnienia obowiązku prawnego ciążącego na administratorze[dane osobowe znajdują się na fakturze VAT]) ; <br></br>
        - art. 6 ust. 1. Lit. f RODO (przetwarzanie jest niezbędne do celów wynikających z prawnie uzasadnionych interesów realizowanych przez administratora lub przez stronę trzecią, z wyjątkiem sytuacji, w których nadrzędny charakter wobec tych interesów mają interesy lub podstawowe prawa i wolności osoby, której dane dotyczą, wymagające ochrony danych osobowych, w szczególności gdy osoba, której dane dotyczą, jest dzieckiem.) 
        <br></br> <br></br>
        Dane osobowe przez nas przetwarzane :  <br></br>
        - dane, które wpiszą Państwo w formularzu kontaktowym <br></br>
        - imię i nazwisko <br></br>
        - numer telefonu <br></br>
        - adres zamieszkania <br></br>
        - numer dowodu osobistego lub pesel , bądź inny dokument tożsamości <br></br>
        - adres e-mail <br></br>
        - adres IP <br></br>
        - data i czas serwera <br></br>
        - numer ID przeglądarki internetowej <br></br>
        - parametry techniczne urządzenia i oprogramowania, które wykorzystuje użytkownik <br></br>
        - lokalizacja urządzenia <br></br>
        - dane dostępne na FB jak płeć, zawód, zainteresowania, itp. – w celu lepszego dobrania oferty <br></br> <br></br>

        Pana/Pani dane mogą być przekazywane podmiotom, z którymi współpracujemy, potrzebującym dostępu do niektórych danych abyśmy mogli wykonać należycie nasze zadanie zlecone przez Pana/Panią.  Poniżej podmioty o których mowa : <br></br>
        - Perfecta - Wrocław - w przypadku projektów graficznych, <br></br>
        Fenomen Invest - pośrednictwo  nieruchomości w Hiszpanii oraz w Polsce, <br></br>
        I&M Group – pośrednictwo nieruchomości w Hiszpanii <br></br>
        innych podmiotów współpracujących w celu realizacji zgłoszenia i/lub zamówienia <br></br> ofertowego, każdorazowo będziecie Państwo pytani o zgodę na przekazanie danych. <br></br>

        Ponad to : <br></br>
        - Organom podatkowym uprawnionym z mocy prawa <br></br>
        - Księgowości <br></br>
        - Obsłudze informatycznej <br></br>
        - Obsłudze wysyłkowej – kurier, poczta <br></br>
        Każda z wymienionych firm gwarantuje ochronę danych osobowych zgodną z RODO i nie przekazywaniem ich do krajów trzecich, gdzie RODO nie występuje. 
        <br></br> <br></br>
        Pana/ Pani dane osobowe będą przechowywane przez okres niezbędny do realizacji celów przetwarzania, czyli do momentu aż będą prowadzone rozmowy na temat zakupu/sprzedaży/najmu nieruchomości lub do czasu wycofania przez Pana/Panią zgody na przetwarzanie danych. Dane tj. Numer kontaktowy, adres email będą również przetwarzane w celach marketingu bezpośredniego w postaci, przedstawiania ofert, wysyłki newslettera lub kontaktu telefonicznego celem przedstawienia ofert. W przypadku realizacji transakcji dane będą przechowywane kolejne 5 lat podatkowych , zgodnie z obecnymi przepisami prawa. 
        <br></br> <br></br>
        Profilowanie. Administrator będzie korzystał z możliwości profilowania użytkownika poprzez serwisy tj. Facebook i Google w celach marketingowych. Profilowanie to zbiór zachowań i zainteresowań użytkowników danych serwisów, które ułatwiają zaproponowanie oraz dotarcie do danego użytkownika z lepiej dobraną ofertą. Dane służą również docieraniu do innych - podobnych użytkowników w podobym celu - bardziej dopasowanego i trafnego marketingu.
        <br></br> <br></br>
        W związku z przetwarzaniem danych osobowych, posiada Pan/Pani prawo do : <br></br>
        - dostępu do swoich danych osobowych, <br></br>
        - sprostowania danych osobowych, <br></br>
        - usunięcia danych osobowych (tzw. prawo do bycia zapomnianym), wysyłając wiadomość na adres : biuro@onesta.com.pl, bądź listownie na adres : 53-148 Wrocław, ul. Wolbromska 18/1b, <br></br>
        - cofnięcia zgody na przetwarzanie danych osobowych poprzez wiadomość na adres mailowy: biuro@onesta.com.pl, bądź listownie na adres : 53-148 Wrocław, ul. Wolbromska 18/1b, <br></br>
        - ograniczenia przetwarzania danych osobowych poprzez wiadomość na adres mailowy: biuro@onesta.com.pl, bądź listownie na adres : 53-148 Wrocław, ul. Wolbromska 18/1b <br></br>
        - Przenoszenia swoich danych osobowych poprzez wiadomość na adres mailowy: biuro@onesta.com.pl, bądź listownie na adres : 53-148 Wrocław, ul. Wolbromska 18/1b <br></br>
        - Wniesienia sprzeciwu wobec przetwarzania swoich danych osobowych z przyczyn związanych z Pana/Pani szczególną sytuacją, zgodnie z art. 21 RODO poprzez wiadomość na adres mailowy: biuro@onesta.com.pl, bądź listownie na adres : 53-148 Wrocław, ul. Wolbromska 18/1b.
        <br></br> <br></br>
        W przypadku gdy uzna Pan/Pani, że przetwarzanie danych osobowych jest niewłaściwe i narusza RODO, przysługuje Panu/Pani prawo Zgodnie z art. 77 RODO do wniesienia skargi do organu nadzorczego, tj. Prezesa Urzędu Ochrony Danych Osobowych pocztą tradycyjną pod adresem ul. Stawki 2, 00-193 Warszawa, pocztą elektroniczną kancelaria@uodo.gov.pl. Więcej informacji na ten temat uzyska Pan/Pani na stronie internetowej : https://uodo.gov.pl/ . 
        <br></br> <br></br>
        Podanie przez Pana/Panią danych osobowych jest dobrowolne, jednak jest niezbędne do realizacji umowy pośrednictwa sprzedaży/nabycia/najmu. Bez podania danych osobowych nie jesteśmy w stanie realizować umowy. Ponadto dane osobowe są niezbędne w celu spełnienia obowiązku podatkowego, realizacji zadań po sprzedaży.
        <br></br> <br></br>
        Pana/Pani dane osobowe nie będą przekazywane poza terytorium Europejskiego Obszaru Gospodarczego. 
        <br></br> <br></br>
        Dodatkowo Pana/Pani dane osobowe pozyskane od Pana/Pani będą przetwarzane w sposób zautomatyzowany ( w tym w formie profilowania pkt 10.) dodatkowo przetwarzane będą pliki cookies i eksploatacyjne w sposób zautomatyzowany właśnie jak również poddane profilowaniu według definicji zawartej w RODO. 
        </div>
    </>
    )
}