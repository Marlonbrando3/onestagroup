import React from "react";
import Head from "next/head";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Header from "../../components/Header";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import Image from "next/image";

export default function BlogPost() {
  const temat = "Torrevieja apartamenty na sprzedaż. Region. Atrakcje.";

  return (
    <>
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
        <title>Torrevieja apartamenty na sprzedaż. Region - Onesta Group</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
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
      <div className="lg:px-40 px-4 pt-24 leading-7 tracking-normal">
        W regionie Costa Blanca Torrevieja jest miejscowością, która Polskich inwestorów przyciąga
        praktycznie najczęściej. Nie znaczy to, że jest to najlepszy region inwestycyjny, czasami
        może być wręcz przeciwnie ale dla osób, które często inwestują po raz pierwszy lub mają tzw.
        „wolne środki” apartamenty na sprzedaż w Torrevieja mogą być atrakcyjne.<br></br>
        <br></br>
        Dziś skupię się na kilku istotnych kwestiach, które osoby szukające nieruchomości w tym
        regionie mogą Interesować.<br></br>
        <br></br>
        <div className="border my-10 px-2 lg:w-2/3 w-full">
          <p className="py-2 font-bold text-xl">Spis treści:</p>
          <p className="py-1">1. Ceny apartamentów na sprzedaż w Torrevieja</p>
          <p className="py-1">2. Urbanizacja miasta.</p>
          <p className="py-1">3. Plaże.</p>
          <p className="py-1">4. Najciekawsze atrakcje.</p>
          <p className="py-1">5. Wynajem, cz to się opłaca?</p>
        </div>
        <b>1. Ceny nieruchomości.</b>
        <br></br>
        <br></br>
        Szukając apartamentów na sprzedaż w Torrevieja, głównym czynnikiem lub wyróżnikiem jest po
        prostu niższa ich cena. Tak, Nieruchomości w Torrevieja są na ogół znacznie tańsze niż w
        innych regionach Hiszpanii. Co to znaczy? Ceny zaczynają się od ok 55 000 euro, natomiast
        sama nieruchomość, wyposażenie jest często w stanie do gruntownego remontu, wymiany
        klimatyzacji i bez udogodnień tj. parking itp. W Torrevieja sensowne nieruchomości na
        sprzedaż, czyli takie, które uznajmy umożliwiające zamieszkanie bo delikatnym odświeżeniu
        (pomijając kwestie liczników i dokumentów, aktów) z mojego doświadczenia zaczynają się od
        kwot 80 000 euro i często są to raczej obiekty typu sypialnia plus łazienka. Zatem jeśli
        kupujemy coś dla siebie zdając sobie sprawię, że rzadziej wynajmują się nieruchomości z
        jedną sypialnią bez parkingu i nieco dalej od morza tj. orientacyjnie do ok 10 min
        spacerem., może to być coś dla nas.
        <br></br>
        Natomiast jeśli coś dołożymy do tej kwoty i będzie to ok. 100 000 - 140 000 euro. Tu już
        (również z delikatną trudnością) znajdziemy 2 sypialnie, może 2 łazienki, umówienie blisko
        morza, czasami z parkingiem.
        <br></br>
        <br></br>
        Zmiennymi, które wpływają głównie na cenę są: - <b>Parking</b>: w Torrevieja niestety
        przedzielone do obiektu miejsca parkingowe są raczej rzadkością co jest dużym problemem dla
        turystów. - <b>Basen</b> na obiekcie - tutaj mowa głównie o bungalowach, które również (choć
        raczej na obrzeżach) w Torrevieja są. Czym jest bungalow? Najczęściej obiektami
        dwu-poziomowymi, w zamkniętych osiedlach. Apartament dolny zazwyczaj ma ogródek, a górny -
        taras na dachu zwany „solarium”. Takie obiekty są najatrakcyjniejsze dla osób szukających
        nieruchomości na Costa Blanca. - <b>Bliskość do morza</b> - Wszystko co jest co jest do ok 2
        km od morza może zostać umownie uznane za spełniające ten warunek.
        <br></br>
        <br></br>
        <b>2. Urbanizacja miasta</b>
        <br></br>
        <br></br>
        Torrevieja jest miejscem, które dość szybko zmienia swój klimat gdy wycieczkę zaczynamy od
        plaży idąc w głąb miast. Przy jednej z lepszych plaż tj. Playa del Cura, miejsce robi bardzo
        dobre wrażenie. Promenada z restauracjami i sklepami, restauracja bezpośrednio przy morzu.
        Sklepiki w których znajdziemy prawie wszystko, szeroka i ładna promenada. Kolejne przecznice
        Torrevieja to już wysokie bloki i wąskie jednokierunkowe ulice, wszystkie miejsca parkingowe
        zajęte aż właściwie głównej części Torrevieja nie opuścimy. Właśnie to wraz cechami
        omówionymi w pkt wyżej powoduje, że inwestycje są tanie ale co za tym idzie zyski z wynajmu
        również kwoto są niższe. Zapewne dalej będą to wartości rzędu 2-6% netto natomiast im niższa
        kwota zakupu tym owy % w walucie euro to też mniej pieniędzy. Pamiętajmy, że w przypadku
        nieruchomości na sprzedaż w Torrevieja musimy liczyć się z interwencjami i naprawami różnego
        rodzaju, od boilera, przed klimatyzatory po instalację elektryczną co spowoduje spadek owego
        zysku.<br></br>
        Wracając. Charakter miasta nie przypomina raczej stylu, który kojarzy się z wakacjami,
        odpoczynkiem i komfortem. Natomiast (wyjątkowo wieczorem, lub przy zachodzącym słońcu)
        sprawia wrażenie nawet przyjemnego. Gwar, dostępność sklepów, temperatury i palmy skutecznie
        pomagają. Myślę, że miasteczko jest jednak nieco pozbawione charakteru ale wielu się tam
        odnajdzie.<br></br>
        <br></br>
        <b>3. Plaże.</b>
        <br></br>
        <br></br>- <b>Playa del Cura</b> - (zdjęcie niżej) to najbardziej popularna plaża w
        Torrevieja, znajdująca się w centrum miasta. Plaża ma około 325 metrów długości i oferuje
        wszystkie udogodnienia, w tym bary, restauracje i sklepy.<br></br>-{" "}
        <b>Playa de Los Locos</b> - to długa i szeroka plaża z drobnym piaskiem, znajdująca się w
        północnej części miasta. Plaża jest bardzo popularna wśród rodzin z dziećmi, ponieważ ma
        łagodne zejście do wody.<br></br>- <b>Playa de La Mata</b> - to jedna z największych plaż w
        Torrevieja, o długości ponad 2 km. Plaża jest bardzo dobrze utrzymana i oferuje wiele
        udogodnień, w tym bary, restauracje i sklepy.<br></br>- <b>Cala Ferris</b> - to mała,
        urokliwa plaża, znajdująca się w pobliżu wieży La Mata. Plaża jest idealna dla osób
        szukających ciszy i spokoju, ponieważ jest mniej zatłoczona niż inne plaże w Torrevieja.
        <br></br>- <b>Playa de Los Náufragos</b> - to kolejna popularna plaża w Torrevieja, która
        znajduje się w południowej części miasta. Plaża ma około 400 metrów długości i oferuje wiele
        udogodnień, w tym bary, restauracje i sklepy.<br></br>
        <br></br>
        <div className="flex flex-col">
          <Image src="/torrevieja-apartamenty-na-sprzedaz.png" width={800} height={800} />
          <p className="text-sm font-bold">
            fot. Playa del Cura, Torrevieja, pierwsza linia brzegowa.
          </p>
        </div>
        <br></br>
        <br></br>
        <b>4. Najciekawsze atrakcje.</b> <br></br>
        <br></br>- Las Salinas de Torrevieja - to słone jezioro, które słynie z pięknej różowej
        barwy wody. To naturalne zjawisko jest spowodowane obecnością mikroskopijnych organizmów,
        które żyją w wodzie. Las Salinas de Torrevieja to także ważne miejsce dla ptaków - w okolicy
        gniazduje wiele gatunków, w tym flamingi.<br></br>- Park Naturalny Lagunas de La Mata y
        Torrevieja - to obszar chroniony, który obejmuje słone laguny La Mata i Torrevieja. To
        miejsce pełne różnorodnej roślinności i zwierząt, a także szlaków turystycznych, które
        umożliwiają zwiedzanie parku.<br></br>- Muzeum Morskie - to muzeum, które poświęcone jest
        historii miasta i jego związkom z morzem. W muzeum można zobaczyć wiele eksponatów
        związanych z rybołówstwem, żeglarstwem i historią torreviejaskiego portu.<br></br>- Wieża La
        Mata - to średniowieczna wieża, która była częścią systemu obrony wybrzeża. Wieża została
        zbudowana w XV wieku i odrestaurowana w XX wieku. Z jej szczytu rozciąga się piękny widok na
        okolicę.<br></br>- Plaże - Torrevieja słynie z pięknych plaż, które są idealne do wypoczynku
        i relaksu. Najpopularniejsze z nich to: Playa del Cura, Playa de Los Locos, Playa de La Mata
        i Playa de Los Naufragos.<br></br>- Park wodny Aquopolis - to park wodny, który oferuje
        mnóstwo atrakcji dla całej rodziny, w tym zjeżdżalnie, baseny z falami, jacuzzi i wiele
        innych. To idealne miejsce na spędzenie gorącego dnia.<br></br>- Jaskinie Canelobre - to
        jaskinie znajdujące się w okolicy miasta Alicante, około 40 minut jazdy od Torrevieja. To
        jedne z najpiękniejszych jaskiń w Hiszpanii, które są warte odwiedzenia.<br></br>- Festiwale
        - Torrevieja organizuje wiele festiwali i imprez przez cały rok. Warto odwiedzić miasto
        podczas Fiesta de la Habanera (festiwal muzyki hiszpańskiej), Semana Santa (Święty Tydzień)
        lub na Słoniowej Paradzie, która odbywa się w sierpniu.<br></br>- Rzeźby w parku Alfonso
        XIII - to park miejski, który wzbogacają rzeźby różnych artystów. W parku znajduje się m.in.
        rzeźba &quot;La Mujer del Pescador&quot; autorstwa Víctora García Villalgordo oraz &quot;El
        Hombre y el Mar&quot; autorstwa Francisco Jurado.<br></br>
        <br></br>
        <b>5. Wynajem, czy to się opłaca?</b>
        <br></br>
        <br></br>
        Inwestowanie w apartamenty na sprzedaż w Torrevieja (pomijając kwestie prawne, którymi
        prawnik się zajmuje) jest bezpieczne, proces zakupu bywa uciążliwy niemniej trudno
        powiedzieć aby była to jedna z lepszych form inwestowania. <br></br>
        Pamiętajmy, że turyści wyjeżdżając na wakacje szukają jednak tego komfortu i za niego chcą
        płacić więcej. Także parking, bliskość do plaży, basen na obiekcie i ciekawe atrakcje w
        pobliżu są bardzo ważne. <br></br>Torrevieja nie jest miejscowością, która zaspokoi
        te oczekiwania klientów, dlatego raczej musimy się liczyć, że nasz apartament w Torrevieja
        będzie przynosił mniej zysku niż w miejscach takich jak np. Calpe, Altea, San Pedro del
        Pinatar, Mil Palmeras, gdzie charakter miast już przypomina ten Hiszpański. Jeśli znajdujemy
        apartament na sprzedaż w Torrevieja warto sprawdzić dokładnie, które On kryteria spełnia,
        jakie są kwoty na portalach typu Booking.com za dobę, jakie są koszty sprzątania itd. i
        możemy w jakimś przybliżeniu wyliczyć zwrot z takiej inwestycji. Zakładając pobieżnie, że
        jest to 5% w stosunku do kwoty zakupu, mamy:<br></br>
        <br></br>
        <b>90 000 * 0,03 = 2700 euro rocznie zwrotu netto</b>
        <br></br>
        <br></br>
        Na tle tego inwestycja w San Pedro del Pinatar, rynek pierwotny.<br></br>
        <b>270 000 * 0,07 = 18 900 euro rocznie.</b>
        <br></br>
        <br></br>
        <b>Podsumowując.</b> <br></br>
        <br></br>Znalezienie poprawnego (powyżej 80 000 euro) apartamentu na sprzedaż w Torrevieja,
        kupienie go i próba efektywnego wynajmu jest inwestycją natomiast są zdecydowanie lepsze
        formy inwestowania. Jeśli zakładam, że chcemy mieć coś w Hiszpanii, mamy budżet na poziomie
        ma 150 000 euro i nie więcej i wiemy, że mieszkanie nam się będzie powoli spłacać, a może
        wyjść czasami na zero, to dlaczego nie.
        <br></br>
        <br></br>
        <b>Napisz do nas, a prześlemy Ci kilka ciekawych ofert z Torrevieja</b>
      </div>
      <ContactFormBlogPost temat={temat} />
    </>
  );
}
