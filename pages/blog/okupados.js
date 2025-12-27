import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HeaderBlog from "../../components/HeaderBlog";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import Newsletter from "../../components/newsletter";
import Blogbuttonoffers from "../../components/blogbuttonoffers";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function Okupados() {
  const temat =
    "Okupados, Okupas, Okupado... a inwestowanie w nieruchomości w Hiszpanii";

  const showPropertiesOffers = useRef();

  useEffect(() => {
    setTimeout(() => {
      showPropertiesOffers.current.style.top = "70px";
    }, 5000);
  }, []);

  return (
    <>
      <Newsletter />
      <AnalitycsTools />
      <Head>
        <title>
          Okupados, ocupas... - kim są i czy stanowią zagrożenie? - Onesta Group
        </title>
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
        <meta name="Description" content="Okupados, " />
        <meta
          name="Keywords"
          content="Hiszpania apartamenty na sprzedaż, apartamenty na sprzedaż Hiszpania, apartamenty na sprzedaż w Hiszpanii, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, polska agencja nieruchomości w Hiszpanii"
        />
        <meta
          name="original-source"
          content="https://onesta.com.pl/blog/hiszpania-apartamenty-na-sprzedaz.html"
        />
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1100px] lg:mx-auto md:px-[50px] w-[90vw] mx-auto text-[20px] pt-24 leading-7 tracking-normal">
        Właśnie to pytanie w 2022 roku zyskało ogromną (nie)sławę. Niezwykle
        wrażliwy i wzbudzający wiele kontrowersji temat. Ze względu na to, że
        leży on u fundamentów jakichkolwiek inwestycji w Hiszpanii, a Polskie
        media nie dostarczają zbyt wielu sensownych informacji - przeszukaliśmy
        Hiszpańskie źrodła traktujące o problemie na poziomie prawnym oraz
        poznaliśmy konkretne przypadki z życia wzięte aby móc nadać temu
        wyraźnie więcej rzeczywistego wymiaru.
        <br></br>
        <br></br>
        <b>
          &quot;A co z okupas, okupados, ocupatos?... Wie Pan o chodzi...&quot;
        </b>{" "}
        <br></br>
        <br></br>Jakkolwiek by tego określenia nie przekręcać – każdy raczej wie
        o co chodzi. Okupados jest nazywany &quot;ruchem&quot; lub
        &quot;społeczną inicjatywą&quot; choć w Polsce raczej nie kojarzymy tego
        z niczym pozytywnym. Związana jest z nim cała ideologia, która ma być
        oparta o prawa człowieka do np. dachu nad głową, swojego miejsca. Nie
        zmienia to faktu iż drugą stroną medalu (tą stroną osób kupujących
        nieruchomość w Hiszpanii) owego dość nieścisłego prawa jest zagrożenie
        zwyczajnego prawa własności w formie bezprawnego (zdawać by się mogło)
        przejęcia mieszkania, domu przez „zasiedzianą osobę” - okupados.{" "}
        <br></br>Czy człowiek, który wszedł do mojego domu naprawdę może
        stać się Jego właścicielem? I tak i nie. Brzmi wystarczająco
        kuriozalnie? Rozpracujmy to zagadnienie.<br></br>
        <br></br>
        <b>Okupas, okupados, ocupatos, jednak najczęściej &quot;Okupa&quot;.</b>
        <br></br>
        <br></br>
        Choć będziemy używać różnych nazw w tym arykule, oficjalnie w Hiszpanii
        używa się - Okupa. Czy jest ku temu jakiś powód? Oczywiście. W Hiszpanii
        nie chcemy generować negatywnych konotacji tj. „bezprawne okupowanie” z
        ową ideaologią, raczej chcemy uniknąć społeczno-prawnych kontrowersji z
        tym związanych oraz nie narażać się na oskrżenia o swojego rodzaju
        napiętnowanie. „Jakie napiętnowanie” - zapewne pomyślała część z Was
        Drodzy Czytelnicy. Otóż sprawa nie jest taka prosta...<br></br>
        <br></br>
        Jak wspomniałem okupados to jedyna w swoim rodzaju społeczność lub ruch
        społeczny, który nie tylko w Hiszpanii znalazł swoją przestrzeń i
        odpowiedni do wzrostu grunt. Znalazł go również w wielu innych krajach
        europejskich, niemniej właśnie Hiszpanii od 1984r. najbardziej wrósł się
        w kulturę, dziś powodując sporo kontrowersji. <br></br>Bo czasy się
        jednak nieco zmieniły. <br></br>Zatem kiedy to było zasadne? <br></br>
        Okres w którym w Hiszpanii stało wiele pustych nieużytków, a ludzie, ba,
        całe rodziny nie miały się gdzie podziać ponieważ nie było ich stać na
        własne mieszkanie lub wynajem i w ramach własnego ratunku zajmowały
        stare, puste, często zniszczone lokale mieszkalne. Lokale pozornie ale i
        praktycznie nienależące do nikogo. Ruch zatem zrodził się z potrzeby
        przetrwania, a nie - jak to dziś może wyglądać - chęci łatwego
        wzbogacenia się lub przestępczego sposobu na zawłaszczenie cudzego
        mienia. Okazuje się, że intencją oraz głównym argumentem był zwyczajnie
        ratunek, często pewnie i własnego życia i wykorzystanie do tego
        opuszczonych przestrzeni, zrobienie z nieużytku użytku i uratowanie
        własnej skóry w sposób humanitarny... brzmi dobrze - jak na tamte czasy.
        <br></br>
        <br></br>
        Dziś, minęło blisko 40 lat ale prawo się nie zestarzało... lub zostało
        się niekorzystnie i stało się furtką do (bez)prawnego zrobienia z osoby
        która weszła do nie swojego domu - prawowitego właściciela. <br></br>Pod
        jednym warunkiem. <br></br>Nowy &quot;lokator&quot; musi się tam
        znajdować min. 48 godzin. Jeśli prawowity właściciel nie umie udowodnić,
        że było inaczej – mieszkanie &quot;zyskuje&quot; nowego właściciela -
        okupados. <br></br>Jeśli jednak prawowity właściciel potrafi udowodnić
        swoją własność w tym &quot;oknie czosowym&quot; – Hiszpańska Policja
        siłą i bez nakazu w trybie natychmiastowym pozbywa się bezprawnych
        lokatora lub lokatorów. Jeśli natomiast właściciel zareguaje po owych
        magicznych wręcz 48 godzinach - sprawa najcześciej jest wprowadzana na
        drogę sądową i w dość długi proces.<br></br>
        <br></br>
        <b>
          Należy pamiętać, że Hiszpańskie prawo w postaci artykułu 202 chroni
          ofiary włamań stanowiąc, że osoba, która siłą wtargnęła na nieswoją
          posesję, dopuściła się aktywności kryminalnej za co grozi do 6 lat
          więzienia.
        </b>{" "}
        Jest to silne zabezpieczenie przed włamaniami do domów, gdzie tę
        własność lub fakt nieautoryzowanego wejścia łatwo udowodnić na podstawie
        systemu zabezpieczeń np. włączeniem alarmu, nagraniem wejścia „lokatora”
        na kamerach, przedstawieniem rejestracji wejść do lokalu itp. Trzeba
        jednak pamiętać, że liczy się czas reakcji i te 48 godzin jest kluczowe
        aby sprawa została rozwiązana w miarę szybko i bezboleśnie.<br></br>
        <br></br>
        Na tle tego można domniemać, że problem dotyczy biedniejszych dzielnic
        Hiszpanii o słabych zabezpieczeniach lub ich całkowitym braku, tam gdzie
        trudno udowodnić własność bo dokumenty przepadły lub są
        gdzieś zapodziane (np. w okupowanej nieruchomości), nieruchomość jest
        tania z rynku wtórnego, która nie ma żadnego z wymieniownych w tym
        zdaniu atutów.<br></br>
        <br></br>
        Hiszpanie są na ogół zgodni, że przydałyby się skuteczniejsze środki w
        rozwiązywaniu problemu niechcianego lokatora. Choć dotyczy on (problem
        okupatos) niewielkiej, wręcz marginalej części Hiszpanii, raczej jw.
        nieużytków to prawne „ nieścisłości” powodują czasami nadużycia i znane
        są sytuacje przejęć lokali lub całych kamienic przez ugrupowania
        przestępcze aby w następnej kolejności wynajmować owe lokale obywatelom
        Hiszpanii. Mimo, że skala problemu jest jw. marginalna to aktywność
        przestępcza oparta o to prawo (słusznie) powoduje ogromną falę sprzeciwu
        społecznego o którym w efekcie głośno w mediach i który jak miecz
        obosieczny powoduje również sporo nieporozumień i lęku. Bez względu
        jednak na to czy włamanie miało miejsce w obiekcie gdzie właściciel
        okazał dowód własności lub nie - Hiszpanie mają ok 93% skuteczność w
        odzyskiwaniu okupowanych lokali. I to jest naprawdę dobra informacja
        <br></br>
        <br></br>
        <b>Wzrost ruchu okupados.</b>
        <br></br>
        <br></br>W czasie pandemii niestety ta „zła” forma okupowania mieszkań
        rośnie na skali problemu. Nie chodzi tutaj o włamania do lokali pod
        wynajem krótkoterminowy lecz o ludzi postawionych przed trudnymi
        wyborami. Ludzi którzy stracili pracę, którym skończyły się pieniądze i
        wraz z rodzinami posunęli się do &quot; zasiedzenia&quot; . Kryzys
        światowy i nieszczelny system prawny w tym Państwie nie wytrzymał
        zderzania z prawdziwą ludzką tragedią. Ilość zasiedzeń wzrosła, niemniej
        dalej stanowi wartość marginalną np. w Barcelonie okupatos stanowią ok.
        0.006 % mieszkańców co nie zmienia faktu iż jest duża grupa ludzi, która
        często kierowana instynktem przetrwania łamała prawo.<br></br>
        <br></br>
        Zatem sytuacje na wzór - wprowadzająca się do wynajmowanego mieszkania
        para przestaje płacić za czynsz i zostaje na dłużej dopóki właściciel
        podstępem nie włamie się do własnego mieszkania i nie zmieni zamków do
        drzwi podczas wakacji &quot;okupados&quot; finalnie odzyskując swoje
        mieszkanie - były jednymi z głośnieszych w mediach.<br></br>
        <br></br>
        <b>Możliwe rozwiązania.</b>
        <br></br>
        <br></br>
        1. Najlepszym rozwiązaniem jest po prostu dobre zabezpieczenie
        nieruchomości w Hiszpanii i szybkie reakcje. <br></br>Mimo, że problem
        okupados w nieruchomościach inwestycyjnych (przykładowe{" "}
        <Link
          href="/nieruchomosci/hiszpania/wszystkie-regiony"
          className="font-bold text-blue-700 underline"
        >
          Nieruchomości inwestycyjne w Hiszpanii
        </Link>
        ) stanowi raczej wyjątkową rzadkość (my oraz nasi partnerzy nie
        odnotowaliśmy włamania od ok 7 lat, a problem okupados nie dotknął nigdy
        i oby tak zostało) - <br></br>jest kilka możlowości zabezpieczeń:
        <br></br>- zabiezpieczenie się współpracą z lokalną firmą ochroniarską,
        która ma za zadanie zareagować w przypadku włączenia alarmu itp
        (nieautoryzowane wejście),<br></br>- pomoże system video-monitoringu,
        <br></br>- mamy do dyspozycji systemy, które w czasie rzeczywistym
        uruchamiają aplikację w telefonie o infomrując o nieautoryzowanym
        wejściu.<br></br>- firma zarządzają nieruchomością ma swoje
        zabezpieczenia, jest na miejscu i może zareagować,<br></br>- rejestr
        wejść i wyjść - aby otworzyć drzwi trzezba mieć hasło lub kod.<br></br>
        <br></br>
        Przy zabezpieczeniach owo 48 godzin to jednak wystarczająco dużo czasu
        na reakcję. Udowodnienie nieautoryzowanego wejścia przedstawione Policji
        w tym oknie czasowym powoduje natychmiastowe usuniecie przez Policję
        dzikich lokatorów i utratę ich statusu „ocupados”. Jakkolwiek to brzmi.
        Warto aby akt własności nie znajdywał się w miejscu potencjalnego
        włamania ponieważ „po fakcie” (oby nigdy nie nastąpił) nie będzie
        możliwe wejście do domu aby go przedstawić bo owy dom tymczasowo będzie
        miał innego właściciela.<br></br>
        <br></br>
        2. Jeśli nie uda się zareagować w ciągu owych 48 godzin, a mamy dostępne
        dowody własności, możemy wystosować{" "}
        <b>
          prawne pismo bezpośrednio do okupados z żadaniem o natychmiastowe
          opuszczenie lokalu załączając dokument potwierdzający własność.
        </b>{" "}
        Przy czym nie jest konieczne pisemne potwierdzenie ich tożsamości co
        jest uproszczeniem.{" "}
        <b>
          Taki Okupados ma 5 dni na udowodnienie, że jest inaczej, jeśli tego
          nie zrobi sąd wydaje natychmiastowy nakaz eksmisji bez możliwości
          odwołania się okupados od tej decyzji.
        </b>{" "}
        Pamiętajmy o artykule 202  i karze pozbawienia wolności do 6 lat takiego
        delikwenta.
        <br></br>
        <br></br>
        3. Jeśli minie 48 h i nie mamy dostępu do dowodu własności to mamy
        większy problem, ponieważ proces wchodzi na drogę sądową. Sprawa sądowa
        najpewniej skończy się udowodnienem prawdziej własności, natomiast w tym
        przypadku może to potrwać znacznie dłużej np. 1,5 roku. Hiszpańskie sądy
        od niedawna zaczęły traktować sprawy tego rodzaju jako priorytetowe co
        nie zmienia faktu, że trzeba się liczyć z kilkoma/kilkunastoma
        miesiącami sprawy, gdzie często się zdarza, że np. osoba wzywana się nie
        stawia na rozprawie, trudno ustalić Jej tożsamość itd.<br></br>
        <br></br>
        4. Jeśli minęło 48 godzin, a my nie mamy dowodu własności to ostatnią
        (najgorszą) z opcji jest opcja „na własną rękę”. Czyli użycie dość
        silnych argumentów perswazji samemu lub z pomocą lokalnych firm niemniej
        taki ruch może być karalny. Prawo Hiszpańskie może uznać to za próbę
        pozbycia się obecnego właściciela z domu siłą i bez podstaw prawnych.
        Jedną z takich nieoficjalnych metod jest wymiana zamków podczas min. 48
        godzinnej nieobecności okupados. <br></br>Opcji tej nie polecamy.
        <br></br>
        <br></br>
        <b>Podsumowując. </b>
        <br></br>
        <br></br>Prawo do wejścia do obiektu i zawłaszczenia go jest mocno
        przeterminowane i nie zostało dopasowane do obecnych czasów, rodzi
        patologie i może wspierać działania przestępcze w mocno nieunormowanych
        i niezaopiekowanych dzielnicach. Prawo jest nieaktualne. Pamiętajmy
        jednak, że taki Okupados w przypadku nawet podejrzenia zabezpieczeń tj.
        alarm, monitoring w upatrzonej nieruchomości w Hiszpanii raczej
        przestaje się nią interesować ponieważ na szali stawia 6 lat więzienia
        za włamanie, które raczej na 99% zostanie udowodnione. Rachunek wyglądal
        na dość prosty. Dlatego ta „przestępcza wersja” okupados dotyczy głównie
        środkowych i części Hiszpanii jak np. stare blokowiska, których niestety
        nie brakuje. <br></br>
        <br></br>Nie wyklucza to jednak faktu iż mogą znaleźć się tacy bardziej
        odważni lubi tacy którzy granicę odwagi już przekroczyli albo nie do
        końca świadomi, którzy niedoczytali prawa - którzy mogą spróbować
        włamania do domu z monitoringem i alarmem bo nie wiedzieli, że trzeba
        przesiedzieć 48 h i bronić się jak w Hiszpańskim La Casa de Papel
        (Hiszpański serial Dom z Papieru) aby zdobyć nowy teren.<br></br>
        <br></br>W związku z powyższym, nie ma powodów do paniki, jednak
        zabezpieczajmy się na zasadzie podobnej jak zrobilibyśmy to w naszych
        domach w Polsce. <br></br> Te same metody powinny rozwiązać różne
        zagrożenia w tym Hiszpańskich Ocupados.<br></br>
        <br></br>
        <br></br>
        <br></br>
        <Link
          href="/nieruchomosci/hiszpania/wszystkie-regiony"
          className="text-white md:text-[26px] text-auto font-normal flex items-center py-[10px] rounded-2xl justify-center bg-green-500 md:w-[500px] shadow-xl mb-[50px] mx-auto"
        >
          Przeglądaj oferty nieruchomości
        </Link>
      </div>
      <ContactFormBlogPost temat={temat} />
      <Footer />
    </>
  );
}
