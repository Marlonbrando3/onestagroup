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
  const temat = "Nieruchomości w Hiszpanii";
  const clam = "jak wygląda proces zakupu";

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
        <title>Nieruchomości w Hiszpanii - jak kupować?</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="Description"
          content="Nieruchomości Hiszpania. Pośrednictwo w sprzedaży nieruchomości w Hiszpanii. Z artykuły dowiesz się jak zmienił się rynek nieruchomości w Hiszpanii."
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
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1000px] lg:mx-auto md:px-[50px] w-[80vw] mx-auto lg:text-[19px] lg:leading-8 tracking-normal">
        <br></br>
        <br></br>
        <br></br>
        <strong className="text-[24px] font-semibold">Wprowadzenie</strong>
        <br></br>
        <br></br>
        <p>
          Zakładamy, że jako osoba poszukująca <b>nieruchomości w Hiszpanii na sprzedaż</b> zadajesz
          sobie większość z poniższych pytań.
        </p>
        <br></br>
        <ul className="list-disc">
          <li className="list-element-blog">
            Czy powinienem wybierać <b>nieruchomości w Hiszpanii </b> z rynku wtórnego czy raczej
            poszukać ofert z rynku pierwotnego cieszącego się <b>dużym zainteresowaniem </b>niemniej
            droższego?
          </li>
          <li className="list-element-blog">
            W jakim stanie są apartamenty lub domy z rynku wtórnego?
          </li>
          <li className="list-element-blog">
            Czy jest tam jakaś rzetelna<strong> polska agencja nieruchomości </strong>z
            <strong>doświadczeniem</strong>, dla której sprzedaż, oferowane opcje jest rozumiana
            jako pomoc , która odbierze mnie z lotniska i przedstawi oferty, a finalnie pomoże mi w
            zakupie nieruchomości w Hiszpanii. Jak mogę znaleźć takie biura?
          </li>
          <li className="list-element-blog">
            Czy dobrym pomysłem są nieruchomości w z przejęć bankowych?
          </li>
          <li className="list-element-blog">
            Czy powinienem/powinnam szukać czegoś w kategorii &ldquo;apartamenty&ldquo; czy
            &ldquo;domy&ldquo;, a może celujesz w willę?
          </li>
          <li className="list-element-blog">
            Jakie są wymagania formalne lub jakie przygotować dokumenty aby zapewnić sobie
            bezpieczeństwo kupując apartament lub dom?
          </li>
          <li className="list-element-blog">
            Czy zakup ma być formą inwestowania i interesuje mnie wynajem mieszkania czy będzie on
            raczej prywatny? A może połączę oba te rozwiązania?
          </li>
          <li className="list-element-blog">
            Myślę, że powyższe zagadnienia już w jakiejś mierze pokazują, że rozumiemy nad czym
            klienci rozważają szukając agencji lub wybierając pomiędzy{" "}
            <strong>apartamentami.</strong>{" "}
          </li>
        </ul>
        <div className="w-full h-auto bg-orange-100 my-[30px] flex p-5 items-center justify-between rounded-xl italic">
          <div className="h-[50px] w-[3px] bg-red-900"></div>
          <p className="w-[98%]">
            Zdajemy sobie sprawę, jak brzmią pierwsze pytania osób, które zaczynają przygodę w
            poszukiwaniu swojej nieruchomości w Hiszpanii. Staramy się odpowiedzieć praktycznie.
          </p>
        </div>
        <strong className="font-bold">
          Są tylko 2 drogi <br></br>
          <br></br>
        </strong>
        Albo zrealizujesz <strong>zakup nieruchomości na terenie w Hiszpanii</strong> samodzielnie
        albo skorzystasz z usług agencji takich jak Onesta która oferuje kompleksową pomoc klientom
        w zakupie.{" "}
        <b className="font-bold">
          Kompleksową znaczy, że każdy aspekt, począwszy od prezentacji nieruchomości poprzez
          weryfikację dokumentów, formalności prawne i urzędowe, akt notarialny, a nawet umeblowanie
          i wynajem.
        </b>{" "}
        Zatem podejrzewam, że finalnie i tak zajmie się tym jakaś agencja (tak się dzieje w 90%
        przypadków) i bardzo dobrze, natomiast rozumiemy doskonale potrzebę zdobycia podstawowej
        wiedzy przed taką współpracą do której serdecznie <strong>zapraszamy</strong>. Według nas
        sprzedaż = pomoc.
        <br></br> <br></br>
        <p>
          Bez względu na to czy myślisz o zakupie nieruchomości (apartamentu lub domu) na rynku
          pierwotnym (nowe nieruchomości) czy na rynku wtórnym, pytania które sobie zadajesz są
          bardzo zasadne, a odpowiedzi dotyczą na ogół obu rynków.
        </p>
        <p>Postaramy się odpowiedzieć na nie w poniżym artykule.</p>
        <br></br>
        <strong className="font-bold">
          Rynek nieruchomości w Hiszpanii - dziś <br></br>
          <br></br>
        </strong>
        <p>
          Przede wszystkim rynek <strong>nieruchomości w Hiszpanii</strong> jest już przesycony,
          trzeba to przyznać wprost. W konsekwencji mamy aż kilkadziesiąt % agentów czy biur
          nieruchomości, które nie spełniają podstawowych potrzeb oglądających, traktują to jako
          czystą sprzedaż i czasami wręcz wciskają na siłę oferty, które mają aby czasami klient nie
          uciekł.
        </p>
        <p>
          Prędzej czy później tak się dzieje z każdym rynkiem (jak z fotowoltaiką w Polsce) i trzeba
          stać się bardzo uważnym dlatego prócz zapoznania się z tym artykułem zachęcamy Cię do
          pogłębiania wiedzy na innych stronach czy blogach omawiajacych sprzedaż lub zakup domu lub
          apartamentów w Hiszpanii.
        </p>
        <br></br>
        <p>
          Zdecydowana większość osób chcąc kupić swoją (zazwyczaj pierwszą)
          <strong>nieruchomość w Hiszpanii</strong> chce zrozumieć jak zrobić to bezpiecznie i jakie
          mogą po drodze czekać zagrożenia, czego wymaga taki proces itd. I od tych aspektów
          zaczniemy, w drugiej części tego artykułu skupimy się na zrozumieniu jakie powinny być
          apartamenty lub domy aby spełniały pewne kryteria.
        </p>
        <br></br>
        <img
          className="w-[400px] h-auto mx-auto my-[40px]"
          src="https://images.surferseo.art/b9f22884-5c46-4ac0-b4e7-43ab5b2ad7e7.jpeg"
          alt="Przykładowa inwestycja z rynku pierwotnego"
        />
        <p>
          Z zakupem nieruchomości w Hiszpanii pod kątem bezpieczeństwa jest (na szczęście) jak z
          każdym innym zakupem. Nie ma tutaj jakiegoś wyjątkowo złożonego czy unikatowego prawa (jak
          np. na Cyprze Północnym), które by powodowało, że ten zakup jest ryzykowny, a decydując
          się taką
          <strong>inwestycję</strong> kroki zakupowe są praktycznie identyczne jak w Polsce.
          <strong>Hiszpania</strong> nie odstaje tutaj z poziomiem obsługi prawnej. <br></br>Zatem
          kolejno.
          <br></br> <br></br>
        </p>
        <br></br>
        <ol>
          <li>
            <p>
              <span className="font-bold">1. Zawarcie umowy rezerwacyjnej </span> - równoznaczne z
              wpłatą rezerwacyjną często oscylującą między 3000, a 10 000 euro netto. Fakt
              zawierania tych <strong>umów</strong> powoduje, że mieszkanie jest &ldquo;ściągane z
              rynku&ldquo; i już nie może być prezentowane ani zostać sprzedane innej osobie.
            </p>
          </li>
          <li>
            <p>
              W przypadku transakcji zakupu nieruchomości z rynku wtórnego weryfikacja dokumentów po
              stronie obecnego właściciela (jak wygląda własność, kogo trzeba ściągnąć na akt,
              weryfikacja księgi wieczystej) oraz ich poprawności. Na rynku pierwotnym nie ma tego
              kroku ponieważ nieruchomość jest od razu sprzedawana bezpośrednio od właściciela
              (dewelopera). Zatem dla agencji sprzedaż domu lub apartamentu to nie tylko podpisanie
              umowy ale szereg innych spraw.
            </p>
          </li>
          <li>
            <br></br>
            <p>
              <strong className="font-bold">2. Rynek pierwotny</strong> - płatność 1 (pierwszej)
              transzy za nieruchomość w ciągu ok 4-6 tygodni (ok. 20% - 30% wartości), 2 (druga)
              transza płatna jest ok 3 m-ce później i również wynosi ok 20-30%. Ostatnie ok 50%
              płatne jest przy akcie notarialnym, który następuje obecnie po ok 12-14 m-cach
              rezerwacji. Tutaj jest o tyle wygodniej, że jest czas aby do wymarzonej nieruchomości
              &quot;dozbierać&quot; pozostałą kwotę i jest na to nawet 14 mc-y.
            </p>
            <br></br>
            <p>
              Na <strong className="font-semibold">rynku wtórnym</strong> te kroki nie obowiązują,
              po opłacie rezerwacyjnej następuje zapłata za nieruchomość. Jednak
              konieczność&nbsp;weryfikacji dokumentów (pkt. 2) powoduje, że trwa to średnio 4-6
              tygodni i również kończy aktem notarialnym i można uznać, że płatność jest odroczona.
              Poza tym w przypadku klientów którzy chcą starać się&nbsp;o uzyskanie kredytu - jest
              na to wystarczająco dużo czasu. Sam kredyt jest raczej też formalności ale o tym
              opowiem nieco niżej. Co ważne - opłata rezerwacyjna jest
              <strong>w przypadku rynku wtórnego bezzwrotna</strong>, chyba, że okaże się, że
              przepisanie własności mieszkania formalnie nie jest możliwe (np. dokumenty własności
              nie są poprawne), wtedy następuje zwrot lub &ldquo;przeksięgowanie&ldquo; tej
              płatności na inną nieruchomości jeśli taka zostanie wybrana. Jeśli kupujący po prostu
              się rozmyśli opłaca rezerwacyjna przepada.
              <br></br>
              <br></br>
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">
                3. Nieruchomość może zostać umeblowana i przekazana firmie pod wynajem
              </span>{" "}
              w celu zarabiania na niej. Modele są bardzo różne ale zazwyczaj nie ograniczają
              właściciela w pobycie we własnym lokalu natomaist należy zwrócić uwagę na fakt, że
              firmy nie są chętne do obsługi nieruchomości poza sezonem bo zarobek jest znikomy.
              Wynagrodzenie jest również bardzo różne ale oscyluje od 20-35% brutto od faktycznego
              zysku lub jest to stała opłata np. 10% wartości nieruchomości w każdym miesiącu bez
              względu na obłożenie.
            </p>
            <p></p>
          </li>
        </ol>
        <h2>
          Rynek nieruchomości w Hiszpanii nieznacznie różni się od Polskiego, klientom nie jest
          trudno się na nim odnaleźć.
        </h2>
        <br></br> <br></br>
        <p>
          <strong className="text-[20px] font-semibold">
            Ile zapłacę agencji za proces zakupu na rynku nieruchomości w Hiszpanii ?
          </strong>
        </p>
        <br></br> <br></br>
        <p>
          Informacje są bardzo dobre. Prócz pewnych wyjątków, kupno nieruchomości w Hiszpanii
          <strong> nie wiąże się&nbsp;z zapłatą prowizji ze strony kupującej. </strong>Agencje i
          biura nieruchomości w Hiszpanii rozliczają się z właścicielem lub deweloper. To co jest
          istotne to koszty około-zakupowe, które należy doliczyć do kwoty netto zakupu.
        </p>
        <br></br> <br></br>
        <p>
          <strong className="text-[20px] font-semibold">
            Koszty dodatkowe przy zakupie na rynku nieruchomości w Hiszpanii.
          </strong>
        </p>
        <br></br> <br></br>
        <p>
          Głównym kosztem jest podatek od zakupu nieruchomości w Hiszpanii i jest to 10% wartości
          nieruchomości. Każde transze płacone do dewelopera o których piszę wyżej również muszą być
          powiększone o podatek owy podatek.
        </p>
        <p>
          Potrzebny jest również numer N.I.E, konto w banku oraz tłumacz przysięgły aby transakcja
          była jasna i bezpieczna dla kupującego.
        </p>
        <p>
          Sposób wyrobienia numeru N.I.E opisujemy dla chętnych w innym artykule, niemniej w blisko
          100% jest On realizowany przy okazji zakupu poprzez agencję nieruchomości prowadzącą
          sprzedaż. Podobnie jest z kontem w banku, agencje tworzą je w obecności klientów
          bezpośrednio w banku.
        </p>
        <br></br>
        <p>
          Na ogół te koszty stanowią wartość ok 2-3% wartości nieruchomości. Dodatkowo (bo nie ma
          takiej potrzeby) można skorzystać z pomocy prawnika niemniej koszty obsługi prawnej w
          Hiszpanii są bardzo wysokie i sięgają do ok 3000 euro.
        </p>
        <br></br> <br></br>
        <p>
          <strong className="text-[20px] font-semibold">
            Ile razy muszę zjawić się w Hiszpanii aby sfinalizować zakup?
          </strong>
        </p>
        <br></br>
        <p>Na ogół wystarczają 2 razy.</p>
        <p>
          Pierwsza wizyta w <strong>Hiszpanii</strong> pozwala na prezentację i obejrzenie
          apartamentów, obejrzenie wybranego domu i przy okazji na bieżąco oglądanie ofert, które
          zmieniają się bardzo dynamicznie. Ile ofert trzeba obejrzeć? Nie ma tutaj zasady, dynamika
          sprzedaży nieruchomości w Hiszpanii jest tak wysoka, że oferta może się
          &ldquo;deaktualizować&ldquo; w przeciągu nawet kilku godzin. Niektórzy oglądają 2
          inwestycje a inni potrzebują 30 i dopiero znajdują swoją rezydencje marzeń. Natomiast
          podpierając się doświadczeniem widzimy, że 7/10 klientów potrzebuje jednej wizyty. Dobrze
          jest jednak przyjąć, że może być potrzebna jeszcze jedna (aby się nie zniechęcać) wizyta
          zanim na rynku pojawi się oferta, która sprosta wymaganiom. <br></br>
          <br></br>Pierwsza wizyta w Hiszpanii jest idealna do ustalenia jakie rodzaje rodzaje
          nieruchomości nam odpowiadają ale już nie z obrazka tylko w rzeczywistości, a to czasami
          potrafią być całkiem inne nieruchomości.
        </p>
        <br></br>
        <p>
          - Czy wolimy region Costa Blanca czy może Costa Calida, a może jeszcze jakiś inny jako
          miejsce dla swojego drugiego <strong>domu</strong>?
        </p>
        <p>
          - Czy warto interesuje mnie Punta Prima, Torre de la Horadada czy może Orihuela Costa?
        </p>
        <p>
          - Co cechuje <strong>apartament lub dom</strong> spełniający moje marzenia lub taką,
          której szukam?
        </p>
        <p>
          - Jak dystans do <strong>plaży</strong> ma mieć mój apartament lub dom?
        </p>
        <p>
          - Z jakiego rodzaju <strong>apartamentów</strong> powinienem wybierać?
        </p>
        <p>- Czy warto dopłacić za widok na morze i poprosić o takie oferty?</p>
        <p>- A może widok jest czymś niezbędnym?</p>
        <p>
          - Czy wolę domy lub apartamenty z orientacją na <strong>południe</strong> czy na zachód?
        </p>
        <p>
          - Czy chce bywać tam na wakacje czy poza sezonem, a wakacje już niech zarabia poprzez
          wynajem?
        </p>
        <p>
          - Kiedy będziesz już na miejscu bardzo istotny jest budżet, częstym wtedy pytaniem jest -
          jaka jest cena marzeń? Czy chcę zwiększyć swój budżet i ta <strong>cena</strong> pozwala
          na przekonanie, że kupuję to co czego szukam?
        </p>
        <br></br>
        <p>
          Jak widzisz jest sporo czynników, które są istotne ale bez obaw, odpowiedzi na te pytania
          prawie intuicyjnie pojawiają się jak jesteś już na miejscu, staje się to wtedy dość
          proste.
        </p>
        <h2>
          W ofercie Onesta Group znajdziesz nieruchomości z wybrzeży Costa Blanca, Costa del Sol
          oraz Costa Calida. Hiszpania oferuje coś wyjątkowego na każdym z tych wybrzeży.
        </h2>
        <img
          className="w-[400px] h-auto mx-auto my-[40px]"
          src="https://images.surferseo.art/14860020-2f02-40f3-8d7c-ec43283f8d91.jpeg"
          alt="Uliczka w San Pedro del Pinatar"
        />
        <p>
          <span className="font-semibold">Druga wizyta w Hiszpanii</span> (zakładając, że
          nieruchomość została zarezerwowana podczas pierwszej) to na ogół już sprzedaż i
          formalności o których wspomniałem wyżej. Wyrobienie numeru N.I.E
        </p>
        <br></br>
        <p>
          <strong className="text-[20px] font-semibold">Jaki region wybrać?</strong>
        </p>
        <br></br>
        <p>
          <strong>Hiszpania</strong> oferuje nam kilka wybrzeży, które są atrakcyjne dla
          <strong>polaków</strong> i bardzo często rodzi się pytanie - czy wybrać Costa Blanca, -
          Costa Calida, Costa del Sol a może jakaś inna &ldquo;Costa&ldquo;? <br></br>
          <br></br>Jeśli jesteś klientem, który zadaje sobie takie pytania oto kilka z różnic
          pomiędzy tymi wybrzeżami:
        </p>
        <br></br>
        <ul>
          <li>
            <p>
              - <span className="font-semibold">Costa Blanca </span>pozwala na wysokie zwroty z
              inwestycji (z pominięciem kilku miast np. Torrevieja, Gran Alacant, La Mata) głównie w
              Punta Prima, Orihuela Costa, Torre de la Horadada, San Pedro del Pinatar, Santiago de
              la Ribera, Mil Palmeras i kilka innych. Costa Blanca nie jest droga na tle Costa del
              Sol (ceny wyższe ok 20-30%), jest najcieplejszym regionem w Hiszpanii ze względu na
              niską wilgotność powietrza i doskonale skomunikowanym z Polską (3:20 h samolotem).
              Stosunkowo łatwo znaleźć tutaj <strong>apartament lub dom</strong> blisko
              <strong>plaży</strong> gdzie cena również też jest dobra.
            </p>
          </li>
          <br></br>
          <li>
            <p>
              - <span className="font-semibold">Costa del Sol</span> - region drogi wręcz
              prestiżowy, ceny są tutaj dość wysokie (Marbella to miasto Szejków) niemniej
              deweloperzy mocno inwestują w okoliczne miasta, które rozwijają się i mają też nieco
              niższe ceny. Trudno prognozować zwroty z inwestycji każdorazowo będzie to zależeć od
              atrakcji w okolicy. Odległości od <strong>plaży</strong> również są niewielkie (1-2
              km) natomiast ceny ok 20-30% wyższe niż podobne oferty z innych regionów.
            </p>
          </li>
          <br></br>
          <li>
            <p>
              - <span className="font-semibold">Costa Calida</span> - przylegające do Costa Blanca
              od strony południej, dość małe wybrzeże ale atrakcyjne dla osób, które cenią sobie
              zwrot z wynajmu oraz spokojne lecz dobrze zurbanizowane miasta o niskiej zabudowie.
            </p>
          </li>
        </ul>
        <h2>
          Korzystając z usług Onesta Group (polska agencja nieruchomości), możesz obejrzeć
          apartamenty i domy na każdym z tych wybrzeży.
        </h2>
        <br></br>
        <p>
          <strong className="text-[20px] font-semibold">Rynek pierwotny czy wtórny?</strong>
        </p>
        <br></br>
        <p>
          Temat rzeka. <br></br>Jeśli szukasz nieruchomości pod wynajem, zarobkowo - to rynek
          pierwotny lub świeży wtórny (1 rok od oddania). Jeśli szukasz nieruchomości i nie chcesz
          czekać 14 m-cy na oddanie jej do użytku, jesteś w stanie zejść z jakości obiektu i raczej
          jesteś gotowy na remont odświeżenie i raczej regularne wymiany sprzętu, niższą jakoś,
          niższe zarobki z wynajmu - rynek wtórny może okazać się trafiony. My osobiście nie
          rekomendujemy rynku wtórnego ale pomagamy w realizacji procesów zakupowych.
        </p>
        <br></br>
        <p>Znajdźmy razem Twój nowy dom w Hiszpanii.</p>
        <p>
          <br />
          <br />
        </p>
      </div>

      <ContactFormBlogPost temat="Jak kupić nieruchomość w Hiszpanii - podstawy" />
      <Footer />
    </>
  );
}
