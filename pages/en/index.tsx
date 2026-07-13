import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { FaGlobeEurope } from "@react-icons/all-files/fa/FaGlobeEurope";
import { FaHandshake } from "@react-icons/all-files/fa/FaHandshake";
import { FaKey } from "@react-icons/all-files/fa/FaKey";
import { FaMapMarkedAlt } from "@react-icons/all-files/fa/FaMapMarkedAlt";
import { FaQuoteRight } from "@react-icons/all-files/fa/FaQuoteRight";
import { FaShieldAlt } from "@react-icons/all-files/fa/FaShieldAlt";
import {
  HomePlayfairSans as PlayfairSans,
  HomeWorkSans as WorkSans,
} from "@/fonts/homeFonts";
import Team from "@/data/team.json";

const Header = dynamic(() => import("@/components/Header"), {
  loading: () => <div style={{ height: "80px" }} />,
});
const ContactFormMain = dynamic(() => import("@/components/ContactFormMain"));
const Footer = dynamic(() => import("@/components/Footer"));
const WhatsAppButton = dynamic(
  () => import("@/components/whatsapp/whatsappButton"),
  { ssr: false },
);
const Consultation = dynamic(
  () => import("@/components/consulatation/consultation"),
  { ssr: false },
);

const markets = [
  {
    title: "Spain",
    text: "Costa Blanca, Costa del Sol and selected locations with strong rental and lifestyle potential.",
    href: "/en/properties/hiszpania",
    image: "/costablanca.webp",
  },
  {
    title: "Cyprus",
    text: "A Mediterranean market for clients who value a safe purchase process, good weather and straightforward ownership.",
    href: "/en/properties/cypr",
    image: "/cypr.png",
  },
];

const reasons = [
  {
    icon: FaShieldAlt,
    title: "Process security",
    text: "We keep the order of actions, documents, reservation steps, legal communication and purchase decisions under control.",
  },
  {
    icon: FaGlobeEurope,
    title: "Access to a broad market",
    text: "We do not limit clients to one database. We compare projects, locations, developers and the actual investment sense.",
  },
  {
    icon: FaHandshake,
    title: "Buyer-side representation",
    text: "Our reference point is the buyer’s goal: a second home, investment, rental income, resale or capital protection.",
  },
  {
    icon: FaKey,
    title: "Support after selection",
    text: "We help move from decision to notarial deed, furnishing, property preparation and rental management.",
  },
];

const process = [
  "A conversation about purchase goals, budget and acceptable risk level.",
  "Market selection and comparison of offers that genuinely match the brief.",
  "Property viewings, location analysis and review of running costs.",
  "Reservation, formalities, legal support and preparation for use.",
];

const stats = [
  { value: "90%", label: "of the best market opportunities through partner access." },
  { value: "100%", label: "primary-market access through cooperation with developers." },
  { value: "1", label: "clear process from selection to handover." },
];

const testimonials = [
  {
    text: "Onesta structured the whole process very well. Instead of browsing random offers, we quickly understood which locations and projects made sense for our goal.",
    author: "Anna, Wrocław",
  },
  {
    text: "We were buying for private use and rental. The biggest value was calm analysis, precise questions and step-by-step guidance.",
    author: "Robert, Warsaw",
  },
  {
    text: "Very good communication and clear process management. Without this support, buying abroad would have been much harder.",
    author: "Tomasz, Wrocław",
  },
];

const teamTitleMap: Record<string, string> = {
  "Co-founder & CEO": "Co-founder & CEO",
  "Co-Fonder": "Co-founder",
  "Konsultant ds. klientów inwestycyjnych": "Investment Client Consultant",
};

const teamDescriptionMap: Record<string, string> = {
  "Marek Marszałek":
    "In work with clients, I focus on relationships and openness. I pay close attention to understanding each buyer’s needs, continuously expanding market knowledge and knowing the local lifestyle in Spain. This allows me to present relevant offers and give concrete answers. My approach is based on 15 years of sales experience, attention to detail, process safety and clear communication.",
  "Karolina Bakowicz":
    "I am creative and genuinely connected with Spain. Alongside strong knowledge of the real estate market, I know the local lifestyle and attractions, which helps me suggest the right places to buy property in Spain. I gladly share this knowledge so clients can understand Spain faster and feel closer to their second home.",
  "Przemysław Krzywański":
    "I can clearly and practically explain the advantages of investing in Spanish real estate. I am thorough, patient and focused on listening carefully, which helps me ask the right questions, define the best solution and present offers that match the client’s preferences and needs.",
};

export default function EnglishHomePage() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(false);

  const handleConsultationPopUp = () => setConsultationOpen((open) => !open);

  React.useEffect(() => {
    const show = () => setShowEnhancements(true);
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(show, { timeout: 1200 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timeout = globalThis.setTimeout(show, 700);
    return () => globalThis.clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <title>Overseas properties in Spain and Cyprus | Onesta Group</title>
        <meta
          name="description"
          content="Onesta Group guides buyers through overseas property purchase: offer selection, market analysis, viewings, formalities, handover and rental management."
        />
        <link rel="alternate" hrefLang="pl" href="https://onesta.com.pl/" />
        <link rel="alternate" hrefLang="en" href="https://onesta.com.pl/en" />
        <meta property="og:image" content="https://onesta.com.pl/onesta_og_img.png" />
      </Head>

      <main
        className={`${WorkSans.className} main-index min-h-screen overflow-hidden bg-[#f7f3ec] text-[#172033]`}
      >
        {showEnhancements && <WhatsAppButton />}
        {showEnhancements && (
          <Consultation
            handleConsultationPopUp={handleConsultationPopUp}
            ConsultationsShowed={consultationOpen}
          />
        )}
        <Header
          locale="en"
          handleConsultationPopUp={handleConsultationPopUp}
        />

        <section className="relative bg-[#fbf8f2] pt-[92px] lg:min-h-[760px]">
          <div className="absolute inset-x-0 bottom-0 h-32" />

          <div className="relative mx-auto grid w-11/12 max-w-7xl items-start gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="order-1 lg:order-1 lg:pt-10">
              <h1
                className={`${PlayfairSans.className} -mt-[50px] max-w-4xl text-5xl font-semibold leading-[1.04] text-[#182334] md:text-5xl`}
              >
                Overseas property bought wisely and safely.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-6 text-[#4a5568] md:text-md">
                We help you choose property in Spain, Cyprus and other warm
                markets based on location, costs, formalities and real use or
                rental potential.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/en/properties/hiszpania"
                  className="inline-flex h-12 items-center gap-3 rounded-md bg-[#182334] px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c]"
                >
                  View offers <FaArrowRight />
                </Link>
                <button
                  onClick={handleConsultationPopUp}
                  className="inline-flex h-12 items-center rounded-md border border-[#cdbb9d] px-6 text-sm font-semibold uppercase tracking-wide text-[#182334] transition hover:border-[#182334] hover:bg-white"
                >
                  Free consultation
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
                  sizes="(min-width: 1024px) 52vw, 90vw"
                  className="object-cover"
                  alt="Spanish coastline"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 max-w-md p-7 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                    Market selection
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">
                    We choose location, project and process so the decision
                    still makes sense after you return home.
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
                        {teamTitleMap[person.title] || person.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#e5dac7] pt-5">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                    Buyer-side team
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#5f6b7a]">
                    You work with people who understand the local market, the
                    purchase process and real issues faced by clients buying
                    abroad.
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

        <section className="mx-auto w-11/12 max-w-7xl py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              How we choose the market
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Not every beautiful offer is a good decision.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              We first define the purchase goal: private use, rental income,
              capital protection or a second home. Only then do we match region,
              project, budget and formal process.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                    Explore <FaArrowRight />
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
                alt="Apartment by the sea"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                  Process
                </p>
                <p
                  className={`${PlayfairSans.className} mt-3 max-w-md text-4xl font-semibold leading-tight`}
                >
                  From the first conversation to keys and ongoing support.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
                How we work
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                The process should remove chaos, not add more questions.
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
                Investor trip
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                The best decisions are made after seeing the location in person.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/76">
                We prepare an intensive trip where you compare properties,
                surroundings, infrastructure, costs and rental potential. It
                shortens the route to a sound decision.
              </p>
              <Link
                href="/en/investor-trip"
                className="mt-8 inline-flex h-12 items-center gap-3 rounded-md bg-[#d6b36a] px-6 text-sm font-bold uppercase tracking-wide text-[#111827] transition hover:bg-white"
              >
                Plan a viewing trip <FaArrowRight />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Viewings", "Selected offers compared with the market."],
                ["Locations", "Cities, districts, beaches, access and services."],
                ["Costs", "Maintenance, taxes, community fees and furnishing."],
                ["Decision", "A clear reservation and formalities plan."],
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
              Profiles
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              The people who guide you through the process.
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
                    {teamTitleMap[person.title] || person.title}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-[#5f6b7a]">
                    {teamDescriptionMap[person.name] || person.desc}
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
                Client feedback
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Clients value selection, communication and calm process control.
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
              Contact
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Tell us what you are looking for. We will answer specifically.
            </h2>
          </div>
          <ContactFormMain locale="en" />
        </section>

        <Footer locale="en" />
      </main>
    </>
  );
}
