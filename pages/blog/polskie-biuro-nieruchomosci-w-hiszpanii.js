import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Header from "../../components/Header";
import HeaderBlog from "../../components/HeaderBlog";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import Footer from "../../components/Footer";
import Blogbuttonoffers from "../../components/blogbuttonoffers";
import { LuArrowUpRightSquare } from "react-icons/lu";

export default function BlogPost() {
  const temat = "Polskie Biuro Nieruchomości w Hiszpanii, czy jest potrzebna i dlaczego?";

  return (
    <>
      {" "}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-P4VZ7P7VZ5"></Script>
      <Script id="google-analitycs">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-P4VZ7P7VZ5');
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
        <title>Polskie Biuro Nieruchomości w Hiszpanii, czy jest potrzebna i dlaczego?</title>
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
          content="Jesteśmy Polskim Biurem Nieruchomości w Hiszpanii, wyszukujemy nieruchomości na sprzedaż na potrzeby naszych klientów. Prowadzimy proces weryfikacji, zakupu i sprzedaży nieruchomości w Hiszpanii."
        />
        <meta
          name="Keywords"
          content="Polskie biuro Nieruchomości w Hiszpanii, nieruchomości hiszpania, apartamenty Hiszpania, apartamenty w Hiszpanii, nieruchomości w Hiszpanii, apartamenty w Hiszpanii,agencja nieruchomości w Hiszpanii"
        />
        <meta
          name="original-source"
          content="https://onesta.com.pl/blog/polskie-biuro-nieruchomosci-w-hiszpanii.html"
        />
      </Head>{" "}
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 md:bg-gray-800/[0.4] z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <Blogbuttonoffers />
      <div className="lg:w-[1100px] lg:mx-auto md:px-[50px] w-[90vw] mx-auto text-[20px] tracking-normal mt-[50px]">
        <h2 className="text-[24px]">
          Czy jest mi do czegoś potrzebne
          <strong> Polskie Biuro Nieruchomości w Hiszpanii?</strong> <br></br>Porozmawiajmy.{" "}
        </h2>
        <p className="text-green-600 font-normal mt-[40px] italic">
          Podpowiedź: <br></br>Jeśli w tej chwili szukasz wyłącznie kontaktu z{" "}
          <strong>Polskim Biurem Nieruchomości na terenie Hiszpanii</strong> to zapraszamy Cię do
          kontaktu z Nami. Na terenie Hiszpanii mamy kilka biur oraz agentów mobilnych. Możesz
          skorzystać z:<br></br> - adres mailowego
          <a href="mailtp:biuro@onesta.com.pl" className="underline">
            biuro@onesta.com.pl (kliknij),
            <br></br>
          </a>
          - skontatkować się telefonicznie pod numerem{" "}
          <a href="tel:+48576652525" className="underline">
            +48 576 65 25 25 (kliknij aby zadzownić).
          </a>
          <br></br>
          <br></br>
          Jeśli nie to zapraszamy do krótkiego omówienia tematu.
        </p>
        <div className="border my-10 px-2 lg:w-2/3 w-full">
          <p className="py-2 font-bold text-xl">Spis treści:</p>
          <h2>1. Zagrożenia we współpracy z niepolskimi agencjami nieruchomości </h2>
          <h2>
            2. Korzyści ze współpracy z <strong>Polskimi biurami Nieruchomości Hiszpanii.</strong>
          </h2>
        </div>
        Artykuł ten będzie należał raczej do tych krótszych i konkretnych ponieważ prócz rozwinięcia
        podstawowych rzeczy, nie ma owych zagrożeń zbyt wielu niemniej są bardzo ważne.
        <br></br>
        <br></br>
        <b>
          <h3>1. Zagrożenia we współpracy z niepolskimi agencjami nieruchomości. </h3>
        </b>
        <br></br>
        Biura Nieruchomości w Hiszpanii prócz języka Hiszpańskiego praktycznie zawsze posługują się
        językiem przynajmniej Angielski. Nie spotkaliśmy przypadku w którym było inaczej. jednak
        prawdą jest, że niewiele lub bardzo niewiele z nich potrafi rozmawiać po Polsku. Jeśli
        rozmawiacie Państwo po angielsku to pozostaje tylko chęć na prezentacje w owym języku i
        wybór jest właściwie dowolny. Deweloperzy praktycznie zawsze dysponują materiałami
        drukowanymi, tzw. show houseami oraz prezentacjami interaktywnymi, które jak to każdy obraz
        mówią więcej niż 1000 słów. Czy napewno?
        <br></br>
        <br></br>
        Zanim przejdziemy dalej rozwiejmy pewien mit. Pamiętajmy jednak, że zawsze na każdym rynku
        są ekstrema i ludzie, którzy chcą oszukać, tę część rynku idąc dalej - omijam. Czasami
        zdarzy mi się przeczytać na forach „agencjom dziękuję, tylko prywatne oferty”. Prywatnych
        ofert nieruchomości w Hiszpanii, takich, które trafiają na grupy dyskusyjne lub do Polski
        jest wybitnie niewiele. One rozchodzą się już albo w Hiszpanii albo wśród Polskich znajomych
        osoby sprzedającej. Nie zatem mówię, że ich nie ma wcale.
        <br></br>
        <br></br>
        Jeśli zatem zdarzyło Ci się pomyśleć w podobny sposób - nie znam Twoich pobudek - wyjaśnię.
        Nie ma znaczenia ilu agentów, pośredników pracuje nad ofertami dla CIebie - prowizja jest
        zawsze taka sama - tak jest przynajmniej w naszej Oneście. Problemem biznesowym bardziej
        jest już sprawiedliwy podział ew. prowizji co oczywiście nie dotyczy nabywcy, natomiast raz
        jeszcze - nie podnosimy jej sztucznie.<br></br>
        Nie obawiajmy się współpracy <strong>Polskimi biurami nieruchomości w Hiszpanii </strong>ze
        względu na strach przed kwestiami finansowymi. Ponaddto -{" "}
        <b>
          w przypadku zakupu nieruchomości w Hiszpanii nowych, tj. od dewelopera, zarówno z 5-cioma
          pośrednikami jak i samemu - cena jest taka sama. Atutem agentów, który może pomóc jest
          fakt iż agencje współpracują z deweloperami sprzedając czasami większość inwestycji, to
          daje uprzewilejowaną pozycję w negocjacjach.
        </b>
        <br></br>
        <br></br>
        Krok dalej. Dość często się spotykam z myśleniem, że potencjalny nabywca ominie agencję bo
        „ponegocjuje” samemu. Praktycznie jest to możliwe ale logicznie jest to niezasadne,
        ponieważ.<br></br>
        1. Brakuje takiej osobie doświadczenia na rynku nieruchomości w Hiszpanii, nie zna regionu,
        nie zna konkurencji, nie zna „kruczków”, które znaja i o które może oprzeć się agent.
        Potencjalny nabywca nieruchomości w Hiszpanii nie jest u siebie nie kupuje domu / mieszkania
        we własnym mieście, gdzie zapewne wiedziałby, że tutaj po godz 22:00 wywożą odpady kuchenne,
        a tam od 4:00 codzienne nad ranem przychodzą kucharze i trzaskają drzwiami.<br></br>
        <br></br>
        Pośrednik przyprowadzając do danej nieruchomości załóżmy 5 osób na oglądanie w ciągu
        tygodnia doskonale wie na co jest w stanie się zgodzić obecny właściciel. Wszystko to co
        trafia do nas poprzez strony czy ogłoszenia, to efekt pracy agentów, którzy prócz podstawową
        ustaloną wcześniej prowizją
        <br></br>
        <br></br>
        Zatem mamy z głowy ten trudny wątek. Wracajmy.
        <br></br>
        <br></br>
        <b>
          <h3>
            2. Korzyści ze współpracy z <strong>Polskimi biurami nieruchomości Hiszpanii.</strong>
          </h3>
        </b>
        <br></br>
        Zatem dlaczego potrzebna mi <strong>Polskie biuro nieruchomości w Hiszpanii?</strong> Po
        pierwsze - mogące się wydawać nawet śmieszne - czasami błędnie można uznać swój poziom
        językowy za dobry ponieważ np. codziennie pracuje się w tym języku. Tylko czy jeśli ja
        pracując załóżmy w IT zrozumiem język branży nieruchomości ludzi z Hiszpanii? Przygotuję się
        ok ale jeśli nie zrozumiem to czy istnieje prawdopodobieństwo, że chcąc zrozumieć zdanie w
        kontrakcie rezerwacyjnym, poprosimy wyjaśnienie i zabrniemy w kolejne „branżowe słówka” albo
        kilka? Część zapisów odpuścimy, zrozumiemy nieodpowiednio lub … tutaj wstaw wszystko o czym
        teraz pomyślałeś/ pomyślałaś.
        <br></br>
        <br></br>
        <b>
          Pamiętajmy, że:<br></br>
        </b>
        <li>
          językiem urzędowym w Hiszpanii i praktycznie zawsze honorowanym jest język oczywiście
          Hiszpański, ew. tłumaczenia na angielski.
        </li>
        <li>
          Agent dobrze zna deweloperów współpracujące biura oraz ich praktyki, potrafi wyjaśnić z
          czasem przetłumaczonego w translatorze Polskiego na „nasze” co oznacza dany zapis
        </li>
        <li>
          wie i rozumie jakie ma konsekwencje w Hiszpanii dany zapis na tle kontekstu jakim jest
          rozumienie np. praktyk sprzedaż/zakup jakie potencjalny nabywca pamięta z Polski i na
          których bazuje próbując zrozumieć praktyki i definicje w Hiszpanii,<br></br>wie, które z
          biur współpracujących (wszyscy pracują ze sobą w pewnym zakresie) ma zalety i jakie, a
          czego im brakuje,
        </li>
        <li>
          ma przepracowany proces z klientami z Polski tym samym ma praktyczne rozumienie intencji w
          zadawaniu lub formułowaniu pytań,
        </li>
        <li>
          <strong>Polskie biuro nieruchomości w Hiszpanii</strong> ma prawników oraz tłumaczy
          przysięgłych również Polsko języcznych, którzy ową umowę w razie co prawda rzadkiej
          potrzeby również mogą na Polski przetłumaczyć,
        </li>
        <li>
          roces posprzedażowy, akty notarialne, płatności i transze, sprawdzenie własności obiektu,
          przepisywanie mediów, remonty - tutaj już chyba, nie trzeba tłumaczyć, że będąc 3000 km od
          własnego kraju nie tylko język może być atutem lub problemem ale już pewne praktyki
          pomiędzy kupującym i sprzedającym, sprawność w działaniu.
        </li>
        <br></br>
        Podsumowanie jest dość oczywiste,{" "}
        <strong>
          <strong>Polskie biuro nieruchomości w Hiszpanii</strong>
        </strong>{" "}
        to gwarancja bezpieczeństwa całej transakcji i tego co może dziać się dalej.<br></br>
        Więcej komentarza nie ma potrzeba.<br></br>
        <br></br>
        Wszystkiego dobrego dla Państwa.<br></br>
        <br></br>
        <Link
          href="/hiszpania"
          className="text-white md:text-[26px] text-auto font-normal flex items-center py-[10px] rounded-2xl justify-center bg-green-500 md:w-[500px] shadow-xl mb-[50px] mx-auto"
        >
          Przeglądaj oferty nieruchomości
          <LuArrowUpRightSquare />
        </Link>
      </div>
      <ContactFormBlogPost temat="Jak kupić nieruchomość w Hiszpanii cz.1" />
      <Footer />
    </>
  );
}
