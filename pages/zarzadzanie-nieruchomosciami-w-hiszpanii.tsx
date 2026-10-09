import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { FiArrowDown, FiArrowRight, FiCheck, FiChevronDown, FiClock, FiCoffee, FiHome, FiKey, FiMapPin, FiMessageCircle, FiPhone, FiShield, FiTool } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyManagementCalculator from "@/components/PropertyManagementCalculator";
import PropertyManagementContact from "@/components/PropertyManagementContact";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { SITE_URL } from "@/lib/publicSeo";
import { HOLASTAY_RATES } from "@/lib/holastay";
import styles from "@/styles/propertyManagement.module.css";

const pageUrl = `${SITE_URL}/zarzadzanie-nieruchomosciami-w-hiszpanii`;
const title = "Zarządzanie nieruchomościami w Hiszpanii | HOLASTAY × Onesta";
const description = "Zarządzanie apartamentem w Hiszpanii z HOLASTAY: opieka techniczna, rezydent, sprzątanie i obsługa gości. Poznaj zakres, koszty i kalkulator wynajmu.";
const propertyUrl = "https://holastay.eu/offer/13/Flamenca-Village-Perla-del-Mar-apartament-w-kompleksie-wakacyjnym-z-podgrzewanymi-basenami";

const services = [
  { icon: FiTool, title: "Opieka nad apartamentem", text: "Regularne kontrole stanu technicznego i wyglądu mieszkania. Organizacja napraw oraz kontakt z lokalnymi fachowcami.", detail: "Hydraulik · elektryk · AGD · klimatyzacja" },
  { icon: FiHome, title: "Gotowy na kolejny pobyt", text: "Sprzątanie po rezerwacji, sprawdzenie wyposażenia i przygotowanie mieszkania przed przyjazdem kolejnych gości.", detail: "Czystość · wyposażenie · środki higieniczne" },
  { icon: FiKey, title: "Rezydent na miejscu", text: "Osobiste zameldowanie i wymeldowanie. Pomoc w trakcie pobytu oraz reagowanie na zgłoszenia gości przez całą dobę.", detail: "Check-in · check-out · pomoc 24 h" },
  { icon: FiShield, title: "Obsługa dokumentów gości", text: "Przygotowanie dokumentów potrzebnych do rejestracji gości. Dbałość o organizację przyjazdu i przebieg pobytu.", detail: "Dane gości · dokumentacja · organizacja" },
  { icon: FiCoffee, title: "Gościnność w szczegółach", text: "Pakiet powitalny z wodą, winem i drobnymi przekąskami. Małe gesty, które budują dobre doświadczenie z pobytu.", detail: "Powitanie · komfort · dobre wspomnienia" },
  { icon: FiMessageCircle, title: "Informacja dla właściciela", text: "Raportowanie zauważonych nieprawidłowości i organizacja ich obsługi. Wiesz, co dzieje się w Twojej nieruchomości.", detail: "Kontakt · zgłoszenia · koordynacja" },
];

const faqs = [
  { question: "Gdzie HOLASTAY obsługuje apartamenty?", answer: "HOLASTAY prezentuje apartamenty na Costa Blanca i Costa Cálida, między innymi w rejonie Orihuela Costa i Torrevieja. Możliwość objęcia opieką konkretnego adresu i dostępność lokalnego zespołu potwierdzamy indywidualnie." },
  { question: "Ile kosztuje zarządzanie apartamentem?", answer: "Oferta HOLASTAY wskazuje 15% prowizji od każdej rezerwacji oraz 60 EUR za usługę rezydenta po stronie właściciela. Sprzątanie 125 EUR i pralnia 80 EUR są po stronie gościa. Wszystkie podane stawki są netto. Podstawę prowizji, podatki, częstotliwość opłat i szczegóły rozliczeń należy potwierdzić w indywidualnej umowie." },
  { question: "Co dzieje się w razie awarii lub problemu podczas pobytu?", answer: "Zakres oferty obejmuje gotowość rezydenta do pomocy przez całą dobę podczas pobytu gości, reagowanie na zgłoszenia oraz organizację napraw z lokalnymi fachowcami. Koszt napraw i zasady akceptacji wydatków przez właściciela wymagają osobnego uzgodnienia." },
  { question: "Czy mogę korzystać z apartamentu na własne wakacje?", answer: "Przed rozpoczęciem współpracy omów z zespołem terminy swoich pobytów, sposób rezerwowania ich w kalendarzu i przygotowanie mieszkania po wyjeździe. Własne pobyty ograniczają dostępność apartamentu dla gości, dlatego uwzględnij je w planie wynajmu i kalkulacji." },
  { question: "Czy kalkulator pokazuje gwarantowany zysk?", answer: "Nie. Kalkulator przedstawia wynik dla podanych przez Ciebie założeń: liczby rezerwacji, długości pobytu, ceny za noc i wybranych kosztów. Nie prognozuje popytu ani obłożenia. Saldo nie uwzględnia podatku dochodowego, finansowania zakupu ani kosztów, których nie wpiszesz do symulacji." },
  { question: "Od czego zacząć, jeśli dopiero kupuję nieruchomość?", answer: "Najlepiej omówić plan wynajmu jeszcze przed zakupem. Onesta Group pomaga w wyborze nieruchomości, a z zespołem HOLASTAY możesz sprawdzić możliwość lokalnej obsługi i zakres przygotowania apartamentu. Warunki udostępniania nieruchomości gościom oraz wymagane formalności sprawdza się dla konkretnego lokalu." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: title, description, inLanguage: "pl-PL", breadcrumb: { "@id": `${pageUrl}#breadcrumbs` }, mainEntity: { "@id": `${pageUrl}#service` }, primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/images/management/flamenca-village.webp` } },
    { "@type": "Service", "@id": `${pageUrl}#service`, name: "Zarządzanie apartamentami wakacyjnymi w Hiszpanii", serviceType: "Zarządzanie nieruchomościami wakacyjnymi", provider: { "@type": "Organization", name: "HOLASTAY", url: "https://holastay.eu/" }, areaServed: ["Costa Blanca", "Costa Cálida"].map((name) => ({ "@type": "Place", name })), description: "Opieka techniczna nad apartamentem, przygotowanie lokalu, sprzątanie, pralnia, usługa rezydenta i wsparcie gości podczas pobytu." },
    { "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumbs`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Zarządzanie nieruchomościami w Hiszpanii", item: pageUrl }] },
    { "@type": "FAQPage", "@id": `${pageUrl}#faq`, mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ],
};

export default function PropertyManagementPage() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Onesta Group" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}/images/management/flamenca-village.webp`} />
        <meta property="og:image:alt" content="Apartamenty i ogrody Flamenca Village w Orihuela Costa — oferta HOLASTAY" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/images/management/flamenca-village.webp`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </Head>
      <Header />
      <div className={`${styles.page} ${HomeMontserratSans.className}`} style={{ "--management-serif": HomePlayfairSans.style.fontFamily } as CSSProperties}>
        <a href="#tresc-zarzadzanie" className={styles.skipLink}>Przejdź do treści</a>
        <main id="tresc-zarzadzanie">
          <section className={styles.hero} aria-labelledby="management-title">
            <div className={styles.heroCopy}>
              <nav className={styles.breadcrumbs} aria-label="Okruszki"><Link href="/">Onesta Group</Link><span aria-hidden="true">/</span><span>Zarządzanie</span></nav>
              <p className={styles.eyebrow}>Onesta Group × HOLASTAY</p>
              <h1 id="management-title">Zarządzanie nieruchomościami <em>w Hiszpanii.</em></h1>
              <p className={styles.heroTagline}>Twój apartament. Nasza opieka.</p>
              <p className={styles.heroLead}>Dom pod hiszpańskim słońcem zasługuje na dobrą opiekę. Z HOLASTAY zyskujesz lokalny zespół, który zadba o apartament i komfort Twoich gości.</p>
              <div className={styles.heroActions}><a href="#kontakt-zarzadzanie" className={styles.button}>Porozmawiajmy <FiArrowRight aria-hidden="true" /></a><a href="#kalkulator" className={styles.textLink}>Policz swój scenariusz <FiArrowDown aria-hidden="true" /></a></div>
              <p className={styles.heroLocation}><FiMapPin aria-hidden="true" /> Costa Blanca & Costa Cálida</p>
            </div>
            <div className={styles.heroVisual}>
              <Image src="/images/management/flamenca-village.webp" alt="Śródziemnomorskie ogrody i apartamenty Flamenca Village w Orihuela Costa" fill priority sizes="(min-width: 1000px) 51vw, 100vw" className={styles.cover} />
              <div className={styles.photoCaption}><span>W portfolio HOLASTAY</span><a href={propertyUrl} target="_blank" rel="noopener noreferrer">Flamenca Village · Orihuela Costa <FiArrowRight aria-hidden="true" /></a></div>
              <div className={styles.heroSeal}><FiKey aria-hidden="true" /><span>Blisko nieruchomości.<br /><strong>Blisko Twoich potrzeb.</strong></span></div>
            </div>
          </section>

          <div className={styles.trustStrip} aria-label="Najważniejsze informacje">
            <div className={styles.container}><p><FiMapPin aria-hidden="true" /><span>Lokalny zespół <strong>na miejscu w Hiszpanii</strong></span></p><p><FiClock aria-hidden="true" /><span>Pomoc rezydenta <strong>24 h podczas pobytu</strong></span></p><p><FiShield aria-hidden="true" /><span>Przejrzyste zasady <strong>i określony zakres opieki</strong></span></p></div>
          </div>

          <section id="opieka" className={`${styles.section} ${styles.container}`} aria-labelledby="care-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Z myślą o właścicielu</p><h2 id="care-title">Ty planujesz swój czas.<br /><em>My dbamy o szczegóły.</em></h2></div><p>Od przygotowania mieszkania po pomoc gościom w trakcie pobytu. HOLASTAY łączy codzienną opiekę nad nieruchomością z gościnnością, która zostaje w pamięci.</p></div>
            <div className={styles.services}>{services.map(({ icon: Icon, title: serviceTitle, text, detail }, index) => <article className={styles.service} key={serviceTitle}><div className={styles.serviceTop}><Icon aria-hidden="true" /><span>0{index + 1}</span></div><h3>{serviceTitle}</h3><p>{text}</p><span className={styles.serviceDetail}>{detail}</span></article>)}</div>
          </section>

          <section className={styles.partnerSection} aria-labelledby="partner-title">
            <div className={`${styles.container} ${styles.partnerGrid}`}>
              <figure className={styles.partnerPhoto}><Image src="/images/management/flamenca-pool.webp" alt="Basen i apartamenty w kompleksie Flamenca Village prezentowanym przez HOLASTAY" fill sizes="(min-width: 900px) 46vw, 100vw" className={styles.cover} /><figcaption>Flamenca Village · Costa Blanca</figcaption></figure>
              <div className={styles.partnerCopy}><Image src="/images/management/holastay-logo.png" alt="HOLASTAY" width={533} height={155} sizes="190px" className={styles.partnerLogo} /><p className={styles.eyebrow}>Ludzie, którym powierzasz klucze</p><h2 id="partner-title">Dobra opieka zaczyna się <em>od obecności.</em></h2><p>HOLASTAY to rodzinna firma związana z Hiszpanią i gościnnością. W jej ofercie znajdziesz wyposażone apartamenty na Costa Blanca i Costa Cálida.</p><p>Onesta Group pomaga wybrać nieruchomość. HOLASTAY zapewnia lokalną obsługę apartamentu i gości w uzgodnionym zakresie. Dzięki temu o opiece po zakupie możesz pomyśleć już na etapie wyboru mieszkania.</p><ul className={styles.checkList}><li><FiCheck aria-hidden="true" /> Opieka techniczna i lokalni fachowcy</li><li><FiCheck aria-hidden="true" /> Przygotowanie mieszkania i tekstyliów</li><li><FiCheck aria-hidden="true" /> Osobiste przyjęcie gości i pomoc na miejscu</li></ul><a href="https://holastay.eu/" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Poznaj HOLASTAY i apartamenty <FiArrowRight aria-hidden="true" /></a></div>
            </div>
          </section>

          <section id="koszty" className={`${styles.section} ${styles.container}`} aria-labelledby="cost-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Jasno o rozliczeniach</p><h2 id="cost-title">Wiesz, za co płacisz.<br /><em>Od samego początku.</em></h2></div><p>Stawki z oferty HOLASTAY. Koszty właściciela i opłaty gościa są pokazane osobno. Wszystkie kwoty poniżej są netto.</p></div>
            <div className={styles.pricingGrid}>
              <article className={styles.ownerPricing}><p className={styles.pricingLabel}>Po stronie właściciela</p><div className={styles.mainRate}><strong>{HOLASTAY_RATES.managementPercent}<span>%</span></strong><div><h3>Prowizja za zarządzanie</h3><p>netto od każdej rezerwacji</p></div></div><div className={styles.priceLine}><div><h3>Usługa rezydenta</h3><p>Osobiste przyjęcie i wymeldowanie gości, pomoc w trakcie pobytu.</p></div><strong>{HOLASTAY_RATES.residentPerStay} <span>EUR netto</span></strong></div><p className={styles.pricingFootnote}>W kalkulatorze przyjmujemy jedną opłatę za rezydenta na rezerwację. Częstotliwość naliczania potwierdź w umowie.</p></article>
              <article className={styles.guestPricing}><p className={styles.pricingLabel}>Po stronie gościa</p><h3>Apartament gotowy<br />na dobry wypoczynek.</h3><div className={styles.guestPriceLine}><span>Profesjonalne sprzątanie</span><strong>{HOLASTAY_RATES.cleaningPerStay} <small>EUR netto</small></strong></div><div className={styles.guestPriceLine}><span>Pralnia i tekstylia</span><strong>{HOLASTAY_RATES.laundryPerStay} <small>EUR netto</small></strong></div><div className={styles.guestTotal}><span>Łącznie za przygotowanie</span><strong>{HOLASTAY_RATES.cleaningPerStay + HOLASTAY_RATES.laundryPerStay} EUR netto</strong></div></article>
            </div>
            <p className={styles.pricingNote}>Podstawa prowizji, właściwy VAT/IVA, koszty portali i płatności, naprawy oraz harmonogram rozliczeń wymagają potwierdzenia w indywidualnej umowie. Zakres opieki technicznej obejmuje organizację napraw; nie oznacza pokrycia ich kosztów.</p>
          </section>

          <section id="kalkulator" className={styles.calculatorSection} aria-labelledby="calculator-title">
            <div className={styles.container}><div className={styles.calculatorHeading}><p className={styles.eyebrow}>Liczby dopasowane do Twoich planów</p><h2 id="calculator-title">Sprawdź swój <em>scenariusz wynajmu.</em></h2><p>Kilka założeń. Czytelne koszty. Lepszy punkt wyjścia do rozmowy.</p></div><PropertyManagementCalculator /><details className={styles.modelNotes}><summary>Jak liczymy ten przykład? <FiChevronDown aria-hidden="true" /></summary><p>Przychód z noclegów = liczba rezerwacji × liczba nocy × średnia cena za noc. Od tej kwoty liczymy 15% prowizji HOLASTAY, przed potrąceniem prowizji portali. Do każdej rezerwacji dodajemy 60 EUR netto za rezydenta. VAT/IVA naliczamy wyłącznie od tych dwóch usług według wpisanej stawki.</p><p>Stawki i długość pobytów są uśrednione dla całego roku. Model nie przewiduje sezonowości, odwołań ani pustych terminów. Cena noclegu nie obejmuje sprzątania i pralni, które w ofercie są kosztami gościa. Prowizje portali liczymy od noclegów; rzeczywista podstawa może być inna. Podstawę prowizji HOLASTAY i rozliczenia podatkowe potwierdź przed zawarciem umowy.</p><p>Saldo uwzględnia tylko koszty wskazane w kalkulatorze. Nie jest zyskiem netto ani obietnicą rentowności. Podatek dochodowy, raty kredytu, zakup i wyposażenie nieruchomości pozostają poza kalkulacją.</p></details></div>
          </section>

          <section className={`${styles.section} ${styles.container}`} aria-labelledby="start-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Od pierwszej rozmowy do pierwszych gości</p><h2 id="start-title">Dobrze przygotowany <em>początek.</em></h2></div><p>Ustalamy zakres obsługi dla Twojego apartamentu, planowany sposób korzystania i sprawy, które trzeba uporządkować przed wynajmem.</p></div><ol className={styles.steps}><li><span>01</span><h3>Poznajemy nieruchomość</h3><p>Lokalizacja, układ, standard i Twoje plany. Sprawdzamy możliwość lokalnej obsługi.</p></li><li><span>02</span><h3>Ustalamy zasady</h3><p>Zakres usług, opłaty, rozliczenia, własne pobyty i akceptacja kosztów napraw.</p></li><li><span>03</span><h3>Przygotowujemy apartament</h3><p>Przegląd wyposażenia, tekstylia, klucze i lista spraw do załatwienia przed przyjazdem gości.</p></li><li><span>04</span><h3>Dbamy o pobyty</h3><p>Przyjęcie gości, pomoc rezydenta i przygotowanie mieszkania na kolejną rezerwację.</p></li></ol></section>

          <section className={styles.faqSection} aria-labelledby="faq-title"><div className={`${styles.container} ${styles.faqGrid}`}><div><p className={styles.eyebrow}>Warto wiedzieć</p><h2 id="faq-title">Zanim powierzysz <em>nam klucze.</em></h2><p>Odpowiedzi na najczęstsze pytania właścicieli.</p><a href="#kontakt-zarzadzanie" className={styles.textLink}>Porozmawiajmy o szczegółach <FiArrowRight aria-hidden="true" /></a></div><div className={styles.faqList}>{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<FiChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>

          <section id="kontakt-zarzadzanie" className={`${styles.section} ${styles.container}`} aria-labelledby="contact-title"><div id="contact" className={styles.contactGrid}><div className={styles.contactCopy}><p className={styles.eyebrow}>Porozmawiajmy o Twoim apartamencie</p><h2 id="contact-title">Ty masz plany.<br /><em>My jesteśmy na miejscu.</em></h2><p>Masz już mieszkanie w Hiszpanii albo dopiero je wybierasz? Opowiedz nam o nim. Omówimy możliwości opieki i kolejne kroki.</p><a href="tel:+48576652525" className={styles.contactPhone}><FiPhone aria-hidden="true" /><span><small>Kontakt z Onesta Group</small>+48 576 65 25 25</span></a><a href="mailto:biuro@onesta.com.pl" className={styles.contactEmail}>biuro@onesta.com.pl</a><div className={styles.contactPartner}><span>Lokalna opieka nad apartamentem</span><Image src="/images/management/holastay-logo.png" alt="HOLASTAY" width={533} height={155} sizes="150px" /></div></div><PropertyManagementContact /></div></section>
          <div className={`${styles.container} ${styles.sourceNote}`}>Zakres i stawki na podstawie oferty zarządzania HOLASTAY. Apartamenty i regiony: <a href="https://holastay.eu/" target="_blank" rel="noopener noreferrer">holastay.eu</a>. Ostateczne warunki współpracy określa indywidualna umowa.</div>
        </main>
        <Footer />
      </div>
    </>
  );
}
