import Link from "next/link";
import type { ReactNode } from "react";
import {
  ALICANTE_DESTINATIONS,
  alicanteDestinationHref,
} from "@/lib/alicanteContent";

const linkClass =
  "font-semibold text-[#75582e] underline decoration-[#b58b4c] underline-offset-4 transition-colors hover:text-[#182334]";

function ContentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-7">{children}</div>
    </section>
  );
}

function DestinationCards({ neighbours = false }: { neighbours?: boolean }) {
  const destinations = ALICANTE_DESTINATIONS.filter((item) =>
    neighbours ? item.area !== "province" : item.area === "province",
  );
  return (
    <ul
      className={`grid list-none gap-4 p-0 pt-3 sm:grid-cols-2 ${neighbours ? "" : "lg:grid-cols-3"}`}
    >
      {destinations.map((destination) => (
        <li key={destination.name} className="flex">
          <Link
            data-alicante-destination={destination.name}
            href={alicanteDestinationHref(destination)}
            prefetch={false}
            className="group flex w-full flex-col rounded-[18px] border border-[#e4d9c7] bg-[#f7f3ec] p-6 transition-colors hover:border-[#b58b4c] hover:bg-[#f0e9de] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75582e]"
          >
            {neighbours && (
              <span className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#75582e]">
                {destination.area === "valencia"
                  ? "Prowincja Walencja"
                  : "Region Murcji"}
              </span>
            )}
            <h3 className="text-xl font-semibold leading-tight text-[#182334]">
              {destination.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#4b586a]">
              {destination.description}
            </p>
            <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-semibold text-[#75582e]">
              {!destination.locationIds.length
                ? "Zapytaj o oferty"
                : destination.name === "Alicante"
                  ? "Zobacz oferty w mieście"
                  : "Zobacz nieruchomości"}
              <span
                aria-hidden="true"
                className="text-lg transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const faqs = [
  {
    question: "Czy nieruchomości Alicante oznaczają miasto czy całą prowincję?",
    answer:
      "W ogłoszeniach i wyszukiwaniach spotkasz oba znaczenia. Alicante to miasto oraz nazwa prowincji obejmującej między innymi Torrevieja, Benidorm, Altea i Dénia. Oferty nad tym poradnikiem dotyczą miasta Alicante. Kafelki pozwalają przejść do pozostałych lokalizacji, a katalog Costa Blanca poszerzyć poszukiwania na wybrzeże.",
  },
  {
    question:
      "Gdzie szukać mieszkania na sprzedaż w Alicante z widokiem na morze?",
    answer:
      "W samym mieście porównaj okolice Postiguet, Albufereta i Playa de San Juan. Jeśli bierzesz pod uwagę prowincję, sprawdź także nadmorskie adresy w Santa Pola, Villajoyosa, Calpe czy Torrevieja. Widok trzeba potwierdzić dla konkretnego lokalu: piętro i ustawienie okien są równie ważne jak nazwa miejscowości.",
  },
  {
    question: "Jak porównywać ceny mieszkań w Alicante?",
    answer:
      "Zestawiaj oferty z podobnej lokalizacji i o zbliżonym stanie, metrażu oraz wyposażeniu. Oddziel powierzchnię wnętrza od tarasu i sprawdź, czy parking jest w cenie. Do budżetu zakupu dodaj koszty transakcji, przygotowania mieszkania i późniejszego utrzymania. Aktualne ceny znajdziesz przy poszczególnych ogłoszeniach.",
  },
  {
    question: "Czy tanie mieszkanie w Alicante do remontu to dobry wybór?",
    answer:
      "Może odpowiadać osobie, która chce urządzić wnętrze po swojemu i ma budżet oraz czas na prace. Przed decyzją oceń stan techniczny z fachowcem, zamów wycenę remontu i sprawdź planowane prace w budynku. Oszczędność na cenie lokalu warto porównać z pełnym kosztem doprowadzenia go do oczekiwanego standardu.",
  },
  {
    question: "Czy znajdę tu domy i apartamenty w Alicante do wynajęcia?",
    answer:
      "Ta strona prezentuje sprzedaż nieruchomości. Jeżeli planujesz zakup z myślą o późniejszym wynajmie, opowiedz nam o tym przed wyborem ofert. Inne cechy będą ważne przy pobytach wakacyjnych, inne przy wynajmie długoterminowym lub łączeniu najmu z własnymi pobytami.",
  },
  {
    question: "Czy zakup w Alicante można przeprowadzić z obsługą po polsku?",
    answer:
      "Tak. W Onesta po polsku omawiamy potrzeby, porównujemy propozycje i wyjaśniamy kolejne etapy zakupu. Pomagamy zorganizować prezentacje, kontakt ze sprzedającymi i formalności. Na początku ustalamy, czy interesuje Cię samo miasto Alicante, czy również inne miejscowości prowincji.",
  },
];

export default function AlicanteCatalogContent({
  onConsultation,
}: {
  onConsultation?: () => void;
}) {
  return (
    <section
      id="alicante-przewodnik"
      aria-label="Poradnik zakupu nieruchomości w Alicante i prowincji"
      className="mx-auto w-[90vw] max-w-[1180px] py-12 text-[#263244] md:py-16"
    >
      <div className="space-y-16">
        <ContentSection
          id="alicante-miasto-prowincja"
          title="Nieruchomości Alicante — miasto czy cała prowincja?"
        >
          <p className="max-w-4xl">
            Szukając nieruchomości w Alicante, możesz mieć na myśli mieszkanie w
            mieście albo dom w jednej z miejscowości całej prowincji. To ważna
            różnica: apartament przy miejskiej plaży, willa w Moraira i
            mieszkanie w Torrevieja oznaczają inne otoczenie, dojazdy i sposób
            spędzania czasu. Warto więc zacząć od ustalenia obszaru poszukiwań.
          </p>
          <p className="max-w-4xl">
            <strong>Oferty powyżej dotyczą miasta Alicante.</strong> Jeśli
            interesuje Cię szerszy obszar, poniżej znajdziesz główne miasta i
            miejscowości prowincji z krótkimi opisami i przejściem do ofert. Jej
            wybrzeże to Costa Blanca; do prowincji należą również lokalizacje w
            głębi lądu, dlatego sam adres „Alicante” nie potwierdza bliskości
            morza.
          </p>
          <p className="max-w-4xl">
            Rozważasz także inne regiony? Zobacz wszystkie nasze{" "}
            <Link href="/nieruchomosci/hiszpania" className={linkClass}>
              nieruchomości w Hiszpanii
            </Link>{" "}
            i porównaj Alicante z pozostałymi kierunkami. Przy poszukiwaniu domu
            na tym wybrzeżu pomocny będzie również katalog{" "}
            <Link
              href="/nieruchomosci/hiszpania/costa-blanca"
              className={linkClass}
            >
              nieruchomości na Costa Blanca
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection
          id="alicante-miejscowosci"
          title="Gdzie kupić nieruchomość w prowincji Alicante?"
        >
          <p className="max-w-4xl">
            Wybierz miejscowości pasujące do Twojego planu: życie w mieście,
            wakacje przy plaży lub dom z większą przestrzenią na zewnątrz.
            Kafelki obejmują również popularne części gmin i urbanizacje, takie
            jak Orihuela Costa, Ciudad Quesada czy Mil Palmeras. Porównując je,
            sprawdzaj konkretny adres i codzienne trasy.
          </p>
          <DestinationCards />
        </ContentSection>

        <ContentSection
          id="alicante-sasiednie-kierunki"
          title="Sąsiednie kierunki: prowincja Walencja i region Murcji"
        >
          <p className="max-w-4xl">
            Jeśli poszerzasz poszukiwania poza Alicante, możesz uwzględnić także
            poniższe miejscowości.{" "}
            <strong>
              Gandía i Oliva leżą w prowincji Walencja, a Murcja i San Pedro del
              Pinatar w regionie Murcji.
            </strong>{" "}
            Są alternatywami dla Alicante, z własnymi lokalizacjami i warunkami
            codziennego życia. W przypadku Gandíi zapytaj nas o możliwość
            przygotowania propozycji.
          </p>
          <DestinationCards neighbours />
        </ContentSection>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContentSection
            id="alicante-mieszkania"
            title="Mieszkania i apartamenty na sprzedaż w Alicante"
          >
            <p>
              Mieszkania w Alicante warto wybierać według sposobu użytkowania.
              Przy przeprowadzce liczą się codzienne zakupy, komunikacja,
              przestrzeń do pracy i wygodny układ pomieszczeń. Przy krótszych
              pobytach większe znaczenie mogą mieć taras, dojście na plażę i
              łatwość pozostawienia lokalu pod opieką podczas nieobecności.
            </p>
            <p>
              W samym mieście porównaj centrum i okolice Postiguet z Albufereta
              oraz Playa de San Juan. Apartamenty na sprzedaż w prowincji
              Alicante pozwalają z kolei wybierać między większymi miastami,
              nadmorskimi miejscowościami i osiedlami poza centrum. Sprawdź
              windę, nasłonecznienie i otoczenie budynku także o innej porze niż
              prezentacja.
            </p>
          </ContentSection>

          <ContentSection
            id="alicante-widok-na-morze"
            title="Mieszkanie w Alicante z widokiem na morze"
          >
            <p>
              Widok na morze, pierwsza linia zabudowy i bliskość plaży opisują
              różne cechy. Lokal na wzgórzu może mieć szeroką panoramę, lecz
              wymagać dojazdu nad wodę. Mieszkanie kilka kroków od plaży może
              natomiast wychodzić na wewnętrzne patio lub sąsiedni budynek.
            </p>
            <p>
              Poproś o zdjęcia z okien i tarasu konkretnego apartamentu, sprawdź
              piętro oraz orientację. Obejrzyj trasę pieszą do plaży, schody i
              przejścia przez ulicę. W nowej inwestycji porównaj usytuowanie
              lokalu z planem zabudowy; widok na wizualizacji całego osiedla nie
              musi odpowiadać wybranemu mieszkaniu.
            </p>
          </ContentSection>
        </div>

        <ContentSection
          id="alicante-domy"
          title="Domy na sprzedaż w Alicante — ogród, basen i własna przestrzeń"
        >
          <p className="max-w-4xl">
            Szukając domu w Alicante, warto uwzględnić całą prowincję. Dom
            szeregowy, bungalow i wolnostojąca willa różnią się prywatnością,
            układem i obowiązkami właściciela. Porównaj nadmorskie lokalizacje,
            takie jak Altea, Benissa czy Moraira, z Ciudad Quesada i San Miguel
            de Salinas w głębi lądu. Wybór zależy od tego, jak często chcesz
            korzystać z plaży i czy planujesz codzienne przejazdy samochodem.
          </p>
          <p className="max-w-4xl">
            Przy domu z basenem ustal, czy basen jest prywatny, czy wspólny dla
            osiedla. Oceń wielkość ogrodu, schody, dostęp do garażu i koszty
            opieki podczas nieobecności. Jeśli interesują Cię luksusowe
            nieruchomości w Alicante, sprawdź przede wszystkim jakość wykonania,
            prywatność, otoczenie oraz rozkład domu. Sama etykieta „premium” nie
            zastępuje oceny konkretnej oferty.
          </p>
        </ContentSection>

        <ContentSection
          id="alicante-nowe-mieszkania"
          title="Nowe mieszkania w Alicante czy nieruchomości z rynku wtórnego?"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-[#182334]">
                Nowy apartament od dewelopera
              </h3>
              <p className="mt-3">
                Przy nowym mieszkaniu porównaj standard przekazania, plan lokalu
                i termin odbioru. Ustal, czy cena zawiera miejsce parkingowe,
                klimatyzację, sprzęt kuchenny i wyposażenie łazienek. Osobno
                oceń części wspólne oraz koszty umeblowania. Zestawiaj konkretne
                lokale, ponieważ cena reklamująca inwestycję może dotyczyć
                innego piętra lub układu niż ten, którego szukasz.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#182334]">
                Rynek wtórny i mieszkanie do remontu
              </h3>
              <p className="mt-3">
                Istniejący lokal pozwala ocenić rzeczywiste światło, widok i
                sąsiedztwo. Przy nieruchomości w Alicante do remontu sprawdź
                instalacje, stolarkę, ślady wilgoci i stan części wspólnych.
                Zanim porównasz ją z gotowym apartamentem, uzyskaj wycenę prac i
                oszacuj czas potrzebny na przygotowanie mieszkania do
                użytkowania.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection
          id="alicante-ceny"
          title="Ceny nieruchomości w Alicante i poszukiwanie tańszych ofert"
        >
          <p className="max-w-4xl">
            Ceny mieszkań w Alicante zależą od konkretnego rynku: centrum
            miasta, adres przy plaży i dom w innej miejscowości prowincji
            wymagają osobnego porównania. Korzystaj z cen widocznych przy
            aktualnych ogłoszeniach. Zestawiaj podobny standard, metraż i
            położenie, uwzględniając taras, windę, parking oraz stan budynku.
          </p>
          <p className="max-w-4xl">
            Jeśli szukasz taniego mieszkania w Alicante lub tańszego domu w
            prowincji, rozważ mniejszy metraż, rynek wtórny i lokalizacje dalej
            od morza. Niższa cena może oznaczać kompromis w kwestii dojazdów,
            windy czy remontu. Policz pełny budżet: cenę nieruchomości, koszty
            transakcji, prace i wyposażenie. Następnie sprawdź stałe opłaty
            wspólnoty oraz wydatki związane z utrzymaniem lokalu.
          </p>
          <p>
            W przygotowaniu budżetu pomoże poradnik:{" "}
            <Link
              href="/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca"
              className={linkClass}
            >
              koszty zakupu nieruchomości w Hiszpanii
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection
          id="alicante-pod-wynajem"
          title="Zakup apartamentu lub domu w Alicante pod wynajem"
        >
          <p className="max-w-4xl">
            Planujesz łączyć własne wakacje z wynajmem mieszkania w Alicante?
            Określ terminy, w których chcesz korzystać z lokalu, i sposób
            organizacji jego obsługi. Wynajem wakacyjny, długoterminowy oraz
            zakup na własne potrzeby wymagają innego doboru lokalizacji,
            wyposażenia i budżetu utrzymania.
          </p>
          <p className="max-w-4xl">
            Przed wyborem poproś o sprawdzenie możliwości planowanego najmu dla
            danego adresu. W kalkulacji uwzględnij okresy bez najemców, naprawy,
            sprzątanie i zarządzanie. Duży taras lub widok na morze mogą być
            atutem oferty, ale nie określają jej przyszłych przychodów.
            Przeczytaj, jak możemy pomóc w{" "}
            <Link
              href="/zarzadzanie-nieruchomosciami-w-hiszpanii"
              className={linkClass}
            >
              zarządzaniu nieruchomością w Hiszpanii
            </Link>
            .
          </p>
        </ContentSection>

        <section
          id="alicante-onesta"
          aria-labelledby="alicante-obsluga"
          className="scroll-mt-44 rounded-[18px] bg-[#182334] p-6 text-white md:scroll-mt-28 md:p-10"
        >
          <h2
            id="alicante-obsluga"
            className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl"
          >
            Nieruchomości w Alicante z obsługą po polsku
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 leading-7 text-white/90">
            <p>
              Porównujesz polskie biura nieruchomości w Alicante? Zwróć uwagę na
              to, czy doradca pomaga wybrać lokalizację, wyjaśnia różnice między
              ofertami i ustala pełny budżet zakupu. W Onesta zaczynamy od
              Twoich planów, a następnie wspólnie zawężamy obszar poszukiwań do
              miasta Alicante lub wybranych miejscowości prowincji.
            </p>
            <p>
              Pomagamy dobrać oferty, organizujemy prezentacje, kontakt z
              właścicielami i deweloperami oraz formalności związane z zakupem.
              Kolejne etapy omawiamy po polsku. Podaj budżet, typ nieruchomości
              i miejscowości, które Cię interesują — także wtedy, gdy w katalogu
              nie widzisz jeszcze odpowiedniej propozycji.
            </p>
          </div>
          {onConsultation && (
            <button
              type="button"
              onClick={onConsultation}
              className="mt-7 rounded-md bg-[#e2c477] px-6 py-3 font-semibold text-[#182334] transition-colors hover:bg-[#eed799] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Porozmawiajmy o nieruchomości w Alicante
            </button>
          )}
        </section>

        <ContentSection
          id="alicante-faq"
          title="Nieruchomości Alicante — pytania przed zakupem"
        >
          <div className="pt-2">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                name="alicante-property-faq"
                className="group border-b border-[#dfd2bd] first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-semibold leading-snug text-[#182334] md:text-xl">
                    {question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9aa63] text-xl text-[#182334]"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="max-w-4xl pb-6 text-[#4b586a] md:pr-14">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </ContentSection>
      </div>
    </section>
  );
}
