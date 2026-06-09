import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contactform from "../../components/contactfrom/contactform";
import { WorkSans, PlayfairSans } from "../../fonts/fonts";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaChartLine,
  FaCheck,
  FaHandshake,
  FaKey,
  FaMapMarkedAlt,
  FaPlaneDeparture,
  FaShieldAlt,
} from "react-icons/fa";

const highlights = [
  { value: "2 dni", label: "prezentacji i analizy rynku na miejscu" },
  { value: "90%", label: "rynku ofert przez siec partnerow" },
  { value: "6-8%", label: "orientacyjny zwrot z dobrze dobranego najmu" },
];

const itinerary = [
  {
    icon: FaPlaneDeparture,
    title: "Przed przylotem",
    text: "Ustalamy budzet, cel zakupu, regiony i kryteria. Selekcjonujemy oferty, ktore realnie warto zobaczyc na miejscu.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Dzien 1: rynek i lokalizacje",
    text: "Ogladasz nieruchomosci, urbanizacje, okolice, plaze i infrastrukture. Porownujemy zdjecia ofert z rzeczywistoscia.",
  },
  {
    icon: FaChartLine,
    title: "Dzien 2: decyzja inwestycyjna",
    text: "Analizujemy ceny, potencjal wynajmu, koszty utrzymania, formalnosci i ryzyka. Zostajesz z jasnym planem dalszych krokow.",
  },
  {
    icon: FaKey,
    title: "Po wyborze nieruchomosci",
    text: "Prowadzimy rezerwacje, numer NIE, konto bankowe, akt notarialny, umeblowanie i przygotowanie nieruchomosci pod wynajem.",
  },
];

const criteria = [
  "lokalizacja i charakter miasta",
  "odleglosc od morza i uslug",
  "standard budynku oraz czesci wspolne",
  "realny popyt najmu w regionie",
  "koszty wspolnoty, podatki i utrzymanie",
  "mozliwosc odsprzedazy w przyszlosci",
];

const reasons = [
  {
    title: "Zdjecia nie pokazuja otoczenia",
    text: "Polowa wartosci decyzji to sama nieruchomosc, druga polowa to okolica, dojazdy, sasiedztwo, uslugi i sposob, w jaki miejsce zyje poza kadrem aparatu.",
  },
  {
    title: "Rynek zmienia sie bardzo szybko",
    text: "Oferty potrafia znikac w trakcie jednej wizyty. Dlatego przygotowujemy szerszy plan prezentacji, a nie wyjazd oparty na jednej nieruchomosci.",
  },
  {
    title: "Kupujesz strategię, nie tylko apartament",
    text: "Na miejscu laczymy wybór nieruchomosci z celem: prywatnym uzytkiem, wynajmem, odsprzedaza albo bezpiecznym drugim domem.",
  },
];

export default function InvestorStayPage() {
  return (
    <>
      <Head>
        <title>Pobyt inwestorski w Hiszpanii | Onesta Group</title>
        <meta
          name="description"
          content="Dwudniowy pobyt inwestorski w Hiszpanii: prezentacje nieruchomosci, analiza lokalizacji, model wynajmu i formalnosci zakupu z Onesta Group."
        />
      </Head>
      <main
        className={`${WorkSans.className} min-h-screen bg-[#f7f3ec] text-[#182334]`}
      >
        <Header handleConsultationPopUp={() => {}} loadLoader={() => {}} />

        <section className="relative min-h-[760px] overflow-hidden bg-[#182334] pt-[112px] text-white">
          <div className="absolute inset-0 bg-[url('/main_bg.png')] bg-cover bg-center opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08111d] via-[#08111d]/85 to-[#08111d]/20" />
          <div className="relative mx-auto grid min-h-[640px] w-11/12 max-w-7xl items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d6b36a]">
                Onesta Group Spain
              </p>
              <h1
                className={`${PlayfairSans.className} mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] md:text-7xl`}
              >
                Pobyt inwestorski dla kupujacych nieruchomosc w Hiszpanii
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
                Dwa dni na miejscu, podczas których widzisz nieruchomości,
                porównujesz regiony, rozumiesz koszty i podejmujesz decyzje na
                podstawie rynku, a nie samych zdjęć.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#kontakt"
                  className="inline-flex h-12 items-center gap-3 rounded-md bg-[#d6b36a] px-6 text-sm font-bold uppercase tracking-wide text-[#111827] transition hover:bg-white"
                >
                  Umow konsultacje <FaArrowRight />
                </a>
                <a
                  href="#plan"
                  className="inline-flex h-12 items-center rounded-md border border-white/35 px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                >
                  Zobacz plan pobytu
                </a>
              </div>
            </div>

            <div className="border border-white/18 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6b36a]">
                Co dostajesz
              </p>
              <div className="mt-6 space-y-5">
                {[
                  "selekcje ofert dopasowanych do budzetu",
                  "prezentacje nieruchomosci i okolic",
                  "analize wynajmu, kosztow i formalnosci",
                  "plan kolejnych krokow po wyborze",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 text-base text-white/90"
                  >
                    <FaCheck className="mt-1 shrink-0 text-[#d6b36a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/18 pt-6">
                <p className="text-3xl font-semibold">70%+</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  kupujacych zmienia pierwotne preferencje po obejrzeniu ofert i
                  lokalizacji na zywo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8c8ad] bg-[#111827] text-white">
          <div className="mx-auto grid w-11/12 max-w-7xl gap-px py-0 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.value} className="py-8 md:px-8">
                <p className="text-4xl font-semibold text-[#d6b36a]">
                  {item.value}
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-11/12 max-w-7xl gap-12 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Dlaczego warto
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              W Hiszpanii kupuje sie dopiero po zobaczeniu kontekstu.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              Pobyt inwestorski porzadkuje decyzje. Zamiast wybierac zrzuty
              ekranu i foldery ofert, sprawdzasz miejsca, ktore beda decydowaly
              o komforcie zycia, atrakcyjnosci najmu i wartosci odsprzedazy.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="border border-[#dfd2bc] bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold leading-snug">
                  {reason.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">
                  {reason.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="plan" className="bg-white py-24">
          <div className="mx-auto w-11/12 max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
                Plan pobytu
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Dwudniowy proces, ktory konczy sie jasna decyzja.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {itinerary.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="relative border border-[#e5dac7] bg-[#fbf8f2] p-6"
                  >
                    <span className="absolute right-5 top-5 text-sm font-bold text-[#b8954c]">
                      0{index + 1}
                    </span>
                    <Icon className="h-8 w-8 text-[#b8954c]" />
                    <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">
                      {step.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#182334] py-24 text-white">
          <div className="absolute inset-0 bg-[url('/bg_calp.jpg')] bg-cover bg-center opacity-25" />
          <div className="relative mx-auto grid w-11/12 max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                Co analizujemy
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Nieruchomosc ma zarabiac albo dobrze sluzyc. Najlepiej jedno i
                drugie.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/78">
                Na miejscu pokazujemy, dlaczego dwie podobne oferty na zdjeciach
                moga miec zupelnie inny sens inwestycyjny.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {criteria.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-white/16 bg-white/8 p-4 backdrop-blur-sm"
                >
                  <FaShieldAlt className="shrink-0 text-[#d6b36a]" />
                  <span className="text-sm font-medium text-white/88">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-11/12 max-w-7xl gap-12 py-24 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Co dalej po decyzji
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Rezerwacja, formalnosci i przygotowanie do wynajmu w jednym
              procesie.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              Po wyborze nieruchomosci prowadzimy Cie przez rezerwacje,
              platnosci, numer NIE, konto bankowe, akt notarialny oraz
              przygotowanie apartamentu do uzytku lub wynajmu.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "rezerwacja nieruchomosci od ok. 3000 euro",
              "koordynacja dokumentow i formalnosci",
              "partnerzy od umeblowania i odswiezenia",
              "mozliwosc zarzadzania najmem po zakupie",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 border-l-4 border-[#d6b36a] bg-white p-5 shadow-sm"
              >
                <FaHandshake className="mt-1 shrink-0 text-[#b8954c]" />
                <p className="font-medium text-[#283548]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="kontakt" className="bg-[#111827] py-24">
          <div className="mx-auto grid w-11/12 max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                Start
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Zacznij od rozmowy o celu zakupu.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                Opisz budzet, termin przylotu i oczekiwany model zakupu. Wrocimy
                z informacja, czy pobyt inwestorski ma sens w Twojej sytuacji i
                jak go przygotowac.
              </p>
            </div>
            <Contactform />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
