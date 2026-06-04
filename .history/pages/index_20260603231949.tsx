import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaGlobeEurope,
  FaHandshake,
  FaKey,
  FaMapMarkedAlt,
  FaQuoteRight,
  FaShieldAlt,
} from "react-icons/fa";
import { PlayfairSans, WorkSans } from "../fonts/fonts";
import Team from "../data/team.json";

const Header = dynamic(() => import("../components/Header"), {
  loading: () => <div style={{ height: "80px" }} />,
});
const ContactFormMain = dynamic(() => import("@/components/ContactFormMain"));
const Footer = dynamic(() => import("../components/Footer"));
const WhatsAppButton = dynamic(
  () => import("../components/whatsapp/whatsappButton"),
  { ssr: false },
);
const Consultation = dynamic(
  () => import("@/components/consulatation/consultation"),
  { ssr: false },
);

const markets = [
  {
    title: "Hiszpania",
    text: "Costa Blanca, Costa del Sol i wybrane lokalizacje z mocnym potencjałem najmu oraz życia sezonowego.",
    href: "/nieruchomosci/hiszpania",
    image: "/costablanca.webp",
  },
  {
    title: "Portugalia",
    text: "Rynek dla klientów szukających stabilnego kraju, jakości życia i długoterminowego bezpieczeństwa kapitału.",
    href: "/blog/jak-kupic-nieruchomosc-w-portugalii",
    image: "/bg_beach.jpeg",
  },
  {
    title: "Chorwacja",
    text: "Wybrzeże Adriatyku, nieruchomości wakacyjne i proces zakupu wymagający bardzo dobrej selekcji lokalizacji.",
    href: "/blog/jak-kupic-nieruchomosc-w-chorwacji",
    image: "/bg_calp.jpg",
  },
];

const reasons = [
  {
    icon: FaShieldAlt,
    title: "Bezpieczeństwo procesu",
    text: "Pilnujemy kolejności działań, dokumentów, rezerwacji, komunikacji z prawnikiem i decyzji, które mają wpływ na finalny zakup.",
  },
  {
    icon: FaGlobeEurope,
    title: "Dostęp do szerokiego rynku",
    text: "Nie zamykamy klienta w jednej bazie ofert. Porównujemy projekty, lokalizacje, deweloperów i realny sens inwestycyjny.",
  },
  {
    icon: FaHandshake,
    title: "Reprezentujemy klienta",
    text: "Naszym punktem odniesienia jest cel kupującego: drugi dom, inwestycja, wynajem, odsprzedaż albo bezpieczne ulokowanie kapitału.",
  },
  {
    icon: FaKey,
    title: "Opieka po wyborze",
    text: "Pomagamy przejść od decyzji do aktu notarialnego, a dalej do umeblowania, przygotowania lokalu i zarządzania najmem.",
  },
];

const process = [
  "Rozmowa o celu zakupu, budżecie i akceptowalnym poziomie ryzyka.",
  "Selekcja rynku i porównanie ofert, które faktycznie pasują do założeń.",
  "Prezentacje nieruchomości, analiza lokalizacji i kosztów utrzymania.",
  "Rezerwacja, formalności, wsparcie prawne i przygotowanie do użytkowania.",
];

const stats = [
  { value: "90%", label: "rynku ofert dzięki sieci partnerów" },
  { value: "4", label: "kraje i wybrane regiony inwestycyjne" },
  { value: "1", label: "proces od selekcji do odbioru kluczy" },
];

const testimonials = [
  {
    text: "Onesta bardzo dobrze uporządkowała nam cały proces. Zamiast oglądać przypadkowe oferty, szybko zrozumieliśmy, które lokalizacje i projekty realnie pasują do naszego celu.",
    author: "Pani Anna, Wrocław",
  },
  {
    text: "Kupowaliśmy nieruchomość z myślą o własnym użytkowaniu i wynajmie. Największą wartością była spokojna analiza, konkretne pytania i przeprowadzenie nas przez decyzję krok po kroku.",
    author: "Pan Robert, Warszawa",
  },
  {
    text: "Bardzo dobra komunikacja i jasne prowadzenie tematu. Bez takiego wsparcia trudno byłoby nam samodzielnie przejść przez zakup za granicą.",
    author: "Pan Tomasz, Wrocław",
  },
];

export default function FirstView() {
  const [ConsultationsShowe, setConsultationsShowed] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(false);

  const handleConsultationPopUp = () => {
    setConsultationsShowed(!ConsultationsShowe);
  };

  const loadLoader = () => {};

  React.useEffect(() => {
    const show = () => setShowEnhancements(true);
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(show, { timeout: 1200 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timeout = (window as any).setTimeout(show, 700);
    return () => (window as any).clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <title>Nieruchomości w Hiszpanii i za granicą | Onesta Group</title>
        <meta
          name="description"
          content="Onesta Group prowadzi klientów przez zakup nieruchomości za granicą: selekcja ofert, analiza rynku, prezentacje, formalności, odbiór i zarządzanie najmem."
        />
        <meta
          name="keywords"
          content="nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, polska agencja nieruchomości w Hiszpanii, nieruchomości Portugalia, nieruchomości Chorwacja"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta
          property="og:image"
          content="https://onesta.com.pl/onesta_og_img.png"
        />
      </Head>

      <main
        className={`${WorkSans.className} main-index min-h-screen overflow-hidden bg-[#f7f3ec] text-[#172033]`}
      >
        {showEnhancements && <WhatsAppButton />}
        {showEnhancements && (
          <Consultation
            handleConsultationPopUp={handleConsultationPopUp}
            ConsultationsShowed={ConsultationsShowe}
          />
        )}
        <Header
          handleConsultationPopUp={handleConsultationPopUp}
          loadLoader={loadLoader}
        />

        <section className="relative bg-[#fbf8f2] pt-[92px] lg:min-h-[760px]">
          <div className="absolute inset-x-0 bottom-0 h-32" />

          <div className="relative mx-auto grid w-11/12 max-w-7xl items-start gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="order-1 lg:order-1 lg:pt-10">
              {/* <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#9b7a36]">
                Onesta Group
              </p> */}
              <h1
                className={`${PlayfairSans.className} -mt-[50px] max-w-4xl text-5xl font-semibold leading-[1.04] text-[#182334] md:text-5xl`}
              >
                Nieruchomości za granicą kupowane mądrze.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4a5568] md:text-xl">
                Pomagamy wybrać nieruchomość w Hiszpanii i innych ciepłych
                krajach tak, aby decyzja była oparta na lokalizacji, kosztach,
                formalnościach i realnym potencjale użytkowania lub najmu.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/nieruchomosci/hiszpania"
                  className="inline-flex h-12 items-center gap-3 rounded-md bg-[#182334] px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c]"
                >
                  Zobacz oferty <FaArrowRight />
                </Link>
                <button
                  onClick={handleConsultationPopUp}
                  className="inline-flex h-12 items-center rounded-md border border-[#cdbb9d] px-6 text-sm font-semibold uppercase tracking-wide text-[#182334] transition hover:border-[#182334] hover:bg-white"
                >
                  Bezpłatna konsultacja
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.value}
                    className="border border-[#e2d4bd] bg-white/70 p-4 shadow-sm"
                  >
                    <p className="text-2xl font-semibold text-[#9b7a36]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs uppercase leading-5 tracking-wide text-[#5f6b7a]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-2 lg:order-2">
              <div className="relative min-h-[440px] overflow-hidden bg-white shadow-2xl lg:min-h-[560px] -mt-[200px] lg:block hidden">
                <Image
                  src="/mini_bg_about_us.webp"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 90vw"
                  className="object-cover"
                  alt="Wybrzeże Hiszpanii"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 max-w-md p-7 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                    Selekcja rynku
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">
                    Wybieramy lokalizację, projekt i proces tak, żeby decyzja
                    miała sens po powrocie do Polski.
                  </p>
                </div>
              </div>

              <div className="relative z-20 mx-auto -mt-16 w-[92%] border border-[#e5dac7] bg-white p-5 shadow-xl lg:absolute lg:left-1/2 lg:top-[100px] top-[100px] lg:mx-0 lg:-mt-0 lg:w-[88%] lg:-translate-x-1/2">
                <div className="grid grid-cols-3 gap-3">
                  {Team.map((person) => (
                    <div key={person.id} className="min-w-0">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#e5dac7]">
                        <Image
                          src={`/${person.photo}`}
                          fill
                          sizes="180px"
                          className="object-cover"
                          style={{
                            objectPosition:
                              person.photo === "Marek.webp"
                                ? "center 30%"
                                : person.photo === "Przemek.webp"
                                  ? "center 40%"
                                  : person.photo === "Karolina.webp"
                                    ? "center 30%"
                                    : "center",
                          }}
                          alt={person.name}
                        />
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-tight">
                        {person.name}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#9b7a36]">
                        {person.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#e5dac7] pt-5">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                    Zespół po stronie kupującego
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#5f6b7a]">
                    Pracujesz z osobami, które znają lokalny rynek, proces
                    zakupu i realne problemy klientów kupujących poza Polską.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111827] text-white">
          <div className="mx-auto grid w-11/12 max-w-7xl gap-px py-14 lg:grid-cols-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <article key={reason.title} className="p-5 lg:p-7">
                  <Icon className="h-8 w-8 text-[#d6b36a]" />
                  <h2 className="mt-6 text-xl font-semibold">{reason.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    {reason.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid w-11/12 max-w-7xl gap-12 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Jak wybieramy rynek
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Nie każda ładna oferta jest dobrą decyzją.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              Na początku porządkujemy cel zakupu: prywatne użytkowanie, najem,
              ochrona kapitału albo drugi dom dla rodziny. Dopiero później
              dobieramy region, projekt, budżet i model formalny.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {markets.map((market) => (
              <Link
                key={market.title}
                href={market.href}
                className="group overflow-hidden border border-[#dfd2bc] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={market.image}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    alt={market.title}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{market.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">
                    {market.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#9b7a36]">
                    Sprawdź kierunek <FaArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid w-11/12 max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[460px] overflow-hidden">
              <Image
                src="/main_img_video.webp"
                fill
                sizes="(min-width: 1024px) 44vw, 90vw"
                className="object-cover"
                alt="Apartament nad morzem"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                  Proces
                </p>
                <p
                  className={`${PlayfairSans.className} mt-3 max-w-md text-4xl font-semibold leading-tight`}
                >
                  Od pierwszej rozmowy do kluczy i dalszej opieki.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
                Jak pracujemy
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Proces ma zdejmować z Ciebie chaos, nie dokładać kolejnych
                pytań.
              </h2>
              <div className="mt-10 space-y-4">
                {process.map((item, index) => (
                  <div
                    key={item}
                    className="grid grid-cols-[56px_1fr] gap-4 border-l-4 border-[#d6b36a] bg-[#fbf8f2] p-5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#182334] text-sm font-bold text-white">
                      0{index + 1}
                    </span>
                    <p className="self-center text-base leading-7 text-[#374151]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#182334] py-24 text-white">
          <div className="absolute inset-0 bg-[url('/bg_calp_c.jpg')] bg-cover bg-center opacity-25" />
          <div className="relative mx-auto grid w-11/12 max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                Pobyt inwestorski
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Najlepsze decyzje zapadają po zobaczeniu lokalizacji na żywo.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/76">
                Przygotowujemy intensywny wyjazd, podczas którego widzisz
                nieruchomości, okolice, infrastrukturę, koszty i potencjał
                najmu. To skraca drogę do dobrej decyzji.
              </p>
              <Link
                href="/pobytinwestorski"
                className="mt-8 inline-flex h-12 items-center gap-3 rounded-md bg-[#d6b36a] px-6 text-sm font-bold uppercase tracking-wide text-[#111827] transition hover:bg-white"
              >
                Zobacz pobyt inwestorski <FaArrowRight />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Prezentacje", "Wybrane oferty i porównanie ich z rynkiem."],
                ["Lokalizacje", "Miasta, dzielnice, plaże, dojazdy i usługi."],
                ["Koszty", "Utrzymanie, podatki, wspólnota i wyposażenie."],
                ["Decyzja", "Jasny plan rezerwacji i formalności po wyborze."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="border border-white/16 bg-white/8 p-6 backdrop-blur-sm"
                >
                  <FaMapMarkedAlt className="h-7 w-7 text-[#d6b36a]" />
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-11/12 max-w-7xl py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Sylwetki
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Osoby, z którymi realnie przechodzisz przez proces.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {Team.map((person) => (
              <article key={person.id} className="bg-white shadow-sm">
                <div className="relative aspect-[4/4] overflow-hidden">
                  <Image
                    src={`/${person.photo}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover"
                    style={{
                      objectPosition:
                        person.photo === "Marek.webp"
                          ? "center 30%"
                          : person.photo === "Przemek.webp"
                            ? "center 40%"
                            : person.photo === "Karolina.webp"
                              ? "center 30%"
                              : "center",
                    }}
                    alt={person.name}
                  />
                </div>
                <div className="p-7">
                  <p className="text-2xl font-semibold">{person.name}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9b7a36]">
                    {person.title}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-[#5f6b7a]">
                    {person.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto w-11/12 max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
                Opinie klientów
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Najczęściej doceniana jest selekcja, komunikacja i spokój w
                procesie.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.author}
                  className="border border-[#e5dac7] bg-[#fbf8f2] p-7"
                >
                  <FaQuoteRight className="h-7 w-7 text-[#d6b36a]" />
                  <p className="mt-6 text-base leading-8 text-[#374151]">
                    {testimonial.text}
                  </p>
                  <p className="mt-8 text-sm font-bold uppercase tracking-wide text-[#9b7a36]">
                    {testimonial.author}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-11/12 max-w-7xl py-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Kontakt
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Opowiedz, czego szukasz. Odpowiemy konkretnie.
            </h2>
          </div>
          <ContactFormMain />
        </section>

        <Footer />
      </main>
    </>
  );
}
