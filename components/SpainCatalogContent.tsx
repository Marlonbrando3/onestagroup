import Link from "next/link";
import type { ReactNode } from "react";

const linkClass =
  "mt-5 inline-flex items-center border-b border-[#b58b4c] pb-1 text-sm font-semibold text-[#75582e] transition-colors hover:border-[#182334] hover:text-[#182334]";

function ContentLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
      <span aria-hidden="true" className="ml-2">
        →
      </span>
    </Link>
  );
}

function BulletList({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-5 grid gap-x-8 gap-y-2 pl-5 marker:text-[#b58b4c] sm:grid-cols-2">
      {children}
    </ul>
  );
}

export default function SpainCatalogContent({
  onConsultation,
}: {
  onConsultation?: () => void;
}) {
  return (
    <section className="mx-auto w-[90vw] max-w-[1180px] py-12 text-[#263244] md:py-16">
      <div className="space-y-16">
        <section aria-labelledby="gdzie-kupic">
          <div className="max-w-4xl">
            <h2
              id="gdzie-kupic"
              className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
            >
              Gdzie kupić nieruchomość w Hiszpanii?
            </h2>
            <p className="mt-5 leading-7">
              Hiszpańskie wybrzeże nie jest jednym, jednolitym rynkiem.
              Poszczególne regiony różnią się cenami, charakterem miejscowości,
              dostępnością nowych inwestycji, komunikacją, infrastrukturą oraz
              sposobem, w jaki właściciele wykorzystują swoje nieruchomości.
            </p>
            <p className="mt-4 leading-7">
              Dlatego przed wyborem konkretnego apartamentu czy domu warto
              najpierw odpowiedzieć sobie na pytanie: <strong>w której części
              Hiszpanii chcę kupić?</strong>
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="border border-[#e4d9c7] bg-white p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Nieruchomości na Costa Blanca
              </h3>
              <p className="mt-4 leading-7">
                Costa Blanca to jeden z najpopularniejszych regionów wśród
                zagranicznych kupujących nieruchomości w Hiszpanii. Znajdziemy
                tutaj zarówno duże miasta i popularne kurorty, jak i
                spokojniejsze miejscowości położone nad Morzem Śródziemnym.
              </p>
              <p className="mt-4 leading-7">
                Rynek jest bardzo zróżnicowany — od apartamentów blisko plaży po
                nowe osiedla, domy szeregowe i wille.
              </p>
              <p className="mt-4 leading-7">
                Popularne lokalizacje obejmują między innymi Alicante,
                Torrevieja, Orihuela Costa, Guardamar del Segura, Benidorm,
                Finestrat, Calpe, Jávea i Denię.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania/costa-blanca">
                Zobacz nieruchomości na Costa Blanca
              </ContentLink>
            </article>

            <article className="border border-[#e4d9c7] bg-white p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Nieruchomości na Costa del Sol
              </h3>
              <p className="mt-4 leading-7">
                Costa del Sol to jeden z najbardziej rozpoznawalnych rynków
                nieruchomości w południowej Hiszpanii.
              </p>
              <p className="mt-4 leading-7">
                Region obejmuje między innymi Málagę, Marbellę, Esteponę, Mijas,
                Fuengirolę i Benalmádenę. Znajdziemy tutaj zarówno apartamenty
                wakacyjne, jak i nieruchomości premium, nowoczesne inwestycje
                oraz wille.
              </p>
              <p className="mt-4 leading-7">
                Duża różnorodność lokalizacji sprawia, że wybór konkretnej
                miejscowości powinien zależeć przede wszystkim od budżetu oraz
                sposobu, w jaki nieruchomość będzie wykorzystywana.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania/costa-del-sol">
                Zobacz nieruchomości na Costa del Sol
              </ContentLink>
            </article>

            <article className="border border-[#e4d9c7] bg-white p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Nieruchomości na Costa Cálida
              </h3>
              <p className="mt-4 leading-7">
                Costa Cálida znajduje się w regionie Murcji i może być
                interesującą alternatywą dla bardziej znanych części
                hiszpańskiego wybrzeża.
              </p>
              <p className="mt-4 leading-7">
                Wśród popularnych lokalizacji znajdują się między innymi San
                Pedro del Pinatar, Los Alcázares, Cartagena oraz okolice Mar
                Menor.
              </p>
              <p className="mt-4 leading-7">
                Region warto brać pod uwagę szczególnie wtedy, gdy szukamy
                spokojniejszej lokalizacji lub chcemy porównać ceny z sąsiednią
                Costa Blanca.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania/costa-calida">
                Zobacz nieruchomości na Costa Cálida
              </ContentLink>
            </article>

            <article className="border border-[#e4d9c7] bg-white p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Nieruchomości na Costa de Almería
              </h3>
              <p className="mt-4 leading-7">
                Costa de Almería oferuje inny charakter rynku niż Costa Blanca
                czy Costa del Sol, a dla części kupujących może być ciekawą
                alternatywą dla najbardziej popularnych regionów Hiszpanii.
              </p>
              <p className="mt-4 leading-7">
                Znajdziemy tutaj zarówno apartamenty, jak i domy oraz nowe
                inwestycje w miejscowościach położonych wzdłuż wybrzeża.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania/costa-de-almeria">
                Zobacz nieruchomości na Costa de Almería
              </ContentLink>
            </article>
          </div>
        </section>

        <section aria-labelledby="jakie-nieruchomosci">
          <div className="max-w-4xl">
            <h2
              id="jakie-nieruchomosci"
              className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
            >
              Jakie nieruchomości w Hiszpanii można kupić?
            </h2>
            <p className="mt-5 leading-7">
              Oferta nieruchomości w Hiszpanii jest bardzo szeroka. To, jaki typ
              nieruchomości będzie najlepszy, zależy przede wszystkim od celu
              zakupu, budżetu oraz planowanego sposobu użytkowania.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <article>
              <h3 className="text-xl font-semibold text-[#182334]">
                Mieszkania i apartamenty w Hiszpanii
              </h3>
              <p className="mt-4 leading-7">
                Apartamenty są jednym z najczęściej wybieranych typów
                nieruchomości w hiszpańskich miejscowościach nadmorskich.
              </p>
              <p className="mt-4 leading-7">
                W nowych inwestycjach często znajdują się wspólne baseny,
                tereny zielone, garaże lub miejsca parkingowe, tarasy oraz
                dodatkowa infrastruktura dostępna dla mieszkańców.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania?type=apartment">
                Zobacz mieszkania i apartamenty w Hiszpanii
              </ContentLink>
            </article>

            <article>
              <h3 className="text-xl font-semibold text-[#182334]">
                Domy i wille w Hiszpanii
              </h3>
              <p className="mt-4 leading-7">
                Osoby poszukujące większej powierzchni, prywatności lub własnego
                ogrodu mogą wybierać spośród domów szeregowych, bliźniaków i
                niezależnych willi.
              </p>
              <p className="mt-4 leading-7">
                Oferta domów oraz poziom cen bardzo mocno zależą od regionu i
                odległości od morza.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania?type=villa,bungalow,townhouse">
                Zobacz domy i wille w Hiszpanii
              </ContentLink>
            </article>

            <article>
              <h3 className="text-xl font-semibold text-[#182334]">
                Nowe nieruchomości od deweloperów
              </h3>
              <p className="mt-4 leading-7">
                Rynek pierwotny jest szczególnie rozbudowany w wielu częściach
                Costa Blanca, Costa del Sol i Costa Cálida.
              </p>
              <p className="mt-4 leading-7">
                Kupujący może wybierać zarówno nieruchomości gotowe do odbioru,
                jak i inwestycje znajdujące się jeszcze na etapie budowy.
              </p>
              <p className="mt-4 leading-7">
                Przed zakupem warto porównać nie tylko cenę, ale również
                harmonogram płatności, termin zakończenia inwestycji, standard
                wykończenia, lokalizację i historię dewelopera.
              </p>
              <ContentLink href="/nieruchomosci/hiszpania?market=true">
                Zobacz nowe nieruchomości w Hiszpanii
              </ContentLink>
            </article>
          </div>
        </section>

        <section id="ile-kosztuja" aria-labelledby="ile-kosztuja-heading">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <h2
                id="ile-kosztuja-heading"
                className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
              >
                Ile kosztują nieruchomości w Hiszpanii?
              </h2>
              <p className="mt-5 leading-7">
                Nie istnieje jedna odpowiedź na pytanie, ile kosztuje
                nieruchomość w Hiszpanii.
              </p>
              <p className="mt-4 leading-7">Cena zależy między innymi od:</p>
              <BulletList>
                <li>regionu,</li>
                <li>miejscowości,</li>
                <li>odległości od morza,</li>
                <li>typu nieruchomości,</li>
                <li>powierzchni,</li>
                <li>liczby sypialni,</li>
                <li>rynku pierwotnego lub wtórnego,</li>
                <li>standardu inwestycji,</li>
                <li>widoku i położenia,</li>
                <li>dodatkowej infrastruktury osiedla.</li>
              </BulletList>
            </div>
            <div className="border-l-2 border-[#d7c8ad] pl-6 lg:mt-14 lg:pl-8">
              <p className="leading-7">
                Różnice pomiędzy poszczególnymi częściami Hiszpanii mogą być
                bardzo duże. Dlatego samo określenie budżetu bez wyboru regionu
                często nie wystarcza.
              </p>
              <p className="mt-4 leading-7">
                Przy poszukiwaniu nieruchomości warto również pamiętać, że
                <strong> cena zakupu nie jest całkowitym kosztem transakcji</strong>.
                Do budżetu należy doliczyć podatki oraz pozostałe koszty
                związane z zakupem.
              </p>
              <div className="flex flex-col items-start">
                <ContentLink href="/blog/nieruchomosci-w-hiszpanii">
                  Sprawdź ceny nieruchomości w Hiszpanii
                </ContentLink>
                <ContentLink href="/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca">
                  Sprawdź koszty zakupu nieruchomości w Hiszpanii
                </ContentLink>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="jak-wybrac">
          <h2
            id="jak-wybrac"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Jak wybrać nieruchomość w Hiszpanii?
          </h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="leading-7">
                Najczęstszy błąd na początku poszukiwań polega na przeglądaniu
                setek przypadkowych ofert bez wcześniejszego określenia własnych
                potrzeb.
              </p>
              <p className="mt-4 leading-7">
                Przed rozpoczęciem poszukiwania warto ustalić:
              </p>
              <BulletList>
                <li>maksymalny budżet,</li>
                <li>cel zakupu,</li>
                <li>preferowany region,</li>
                <li>odległość od morza,</li>
                <li>liczbę sypialni,</li>
                <li>rodzaj nieruchomości,</li>
                <li>znaczenie dostępu do lotniska,</li>
                <li>oczekiwaną infrastrukturę,</li>
                <li>potrzebę późniejszego wynajmu,</li>
                <li>preferencję pomiędzy rynkiem pierwotnym i wtórnym.</li>
              </BulletList>
            </div>
            <div className="space-y-4 leading-7">
              <p>
                Inaczej wybiera się mieszkanie przeznaczone głównie na własne
                wakacje, inaczej nieruchomość do zamieszkania na stałe, a jeszcze
                inaczej lokal kupowany z myślą o wynajmie.
              </p>
              <p>
                Dobra selekcja na początku pozwala ograniczyć setki dostępnych
                ofert do kilku lub kilkunastu rzeczywiście odpowiadających
                potrzebom kupującego.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="jak-wyglada-zakup">
          <h2
            id="jak-wyglada-zakup"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Jak wygląda zakup nieruchomości w Hiszpanii?
          </h2>
          <p className="mt-5 max-w-4xl leading-7">
            Proces zakupu różni się od procedury znanej z Polski, dlatego warto
            wiedzieć z wyprzedzeniem, jakie będą jego kolejne etapy.
          </p>
          <p className="mt-4 max-w-4xl leading-7">
            W uproszczeniu proces wygląda następująco:
          </p>

          <ol className="mt-8 grid gap-px overflow-hidden border border-[#e4d9c7] bg-[#e4d9c7] md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Określenie kryteriów",
                "Ustalamy budżet, region, sposób użytkowania i najważniejsze cechy nieruchomości.",
              ],
              [
                "Selekcja ofert",
                "Porównujemy dostępne nieruchomości oraz lokalizacje i przygotowujemy krótką listę ofert.",
              ],
              [
                "Prezentacje",
                "Organizujemy oglądanie nieruchomości oraz poznanie wybranych miejscowości i okolic.",
              ],
              [
                "Rezerwacja nieruchomości",
                "Po wyborze konkretnej nieruchomości ustalane są warunki rezerwacji oraz kolejne etapy transakcji.",
              ],
              [
                "Formalności i weryfikacja dokumentów",
                "W procesie uczestniczą odpowiedni specjaliści, a dokumentacja nieruchomości powinna zostać właściwie sprawdzona przed finalizacją zakupu.",
              ],
              [
                "Akt notarialny i przekazanie nieruchomości",
                "Transakcja zostaje sfinalizowana, a kupujący otrzymuje nieruchomość zgodnie z ustalonymi warunkami.",
              ],
            ].map(([heading, copy], index) => (
              <li key={heading} className="bg-white p-6">
                <span className="text-sm font-semibold text-[#9a733b]">
                  {index + 1}.
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[#182334]">
                  {heading}
                </h3>
                <p className="mt-3 leading-7">{copy}</p>
              </li>
            ))}
          </ol>

          <ContentLink href="/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces">
            Przeczytaj: Jak kupić nieruchomość w Hiszpanii? Proces krok po kroku
          </ContentLink>
        </section>

        <section aria-labelledby="rynek-pierwotny-czy-wtorny">
          <h2
            id="rynek-pierwotny-czy-wtorny"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Rynek pierwotny czy wtórny w Hiszpanii?
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 leading-7">
            <p>Oba rozwiązania mają swoje zalety.</p>
            <p>
              Rynek pierwotny daje dostęp do nowych inwestycji, nowoczesnych
              rozwiązań, często rozbudowanej infrastruktury osiedla oraz
              możliwości zakupu nieruchomości jeszcze na etapie budowy.
            </p>
            <p>
              Rynek wtórny może natomiast zapewniać większy wybór w istniejących
              dzielnicach i lokalizacjach, w których nowych inwestycji jest
              niewiele.
            </p>
            <p>Nie zakładamy z góry, że jeden z tych rynków jest lepszy.</p>
            <p>
              Najważniejsze jest to, <strong>która konkretna nieruchomość
              najlepiej odpowiada potrzebom kupującego.</strong>
            </p>
          </div>
        </section>

        <section aria-labelledby="pomoc-biura">
          <h2
            id="pomoc-biura"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Dlaczego warto korzystać z pomocy biura nieruchomości w Hiszpanii?
          </h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4 leading-7">
              <p>Kupno nieruchomości bez pośrednika jest możliwe.</p>
              <p>
                Rola dobrej agencji powinna jednak polegać na czymś więcej niż
                przesłaniu klientowi kilku ofert.
              </p>
              <p>Biuro może pomóc między innymi w:</p>
              <BulletList>
                <li>wyborze regionu,</li>
                <li>porównaniu miejscowości,</li>
                <li>selekcji ofert,</li>
                <li>organizacji prezentacji,</li>
                <li>kontakcie z deweloperem lub sprzedającym,</li>
                <li>koordynacji procesu zakupu,</li>
                <li>współpracy z prawnikami i innymi specjalistami,</li>
                <li>
                  organizacji spraw związanych z odbiorem nieruchomości.
                </li>
              </BulletList>
            </div>
            <div className="border-l-2 border-[#d7c8ad] pl-6 lg:pl-8">
              <p className="leading-7">
                Najważniejsze jest jednak to, aby agent <strong>nie próbował
                sprzedać konkretnej nieruchomości za wszelką cenę</strong>, lecz
                pomógł wybrać najlepszą spośród dostępnych możliwości.
              </p>
              <ContentLink href="/blog/polskie-biuro-nieruchomosci-w-hiszpanii">
                Przeczytaj: Jak wybrać polskie biuro nieruchomości w Hiszpanii?
              </ContentLink>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="nieruchomosci-z-onesta"
          className="border border-[#dfd2bd] bg-[#f7f3ec] p-6 md:p-10"
        >
          <h2
            id="nieruchomosci-z-onesta"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Nieruchomości w Hiszpanii z Onesta
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 leading-7">
            <p>
              Od lat pomagamy klientom przeprowadzać zakup nieruchomości w
              Hiszpanii od pierwszego etapu poszukiwania aż do finalizacji
              transakcji.
            </p>
            <p>Nie zaczynamy od pytania:</p>
            <p className="text-lg font-semibold text-[#182334]">
              „Którą nieruchomość chcesz kupić?”
            </p>
            <p>Najpierw chcemy wiedzieć:</p>
            <p className="text-lg font-semibold text-[#182334]">
              „Czego naprawdę szukasz i dlaczego?”
            </p>
            <p>
              Na tej podstawie możemy porównać regiony, miejscowości oraz
              dostępne nieruchomości i ograniczyć poszukiwania do ofert, które
              faktycznie odpowiadają potrzebom klienta.
            </p>
            <p>
              Współpracujemy z deweloperami, właścicielami oraz innymi podmiotami
              działającymi na rynku nieruchomości w Hiszpanii.
            </p>
            <p>
              Pomagamy również koordynować kolejne etapy transakcji oraz kontakt
              ze specjalistami potrzebnymi do bezpiecznego przeprowadzenia
              zakupu.
            </p>
          </div>

          <div className="mt-8 border-t border-[#dfd2bd] pt-8">
            <h3 className="text-xl font-semibold text-[#182334]">
              Szukasz nieruchomości w Hiszpanii?
            </h3>
            <p className="mt-4 leading-7">Powiedz nam:</p>
            <ul className="mt-3 grid gap-2 pl-5 marker:text-[#b58b4c] sm:grid-cols-2">
              <li>jaki masz budżet,</li>
              <li>gdzie chciałbyś kupić,</li>
              <li>jakiej nieruchomości szukasz,</li>
              <li>w jaki sposób planujesz z niej korzystać.</li>
            </ul>
            <p className="mt-5 leading-7">
              Jeżeli nie znasz jeszcze odpowiedzi na wszystkie te pytania —
              również możemy od tego zacząć.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {onConsultation && (
                <button
                  type="button"
                  onClick={onConsultation}
                  className="bg-[#182334] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#9b7a36]"
                >
                  Porozmawiaj z nami o zakupie
                </button>
              )}
              <a
                href="#oferty"
                className="border border-[#b8954c] bg-white px-6 py-3 font-semibold text-[#182334] transition-colors hover:bg-[#fffaf0]"
              >
                Zobacz dostępne nieruchomości
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-hiszpania">
          <h2
            id="faq-hiszpania"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Najczęściej zadawane pytania o nieruchomości w Hiszpanii
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {[
              [
                "Czy Polak może kupić nieruchomość w Hiszpanii?",
                "Tak. Obywatele Polski mogą kupować nieruchomości w Hiszpanii. Sam proces wymaga jednak dopełnienia określonych formalności, dlatego warto przygotować się do transakcji jeszcze przed wyborem konkretnej nieruchomości.",
              ],
              [
                "Gdzie najlepiej kupić nieruchomość w Hiszpanii?",
                "Nie istnieje jeden najlepszy region dla każdego kupującego. Costa Blanca, Costa del Sol, Costa Cálida i Costa de Almería różnią się cenami, charakterem miejscowości oraz dostępnością nieruchomości. Wybór powinien zależeć przede wszystkim od budżetu i celu zakupu.",
              ],
              [
                "Czy lepiej kupić apartament czy dom w Hiszpanii?",
                "Zależy to od sposobu użytkowania nieruchomości. Apartament może być wygodniejszy jako nieruchomość wakacyjna lub wymagająca niewielkiej obsługi, natomiast dom zapewnia zazwyczaj więcej przestrzeni i prywatności.",
              ],
              [
                "Czy lepiej kupić nieruchomość z rynku pierwotnego czy wtórnego?",
                "Oba rynki mogą oferować dobre możliwości. Rynek pierwotny daje dostęp do nowych inwestycji, natomiast rynek wtórny często zapewnia większy wybór w istniejących dzielnicach. Decyzję warto podejmować na podstawie konkretnej lokalizacji i nieruchomości, a nie samego rodzaju rynku.",
              ],
              [
                "Jakie dodatkowe koszty występują przy zakupie nieruchomości w Hiszpanii?",
                "Poza ceną nieruchomości należy uwzględnić między innymi podatki i koszty formalności związanych z transakcją. Ich struktura zależy między innymi od tego, czy kupowana nieruchomość pochodzi z rynku pierwotnego czy wtórnego oraz od miejsca zakupu.",
              ],
              [
                "Czy można kupić nieruchomość w Hiszpanii bez znajomości języka hiszpańskiego?",
                "Tak. Trzeba jednak zapewnić sobie możliwość właściwego zrozumienia dokumentów oraz warunków transakcji. Właśnie dlatego wielu kupujących decyduje się na obsługę w języku polskim.",
              ],
              [
                "Czy Onesta pomaga również po zakupie nieruchomości?",
                "Zakres pomocy zależy od konkretnej transakcji i potrzeb klienta. Możemy koordynować również wybrane sprawy związane z odbiorem i przygotowaniem nieruchomości po zakończeniu procesu zakupu.",
              ],
            ].map(([question, answer]) => (
              <article key={question}>
                <h3 className="text-lg font-semibold leading-snug text-[#182334]">
                  {question}
                </h3>
                <p className="mt-3 leading-7">{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
