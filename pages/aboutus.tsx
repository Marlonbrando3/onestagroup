import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiFileText,
  FiFilter,
  FiKey,
  FiMessageCircle,
  FiPhone,
  FiPlus,
  FiShield,
} from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFormMain from "@/components/ContactFormMain";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { SITE_URL } from "@/lib/publicSeo";
import { ORGANIZATION_ID, organizationJsonLd } from "@/lib/organizationSchema";
import { aboutFaqs, aboutPage, companyFacts, principles, teamMembers } from "@/data/aboutUs";
import styles from "@/styles/polishAgency.module.css";
import hero from "@/styles/polishAgencyHero.module.css";
import about from "@/styles/aboutUs.module.css";

const pageUrl = SITE_URL + aboutPage.path;
const principleIcons = [FiMessageCircle, FiFilter, FiShield, FiFileText, FiClock, FiKey];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...organizationJsonLd()["@graph"],
    {
      "@type": "AboutPage",
      "@id": pageUrl + "#webpage",
      url: pageUrl,
      name: aboutPage.title,
      description: aboutPage.description,
      inLanguage: "pl-PL",
      about: { "@id": ORGANIZATION_ID },
      mainEntity: { "@id": ORGANIZATION_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: SITE_URL + aboutPage.teamImage },
    },
    ...teamMembers.map((person) => ({
      "@type": "Person",
      "@id": `${pageUrl}#${person.id}`,
      name: person.name,
      jobTitle: person.role,
      worksFor: { "@id": ORGANIZATION_ID },
      knowsLanguage: person.languages.map((code) => code.toLowerCase()),
    })),
    {
      "@type": "FAQPage",
      "@id": pageUrl + "#faq",
      inLanguage: "pl-PL",
      mainEntity: aboutFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export default function AboutUs() {
  return (
    <>
      <Header />
      <div
        className={`${styles.page} ${HomeMontserratSans.className}`}
        style={{ "--agency-serif": HomePlayfairSans.style.fontFamily } as CSSProperties}
      >
        <Head>
          <title>{aboutPage.title}</title>
          <meta name="description" content={aboutPage.description} />
          <meta name="robots" content="index,follow,max-image-preview:large" />
          <link rel="canonical" href={pageUrl} />
          <link rel="alternate" hrefLang="pl" href={pageUrl} />
          <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en/about-us`} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="pl_PL" />
          <meta property="og:site_name" content="Onesta Group" />
          <meta property="og:title" content={aboutPage.title} />
          <meta property="og:description" content={aboutPage.description} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:image" content={SITE_URL + aboutPage.teamImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <script
            id="about-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
          />
        </Head>

        <a href="#tresc" className={styles.skipLink}>Przejdź do treści</a>
        <main id="tresc">
          <section className={`${hero.hero} ${about.hero}`} aria-labelledby="about-h1">
            <div className={hero.photo} aria-hidden="true">
              <Image src={aboutPage.heroImage} alt="" fill priority sizes="100vw" className={styles.cover} />
            </div>
            <div className={`${styles.container} ${hero.inner} ${about.heroInner}`}>
              <div className={hero.copy}>
                <p className={hero.eyebrow}>O nas · Onesta Group</p>
                <h1 id="about-h1" className={hero.title}>
                  Ludzie, którzy prowadzą Cię <em>przez zakup w&nbsp;Hiszpanii</em>
                </h1>
                <p className={hero.claim}>
                  Polska spółka z biurami we Wrocławiu, Opolu i San Javier. Pomagamy podjąć dobrą
                  decyzję — i bezpiecznie ją przeprowadzić.
                </p>
                <div className={hero.actions}>
                  <a href="#zespol" className={hero.primary}>
                    Poznaj zespół <FiArrowRight aria-hidden="true" />
                  </a>
                  <a href="#kontakt" className={hero.secondary}>
                    Umów rozmowę
                  </a>
                </div>
                <ul className={hero.facts}>
                  <li><FiCheck aria-hidden="true" />0% prowizji dla kupującego</li>
                  <li><FiCheck aria-hidden="true" />Biura w Polsce i w Hiszpanii</li>
                  <li><FiCheck aria-hidden="true" />Po polsku, angielsku i hiszpańsku</li>
                </ul>
              </div>
              <figure className={hero.team}>
                <div className={hero.teamPhoto}>
                  <Image
                    src={aboutPage.teamImage}
                    alt="Marek Marszałek i Karolina Bakowicz, współzałożyciele Onesta Group"
                    fill
                    priority
                    sizes="(min-width: 1280px) 400px, 320px"
                    className={styles.cover}
                  />
                </div>
              </figure>
            </div>
          </section>

          <div className={`${styles.container} ${styles.breadcrumbs}`}>
            <nav aria-label="Ścieżka nawigacji">
              <Link href="/">Strona główna</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">O nas</span>
            </nav>
          </div>

          <section className={`${styles.container} ${about.story}`} aria-labelledby="story-heading">
            <div>
              <p className={styles.eyebrow}>Skąd nazwa</p>
              <h2 id="story-heading">
                <span className={about.word}>onesta</span> — po włosku: uczciwa.
              </h2>
            </div>
            <div className={about.storyCopy}>
              <p className={styles.lead}>
                Nazwę wybraliśmy celowo. Zakup domu za granicą to duża decyzja w obcym języku,
                według obcych przepisów — a te same ogłoszenia krążą po dziesiątkach agencji.
                W takiej sytuacji najcenniejsze jest zaufanie do ludzi, którzy prowadzą transakcję.
              </p>
              <p>
                Onesta Group założyli Marek Marszałek i Karolina Bakowicz. Działamy po stronie
                kupującego: wynagrodzenie pokrywa sprzedający lub deweloper, więc nie musimy
                „dopychać” konkretnej oferty. Możemy powiedzieć, że coś się nie opłaca, że okolica
                zimą pustoszeje albo że cena jest za wysoka.
              </p>
              <p>
                Skupiamy się na hiszpańskim wybrzeżu — Costa Blanca, Costa Cálida, Costa del Sol
                i Costa de Almería. Własne biuro w San Javier pozwala nam oglądać inwestycje,
                znać okolice i być na miejscu, gdy klient przylatuje na prezentacje.
              </p>
            </div>
          </section>

          <section className={about.principlesSection} aria-labelledby="principles-heading">
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Jak pracujemy</p>
                <h2 id="principles-heading">Sześć zasad, których się trzymamy.</h2>
              </div>
              <div className={about.principles}>
                {principles.map(({ title, text }, index) => {
                  const Icon = principleIcons[index];
                  return (
                    <article key={title} className={about.principle}>
                      <span className={about.principleIcon}><Icon aria-hidden="true" /></span>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="zespol" className={`${styles.container} ${styles.section}`} aria-labelledby="team-heading">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Zespół</p>
              <h2 id="team-heading">Z kim rozmawiasz.</h2>
              <p className={styles.lead}>
                Każdy klient ma jednego opiekuna od pierwszej rozmowy do odbioru kluczy. Za nim
                stoi zespół w Polsce i w Hiszpanii.
              </p>
            </div>
            <div className={about.team}>
              {teamMembers.map((person) => (
                <article key={person.id} id={person.id} className={about.member}>
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
                    {person.phone && (
                      <a href={`tel:${person.phone.replace(/\s/g, "")}`} className={about.phone}>
                        <FiPhone aria-hidden="true" /> {person.phone}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={about.companySection} aria-labelledby="company-heading">
            <div className={`${styles.container} ${about.company}`}>
              <div>
                <p className={`${styles.eyebrow} ${about.companyEyebrow}`}>Działamy jawnie</p>
                <h2 id="company-heading">Dane firmy.</h2>
                <p className={about.companyLead}>
                  Zanim przelejesz komukolwiek pieniądze za granicę, sprawdź, z kim rozmawiasz.
                  Nasze dane rejestrowe są publiczne — spółkę znajdziesz w rejestrze KRS po numerze NIP.
                </p>
              </div>
              <dl className={about.facts}>
                {companyFacts.map(({ label, value, href }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{href ? <a href={href}>{value}</a> : value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className={`${styles.container} ${about.next}`} aria-label="Dalej">
            <Link href="/polskie-biuro-nieruchomosci-w-hiszpanii" className={about.nextCard}>
              <span className={`${styles.eyebrow} ${about.nextEyebrow}`}>Proces zakupu</span>
              <strong>Jak wygląda współpraca krok po kroku</strong>
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/nieruchomosci/hiszpania" className={about.nextCard}>
              <span className={`${styles.eyebrow} ${about.nextEyebrow}`}>Oferty</span>
              <strong>Nieruchomości w Hiszpanii na sprzedaż</strong>
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/zarzadzanie-nieruchomosciami-w-hiszpanii" className={about.nextCard}>
              <span className={`${styles.eyebrow} ${about.nextEyebrow}`}>Po zakupie</span>
              <strong>Zarządzanie i wynajem nieruchomości</strong>
              <FiArrowRight aria-hidden="true" />
            </Link>
          </section>

          <section id="pytania" className={`${styles.container} ${styles.section} ${styles.faqSection}`} aria-labelledby="faq-heading">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Pytania o firmę</p>
              <h2 id="faq-heading">Zanim zaufasz,<br />zapytaj.</h2>
            </div>
            <div>
              {aboutFaqs.map(({ question, answer }, index) => (
                <details key={question} className={styles.faqItem}>
                  <summary>
                    <span className={styles.faqNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span>{question}</span>
                    <FiPlus aria-hidden="true" className={styles.faqIcon} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="kontakt" className={styles.contactSection} aria-label="Kontakt z Onesta Group">
            <ContactFormMain className={styles.contactForm} reference="O nas" />
            <p className={styles.contactNote}>Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje.</p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
