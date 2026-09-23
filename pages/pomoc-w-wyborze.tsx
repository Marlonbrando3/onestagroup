import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { FiArrowDown, FiArrowRight, FiCheck, FiCheckCircle, FiCompass, FiFileText, FiMapPin, FiMessageCircle, FiPhone, FiShield, FiSliders } from 'react-icons/fi';
import { HomeMontserratSans, HomePlayfairSans } from '@/fonts/homeFonts';
import { HELP_BUDGETS, HELP_UTM_KEYS, HELP_VARIANTS, helpVariant, validateHelpFields, type HelpErrors, type HelpFields, type HelpVariant } from '@/lib/helpChoosing';
import { trackHelpChoosing } from '@/lib/helpChoosingTracking';
import { cookieYesConsentState, subscribeToCookieYesConsent } from '@/lib/cookieConsent';
import styles from '@/styles/helpChoosing.module.css';

const benefits = [
  { icon: FiSliders, title: 'Jasne kryteria wyboru', text: 'Ustalimy, co jest dla Ciebie najważniejsze: lokalizacja, sposób korzystania, odległość od morza czy wielkość nieruchomości.', detail: 'Wiesz, czego szukać.' },
  { icon: FiFileText, title: 'Lepsze zrozumienie cen', text: 'Wyjaśnimy, skąd biorą się różnice między ofertami i jakie wydatki uwzględnić poza ceną zakupu.', detail: 'Porównujesz świadomie.' },
  { icon: FiCompass, title: 'Konkretny kierunek poszukiwań', text: 'Wskażemy lokalizacje i typy nieruchomości warte rozważenia. Na tej podstawie możemy przygotować dopasowane propozycje.', detail: 'Robisz następny krok.' },
];
const steps = [
  { title: 'Zostaw numer', text: 'Podaj podstawowe informacje. Nie musisz jeszcze wiedzieć dokładnie, czego szukasz.' },
  { title: 'Porozmawiajmy o Twoich planach', text: 'Doradca Onesta zadzwoni, żeby poznać Twoje oczekiwania i odpowiedzieć na pytania.' },
  { title: 'Ustalmy dalszy krok', text: 'Po rozmowie ustalimy, jakie lokalizacje i oferty warto sprawdzić oraz czy potrzebujesz dalszej pomocy.' },
];
const questions = [
  { question: 'Czy muszę wiedzieć, gdzie chcę kupić?', answer: 'Nie. Możemy zacząć od tego, jak chcesz korzystać z nieruchomości i na czym najbardziej Ci zależy.' },
  { question: 'Czy rozmowa zobowiązuje mnie do zakupu?', answer: 'Nie. To bezpłatna rozmowa, która pomoże Ci uporządkować plany i zdecydować o dalszych krokach.' },
  { question: 'Czy mogę porozmawiać o ofertach, które już znalazłem?', answer: 'Tak. Przygotuj linki i pytania, które chcesz omówić.' },
];

export default function HelpChoosing({ variant }: { variant: HelpVariant }) {
  const copy = HELP_VARIANTS[variant];
  const root = useRef<HTMLDivElement>(null);
  const heroCta = useRef<HTMLAnchorElement>(null);
  const contact = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const requestId = useRef('');
  const source = useRef<Record<string, string>>({});
  const started = useRef(false);
  const trackedPage = useRef({ analytics: false, advertisement: false });
  const [fields, setFields] = useState<HelpFields>({ name: '', phone: '+48 ', budget: '', message: '', privacy: false });
  const [errors, setErrors] = useState<HelpErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle');
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cookiesVisible, setCookiesVisible] = useState(false);

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = 'pl';
    const params = new URLSearchParams(window.location.search);
    source.current = Object.fromEntries(HELP_UTM_KEYS.flatMap(key => params.has(key) ? [[key, (params.get(key) || '').slice(0, 200)]] : []));
    requestId.current = crypto.randomUUID();
    const measure = () => {
      const consent = cookieYesConsentState();
      // This runs after the global consent listener enables the Pixel.
      if ((!trackedPage.current.analytics && consent.accepted.includes('analytics')) || (!trackedPage.current.advertisement && consent.accepted.includes('advertisement'))) {
        trackHelpChoosing('page_view', variant);
        trackedPage.current = { analytics: consent.accepted.includes('analytics'), advertisement: consent.accepted.includes('advertisement') };
      }
    };
    const timer = window.setTimeout(measure, 0);
    const unsubscribe = subscribeToCookieYesConsent(measure);
    const heroObserver = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.bottom < 0));
    const contactObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting));
    if (heroCta.current) heroObserver.observe(heroCta.current);
    if (contact.current) contactObserver.observe(contact.current);
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-visible', 'true'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    root.current?.querySelectorAll('[data-reveal]').forEach(element => {
      // Content stays visible if JS or IntersectionObserver is unavailable.
      element.setAttribute('data-animate', 'true');
      revealObserver.observe(element);
    });
    const checkCookies = () => setCookiesVisible(Array.from(document.querySelectorAll('.cky-consent-container, .cky-modal, .cky-preference-center')).some(el => el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none' && !el.classList.contains('cky-hide')));
    const cookieObserver = new MutationObserver(checkCookies);
    cookieObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'aria-hidden'] });
    checkCookies();
    return () => { window.clearTimeout(timer); unsubscribe(); heroObserver.disconnect(); contactObserver.disconnect(); revealObserver.disconnect(); cookieObserver.disconnect(); document.documentElement.lang = previousLang; };
  }, [variant]);

  useEffect(() => { if (status === 'success') success.current?.focus({ preventScroll: true }); }, [status]);

  function goToContact(event: MouseEvent<HTMLAnchorElement>, placement: string) {
    event.preventDefault();
    trackHelpChoosing('cta_click', variant, placement);
    contact.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    document.getElementById('contact-heading')?.focus({ preventScroll: true });
  }
  function startForm() {
    if (started.current) return;
    started.current = true; trackHelpChoosing('form_start', variant);
  }
  function update<K extends keyof HelpFields>(key: K, value: HelpFields[K]) {
    startForm(); setFields(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }
  function focusError(next: HelpErrors) {
    const first = Object.keys(next)[0];
    window.setTimeout(() => form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(), 0);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || status === 'success') return;
    startForm();
    const nextErrors = validateHelpFields(fields); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { focusError(nextErrors); return; }
    sending.current = true; setStatus('sending');
    const website = new FormData(event.currentTarget).get('website');
    try {
      const consent = cookieYesConsentState();
      const response = await fetch('/api/pomoc-w-wyborze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, website, variant, utm: source.current, requestId: requestId.current, analyticsConsent: consent.accepted.includes('analytics'), advertisementConsent: consent.accepted.includes('advertisement') }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true || typeof result.eventId !== 'string') {
        if (result.errors) { setErrors(result.errors); focusError(result.errors); }
        throw new Error('Request failed');
      }
      setStatus('success');
      // A success screen is never restored as a new conversion on refresh.
      let recorded = false;
      try { recorded = sessionStorage.getItem(`onesta-help-lead:${result.eventId}`) === '1'; sessionStorage.setItem(`onesta-help-lead:${result.eventId}`, '1'); } catch { /* In-memory submit lock still prevents double conversion. */ }
      if (!recorded) trackHelpChoosing('lead_saved', variant, undefined, result.eventId);
    } catch { setStatus('error'); }
    finally { sending.current = false; }
  }

  return <div ref={root} className={`${styles.page} ${HomeMontserratSans.className}`}>
    <Head>
      <title>Pomoc w wyborze nieruchomości w Hiszpanii | Onesta</title>
      <meta name="description" content="Uporządkuj poszukiwania nieruchomości w Hiszpanii. Poznaj lokalizacje, zrozum ceny i ustal kolejny krok podczas bezpłatnej rozmowy z doradcą Onesta po polsku." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://onesta.com.pl/pomoc-w-wyborze" />
    </Head>
    <a className={styles.skipLink} href="#kontakt">Przejdź do formularza kontaktowego</a>
    <header className={styles.header}>
      <Image src="/logotype_full_new.png" alt="Onesta Group" width={165} height={54} className={styles.logo} priority />
      <span className={styles.headerNote}>TWÓJ DOM W HISZPANII. <span>NASZE DOŚWIADCZENIE.</span></span>
      <a href="#kontakt" className={styles.headerCta} onClick={e => goToContact(e, 'header')}>Porozmawiajmy <FiArrowUpRight /></a>
    </header>
    <main>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /> NIERUCHOMOŚCI W HISZPANII</p>
          <h1 id="hero-heading" className={HomePlayfairSans.className}>{copy.title} <em>{copy.accent}</em></h1>
          <p className={styles.heroDescription}>{copy.description}</p>
          <a ref={heroCta} href="#kontakt" className={styles.primaryCta} onClick={e => goToContact(e, 'hero')}>{copy.cta}<FiArrowRight aria-hidden="true" /></a>
          <p className={styles.ctaNote}><FiCheck aria-hidden="true" /><span>Bezpłatna rozmowa po polsku. <br />Bez zobowiązania do zakupu.</span></p>
        </div>
        <div className={styles.heroVisual}>
          <figure className={styles.teamPhoto}>
            <Image src="/pomoc-w-wyborze/zespol.webp" alt="Marek Marszałek i Karolina Bakowicz z Onesta przy wspólnym biurku" fill priority sizes="(max-width: 767px) calc(100vw - 40px), 480px" />
            <figcaption><span>PO DRUGIEJ STRONIE SĄ LUDZIE</span><strong>Marek &amp; Karolina</strong><p>Porozmawiajmy o Twojej Hiszpanii.</p></figcaption>
          </figure>
          <div className={styles.experienceBadge}><strong className={HomePlayfairSans.className}>9<span>lat</span></strong><span>pomagamy znaleźć<br />swoje miejsce w Hiszpanii</span></div>
          <div className={styles.photoSideNote}>ONESTA GROUP · BLISKO TWOICH PLANÓW</div>
        </div>
      </section>

      <div className={styles.trustBar} aria-label="Nasze atuty"><span><FiMessageCircle /> Rozmawiamy po polsku</span><span><FiMapPin /> Znamy hiszpański rynek</span><span><FiShield /> Wspieramy w procesie zakupu</span></div>

      <section className={`${styles.benefits} ${styles.section}`} aria-labelledby="benefits-heading">
        <div className={styles.sectionHeading} data-reveal>
          <div><p className={styles.eyebrow}>MNIEJ PRZYPADKOWYCH OFERT. WIĘCEJ JASNOŚCI.</p><h2 id="benefits-heading" className={HomePlayfairSans.className}>Co zyskasz<br /><em>dzięki rozmowie?</em></h2></div>
          <p>Dom na wakacje, przeprowadzka czy inwestycja — dobry wybór zaczyna się od zrozumienia Twoich planów.</p>
        </div>
        <div className={styles.benefitGrid}>{benefits.map(({ icon: Icon, title, text, detail }, i) => <article key={title} className={styles.benefit} data-reveal>
          <div className={styles.benefitTop}><Icon aria-hidden="true" /><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p><div className={styles.benefitDetail}><FiCheck />{detail}</div>
        </article>)}</div>
        <div className={styles.savedOffers} data-reveal><FiFileText aria-hidden="true" /><p><strong>Masz już zapisane oferty?</strong> Możesz omówić je z nami podczas rozmowy.</p><a href="#kontakt" aria-label="Porozmawiajmy o zapisanych ofertach" onClick={e => goToContact(e, 'saved_offers')}><FiArrowUpRight /></a></div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-heading">
        <div className={styles.processInner}>
          <div className={styles.processIntro} data-reveal><p className={styles.eyebrow}>PROSTY POCZĄTEK. KONKRETNY KIERUNEK.</p><h2 id="process-heading" className={HomePlayfairSans.className}>Jak to<br /><em>wygląda?</em></h2><p>Nie musisz mieć wszystkich odpowiedzi.<br />Od tego zaczyna się nasza rozmowa.</p><a href="#kontakt" className={styles.textCta} onClick={e => goToContact(e, 'process')}>Zróbmy pierwszy krok <FiArrowRight /></a></div>
          <ol className={styles.steps}>{steps.map((step, i) => <li key={step.title} data-reveal><span className={styles.stepNumber}>0{i + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
        </div>
      </section>

      <section className={`${styles.about} ${styles.section}`} aria-labelledby="about-heading">
        <figure className={styles.coastPhoto} data-reveal><Image src="/pomoc-w-wyborze/calp.webp" alt="Wybrzeże Calpe w Hiszpanii z widokiem na skałę Peñón de Ifach" fill sizes="(max-width: 767px) calc(100vw - 40px), 530px" /><figcaption><FiMapPin /> Calpe, Costa Blanca</figcaption><div className={styles.photoLabel}>Hiszpania bliżej,<br /><em className={HomePlayfairSans.className}>niż myślisz.</em></div></figure>
        <div className={styles.aboutCopy} data-reveal><p className={styles.eyebrow}>DOŚWIADCZENIE, KTÓRE DAJE SPOKÓJ</p><h2 id="about-heading" className={HomePlayfairSans.className}>Porozmawiasz<br /><em>z Onesta.</em></h2><p className={styles.aboutLead}>Od 9 lat pomagamy klientom kupować nieruchomości w Hiszpanii.</p><p>Wspieramy ich w wyborze ofert i przejściu przez proces zakupu.</p><div className={styles.aboutPrinciple}><span className={styles.principleLine} /><p>Najpierw poznajemy Twoje potrzeby.<br /><strong>Potem szukamy właściwego adresu.</strong></p></div><a href="#kontakt" className={styles.textCta} onClick={e => goToContact(e, 'about')}>Poznajmy Twoje plany <FiArrowRight /></a></div>
      </section>

      <section id="kontakt" ref={contact} className={styles.contactSection} aria-labelledby="contact-heading">
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}><p className={styles.eyebrow}>TWÓJ PIERWSZY KROK DO HISZPANII</p><h2 id="contact-heading" tabIndex={-1} className={HomePlayfairSans.className}>Zostaw kontakt.<br /><em>Uporządkujmy Twoje poszukiwania.</em></h2><p>Doradca Onesta zadzwoni, żeby porozmawiać o Twoich planach zakupu nieruchomości w Hiszpanii. Rozmowa jest bezpłatna i nie zobowiązuje do zakupu.</p>
            <div className={styles.contactPromise}><FiPhone /><div><strong>Dlaczego prosimy o telefon?</strong><p>Żeby porozmawiać o tym, czego potrzebujesz, wyjaśnić wątpliwości i wspólnie ustalić dalszy krok.</p></div></div>
            <div className={styles.contactPeople}><Image src="/pomoc-w-wyborze/zespol.webp" alt="Zespół Onesta" width={92} height={62} /><p><strong>Do usłyszenia!</strong><span>Marek, Karolina i zespół Onesta</span></p></div>
          </div>
          <div className={styles.formCard}>
            {status === 'success' ? <div className={styles.success} role="status" tabIndex={-1} ref={success}><FiCheckCircle /><p className={styles.eyebrow}>PIERWSZY KROK ZA TOBĄ</p><h3 className={HomePlayfairSans.className}>Dziękujemy.<br />Twoje zgłoszenie dotarło.</h3><p>Doradca Onesta skontaktuje się z Tobą telefonicznie w sprawie poszukiwania nieruchomości w Hiszpanii.</p><div><FiFileText /><p>Jeśli masz zapisane oferty lub pytania, przygotuj je do rozmowy.</p></div></div> : <form ref={form} onSubmit={submit} noValidate aria-busy={status === 'sending'} onFocusCapture={e => { if (e.target.matches('input, textarea, select')) setEditing(true); }} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setEditing(false); }}>
              <div className={styles.formHeading}><span>POROZMAWIAJMY O TWOICH PLANACH</span><FiArrowDown aria-hidden="true" /></div>
              <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="help-name">Imię <span>*</span></label><input id="help-name" name="name" autoComplete="given-name" placeholder="Twoje imię" required maxLength={100} value={fields.name} onChange={e => update('name', e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <p id="name-error" className={styles.fieldError}>{errors.name}</p>}</div>
              <div className={styles.field}><label htmlFor="help-phone">Numer telefonu <span>*</span></label><input id="help-phone" name="phone" type="tel" autoComplete="tel" required maxLength={40} value={fields.phone} onChange={e => update('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={`phone-hint${errors.phone ? ' phone-error' : ''}`} /><p id="phone-hint" className={styles.hint}>Na ten numer zadzwonimy w sprawie Twojego zapytania. Prefiks kraju możesz zmienić.</p>{errors.phone && <p id="phone-error" className={styles.fieldError}>{errors.phone}</p>}</div></div>
              <fieldset className={styles.budgetField} aria-describedby={`budget-hint${errors.budget ? ' budget-error' : ''}`}><legend>Orientacyjny budżet na nieruchomość <span>*</span></legend><div className={styles.budgetOptions}>{HELP_BUDGETS.map(budget => <label key={budget.id} className={`${styles.budgetOption} ${fields.budget === budget.id ? styles.budgetSelected : ''}`}><input type="radio" name="budget" value={budget.id} required checked={fields.budget === budget.id} onChange={() => update('budget', budget.id)} aria-invalid={Boolean(errors.budget)} /><span>{budget.label}</span><FiCheck aria-hidden="true" /></label>)}</div><p id="budget-hint" className={styles.hint}>Chodzi o cenę nieruchomości. Dodatkowe koszty omówimy podczas rozmowy.</p>{errors.budget && <p id="budget-error" className={styles.fieldError}>{errors.budget}</p>}</fieldset>
              <div className={styles.field}><label htmlFor="help-message">Co najbardziej utrudnia Ci wybór? <span className={styles.optional}>opcjonalnie</span></label><textarea id="help-message" name="message" rows={3} maxLength={500} placeholder="Np. nie wiem, jaki region wybrać albo dlaczego podobne mieszkania mają różne ceny." value={fields.message} onChange={e => update('message', e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} /><span className={styles.charCount}>{fields.message.length}/500</span>{errors.message && <p id="message-error" className={styles.fieldError}>{errors.message}</p>}</div>
              <div className={styles.honeypot} aria-hidden="true"><label htmlFor="help-website">Strona internetowa</label><input id="help-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <label className={styles.privacy}><input name="privacy" type="checkbox" required checked={fields.privacy} onChange={e => update('privacy', e.target.checked)} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? 'privacy-error' : undefined} /><span>Akceptuję <a href="/polityka-prywatnosci" target="_blank" rel="noreferrer">politykę prywatności</a>. <span className={styles.required}>*</span></span></label>{errors.privacy && <p id="privacy-error" className={styles.fieldError}>{errors.privacy}</p>}
              {status === 'error' && <p role="alert" className={styles.serverError}>Nie udało się wysłać formularza. Spróbuj ponownie za chwilę lub zadzwoń: <a href="tel:+48576652525">+48 576 652 525</a>.</p>}
              <button type="submit" className={styles.submit} disabled={status === 'sending'}>{status === 'sending' ? 'Wysyłanie…' : 'Poproś o bezpłatną rozmowę'}{status !== 'sending' && <FiArrowRight aria-hidden="true" />}</button>
              <p className={styles.submitNote}>Po wysłaniu formularza skontaktuje się z Tobą doradca Onesta.</p>
              <p className={styles.requiredNote}>* Pola wymagane</p>
            </form>}
          </div>
        </div>
      </section>

      <section className={`${styles.faq} ${styles.section}`} aria-labelledby="faq-heading"><div data-reveal><p className={styles.eyebrow}>JESZCZE CHWILA NA WĄTPLIWOŚCI</p><h2 id="faq-heading" className={HomePlayfairSans.className}>Warto wiedzieć.</h2></div><div className={styles.faqList}>{questions.map((item, i) => <article key={item.question} data-reveal><span>0{i + 1}</span><div><h3>{item.question}</h3><p>{item.answer}</p></div></article>)}</div></section>
    </main>
    <footer className={styles.footer}><Image src="/logotype_full_new.png" alt="Onesta Group" width={126} height={42} /><span>© {new Date().getFullYear()} Onesta Group</span><div><a href="tel:+48576652525">+48 576 652 525</a><a href="/polityka-prywatnosci" target="_blank" rel="noreferrer">Polityka prywatności</a><button type="button" className="cky-banner-element">Ustawienia cookies</button></div></footer>
    {heroPassed && !contactVisible && !editing && !cookiesVisible && status !== 'success' && <div className={styles.mobileCta}><a href="#kontakt" onClick={e => goToContact(e, 'mobile_sticky')}>Poproś o rozmowę <FiArrowRight /></a><span>Bezpłatnie · po polsku · bez zobowiązań</span></div>}
  </div>;
}

function FiArrowUpRight() { return <FiArrowRight style={{ transform: 'rotate(-40deg)' }} aria-hidden="true" />; }

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({ props: { variant: helpVariant(query.wariant) } });
