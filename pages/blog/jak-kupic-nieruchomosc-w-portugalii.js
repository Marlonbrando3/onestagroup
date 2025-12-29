import React from "react";
import Head from "next/head";
import Script from "next/script";
import ContactFormBlogPost from "../../components/ContactFormBlogPost";
import Header from "../../components/Header";
import HeaderBlog from "../../components/HeaderBlog";
import HeaderBlogPost from "../../components/HeaderBlogPost";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function BlogPost() {
  const temat = "Jak kupić nieruchomość w Portugalii? Pigułka";

  return (
    <>
      <Head>
        <title>
          Jak kupić nieruchomość w Portugalii?Pigułka - Onesta Group
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
      </Head>
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>
      <HeaderBlogPost temat={temat} />
      <div className="lg:px-40 px-4 pt-24 leading-7 tracking-normal">
        Proces zakupu nieruchomości w Portugalii dla obywatela innego kraju UE
        zazwyczaj składa się z następujących 6 kroków:
        <div className="border my-10 px-2 lg:w-2/3 w-full">
          <p className="py-2 font-bold text-xl">Spis treści:</p>
          <p className="py-1">
            1. Znalezienie odpowiedniej nieruchomości w Portugalii
          </p>
          <p className="py-1">
            2. Negocjowanie warunków zakupu nieruchomości w Portugalii.
          </p>
          <p className="py-1">3. Podpisanie umowy przedwstępnej</p>
          <p className="py-1">4. Przygotowanie dokumentów</p>
          <p className="py-1">
            5. Finalizacja transakcji i podpisanie aktu notarialnego. Podatki
          </p>
          <p className="py-1">6. Rejestracja nieruchomości w Portugalii</p>
          <p className="py-1">7. Zagrożenia.</p>
        </div>
        <br></br>
        <br></br>
        <b>1. Znalezienie odpowiedniej nieruchomości w Portugalii</b>. <br></br>
        Pierwszym krokiem w procesie zakupu nieruchomości w Portugalii jest
        wyszukanie odpowiedniego mieszkania lub domu. Można skorzystać z usług
        agencji nieruchomości lub przeglądać oferty na stronach internetowych.
        Warto zastanowić się, jakie wymagania i preferencje ma się co do
        nieruchomości, takie jak lokalizacja, liczba pokoi, liczba łazienek,
        metraż, stan techniczny, odległość od morza cena itp.<br></br>
        Jeśli celem jest głównie wynajem i zakup niruchomości w Portugalii ma
        mieć charakter inwestycyjny to staramy się aby ingerencja w obiekt z
        rynkiu wtórnego była jak najmniejsza. Pomijam tutaj samo wyposażanie
        (choć to również ważny aspekt) natomiast stan techniczny jest bardzo
        istotny, ponieważ nie wpływa jedynie na potencjalne koszta ale również
        awarie nie zaskoczą nas tak bardzo w np. w okresie wysokiego seznu w
        którym wynajem jest najkorzystniejszy. Po znalezieniu kilku
        potencjalnych opcji, warto umówić się na wizytę w nieruchomości tzw.
        prezentację neiruchomości, aby móc ją obejrzeć osobiście i poznać
        dokładniej. Zawsze warto wraz z agencją wybrać kilka nieruchomości lub
        ustalić jasne kryteria w których się poruszamy np. min. 2 lazienki i
        widok na morze. Warto zwrócić uwagę na infrastrukturę w okolicy,
        odległość do sklepów, szkół i innych miejsc użyteczności publicznej, a
        także na możliwość wynajmu (ceny np. na portalu Booking), jeśli nie
        planuje się mieszkać na stałe w Portugalii. Jeśli znaleziona
        nieruchomość odpowiada naszym wymaganiom i budżetowi, warto przejść do
        kolejnego kroku, czyli negocjacji warunków zakupu.
        <br></br>
        <br></br>
        <b>2. Negocjowanie warunków zakupu</b>. <br></br>
        Po znalezieniu odpowiedniej nieruchomości, następnym krokiem jest
        negocjowanie warunków zakupu. W Portugalii wiele nieruchomości jest
        sprzedawanych przez pośredników, którzy są w stanie pomóc w negocjowaniu
        cen i warunków. Warto wtedy dokładnie zapoznać się z ofertą, porównać ją
        z innymi nieruchomościami na rynku i zdecydować, ile jesteśmy w stanie
        zapłacić za nieruchomość.<br></br>
        Ważnym aspektem jest także poznanie kosztów związanych z zakupem
        nieruchomości w Portugalii, takich jak podatki, opłaty notarialne,
        koszty pośrednictwa i ewentualne inne opłaty (o czym niżej). <br></br>
        Należy także upewnić się, czy sprzedawca ma wszystkie dokumenty i
        pozwolenia na sprzedaż nieruchomości oraz czy nieruchomość nie jest
        obciążona jakimiś długami czy problemami prawnymi. Jeśli uda się
        wynegocjować satysfakcjonujące warunki, warto przejść do kolejnego
        kroku, czyli podpisania umowy przedwstępnej.
        <br></br>
        <br></br>
        <b>3. Podpisanie umowy przedwstępnej</b>. <br></br>
        Po uzgodnieniu warunków zakupu nieruchomości, następnym krokiem jest
        podpisanie umowy przedwstępnej (Contrato de Promessa de Compra e Venda).
        Jest to ważny dokument, który określa podstawowe warunki transakcji,
        takie jak cena, termin płatności, opis nieruchomości, prawa i obowiązki
        stron, itp. Umowa ta zazwyczaj wymaga wpłacenia zaliczki, która wynosi
        zazwyczaj około 10% wartości nieruchomości. Zaliczka ta ma na celu
        zapewnienie sprzedawcy, że kupujący jest poważnym zainteresowanym kupnem
        nieruchomości. W przypadku rezygnacji z transakcji przez kupującego,
        zaliczka może zostać utracona. Warto przed podpisaniem umowy
        przedwstępnej skonsultować ją z prawnikiem lub doradcą, który może pomóc
        w zrozumieniu jej zawartości oraz w identyfikacji potencjalnych ryzyk
        związanych z transakcją.
        <br></br>
        <br></br>
        <b>4. Przygotowanie dokumentów</b>.<br></br>
        To kluczowy etap procesu zakupu nieruchomości w Portugalii dla obywatela
        innego kraju UE. Wymagane dokumenty mogą się różnić w zależności od
        rodzaju nieruchomości, lokalizacji i innych czynników. Poniżej
        przedstawiam kilka najważniejszych dokumentów, które powinieneś
        przygotować przed podpisaniem aktu notarialnego:<br></br>•{" "}
        <b>Numer identyfikacji podatkowej (NIF)</b> - NIF to numer, który jest
        przypisany każdej osobie, która ma obowiązek płacić podatki w
        Portugalii. Bez tego numeru nie będziesz mógł dokonać zakupu
        nieruchomości.<br></br>• <b>Dowód tożsamości</b> - musisz dostarczyć
        ważny dokument tożsamości, takie jak paszport lub dowód osobisty, aby
        potwierdzić swoją tożsamość.
        <br></br>• <b>Dokumenty potwierdzające źródło dochodów</b> - jeśli
        chcesz skorzystać z kredytu hipotecznego, musisz dostarczyć dokumenty
        potwierdzające Twoje źródło dochodów.
        <br></br>• <b>Potwierdzenie stanu cywilnego</b> - jeśli jesteś żonaty
        lub miałeś wcześniej małżeństwo, musisz dostarczyć dokumenty
        potwierdzające Twój stan cywilny, takie jak akt małżeństwa lub rozwodu.
        <br></br>• <b>Dokumenty dotyczące nieruchomości</b> - przed dokonaniem
        zakupu, musisz otrzymać dokumenty dotyczące nieruchomości, takie jak akt
        własności, dowód rejestracyjny, plan zagospodarowania przestrzennego czy
        pozwolenie na budowę.
        <br></br>
        <br></br>
        Wszystkie dokumenty powinny być w języku portugalskim lub przetłumaczone
        na ten język przez tłumacza przysięgłego. <br></br>Przygotowanie
        dokumentów może zająć trochę czasu, dlatego warto zacząć je zbierać jak
        najwcześniej, aby uniknąć opóźnień w procesie zakupu nieruchomości w
        Portugalii.
        <br></br>
        <br></br>
        <b>5. Finalizacja transakcji i podpisanie aktu notarialnego</b>.
        <br></br>
        Po zakończeniu procesu sprawdzania prawnego i finansowego nieruchomości,
        kupujący i sprzedający spotykają się w kancelarii notarialnej, aby
        dokonać finalizacji transakcji i podpisania aktu notarialnego
        (Escritura).<br></br>
        Akt notarialny jest ważnym dokumentem, potwierdzającym, że transakcja
        została dokonana i przekazanie nieruchomości nastąpiło. W przypadku
        zakupu nieruchomości przez obcokrajowców, konieczne jest posiadanie
        numeru NIF (portugalski numer identyfikacyjny podatnika). Można go
        uzyskać w urzędzie skarbowym przed podpisaniem aktu notarialnego lub za
        pośrednictwem pełnomocnika. Podczas finalizacji transakcji kupujący
        płaci sprzedającemu pozostałą kwotę za nieruchomość, a także koszty
        notarialne, podatkowe i prowizję dla agencji nieruchomości (jeśli taka
        była zaangażowana w proces). Sprzedający podpisuje akt notarialny i
        przekazuje klucze do nieruchomości kupującemu.<br></br>
        Po podpisaniu aktu notarialnego, konieczne jest zarejestrowanie
        transakcji w miejscowym urzędzie rejestracji nieruchomości. Kupujący
        musi także pamiętać o opłaceniu wszelkich podatków i kosztów związanych
        z zakupem nieruchomości, takich jak podatek od nieruchomości (IMI) i
        podatek od nabycia nieruchomości (IMT).
        <br></br>
        <br></br>
        <b>5.1. Podatek IMI (Imposto Municipal sobre Imóveis)</b>. <br></br>W
        Portugalii zależy od wartości nieruchomości i ustalany jest na poziomie
        lokalnym przez władze gminne. Stawki podatku są różne w zależności od
        lokalizacji nieruchomości, jej przeznaczenia (np. mieszkalne,
        komercyjne) oraz powierzchni.<br></br>
        Podatek IMI jest pobierany rocznie i wynosi zwykle od 0,3% do 0,45%
        wartości nieruchomości. Istnieją jednak wyjątki, w których stawki
        podatku mogą być wyższe, np. w przypadku nieruchomości o wartości
        powyżej 1,5 miliona euro. Warto zaznaczyć, że nieruchomości przeznaczone
        do wynajmu podlegają wyższej stawce podatku IMI. Jeśli nieruchomość jest
        wykorzystywana jako pierwszy dom stały kupującego, to może ona
        kwalifikować się do zniżki podatku IMI. Ostateczna kwota podatku IMI,
        którą trzeba zapłacić, jest obliczana na podstawie wartości
        nieruchomości określonej w umowie lub ocenie podatkowej przeprowadzonej
        przez władze podatkowe.
        <br></br>
        <br></br>
        <b>
          5.2. Podatek IMT (Imposto Municipal sobre as Transmissões Onerosas de
          Imóveis)
        </b>
        . <br></br>W Portugalii jest podatkiem od nabycia nieruchomości. Jest to
        podatek jednorazowy, który trzeba zapłacić w momencie zakupu
        nieruchomości. Stawki podatku IMT są uzależnione od wartości
        nieruchomości i mogą się różnić w zależności od lokalizacji
        nieruchomości, jej przeznaczenia (np. mieszkalne, komercyjne) oraz od
        statusu nabywcy (czy jest on rezydentem czy nie). Obecnie stawki podatku
        IMT w Portugalii wynoszą od 0,8% do 6,5% wartości nieruchomości. Jednak
        dla niektórych kategorii nieruchomości (np. gruntów rolnych) oraz dla
        niektórych grup nabywców (np. rodzin wielodzietnych) stawki podatku mogą
        być niższe.
        <br></br>W przypadku zakupu nieruchomości na cele mieszkalne, nabywcy
        zwykle mają prawo do zniżki podatku IMT, której wysokość zależy od
        wartości nieruchomości. Przykładowo, dla nieruchomości o wartości
        poniżej 92 407 euro zniżka wynosi 50% podatku IMT. Warto zaznaczyć, że
        podatek IMT należy wpłacić w ciągu 30 dni od daty nabycia nieruchomości,
        w przeciwnym razie naliczane są odsetki.
        <br></br>
        <br></br>
        <b>6. Zarejestrowanie nieruchomości</b>. <br></br>• Po zakupie
        nieruchomości w Portugalii, konieczne jest dokonanie rejestracji
        nieruchomości w miejscowym rejestrze nieruchomości (Conservatória do
        Registo Predial). Proces ten może być skomplikowany i różni się w
        zależności od rodzaju,nieruchomości, ale ogólnie składa się z
        następujących kroków:
        <br></br>• <b>Zgromadzenie dokumentów:</b> Przed rejestracją
        nieruchomości, konieczne jest zgromadzenie odpowiednich dokumentów, w
        tym aktu notarialnego sprzedaży, oświadczenia podatkowego oraz
        zaświadczenia o uregulowaniu podatków i opłat związanych z
        nieruchomością,
        <br></br>• <b>Uiszczenie opłat:</b> Po zebraniu wymaganych dokumentów,
        należy uiszczyć opłatę za rejestrację nieruchomości w miejscowym
        rejestrze nieruchomości,
        <br></br>• <b>Wizyta w rejestrze nieruchomości:</b> Następnym krokiem
        jest wizyta w miejscowym rejestrze nieruchomości w celu złożenia
        wymaganych dokumentów i uiszczenia opłat. Rejestr nieruchomości
        zweryfikuje poprawność dokumentów i wprowadzi informacje o nieruchomości
        do swojej bazy danych,
        <br></br>• <b>Otrzymanie zaświadczenia:</b> Po zarejestrowaniu
        nieruchomości, właściciel otrzyma zaświadczenie potwierdzające jej
        rejestrację,
        <br></br>• Warto zauważyć, że{" "}
        <b>proces rejestracji nieruchomości w Portugalii</b> może trwać kilka
        tygodni lub nawet miesięcy, więc ważne jest, aby planować go z
        wyprzedzeniem i dokładnie zapoznać się z wymaganiami dotyczącymi
        rejestracji,
        <br></br>
        <br></br>
        <b>7. Zagrożenia</b>.<br></br>Podobnie jak w innych krajach, zakup
        nieruchomości w Portugalii wiąże się z pewnymi ryzykami i potencjalnymi
        zagrożeniami. Niektóre z najczęstszych problemów, na jakie należy
        uważać, to:<br></br>• <b>Nieprawidłowości prawne:</b> Należy upewnić
        się, że nieruchomość, którą zamierzasz kupić, jest wolna od wszelkich
        obciążeń i że nie ma żadnych nieprawidłowości prawnych, które mogłyby
        wpłynąć na Twoje prawo własności.<br></br>• <b>Ukryte koszty:</b> Poza
        podstawową ceną nieruchomości, może istnieć wiele innych kosztów
        związanych z zakupem, takich jak opłaty notarialne, podatki, koszty
        przepisów, opłaty za pośrednictwo itp. Należy upewnić się, że masz pełną
        świadomość wszystkich kosztów związanych z zakupem.<br></br>•{" "}
        <b>Niskiej jakości budowa:</b> Należy upewnić się, że budynek i
        nieruchomość są w dobrym stanie i że nie ma ukrytych problemów, takich
        jak uszkodzenia strukturalne, problemy z instalacjami, wilgoć lub
        problemy z izolacją.<br></br>• <b>Zmiany w przepisach podatkowych:</b>{" "}
        Podobnie jak w innych krajach, przepisy podatkowe w Portugalii mogą ulec
        zmianie, co może wpłynąć na Twoje koszty podatkowe. Należy upewnić się,
        że jesteś na bieżąco z obowiązującymi przepisami podatkowymi i zawsze
        zasięgnij porady fachowców.<br></br>• <b>Ryzyko rynkowe:</b>{" "}
        Nieruchomości mogą ulec zmianie w wartości, co może wpłynąć na Twoją
        inwestycję. Warto upewnić się, że podejmujesz dobrą decyzję
        inwestycyjną, biorąc pod uwagę przyszłe trendy rynkowe.<br></br>
        Podsumowując, zakup nieruchomości w Portugalii może być korzystną
        inwestycją, ale wymaga dokładnego zapoznania się z ryzykami i
        potencjalnymi zagrożeniami oraz uzyskania porady specjalistów, np.
        poprzez uzupełnienie poniższego formularza<br></br>
        <br></br>
        <br></br>
      </div>
      <ContactFormBlogPost temat="Jak kupić nieruchomość w Portugalii" />
    </>
  );
}
