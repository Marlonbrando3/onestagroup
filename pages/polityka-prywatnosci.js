import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

const updatedAt = "26 listopada 2026 r.";

export default function PolitykaPrywatnosci() {
  return (
    <>
      <Head>
        <title>Polityka prywatności i cookies | Onesta Group</title>
        <meta
          name="description"
          content="Informacje o przetwarzaniu danych osobowych, plikach cookies i podobnych technologiach na stronie Onesta Group."
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
      </Head>

      <Header searchShow />

      <main className="mx-auto my-20 w-10/12 max-w-5xl leading-relaxed text-gray-800">
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="mb-3 text-3xl font-bold">
            Polityka prywatności i plików cookies
          </h1>
          <p className="text-sm text-gray-500">
            Ostatnia aktualizacja: {updatedAt}
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            1. Administrator danych
          </h2>
          <p>
            Administratorem danych osobowych jest Onesta Group Sp. z o.o. z
            siedzibą przy ul. Wolbromskiej 18/1b, 53-148 Wrocław.
          </p>
          <p className="mt-2">
            W sprawach dotyczących prywatności możesz skontaktować się pod
            adresem{" "}
            <a className="underline" href="mailto:biuro@onesta.com.pl">
              biuro@onesta.com.pl
            </a>{" "}
            lub numerem{" "}
            <a className="underline" href="tel:+48576652525">
              +48 576 65 25 25
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            2. Cele i podstawy prawne przetwarzania
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              obsługa zapytania (także zgłoszenia z formularza reklamowego
              Facebook/Instagram), kontakt w odpowiedzi na nie, w tym SMS
              potwierdzający przyjęcie zgłoszenia (bez treści handlowych),
              przedstawienie ofert, czat ofertowy i podjęcie działań przed
              zawarciem umowy — art. 6 ust. 1 lit. b RODO;
            </li>
            <li>
              realizacja umowy pośrednictwa — art. 6 ust. 1 lit. b RODO;
            </li>
            <li>
              prowadzenie księgowości i wykonanie obowiązków prawnych, w tym
              dokumentowanie udzielonych i wycofanych zgód (rozliczalność, art. 5
              ust. 2 i art. 7 ust. 1 RODO) — art. 6 ust. 1 lit. c RODO;
            </li>
            <li>
              prowadzenie bazy klientów (CRM), bezpieczeństwo serwisu,
              przeciwdziałanie nadużyciom, dochodzenie lub obrona roszczeń —
              prawnie uzasadniony interes administratora, art. 6 ust. 1 lit. f
              RODO;
            </li>
            <li>
              wiadomości SMS z informacją handlową, w tym SMS powitalny z
              linkiem do czatu ofertowego, oraz kontakt telefoniczny w celach
              marketingowych — zgoda, art. 6 ust. 1 lit. a RODO, wraz ze zgodą
              wymaganą przez art. 398 Prawa komunikacji elektronicznej
              (odrębnie dla SMS i dla telefonu);
            </li>
            <li>
              zapisywanie, które z przesłanych ofert oglądasz i oznaczasz
              (personalizowane linki i prezentacje) — zgoda, art. 6 ust. 1 lit.
              a RODO oraz art. 399 Prawa komunikacji elektronicznej;
            </li>
            <li>
              analityka, reklama i remarketing — zgoda wyrażona w panelu
              CookieYes, art. 6 ust. 1 lit. a RODO oraz art. 399 Prawa
              komunikacji elektronicznej.
            </li>
          </ul>
          <p className="mt-3">
            Zgodę można wycofać w dowolnym momencie — w sposób równie łatwy jak
            jej udzielenie. Wycofanie zgody nie wpływa na zgodność z prawem
            przetwarzania dokonanego przed jej wycofaniem.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            3. Kategorie przetwarzanych danych
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>imię i nazwisko, adres e-mail i numer telefonu;</li>
            <li>
              treść formularza i odpowiedzi na pytania w nim zawarte (np.
              budżet, region, termin zakupu), odpowiedzi udzielone w czacie
              ofertowym, preferencje i informacje o poszukiwanej
              nieruchomości;
            </li>
            <li>
              informacje o kampanii oraz formularzu, z którego pochodzi
              zgłoszenie;
            </li>
            <li>
              informacje o zgodach: rodzaj zgody, jej treść, data, źródło (np.
              formularz, czat, strona prezentacji) oraz ewentualne wycofanie;
            </li>
            <li>
              historia kontaktu i ustalenia z rozmów zapisane przez doradcę w
              systemie CRM;
            </li>
            <li>adres IP, informacje o urządzeniu, przeglądarce i sesji;</li>
            <li>
              identyfikator zgody CookieYes oraz wybrane kategorie zgód;
            </li>
            <li>
              wyłącznie po udzieleniu zgody: otwarcie indywidualnego linku lub
              prezentacji, oglądane oferty i działania wykonane na stronie
              prezentacji lub strony z ofertami;
            </li>
            <li>
              wyraźnie wysłana prośba o kontakt lub kliknięcie „Interesuje mnie
              ta oferta” — przetwarzane zawsze, bo jest Twoją prośbą,
              niezależnie od zgód analitycznych i reklamowych.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">4. Źródła danych</h2>
          <p>
            Dane otrzymujemy bezpośrednio od Ciebie — z formularzy na naszej
            stronie, z formularzy reklamowych Meta Lead Ads (Facebook,
            Instagram), z czatu ofertowego i z rozmów z doradcą — oraz
            automatycznie z urządzenia, wyłącznie w zakresie dozwolonym przez
            udzielone zgody.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">5. Odbiorcy danych</h2>
          <p className="mb-2">
            Dane mogą otrzymać podmioty wspierające nas w świadczeniu usług,
            wyłącznie w niezbędnym zakresie:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Netlify — hosting strony i aplikacji;</li>
            <li>
              Vercel — poprzednia wersja systemu obsługi zgłoszeń, do czasu jej
              wyłączenia;
            </li>
            <li>Supabase — baza danych i infrastruktura systemu CRM;</li>
            <li>SMSAPI (LINK Mobility Poland) — wysyłka wiadomości SMS;</li>
            <li>
              Meta Platforms Ireland — formularze reklamowe Lead Ads, z których
              otrzymujemy zgłoszenia;
            </li>
            <li>CookieYes — zarządzanie i dokumentowanie zgód cookies;</li>
            <li>
              Google, Meta i Hotjar — analityka oraz reklama, wyłącznie zgodnie
              z wybranymi kategoriami zgód;
            </li>
            <li>
              dostawcy poczty elektronicznej, obsługi IT, księgowości i doradcy
              prawni;
            </li>
            <li>
              partnerzy uczestniczący w obsłudze transakcji nieruchomościowej,
              jeżeli jest to potrzebne do realizacji Twojego zapytania lub umowy.
            </li>
          </ul>
          <p className="mt-3">
            W zależności od usługi dostawcy działają jako podmioty przetwarzające
            dane na nasze polecenie albo jako odrębni administratorzy zgodnie ze
            swoimi warunkami i politykami prywatności.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            6. Przekazywanie danych poza Europejski Obszar Gospodarczy
          </h2>
          <p>
            Niektórzy dostawcy technologii mogą przetwarzać dane poza Europejskim
            Obszarem Gospodarczym. W takich przypadkach przekazanie odbywa się na
            podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni
            stopień ochrony, Ram Ochrony Danych UE–USA — jeżeli odbiorca jest nimi
            objęty — albo standardowych klauzul umownych wraz z wymaganymi
            zabezpieczeniami. Informacje o właściwym zabezpieczeniu można uzyskać,
            kontaktując się z administratorem.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            7. Czat ofertowy, indywidualne linki i profilowanie
          </h2>
          <p>
            Po zgłoszeniu przez formularz możesz otrzymać SMS (jeżeli wyraziłeś
            na to zgodę) z indywidualnym linkiem do czatu ofertowego. W czacie
            odpowiadasz na kilka pytań, a my dobieramy wstępną selekcję ofert.
            Odpowiedzi zapisujemy w Twojej karcie klienta, aby doradca mógł się
            do nich odnieść.
          </p>
          <p className="mt-3">
            Przed wysłaniem ofert pytamy, czy możemy zapisywać, które z
            przesłanych ofert oglądasz i które oznaczysz. Tylko po zgodzie link
            zawiera zabezpieczony (zaszyfrowany) identyfikator, a my zapisujemy
            w CRM otwarcia, oglądane nieruchomości i kliknięcia. Na
            prezentacjach przygotowanych indywidualnie dla Ciebie o tę samą zgodę
            pytamy na stronie prezentacji (albo uwzględniamy zgodę reklamową
            wyrażoną w panelu CookieYes). Bez zgody prezentacja działa w pełni —
            po prostu niczego nie zapisujemy.
          </p>
          <p className="mt-3">
            Zgodę wycofasz w każdej chwili: linkiem „Wyłącz zapisywanie” na
            stronie prezentacji, w panelu CookieYes, e-mailem na{" "}
            <a className="underline" href="mailto:biuro@onesta.com.pl">
              biuro@onesta.com.pl
            </a>{" "}
            lub telefonicznie. Informacje te służą wyłącznie przygotowaniu
            rozmowy i dopasowaniu propozycji. Profilowanie nie wywołuje skutków
            prawnych ani w podobny sposób istotnie nie wpływa na Ciebie.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            8. Pliki cookies i podobne technologie
          </h2>
          <p className="mb-2">
            Używamy plików cookies oraz — w ograniczonym zakresie —
            sessionStorage. CookieYes umożliwia osobny wybór następujących
            kategorii:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Niezbędne</strong> — zapewniają działanie strony,
              bezpieczeństwo i zapis preferencji CookieYes; nie można ich
              wyłączyć w panelu zgód;
            </li>
            <li>
              <strong>Funkcjonalne</strong> — zapamiętują dodatkowe ustawienia i
              funkcje wybrane przez użytkownika;
            </li>
            <li>
              <strong>Analityczne i wydajnościowe</strong> — pomagają mierzyć
              korzystanie ze strony i poprawiać jej działanie, m.in. za pomocą
              Google Analytics i Hotjar;
            </li>
            <li>
              <strong>Reklamowe</strong> — służą pomiarowi reklam, remarketingowi
              oraz — po wejściu z indywidualnego linku lub na indywidualną
              prezentację — zapisaniu w CRM oglądanych ofert i interakcji, m.in.
              za pomocą Google Ads i Meta Pixel.
            </li>
          </ul>
          <p className="mt-3">
            Strony prezentacji ofert i czat ofertowy nie zapisują w przeglądarce
            żadnych identyfikatorów. Identyfikator linku z SMS-a do strony
            „TOP 20” jest zapisywany w sessionStorage dopiero po zgodzie
            reklamowej i wygasa wraz z sesją przeglądarki. Szczegółową listę
            technologii, dostawców i okresów działania pokazuje panel ustawień
            CookieYes.
          </p>
          <button
            type="button"
            className="cky-banner-element mt-5 rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Zmień lub wycofaj zgody cookies
          </button>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            9. Okres przechowywania danych
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              dane związane z zapytaniem i kartą klienta w CRM — przez okres
              potrzebny do jego obsługi i dalszego kontaktu, a następnie przez
              czas niezbędny do ustalenia, dochodzenia lub obrony roszczeń;
            </li>
            <li>
              dane umowne i księgowe — przez okres wymagany przepisami prawa;
            </li>
            <li>
              dane wykorzystywane w marketingu (SMS, telefon) — do wycofania
              zgody lub skutecznego wniesienia sprzeciwu;
            </li>
            <li>
              zapis oglądanych ofert i interakcji z prezentacjami — do wycofania
              zgody (od tej chwili nie zbieramy nowych danych), nie dłużej niż 24
              miesiące od zdarzenia; po tym czasie dane są automatycznie
              usuwane;
            </li>
            <li>
              zabezpieczony identyfikator indywidualnego linku — traci ważność
              po 90 dniach;
            </li>
            <li>
              rejestr zgód (treść, data, źródło, wycofanie) — przez okres
              przetwarzania danych na podstawie zgody i do upływu terminów
              przedawnienia roszczeń, aby móc wykazać zgodność z prawem;
            </li>
            <li>
              techniczny dziennik integracji (np. odbiór zgłoszeń, wysyłka
              SMS) — 12 miesięcy;
            </li>
            <li>
              cookies i identyfikatory dostawców — przez okresy wskazane w panelu
              CookieYes.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">10. Twoje prawa</h2>
          <p className="mb-2">W przypadkach określonych przez prawo możesz:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>uzyskać dostęp do danych i ich kopię;</li>
            <li>żądać sprostowania, usunięcia lub ograniczenia przetwarzania;</li>
            <li>żądać przeniesienia danych;</li>
            <li>
              wnieść sprzeciw wobec przetwarzania opartego na prawnie
              uzasadnionym interesie, w tym wobec profilowania;
            </li>
            <li>wycofać zgodę w dowolnym momencie.</li>
          </ul>
          <p className="mt-3">
            Żądanie możesz wysłać na{" "}
            <a className="underline" href="mailto:biuro@onesta.com.pl">
              biuro@onesta.com.pl
            </a>
            . Zgody dotyczące cookies można dodatkowo zmienić przyciskiem w
            poprzedniej sekcji.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            11. Skarga do organu nadzorczego
          </h2>
          <p>
            Jeżeli uważasz, że dane są przetwarzane niezgodnie z prawem, możesz
            złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            12. Dobrowolność podania danych
          </h2>
          <p>
            Podanie danych jest dobrowolne, ale dane oznaczone jako wymagane są
            potrzebne do obsługi zapytania. Zgody marketingowe, analityczne i
            reklamowe są dobrowolne, a ich brak nie ogranicza możliwości
            przeglądania ofert ani wysłania formularza.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            13. Zmiany polityki
          </h2>
          <p>
            Polityka może być aktualizowana, gdy zmieniają się przepisy,
            dostawcy lub sposób działania usług. Jeżeli zmiana dotyczy celu
            wymagającego zgody, poprosimy o jej ponowne wyrażenie.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
