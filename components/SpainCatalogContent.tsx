import Link from "next/link";
import type { ReactNode } from "react";
import { IoLocationOutline } from "react-icons/io5";

const linkClass =
  "mt-5 inline-flex items-center border-b border-[#b58b4c] pb-1 text-sm font-semibold text-[#75582e] transition-colors hover:border-[#182334] hover:text-[#182334]";

function ContentLink({
  href,
  children,
  inverse = false,
}: {
  href: string;
  children: ReactNode;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        inverse
          ? "mt-5 inline-flex items-center border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-[#e2c477] hover:text-[#e2c477]"
          : linkClass
      }
    >
      {children}
      <span aria-hidden="true" className="ml-2">
        →
      </span>
    </Link>
  );
}

function RegionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-start gap-3 text-2xl font-bold leading-tight text-white">
      <IoLocationOutline
        aria-hidden="true"
        className="mt-0.5 h-7 w-7 shrink-0 text-[#e2c477]"
      />
      <span>{children}</span>
    </h3>
  );
}

function BulletList({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={`mt-5 grid list-none gap-x-8 gap-y-3 p-0 [&>li]:relative [&>li]:min-h-5 [&>li]:pl-8 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0.5 [&>li]:before:flex [&>li]:before:h-5 [&>li]:before:w-5 [&>li]:before:items-center [&>li]:before:justify-center [&>li]:before:rounded-full [&>li]:before:border [&>li]:before:border-emerald-200 [&>li]:before:bg-emerald-50 [&>li]:before:text-[12px] [&>li]:before:font-bold [&>li]:before:text-emerald-600 [&>li]:before:content-['✓'] ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {children}
    </ul>
  );
}

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details
      name="spain-property-faq"
      className="group border-b border-[#dfd2bd] first:border-t"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
        <h3 className="text-lg font-semibold leading-snug text-[#182334] md:text-xl">
          {question}
        </h3>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9aa63] text-xl font-light leading-none text-[#182334]"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="max-w-4xl space-y-4 pb-6 pr-0 leading-7 text-[#4b586a] md:pr-14 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:marker:text-[#b58b4c]">
        {children}
      </div>
    </details>
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
            <article className="group relative flex min-h-[440px] overflow-hidden rounded-[18px] border border-white/15 bg-[#182334] p-6 text-white md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025]"
                style={{
                  backgroundImage:
                    "url('/images/seo/coasts/costa-blanca.webp')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,39,0.48)_0%,rgba(12,24,39,0.72)_55%,rgba(12,24,39,0.92)_100%)]"
              />
              <div className="relative z-10 flex w-full flex-col drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
                <RegionHeading>
                  Nieruchomości na Costa Blanca
                </RegionHeading>
                <p className="mt-4 leading-7 text-white/90">
                  Costa Blanca to jeden z najpopularniejszych regionów wśród
                  zagranicznych kupujących nieruchomości w Hiszpanii. Znajdziemy
                  tutaj zarówno duże miasta i popularne kurorty, jak i
                  spokojniejsze miejscowości położone nad Morzem Śródziemnym.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Rynek jest bardzo zróżnicowany — od apartamentów blisko plaży
                  po nowe osiedla, domy szeregowe i wille.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Popularne lokalizacje obejmują między innymi Alicante,
                  Torrevieja, Orihuela Costa, Guardamar del Segura, Benidorm,
                  Finestrat, Calpe, Jávea i Denię.
                </p>
                <div className="mt-auto pt-2">
                  <ContentLink
                    href="/nieruchomosci/hiszpania/costa-blanca"
                    inverse
                  >
                    Zobacz nieruchomości na Costa Blanca
                  </ContentLink>
                </div>
              </div>
            </article>

            <article className="group relative flex min-h-[440px] overflow-hidden rounded-[18px] border border-white/15 bg-[#182334] p-6 text-white md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025]"
                style={{
                  backgroundImage:
                    "url('/images/seo/coasts/costa-del-sol.webp')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,39,0.48)_0%,rgba(12,24,39,0.72)_55%,rgba(12,24,39,0.92)_100%)]"
              />
              <div className="relative z-10 flex w-full flex-col drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
                <RegionHeading>
                  Nieruchomości na Costa del Sol
                </RegionHeading>
                <p className="mt-4 leading-7 text-white/90">
                  Costa del Sol to jeden z najbardziej rozpoznawalnych rynków
                  nieruchomości w południowej Hiszpanii.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Region obejmuje między innymi Málagę, Marbellę, Esteponę,
                  Mijas, Fuengirolę i Benalmádenę. Znajdziemy tutaj zarówno
                  apartamenty wakacyjne, jak i nieruchomości premium, nowoczesne
                  inwestycje oraz wille.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Duża różnorodność lokalizacji sprawia, że wybór konkretnej
                  miejscowości powinien zależeć przede wszystkim od budżetu oraz
                  sposobu, w jaki nieruchomość będzie wykorzystywana.
                </p>
                <div className="mt-auto pt-2">
                  <ContentLink
                    href="/nieruchomosci/hiszpania/costa-del-sol"
                    inverse
                  >
                    Zobacz nieruchomości na Costa del Sol
                  </ContentLink>
                </div>
              </div>
            </article>

            <article className="group relative flex min-h-[440px] overflow-hidden rounded-[18px] border border-white/15 bg-[#182334] p-6 text-white md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025]"
                style={{
                  backgroundImage:
                    "url('/images/seo/coasts/costa-calida.webp')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,39,0.48)_0%,rgba(12,24,39,0.72)_55%,rgba(12,24,39,0.92)_100%)]"
              />
              <div className="relative z-10 flex w-full flex-col drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
                <RegionHeading>
                  Nieruchomości na Costa Cálida
                </RegionHeading>
                <p className="mt-4 leading-7 text-white/90">
                  Costa Cálida znajduje się w regionie Murcji i może być
                  interesującą alternatywą dla bardziej znanych części
                  hiszpańskiego wybrzeża.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Wśród popularnych lokalizacji znajdują się między innymi San
                  Pedro del Pinatar, Los Alcázares, Cartagena oraz okolice Mar
                  Menor.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Region warto brać pod uwagę szczególnie wtedy, gdy szukamy
                  spokojniejszej lokalizacji lub chcemy porównać ceny z sąsiednią
                  Costa Blanca.
                </p>
                <div className="mt-auto pt-2">
                  <ContentLink
                    href="/nieruchomosci/hiszpania/costa-calida"
                    inverse
                  >
                    Zobacz nieruchomości na Costa Cálida
                  </ContentLink>
                </div>
              </div>
            </article>

            <article className="group relative flex min-h-[440px] overflow-hidden rounded-[18px] border border-white/15 bg-[#182334] p-6 text-white md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025]"
                style={{
                  backgroundImage:
                    "url('/images/seo/coasts/costa-de-almeria.webp')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,39,0.48)_0%,rgba(12,24,39,0.72)_55%,rgba(12,24,39,0.92)_100%)]"
              />
              <div className="relative z-10 flex w-full flex-col drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
                <RegionHeading>
                  Nieruchomości na Costa de Almería
                </RegionHeading>
                <p className="mt-4 leading-7 text-white/90">
                  Costa de Almería oferuje inny charakter rynku niż Costa
                  Blanca czy Costa del Sol, a dla części kupujących może być
                  ciekawą alternatywą dla najbardziej popularnych regionów
                  Hiszpanii.
                </p>
                <p className="mt-4 leading-7 text-white/90">
                  Znajdziemy tutaj zarówno apartamenty, jak i domy oraz nowe
                  inwestycje w miejscowościach położonych wzdłuż wybrzeża.
                </p>
                <div className="mt-auto pt-2">
                  <ContentLink
                    href="/nieruchomosci/hiszpania/costa-de-almeria"
                    inverse
                  >
                    Zobacz nieruchomości na Costa de Almería
                  </ContentLink>
                </div>
              </div>
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
                  Poznaj i zrozum koszty zakupu nieruchomości w Hiszpanii
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
              <ContentLink href="/blog/jak-kupic-nieruchomosc-w-hiszpanii">
                Przeczytaj: Jak kupić nieruchomość w Hiszpanii?
              </ContentLink>
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
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <article className="border-l-2 border-[#d7c8ad] pl-6 md:pl-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Rynek pierwotny
              </h3>
              <BulletList columns={1}>
                <li>duży potencjał wynajmu wakacyjnego,</li>
                <li>duże zainteresowanie klientów premium,</li>
                <li>nowoczesne projekty przygotowane z myślą o wypoczynku,</li>
                <li>baseny, ogrody, parkingi i solaria na dachach,</li>
                <li>przestronne, często zamknięte tereny wspólne,</li>
                <li>inwestycje bardzo często położone blisko morza.</li>
              </BulletList>
            </article>

            <article className="border-l-2 border-[#d7c8ad] pl-6 md:pl-8">
              <h3 className="text-xl font-semibold text-[#182334]">
                Rynek wtórny
              </h3>
              <BulletList columns={1}>
                <li>częściej znajduje się w starszych dzielnicach i głębi lądu,</li>
                <li>zwykle oznacza niższą cenę zakupu,</li>
                <li>najczęściej wymaga przynajmniej odświeżenia,</li>
                <li>wiąże się z większym ryzykiem awarii i kosztów utrzymania,</li>
                <li>jest mniej atrakcyjny dla turystów,</li>
                <li>zwykle generuje niższe przychody z wynajmu.</li>
              </BulletList>
            </article>
          </div>

          <ContentLink href="/blog/hiszpania-apartamenty-na-sprzedaz">
            Przeczytaj: Rynek pierwotny i wtórny — różnice i potencjał
          </ContentLink>
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
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "wyborze regionu",
                  "porównaniu miejscowości",
                  "selekcji ofert",
                  "organizacji prezentacji",
                  "kontakcie z deweloperem lub sprzedającym",
                  "koordynacji procesu zakupu",
                  "współpracy z prawnikami i innymi specjalistami",
                  "organizacji spraw związanych z odbiorem nieruchomości",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[12px] font-bold text-emerald-600"
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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

        <section aria-labelledby="nieruchomosci-z-onesta">
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
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-2xl font-semibold text-red-600"
              >
                ×
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-red-700">
                  Nie zaczynamy od pytania
                </p>
                <p className="mt-2 text-xl font-semibold leading-snug text-[#182334]">
                  „Którą nieruchomość chcesz kupić?”
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-xl font-bold text-emerald-600"
              >
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  Najpierw chcemy wiedzieć
                </p>
                <p className="mt-2 text-xl font-semibold leading-snug text-[#182334]">
                  „Czego naprawdę szukasz i dlaczego?”
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-4xl space-y-4 leading-7">
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
        </section>

        <section
          aria-labelledby="cta-hiszpania"
          className="bg-[#182334] px-6 py-8 text-white md:px-10 md:py-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div>
              <h2
                id="cta-hiszpania"
                className="text-2xl font-semibold leading-tight text-white md:text-3xl"
              >
                Szukasz nieruchomości w Hiszpanii?
              </h2>
              <p className="mt-3 leading-7 text-white/80">Powiedz nam:</p>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-flow-col sm:grid-rows-3">
                {[
                  "Gdzie chciałbyś mieszkać?",
                  "Jaka jest Twoja wymarzona nieruchomość?",
                  "Jak blisko morza i lotniska chciałbyś kupić swoją nieruchomość?",
                  "Jakie cechy powinna posiadać Twoja wymarzona nieruchomość?",
                  "Jakim budżetem dysponujesz?",
                  "Czy chciałbyś wynajmować?",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[#d6b36a] text-[12px] font-bold text-[#e2c477]"
                    >
                      ✓
                    </span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 leading-7 text-white/75">
                Jeżeli nie znasz jeszcze odpowiedzi na wszystkie te pytania —
                to właśnie rozmowa z nami jest potrzebna najbardziej.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-[320px]">
              {onConsultation && (
                <button
                  type="button"
                  onClick={onConsultation}
                  className="w-full bg-[#d6b36a] px-7 py-4 font-semibold text-[#182334] transition-colors hover:bg-[#e2c477]"
                >
                  Porozmawiaj z nami o zakupie
                </button>
              )}
              <Link
                href="/nieruchomosci/hiszpania#oferty"
                className="w-full border-[5px] border-white bg-transparent px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-[#182334]"
              >
                Przeglądaj oferty w Hiszpanii
              </Link>
              <Link
                href="/nieruchomosci/cypr"
                className="w-full border-[5px] border-white bg-transparent px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-[#182334]"
              >
                Przeglądaj oferty na Cyprze
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-hiszpania">
          <h2
            id="faq-hiszpania"
            className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
          >
            Najczęściej zadawane pytania o zakup nieruchomości w Hiszpanii
          </h2>
          <div className="mt-8">
            <FaqItem question="Czy Polak może kupić nieruchomość w Hiszpanii?">
              <p>
                Tak. Obywatel Polski może bez problemu kupić nieruchomość w
                Hiszpanii, zarówno z rynku pierwotnego, jak i wtórnego.
              </p>
              <p>
                Jedną z podstawowych formalności jest uzyskanie <strong>numeru
                NIE – Número de Identidad de Extranjero</strong>, czyli numeru
                identyfikacyjnego cudzoziemca, który jest potrzebny między
                innymi przy zakupie nieruchomości i wielu późniejszych
                czynnościach administracyjnych.
              </p>
              <p>
                Warto również założyć <strong>rachunek w hiszpańskim
                banku</strong>, ponieważ znacznie ułatwia on realizację płatności
                związanych z zakupem, późniejsze opłacanie mediów, podatków oraz
                kosztów utrzymania nieruchomości.
              </p>
              <p>
                Przed wizytą w urzędzie warto sprawdzić aktualną listę
                wymaganych dokumentów dla konkretnej placówki i przygotować
                odpowiednie kopie dokumentów oraz zdjęcia dokumentowe, jeśli są
                wymagane w danej procedurze.
              </p>
              <p>
                Klient Onesta nie musi samodzielnie organizować całego procesu.
                Pomagamy przejść przez formalności związane z zakupem, w tym
                uzyskaniem NIE, organizacją potrzebnych dokumentów oraz
                przygotowaniem klienta do kolejnych etapów transakcji.
              </p>
            </FaqItem>

            <FaqItem question="Gdzie najlepiej kupić nieruchomość w Hiszpanii?">
              <p>
                Nie istnieje jeden najlepszy region dla każdego kupującego.
                Wybór powinien zależeć przede wszystkim od budżetu, sposobu
                wykorzystania nieruchomości oraz stylu życia, którego oczekujemy.
              </p>
              <p>
                <strong>Costa Blanca</strong> jest zwykle bardziej dostępna
                cenowo niż Costa del Sol i daje bardzo szeroki wybór nowych
                apartamentów, domów oraz nieruchomości wakacyjnych. Jest również
                bardzo popularna wśród polskich klientów, dzięki czemu w wielu
                miejscowościach funkcjonuje już duża polska społeczność i
                rozbudowana infrastruktura usługowa skierowana do obcokrajowców.
              </p>
              <p>
                <strong>Costa del Sol</strong> to z kolei rynek zdecydowanie
                bardziej międzynarodowy i w wielu lokalizacjach bardziej
                premium. Ceny nieruchomości są zazwyczaj wyższe, ale również
                standard inwestycji, architektura i infrastruktura nowych
                osiedli często należą do segmentu wyższego.
              </p>
              <p>
                Dużą różnicą jest także ukształtowanie terenu. Costa del Sol jest
                znacznie bardziej górzysta, dlatego wiele inwestycji powstaje na
                wzniesieniach. Dzięki temu <strong>widok na morze nie zawsze
                zależy bezpośrednio od odległości od plaży</strong> – nieruchomość
                położona kilka kilometrów od wybrzeża może mieć znacznie lepszy
                widok niż apartament znajdujący się dużo bliżej morza.
              </p>
              <p>
                W praktyce Costa Blanca często wybierana jest przez osoby
                szukające dobrego stosunku ceny do lokalizacji i infrastruktury,
                natomiast Costa del Sol częściej przyciąga klientów szukających
                rynku międzynarodowego, nieruchomości premium i bardziej
                luksusowego otoczenia.
              </p>
            </FaqItem>

            <FaqItem question="Czy lepiej kupić nieruchomość z rynku pierwotnego czy wtórnego?">
              <p>
                To przede wszystkim kwestia budżetu i tego, czego oczekujemy od
                nieruchomości.
              </p>
              <p>
                <strong>Rynek pierwotny jest zazwyczaj droższy</strong>, ale
                współczesne inwestycje w Hiszpanii bardzo często projektowane są
                już pod określony styl życia.
              </p>
              <p>Nowe osiedla oferują między innymi:</p>
              <ul>
                <li>baseny,</li>
                <li>tereny zielone,</li>
                <li>zamknięte części wspólne,</li>
                <li>garaże i miejsca parkingowe,</li>
                <li>duże tarasy,</li>
                <li>prywatne lub wspólne solaria,</li>
                <li>siłownie,</li>
                <li>strefy rekreacyjne,</li>
                <li>nowoczesne instalacje i energooszczędne rozwiązania.</li>
              </ul>
              <p>
                Takie nieruchomości nie wymagają również remontu przed
                rozpoczęciem użytkowania i są często atrakcyjniejsze dla osób
                poszukujących nowoczesnego apartamentu wakacyjnego lub
                nieruchomości przeznaczonej później do wynajmu.
              </p>
              <p>
                <strong>Rynek wtórny jest zwykle tańszy</strong>, ale standard
                nieruchomości może być bardzo różny. Starsze budynki często nie
                posiadają rozbudowanych części wspólnych charakterystycznych dla
                nowych inwestycji, a sam apartament może wymagać odświeżenia,
                remontu lub dostosowania do współczesnych oczekiwań właściciela.
              </p>
              <p>
                Zaletą rynku wtórnego może być natomiast możliwość zakupu
                nieruchomości w lokalizacjach, w których nowych inwestycji
                praktycznie już nie ma.
              </p>
              <p>
                Jeżeli więc priorytetem jest nowoczesny standard, infrastruktura
                osiedla i możliwość łatwego rozpoczęcia użytkowania lub wynajmu,
                <strong> rynek pierwotny będzie często lepszym wyborem</strong>.
                Jeżeli większe znaczenie ma cena albo konkretna, już zabudowana
                lokalizacja – warto mocno brać pod uwagę rynek wtórny.
              </p>
            </FaqItem>

            <FaqItem question="Czy można kupić nieruchomość w Hiszpanii bez znajomości języka hiszpańskiego?">
              <p>
                Tak. Znajomość języka hiszpańskiego nie jest konieczna do zakupu
                nieruchomości.
              </p>
              <p>
                W procesie uczestniczy kilka stron, dlatego profesjonalne
                agencje pracujące z klientami zagranicznymi komunikują się
                zazwyczaj w kilku językach. W przypadku Onesta klient może
                przejść przez cały proces w języku polskim, podczas gdy
                komunikacja z deweloperami, właścicielami, prawnikami i innymi
                podmiotami odbywa się również po angielsku lub hiszpańsku.
              </p>
              <p>
                Przy transakcji korzysta się także z pomocy <strong>prawnika</strong>,
                który kontroluje dokumentację oraz prawne aspekty zakupu.
              </p>
              <p>
                Jeżeli klient nie zna języka hiszpańskiego, przy podpisywaniu
                aktu notarialnego organizowana jest również odpowiednia obsługa
                językowa, tak aby kupujący dokładnie rozumiał treść podpisywanych
                dokumentów i warunki transakcji.
              </p>
              <p>
                W praktyce klient nie musi więc znać hiszpańskiego, żeby
                bezpiecznie przeprowadzić zakup – ważne jest natomiast, aby cały
                proces był prowadzony przez osoby, które potrafią sprawnie
                komunikować się zarówno z klientem, jak i z hiszpańskimi
                uczestnikami transakcji.
              </p>
            </FaqItem>

            <FaqItem question="Jak Onesta pomaga przy zakupie nieruchomości w Hiszpanii?">
              <p>Od początku do końca.</p>
              <p>
                Nie zaczynamy od wysyłania przypadkowej listy ofert. Najpierw
                chcemy dokładnie zrozumieć, <strong>czego klient rzeczywiście
                szuka</strong> – jaki ma budżet, jak chce korzystać z
                nieruchomości, które lokalizacje bierze pod uwagę, jak ważna jest
                odległość od morza, liczba sypialni, możliwość wynajmu czy dostęp
                do infrastruktury.
              </p>
              <p>
                Na tej podstawie przeszukujemy bazę obejmującą tysiące
                nieruchomości i wybieramy te, które rzeczywiście odpowiadają
                określonym kryteriom.
              </p>
              <p>
                Następnie wspólnie omawiamy wybrane propozycje. Bardzo często
                właśnie podczas tych rozmów pierwotne założenia klienta jeszcze
                się zmieniają i precyzują. Dzięki temu z dużej liczby dostępnych
                ofert dochodzimy do <strong>krótkiej listy nieruchomości, które
                naprawdę warto zobaczyć</strong>.
              </p>
              <p>Dalej organizujemy:</p>
              <ul>
                <li>prezentacje nieruchomości,</li>
                <li>kontakt z deweloperami lub właścicielami,</li>
                <li>rezerwację,</li>
                <li>uzyskanie potrzebnych dokumentów,</li>
                <li>obsługę prawną,</li>
                <li>formalności związane z zakupem,</li>
                <li>przygotowanie do aktu notarialnego,</li>
                <li>finalizację transakcji.</li>
              </ul>
              <p>Pomoc nie musi kończyć się w momencie odebrania kluczy.</p>
              <p>
                Po zakupie możemy również pomóc w <strong>wyposażeniu i
                umeblowaniu nieruchomości</strong>, a w przypadku klientów
                zainteresowanych wynajmem – także w organizacji jej późniejszego
                zarządzania.
              </p>
            </FaqItem>

            <FaqItem question="Jakie dodatkowe koszty występują przy zakupie nieruchomości w Hiszpanii?">
              <p>Cena widoczna w ogłoszeniu nie jest całkowitym kosztem zakupu.</p>
              <p>
                Przy <strong>nowej nieruchomości kupowanej od dewelopera</strong>{" "}
                podstawowym podatkiem jest VAT, który dla nieruchomości
                mieszkalnych wynosi 10% ceny. Do tego dochodzą pozostałe podatki
                i koszty związane z przeprowadzeniem transakcji.
              </p>
              <p>
                Przy <strong>rynku wtórnym</strong> zamiast VAT stosowany jest
                podatek od przeniesienia własności – ITP – którego wysokość
                zależy od regionu i konkretnej transakcji.
              </p>
              <p>Do kosztów okołozakupowych mogą dochodzić między innymi:</p>
              <ul>
                <li>obsługa prawna,</li>
                <li>obsługa notarialna,</li>
                <li>tłumaczenie,</li>
                <li>formalności związane z numerem NIE,</li>
                <li>koszty związane z bankiem,</li>
                <li>wpisy i rejestracja nieruchomości,</li>
                <li>inne opłaty administracyjne związane z transakcją.</li>
              </ul>
              <p>
                Przy planowaniu zakupu bezpiecznie jest przyjąć, że <strong>
                całkowity budżet powinien być około 13% wyższy od samej ceny
                nieruchomości</strong>, choć dokładna kwota zależy od tego, czy
                kupujemy na rynku pierwotnym czy wtórnym, w jakim regionie
                znajduje się nieruchomość oraz z jakimi dodatkowymi usługami
                wiąże się transakcja.
              </p>
              <p>
                <strong>Onesta nie pobiera prowizji od strony kupującej</strong>,
                dlatego wynagrodzenie naszej agencji nie stanowi dodatkowego
                kosztu doliczanego klientowi do ceny nieruchomości.
              </p>
            </FaqItem>
          </div>
        </section>
      </div>
    </section>
  );
}
