import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contactform from "@/components/contactfrom/contactform";
import Consultation from "@/components/consulatation/consultation";
import { WorkSans, PlayfairSans } from "@/fonts/fonts";
import {
  FaArrowRight,
  FaChartLine,
  FaCheck,
  FaHandshake,
  FaKey,
  FaMapMarkedAlt,
  FaPlaneDeparture,
  FaShieldAlt,
} from "react-icons/fa";

const highlights = [
  { value: "2 days", label: "of property viewings and on-site market analysis" },
  { value: "90%", label: "of market offers through our partner network" },
  { value: "6-8%", label: "indicative return from well-selected rental property" },
];

const itinerary = [
  {
    icon: FaPlaneDeparture,
    title: "Before arrival",
    text: "We define your budget, purchase goal, regions and criteria. We select offers that are genuinely worth seeing in person.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Day 1: market and locations",
    text: "You view properties, developments, surroundings, beaches and infrastructure. We compare offer photos with the real location.",
  },
  {
    icon: FaChartLine,
    title: "Day 2: investment decision",
    text: "We analyze prices, rental potential, running costs, formalities and risks. You leave with a clear plan for the next steps.",
  },
  {
    icon: FaKey,
    title: "After choosing the property",
    text: "We guide the reservation, NIE number, bank account, notarial deed, furnishing and preparation of the property for rental.",
  },
];

const criteria = [
  "location and character of the town",
  "distance to the sea and services",
  "building standard and common areas",
  "real rental demand in the region",
  "community fees, taxes and running costs",
  "future resale potential",
];

const reasons = [
  {
    title: "Photos do not show the surroundings",
    text: "Half of the decision value is the property itself; the other half is the area, access, neighborhood, services and how the place lives outside the camera frame.",
  },
  {
    title: "The market changes very quickly",
    text: "Offers can disappear during a single visit. That is why we prepare a broader viewing plan, not a trip based on one property.",
  },
  {
    title: "You are buying a strategy, not just an apartment",
    text: "On site, we connect the property choice with your goal: private use, rental income, resale or a safe second home.",
  },
];

export default function EnglishInvestorTripPage() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const handleConsultationPopUp = () => setConsultationOpen((open) => !open);

  return (
    <>
      <Head>
        <title>Investor trip in Spain | Onesta Group</title>
        <meta
          name="description"
          content="A two-day investor trip in Spain: property viewings, location analysis, rental model and purchase formalities with Onesta Group."
        />
        <link
          rel="alternate"
          hrefLang="pl"
          href="https://onesta.com.pl/pobytinwestorski"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://onesta.com.pl/en/investor-trip"
        />
      </Head>
      <main
        className={`${WorkSans.className} min-h-screen bg-[#f7f3ec] text-[#182334]`}
      >
        <Header locale="en" handleConsultationPopUp={handleConsultationPopUp} />
        <Consultation
          handleConsultationPopUp={handleConsultationPopUp}
          ConsultationsShowed={consultationOpen}
        />

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
                Investor trip for property buyers in Spain
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
                Two days on site, during which you view properties, compare
                regions, understand costs and make a decision based on the
                market, not only on photos.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleConsultationPopUp}
                  className="inline-flex h-12 items-center gap-3 rounded-md bg-[#d6b36a] px-6 text-sm font-bold uppercase tracking-wide text-[#111827] transition hover:bg-white"
                >
                  Book a consultation <FaArrowRight />
                </button>
                <a
                  href="#plan"
                  className="inline-flex h-12 items-center rounded-md border border-white/35 px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                >
                  See the trip plan
                </a>
              </div>
            </div>

            <div className="border border-white/18 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6b36a]">
                What you receive
              </p>
              <div className="mt-6 space-y-5">
                {[
                  "selection of offers matched to your budget",
                  "property and area viewings",
                  "rental, cost and formalities analysis",
                  "next-step plan after selection",
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
                  of buyers change their initial preferences after seeing offers
                  and locations in person.
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
              Why it matters
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              In Spain, you buy only after seeing the context.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              An investor trip structures the decision. Instead of choosing from
              screenshots and offer folders, you verify the places that will
              determine living comfort, rental attractiveness and resale value.
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
                Trip plan
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                A two-day process that ends with a clear decision.
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
                What we analyze
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                The property should generate income or serve you well.
                Preferably both.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/78">
                On site, we show why two offers that look similar in photos may
                have a completely different investment logic.
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
              What happens after the decision
            </p>
            <h2
              className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
            >
              Reservation, formalities and rental preparation in one process.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4a5568]">
              After you choose the property, we guide you through reservation,
              payments, NIE number, bank account, notarial deed and preparation
              of the apartment for personal use or rental.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "property reservation from approx. EUR 3,000",
              "coordination of documents and formalities",
              "furnishing and refreshment partners",
              "rental management option after purchase",
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

        <section id="kontakt" className="relative bg-[#111827] py-24">
          <span id="contact" className="absolute -top-24" aria-hidden="true" />
          <div className="mx-auto grid w-11/12 max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                Start
              </p>
              <h2
                className={`${PlayfairSans.className} mt-4 text-4xl font-semibold leading-tight md:text-5xl`}
              >
                Start with a conversation about your purchase goal.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                Describe your budget, arrival date and expected purchase model.
                We will come back with information on whether an investor trip
                makes sense in your situation and how to prepare it.
              </p>
            </div>
            <Contactform locale="en" />
          </div>
        </section>

        <Footer locale="en" />
      </main>
    </>
  );
}
