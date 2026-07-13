import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiAward,
  FiBox,
  FiCheck,
  FiChevronLeft,
  FiClipboard,
  FiClock,
  FiHeart,
  FiHome,
  FiGrid,
  FiKey,
  FiLock,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiShield,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";

const NAV_ITEMS = [
  ["O nas", "/aboutus"],
  ["Nieruchomości", "/nieruchomosci/hiszpania"],
  ["Zarządzanie", "/zarzadzanie-nieruchomosciami-w-hiszpanii"],
  ["Dla inwestora", "/pobytinwestorski"],
  ["Poradnik", "/blog"],
  ["Kontakt", "/#contact"],
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Brand() {
  return (
    <Link href="/" className="sale-brand" aria-label="Onesta — strona główna">
      <span>ONESTA</span>
      <small>NIERUCHOMOŚCI ZA GRANICĄ</small>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sale-header">
      <div className="sale-container sale-header-inner">
        <Brand />
        <nav className="sale-nav" aria-label="Główna nawigacja">
          {NAV_ITEMS.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>
        <div className="sale-header-actions">
          <button className="sale-btn sale-btn-dark sale-header-cta" onClick={() => scrollTo("analiza-zakupu")}>Sprawdź dopasowanie</button>
          <span className="sale-lang">◎ PL</span>
          <button className="sale-menu-btn" aria-label={open ? "Zamknij menu" : "Otwórz menu"} onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="sale-mobile-nav" aria-label="Mobilna nawigacja">
          {NAV_ITEMS.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <button className="sale-btn sale-btn-dark" onClick={() => { setOpen(false); scrollTo("analiza-zakupu"); }}>Sprawdź dopasowanie</button>
        </nav>
      )}
    </header>
  );
}

export function TrustBar() {
  return (
    <div className="sale-trust">
      <div className="sale-trust-item sale-google"><b>G</b><span><strong>5.0 <i>★★★★★</i></strong><small>Ponad 130 opinii</small></span></div>
      <div className="sale-trust-item"><FiShield /><span><strong>Doradca</strong><small>po stronie klienta</small></span></div>
      <div className="sale-trust-item"><FiUsers /><span><strong>Ponad 600</strong><small>zadowolonych klientów</small></span></div>
    </div>
  );
}

function SmartImage({ primary, fallback, alt, className = "" }: { primary: string; fallback: string; alt: string; className?: string }) {
  const [src, setSrc] = useState(primary);
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={className} onError={() => setSrc(fallback)} />;
}

export function HeroSection() {
  return (
    <section className="sale-hero">
      <div className="sale-container sale-hero-grid">
        <div className="sale-hero-copy">
          <p className="sale-eyebrow">Nieruchomości za granicą</p>
          <h1>Pomagamy w zakupie nieruchomości za granicą od 8 lat</h1>
          <p className="sale-lead">Doradzamy po stronie klienta, prowadzimy przez cały proces i negocjujemy ze wszystkimi deweloperami.</p>
          <div className="sale-hero-buttons">
            <button className="sale-btn sale-btn-dark" onClick={() => scrollTo("analiza-zakupu")}><FiArrowRight /> Sprawdź, czy rynek pasuje do Twojego budżetu</button>
            <button className="sale-btn sale-btn-light" onClick={() => scrollTo("wybrane-oferty")}>Zobacz przykładowe oferty</button>
          </div>
          <TrustBar />
        </div>
        <div className="sale-hero-visual">
          <div className="sale-hero-coast" />
          <div className="sale-hero-photo">
            <SmartImage primary="/images/onesta/advisors-hero.png" fallback="/team_c.png" alt="Doradcy Onesta" className="sale-cover sale-hero-img" />
          </div>
          <div className="sale-advisor-card"><strong>Klaudia i Michał</strong><span>Doradcy ds. nieruchomości</span><em>Z pasją doradzamy na każdym etapie zakupu.</em></div>
        </div>
      </div>
    </section>
  );
}

const whyCards = [
  { icon: <FiAward />, title: "8 lat doświadczenia", text: "Od 2016 roku pomagamy klientom spełniać marzenia o własnym miejscu za granicą." },
  { icon: <FiClipboard />, title: "Prowadzimy przez cały proces zakupu", text: "Od analizy rynku po odbiór kluczy i wsparcie po zakupie. Jesteśmy na każdym etapie." },
  { icon: <FiUsers />, title: "Działamy po stronie klienta", text: "Reprezentujemy wyłącznie Twoje interesy. Nie prowadzimy procesu po stronie dewelopera." },
  { icon: <FiGrid />, title: "Współpracujemy ze wszystkimi deweloperami", text: "Mamy dostęp do szerokiej oferty rynku i pomagamy porównać realne możliwości zakupu." },
];

export function WhyUsSection() {
  return (
    <section className="sale-section sale-why">
      <div className="sale-container">
        <SectionHeading eyebrow="DLACZEGO MY?" title="Dlaczego klienci wybierają nas" text="Łączymy doświadczenie, relacje i pełne zaangażowanie, aby proces zakupu był bezpieczny, prosty i komfortowy." />
        <div className="sale-why-grid">{whyCards.map(card => <article className="sale-why-card" key={card.title}><div className="sale-icon">{card.icon}</div><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="sale-section-heading"><p className="sale-eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

const services = [
  { icon: <FiHome />, title: "Opieka nad nieruchomością", text: "Nadzór techniczny, przeglądy, serwis i utrzymanie standardu." },
  { icon: <FiKey />, title: "Najem i obsługa gości", text: "Wsparcie przy wynajmie, koordynacja pobytów i bieżąca obsługa." },
  { icon: <FiMessageCircle />, title: "Bieżąca koordynacja i wsparcie", text: "Stały kontakt, raporty i szybka reakcja na każdym etapie." },
];

export function ManagementSection() {
  return (
    <section className="sale-section sale-management">
      <div className="sale-container sale-management-grid">
        <div className="sale-management-copy"><p className="sale-eyebrow">KOMPLEKSOWA OBSŁUGA</p><h2>Zarządzanie nieruchomościami</h2><p>Po zakupie możesz na nas liczyć. Dbamy o Twoją nieruchomość, aby była bezpieczna, zadbana i gotowa do użytkowania lub wynajmu.</p><Link className="sale-btn sale-btn-light" href="/zarzadzanie-nieruchomosciami-w-hiszpanii">Dowiedz się więcej <FiArrowRight /></Link></div>
        <div className="sale-management-visual">
          <div className="sale-management-image"><SmartImage primary="/images/onesta/management-property.jpg" fallback="/bg_main_site.png" alt="Zarządzana nieruchomość nad morzem" className="sale-cover" /></div>
          <div className="sale-services-card">{services.map(service => <div className="sale-service" key={service.title}><div className="sale-icon">{service.icon}</div><div><strong>{service.title}</strong><p>{service.text}</p></div></div>)}</div>
        </div>
      </div>
    </section>
  );
}

const offers = [
  { primary: "/images/onesta/offer-costa-blanca.jpg", fallback: "/bg_main_site.png", place: "Costa Blanca", title: "Apartament blisko morza", price: "od 349 000 EUR", beds: "2–3 sypialnie", area: "70–110 m²" },
  { primary: "/images/onesta/offer-almeria.jpg", fallback: "/bg_mini.png", place: "Almería", title: "Apartament inwestycyjny", price: "od 219 000 EUR", beds: "1–2 sypialnie", area: "52–85 m²" },
  { primary: "/images/onesta/offer-cyprus.jpg", fallback: "/cypr.png", place: "Cypr", title: "Nowoczesny apartament", price: "od 289 000 EUR", beds: "2 sypialnie", area: "80–115 m²" },
  { primary: "/images/onesta/offer-costa-del-sol.jpg", fallback: "/costadelsol.webp", place: "Costa del Sol", title: "Premium residence", price: "od 449 000 EUR", beds: "2–3 sypialnie", area: "90–140 m²" },
];

export function OffersSection() {
  return (
    <section id="wybrane-oferty" className="sale-section sale-offers">
      <div className="sale-container">
        <SectionHeading eyebrow="PRZYKŁADOWE OFERTY" title="Wybrane nieruchomości" />
        <div className="sale-offer-grid">{offers.map(offer => <article className="sale-offer" key={offer.place}><div className="sale-offer-image"><SmartImage primary={offer.primary} fallback={offer.fallback} alt={`${offer.title}, ${offer.place}`} className="sale-cover" /><button aria-label="Dodaj do ulubionych"><FiHeart /></button></div><div className="sale-offer-body"><span className="sale-place"><FiMapPin /> {offer.place}</span><h3>{offer.title}</h3><strong className="sale-price">{offer.price}</strong><div className="sale-specs"><span><FiBox />{offer.beds}</span><span><FiHome />{offer.area}</span></div></div></article>)}</div>
        <div className="sale-center"><Link href="/nieruchomosci/hiszpania" className="sale-btn sale-btn-light">Zobacz wszystkie oferty <FiArrowRight /></Link></div>
      </div>
    </section>
  );
}

type Answer = { label: string; score: number };
type Question = { question: string; hint: string; answers: Answer[] };

const questions: Question[] = [
  { question: "Kiedy planujesz zakup nieruchomości?", hint: "Wybierz opcję, która najlepiej opisuje Twój plan.", answers: [{ label: "0–3 miesiące", score: 30 }, { label: "3–6 miesięcy", score: 25 }, { label: "6–12 miesięcy", score: 10 }, { label: "Dopiero się rozglądam", score: -20 }] },
  { question: "Jaki jest Twój orientacyjny budżet?", hint: "Uwzględnij budżet przeznaczony na samą nieruchomość.", answers: [{ label: "do 250 000 EUR", score: -25 }, { label: "250 000 – 350 000 EUR", score: 5 }, { label: "350 000 – 500 000 EUR", score: 25 }, { label: "500 000 EUR+", score: 35 }] },
  { question: "Czy doliczasz koszty zakupu poza ceną nieruchomości?", hint: "Na większości rynków wynoszą one około 10–15%.", answers: [{ label: "Tak, mam dodatkowe 10–15%", score: 25 }, { label: "Częściowo", score: 10 }, { label: "Nie wiem", score: -10 }, { label: "Nie, budżet obejmuje wszystko", score: -20 }] },
  { question: "Co jest dla Ciebie najważniejsze?", hint: "Wskaż jeden główny priorytet zakupu.", answers: [{ label: "Lokalizacja", score: 5 }, { label: "Cena", score: -5 }, { label: "Potencjał najmu", score: 10 }, { label: "Standard nieruchomości", score: 5 }] },
  { question: "Jeśli budżet nie wystarczy na wszystkie oczekiwania, co wybierasz?", hint: "To pomoże nam ocenić realny zakres możliwości.", answers: [{ label: "Zwiększam budżet", score: 25 }, { label: "Zmieniam region", score: 20 }, { label: "Akceptuję mniejszą nieruchomość", score: 15 }, { label: "Nie akceptuję kompromisów", score: -35 }] },
];

type Result = { key: "A" | "B" | "C" | "D"; title: string; text: string; cta: string; status: string };
const getResult = (score: number): Result => {
  if (score >= 70) return { key: "A", title: "Realny zakup", text: "Twoje odpowiedzi wskazują, że możemy przejść do rozmowy i dopasowania konkretnych kierunków.", cta: "Zostaw kontakt i umów rozmowę", status: "Bardzo dobre dopasowanie do aktualnych warunków rynkowych." };
  if (score >= 40) return { key: "B", title: "Wymaga doprecyzowania", text: "Twoje założenia są częściowo realne, ale wymagają doprecyzowania budżetu, kosztów lub oczekiwań.", cta: "Otrzymaj analizę rynku", status: "Dobre podstawy do dalszej, indywidualnej analizy." };
  if (score >= 10) return { key: "C", title: "Najpierw analiza rynku", text: "Na podstawie odpowiedzi rekomendujemy najpierw zapoznanie się z realnymi progami cenowymi i kosztami zakupu.", cta: "Zobacz realne progi cenowe", status: "Założenia wymagają porównania z aktualnymi cenami." };
  return { key: "D", title: "Obecnie niski fit", text: "Twoje oczekiwania mogą nie pasować do aktualnych realiów rynku. Warto najpierw zweryfikować budżet lub zakres kompromisów.", cta: "Zobacz poradnik", status: "Potrzebna jest korekta budżetu lub zakresu oczekiwań." };
};

export function QuestionStep({ step, selected, onSelect }: { step: number; selected?: number; onSelect: (index: number) => void }) {
  const current = questions[step];
  return <div className="sale-question"><span className="sale-step-label">KROK {step + 1} Z 5</span><h3>{current.question}</h3><p>{current.hint}</p><div className="sale-answers">{current.answers.map((answer, i) => <button key={answer.label} className={selected === i ? "active" : ""} onClick={() => onSelect(i)}><span>{answer.label}</span>{selected === i && <FiCheck />}</button>)}</div></div>;
}

export function ResultCard({ result, onCta }: { result: Result; onCta: () => void }) {
  return <div className="sale-result"><div className="sale-result-mark"><FiCheck /></div><span>WYNIK ANALIZY</span><h3>{result.title}</h3><p>{result.text}</p><button className="sale-btn sale-btn-dark" onClick={onCta}>{result.cta} <FiArrowRight /></button></div>;
}

type LeadData = { name: string; phone: string; email: string; country: string; message: string };
export function submitLead(data: LeadData) { console.log("Qualification lead ready for API/Supabase:", data); }

export function LeadForm({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState<LeadData>({ name: "", phone: "", email: "", country: "", message: "" });
  const set = (key: keyof LeadData, value: string) => setData(prev => ({ ...prev, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); submitLead(data); setSent(true); };
  if (sent) return <div className="sale-success"><div className="sale-result-mark"><FiCheck /></div><h3>Dziękujemy za zgłoszenie</h3><p>Skontaktujemy się z Tobą, aby omówić wynik analizy i możliwe kierunki zakupu.</p></div>;
  return <form className="sale-lead-form" onSubmit={submit}><span className="sale-step-label">OSTATNI KROK</span><h3>Porozmawiajmy o Twoich możliwościach</h3><div className="sale-form-grid"><label>Imię<input required value={data.name} onChange={e => set("name", e.target.value)} placeholder="Twoje imię" /></label><label>Telefon<input required type="tel" value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+48 000 000 000" /></label><label>E-mail<input required type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder="twoj@email.pl" /></label><label>Preferowany kraj<select required value={data.country} onChange={e => set("country", e.target.value)}><option value="">Wybierz kraj</option><option>Hiszpania</option><option>Cypr</option><option>Dominikana</option><option>Nie wiem — potrzebuję rekomendacji</option></select></label><label className="sale-full">Wiadomość <small>(opcjonalnie)</small><textarea value={data.message} onChange={e => set("message", e.target.value)} placeholder="Napisz, czego szukasz..." /></label></div><div className="sale-panel-actions"><button type="button" className="sale-back" onClick={onBack}><FiChevronLeft /> Wróć do wyniku</button><button className="sale-btn sale-btn-dark" type="submit">Wyślij zgłoszenie <FiArrowRight /></button></div></form>;
}

function PreliminaryCard({ result, complete }: { result: Result; complete: boolean }) {
  const visible = complete ? result : getResult(70);
  return <aside className="sale-preliminary"><span>WSTĘPNA OCENA</span><div className={`sale-fit sale-fit-${visible.key}`}>{visible.title}</div><p>{visible.status}</p><hr /><small>ORIENTACYJNY BUDŻET</small><strong>300 000 – 600 000 EUR</strong><small>REKOMENDOWANE RYNKI</small><div className="sale-chips"><i>Costa Blanca</i><i>Almería</i><i>Cypr</i></div><footer>Pełną rekomendację otrzymasz po zakończeniu analizy.</footer></aside>;
}

export function QualificationPanel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);
  const [finished, setFinished] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const score = useMemo(() => answers.reduce<number>((sum, answer, i) => sum + (answer === undefined ? 0 : questions[i].answers[answer].score), 0), [answers]);
  const result = getResult(score);
  const select = (index: number) => setAnswers(prev => { const next = [...prev]; next[step] = index; return next; });
  const next = () => { if (answers[step] === undefined) return; if (step === questions.length - 1) setFinished(true); else setStep(step + 1); };
  const back = () => { if (finished) setFinished(false); else if (step > 0) setStep(step - 1); };
  return <div className="sale-panel"><div className="sale-panel-head"><div><span>ANALIZA ZAKUPU</span><h3>Sprawdź swoje dopasowanie</h3></div><div className="sale-progress" aria-label={`Krok ${step + 1} z 5`}>{questions.map((_, i) => <i key={i} className={i <= step ? "active" : ""} />)}</div></div><div className="sale-panel-content"><main>{showForm ? <LeadForm onBack={() => setShowForm(false)} /> : finished ? <ResultCard result={result} onCta={() => setShowForm(true)} /> : <><QuestionStep step={step} selected={answers[step]} onSelect={select} /><div className="sale-panel-actions">{step > 0 ? <button className="sale-back" onClick={back}><FiChevronLeft /> Wstecz</button> : <span />}<button className="sale-btn sale-btn-dark" disabled={answers[step] === undefined} onClick={next}>{step === 4 ? "Zobacz wynik" : "Dalej"} <FiArrowRight /></button></div><small className="sale-no-obligation"><FiLock /> To tylko wstępna analiza — bez zobowiązań.</small></>}</main>{!showForm && <PreliminaryCard result={result} complete={finished} />}</div></div>;
}

export function QualificationSection() {
  return <section id="analiza-zakupu" className="sale-section sale-qualification"><div className="sale-container sale-qualification-wrap"><div className="sale-qualification-copy"><p className="sale-eyebrow">ZACZNIJMY ROZMOWĘ</p><h2>Sprawdź, czy Twój budżet pasuje do rynku</h2><p>Krótka analiza pomoże nam sprawdzić, czy Twoje oczekiwania pasują do aktualnych realiów rynku. To zajmie tylko chwilę.</p><ul><li><FiClock /> Wstępna analiza zajmuje ok. 2–3 minuty</li><li><FiLock /> Twoje dane są bezpieczne i poufne</li><li><FiCheck /> Otrzymasz konkretne rekomendacje</li></ul></div><QualificationPanel /></div></section>;
}

export function OnestaQualificationPage() {
  return <div className="sale-page"><Head><title>Nieruchomości za granicą | Onesta</title><meta name="description" content="Sprawdź, czy Twój budżet pasuje do rynku nieruchomości za granicą. Indywidualna analiza zakupu Onesta." /></Head><Header /><main><HeroSection /><WhyUsSection /><ManagementSection /><OffersSection /><QualificationSection /></main><style jsx global>{saleStyles}</style></div>;
}

export default OnestaQualificationPage;

const saleStyles = `
  :root{--sale-navy:#071b3a;--sale-navy2:#0b244d;--sale-gold:#b9823b;--sale-border:#e8d7be;--sale-cream:#fbf7f1;--sale-muted:#516070}
  .sale-page{background:#fffdf9;color:var(--sale-navy);font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;line-height:1.5;overflow:hidden}.sale-page *{box-sizing:border-box}.sale-page button,.sale-page input,.sale-page select,.sale-page textarea{font:inherit}.sale-page button{cursor:pointer}.sale-container{width:min(1280px,calc(100% - 96px));margin:0 auto}.sale-page h1,.sale-page h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;letter-spacing:-.035em;line-height:1.08;margin:0}.sale-page h2{font-size:clamp(36px,4vw,54px)}.sale-page p{margin:0}.sale-eyebrow{color:var(--sale-gold);font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px!important}.sale-btn{align-items:center;border-radius:10px;border:1px solid transparent;display:inline-flex;font-weight:650;gap:10px;justify-content:center;min-height:50px;padding:0 22px;text-decoration:none;transition:.2s}.sale-btn svg{flex:none}.sale-btn-dark{background:var(--sale-navy);color:#fff;box-shadow:0 10px 24px rgba(7,27,58,.12)}.sale-btn-dark:hover{background:var(--sale-navy2);transform:translateY(-1px)}.sale-btn-dark:disabled{cursor:not-allowed;opacity:.4;transform:none}.sale-btn-light{background:#fffdf9;border-color:#d8b98e;color:var(--sale-gold)}.sale-btn-light:hover{background:#fff7ec;transform:translateY(-1px)}
  .sale-header{background:rgba(255,255,255,.97);border-bottom:1px solid #ede7df;position:relative;z-index:50}.sale-header-inner{align-items:center;display:flex;height:76px}.sale-brand{color:var(--sale-navy);display:flex;flex-direction:column;text-decoration:none;width:178px}.sale-brand span{font-family:Georgia,serif;font-size:25px;letter-spacing:.12em;line-height:1}.sale-brand small{font-size:7px;letter-spacing:.13em;margin-top:5px}.sale-nav{display:flex;gap:clamp(20px,2.3vw,38px);margin:auto}.sale-nav a{color:var(--sale-navy);font-size:13px;text-decoration:none}.sale-nav a:hover{color:var(--sale-gold)}.sale-header-actions{align-items:center;display:flex;gap:16px}.sale-header-cta{font-size:13px;min-height:44px;padding:0 18px}.sale-lang{font-size:12px;font-weight:650}.sale-menu-btn{background:none;border:0;color:var(--sale-navy);display:none;font-size:26px;padding:6px}.sale-mobile-nav{background:#fff;box-shadow:0 18px 35px rgba(7,27,58,.1);display:none;left:0;padding:16px 24px 24px;position:absolute;right:0;top:76px}.sale-mobile-nav a{border-bottom:1px solid #eee7dd;color:var(--sale-navy);padding:12px 0;text-decoration:none}
  .sale-hero{background:linear-gradient(112deg,#f7fbfc 0%,#eef8fb 48%,#f7f3ed 100%);position:relative}.sale-hero-grid{display:grid;grid-template-columns:47% 53%;min-height:610px}.sale-hero-copy{align-self:center;padding:72px 28px 50px 0;position:relative;z-index:3}.sale-hero-copy h1{font-size:clamp(44px,4vw,58px);max-width:650px}.sale-lead{color:#33445a;font-size:17px;line-height:1.7;margin-top:22px!important;max-width:610px}.sale-hero-buttons{display:flex;gap:14px;margin-top:30px}.sale-hero-buttons .sale-btn{min-height:56px}.sale-hero-visual{min-width:0;position:relative}.sale-hero-coast{background:url('/bg_calp.jpg') center/cover;inset:0 -100vw 0 -120px;opacity:.2;position:absolute}.sale-hero-photo{bottom:0;left:0;overflow:hidden;position:absolute;right:-32px;top:0}.sale-cover{object-fit:cover}.sale-hero-img{object-position:left center;transform:scale(1.22);transform-origin:left center}.sale-advisor-card{background:rgba(251,247,241,.95);border:1px solid rgba(255,255,255,.8);border-radius:16px;bottom:36px;box-shadow:0 18px 50px rgba(7,27,58,.15);display:flex;flex-direction:column;padding:18px 22px;position:absolute;right:15px;width:270px}.sale-advisor-card strong{font-family:Georgia,serif;font-size:18px}.sale-advisor-card span{font-size:13px}.sale-advisor-card em{font-family:Georgia,serif;font-size:12px;margin-top:5px}.sale-trust{align-items:center;background:rgba(255,255,255,.76);border:1px solid rgba(255,255,255,.8);border-radius:14px;display:flex;margin-top:34px;padding:14px 17px;width:max-content}.sale-trust-item{align-items:center;border-right:1px solid #d9d6d0;display:flex;gap:11px;margin-right:18px;padding-right:18px}.sale-trust-item:last-child{border:0;margin:0;padding:0}.sale-trust-item>svg{color:var(--sale-navy);font-size:22px}.sale-trust-item span{display:flex;flex-direction:column}.sale-trust-item strong{font-size:12px}.sale-trust-item small{color:var(--sale-muted);font-size:9px}.sale-google>b{color:#4285f4;font-size:25px}.sale-google i{color:#e3aa3a;font-style:normal;letter-spacing:1px}
  .sale-section{padding:92px 0}.sale-section-heading{text-align:center;margin:0 auto 42px;max-width:820px}.sale-section-heading>p:last-child{color:var(--sale-muted);font-size:15px;line-height:1.7;margin-top:16px!important}.sale-why{background:#fff}.sale-why-grid{display:grid;gap:22px;grid-template-columns:repeat(4,1fr)}.sale-why-card{background:#fff;border:1px solid var(--sale-border);border-radius:20px;box-shadow:0 12px 36px rgba(7,27,58,.035);min-height:260px;padding:30px;transition:.2s}.sale-why-card:hover{box-shadow:0 18px 50px rgba(7,27,58,.08);transform:translateY(-3px)}.sale-icon{color:var(--sale-gold);font-size:34px}.sale-why-card h3{font-family:Georgia,serif;font-size:20px;line-height:1.25;margin:22px 0 17px}.sale-why-card p{color:var(--sale-muted);font-size:14px;line-height:1.7}
  .sale-management{background:var(--sale-cream)}.sale-management-grid{align-items:center;display:grid;gap:58px;grid-template-columns:34% 66%}.sale-management-copy h2{max-width:390px}.sale-management-copy>p:not(.sale-eyebrow){color:var(--sale-muted);font-size:15px;line-height:1.75;margin:24px 0 28px;max-width:440px}.sale-management-visual{padding-bottom:88px;position:relative}.sale-management-image{border-radius:22px;height:390px;overflow:hidden;position:relative}.sale-services-card{background:rgba(255,255,255,.97);border:1px solid #eee4d7;border-radius:18px;bottom:0;box-shadow:0 18px 50px rgba(7,27,58,.09);display:grid;gap:24px;grid-template-columns:repeat(3,1fr);left:28px;padding:24px;position:absolute;right:28px}.sale-service{display:flex;gap:13px}.sale-service .sale-icon{font-size:28px;flex:none}.sale-service strong{font-family:Georgia,serif;font-size:15px}.sale-service p{color:var(--sale-muted);font-size:11px;line-height:1.5;margin-top:7px}
  .sale-offers{background:#fff}.sale-offer-grid{display:grid;gap:18px;grid-template-columns:repeat(4,1fr)}.sale-offer{border:1px solid #e9ddce;border-radius:18px;box-shadow:0 12px 34px rgba(7,27,58,.045);overflow:hidden}.sale-offer-image{height:220px;position:relative}.sale-offer-image button{align-items:center;background:rgba(7,27,58,.28);border:1px solid rgba(255,255,255,.7);border-radius:50%;color:#fff;display:flex;font-size:20px;height:36px;justify-content:center;position:absolute;right:13px;top:13px;width:36px}.sale-offer-body{padding:20px}.sale-place{align-items:center;color:var(--sale-navy);display:flex;font-size:12px;font-weight:700;gap:5px}.sale-place svg{color:var(--sale-gold)}.sale-offer h3{font-family:Georgia,serif;font-size:19px;margin:8px 0 12px}.sale-price{color:var(--sale-gold);display:block;font-size:16px}.sale-specs{border-top:1px solid #eee7df;display:flex;gap:17px;margin-top:17px;padding-top:15px}.sale-specs span{align-items:center;color:var(--sale-muted);display:flex;font-size:11px;gap:6px}.sale-center{display:flex;justify-content:center;margin-top:34px}
  .sale-qualification{background:linear-gradient(130deg,#f8f1e8,#fffdf9 58%,#f4eee5);padding:100px 0}.sale-qualification-wrap{align-items:start;border:1px solid var(--sale-border);border-radius:28px;box-shadow:0 18px 60px rgba(7,27,58,.06);display:grid;gap:52px;grid-template-columns:31% 69%;padding:54px;background:rgba(255,253,249,.76)}.sale-qualification-copy{padding:18px 0}.sale-qualification-copy h2{font-size:clamp(38px,4vw,53px)}.sale-qualification-copy>p:not(.sale-eyebrow){color:var(--sale-muted);line-height:1.75;margin-top:22px}.sale-qualification-copy ul{list-style:none;margin:30px 0 0;padding:0}.sale-qualification-copy li{align-items:center;display:flex;font-size:13px;font-weight:600;gap:11px;margin:15px 0}.sale-qualification-copy li svg{color:var(--sale-gold);font-size:18px}.sale-panel{background:#fff;border:1px solid #e6d9c9;border-radius:22px;box-shadow:0 18px 50px rgba(7,27,58,.09);overflow:hidden}.sale-panel-head{align-items:center;background:var(--sale-navy);color:#fff;display:flex;justify-content:space-between;padding:22px 28px}.sale-panel-head span{color:#d6b887;font-size:9px;font-weight:700;letter-spacing:.14em}.sale-panel-head h3{font-family:Georgia,serif;font-size:20px;margin:3px 0 0}.sale-progress{display:flex;gap:7px}.sale-progress i{background:#8792a3;border-radius:50%;height:8px;width:8px}.sale-progress i.active{background:#d3a966}.sale-panel-content{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(210px,.65fr);min-height:450px}.sale-panel-content>main{padding:30px}.sale-preliminary{background:#fbf7f1;border-left:1px solid #eadfce;padding:30px 23px}.sale-preliminary>span,.sale-preliminary>small{color:#87735b;display:block;font-size:9px;font-weight:700;letter-spacing:.12em}.sale-fit{background:#edf5ed;border-radius:8px;color:#35633f;font-size:14px;font-weight:700;margin-top:12px;padding:10px 12px}.sale-fit-B{background:#f7f1df;color:#79622a}.sale-fit-C{background:#fff0df;color:#98631d}.sale-fit-D{background:#f7e8e5;color:#92473b}.sale-preliminary>p{color:var(--sale-muted);font-size:12px;line-height:1.55;margin-top:12px}.sale-preliminary hr{border:0;border-top:1px solid #e2d7c9;margin:20px 0}.sale-preliminary>strong{display:block;font-family:Georgia,serif;font-size:15px;margin:7px 0 22px}.sale-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.sale-chips i{background:#fff;border:1px solid #dfccb1;border-radius:99px;color:#85612d;font-size:9px;font-style:normal;padding:5px 8px}.sale-preliminary footer{color:#8a8075;font-size:9px;line-height:1.5;margin-top:22px}.sale-step-label{color:var(--sale-gold);font-size:9px;font-weight:700;letter-spacing:.13em}.sale-question h3,.sale-result h3,.sale-lead-form h3,.sale-success h3{font-family:Georgia,serif;font-size:25px;line-height:1.2;margin:9px 0}.sale-question>p{color:var(--sale-muted);font-size:13px}.sale-answers{display:grid;gap:10px;grid-template-columns:repeat(2,1fr);margin-top:24px}.sale-answers button{align-items:center;background:#fff;border:1px solid #e3d6c6;border-radius:11px;color:var(--sale-navy);display:flex;font-size:12px;font-weight:650;justify-content:space-between;min-height:57px;padding:10px 14px;text-align:left;transition:.15s}.sale-answers button:hover{border-color:var(--sale-gold)}.sale-answers button.active{background:#fbf4e9;border-color:var(--sale-gold);box-shadow:0 0 0 1px var(--sale-gold)}.sale-answers button svg{color:var(--sale-gold);flex:none}.sale-panel-actions{align-items:center;display:flex;justify-content:space-between;margin-top:24px}.sale-panel-actions .sale-btn{font-size:12px;min-height:45px}.sale-back{align-items:center;background:none;border:0;color:var(--sale-muted);display:flex;font-size:12px;gap:5px;padding:8px 0}.sale-no-obligation{align-items:center;color:#8a8075;display:flex;font-size:9px;gap:5px;margin-top:15px}.sale-result{text-align:left}.sale-result-mark{align-items:center;background:#edf5ed;border-radius:50%;color:#35633f;display:flex;font-size:22px;height:48px;justify-content:center;margin-bottom:18px;width:48px}.sale-result>span{color:var(--sale-gold);font-size:9px;font-weight:700;letter-spacing:.14em}.sale-result p,.sale-success p{color:var(--sale-muted);font-size:13px;line-height:1.65;margin:13px 0 22px}.sale-lead-form h3{margin-bottom:20px}.sale-form-grid{display:grid;gap:13px;grid-template-columns:repeat(2,1fr)}.sale-form-grid label{color:var(--sale-navy);font-size:10px;font-weight:700}.sale-form-grid label small{color:var(--sale-muted);font-weight:400}.sale-form-grid input,.sale-form-grid select,.sale-form-grid textarea{background:#fff;border:1px solid #e1d5c6;border-radius:9px;color:var(--sale-navy);display:block;font-size:12px;margin-top:5px;outline:none;padding:11px 12px;width:100%}.sale-form-grid input:focus,.sale-form-grid select:focus,.sale-form-grid textarea:focus{border-color:var(--sale-gold);box-shadow:0 0 0 2px rgba(185,130,59,.1)}.sale-form-grid textarea{min-height:68px;resize:vertical}.sale-full{grid-column:1/-1}.sale-success{padding-top:20px}
  @media(max-width:1120px){.sale-container{width:min(100% - 48px,1280px)}.sale-nav{gap:16px}.sale-nav a{font-size:11px}.sale-header-cta{display:none}.sale-hero-grid{grid-template-columns:50% 50%}.sale-hero-copy h1{font-size:48px}.sale-hero-buttons{align-items:flex-start;flex-direction:column}.sale-trust{align-items:flex-start;flex-wrap:wrap;width:100%}.sale-management-grid{gap:35px;grid-template-columns:30% 70%}.sale-qualification-wrap{gap:34px;grid-template-columns:30% 70%;padding:34px}}
  @media(max-width:900px){.sale-nav{display:none}.sale-menu-btn{display:block}.sale-lang{display:none}.sale-mobile-nav{display:flex;flex-direction:column}.sale-hero-grid{grid-template-columns:1fr;min-height:0}.sale-hero-copy{padding:65px 0 45px}.sale-hero-visual{height:520px}.sale-hero-photo{right:0}.sale-why-grid,.sale-offer-grid{grid-template-columns:repeat(2,1fr)}.sale-management-grid,.sale-qualification-wrap{grid-template-columns:1fr}.sale-management-copy{max-width:610px}.sale-management-visual{margin-top:15px}.sale-qualification-copy{max-width:620px}.sale-panel-content{grid-template-columns:1.4fr .7fr}}
  @media(max-width:640px){.sale-container{width:calc(100% - 40px)}.sale-header-inner{height:68px}.sale-brand{width:150px}.sale-brand span{font-size:21px}.sale-mobile-nav{top:68px}.sale-section{padding:66px 0}.sale-page h2{font-size:38px}.sale-hero-copy{min-width:0;padding:48px 0 35px}.sale-hero-copy h1{font-size:38px;overflow-wrap:anywhere}.sale-hero-copy .sale-eyebrow{display:none}.sale-lead{font-size:15px}.sale-hero-buttons .sale-btn{max-width:100%;min-width:0;padding:12px 14px;white-space:normal;width:100%}.sale-trust{display:grid;gap:12px;grid-template-columns:minmax(0,1fr) minmax(0,1fr);padding:14px}.sale-trust-item{border:0;margin:0;min-width:0;padding:0}.sale-trust-item strong,.sale-trust-item small{overflow-wrap:anywhere}.sale-google{grid-column:1/-1}.sale-hero-visual{height:420px;margin:0 -20px}.sale-hero-img{transform:none}.sale-advisor-card{bottom:18px;left:20px;right:auto;width:245px}.sale-why-grid,.sale-offer-grid{grid-template-columns:1fr}.sale-why-card{min-height:0}.sale-management{padding-bottom:84px}.sale-management-image{height:300px}.sale-management-visual{padding-bottom:0}.sale-services-card{grid-template-columns:1fr;position:relative;left:auto;right:auto;margin:-35px 12px 0}.sale-offer-image{height:240px}.sale-qualification{padding:52px 0}.sale-qualification-wrap{border:0;border-radius:0;box-shadow:none;margin:0;padding:0;width:100%}.sale-qualification-copy{padding:0 20px}.sale-panel{border-radius:18px;margin:0 12px}.sale-panel-content{grid-template-columns:1fr}.sale-panel-content>main{padding:25px 20px}.sale-preliminary{border-left:0;border-top:1px solid #eadfce}.sale-answers{grid-template-columns:1fr}.sale-form-grid{grid-template-columns:1fr}.sale-full{grid-column:auto}.sale-panel-actions{gap:12px}.sale-panel-actions .sale-btn{padding:0 15px}.sale-panel-head{padding:20px}.sale-panel-head h3{font-size:18px}}
`;
