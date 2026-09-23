/* Native images intentionally keep full-resolution assets available for printing. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { FiArrowDown, FiArrowUp, FiArrowUpRight, FiCheck, FiDownload, FiMapPin, FiRefreshCw, FiSun } from "react-icons/fi";
import { dossierSources, mortgagePayment, type DossierOffer, type DossierStep } from "@/data/dossierDemo";
import s from "./Dossier.module.css";

const euro = (value: number, digits = 0) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
const number = (value: number) => new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 }).format(value);

function Sources({ items, date }: { items: { label: string; url: string }[]; date?: string }) {
  return <div className={s.sources}>
    <span>Źródła{date ? ` · ${date}` : ""}:</span>{" "}
    {items.map((item, index) => <span key={item.url}>{index > 0 && " · "}<a href={item.url} target="_blank" rel="noreferrer">{item.label}</a></span>)}
  </div>;
}

function Sheet({ offer, page, label, children, className = "" }: { offer: DossierOffer; page: number; label: string; children: ReactNode; className?: string }) {
  return <section className={`${s.sheet} ${className}`} id={`strona-${page}`} aria-label={`Strona ${page}: ${label}`}>
    <header className={s.pageHeader}>
      <img className={s.logo} src="/logotype_full_new.png" alt="Onesta Group" width="132" height="33" />
      <span>{label}</span>
    </header>
    <div className={s.pageBody}><div className={s.pageContent}>{children}</div></div>
    <footer className={s.pageFooter}>
      <a href="https://onesta.com.pl">onesta.com.pl</a>
      <span>REF {offer.reference}{offer.isDemo ? " · Wersja pokazowa" : ""}</span>
      <span className={s.pageNumber}>{String(page).padStart(2, "0")} <i>/ 10</i></span>
    </footer>
  </section>;
}

function Title({ eyebrow, children, description }: { eyebrow: string; children: ReactNode; description?: string }) {
  return <div className={s.titleBlock}>
    <p className={s.eyebrow}>{eyebrow}</p>
    <h2>{children}</h2>
    {description && <p className={s.intro}>{description}</p>}
  </div>;
}

/** DOM reading order stays chronological; CSS reverses only the middle visual row. */
function Journey({ steps, compact = false }: { steps: DossierStep[]; compact?: boolean }) {
  return <ol className={`${s.journey} ${compact ? s.journeyCompact : ""}`}>
    <svg className={s.journeyLine} viewBox="0 0 660 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M 105 28 H 617 Q 649 28 649 61 V 196 Q 649 228 617 228 H 43 Q 11 228 11 260 V 396 Q 11 428 43 428 H 555" />
    </svg>
    {steps.map((step, index) => <li key={step.title} className={s.journeyStep}>
      <span className={`${s.stepNumber} ${step.repeat ? s.repeatNumber : ""}`}>
        {step.repeat ? <><FiRefreshCw aria-hidden="true" /><span className={s.srOnly}>Etap {index + 1}: powtarzamy</span></> : String(index + 1).padStart(2, "0")}
      </span>
      {step.timing && <p className={s.stepTiming}>{step.timing}</p>}
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </li>)}
  </ol>;
}

function AreaMap({ area }: { area: DossierOffer["area"] }) {
  const map = area.map;
  const position = (latitude: number, longitude: number): CSSProperties => {
    const n = 2 ** map.zoom;
    const x = (longitude + 180) / 360 * n;
    const y = (1 - Math.asinh(Math.tan(latitude * Math.PI / 180)) / Math.PI) / 2 * n;
    return { left: `${(x - map.x) / map.columns * 100}%`, top: `${(y - map.y) / map.rows * 100}%` };
  };
  return <div className={s.map}>
    <div className={s.mapTiles} style={{ gridTemplateColumns: `repeat(${map.columns}, 1fr)`, aspectRatio: `${map.columns} / ${map.rows}` }}>
      {Array.from({ length: map.columns * map.rows }, (_, index) => {
        const x = map.x + index % map.columns;
        const y = map.y + Math.floor(index / map.columns);
        return <img key={`${x}-${y}`} src={`${map.assetPath}/${x}-${y}.png`} alt="" width="256" height="256" />;
      })}
    </div>
    {area.places.map((place, index) => <a key={place.name} href={`#miejsce-${index}`} className={s.mapMarker} style={position(place.latitude, place.longitude)} aria-label={`${index + 1}. ${place.name}`}>{index + 1}</a>)}
    <a className={s.mapOpen} href={map.url} target="_blank" rel="noreferrer">Otwórz mapę <FiArrowUpRight aria-hidden="true" /></a>
    <a className={s.mapAttribution} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
  </div>;
}

export default function Dossier({ offer }: { offer: DossierOffer }) {
  const documentRef = useRef<HTMLElement>(null);
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState("");
  const finance = offer.finance;
  const deposit = finance.price * finance.depositPercent / 100;
  const principal = finance.price - deposit;
  const monthly = mortgagePayment(principal, finance.annualRate, finance.years);
  const vat = finance.price * finance.vatPercent / 100;
  const ajd = finance.price * finance.ajdPercent / 100;
  const available = offer.availability.filter(unit => unit.status === "Dostępny");

  useEffect(() => {
    // Keep each section on its own physical A4 sheet, including native Ctrl/Cmd+P.
    // beforeprint runs with print media applied, so measurements use the A4 width.
    const fitPrintPages = () => {
      documentRef.current?.querySelectorAll<HTMLElement>(`.${s.pageBody}`).forEach(body => {
        const content = body.firstElementChild as HTMLElement | null;
        if (!content) return;
        content.style.setProperty("--print-scale", "1");
        const availableHeight = body.clientHeight - parseFloat(getComputedStyle(body).paddingTop);
        const contentHeight = content.scrollHeight;
        const scale = contentHeight > 0 ? Math.min(1, (availableHeight - 2) / contentHeight) : 1;
        content.style.setProperty("--print-scale", String(Math.max(0.1, scale)));
      });
    };
    const resetPrintPages = () => {
      documentRef.current?.querySelectorAll<HTMLElement>(`.${s.pageContent}`).forEach(content => content.style.removeProperty("--print-scale"));
    };
    window.addEventListener("beforeprint", fitPrintPages);
    window.addEventListener("afterprint", resetPrintPages);
    return () => {
      window.removeEventListener("beforeprint", fitPrintPages);
      window.removeEventListener("afterprint", resetPrintPages);
    };
  }, []);

  async function printDossier() {
    setPrinting(true);
    setPrintError("");
    try {
      await document.fonts.ready;
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-dossier] img"));
      await Promise.all(images.map(async img => {
        if (!img.complete) await new Promise<void>((resolve, reject) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => reject(new Error("image")), { once: true });
        });
        if (!img.naturalWidth) throw new Error("image");
        await img.decode();
      }));
      window.print();
    } catch {
      setPrintError("Nie udało się wczytać wszystkich zdjęć. Odśwież stronę i spróbuj ponownie.");
    } finally {
      setPrinting(false);
    }
  }

  return <div className={s.viewer} lang="pl">
    <div className={s.toolbar}>
      <a href="#strona-1" className={s.toolbarBrand}><img src="/logotype_Onesta.png" alt="" width="24" height="30" /><span>ONESTA <i>/</i> <strong>Dossier nieruchomości</strong></span></a>
      <div className={s.toolbarActions}><span className={s.previewLabel}>REF {offer.reference} <i>·</i> 10 stron</span><button onClick={printDossier} disabled={printing}><FiDownload aria-hidden="true" />{printing ? "Przygotowuję…" : "Drukuj / zapisz PDF"}</button></div>
    </div>
    {printError && <p role="alert" className={s.printError}>{printError}</p>}
    <main className={s.document} data-dossier ref={documentRef}>
      <Sheet offer={offer} page={1} label={`Broszura informacyjna oferty REF ${offer.reference}`} className={s.cover}>
        <div className={s.coverIntro}><p className={s.eyebrow}><span /> Nieruchomości z myślą o Tobie</p><p className={s.coverEdition}>{offer.edition}</p></div>
        <div className={s.coverVisual}>
          <img src={offer.hero.src} alt={offer.hero.alt} className={s.coverImage} fetchPriority="high" />
          <div className={s.coverShade} />
          <div className={s.coverLocation}><FiMapPin aria-hidden="true" />{offer.location}</div>
          <div className={s.coverTitle}><p>Twój adres nad Morzem Śródziemnym</p><h1>{offer.title}</h1></div>
        </div>
        <div className={s.coverBottom}>
          <div><p className={s.coverDescription}>{offer.introduction}</p><span className={s.coverSignature}>Miejsce na dobre życie.</span></div>
          <a href="#strona-2" className={s.coverNext} aria-label="Przejdź do opisu projektu"><FiArrowDown aria-hidden="true" /></a>
        </div>
        {offer.isDemo && <p className={s.assetNote}>{offer.imageCredit}</p>}
      </Sheet>

      <Sheet offer={offer} page={2} label="O projekcie">
        <Title eyebrow="01 / Poznaj inwestycję">{offer.project.title}</Title>
        <div className={s.projectCopy}>{offer.project.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
        <div className={s.projectVisual}><img src={offer.gallery[2]?.src || offer.hero.src} alt={offer.gallery[2]?.alt || offer.hero.alt} /><span><FiSun aria-hidden="true" /> Przestrzeń dla Twojej codzienności</span></div>
        <table className={s.detailTable}><caption>Najważniejsze informacje</caption><tbody>{offer.project.details.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table>
        <h3 className={s.smallHeading}>To również zyskujesz</h3>
        <ul className={s.amenities}>{offer.project.amenities.map(amenity => <li key={amenity}><FiCheck aria-hidden="true" />{amenity}</li>)}</ul>
        {offer.isDemo && <p className={s.note}>Parametry są przykładowe. Zdjęcia i rzuty pokazują SOL Y PLAYA II w Lo Pagán; dane tej oferty należy potwierdzić u dewelopera.</p>}
      </Sheet>

      <Sheet offer={offer} page={3} label="Galeria" className={s.galleryPage}>
        <Title eyebrow="02 / Zobacz więcej">Poczuj charakter miejsca.</Title>
        <div className={s.gallery}>{offer.gallery.map((img, index) => <figure key={img.src} className={index === 0 ? s.galleryTall : ""}><img src={img.src} alt={img.alt} /><figcaption>{img.caption}</figcaption></figure>)}</div>
        <p className={s.note}>{offer.imageCredit} Wizualizacje mają charakter poglądowy.</p>
      </Sheet>

      <Sheet offer={offer} page={4} label="Lokalizacja">
        <Title eyebrow="03 / Twoje nowe otoczenie">{offer.area.name}. <em>Więcej niż wakacje.</em></Title>
        <p className={s.areaIntro}>{offer.area.description}</p>
        <AreaMap area={offer.area} />
        <div className={s.places}>{offer.area.places.map((place, index) => <div key={place.name} id={`miejsce-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{place.name}</h3><p>{place.description}</p></div></div>)}</div>
        <p className={s.note}>Mapa pokazuje Alicante i punkty w okolicy. Dokładny adres inwestycji nie został podany, dlatego nie oznaczamy jej położenia ani czasu dojazdu.</p>
        <Sources items={offer.area.sources} />
      </Sheet>

      <Sheet offer={offer} page={5} label="Przykładowe rzuty mieszkań" className={s.plansPage}>
        <Title eyebrow="04 / Dobrze zaplanowana przestrzeń">Znajdź swój układ.</Title>
        <div className={s.plans}>{offer.plans.map((plan, index) => <figure key={plan.src}><figcaption><div><span className={s.eyebrow}>Wariant {String(index + 1).padStart(2, "0")}</span><h3>{plan.title}</h3></div><span>{plan.details}</span></figcaption><a href={plan.src} target="_blank" rel="noreferrer" aria-label={`Otwórz pełny rzut: ${plan.title}`}><img src={plan.src} alt={plan.alt} /></a><p>{plan.caption}</p></figure>)}</div>
        <p className={s.note}>Oryginalne materiały dewelopera zachowują proporcje. Rzuty pokazowe z projektu w Lo Pagán nie odpowiadają przykładowej tabeli dostępności w Alicante.</p>
      </Sheet>

      <Sheet offer={offer} page={6} label="Dostępność">
        <Title eyebrow="05 / Wybierz swój apartament">Miejsce dopasowane<br />do Twoich planów.</Title>
        <div className={s.availabilityStats}><div><strong>{String(available.length).padStart(2, "0")}</strong><span>dostępnych lokali{offer.isDemo ? " w przykładzie" : ""}</span></div><div><strong>{available.length ? euro(Math.min(...available.map(unit => unit.price))) : "—"}</strong><span>cena od · bez podatków</span></div></div>
        {offer.isDemo && <p className={s.demoBadge}>Przykładowy cennik · nie stanowi aktualnej oferty dewelopera</p>}
        <div className={s.tableScroll}><table className={s.unitsTable}><caption className={s.srOnly}>Dostępne lokale i ceny netto</caption><thead><tr><th scope="col">Lokal / piętro</th><th scope="col">Syp. / łaz.</th><th scope="col">Pow.</th><th scope="col">Taras</th><th scope="col">Cena netto</th><th scope="col">Status</th></tr></thead><tbody>{offer.availability.map(unit => <tr key={unit.id}><th scope="row"><strong>{unit.id}</strong><small>{unit.floor}</small></th><td>{unit.bedrooms} / {unit.bathrooms}</td><td>{number(unit.area)} m²</td><td>{number(unit.terrace)} m²</td><td className={s.unitPrice}>{euro(unit.price)}</td><td><span className={unit.status === "Dostępny" ? s.available : s.reserved}>{unit.status}</span></td></tr>)}</tbody></table></div>
        <div className={s.availabilityNote}><span className={s.eyebrow}>Przed podjęciem decyzji</span><h3>Dobra oferta zaczyna się<br />od pełnego obrazu.</h3><p>Potwierdzamy aktualny status, cenę, ekspozycję, powierzchnię i to, co obejmuje zakup. Porównujemy również koszty utrzymania i warunki płatności.</p></div>
        <p className={s.note}>Powierzchnia oznacza powierzchnię zabudowaną; taras pokazano oddzielnie. Do ceny należy doliczyć podatki i koszty opisane na stronie 8. Dostępność zawsze wymaga potwierdzenia.</p>
      </Sheet>

      <Sheet offer={offer} page={7} label="Proces zakupu">
        <Title eyebrow="06 / Od wyboru do kluczy" description="Jeden proces, jasne etapy. Wiesz, co dzieje się teraz i co czeka Cię za chwilę.">Krok po kroku.<br /><em>Ze spokojem.</em></Title>
        <Journey steps={offer.purchaseSteps} />
        <div className={s.callout}><strong>Harmonogram ustalamy dla konkretnej inwestycji.</strong><p>Kwota rezerwacji, transze i terminy powyżej są przykładowe. Do wpłat dochodzi należny IVA. Warunki zwrotu rezerwacji i zabezpieczenia zaliczek sprawdzamy przed podpisaniem umowy.</p></div>
      </Sheet>

      <Sheet offer={offer} page={8} label="Koszty">
        <Title eyebrow="07 / Pełny obraz budżetu" description={`Zakup nowego mieszkania od dewelopera · ${finance.region} · drugi dom.`}>Cena to początek.<br /><em>Poznaj cały budżet.</em></Title>
        <table className={s.costTable}><caption className={s.srOnly}>Koszty zakupu nowego mieszkania</caption><thead><tr><th scope="col">Pozycja</th><th scope="col">Kwota / zasada</th><th scope="col">Charakter</th></tr></thead><tbody>
          <tr><th scope="row">IVA <small>Podatek przy zakupie nowego mieszkania</small></th><td>{number(finance.vatPercent)}% · {euro(vat)}</td><td><span className={s.required}>Obowiązkowe</span></td></tr>
          <tr><th scope="row">AJD <small>Podatek od aktu zakupu · stawka ogólna</small></th><td>{number(finance.ajdPercent)}% · {euro(ajd)}</td><td><span className={s.required}>Obowiązkowe</span></td></tr>
          <tr><th scope="row">Notariusz i rejestr <small>Akt zakupu i wpis własności</small></th><td>Według taryfy<br /><small>i podziału w umowie</small></td><td><span className={s.required}>Do budżetu zakupu</span></td></tr>
          <tr><th scope="row">NIE <small>Numer identyfikacyjny cudzoziemca</small></th><td>Opłata urzędowa<br /><small>według aktualnej taryfy</small></td><td><span className={s.required}>Jeśli nie posiadasz</span></td></tr>
          <tr><th scope="row">Obsługa prawna <small>Analiza dokumentów i umowy</small></th><td>Indywidualna wycena</td><td><span className={s.optional}>Opcjonalne</span></td></tr>
          <tr><th scope="row">Wycena bankowa <small>Tasación do wniosku kredytowego</small></th><td>Wycena rzeczoznawcy</td><td><span className={s.required}>Przy kredycie</span></td></tr>
          <tr><th scope="row">Pełnomocnictwo / tłumaczenia</th><td>Zależnie od zakresu</td><td><span className={s.optional}>Według potrzeb</span></td></tr>
          <tr><th scope="row">Umeblowanie i obsługa najmu</th><td>Indywidualny pakiet</td><td><span className={s.optional}>Opcjonalne</span></td></tr>
        </tbody></table>
        <div className={s.budgetTotal}><div><span>Cena {euro(finance.price)} + IVA + AJD</span><strong>{euro(finance.price + vat + ajd)}</strong></div><p>Do tej kwoty dolicz opłaty transakcyjne i wybrane usługi z tabeli.</p></div>
        <p className={s.note}>AJD 1,4% obowiązuje w regionie od 1.06.2026; preferencje zależą od spełnienia warunków. Kwotę AJD obliczono przy założeniu podstawy równej cenie. Koszty ustanowienia hipoteki (notariusz, rejestr, podatek, gestoría) ponosi bank; kupujący opłaca wycenę. Koszty aktu zakupu są odrębne.</p>
        <p className={s.note}>Po zakupie uwzględnij też IBI, wspólnotę, media, ubezpieczenie i podatki związane z posiadaniem lub wynajmem. Kwoty zależą od lokalu i sytuacji właściciela.</p>
        <Sources items={[dossierSources.vat, dossierSources.ajd, dossierSources.mortgageCosts]} date={finance.sourceDate} />
      </Sheet>

      <Sheet offer={offer} page={9} label="Kredytowanie">
        <Title eyebrow="08 / Finansowanie zakupu">Twój dom.<br /><em>Twój plan finansowy.</em></Title>
        <p className={s.financeIntro}>Zakup w Hiszpanii można sfinansować kredytem hipotecznym. Bank ocenia dochody, zobowiązania, kraj rezydencji i walutę zarobków. Podatki i koszty zakupu zaplanuj ze środków własnych.</p>
        <table className={s.financeTable}><caption>Przykład warunków · Bankinter, drugi dom</caption><tbody>
          <tr><th scope="row">Finansowanie banku</th><td>Do 60% niższej z wartości: ceny lub wyceny</td></tr>
          <tr><th scope="row">Wkład własny</th><td>Co najmniej 40% + podatki i opłaty</td></tr>
          <tr><th scope="row">Oprocentowanie referencyjne</th><td>3,60% TIN z warunkami dodatkowymi<br /><small>4,90% TIN bez bonifikaty · przykład na 20 lat</small></td></tr>
          <tr><th scope="row">Dokumenty</th><td>Tożsamość / NIE, dochody, rozliczenia podatkowe, dokumenty nieruchomości</td></tr>
        </tbody></table>
        <div className={s.simulation}>
          <div className={s.simulationHeader}><span className={s.eyebrow}>Przykładowa symulacja</span><span>{finance.years} lat / {finance.years * 12} rat</span></div>
          <dl><div><dt>Cena nieruchomości netto</dt><dd>{euro(finance.price)}</dd></div><div><dt>Wkład własny · {finance.depositPercent}%</dt><dd>{euro(deposit)}</dd></div><div><dt>Kwota kredytu · {100 - finance.depositPercent}%</dt><dd>{euro(principal)}</dd></div><div><dt>Stała stopa nominalna · założenie</dt><dd>{number(finance.annualRate)}% rocznie</dd></div></dl>
          <div className={s.monthlyPayment}><div><span>Szacunkowa rata miesięczna</span><strong>{euro(monthly, 2)}</strong></div><FiArrowUpRight aria-hidden="true" /></div>
          <p>Raty równe · suma rat {euro(monthly * finance.years * 12)} · odsetki {euro(monthly * finance.years * 12 - principal)}</p>
        </div>
        <p className={s.note}>Symulacja przenosi stopę 3,60% z opublikowanego przykładu 20-letniego na 15 lat. To założenie obliczeniowe, nie oferta kredytu dla nierezydenta. TIN to stopa nominalna, nie RRSO/TAE; rata nie obejmuje prowizji, ubezpieczeń ani kosztów produktów potrzebnych do bonifikaty.</p>
        <p className={s.note}><strong>Środki własne: {euro(deposit + vat + ajd)} + opłaty.</strong> Harmonogram 30% + 30% przed odbiorem wymaga więcej gotówki niż wkład 40%. Dostępność kredytu i finansowanie transz należy ustalić przed rezerwacją; kredyt może być uruchamiany dopiero przy akcie.</p>
        <Sources items={[dossierSources.rates, dossierSources.mortgage]} date={finance.sourceDate} />
      </Sheet>

      <Sheet offer={offer} page={10} label="Dlaczego my" className={s.whyPage}>
        <Title eyebrow="09 / Poznaj Onestę">Po Twojej stronie.<br /><em>Od pierwszej rozmowy.</em></Title>
        <div className={s.whyIntro}><p>Występujemy w interesie kupującego. Zaczynamy od wzajemnego zrozumienia, a wiedzę o rynku, lokalizacji i zakupie przekazujemy tak, żebyś mógł podjąć świadomą decyzję.</p><div><strong>100%</strong><span>dostępu do rynku<br />deweloperskiego*</span></div></div>
        <div className={s.whyPrinciples}><div><span>01</span><h3>Twój cel jest punktem wyjścia</h3><p>Porównujemy projekty pod kątem tego, czego potrzebujesz.</p></div><div><span>02</span><h3>Wiedza daje pewność</h3><p>Wyjaśniamy koszty, możliwości i kolejne kroki.</p></div><div><span>03</span><h3>Jeden model współpracy</h3><p>Od selekcji po klucze. Celem jest Twoja satysfakcja.</p></div></div>
        <p className={s.note}>* Costa Blanca, Costa del Sol, Costa Cálida i Costa de Almería — zakres dostępu deklarowany przez Onesta Group. Dostępność konkretnych lokali potwierdzamy u deweloperów.</p>
        <div className={s.cooperationHeading}><h3>Tak pracujemy razem</h3><span>Od rozmowy do dobrej decyzji</span></div>
        <Journey steps={offer.cooperationSteps} compact />
        <div className={s.closing}><span>Porozmawiajmy o Twoim miejscu w Hiszpanii.</span><a href="https://onesta.com.pl">onesta.com.pl <FiArrowUpRight aria-hidden="true" /></a></div>
        <Sources items={[dossierSources.onesta]} />
      </Sheet>
    </main>
    <div className={s.viewerEnd}><span>ONESTA GROUP · {offer.edition}</span><a href="#strona-1">Wróć na początek <FiArrowUp aria-hidden="true" /></a></div>
  </div>;
}
