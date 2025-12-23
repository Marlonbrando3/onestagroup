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
  const temat = "Zarządzanie najmem w Hiszpanii. Nowe zasady i wpływ na rynek.";

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
          <p className="font-bold">
            Od 3.04.2025 r. prawo w ramach wynajmu turystycznego w Hiszpanii uległo zmianom, dając
            &quot;ostatnie&quot; i decyzyjne słowo wspólnotom danym obiektów. O tym czy obiekt
            będzie mógł być wynajmowany turystom krótkoterminowo zdecyduje większość.
          </p>
          <br></br>W niniejszym artykule omawiamy zmiany i ich potencjalne konsekwencje na rynku
          wynajmu w Hiszpanii. <br></br>
          <br></br>
          Zapraszam! <br></br>
          <br></br>
          <p className="font-semibold text-[24px]">1. Co dokładnie zostało zmienione?</p>
          <br></br>
          Do 3.04.2025 licencję tursytyczną na wynajem krótkoterminowy w Hiszpanii, mogła otrzymać
          nieruchomość, która znajdowała się obszarze gminy, która z kolei była jedyną (z małymi
          wyjątkami) jednostką decydującą o tym czy dana nieruchomość może być wynajmowana czy też
          nie. Czyli czy może otrzymać licencję turystyczną. <br></br> <br></br>
          Wyrobienie takiej licencji nie trwało długo ale okresy oczekiwania nie były zawsze takie
          same, niemniej średni czas oczekiwania wynosił ok 2 m-cy. <br></br> <br></br>Obecnie mamy
          sytuację w której uprawomocniony został kolejny podmiot mający „ostatnie słowo” w kwestii
          ustalenia czy dana nieruchomość może być wynajmowana czy też nie. Są to wspólnoty, które
          zawiązują się w danych blokach, obiekcie i poprzez głosowanie oraz uzyskanie większości
          (60% lub 3/5 głosów) zapada decyzja o zgodzie na wynajem turystyczny lub jej odmowie .{" "}
          <br></br> <br></br>
          Drugą rzeczą jest fakt, iż licencje wyrabiane są już nie na „adres” ale na nazwisko
          właściciela. Zatem przy każdej zmianie właściciela, licencja musi zostać odnowiona, co w
          praktyce oznacza przejście procesu od początku, który trwa już średnio nie 2 ale ok 6/7
          m-cy. <br></br> <br></br>Sama licencja ma obowiązywać 5 lat i później musi zostać
          odnowiona. <br></br>
          Obok tego, niektóre wspólnoty wprowadziły dodatkowe obostrzenia jakościowe i wymogi jakie
          ma spełniać nieruchomość, np. Wspólnota Walencka na Costa Blanca ma restrykcje dot.
          przestrzeni, wentylacji, widny w budynkach pow. 4 piętra oraz rejestracji w lokalnym
          rejestrze turystycznym. <br></br> <br></br>
          <p className="font-semibold text-[24px]">
            2. Co z licencjami, które zostały wydane przed 3.04.2025?
          </p>
          <br></br>
          Licencje, które zostały uzyskane przed zmianą przepisów są objęte ochroną, ich status po
          zmianie przepisów się nie zmienił i jest traktowany jako prawo nabyte, nawet w sytuacji w
          której wspólnota zadecyduje o wprowadzeniu zakazu wynajmu. Zatem właściciel takiego
          obiektu może kontynuować swoją działalność w zgodzie z prawem. <br></br> <br></br>
          <p className="font-semibold text-[24px]">
            3. Jakiego rodzaju pobytu dotyczy nowa ustawa?
          </p>
          <br></br> W Hiszpanii rozróżniane są 3 rodzaje wynajmu:{" "}
          <li>
            {" "}
            turystyczny - do 10 dni - wymaga właśnie licencji turystycznej, brak wymaganej umowy,
          </li>{" "}
          <li>krótkoterminowy - do 60 dni - wymaga umowy najmu,</li>{" "}
          <li>długoterminowy - powyżej 60 dni do 5 lat - na podstawie np. umowy najmu.</li>
          <br></br> Najem turystyczny jest tym, którego dotyczy głównie nowa ustawa, niemniej jako
          najem krótkoterminowy (w wyjątkowych okolicznościach) może również zostać uznany jako
          turystyczny jeśli nie jest on wynikiem innych celów tj. pracownicy sezonowi, studenci,
          podróże służbowe itd. <br></br> <br></br>
          <p className="font-semibold text-[24px]">4. Kary za łamanie prawa. </p>
          <br></br> Jeśli osoba wynajmująca swoją nieruchomość zostanie złapana na gorącym uczynku,
          najpewniej otrzyma ostrzeżenie i wezwanie do natychmiastowego zaprzestania działalności na
          którą nie formalnej zgody. Brak oficjalnego stanowiska wspólnoty - czyli brak uchwały
          dopuszczającej lub zakazującej wynajmu - nie jest wytłumaczeniem ani formą cichej zgody,
          która powinna być formalnie uzyskana. <br></br>W przypadku powtarzających się złamań tych
          zasad, na właściciela bezprawnie wynajmowanej nieruchomości może zostać nałożona kara od
          30 - 600 tys. euro. <br></br>
          <br></br>
          <p className="font-semibold text-[24px]">
            5. Uzyskanie zgody w kilku krokach.
          </p> <br></br> Aby uzyskać zgodę konieczne jest:{" "}
          <li>
            Uzyskanie 3/5 głosów właścicieli (liczonych według udziałów) na zebraniu wspólnoty i
            uprawomocnienie w postaci uchwały,
          </li>{" "}
          <li>
            W razie braku uzyskania wymaganej większości, może zostać zwołane kolejne zebranie i
            wtedy wystarczy jedynie zwykła większość głosów,
          </li>
          <li>
            {" "}
            Po zatwierdzeniu decyzji obowiązuje 20-dniowy okres na zgłoszenie sprzeciwu. Brak
            odpowiedzi w tym czasie jest traktowany jako zgoda,
          </li>{" "}
          <li>
            Konieczne jest zarejestrowanie nieruchomości w krajowym rejestrze wynajmu
            krótkoterminowego jednoznaczne z uzyskaniem numeru rejestracyjnego (od 01.07.2025 r.)
          </li>
          <br></br>
          Ważne jest to, że owa uchwała i zgoda na wynajem nie jest nieodwołalna, w chwili kiedy po
          jakimś czasie np. zmienią się właściciele mieszkań, mogą oni zmienić swoją decyzje przez
          głosowanie i zabronić najmu krótkoterminowego. Ponadto, dopuszczona jest sytuacja w której
          prezes wspólnoty może zażądać natychmiastowego zaprzestania wynajmu. <br></br> <br></br>
          <p className="font-semibold text-[24px]">
            6. Analiza wpływu zmian na rynek.
          </p> <br></br> <p className="font-semibold text-[22px]">6.1. Geneza zmiany przepisów.</p>{" "}
          <br></br> Przepis został wprowadzony, ponieważ mimo obiektywnie niskiego udziału mieszkań
          na wynajem, ma on tendencję niezwykle rosnącą wraz z popytem na takie usługi. Doprowadziło
          to do sytuacji w których zwykłe osiedla mieszkalne zaczęły być w sezonie miejscem dla
          często hałaśliwych turystów, uprzykrzając tym samym życie pozostałym członkom wspólnoty
          dla której to miejsce jest domem. <br></br> <br></br>Problem jest na tyle duży, że wymusił
          zmiany regulacyjne co jednocześnie uruchomiło machinę zakazów w miejscach, które nigdy dla
          celów najmu krótkoterminowego nie zostały stworzone. <br></br> <br></br>
          <p className="font-semibold text-[22px]">
            6.2. Statystyki zakupu mieszkań na wynajem na tle wszystkich transakcji nieruchomości.
          </p>{" "}
          <br></br> Nieruchomości kupowane na wynajem na tle całości zakupionych nieruchomości
          stanowią wartość marginalną. <br></br>W raporcie{" "}
          <b>
            EsadeEcPol (&quot;The Rental Market in Spain: Holiday Rentals, Seasonal Rentals, and
            Long-Term Rentals under Regulation&quot;
          </b>
          , listopad 2024), możemy znaleźć informację, że w 2023 roku jedynie 2-3% mieszkań były
          wykorzystywane do najmu krótkoterminowego. Okazuje się - na podstawie{" "}
          <b>
            CaixaBank Research (&quot;Real Estate. The expansive cycle takes hold | S1 2025&quot;,
            marzec 2025 )
          </b>
          , że zakupy nieruchomości przez obcokrajowców w 2024 stanowiły 14,85% wszystkich (ok. 716
          tys.) transakcji, gdzie ok 20-30% były realizowane z intencją zakupu inwestycyjnego.{" "}
          <br></br> Mamy zatem ponownie ok. 3-4% zakupów inwestycyjnych na tle wszystkich
          transakcji. Te dane podkreślają również jak wciąż ogromne ilości transakcji realizowane są
          przez Hiszpanów. Raporty mówią również o brakujących 3.5 mln mieszkań w Hiszpanii co
          tłumaczyłoby tak duży ruch jednak w ramach obywateli Hiszpanii. <br></br> <br></br>
          <p className="font-semibold text-[22px]">
            6.3. Prognozowany wpływ na ceny nieruchomości w Hiszpanii.
          </p>{" "}
          <br></br>Jak ustaliliśmy wyżej, udział rynku nieruchomości na wynajem w Hiszpanii jest
          marginalny na tle całości rynku, niemniej aspekty takie jak niepewność oraz jeszcze nie do
          końca jasne konsekwencje spowodują zastój ale nie spadek cen. <br></br> <br></br>
          CaixaBank Research prognozuje wzrost cen nieruchomości niemniej już nie 6-7% ale o ok 4% w
          2025 r. uzasadniany głównie brakiem wspomnianych 3.5 mln mieszkań dla obywateli lub
          obcokrajowców, których głównym celem jest zakup prywatny. <br></br>Przodują tutaj
          obywatele Wielkiej Brytanii, Niemiec, Belgii, Norwegii.<br></br> Zatem będzie drożej ale
          nieznacznie, generalnie rynek Hiszpański jest bardzo silny i odporny na zmiany
          ekonomiczne. <br></br> <br></br>{" "}
          <p className="font-semibold text-[22px]">
            6.4. Prognozowany wpływ na ceny wynajmu na dłuższy termin.
          </p>{" "}
          <br></br>Z uwagi na to, że zmniejszy się (przez wspólnoty blokujące najem) podaż
          nieruchomości na najem turystyczny. Możemy spodziewać się potencjalnego wzrostu pobytów na
          okresy dłuższe niż 10 dni oraz zmiany rozumienia Hiszpanii jako cel tylko wakacyjny.{" "}
          <br></br> <br></br>Do tej pory najem poza sezonem (tj. październik - kwiecień) stanowił
          miły dodatek do zysku w samym sezonie kiedy mógł on być nawet 5-krotnie wyższy. Z powodu
          ograniczeń, naturalnym krokiem może się okazać przekierowanie zdecydowanie większej uwagi
          na ten (poza-sezonowy) rodzaj wynajmu. <br></br>Zatem tutaj prognozujemy wzrost podaży
          ofert, ale również &quot;zredefiniowanie&quot; Hiszpanii jako dobry kierunek aby np. uciec
          od zimy, częściej niż to bywało dotychczas. Nie zapowiada się na zwiększenie cen wynajmu
          poza sezonem, ze względu na wciąż dużą podaż niemniej zwiększenie popytu jest dość
          prawdopodobne. <br></br> <br></br>
          <p className="font-semibold text-[22px]">
            6.5. Prognozowany wpływ na ceny wynajmu turystycznego.
          </p>{" "}
          <br></br>
          Założyliśmy już, że przepis &quot;zabierze&quot; z rynku wyraźną liczbę ofert na wynajem
          krótkoterminowy. Najbardziej wyraźną zmianą jest sytuacja w Barcelonie gdzie wycofanych ma
          zostać ok. 10 000 licencji. Na innych wybrzeżach również da się zauważyć zmniejszenie
          ofert na wynajem co wpłynie na zmniejszenie podaży przy stale, od wielu lat rosnącym
          popycie. <br></br>W efekcie nieruchomości, które pozostaną z licencją mogą stać się
          droższe lub lepiej obłożone. Dlatego kupując opcję, która z całą pewnością jest
          przeznaczona pod ruch turystyczny i inwestorów, czyli posiadających np. solaria na
          dachach, baseny, parkingi, wspólne tereny zielone, zamknięte osiedle - zmniejszą ryzyko
          utracenia licencji (nie można go w 100% uniknąć), a jeszcze mogą stać się bardziej
          lukratywną inwestycją niż dotychczas. <br></br>
          <br></br>{" "}
          <p className="font-semibold text-[22px]">7. Jak wybrać bezpieczne opcje pod wynajem.</p>{" "}
          <br></br>Jest to kluczowy aspekt.<br></br> Obserwując rynek nieruchomości w Hiszpanii -
          zarówno pierwotny jak i wtórny - można głowym okiem dostrzec który obiekt powstał pod
          turystę, a który nie i przy tym nie trudno wypracować pewien klucz do zrozumienia
          konsewkencji danego wyboru. <br></br> <br></br>
          <b>Rynek wtórny, który powstał ok. 7 i więcej lat wstecz.</b>
          <br></br> Na pierwszy rzut oka daje się rozpoznać jako ten typowy „blok mieszkalny”.
          Czasem mamy widok na morze lub bliskość spacerową do plaży ale{" "}
          <b>brakuje często całej reszty tj. parkingu, basenu, windy.</b> Takie nieruchomości
          powstały - umownie - na &quot;trzy-czwarte&quot;, głównie z zamysłem zakupu i
          zamieszkania, dopiero z czasem zaczęły stawać się tą &quot;czwartą inwestycyjną
          częścią&quot;. <br></br>Mamy tutaj ceny oscylujące w zakresie 150 000 - 200 000 euro i
          sporo mieszkańców dla których te miejsca są domem i kilka opcji na wynajem. Takie obiekty
          bardzo szybko zmieniają właścicieli, jeden odkupi na wynajem ale 3-ech odkupi dla siebie.{" "}
          <br></br>Im częściej mieszkania &quot;rotują&quot;, tym większe ryzyko, że któryś z Nich
          zagłosuje &quot;przeciw&quot; uchwale o wynajem turystyczny, co zablokuje opcję wynajmu
          turystycznego na dłuższy czas. <br></br>
          <br></br>
          <b>Świeży rynek wtórny, który powstał do 3 lat wstecz.</b> <br></br>Budżety oscylujące w
          zakresie 200 000 - 300 000 euro. Tutaj już wyraźnie widać, że owe obiekty powstawały
          głównie z myślą o osobach kupujących pod wynajem, nie ma co prawda sytuacji
          &quot;trzy-czwarte&quot;, jesteśmy bliżej &quot;pół-na-pół&quot; z lekką tendencją jednak
          na wynajem. Raczej każdy rozumiał, że taki zakup wiąże się z turystami na obiekcie i z
          taką świadomością go kupił. Tutaj jesteśmy bezpieczniejsi. Natomiast te obiekty również
          potrafią przechodzić z &quot;rąk do rąk&quot; stosunkowo często. <br></br>
          <br></br>
          <b>Rynek pierwotny, kierowany do turysty. Budżety powyżej 260 000 euro.</b>
          <br></br> Obecnie obserwując trendy w projektach deweloperskich czasem ciężko się doszukać
          takich które pod turystę przeznaczone nie są. Deweloperzy również z góry czasem filtrują
          klientów aby wybrać tych, którzy chcą wynajmować i nie blokować kupujących, którzy z kolei
          kilka razy przez zakupem upewnią się, że dana opcja umożliwi wynajem. Takie nieruchomości
          również cieszą się najwyższą kwotą uzyskiwaną za wynajem.
          <br></br>
          <br></br>
          <b>Przykład:</b> <br></br>{" "}
          <li>
            Rynek wtórny (10 lat) - cena 190 000 euro zwrot z inwestycja na poziomie 3%, wysokie
            ryzyko utraty licencji.{" "}
          </li>
          <li>
            Rynek pierwotny - cena 280 000 euro, zwrot z inwestycji 7%, niskie ryzyko utraty
            licencji.
          </li>{" "}
          <br></br>
          Pytania, które warto sobie zadać. <br></br>Czy różnica w cenie na poziomie np. 70 000
          euro: <li>rekompensuje wysokie ryzyko utraty licencji?</li>
          <li>rekompensuje mniejszy zysk z najmu o 50% już na zawsze?</li>
          <li>
            rekompensuje braki udogodnień na obiektach tj. basen, parking, tereny zielone, solaria
            na dachu.
          </li>{" "}
          <br></br>
          Zapraszamy do przemyśleń i do kontaktu z nami w razie kolejnych pytań lub chęci wsparcia w
          prociesie zakupu.
        </p>
      </div>
      <ContactFormBlogPost temat="Zarządzanie najmem w Hiszpanii. Nowe zasady i wpływ na rynek." />
      <Footer />
    </>
  );
}
