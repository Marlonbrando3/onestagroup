import Head from 'next/head';
import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck, FiChevronLeft, FiChevronRight, FiMapPin, FiX } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { BiArea } from 'react-icons/bi';
import { HomeMontserratSans, HomePlayfairSans } from '@/fonts/homeFonts';
import { AgentOffer } from '@/lib/agentOffers';
import { LEAD_BUDGETS, getLeadBudget } from '@/lib/leadforms';
import { optimizedPropertyImageUrl } from '@/lib/propertyImages';
import { propertyTypeLabel } from '@/lib/i18n';
import { validTitleOrEmpty } from '@/lib/titlesDictionary';
import styles from '@/styles/leadforms.module.css';

const price = (value: number | null) => `${Number(value || 0).toLocaleString('pl-PL')} €`;
const title = (offer: AgentOffer) => validTitleOrEmpty(offer.title) || `${propertyTypeLabel.pl[offer.type || ''] || 'Nieruchomość'} w ${offer.town || 'Hiszpanii'}`;
function photos(value: unknown): string[] {
  if (typeof value === 'string') { try { value = JSON.parse(value); } catch { value = [value]; } }
  return Array.isArray(value) ? value.map(v => typeof v === 'string' ? v : v?.url || v?.src).filter((v): v is string => typeof v === 'string' && /^(https?:\/\/|\/)/.test(v)) : [];
}
function OfferCard({ offer, index, onChoose }: { offer: AgentOffer; index: number; onChoose: (offer: AgentOffer) => void }) {
  const images = photos(offer.images);
  const [photo, setPhoto] = useState(0);
  const [failed, setFailed] = useState(false);
  const startX = useRef<number | null>(null);
  const move = (delta: number) => { setPhoto(p => (p + delta + images.length) % images.length); setFailed(false); };
  return <article className={styles.card}>
    <div className={styles.gallery} onTouchStart={e => { startX.current = e.touches[0].clientX; }} onTouchEnd={e => { if (startX.current !== null && images.length > 1 && Math.abs(e.changedTouches[0].clientX - startX.current) > 45) move(e.changedTouches[0].clientX < startX.current ? 1 : -1); startX.current = null; }}>
      <button className={styles.photoButton} onClick={() => onChoose(offer)} aria-label={`Zapytaj o: ${title(offer)}`} aria-haspopup="dialog">
        {images.length && !failed ? <Image fill src={optimizedPropertyImageUrl(images[photo])} alt={`${title(offer)} — zdjęcie ${photo + 1}`} sizes="(max-width: 650px) 94vw, (max-width: 1000px) 46vw, 380px" onError={() => setFailed(true)} className={styles.propertyImage} /> : <span className={styles.imageFallback}>Zdjęcia dostępne u doradcy</span>}
      </button>
      <span className={styles.badge}>POLECANE · {String(index + 1).padStart(2, '0')}</span>
      {images.length > 1 && <><button className={`${styles.arrow} ${styles.prev}`} onClick={() => move(-1)} aria-label="Poprzednie zdjęcie"><FiChevronLeft /></button><button className={`${styles.arrow} ${styles.next}`} onClick={() => move(1)} aria-label="Następne zdjęcie"><FiChevronRight /></button><span className={styles.photoCount}>{photo + 1} / {images.length}</span></>}
    </div>
    <button className={styles.cardBody} onClick={() => onChoose(offer)} aria-haspopup="dialog">
      <span className={styles.location}><FiMapPin /> {offer.town || 'Hiszpania'}{offer.province ? ` · ${offer.province}` : ''}</span>
      <h3 className={HomePlayfairSans.className}>{title(offer)}</h3>
      <span className={styles.facts}><span><IoBedOutline /> {offer.beds ?? '—'} sypialnie</span><span><BiArea /> {offer.surface_built ?? '—'} m²</span></span>
      <span className={styles.cardBottom}><span><small>RYNEK PIERWOTNY · CENA OD</small><strong>{price(offer.price)}</strong></span><span className={styles.roundArrow}><FiArrowRight /></span></span>
      <span className={styles.cardCta}>Poproś o więcej informacji</span>
    </button>
  </article>;
}
function Contact({ offer, budget, onClose }: { offer: AgentOffer; budget: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal(); document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (status === 'sending') return;
    const data = new FormData(event.currentTarget); setStatus('sending');
    try {
      const campaign = new URLSearchParams(window.location.search);
      const response = await fetch('/api/leadforms/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), website: data.get('website'), consent: data.get('consent') === 'on', offerId: offer.external_id, budget, campaign: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(key => `${key}=${campaign.get(key) || ''}`).join('&') }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Spróbuj ponownie.');
      setStatus('success');
    } catch (e) { setError(e instanceof Error ? e.message : 'Spróbuj ponownie.'); setStatus('error'); }
  }
  return <dialog ref={dialog} className={`${styles.dialog} ${HomeMontserratSans.className}`} aria-labelledby="contact-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={styles.dialogInner}><button className={styles.close} onClick={onClose} aria-label="Zamknij"><FiX /></button>
      {status === 'success' ? <div role="status" className={styles.success}><span>✓</span><h2 id="contact-title" className={HomePlayfairSans.className}>Dziękujemy!</h2><p>Otrzymaliśmy Twoje zapytanie o {title(offer)}. Nasz doradca skontaktuje się z Tobą i opowie więcej o tej nieruchomości.</p><button className={styles.submit} onClick={onClose}>Wróć do ofert <FiArrowRight /></button></div> : <>
        <p className={styles.eyebrow}>TA NIERUCHOMOŚĆ CIĘ INTERESUJE?</p><h2 id="contact-title" className={HomePlayfairSans.className}>Poznaj wszystkie szczegóły.</h2>
        <p className={styles.dialogIntro}>Zostaw kontakt, a prześlemy więcej informacji i sprawdzimy aktualną dostępność.</p>
        <div className={styles.selectedOffer}><strong>{title(offer)}</strong><span>{price(offer.price)} · ref. {offer.external_id}</span></div>
        <form onSubmit={submit} className={styles.form}>
          <label>Imię<input name="name" autoComplete="given-name" required maxLength={100} placeholder="Jak masz na imię?" /></label>
          <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="twoj@email.pl" /></label>
          <label>Telefon<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={40} placeholder="+48" /></label>
          <label className={styles.honeypot} aria-hidden="true">Strona internetowa<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className={styles.consent}><input name="consent" type="checkbox" required /><span>Zgadzam się na kontakt Onesta Group w sprawie wybranej nieruchomości. Zapoznałem/am się z <a href="/polityka-prywatnosci" target="_blank" rel="noreferrer">polityką prywatności</a>.</span></label>
          {status === 'error' && <p role="alert" className={styles.error}>{error}</p>}
          <button className={styles.submit} disabled={status === 'sending'}>{status === 'sending' ? 'Wysyłamy…' : 'Poproszę o więcej informacji'} <FiArrowRight /></button>
          <p className={styles.formNote}>Bez zobowiązań. Porozmawiamy po polsku.</p>
        </form>
      </>}
    </div>
  </dialog>;
}
export default function Leadforms() {
  const [budget, setBudget] = useState('');
  const [offers, setOffers] = useState<AgentOffer[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [selected, setSelected] = useState<AgentOffer | null>(null);
  const request = useRef<AbortController | null>(null);
  const results = useRef<HTMLElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function choose(id: string) {
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    setBudget(id); setStatus('loading'); setOffers([]);
    window.setTimeout(() => results.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 50);
    try {
      const response = await fetch(`/api/leadforms/offers?budget=${id}`, { signal: controller.signal });
      if (!response.ok) throw new Error(); const result = await response.json();
      if (!controller.signal.aborted) { setOffers(result.offers); setStatus('ready'); }
    } catch { if (!controller.signal.aborted) setStatus('error'); }
  }
  return <div className={`${styles.page} ${HomeMontserratSans.className}`}>
    <Head><title>Wybrane nieruchomości w Hiszpanii | Onesta Group</title><meta name="description" content="Od 9 lat pomagamy Polakom w zakupie nieruchomości w Hiszpanii. Wybierz budżet i odkryj polecane nowe inwestycje — bez zostawiania danych." /><meta property="og:title" content="Zobacz nasze najlepsze projekty w Hiszpanii | Onesta Group" /><meta property="og:image" content="https://onesta.com.pl/mediterranean-property-banner.webp" /></Head>
    <header className={styles.header}><Image src="/logotype_full_new.png" alt="Onesta Group" width={165} height={54} className={styles.logo} /></header>
    <main>
      <section className={styles.hero}>
        <Image src="/mediterranean-property-banner.webp" alt="Śródziemnomorska architektura i słoneczne tarasy z widokiem na morze" fill preload sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} /><div className={styles.heroContent}><div className={styles.heroCopy}><p className={styles.heroEyebrow}><span /> HISZPANIA. TWÓJ NOWY ROZDZIAŁ.</p><h1 className={HomePlayfairSans.className}>Od 9 lat pomagamy Polakom w zakupie nieruchomości <em>w Hiszpanii.</em></h1><p>Piękne miejsca. Sprawdzone inwestycje.<br />Zobacz projekty, które wybraliśmy dla Ciebie.</p><a href="#budzet" className={styles.heroCta}>Odkryj nasze najlepsze oferty <FiArrowRight /></a><div className={styles.heroNote}><FiCheck /> Najpierw zobacz. Potem porozmawiajmy.</div></div><div className={styles.heroPortraits}>
          <figure><Image src="/Marek.webp" alt="Marek Marszałek" width={240} height={340} sizes="(max-width: 650px) 99px, (max-width: 1023px) 140px, 240px" preload /><figcaption>Marek Marszałek</figcaption></figure>
          <figure><Image src="/Karolina.webp" alt="Karolina Bakowicz" width={240} height={340} sizes="(max-width: 650px) 99px, (max-width: 1023px) 140px, 240px" preload /><figcaption>Karolina Bakowicz</figcaption></figure>
        </div></div>
        <span className={styles.heroCaption}>ONESTA SELECTION / NOWE INWESTYCJE</span>
      </section>
      <section id="budzet" className={styles.survey}><div className={styles.surveyIntro}><p className={styles.eyebrow}>01 / ZACZNIJ OD SWOICH PLANÓW</p><h2 className={HomePlayfairSans.className}>Twój kawałek Hiszpanii.<br /><em>W Twoim budżecie.</em></h2><p className={styles.surveyPrompt}>Wybierz swój budżet i przeglądaj <FiArrowRight aria-hidden="true" /></p><div className={styles.trust}><span><FiCheck /> Wybrane przez Onesta</span><span><FiCheck /> Rynek pierwotny</span><span><FiCheck /> Wsparcie po polsku</span></div></div>
        <fieldset className={styles.budgets}><legend>W jakim budżecie szukasz nieruchomości?</legend><p className={styles.budgetHint}>Wybierz przedział cenowy w euro.</p><div className={styles.budgetGrid}>{LEAD_BUDGETS.map((b, i) => <button key={b.id} onClick={() => choose(b.id)} aria-pressed={budget === b.id} className={`${styles.budget} ${b.id === 'magic' ? styles.magic : ''} ${budget === b.id ? styles.active : ''}`}><span>{b.id === 'magic' ? '✦' : `0${i + 1}`}</span><strong>{b.label}</strong><FiArrowRight /></button>)}</div><p className={styles.magicNote}>✦ Daj się zainspirować: losowe propozycje od 300 000 do 500 000 €.</p></fieldset>
      </section>
      {status !== 'idle' && <section ref={results} className={styles.results} aria-busy={status === 'loading'}><div className={styles.resultsHeading}><div><p className={styles.eyebrow}>02 / WYBRANE DLA CIEBIE</p><h2 className={HomePlayfairSans.className}>{budget === 'magic' ? 'Odrobina magii. Wyjątkowe adresy.' : 'Tutaj zaczyna się Twój nowy rozdział.'}</h2><p>{getLeadBudget(budget)?.label} · Polecane nowe inwestycje</p></div><a href="#budzet">Zmień budżet ↑</a></div>
        <div role="status" aria-live="polite">{status === 'loading' ? <p>Wybieramy Twoje nieruchomości…</p> : status === 'ready' ? <p className={styles.resultsNote}>{offers.length ? `${offers.length} propozycji. Przeglądaj zdjęcia, a gdy coś Ci się spodoba — kliknij i zapytaj o szczegóły.` : 'Obecnie nie mamy polecanych inwestycji w tym budżecie. Wybierz inny przedział lub zadzwoń: +48 576 65 25 25.'}</p> : null}</div>
        {status === 'error' && <div className={styles.empty} role="alert"><p>Nie udało się wczytać ofert. Spróbujmy jeszcze raz.</p><button className={styles.submit} onClick={() => choose(budget)}>Wczytaj ponownie</button></div>}
        <div className={styles.grid}>{status === 'loading' ? Array.from({ length: 3 }, (_, i) => <div key={i} className={styles.skeleton} aria-hidden="true" />) : offers.map((offer, index) => <OfferCard key={`${budget}-${offer.external_id}`} offer={offer} index={index} onChoose={setSelected} />)}</div>
        {status === 'ready' && offers.length > 0 && <p className={styles.priceNote}>Ceny ofertowe mogą ulec zmianie. Doradca potwierdzi aktualną cenę, dostępność i dodatkowe koszty zakupu.</p>}
      </section>}
      <section className={styles.closing}><span>9 lat doświadczenia. Jeden cel.</span><h2 className={HomePlayfairSans.className}>Żebyś w Hiszpanii poczuł się u siebie.</h2><p>Od pierwszego pytania do odbioru kluczy — jesteśmy obok.</p></section>
    </main><footer className={styles.footer}><Image src="/logotype_full_new.png" alt="Onesta Group" width={120} height={40} /><span>© {new Date().getFullYear()} Onesta Group</span><a href="/polityka-prywatnosci">Polityka prywatności</a></footer>
    {selected && <Contact offer={selected} budget={budget} onClose={() => setSelected(null)} />}
  </div>;
}
