import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { FiArrowRight, FiAward, FiBriefcase, FiCalendar, FiCheck, FiCompass, FiFileText, FiHeart, FiHome, FiKey, FiMapPin, FiMessageCircle, FiPercent, FiPlus, FiSearch, FiShield, FiTool, FiUsers } from "react-icons/fi";
import ContactFormMain from "@/components/ContactFormMain";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgencyPropertySearch from "@/components/AgencyPropertySearch";
import AgencyQuickContact from "@/components/AgencyQuickContact";
import AgencyStats from "@/components/AgencyStats";

const ConsultationPopup = dynamic(() => import("@/components/consulatation/consultation"), { ssr: false });
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { SITE_URL } from "@/lib/publicSeo";
import { teamMembers } from "@/data/aboutUs";
import PropertyCard from "@/components/SearchEngine/PropertyCard";
import { loadAgencyShowcase, type AgencyShowcase } from "@/lib/agencyShowcase";
import {
  agencyFaqs,
  agencyPage,
  agencyRegions,
  agencySteps,
} from "@/data/polishAgency";
import styles from "@/styles/polishAgency.module.css";
import hero from "@/styles/polishAgencyHero.module.css";
import about from "@/styles/aboutUs.module.css";

const pageUrl = SITE_URL + agencyPage.path;
const organizationId = SITE_URL + "/#organization";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": organizationId,
      name: "Onesta Group",
      legalName: "Onesta Group Sp. z o.o.",
      url: SITE_URL,
      logo: SITE_URL + "/logotype_full_new.png",
      telephone: "+48576652525",
      email: "biuro@onesta.com.pl",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Wolbromska 18/1b",
        postalCode: "53-148",
        addressLocality: "Wrocław",
        addressCountry: "PL",
      },
      areaServed: [
        ...agencyRegions.map(({ name }) => name),
        "Alicante",
        "Torrevieja",
      ].map((name) => ({ "@type": "Place", name })),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+48576652525",
        email: "biuro@onesta.com.pl",
        contactType: "customer service",
        availableLanguage: ["pl"],
      },
    },
    {
      "@type": "WebPage",
      "@id": pageUrl + "#webpage",
      url: pageUrl,
      name: agencyPage.title,
      description: agencyPage.description,
      inLanguage: "pl-PL",
      about: { "@id": organizationId },
      publisher: { "@id": organizationId },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: SITE_URL + agencyPage.image,
      },
      breadcrumb: { "@id": pageUrl + "#breadcrumbs" },
      mainEntity: { "@id": pageUrl + "#service" },
      hasPart: { "@id": pageUrl + "#faq" },
    },
    {
      "@type": "Service",
      "@id": pageUrl + "#service",
      name: "Polskojęzyczna obsługa zakupu nieruchomości w Hiszpanii",
      serviceType: "Pośrednictwo w zakupie nieruchomości",
      provider: { "@id": organizationId },
      areaServed: { "@type": "Country", name: "Hiszpania" },
      description:
        "Selekcja ofert, organizacja prezentacji, koordynacja procesu zakupu i uzgodniona pomoc po transakcji. Biura na Costa Blanca i biura współpracujące na Costa del Sol. Obsługa zawsze po polsku.",
    },
    {
      "@type": "BreadcrumbList",
      "@id": pageUrl + "#breadcrumbs",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Polskie biuro nieruchomości w Hiszpanii",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": pageUrl + "#faq",
      inLanguage: "pl-PL",
      mainEntity: agencyFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

const offersWord = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return "oferta";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return "oferty";
  return "ofert";
};
const formatCount = (n: number) => n.toLocaleString("pl-PL");
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("");

export async function getStaticProps() {
  return { props: { showcase: await loadAgencyShowcase() }, revalidate: 3600 };
}


// Atuty współpracy: ikona + jeden akapit, pierwsza myśl pogrubiona.
const cooperationPoints = [
  { icon: FiHeart, lead: "Pracujesz z ludźmi z pasją", text: "do nieruchomości i do spełniania marzeń innych o własnym miejscu w Hiszpanii." },
  { icon: FiCompass, lead: "Rozumiemy, na jakim etapie jesteś.", text: "Wiemy, jakie pytania pojawiają się na każdym kroku zakupu. Podpowiadamy i tłumaczymy, co właśnie się dzieje i co czeka Cię dalej, a na wątpliwości odpowiadamy, zanim urosną." },
  { icon: FiMessageCircle, lead: "Wszystko w języku polskim", text: "— rozmowy, prezentacje, dokumenty i ustalenia, bez barier językowych." },
  { icon: FiUsers, lead: "Zespół w Polsce i w Hiszpanii.", text: "Możemy spotkać się z Tobą w Polsce na pierwsze poznanie, a dalej prowadzić Cię przez nasze biura i agentów w Hiszpanii." },
  { icon: FiShield, lead: "Bezpiecznie od A do Z", text: "— od wyboru, przez rezerwację i formalności z prawnikiem oraz notariuszem, po odbiór kluczy i, jeśli trzeba, umeblowanie mieszkania." },
  { icon: FiKey, lead: "Własny dział zarządzania.", text: "Po zakupie możemy zaopiekować się Twoją nieruchomością: serwis, opieka podczas nieobecności i obsługa wynajmu." },
];


// „Zobacz oferty” w hero przewija do następnego ekranu: liczby ofert + wyszukiwarka.
function scrollToOffers(event: ReactMouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("oferty");
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", "#oferty");
}

function Arrow() {
  return <FiArrowRight aria-hidden="true" />;
}

function BrandName() {
  return <strong className={styles.brandName}>Onesta Group</strong>;
}

function BrandText({ children }: { children: string }) {
  return <>{children.split("Onesta Group").map((text, index) => (
    <Fragment key={index}>{index > 0 && <BrandName />}{text}</Fragment>
  ))}</>;
}

const heroAssurances = [
  { icon: FiAward, text: "9 lat doświadczenia" },
  { icon: FiMessageCircle, text: "Pełna obsługa w języku polskim" },
  { icon: FiShield, text: "Bezpieczeństwo transakcji" },
  { icon: FiBriefcase, text: "Współpracujący prawnicy, notariusze i tłumacze" },
  { icon: FiHome, text: "Bezpośrednia współpraca z deweloperami" },
  { icon: FiMapPin, text: "Biura w Polsce i w Hiszpanii" },
  { icon: FiUsers, text: "Zespół nastawiony na Twoje potrzeby" },
  { icon: FiPercent, text: "0% prowizji dla kupującego" },
  { icon: FiCompass, text: "Prowadzenie zakupu od A do Z" },
  { icon: FiKey, text: "Umeblowanie apartamentu i zarządzanie wynajmem" },
];

export default function PolishRealEstateAgency({ showcase }: { showcase: AgencyShowcase }) {
  const { totalOffers, newBuildOffers, coastCounts, featured } = showcase;
  // Ten sam popup konsultacji dla przycisku w hero i „Umów konsultację” w menu.
  const [consultationOpen, setConsultationOpen] = useState(false);
  const toggleConsultation = () => setConsultationOpen((open) => !open);
  return (
    <>
    {consultationOpen && (
      <ConsultationPopup
        handleConsultationPopUp={toggleConsultation}
        ConsultationsShowed={consultationOpen}
      />
    )}
    <Header handleConsultationPopUp={toggleConsultation} />
    <div
      className={`${styles.page} ${HomeMontserratSans.className}`}
      style={{ "--agency-serif": HomePlayfairSans.style.fontFamily } as CSSProperties}
    >
      <Head>
        <title>{agencyPage.title}</title>
        <meta name="description" content={agencyPage.description} />
        <meta
          name="keywords"
          content="polskie biuro nieruchomości w Hiszpanii, polskie biura nieruchomości w Hiszpanii, polskie biura nieruchomości w Alicante, polskie biuro nieruchomości w Torrevieja, polska agencja nieruchomości w Hiszpanii"
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Onesta Group" />
        <meta property="og:title" content={agencyPage.title} />
        <meta property="og:description" content={agencyPage.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={SITE_URL + agencyPage.image} />
        <meta property="og:image:alt" content="Marek Marszałek i Karolina Bakowicz — zespół Onesta Group" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={agencyPage.title} />
        <meta name="twitter:description" content={agencyPage.description} />
        <meta name="twitter:image" content={SITE_URL + agencyPage.image} />
        <script
          id="polish-agency-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </Head>

      <a href="#tresc" className={styles.skipLink}>Przejdź do treści</a>
      <main id="tresc">
        <section className={hero.hero} aria-labelledby="agency-h1">
          <div className={hero.photo} aria-hidden="true">
            <Image
              src="/images/agency/hero-polskie-biuro.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.cover}
            />
          </div>
          <div className={`${styles.container} ${hero.inner}`}>
            <div className={hero.copy}>
              <p className={hero.eyebrow}>
                <BrandName /> · Costa&nbsp;Blanca · Costa&nbsp;del&nbsp;Sol · Costa&nbsp;Cálida · Costa&nbsp;de&nbsp;Almería
              </p>
              <h1 id="agency-h1" className={hero.title}>
                Polskie biuro nieruchomości <em>w&nbsp;Hiszpanii</em>
              </h1>
              <p className={hero.lead}>
                Prowadzimy cały zakup po polsku: od pierwszej rozmowy, przez
                wybór inwestycji i prezentacje na miejscu, po odbiór kluczy.
              </p>
              <ul className={hero.assurances} aria-label="Dlaczego Onesta Group">
                {heroAssurances.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className={hero.assuranceIcon}><Icon aria-hidden="true" /></span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className={hero.actions}>
                <a href="#oferty" className={hero.primary} onClick={scrollToOffers}>
                  Zobacz oferty <Arrow />
                </a>
                <button type="button" className={hero.secondary} onClick={toggleConsultation}>
                  Bezpłatna konsultacja
                </button>
              </div>
            </div>
            <figure className={hero.team}>
              <div className={hero.teamPhoto}>
                <Image
                  src="/images/agency/zespol-onesta.webp"
                  alt="Marek Marszałek i Karolina Bakowicz — zespół Onesta Group"
                  fill
                  priority
                  sizes="(min-width: 1280px) 400px, 320px"
                  className={styles.cover}
                />
              </div>
            </figure>
          </div>
        </section>

        <div id="oferty" className={hero.nextScreen}>
          {totalOffers ? (
            <AgencyStats
              totalOffers={totalOffers}
              newBuildOffers={newBuildOffers}
              containerClassName={styles.container}
            />
          ) : null}

          <section className={hero.searchBand} aria-label="Wyszukiwarka ofert">
            <div className={styles.container}>
              <AgencyPropertySearch />
            </div>
          </section>
        </div>

        <section id="o-biurze" className={styles.cooperation} aria-labelledby="about-heading">
          <div className={`${styles.container} ${styles.cooperationGrid}`}>
            <div className={styles.cooperationIntro}>
              <p className={styles.eyebrow}>Poznaj <BrandName /></p>
              <h2 id="about-heading">Co zyskujesz, współpracując z&nbsp;nami</h2>
              <p>
                Mamy duże doświadczenie w pracy z klientem — nie tylko
                w nieruchomościach, ale też w innych branżach. Zawsze opieraliśmy
                ją na wiedzy: zdobywaliśmy ją, przekazywaliśmy w zrozumiały sposób
                i na jej podstawie doradzaliśmy przy ważnych zakupach.
              </p>
              <a href="#zespol" className={styles.textLink}>Poznaj nasz zespół <Arrow /></a>
            </div>
            <ul className={styles.cooperationList}>
              {cooperationPoints.map(({ icon: Icon, lead, text }) => (
                <li key={lead}>
                  <span className={styles.cooperationIcon}><Icon aria-hidden="true" /></span>
                  <p><strong>{lead}</strong> {text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>


        <section id="jak-pomagamy" className={styles.processSection} aria-labelledby="process-heading">
          <div className={styles.container}>
            <div className={styles.processIntro}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Jak pomagamy</p>
                <h2 id="process-heading">Od pierwszej rozmowy<br />do odbioru kluczy.</h2>
                <p className={styles.lead}>
                  Wiesz, na jakim etapie jesteś, co porównujemy i kto zajmuje się
                  kolejnymi sprawami. Przez cały proces masz polskojęzyczną obsługę <BrandName />.
                </p>
              </div>
            </div>
            <ol className={styles.steps}>
              {agencySteps.map(({ title, text }, index) => (
                <li key={title}>
                  <span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span>
                  <div className={styles.stepCopy}><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ol>
            <div className={styles.processNote}>
              <div className={styles.processNoteMessage}>
                <span className={styles.processNoteIcon} aria-hidden="true"><FiArrowRight /></span>
                <p>
                  <strong>Masz przestrzeń na decyzję.</strong> Pierwszy przyjazd
                  może służyć poznaniu rynku. Jeżeli żadna oferta nie pasuje,
                  wracamy do selekcji. Plan i długość prezentacji ustalamy przed podróżą.
                </p>
              </div>
              <Link href="/pobytinwestorski" className={styles.textLink}>Poznaj pobyt inwestorski <Arrow /></Link>
            </div>
            <Link href="/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces" className={styles.textLink}>
              Przeczytaj szczegółowy poradnik o procesie zakupu <Arrow />
            </Link>
          </div>
        </section>

        <section id="regiony" className={styles.regionsSection} aria-labelledby="regions-heading">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Gdzie działamy</p>
              <h2 id="regions-heading">Znajdź swoją część Hiszpanii.</h2>
              <p className={styles.lead}>
                Poznaj różnice między regionami, zanim wybierzesz nieruchomość.
                Nasze biura na Costa Blanca i biura współpracujące na Costa del Sol
                pomagają przejść od porównania lokalizacji do prezentacji na miejscu.
              </p>
            </div>
            <div className={styles.regionGrid}>
              {agencyRegions.map(({ name, slug, label, text }) => (
                <article key={slug}>
                  <Link href={`/nieruchomosci/hiszpania/${slug}`} className={styles.regionImageLink} aria-label={`Zobacz nieruchomości: ${name}`}>
                    <div className={styles.regionImage}>
                      <Image src={`/images/seo/coasts/${slug}.webp`} alt={`Nadmorski krajobraz — ${name}`} fill sizes="(min-width: 1100px) 22vw, (min-width: 600px) 44vw, 90vw" className={styles.cover} />
                    </div>
                    <div className={styles.regionCopy}>
                      <p className={styles.regionLabel}>
                        {label}
                        {coastCounts[slug] ? <span className={about.regionCount}>{formatCount(coastCounts[slug])} {offersWord(coastCounts[slug])}</span> : null}
                      </p>
                      <h3>{name}<Arrow /></h3>
                      <p className={styles.regionDescription}>{text}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {featured.length ? (
          <section id="wybrane-oferty" className={`${styles.container} ${styles.section}`} aria-labelledby="featured-heading">
            <div className={about.featuredHead}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Wybrane przez nas</p>
                <h2 id="featured-heading">Nowe inwestycje, które polecamy.</h2>
                <p className={styles.lead}>
                  Kilka projektów z rynku pierwotnego, które znamy i chętnie pokazujemy na miejscu.
                  Pełną selekcję przygotujemy po rozmowie o Twoich planach.
                </p>
              </div>
              <Link href="/nieruchomosci/hiszpania?market=true" className={styles.textLink}>
                Wszystkie nowe inwestycje {newBuildOffers ? `(${formatCount(newBuildOffers)})` : ""} <Arrow />
              </Link>
            </div>
            <div className={about.featuredGrid}>
              {featured.map((property: any) => (
                <PropertyCard key={property.external_id} property={property} locale="pl" appearance="cbtop" />
              ))}
            </div>
          </section>
        ) : null}

        <AgencyQuickContact />

        <section id="costa-blanca-costa-del-sol" className={`${styles.container} ${styles.section}`} aria-labelledby="local-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Biura i lokalna obsługa</p>
            <h2 id="local-heading">Polskie biuro nieruchomości na Costa Blanca i Costa del Sol.</h2>
            <p className={styles.lead}>
              Na Costa Blanca mamy własne biura, a na Costa del Sol działamy
              z biurami współpracującymi. W obu regionach zapewniamy obsługę
              po polsku — od selekcji ofert po zakup.
            </p>
          </div>
          <div className={styles.twoColumns}>
            <article className={styles.localArticle}>
              <div className={styles.localImage}>
                <Image src="/images/seo/coasts/costa-blanca.webp" alt="Nadmorskie domy i zatoka na Costa Blanca" fill sizes="(min-width: 600px) 42vw, 88vw" className={styles.cover} />
              </div>
              <h3>Costa Blanca: nasze biura na miejscu</h3>
              <p>
                Nasze biura na Costa Blanca zapewniają lokalne wsparcie przy
                wyborze i zakupie nieruchomości. Pomagamy porównać Alicante,
                Torrevieję, Calpe, Guardamar del Segura i inne miejscowości
                wybrzeża, uwzględniając Twój budżet i sposób korzystania z nieruchomości.
              </p>
              <p>
                Ustalamy obszar poszukiwań, przygotowujemy preselekcję ofert
                i planujemy prezentacje. Na miejscu pokazujemy również
                otoczenie: plaże, sklepy, dojazdy i charakter dzielnicy.
                Przez cały proces rozmawiasz z nami po polsku.
              </p>
              <Link href="/nieruchomosci/hiszpania/costa-blanca" className={styles.textLink}>Zobacz nieruchomości na Costa Blanca <Arrow /></Link>
            </article>
            <article className={styles.localArticle}>
              <div className={styles.localImage}>
                <Image src="/images/seo/coasts/costa-del-sol.webp" alt="Nadmorska zabudowa i śródziemnomorski krajobraz Costa del Sol" fill sizes="(min-width: 600px) 42vw, 88vw" className={styles.cover} />
              </div>
              <h3>Costa del Sol: biura współpracujące</h3>
              <p>
                Na Costa del Sol współpracujemy z lokalnymi biurami, łącząc
                ich znajomość rynku z polskojęzyczną obsługą <BrandName />.
                Pomagamy znaleźć apartament lub dom m.in. w Esteponie,
                Marbelli, Mijas i okolicznych miejscowościach.
              </p>
              <p>
                Porównujemy lokalizacje, standard inwestycji i koszty utrzymania
                pod kątem Twoich planów. Z biurami partnerskimi organizujemy
                prezentacje wybranych ofert i koordynujemy kolejne etapy zakupu.
                Obsługa pozostaje po polsku także przy współpracy z lokalnymi partnerami.
              </p>
              <Link href="/nieruchomosci/hiszpania/costa-del-sol" className={styles.textLink}>Zobacz nieruchomości na Costa del Sol <Arrow /></Link>
            </article>
          </div>
        </section>

        <section className={styles.supportSection} aria-labelledby="support-heading">
          <div className={`${styles.container} ${styles.supportGrid}`}>
            <div>
              <div className={styles.supportTitle}>
                <Image
                  src="/images/seo/coasts/costa-blanca.webp"
                  alt=""
                  fill
                  sizes="(min-width: 900px) 40vw, 88vw"
                  className={styles.cover}
                />
                <div className={styles.supportTitleCopy}>
                  <p className={styles.eyebrow}>Także po zakupie</p>
                  <h2 id="support-heading">Klucze to początek<br />Twojego miejsca.</h2>
                </div>
              </div>
              <p className={styles.lead}>
                Kiedy wracasz do Polski, sprawy w Hiszpanii nadal mogą wymagać
                lokalnej obecności. Dlatego dalszą pomoc warto zaplanować przed zakupem.
              </p>
              <Link href="/zarzadzanie-nieruchomosciami-w-hiszpanii" className={styles.textLink}>Poznaj obsługę nieruchomości <Arrow /></Link>
            </div>
            <div className={styles.supportCopy}>
              <h3><span className={styles.supportIcon}><FiTool aria-hidden="true" /></span>Przygotowanie do zamieszkania</h3>
              <p>
                Pomagamy ustalić, co trzeba zrobić przed pierwszym pobytem:
                odbiór, zgłoszenie usterek, media, umeblowanie czy kontakt
                z wykonawcami. Dobieramy zakres do stanu nieruchomości i Twojego
                planu. Usługi partnerów oraz ich koszty uzgadniamy osobno.
              </p>
              <h3><span className={styles.supportIcon}><FiCalendar aria-hidden="true" /></span>Organizacja opieki i wynajmu</h3>
              <p>
                Jeżeli chcesz powierzyć nieruchomość lokalnej firmie, pomagamy
                w kontakcie z obsługą i określeniu potrzeb. Plan wynajmu
                uwzględniamy już podczas selekcji ofert. Możliwości najmu
                turystycznego sprawdza się dla konkretnej nieruchomości oraz
                aktualnych wymogów lokalnych.
              </p>
            </div>
          </div>
        </section>

        <section id="koszty" className={`${styles.container} ${styles.section} ${styles.costGrid}`} aria-labelledby="cost-heading">
          <div>
            <p className={styles.eyebrow}>Jasne zasady</p>
            <h2 id="cost-heading" className={styles.costHeading}>
              <span>Prowizja od sprzedaży przy współpracy z <BrandName /> wynosi</span>{" "}
              <span className={styles.costValue}>0 zł</span>{" "}
              <span className={styles.costAudience}>dla kupującego.</span>
            </h2>
          </div>
          <div>
            <p>
              Nie pobieramy od Ciebie prowizji za pośrednictwo w zakupie
              nieruchomości. Nasze wynagrodzenie pokrywa sprzedający, deweloper
              lub partner.
            </p>
            <p>
              Oddzielnie ustalamy zakres i koszty dodatkowych usług, takich jak
              obsługa prawna, tłumaczenia, wyposażenie lub zarządzanie po zakupie.
            </p>
            <p>
              Cena z ogłoszenia nie jest całkowitym budżetem. Uwzględniamy
              podatki i opłaty związane z zakupem oraz przyszłe wydatki:
              wspólnotę, media, ubezpieczenie i utrzymanie. Koszty zależą od
              regionu, rynku pierwotnego lub wtórnego i konkretnej transakcji.
            </p>
            <Link href="/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca" className={styles.textLink}>Przeczytaj o kosztach zakupu <Arrow /></Link>
          </div>
        </section>

        <AgencyQuickContact variant="conversation" />

        <section id="zespol" className={styles.teamSection} aria-labelledby="team-heading">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Po Twojej stronie</p>
              <h2 id="team-heading">Kim jesteśmy</h2>
              <p className={styles.lead}>Za ofertami stoją ludzie. Z nami omówisz wybór, zadasz pytania i zaplanujesz kolejne kroki po polsku.</p>
            </div>
            <div className={about.team}>
              {teamMembers.map((person) => (
                <article key={person.id} className={about.member}>
                  <div className={about.memberHead}>
                    <span className={about.monogram} aria-hidden="true">{initials(person.name)}</span>
                    <div>
                      <h3>{person.name}</h3>
                      <p className={about.role}>{person.role}</p>
                    </div>
                  </div>
                  <p className={about.bio}>{person.bio}</p>
                  <div className={about.memberFoot}>
                    <span className={about.languages} aria-label={`Języki: ${person.languages.join(", ")}`}>
                      {person.languages.map((code) => <span key={code}>{code}</span>)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/aboutus" className={styles.textLink}><span>Więcej o zespole <BrandName /></span> <Arrow /></Link>
          </div>
        </section>

        <section id="pytania" className={`${styles.container} ${styles.section} ${styles.faqSection}`} aria-labelledby="faq-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Pytania i odpowiedzi</p>
            <h2 id="faq-heading">Co warto wiedzieć<br />przed pierwszą rozmową?</h2>
            <p className={styles.lead}>Najczęstsze pytania o polskie biuro nieruchomości w Hiszpanii, prezentacje, formalności i dalszą opiekę.</p>
            <div className={styles.faqImage}>
              <Image src="/torrevieja-apartamenty-na-sprzedaz.png" alt="Słoneczna plaża i apartamenty przy morzu w Torrevieja" fill sizes="(min-width: 900px) 35vw, 88vw" className={styles.cover} />
            </div>
          </div>
          <div className={styles.faqList}>
            {agencyFaqs.map(({ question, answer }, index) => (
              <details key={question} className={styles.faqItem}>
                <summary>
                  <span className={styles.faqNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span><BrandText>{question}</BrandText></span>
                  <FiPlus aria-hidden="true" className={styles.faqIcon} />
                </summary>
                <p><BrandText>{answer}</BrandText></p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.guidesSection} aria-labelledby="guides-heading">
          <div className={styles.container}>
            <p className={styles.eyebrow}>Przygotuj się do zakupu</p>
            <h2 id="guides-heading">Więcej odpowiedzi w naszych poradnikach.</h2>
            <div className={styles.guideGrid}>
              {[
                ["jak-wybrac-biuro-nieruchomosci-w-hiszpanii", "Jak wybrać biuro nieruchomości?", "Na co zwrócić uwagę przy wyborze agencji w Hiszpanii, o co zapytać i jak ustalić zakres obsługi.", "/images/seo/coasts/costa-del-sol.webp", "Nadmorskie domy i panorama wybrzeża Costa del Sol"],
                ["nieruchomosci-w-hiszpanii-jak-wyglada-proces", "Zakup od pierwszej selekcji do aktu", "Praktyczny przewodnik po poszukiwaniach, prezentacjach i etapach transakcji.", "/costa-blanca-podstawowe-informacje.png", "Nowe domy z tarasami na Costa Blanca"],
                ["koszty-zakupu-nieruchomosci-hiszpania-costa-blanca", "Budżet szerszy niż cena oferty", "Wydatki związane z zakupem i utrzymaniem, o których warto porozmawiać przed decyzją.", "/images/seo/coasts/costa-calida.webp", "Apartamenty i promenada nad morzem na Costa Cálida"],
              ].map(([slug, title, text, photo, alt]) => (
                <article key={slug}>
                  <Link href={`/blog/${slug}`} className={styles.guideImage} tabIndex={-1} aria-hidden="true">
                    <Image src={photo} alt={alt} fill sizes="(min-width: 600px) 28vw, 88vw" className={styles.cover} />
                  </Link>
                  <h3><Link href={`/blog/${slug}`}>{title} <Arrow /></Link></h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="kontakt" className={styles.contactSection} aria-label="Kontakt z Onesta Group">
          <ContactFormMain className={styles.contactForm} reference="Polskie biuro nieruchomości w Hiszpanii" />
          <p className={styles.contactNote}>Pierwsza konsultacja jest bezpłatna. Obsługa zawsze po polsku.</p>
        </section>
      </main>

    </div>
    <Footer />
    </>
  );
}
