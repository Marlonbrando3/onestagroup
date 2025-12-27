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
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function BlogPost() {
  const temat = "Nieruchomości w Hiszpanii";
  const clam = "jak wygląda proces zakupu";

  return (
    <>
      <Newsletter />
      <AnalitycsTools />
      <Head>
        <title>
          Nieruchomości w Hiszpanii, wszystko co warto wiedzieć na początek
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
          name="Description"
          content="Jeśli stawiasz piersze kroki w drodze do zakupu nieruchomości w Hiszpanii lub chcesz się zorientować w tym temacie, znajdziesz wiele odpowiedzi."
        ></meta>
        <meta
          name="Keywords"
          content="Nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, apartamenty Hiszpania, polska agencja nieruchomości w Hiszpanii"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1000px] lg:mx-auto md:px-[50px] w-[90vw] mx-auto lg:text-[19px] lg:leading-8 tracking-normal">
        <div>
          <p>
            Artykuł ma na celu odpowiedzieć na praktycznie wszystkie pytania,
            jakie zadaje sobie osoba szukająca w Google &ldquo;nieruchomości
            Hiszpania&ldquo; i naszym zdaniem odpowiada na szereg podstawowych
            kwestii związanych z pierwszym krokiem w kierunku zakupu
            nieruchomości w Hiszpanii.
          </p>
        </div>
        <div>
          <br></br>
          <p>
            Zobacz czy poniższe zagadnienia dotyczą Ciebie, omówimy je w tym
            artykule. Prześledź je po kolei, a zyskasz wiedzę, którą staraliśmy
            się ułożyć w logiczy sposób aby była zrozumiała.
          </p>
          <div
            id="menu"
            className="rounded-xl p-3 flex flex-col bg-orange-100 text-[16px] leading-6 my-[20px] lg:w-[70%]"
          >
            <h2>1. Hiszpania i jej atuty - dlaczego warto tam inwestować?</h2>
            <h2>
              2. Nieruchomomości w Hiszpanii - dlaczego są tak atrakcyjne?
            </h2>
            <h2>3. Jakie są ceny zakupu nieruchomości w Hiszpanii?</h2>
            <h2>4. Rynek nieruchomości w Hiszpanii na tle Polskiego.</h2>
            <h2>
              5. Polskie biura nieruchomości w Hiszpanii - jak wygląda
              współpraca
            </h2>
            <h2>
              6. Czy Polacy i jakie inne narodowości kupują nieruchomości w
              Hiszpanii?
            </h2>
            <h2>7. Jakie są cele zakupu nieruchomości w Hiszpanii?</h2>
            <h2>
              8. Jakie są koszty dodatkowe przy zakupie nieruchomości w
              Hiszpanii?
            </h2>
            <h2>9. Najciekawsze regiony pod zakup nieruchomości w Hiszpanii</h2>
            <h2>10. Hiszpania nieruchomości - Rynek pierwotny vs wtórny</h2>
            <h2>
              11. Zakup inwestycyjny nieruchomości w Hiszpanii - warunki i
              założenia
            </h2>
          </div>
        </div>
        <h2 className="font-bold my-[20px]">
          Ad. 1. Dlaczego Hiszpania jest tak popularna? Główne atuty
        </h2>
        <p>
          Hiszpania jest regionem śwaita, który na tle otaczających Ją jest
          zwyczajnie jednym z najbardziej atrakcyjnych zarówno cenowo jak i pod
          kątem warunków atmosferycznych oraz klimatu. Jest tutaj stabilnie,
          słonecznie ( ok 320 dni w roku jest słonecznych) i bardzo
          przewidywalne. <br></br>
          <br></br>Hiszpania to najbardziej wysunięty na południe ląd w
          Europie,a zróżnicowany mimo wszystko klimat powoduje, że właściciwie
          każdy znajduje tutaj region dla siebie. <br></br>
          <br></br>Costa Blanca - świetna pod inwestycje i bardzo ciepła. Costa
          del Sol - nieco bardziej wilgotna lecz i bardzo zielona, dalej jeden z
          głównych kierunków wakacyjnych. Podobnie jak Costa Brava jednak ta już
          nieco mniej atrakcyjna dla turystów chcących skosztować tej ciepłej i
          wyjątkowej Hiszpanii. <br></br>Wędrując po mapie - obok mamy
          Portugalię, gdzie ceny potrafią być zdecydwanie wyższe, a nad
          Hiszpanią pogoda już nie jest tak stabilna. Zatem mamy kraj, mający
          kilka wybrzeży, które gwarantują nam bardzo dobrą inwestycję, bardzo
          dobrą pogodę, a dodatkowo jak twierdzą niektórzy - jako najbardziej
          wysnięty ląd w Europie - niskie ryzyko konfliktu zbrojnego.
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 2. Region regionem ale dlaczego nieruchomości w Hiszpanii są tak
          atrakcyjne?
        </h2>
        <p>
          Hiszpanie od jakiegoś niedługiego czasu bardzo mocno zaczeli budować z
          myślą o indywidualnym kupującym pod turystykę. Kompleksy wysokich
          apartamentowców ochodzą powoli do lamusa. Społeczeństwo jest coraz
          bogatsze, popyt jest ogromny i mimo różnych zamieszek czy na świecie
          czy nawet pandemii, rynek w Hiszpanii wciąż ma stabiolne przyrosty PBK
          rok w rok co pokazują raporty ekonomiczne. Zatem Hiszpania wydaje
          się być bardzo odporna na wszelkie zagrożenia. Obywatele tych
          bogatszych krajów świata, zazwyczaj szukają słońca, i znajdują je w
          Hiszpanii, patrz Norwedzy, Belgowie, obywatele Wielkej Brytanii czy
          nawet Niemcy i Rosjanie. Polacy wciąż stanowią dość mały procent
          kupujących. Ceny nieruchomości są wysokie natomiast są niższe niż
          inwestycje np. nad Polskim morzem, gdzie jednak nie mamy słońca aż 320
          dni w roku. Turyści szukają tam wypoczynku, są gotowi zapłacić w
          sezonie za apartamenty premium, rezerwacje nie stanowią problemu
          (jeśli mądrze się do nich podejdzie), dlatego ceny nieruchomości i
          wynajmu rosną ok 5-7% rocznie.
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 3 Ceny nieruchomości w Hiszpanii na sprzedaż.
        </h2>
        <p>
          Portale agregujące nieruchomości na sprzedaż w Hiszpanii wyglądają
          często jak losowe ceny przy losowych ofertach. Na pierwszy rzut oka
          nie wiadomo dlaczego 2 podobne apartamenty mają zupenie inną cenę. Od
          tego warto zacząć. Głownym powodem jest błąd poznawczy, który generują
          w nas zdjęcia nieruchomości i ich okolic. To tak jak z ubraniami,
          jedzeniem, samochodami - na okładce lub zdjęciu wyglądają idalnie ale
          widząc w rzeczywistości - już jednak wiemy dlaczego cena jest inna.
          Dlatego szukając nieruchomości w Hiszpanii na sprzedaż, raczej nie
          oceniaj nieruchomości i wysokości ceny w oparciu o zdjęcia, poproś o
          dodatkowe informacje. Wybierz kilka róznych ofert lub skorzystaj z
          pomocy agenta. W rzeczywistości bardzo często nieruchomość jest inna w
          ogłoszeniu i inna w rzeczywistości.
          <br></br>
          <br></br>
          Faktyczne ceny nieruchomości w Hiszpanii na sprzedaż zaczynają się od
          nawet 70 000 euro i kończą aż 400 000 euro i więcej. Apartamenty
          zazwyczają mają 2 sypialnie, 1 lub 2 łazienki, miejsce parkingowe.{" "}
          <br></br>Zatem co wpływa na cenę? Oto kilka przykładów:
          <ul className="list-disc ml-[20px] my-[20px]">
            <li>
              Rozróżnienie na rynek wtórny i rynek pierwotny, ten drugi zaczyna
              się od ok 210 000 euro jeśli szukamy czagoś na ogół
              satysfakcjonującego. Standardy budowy nieruchomości w Hiszpanii
              bardzo się zmieniły na przestrzeni ostatnich kilku lat. Czasami
              rynek wtórny na tle pierwotnego wygląda jak budownictwo z zupełnie
              innego regionu świata.
            </li>
            <li>
              Dodatkowe atuty nieruchomości tj. basen, garaż lub parking wraźnie
              podnoszą cenę nieruchomości.
            </li>
            <li>
              Widok na morze oraz pierwsza linia brzegowa potrafi spowodować, że
              cena nieruchomości w Hiszpanii będzie 2-krotnie wyższa.
            </li>
          </ul>
          <br></br>
          Ceny nieruchomości w Hiszpanii, które na ogół nie zadowalają klientów
          są niższe niż ok 170 000 euro. Do remontu i odświeżenia w nieco
          starszej inwestycji i nieco dalej morza (ok 3-5 km)znajdziemy coś w
          widełkach 120 000 - 150 000 euro. Jeśli cena nieruchomości w Hiszpanii
          jest niższa, to sama nieruchomość jest dobra raczej dla osób, które
          chcą sporo dołożyć do gruntownego remontu są gotowe aby robić
          nieruchomość (nikt nikomu nie broni) i wyraźnie oddalają się od morza
          co powoduje, że nieruchomość staje się mało atrakcyjna. Jeśli jednak
          ktoś szuka małego mieszkania w Hiszpanii i jest gotowy na dołożenie
          kosztów do remontu i poświęcenie czasu - wszystko da się znaleść
          niemniej ilości sypialni, otoczenia, odległości od morza nie da się
          zmienić.
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 4. Nieruchomości w Hiszpanii, a nieruchomości w Polsce.
        </h2>
        <p>
          Formalności przy zakupie nieruchomości w Hiszpanii są praktycznie
          takie same, tj.{" "}
          <ul className="list-disc  ml-[20px] my-[20px]">
            <li>Umowy rezerwacyjne.</li>
            <li>
              Zadatki wynoszące od 3000 - 10 000 euro.<br></br> W przy nowych
              apartamentach (zazwyczaj w budowie) płacimy transze co ok. 2-3
              m-ce wynosząc ok. 25% ceny nieruchomości w Hiszpanii. UWAGA!
              Ostatnie 50% płatne przy akcie notarialnym. Czas oddania nowej
              nieruchomości do użytku to teraz ok 12-18 m-cy. Zatem płatność
              ostatnich 50% sporo poczeka, wielu wykorzystuje ten czas aby
              &ldquo;dozbierać&ldquo; kwotę i kupić coś z rynku pierwotnego.
            </li>
            <li>Płatności i akty notarialny (oba w podobnym terminie).</li>
            <li>Przekazanie kluczy i przepisanie mediów.</li>
          </ul>{" "}
          Po drodze konieczne jest wyrobienie numeru N.I.E oraz założenie konta
          w banku, obie rzeczy najlepiej zrobić w Hiszpanii czym jednak zajmuje
          się agencja prowadząca sprzedaż.
          <br></br> <br></br>
          <strong className="font-bold">
            Stan deweloperski - w Hiszpanii.
          </strong>{" "}
          nieco różni się od Polskiego, w nowych nieruchomościach w Hiszpanii
          mamy zazwyczaj:
          <ul className="list-disc ml-[20px] my-[20px]">
            <li>
              Gotową i umblowaną kuchnię ze sprzętami tj. okap, zmywarka, piec
              elektryczny, płyta indukcyjna
            </li>
            <li>
              Gotową i praktycznie umeblowaną łazienkę (czasami brakuje szyby w
              prysznicu).
            </li>
            <li>
              Pomalowane na gotowo ściany, położone płytki na podłodze lub
              panele.
            </li>
            <li>Szafy w zabudowie w sypialniach.</li>
            <li>Pre-instalacja klimatyzacji na cały apartament.</li>
          </ul>
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 5. Jak wygląda współpraca z polską agencją nieruchomości w
          Hiszpanii
        </h2>
        <p>
          Model współpracy jest typowy dla branży nieruchomości. Na rynku działa
          bardzo dużo agentów, którzy mocno ze sobą konkurują. O ile nie mamy
          nic do konkurencji o tyle czasami ma to efekty wręcz
          &ldquo;wciskania&ldquo; nieruchomości klientowi. Agencja, która
          rozumie, że słuchanie, cierpliwość, otwartość i doradztwo (prawdziwe)
          jest kluczem do współpracy sprzeda pewnie mniej nieruchomości ale
          będzie spać lepiej i klienci będą zadowoleni, będą polecać. <br></br>{" "}
          <br></br> Takich słuchających i dostępnych agencji szukajcie. Ponaddto
          warto ustalić czy dana agencja zajmuje się zarządzaniem najmem, jeśli
          tak to konsekwencje rekomendacji złej nieruchomości przez taką agencję
          - wrócą do niej wraz z niskim lub zerowym zyskiem z najmu i
          niezadowolnym klientem, dlatego taka agencja też nie bedzie wciskać.
          Dobrze jest zwrócić uwagę czy agencja zarówno sprzedaje jak i zarządza
          nieruchomością.
          <br></br> <br></br>
          Idąc dalej. Rynek nieruchomości w Hiszpanii jest bardzo dynamiczny,
          zatem osoba prowadząca powinna być gotowa do tego aby aktualizować
          ogłoszenia i być z Tobą w kontakcie, najbardziej w chwili kiedy jesteś
          blisko przylotu i podczas pobytu. Nieruchomości w Hiszpanii sprzedają
          nawet w ciągu kilku godzin od publikacji ogłoszenia, zatem warto być
          na bierząco stale z nowymi ofertami aby jak najwięcej zyskać szans na
          dobry zakup. Rynek pierwotny jest tylko nieco mniej dynamiczny,
          konsekwencje są jednak inne - czas oddania obiektu użytku liczony jest
          w kilkunastu miesiącach.
          <br></br> <br></br>
          Głównym błędem - i tutaj pewnie prawie wszystkie agencje się zgodzą -
          jest wysyłanie wiadomości z pytaniem o zakup nieruchomości w Hiszpanii
          do kilkunastu lub nawet kilkudziesiąciu agencji. W Hiszpanii nie jest
          zbyt dobrze widziane. Klient który skacze z kwiatka na kwiatek, nie
          odbiera telefonów po tym jak agent 2 dni szukał mu nieruchomości - już
          minęło. Agencje teraz nie pozwalają sobie na coś takiego po jest to
          bardzo duży nakład czasu, a klient znika. Agencje również często
          odmawiają współpracy w takich sytuacjach na rzecz klientów, którzy
          mają max 2 agencje obsługujące i aktywne uczestniczą w procesie zakupu
          w końcu swojej własnej nieruchomości. Multiagencja Onesta powstała z
          myślą o tym aby móc zaoferować wiele ogłoszeń innych agencji, ale bez
          sytuacji w której klient rozmawia z kilkunastoma osobami, a finalnie
          często nie wie kto jakie oferty mu wysyłał co demotywuje go do
          puszukiwań - i nic w tym dziwnego. Zatem drogi poszukujący - unikaj
          wysyłania dziesiątek zapytań aby proces dla Ciebie był znośny i miły.
          W końcu to Hiszpania, spełnienie marzeń! Nie daj sobie tego popsuć:)
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 6. Czy Polacy oraz jakie inne kraje kupują nieruchomości w
          Hiszpanii?
        </h2>
        <p>
          Oczywiście! Polacy coraz chętniej szukają nieruchomości na sprzedaż w
          Hiszpanii, a ich udział w rynku rośnie choć wciąż jest znikomy. Cały
          świat kupuje w Hiszpanii, a w pierwszej trójce są obywatele krajów tj:
          <ul className="list-disc  ml-[20px] my-[20px]">
            <li>Wielka Brytania - 15% sprzedaży</li>
            <li>Niemcy - 9% sprzedaży</li>
            <li>Francja - 6,5% sprzedaży</li>
          </ul>
          <p>
            Polska ma ok 4% udziału w sprzedaży w tej chwili, więc jak widać
            mimo wzrostu ta wartość wciąż jest marginalna, choć i tak jest to
            ponad 6 000 nieruchomości zakupionych w tylko jednym roku.
          </p>
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 7. W jakim celu realizuje się zakup nieruchomości w Hiszpanii?
        </h2>
        <p>
          Istnieją 2 główne kierunki i motywy, cała reszta jest ich wypadkową.
          Nieruchomości w Hiszpanii kupujemy aby albo ją wynająć i zarabiać albo
          w niej mieszkać. Oba modele można bardzo elastycznie połączyć co ma
          oczywiście swoje konsekwencje ale opisaliśmy je dokładnie (oraz sam
          proces wyboru){" "}
          <Link
            href="/blog/jak-kupic-nieruchomosc-w-hiszpanii"
            className="underline text-blue-500"
          >
            w tym artykule.
          </Link>
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 8. Jakie są koszty dodatkowe przy zakupie nieruchomości w
          Hiszpanii?
        </h2>
        <p>
          Ceny ogłoszeń na portalach zawsze są netto. Kupujący nie płaci
          prowizji za pośrednictwo w sprzedaży, prowizje płaci właściciel, zatem
          do kwoty netto dodajemy koszty &ldquo;przekazania własności
          nieruchomości&ldquo;. Podstawowym kostem jest podatek 10%, koszty
          związan z formalnościami tj. wyrobienie numeru N.I.E, założenie konta
          w banku, notariusz, tłumacz przysięgły to ok 2-3% wartości
          nieruchomości. Zatem jeśli do ceny netto dodamy 13% otrzymamy kwotę
          całkowitą zakupu nieruchomości w Hiszpanii. Przykład: cena netto 200
          000 * 1,13 = 226 000 euro brutto.
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 9. Najciekawsze regiony na zakup nieruchomości w Hiszpanii.
        </h2>
        <p>
          Gównych regionów, które są brane pod uwagę mamy 3. Costa Blanca, Costa
          Calida, Costa del Sol.
          <br></br>
          <ul className="list-disc  ml-[20px] my-[20px]">
            <li>
              <span className="font-semibold">Costa Blanca </span>pozwala na
              wysokie zwroty z inwestycji (z pominięciem kilku miast np.
              Torrevieja, Gran Alacant, La Mata) głównie w Punta Prima, Orihuela
              Costa, Torre de la Horadada, San Pedro del Pinatar, Santiago de la
              Ribera, Mil Palmeras i kilka innych. Costa Blanca nie jest droga
              na tle Costa del Sol (ceny wyższe ok 20-30%), jest najcieplejszym
              regionem w Hiszpanii ze względu na niską wilgotność powietrza i
              doskonale skomunikowanym z Polską (3:20 h samolotem). Stosunkowo
              łatwo znaleźć tutaj <strong>apartament lub dom</strong> blisko
            </li>
            <li>
              <span className="font-semibold">Costa Calida</span> - przylegające
              do Costa Blanca od strony południej, dość małe wybrzeże ale
              atrakcyjne dla osób, które cenią sobie zwrot z wynajmu oraz
              spokojne lecz dobrze zurbanizowane miasta o niskiej zabudowie.
            </li>
            <li>
              <span className="font-semibold">Costa del Sol</span> - region
              drogi wręcz prestiżowy, ceny są tutaj dość wysokie (Marbella to
              miasto Szejków) niemniej deweloperzy mocno inwestują w okoliczne
              miasta, które rozwijają się i mają też nieco niższe ceny. Trudno
              prognozować zwroty z inwestycji każdorazowo będzie to zależeć od
              atrakcji w okolicy. Odległości od <strong>plaży</strong> również
              są niewielkie (1-2 km). Tutaj główne miasto to Malaga, z którą
              Polska nie zawsze jest dobrze skomunikowana (zależy jakie miasto).
              Niemniej region jest absolutnie wyjątkowy.
            </li>
          </ul>
        </p>
        <h2 className="font-bold my-[20px]">
          Ad. 10. Rynek pierwotny vs rynek wtórny - podstawe różnice
        </h2>
        <p>
          Ujmując to najbardziej obrazowo. Rynek wtórny to bardziej mieszkanie,
          a pierwotny to apartament do wypoczynku i przyjemnego spędzania czasu.
          <br></br>
          <br></br> Ubierając to w klamrę. Jeśli rynek pierwotny jest tworzony
          pod klienta indywidualnego, gdzie liczy się komfort, to aby mieć
          basen, ogródek lub solarium na dachu to rynek wtórny był tworzony pod
          stary typ potrzeb tj. mniej tam było nowoczesności, stylu, dużo
          prostego często nieprzemyślanego budownictwa i obecnie praktycznie
          zawsze do remontu lub przynajmniej lekkiego odświeżenia. Gdzieś
          pomiędzy stoi świeży rynek wtórny (1-3 lat od oddania), granica jest
          dość elastyczna.
          <br></br> Zakładając, że nie szukajamy niczego do remontu, ceny
          nieruchomości w Hiszpanii na rynku wtórnym zaczynamy od ok 170 000
          euro, ryneku pierwotnym od ok 229 000 euro, na który czekamy
          kilkanaście miesięcy.
        </p>
        <br></br>
        <h2 className="font-bold my-[20px]">
          11. Zakup nieruchomości w Hiszpanii jako inwestycja
        </h2>
        <p>
          To również dość obszerny temat, na który powstał artykuł{" "}
          <Link
            href="/blog/jak-kupic-nieruchomosc-w-hiszpanii"
            className="underline text-blue-500"
          >
            &ldquo;Jak kupić nieruchomość w Hiszpanii - określ swoje
            cele&ldquo;.
          </Link>{" "}
          Mówiąc po krótce. Nieruchomość w Hiszpanii aby dobrze się wynajmowała
          musi spełnia kilka warunków:{" "}
          <ul className="list-disc  ml-[20px] my-[20px]">
            <li>Odległość od morza nie wyższa niż 1,5 km</li>
            <li>2 pokoje + 2 łazienki</li>
            <li>Garaż lub parking</li>
            <li>Basen na obiekcie</li>
            <li>Wysoki poziom ueblowania</li>
            <li>Okolica z kilkoma restauracjami, pubem, marketami, parkami</li>
          </ul>
        </p>
        <p>
          Dobrnąłeś do końca więc pewnie artkuł był pomocny, zachęcamy do
          przejrzenia ofert nieruchimości korzystając z menu u góry strony
        </p>
      </div>

      <ContactFormBlogPost temat="Jak kupić nieruchomość w Hiszpanii - podstawy" />
      <Footer />
    </>
  );
}
