import Head from "next/head";
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import styles from "@/styles/formOne.module.css";
import {
  FORM_ONE_BASE,
  GROUPS,
  REGIONS,
  type FormOneGroup,
  type FormOneOffer,
  type FormOneRegion,
} from "@/data/formOne";

// Landing /form-one — przeniesiony 1:1 ze statycznej strony „Dulka” (HTML + app.js)
// na komponenty Next.js. Klasy i wygląd jak w oryginale; style w formOne.module.css
// działają tylko wewnątrz tego landingu.

export const A = FORM_ONE_BASE; // prefiks wszystkich linków i zasobów
export const PHONE = "+48 505 055 846";
export const PHONE_HREF = "tel:+48505055846";
export const WA = "https://wa.me/48505055846";
export const EMAIL = "k.bakowicz@onesta.com.pl";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/k.bakowicz@onesta.com.pl";

export const euro = (n: number) => new Intl.NumberFormat("pl-PL").format(n) + " €";
export const roomCount = (n: number, one: string, few: string, many: string) =>
  n +
  " " +
  (n === 1
    ? one
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? few
      : many);

/* ---------- ikony (jak w oryginale) ---------- */

export const PhoneIcon = () => (
  <svg className="phone-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 3 4 1 1 5-3 2c1.5 3.2 2.8 4.5 6 6l2-3 5 1 1 4c.2 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2Z" />
  </svg>
);
export const WhatsAppIcon = () => (
  <svg className="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M27.5 15.5a12 12 0 0 1-17.8 10.6L4 28l1.9-5.6A12 12 0 1 1 27.5 15.5Z" />
    <path d="M12 9.5c-.7-.4-2 .8-2 2.3 0 4.1 5.3 9.3 9.2 9.3 1.5 0 2.8-1.5 2.3-2.2l-3-1.6-1.3 1.2c-2.1-.8-3.8-2.5-4.5-4.5l1.1-1.4L12 9.5Z" />
  </svg>
);
export const HomeIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M6 23 24 8l18 15M12 19v22h24V19M20 41V28h8v13M31 13V8h5v9" />
  </svg>
);
export const DiamondIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="m6 18 8-10h20l8 10-18 24L6 18Zm0 0h36M14 8l10 34L34 8M14 8l10 10L34 8" />
  </svg>
);

/* ---------- wybór oferty → formularz ---------- */

type Inquiry = { offer: FormOneOffer | null; nonce: number };
const InquiryContext = createContext<{
  inquiry: Inquiry;
  inquire: (offer: FormOneOffer) => void;
}>({ inquiry: { offer: null, nonce: 0 }, inquire: () => {} });
export const useInquiry = () => useContext(InquiryContext);

/* ---------- części stałe ---------- */

function SiteHeader() {
  return (
    <header>
      <Link className="brand" href={A} aria-label="Onesta — strona główna">
        <img src={`${A}/assets/logotype_full_new.svg`} alt="Onesta Group" />
      </Link>
      <nav aria-label="Menu główne">
        <Link href={`${A}#budzet`}>Wybierz nieruchomość</Link>
        <Link href={`${A}#jak-pomagamy`}>Jak pomagamy</Link>
        <a className="nav-contact" href="#kontakt">
          Porozmawiajmy <span>↗</span>
        </a>
      </nav>
      <div className="number-actions header-phone-group">
        <a className="header-phone" href={PHONE_HREF}>
          <PhoneIcon />
          <span>{PHONE}</span>
        </a>
        <a className="whatsapp-number" href={WA} aria-label="Napisz na WhatsApp" title="Napisz na WhatsApp" target="_blank" rel="noopener">
          <WhatsAppIcon />
        </a>
      </div>
    </header>
  );
}

const BUDGET_OPTIONS = [
  { value: "Do 250 000 €", label: "Do 250 tys. euro" },
  { value: "Do 400 000 €", label: "Do 400 tys. euro" },
  { value: "Do 500 000 €", label: "Do 500 tys. euro" },
  { value: "Nieruchomości premium", label: "Nieruchomość premium" },
];

function ContactSection({
  region,
  group,
  initialOffer,
}: {
  region: FormOneRegion;
  group: FormOneGroup | null;
  initialOffer: FormOneOffer | null;
}) {
  const { inquiry } = useInquiry();
  const offer = inquiry.offer || initialOffer;
  const [budgets, setBudgets] = useState<string[]>(group ? [group.label] : []);
  const [message, setMessage] = useState(
    initialOffer
      ? `Interesuje mnie oferta ${initialOffer.ref} — ${initialOffer.title}. Proszę o kontakt.`
      : "",
  );
  const [status, setStatus] = useState<{ text: string; state?: string }>({ text: "" });
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Kliknięcie „Zapytaj o tę nieruchomość” uzupełnia formularz (bez wysyłania za klienta).
  useEffect(() => {
    const p = inquiry.offer;
    if (!p) return;
    setMessage(`Interesuje mnie ta nieruchomość — nr oferty ${p.ref} (${p.title}). Proszę o kontakt.`);
    const budget = GROUPS.find((g) => g.slug === p.budget);
    setBudgets(budget ? [budget.label] : []);
    setStatus({ text: `Wybrana nieruchomość: ${p.ref}. Podaj imię i nazwisko oraz telefon, a skontaktuję się z Tobą.` });
    nameRef.current?.focus({ preventScroll: true });
  }, [inquiry]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    let category = "Strona główna";
    if (group) category = `${region.name} / ${group.label}`;
    if (offer) {
      const r = REGIONS.find((x) => x.slug === offer.region) || REGIONS[0];
      const g = GROUPS.find((x) => x.slug === offer.budget) || GROUPS[0];
      category = `${r.name} / ${g.label} / ${offer.ref}`;
    }
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      Budżet: budgets.join(", ") || "Do ustalenia",
      message: message.trim(),
      _honey: String(data.get("contact_website") || ""),
      Kategoria: category,
      Oferta: offer ? offer.ref : "",
      Strona: window.location.origin + window.location.pathname,
      _subject: "Onesta — zapytanie z landing page",
      _template: "table",
    };
    setSending(true);
    setStatus({ text: "Wysyłamy Twoje zapytanie…", state: "pending" });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let result: any;
      try {
        result = await response.json();
      } catch {
        throw new Error(`Nie udało się potwierdzić wysyłki. Zadzwoń: ${PHONE}.`);
      }
      if (!response.ok || !result || !(result.success === true || result.success === "true")) {
        throw new Error(typeof result?.message === "string" ? result.message : "Nie udało się potwierdzić wysyłki. Spróbuj później.");
      }
      setStatus({ text: "Dziękujemy! Twoje zapytanie zostało przekazane. Skontaktujemy się z Tobą.", state: "success" });
      form.reset();
      setBudgets([]);
      setMessage("");
    } catch (error: any) {
      setStatus({
        text:
          error?.name === "AbortError"
            ? `Nie udało się potwierdzić wysyłki w wymaganym czasie. Zadzwoń: ${PHONE}.`
            : error?.message || `Nie udało się potwierdzić wysyłki. Zadzwoń: ${PHONE}.`,
        state: "error",
      });
    } finally {
      window.clearTimeout(timer);
      setSending(false);
    }
  };

  return (
    <section className="contact" id="kontakt">
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">ZACZNIJMY OD ROZMOWY</p>
          <h2>
            Powiedz nam,
            <br />
            czego szukasz.
          </h2>
          <p>
            Drugi dom, miejsce na wakacje czy zakup z myślą o wynajmie? Poznajmy Twoje plany i dobierzmy
            odpowiednie nieruchomości.
          </p>
          <div className="person">
            <img src={`${A}/assets/Karolina.webp`} alt="Karolina Bakowicz" loading="lazy" />
            <div>
              <strong>Karolina Bakowicz</strong>
              <span>CO-FOUNDER</span>
            </div>
          </div>
          <div className="number-actions phone-group">
            <a className="phone" href={PHONE_HREF}>
              <PhoneIcon />
              <span>{PHONE}</span>
            </a>
            <a className="whatsapp-number" href={WA} aria-label="Napisz na WhatsApp" title="Napisz na WhatsApp" target="_blank" rel="noopener">
              <WhatsAppIcon />
            </a>
          </div>
          <a className="email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="whatsapp" href={WA} target="_blank" rel="noopener">
            <WhatsAppIcon />
            <span>Wolisz WhatsApp? Napisz do nas ↗</span>
          </a>
        </div>
        <form id="lead-form" ref={formRef} onSubmit={onSubmit} noValidate={false}>
          <h3>Porozmawiajmy o Twoich planach</h3>
          <p className="form-intro">
            Zostaw kontakt i wybierz interesujący Cię budżet. Wymagane są tylko imię i nazwisko oraz telefon.
          </p>
          <div className="form-row">
            <label>
              Imię i nazwisko <span className="required-mark">*</span>
              <input ref={nameRef} name="name" autoComplete="name" placeholder="Twoje imię i nazwisko" required maxLength={80} />
            </label>
            <label>
              Telefon <span className="required-mark">*</span>
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+48" required maxLength={30} pattern="[+0-9 ()\-]{7,30}" />
            </label>
          </div>
          <label>
            Adres e-mail <span className="optional">(opcjonalnie)</span>
            <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="twoj@email.pl" />
          </label>
          <fieldset className="budget-options">
            <legend>Twój budżet</legend>
            <div className="budget-checkboxes">
              {BUDGET_OPTIONS.map((o) => (
                <label key={o.value}>
                  <input
                    type="checkbox"
                    name="budget"
                    value={o.value}
                    checked={budgets.includes(o.value)}
                    onChange={(e) =>
                      setBudgets((b) => (e.target.checked ? [...b, o.value] : b.filter((x) => x !== o.value)))
                    }
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Co jest dla Ciebie ważne? <span className="optional">(opcjonalnie)</span>
            <textarea
              name="message"
              rows={2}
              placeholder="Napisz, jakiej nieruchomości szukasz…"
              aria-describedby="preferences-help"
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <p className="preferences-help" id="preferences-help">
            Podpowiedzi: region, liczba sypialni, odległość od morza, widok na morze, willa, apartament, wynajem turystyczny.
          </p>
          <p className="privacy">
            Administratorem danych jest Onesta Group sp. z o.o. Informacje o przetwarzaniu danych znajdziesz w{" "}
            <a href="/polityka-prywatnosci" target="_blank" rel="noopener">polityce prywatności</a>.
          </p>
          {/* Pole-pułapka na boty (puste u ludzi). */}
          <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Strona internetowa
              <input name="contact_website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button className="button" type="submit" disabled={sending} aria-busy={sending || undefined}>
            {sending ? "Wysyłanie…" : <>Wyślij zapytanie <span>↗</span></>}
          </button>
          <p className="form-note">
            Wysyłkę formularza obsługuje FormSubmit. Dane zgłoszenia zostaną przekazane tej usłudze w celu dostarczenia wiadomości.
          </p>
          <p id="form-status" role="status" data-state={status.state}>
            {status.text}
          </p>
        </form>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="section story" id="jak-pomagamy">
      <div className="story-picture">
        <img src={`${A}/assets/pueblo-blanco-drone.webp`} alt="Wygenerowany widok z drona na andaluzyjskie pueblo blanco z morzem w tle" loading="lazy" />
        <div className="picture-label">
          <strong>Najpierw Twoje plany.</strong>Potem odpowiedni adres.
        </div>
      </div>
      <div>
        <p className="eyebrow">ONESTA · DORADZAMY LEPIEJ</p>
        <h2>
          Własny dom za granicą.
          <br />
          Wsparcie na każdym etapie.
        </h2>
        <p className="story-text">
          Nie musisz znać hiszpańskiego rynku, by zacząć szukać. Pomożemy porównać lokalizacje, uporządkować koszty i przygotować kolejne kroki.
        </p>
        <div className="steps">
          {[
            ["01", "Rozmawiamy o Twoich potrzebach", "Budżet, region i sposób korzystania z nieruchomości."],
            ["02", "Dobieramy i pokazujemy oferty", "Porównujesz konkretne propozycje i poznajesz okolice."],
            ["03", "Towarzyszymy Ci w zakupie", "Od rezerwacji i kontaktu z prawnikiem po odbiór kluczy."],
          ].map(([n, h, p]) => (
            <div className="step" key={n}>
              <span>{n}</span>
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <img src={`${A}/assets/logotype_full_new.svg`} alt="Onesta Group" loading="lazy" />
          <p>
            Twój adres w Hiszpanii.
            <br />
            Nasze doświadczenie po Twojej stronie.
          </p>
        </div>
        <div>
          <h4>Biuro w Polsce</h4>
          <p>
            Plac Mikołaja Kopernika 1/3
            <br />
            45-040 Opole
          </p>
        </div>
        <div>
          <h4>Biuro w Hiszpanii</h4>
          <p>
            Calle Abel 19
            <br />
            30720 San Javier, Hiszpania
          </p>
        </div>
        <div>
          <h4>Kontakt</h4>
          <div className="number-actions footer-phone-group">
            <a href={PHONE_HREF}>
              <PhoneIcon />
              <span>{PHONE}</span>
            </a>
            <a className="whatsapp-number" href={WA} aria-label="Napisz na WhatsApp" target="_blank" rel="noopener">
              <WhatsAppIcon />
            </a>
          </div>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>
      <div className="legal">
        <p>
          © {new Date().getFullYear()} Onesta Group sp. z o.o. · NIP 8992922378
          <br />
          Siedziba: ul. Wolbromska 18/1b, 53-148 Wrocław
        </p>
        <a href="/polityka-prywatnosci" target="_blank" rel="noopener">Polityka prywatności ↗</a>
        <a href="/" target="_blank" rel="noopener">onesta.com.pl ↗</a>
      </div>
    </footer>
  );
}

export function OtherSearch() {
  return (
    <section className="other-search">
      <div>
        <p className="eyebrow">WIĘCEJ MOŻLIWOŚCI Z ONESTA</p>
        <h2>
          Szukasz czegoś innego?
          <br />
          Porozmawiajmy.
        </h2>
        <p>
          Mamy aktualnie w ofercie ponad <strong>5000 nieruchomości z rynku pierwotnego i wtórnego.</strong> Powiedz nam, czego szukasz — na pewno znajdziemy coś odpowiedniego.
        </p>
      </div>
      <a className="button" href="#kontakt">
        Porozmawiajmy o Twoich potrzebach <span>↗</span>
      </a>
    </section>
  );
}

/* ---------- układ strony ---------- */

export default function FormOneLayout({
  title,
  description,
  canonicalPath,
  region = REGIONS[0],
  group = null,
  initialOffer = null,
  children,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  region?: FormOneRegion;
  group?: FormOneGroup | null;
  initialOffer?: FormOneOffer | null;
  children: ReactNode;
}) {
  const [inquiry, setInquiry] = useState<Inquiry>({ offer: null, nonce: 0 });

  // Przewijanie do kotwic jak w oryginale (html { scroll-behavior; scroll-padding-top }).
  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.scrollBehavior, html.style.scrollPaddingTop];
    const apply = () => {
      html.style.scrollBehavior = "smooth";
      html.style.scrollPaddingTop = window.matchMedia("(max-width: 760px)").matches ? "16px" : "95px";
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      html.style.scrollBehavior = prev[0];
      html.style.scrollPaddingTop = prev[1];
    };
  }, []);

  return (
    <InquiryContext.Provider
      value={{ inquiry, inquire: (offer) => setInquiry((i) => ({ offer, nonce: i.nonce + 1 })) }}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#163c40" />
        {/* Landing kampanii — nie konkuruje w Google z katalogiem ofert. */}
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={`https://onesta.com.pl${canonicalPath}`} />
        <link rel="icon" href="/logotype.png" />
      </Head>
      <div className={styles.root}>
        <SiteHeader />
        <main id="content">{children}</main>
        <ContactSection key={canonicalPath} region={region} group={group} initialOffer={initialOffer} />
        <SupportSection />
        <SiteFooter />
      </div>
    </InquiryContext.Provider>
  );
}
