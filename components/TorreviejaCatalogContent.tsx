import Link from "next/link";
import type { ReactNode } from "react";

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

const neighbourhoods = [
  {
    name: "Centrum i Playa del Cura",
    description:
      "Punkt wyjścia dla osób, które chcą mieć plażę, sklepy i restauracje w zasięgu spaceru. Przy oglądaniu mieszkania oceń hałas od ulicy, dostępność parkingu i windę. Sprawdź też, czy taras wychodzi na otwartą przestrzeń, czy na sąsiedni budynek.",
  },
  {
    name: "Playa de los Locos",
    description:
      "Lokalizacja do rozważenia, jeśli najważniejsze są pobyty nad morzem. Porównaj mieszkania przy samej plaży z tymi kilka ulic dalej. Widok z salonu, nasłonecznienie tarasu i wygodne dojście do wody mogą mieć większe znaczenie niż niewielka różnica metrażu.",
  },
  {
    name: "La Mata",
    description:
      "Nadmorska część Torrevieja z długą piaszczystą plażą. Warto ją uwzględnić przy poszukiwaniu apartamentu na wakacje i dłuższe pobyty. Dla konkretnego adresu sprawdź drogę do plaży, położenie względem głównych ulic oraz odległość od sklepów i przystanków.",
  },
  {
    name: "Los Balcones",
    description:
      "Osiedle w głębi lądu, które warto porównać z nadmorskimi częściami miasta, szukając domu, ogrodu lub większej prywatności. Oceń codzienne dojazdy i położenie względem usług. Widok na lagunę oraz bliskość morza to dwa różne atuty nieruchomości.",
  },
];

const faqs = [
  {
    question: "Jak znaleźć mieszkanie na sprzedaż w Torrevieja?",
    answer:
      "Zacznij od ofert powyżej i określ budżet, liczbę sypialni oraz preferowaną odległość od morza. Zapisz propozycje, które pasują do Twoich planów, a następnie porównaj dokładne adresy, stan budynków i koszty utrzymania. Onesta pomoże zawęzić wybór i zorganizować prezentacje.",
  },
  {
    question: "Gdzie szukać tanich mieszkań w Torrevieja?",
    answer:
      "Warto porównać mniejsze lokale z rynku wtórnego, mieszkania do odświeżenia oraz adresy oddalone od pierwszej linii morza. Niższa cena może wiązać się z brakiem windy, mniejszym tarasem lub potrzebą remontu. Oceniaj łączny budżet potrzebny do zamieszkania, a nie samą cenę ogłoszenia.",
  },
  {
    question: "Rynek wtórny czy nowy apartament w Torrevieja?",
    answer:
      "Rynek wtórny pozwala obejrzeć istniejące mieszkanie i jego otoczenie. Nowa inwestycja może odpowiadać osobom szukającym współczesnego układu, nowych instalacji i części wspólnych. Porównaj lokalizację, standard przekazania, termin dostępności oraz koszty wyposażenia obu ofert.",
  },
  {
    question:
      "Czy dom na sprzedaż w Torrevieja musi być droższy od apartamentu?",
    answer:
      "Nie musi. Dom szeregowy dalej od plaży może kosztować mniej niż apartament z widokiem na morze. Znaczenie mają adres, stan techniczny, powierzchnia i wielkość działki. W budżecie domu uwzględnij także utrzymanie ogrodu, tarasów i ewentualnego basenu.",
  },
  {
    question: "Czy na tej stronie znajdę mieszkanie do wynajęcia w Torrevieja?",
    answer:
      "Ten katalog prezentuje nieruchomości na sprzedaż. Jeśli chcesz kupić mieszkanie z myślą o późniejszym wynajmie, poinformuj nas o tym przy wyborze ofert. Zakup na własne pobyty, wynajem wakacyjny i wynajem długoterminowy wymagają innego doboru lokalizacji oraz wyposażenia.",
  },
  {
    question: "Czy Onesta pomaga kupić nieruchomość w Torrevieja po polsku?",
    answer:
      "Tak. Po polsku omawiamy potrzeby, budżet i wybrane oferty, organizujemy prezentacje oraz pomagamy przejść przez formalności związane z zakupem. Możemy również pomóc w organizacji wyposażenia nieruchomości i jej późniejszego zarządzania; zakres ustalamy indywidualnie.",
  },
];

export default function TorreviejaCatalogContent({
  onConsultation,
}: {
  onConsultation?: () => void;
}) {
  return (
    <section
      id="torrevieja-przewodnik"
      aria-label="Poradnik zakupu nieruchomości w Torrevieja"
      className="mx-auto w-[90vw] max-w-[1180px] py-12 text-[#263244] md:py-16"
    >
      <div className="space-y-16">
        <ContentSection
          id="torrevieja-nieruchomosci"
          title="Nieruchomości w Torrevieja — znajdź swoje miejsce na Costa Blanca"
        >
          <p className="max-w-4xl">
            Szukasz nieruchomości w Torrevieja na wakacje, przeprowadzkę lub
            dłuższe pobyty w Hiszpanii? Zacznij od tego, jak chcesz spędzać tu
            czas. Mieszkanie blisko miejskiej plaży ułatwi codzienne wyjścia nad
            morze, apartament na osiedlu z basenem pozwoli odpoczywać na
            miejscu, a dom z ogrodem zapewni przestrzeń dla rodziny. W ofertach
            powyżej możesz porównać ceny, lokalizacje i parametry dostępnych
            nieruchomości.
          </p>
          <p className="max-w-4xl">
            Torrevieja leży na Costa Blanca, w prowincji Alicante. Jej
            poszczególne części różnią się zabudową i codziennymi dojazdami,
            dlatego wybór warto oprzeć na konkretnym adresie. Jeśli rozważasz
            także inne miejscowości, sprawdź nasze{" "}
            <Link href="/nieruchomosci/hiszpania" className={linkClass}>
              nieruchomości w Hiszpanii
            </Link>{" "}
            i porównaj Torrevieja z pozostałymi lokalizacjami na wybrzeżu.
          </p>
        </ContentSection>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContentSection
            id="torrevieja-mieszkania"
            title="Mieszkania i apartamenty na sprzedaż w Torrevieja"
          >
            <p>
              Mieszkania na sprzedaż w Torrevieja warto porównywać według
              układu, piętra i otoczenia. Na krótkie pobyty może wystarczyć
              kompaktowy lokal blisko plaży. Przy dłuższym pobycie większego
              znaczenia nabierają osobna sypialnia, miejsce do przechowywania,
              światło dzienne i dostęp do codziennych usług.
            </p>
            <p>
              Szukając apartamentu z tarasem, basenem lub widokiem na morze,
              sprawdź, co dokładnie obejmuje oferta. Basen może być wspólny dla
              osiedla, parking dodatkowo płatny, a widok na wodę widoczny tylko
              z części tarasu. Nazwa „apartament” sama w sobie nie określa
              standardu — porównaj zdjęcia, plan i wyposażenie.
            </p>
            <p>
              Więcej wskazówek znajdziesz w poradniku:{" "}
              <Link
                href="/blog/torrevieja-apartamenty-na-sprzedaz"
                className={linkClass}
              >
                apartamenty na sprzedaż w Torrevieja
              </Link>
              .
            </p>
          </ContentSection>

          <ContentSection
            id="torrevieja-domy"
            title="Domy na sprzedaż w Torrevieja — od szeregowca po willę"
          >
            <p>
              Domy w Torrevieja to propozycja dla osób, które potrzebują więcej
              przestrzeni, własnego wejścia lub miejsca na zewnątrz. Warto
              porównać dom szeregowy, bungalow i wolnostojącą willę. Każdy z
              tych typów oznacza inny układ pomieszczeń, poziom prywatności oraz
              zakres obowiązków związanych z utrzymaniem.
            </p>
            <p>
              Przy domu z basenem zapytaj, czy jest on prywatny, czy wspólny.
              Sprawdź też powierzchnię działki, schody między kondygnacjami,
              miejsca parkingowe i odległość od sąsiadów. Jeśli szukasz taniego
              domu w Torrevieja, porównaj mniejsze szeregowce i nieruchomości
              wymagające odświeżenia, doliczając prace do budżetu zakupu.
            </p>
          </ContentSection>
        </div>

        <ContentSection
          id="torrevieja-dzielnice"
          title="Gdzie kupić nieruchomość w Torrevieja? Porównaj lokalizacje"
        >
          <p className="max-w-4xl">
            Zanim wybierzesz mieszkanie lub dom, ustal, czy ważniejszy jest
            spacer na plażę, bliskość centrum czy przestrzeń na osiedlu poza
            śródmieściem. Te cztery lokalizacje pomagają zobaczyć różnice między
            poszczególnymi częściami Torrevieja.
          </p>
          <div className="grid gap-5 pt-3 md:grid-cols-2">
            {neighbourhoods.map(({ name, description }) => (
              <article
                key={name}
                className="rounded-[18px] border border-[#e4d9c7] bg-[#f7f3ec] p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold text-[#182334]">{name}</h3>
                <p className="mt-3">{description}</p>
              </article>
            ))}
          </div>
          <p className="max-w-4xl">
            Chcesz poszerzyć obszar poszukiwań? Porównaj również{" "}
            <Link
              href="/nieruchomosci/hiszpania/costa-blanca/guardamar-del-segura"
              className={linkClass}
            >
              nieruchomości w Guardamar del Segura
            </Link>{" "}
            lub przejrzyj wszystkie{" "}
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
          id="torrevieja-rynek-wtorny"
          title="Mieszkania w Torrevieja: rynek wtórny czy pierwotny?"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-[#182334]">
                Gotowe mieszkania z rynku wtórnego
              </h3>
              <p className="mt-3">
                Kupując mieszkanie z rynku wtórnego w Torrevieja, możesz ocenić
                istniejący budynek, rzeczywisty widok i najbliższe otoczenie.
                Zapytaj o stan instalacji, zakres wyposażenia pozostającego w
                cenie oraz planowane remonty części wspólnych. Lokal gotowy do
                oglądania nie zawsze jest gotowy do zamieszkania bez dodatkowych
                wydatków.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#182334]">
                Nowe apartamenty od dewelopera
              </h3>
              <p className="mt-3">
                Przy nowej inwestycji porównaj układ lokalu, standard
                wykończenia i termin przekazania. Ustal, czy cena obejmuje
                klimatyzację, sprzęt kuchenny, parking i komórkę lokatorską.
                Wizualizacje pokazują zamysł inwestycji; podstawą porównania
                powinny być specyfikacja wybranego apartamentu oraz warunki
                przedstawione przez dewelopera.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection
          id="torrevieja-ceny"
          title="Ceny nieruchomości i tanie mieszkania w Torrevieja"
        >
          <p className="max-w-4xl">
            Punktem odniesienia dla budżetu są ceny aktualnych ofert powyżej. Na
            kwotę wpływają między innymi lokalizacja, stan techniczny,
            powierzchnia, taras, winda i widok. Porównanie mieszkania w starszym
            budynku z nowym apartamentem przy morzu wyłącznie według ceny za
            metr kwadratowy nie pokaże wszystkich różnic.
          </p>
          <p className="max-w-4xl">
            Tanie mieszkania w Torrevieja warto oceniać przez całkowity koszt
            przygotowania do użytkowania. Do ceny lokalu dolicz koszty
            transakcji, ewentualny remont i umeblowanie, a osobno zaplanuj
            bieżące opłaty. Poproś o wysokość opłat wspólnotowych oraz
            informacje o zaplanowanych pracach w budynku. Dzięki temu łatwiej
            porównasz tańszy lokal wymagający nakładów z droższym, ale gotowym
            do wprowadzenia.
          </p>
          <p>
            Zobacz, jak przygotować budżet:{" "}
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
          id="torrevieja-wynajem"
          title="Zakup mieszkania w Torrevieja pod wynajem"
        >
          <p className="max-w-4xl">
            Jeśli planujesz wynajem mieszkania w Torrevieja po zakupie, określ
            najpierw, komu i na jak długo chcesz je udostępniać. Przy pobytach
            wakacyjnych znaczenie mogą mieć dojście do plaży, taras i wygodne
            przekazanie kluczy. Przy wynajmie długoterminowym liczą się także
            funkcjonalna kuchnia, przechowywanie, dojazdy i dostęp do usług.
          </p>
          <p className="max-w-4xl">
            Przed wyborem oferty poproś o sprawdzenie możliwości prowadzenia
            planowanego najmu w konkretnym lokalu. W kalkulacji uwzględnij
            okresy bez najemców, utrzymanie, sprzątanie i zarządzanie. Jeśli
            chcesz korzystać z mieszkania również samodzielnie, ustal kalendarz
            własnych pobytów przed szacowaniem przychodów. Zakres wsparcia
            opisujemy na stronie poświęconej{" "}
            <Link
              href="/zarzadzanie-nieruchomosciami-w-hiszpanii"
              className={linkClass}
            >
              zarządzaniu nieruchomościami w Hiszpanii
            </Link>
            .
          </p>
        </ContentSection>

        <section
          aria-labelledby="torrevieja-onesta"
          className="rounded-[18px] bg-[#182334] p-6 text-white md:p-10"
        >
          <h2
            id="torrevieja-onesta"
            className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl"
          >
            Zakup nieruchomości w Torrevieja z obsługą po polsku
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 leading-7 text-white/90">
            <p>
              Szukasz polskiego biura nieruchomości w Torrevieja? W Onesta
              zaczynamy od rozmowy o Twoich planach: budżecie, sposobie
              korzystania z nieruchomości i oczekiwaniach wobec lokalizacji. Na
              tej podstawie wybieramy propozycje do wspólnego omówienia i
              oglądania na miejscu.
            </p>
            <p>
              Pomagamy porównać oferty, organizujemy prezentacje i kontakt ze
              sprzedającymi oraz wspieramy formalności związane z zakupem.
              Poszczególne etapy omawiamy po polsku. Opowiedz nam, czy
              interesuje Cię mieszkanie przy plaży, apartament na nowym osiedlu
              czy dom z ogrodem — pomożemy zawęzić poszukiwania.
            </p>
          </div>
          {onConsultation && (
            <button
              type="button"
              onClick={onConsultation}
              className="mt-7 rounded-md bg-[#e2c477] px-6 py-3 font-semibold text-[#182334] transition-colors hover:bg-[#eed799] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Porozmawiajmy o nieruchomości w Torrevieja
            </button>
          )}
        </section>

        <ContentSection
          id="torrevieja-faq"
          title="Nieruchomości Torrevieja — najczęstsze pytania"
        >
          <div className="pt-2">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                name="torrevieja-property-faq"
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
