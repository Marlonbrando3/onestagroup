import React from "react";
import Head from "next/head";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Link from "next/link";
import Header from "../../components/Header";
import HeaderBlog from "../../components/HeaderBlog";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import Newsletter from "../../components/newsletter";
import Blogbuttonoffers from "../../components/blogbuttonoffers";

export default function BlogPost() {
  const temat = "Nieruchomości w Hiszpanii, jak rynek się zmienił";

  return (
    <>
      {" "}
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
      <Newsletter />
      <Head>
        <title>Nieruchomości w Hiszpanii, jak zmienił się rynek - Onesta Group</title>
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
        <meta
          name="Description"
          content="Nieruchomości Hiszpania. Pośrednictwo w sprzedaży nieruchomości w Hiszpanii. Z artykuły dowiesz się jak zmienił się rynek nierchomości w Hiszpanii."
        />
        <meta
          name="Keywords"
          content="Nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, polska agencja nieruchomości w Hiszpanii"
        />
        <meta
          name="original-source"
          content="https://onesta.com.pl/blog/nieruchomosci-w-hiszpanii-co-sie-zmienilo.html"
        />
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1100px] lg:mx-auto md:px-[50px] w-[90vw] mx-auto text-[20px] mb-[60px]">
        Rynek <strong>nieruchomości w Hiszpanii</strong> dla polskich klientów jest wciąż
        atrakcyjny?<br></br>Mimo minionego BOOMu w 2023 roku, po którym wydawać się mogło, że rynek
        na chwilę przystanie, obserwujemy znów{" "}
        <span className="text-green-600 font-bold">
          wyraźny wzrost zainteresowanie Polaków Hiszpanią.
        </span>
        <div className="border my-10 px-2 lg:w-2/3 w-full">
          <p className="py-2 font-bold text-xl">Z opracowania dowiesz się głównie:</p>
          <p className="py-0">Jaka jest ogólna kondycja rynku w Hiszpanii.</p>
          <p className="py-0">Co się zmieniło w ostatnich 2 latach.</p>
          <p className="py-0">
            Zmiany cen <strong>nieruchomości w Hiszpanii.</strong>
          </p>
          <p className="py-1">
            Na co możemy liczyć kupując <strong>nieruchomość w Hiszpanii.</strong>
          </p>
        </div>
        <br></br>
        <p>
          Na początek kilka faktów, które „narysują” nam aktualną sytuację w Hiszpanii i pozwolą
          zrozumieć czy warto jeszcze kupić <strong>nieruchomość w Hiszpanii</strong>. <br></br>
          <br></br>
          <strong className="text-[26px] font-bold">1. Stabilność rynku w Hiszpanii</strong>{" "}
          <br></br>
          <br></br>Dla osób chcących inwestować informacje są jedynie dobre. Przed czy po
          zeszłorocznym boomie na zakup <strong>nieruchomości w Hiszpanii</strong> wciąż widać
          stabilnie rosnący rynek.{" "}
          <span className="text-green-600 font-bold">
            Ceny nieruchomości nie zatrzymały się ani na chwilę i{" "}
          </span>
          <strong>
            prognozowany wzrost cen/wartości nieruchomości w obecnym roku wyniesie nawet 5%.
          </strong>
          &nbsp;Z danych, które ukazało Ministerstwo Rozwoju, w ostatnich 5 latach ceny na rynku{" "}
          <strong>nieruchomości w Hiszpanii wzrosły o ponad 14%</strong>. <br></br>
          <br></br>GDP w Hiszpanii (takie Polskie PKD){" "}
          <span className="text-green-600 font-bold">
            jest wysze niż w krajach tj. Francja czy USA, dlatego Hiszpania to kraj wyjątkowo dobry
            do inwestowania
          </span>
          , stabilny i jak się okazuje odporny na „boomy” oraz chwilowe mody. Zatem wywnioskować
          można, że prognozuje się jeszcze szybszy wzrost niż miał miejsce jeszcze kilka lat temu.{" "}
          <br></br>
          <br></br>
        </p>
        <h2 className="text-[34px] italic my-[60px] text-center text-gray-500">
          &quot;Ceny na rynku nieruchomości w Hiszpanii wzrosły o ponad 14%&quot;
        </h2>
        <strong className="text-[26px] font-bold">2. Hiszpania okiem Polaków</strong> <br></br>
        <br></br>
        <p>
          Wśród Polaków zainteresowanie tym regionem na chwilę zmalało - choć będąc precyzyjnym -
          boom w 2023r. spowodował, że osoby, które chciały kupić nieruchomość w Hiszpanii w
          przeciągu kilkunastu, kilkudziesięciu miesięcy - zrobiły to znacznie wcześniej. Obecnie w
          naszym kraju{" "}
          <span className="text-green-600 font-bold">
            obserwujemy gwałtowny (blisko 9 krotny) wzrost zapytań o nieruchomości w Hiszpanii
            stosunku do minionego kwartału.
          </span>{" "}
          <br></br> <br></br>
          <strong className="text-[26px] font-bold">
            3. Jak boom zmienił rynek deweloperski w kwestii cen nieruchomości w Hiszpanii.
          </strong>{" "}
          <br></br> <br></br>
          Pchani trendem nie tylko Polacy ale również obywatele innych krajów tj. Belgia, Niemcy, UK
          itd. mieli ogromny wpływ na tempo sprzedaży nieruchomości,{" "}
          <span className="text-green-600 font-bold">
            decyzje o zakupie apartamentu za ponad 200 000 euro padały w ciągu kilkudziesięciu minut
          </span>
          , zatem dynamizm rynku przypominał czasami bardziej wyścig niż przyjemny zakup. Ci którzy
          wykazali się dobrym „nosem” i odwagą, kupili i są zdecydowanymi zwycięzcami. Cieszymy się,
          że wielu z Nich mogliśmy pomóc. W efekcie na nieruchomość deweloperską{" "}
          <span className="text-green-600 font-bold">
            dziś trzeba czekać średnio 1,5 roku (wcześniej ok 3 m-cy).
          </span>{" "}
          Jest sprzedanych kilka etapów „do przodu”, a mówiąc bardziej zrozumiale, jeśli obecnie
          oddany do użytku jest etap np.3 inwestycji to kończy się sprzedaż 6-go. Jest jednak
          możliwe znalezienie inwestycji, która oddana będzie szybciej, wymaga to jednak sporo
          pracy.{" "}
          <span className="text-green-600 font-bold">
            Deweloperzy sprzedali dziesiątki mieszkań za dużo wyższe kwoty i nie ma teraz potrzeby
            aby ceny obniżać, dawać dodatkowe rabaty lub w jakikolwiek sposób motywować klientów do
            zakupu.
          </span>{" "}
          Raczej jesteśmy na etapie gdzie dla dewelopera klienta jest najmniejszym zmartwieniem, ba,
          teraz to klient bardziej szuka dewelopera i{" "}
          <span className="text-green-600 font-bold">
            taka sytuacja powinna utrzymać się jeszcze latami.{" "}
          </span>
          Co nie jest ani dobre ani złe ponieważ otwartość, dobre nastawienie oraz ugodowość
          deweloperów wciąż jest taka jak był, ale to już mentalność obywateli Hiszpanii.
          <br></br>
          <h2 className="text-[34px] italic my-[60px] text-center text-gray-500">
            &quot;W efekcie na nieruchomość w Hiszpanii z rynku pierwotnego dziś trzeba czekać
            średnio 1,5 roku&quot;
          </h2>
          <br></br>
          <strong className="text-[26px] font-bold">
            4. Jak zmienił się rynek deweloperski w kwestii cen nieruchomości w Hiszpanii.
          </strong>
          <br></br>
          <br></br>
          Mówiąc w skrócie podaż <strong>nieruchomości w Hiszpanii</strong> wciąż przewyższa popyt
          ale podaż tych nieruchomości choć trochę wartych zakupu to dalej walka z czasem.
          <span className="text-green-600 font-bold">
            Atrakcyjne nieruchomości potrafią zniknąć z rynku w ciągu godziny.
          </span>{" "}
          Często jak klient nie jest na miejscu to raczej nie zdąży z Polski dolecieć aby każda z
          ofert była aktualna, najczęściej ich liczba zmniejsza się zdecydowanie o ponad połowę.
          Dlatego przy chęci zakupu <strong>nieruchomości w Hiszpanii</strong> z rynku wtórnego
          <span className="text-green-600 font-bold">
            najlepiej przygotować się na krótkie wakacje (5-7 dni)
          </span>{" "}
          , zacząć działać już przed wlotem oraz dynamiczni w trakcie śledząc aktualne oferty.{" "}
          <span className="text-green-600 font-bold">
            Bardzo często zdarza się, że zakup jest realizowany zdalnie
          </span>
          , czyli na podstawie nagrań, relacji, video lub zdjęć klienci rezerwują nieruchomość
          wpłacając bezwrotną opłatę rezerwacyjną ok 5000 euro i mieszkanie jest ściągane z rynku.
          <br></br>
          <br></br>
          <strong className="text-[26px] font-bold">
            5. Hiszpania jako kierunek dla turystów - wynajem krótkoterminowy
          </strong>
          <br></br>
          <br></br>
          Hiszpania jest jednym z najcześciej wybieranych krajów turystycznych, a dokładnie{" "}
          <span className="text-green-600 font-bold">
            jest jednym z 3-ech najczęściej wybieranych kierunków wakacyjnych, nie zmieniło się to
          </span>
          . Hiszpania w okresie wakacyjnym skupia ludzi z praktycznie całego świata i generuje
          ogromny ruch turystyczny na wybrzeżach Hiszpanii w odlegości do 1,5 km. od morza choć to
          też się zmienia. Inwestując w nieruchomość z takim celem musimy przygotować się na dość
          duży wydatek bo ponad 240 000 euro z rynku pierwotnego lub 180 000 z rynku wtórnego ale
          liczymy na bardzo wysokie{" "}
          <span className="text-green-600 font-bold">
            zyski w czasie wynajmu w sezonie, sięgające nawet 8% wartości nieruchomości.
          </span>
          <br></br>
          <br></br>
          <strong className="text-[26px] font-bold">
            6. Hiszpania jakie kierunki wynajmu długoterminowego.
          </strong>
          <br></br>
          <br></br>
          Również - jest to jeden z najcześciej wybieranych kierków dla obywateli Państw północnych.
          <span className="text-green-600 font-bold">
            {" "}
            &quot;Hiszpania jako „kraj wiecznego słońca&quot;
          </span>{" "}
          jest atrakcyjna dla osób z np. UK nawet w zimę. Dlatego osoby pracujące zdalnie, lub
          prowadzące firmy, mogące się relokować wybierają Hiszpanię jako cel najmu długoterminowego
          (czyli znaczna część zimy). Kwoty za wynajem przy długim okresie są niższe, niemniej mając
          taki cel - wynajmujący szuka czegoś już dalej od morza nawet do 10 km tym samym tańszego w
          zakupie, spokojniejszego. Tutaj pewnie znajdziemy coś w kwocie poniżej 190 000 euro w
          stanie deweloperskim lub ok 120 000 z rynku wtórnego.{" "}
          <span className="text-green-600 font-bold">
            Zyski trudno przewidzieć ale zaczynają się od ok 5% wartości nieruchomości
          </span>
          .<br></br>
          <br></br>
          <h2 className="text-[34px] italic my-[60px] text-center text-gray-500">
            &quot;Zyski w czasie wynajmu w sezonie, sięgające nawet 8% wartości nieruchomości&quot;
          </h2>
          <strong className="text-[26px] font-bold">
            7. Konkurencyjność na ryku wynajmu nieruchomość w Hiszpanii. I tutaj jest pewien
            problem.
          </strong>
          <br></br>
          <br></br>
          Polacy w 2023 masowo kupowali <strong>nieruchomości w Hiszpanii</strong>, niestety bardzo
          często szukając &quot;okazji&quot; i jak najtańszych ofert, niestety większość decyzji
          była nieuważnych na zasadzie byleby mieć. Efekt jest taki w miastach tj.{" "}
          <span className="text-green-600 font-bold">
            Torrevieja konkurencja na rynku wynajmu jest tak duża, że mimo spadku cen nawet w
            sezonie są problemy z wynajęciem nieruchomości.
          </span>{" "}
          Rynek tam jest już bardzo ciasny dlatego &quot;nie jest ważne ile co kosztuje, ale jak
          szybko na siebie zarobi&quot;. Na tle tego{" "}
          <span className="text-green-600 font-bold">
            warto rozważyć lokalizacje mniej &quot;ciasne&quot; choć droższe ale zdecydowanie
            bardziej sensowne z dużo większą prognozą korzyści{" "}
          </span>
          niż tanie Torrevieja, Gran Alacant itd.<br></br>
          <br></br> Ciekawym wyborem jest <strong>Torre de la Horadada</strong> lub{" "}
          <strong>San Pedro del Piantar </strong>opisaliśmy ją dość szeroko w{" "}
          <Link
            href="/blog/region-san-pedro-del-pinatar"
            className="underline font-normal text-blue-800"
          >
            tym artykule.
          </Link>
          <br></br>
          <br></br> W tym pomagamy. I do tego zapraszamy.
        </p>
      </div>
      <Link
        href="/nieruchomosci/hiszpania?page=1"
        className="text-white text-[26px] font-normal flex items-center py-[10px] rounded-2xl justify-center bg-green-500 w-[500px] shadow-xl"
      >
        Przeglądaj oferty nieruchomości
      </Link>
      <ContactFormBlogPost temat="Nieruchomości w Hiszpanii, co się zmieniło?" />
    </>
  );
}
