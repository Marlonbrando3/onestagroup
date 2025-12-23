import React from "react";
import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Header from "../../components/Header";
import Link from "next/link";
import Footer from "../../components/Footer";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";

export default function Zarzadzanie() {
  const [searchShow, setSearchShow] = useState(true);

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
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
        <title>Nieruchomości Chorwacja - Onesta Group</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      {/* <MiniHomeView /> */}
      <div className="w-10/12 mx-auto my-20">
        <h1 className="text-2xl font-bold">Nieruchomości Chorwacja - Trogir i jego atrakacje</h1>
        <br></br>
        <br></br>
        <br></br>
        Trogir to malownicze miasto położone na wybrzeżu Dalmacji, znane przede wszystkim z pięknych
        zabytków i uroczego starówki, która została wpisana na listę światowego dziedzictwa UNESCO.
        To również popularne miejsce dla turystów, którzy szukają wakacji nad morzem. Trogir oferuje
        wiele możliwości zakupu nieruchomości, zarówno dla tych, którzy szukają mieszkań w centrum
        miasta, jak i dla tych, którzy chcą mieć własną willę nad morzem.
        <br></br>
        <br></br>
        <div className="border my-10 px-2 lg:w-2/3 w-full">
          <p className="py-2 font-bold text-xl">Spis treści:</p>
          <p className="py-1">1. Zarys historii Trogiru</p>
          <p className="py-1">2. Atrakcje turystyczne.</p>
          <p className="py-1">3. Restauracje</p>
          <p className="py-1">4. Najładniejsze plaże</p>
          <p className="py-1">5. Nieruchomości Chorwacja - rynek Trogir</p>
        </div>
        <b>Zarys historii Trogiru</b>
        <br></br>
        <br></br>
        Trogir to miasto w Chorwacji z ponad 2 000-letnią historią. W ciągu wieków miasto należało
        m.in. do Rzymu, Bizancjum i Wenecji, co przyczyniło się do rozwoju sztuki i kultury. W 1997
        roku Trogir został wpisany na listę światowego dziedzictwa UNESCO, co zwiększyło
        zainteresowanie turystów. Dziś to piękne miasto łączy wpływy różnych kultur i epok.<br></br>
        <br></br>
        <b>Atrakcje turystyczne</b>
        <br></br>
        <br></br>
        Jednym z najważniejszych zabytków w Trogirze jest Katedra św. Wawrzyńca, zbudowana w stylu
        romańskim, gotyckim i renesansowym. Katedra ma piękne dekoracje i rzeźby, w tym słynny
        portal z wizerunkami Adama i Ewy, a wewnątrz znajdują się cenne dzieła sztuki, takie jak
        tryptyk z końca XIV wieku i rzeźby wykonane przez znanych artystów.<br></br>
        Innym ważnym zabytkiem w Trogirze jest twierdza Kamerlengo, zbudowana w XV wieku przez
        Wenecjan. Twierdza ma piękne widoki na miasto i okolicę, a obecnie organizowane są tam
        różnego rodzaju wydarzenia kulturalne.<br></br>
        Warto również odwiedzić Plac Ivana Pavla II, który znajduje się w samym centrum miasta. Na
        placu znajduje się ratusz z XIV wieku, klasztor św. Dominika i wiele innych budynków
        zabytkowych. Plac jest popularnym miejscem spotkań dla turystów i mieszkańców Trogiru.
        <br></br>
        Nie można zapomnieć również o pięknych plażach w Trogirze i na wyspie Čiovo, które
        przyciągają turystów z całego świata. W okolicy znajduje się wiele uroczych zatoczek i plaż,
        idealnych do uprawiania sportów wodnych i rekreacji.
        <br></br>
        <br></br>
        <b>Restauracje</b>
        <br></br>
        <br></br>
        Jednym z najlepszych miejsc do jedzenia w Trogirze jest restauracja &quot;Konoba Trs&quot;.{" "}
        <br></br>
        Znajduje się ona w samym sercu miasta i oferuje tradycyjne dania z Dalmacji, takie jak
        grillowane ryby i mięsa, makarony i risotto. Restauracja ma przytulny i rustykalny wystrój,
        a personel jest bardzo przyjazny i pomocny.<br></br>
        <br></br>
        Kolejnym polecanym miejscem jest restauracja &quot;ašike&quot;, która znajduje się na
        tarasie nad kanałem w Trogirze. Restauracja oferuje dania kuchni chorwackiej i
        międzynarodowej, a ich menu zmienia się wraz z porami roku, aby wykorzystać sezonowe
        produkty. Restauracja ma przyjemny i romantyczny wystrój, a widok na kanał i starówkę
        Trogiru jest niesamowity.<br></br>
        <br></br>
        Inną ciekawą restauracją jest &quot;Restoran Piccolo&quot;, która znajduje się w samym
        centrum miasta, niedaleko Katedry św. Wawrzyńca. Restauracja oferuje przepyszne dania kuchni
        dalmatyńskiej, takie jak owoc morza, grillowane ryby i mięsa oraz tradycyjne makarony i
        risotto. Restauracja ma uroczy i przytulny wystrój oraz duży taras na zewnątrz.<br></br>
        <br></br>
        Jeśli lubisz jedzenie wegetariańskie lub wegańskie, to polecamy odwiedzenie &quot;Konoba
        Trifora&quot;. Restauracja znajduje się w pięknej kamiennej kamienicy w centrum miasta i
        oferuje pyszne dania wegetariańskie i wegańskie. Menu składa się z tradycyjnych dań z
        Dalmacji, takich jak fasolka szparagowa, papryka faszerowana i makarony z warzywami.
        Restauracja ma piękny i rustykalny wystrój, a personel jest bardzo przyjazny i pomocny.
        <br></br>
        <br></br>
        <b>Najładniejsze plaże</b>
        <br></br>
        <br></br>
        Jedną z najbardziej popularnych plaż w Trogirze jest plaża &quot;Pantan&quot;. Znajduje się
        ona około 1,5 km od centrum miasta i jest łatwo dostępna pieszo lub samochodem. Plaża jest
        piaszczysta, a woda jest krystalicznie czysta. Na plaży znajdują się leżaki i parasole, a
        także kawiarnie i bary serwujące napoje i przekąski.<br></br>
        Inną popularną plażą jest plaża &quot;Medena&quot;. Znajduje się ona w odległości około 4 km
        od centrum Trogiru, w kierunku południowym. Plaża jest piaszczysta i ma długość około 3 km,
        co czyni ją jedną z największych plaż w okolicy. Na plaży znajdują się leżaki i parasole, a
        także wiele punktów gastronomicznych. Plaża jest idealna dla rodzin z dziećmi, ze względu na
        łagodne wejście do wody i wiele atrakcji, takich jak boiska do piłki nożnej i siatkówki.
        <br></br>
        Kolejną piękną plażą w Trogirze jest plaża &quot;Kava&quot;. Znajduje się ona na północny
        wschód od miasta, na skraju malowniczego lasu sosnowego. Plaża jest kamienista, ale woda
        jest krystalicznie czysta i idealna do pływania. Na plaży znajduje się wiele barów i
        kawiarni, gdzie można zrelaksować się i cieszyć się pięknymi widokami.<br></br>
        <br></br>
        <b>Nieruchomości Chorwacja - rynek Trogir</b>
        <br></br>
        <br></br>
        Ceny nieruchomości w Trogirze zależą od lokalizacji, wielkości nieruchomości oraz stanu
        technicznego. Mieszkania w centrum miasta zazwyczaj są droższe niż te położone na obrzeżach
        miasta. Cena metra kwadratowego mieszkania w Trogirze wynosi średnio od 1 500 do 2 500 euro,
        a w przypadku willi nad morzem może to być nawet do 5 000 euro za metr kwadratowy.<br></br>
        Istnieje kilka opcji zakupu nieruchomości w Trogirze. Można kupić nieruchomość bezpośrednio
        od właściciela lub za pośrednictwem agencji nieruchomości. W przypadku kupna nieruchomości
        bezpośrednio od właściciela warto skonsultować się z prawnikiem lub notariuszem, aby upewnić
        się, że dokumenty są w porządku. Agencje nieruchomości oferują szerszy wybór nieruchomości
        oraz pomagają w procesie zakupu nieruchomości, ale wiążą się z dodatkowymi kosztami.
        <br></br>
        Kupując nieruchomość w Trogirze, warto zwrócić uwagę na lokalizację. Nieruchomości położone
        w pobliżu plaży lub z widokiem na morze są zazwyczaj droższe, ale z pewnością oferują
        niezapomniane widoki i poczucie luksusu. Jeśli szukasz czegoś tańszego, warto rozważyć
        nieruchomości na obrzeżach miasta lub w okolicach gór.
      </div>
      <ContactFormBlogPost temat="Nieruchomości Chorwacja - Trogir" />
      <br></br>
      <br></br>
      <Footer />
    </>
  );
}
