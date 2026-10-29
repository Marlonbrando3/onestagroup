import Link from "next/link";
import { useState } from "react";
import {
  GROUPS,
  REGIONS,
  type FormOneGroup,
  type FormOneOffer,
  type FormOneRegion,
} from "@/data/formOne";
import {
  A,
  DiamondIcon,
  HomeIcon,
  OtherSearch,
  PHONE,
  PHONE_HREF,
  PhoneIcon,
  WA,
  EMAIL,
  WhatsAppIcon,
  euro,
  roomCount,
  useInquiry,
} from "./FormOneLayout";

export const categoryPath = (r: { slug: string }, g: { slug: string }) => `${A}/${r.slug}/${g.slug}`;

/* ---------- strona główna ---------- */

function BudgetCard({ g, i, r }: { g: FormOneGroup; i: number; r: FormOneRegion }) {
  return (
    <Link className={`budget-card ${i === 3 ? "premium" : ""}`} href={categoryPath(r, g)}>
      <div className="card-top">
        <span>TOP 5 · 0{i + 1}</span>
        {i === 3 ? <DiamondIcon /> : <HomeIcon />}
      </div>
      <h3>
        {i === 3 ? null : <small>do</small>}
        {g.price}
      </h3>
      <p>{g.description}</p>
      <div className="card-link">
        Zobacz nieruchomości <span>↗</span>
      </div>
    </Link>
  );
}

export function FormOneHome() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">NIERUCHOMOŚCI W HISZPANII · ONESTA GROUP</p>
          <h1>
            Twój adres
            <br />w Hiszpanii.
            <br />
            <em>Bliżej, niż myślisz.</em>
          </h1>
          <p className="hero-description">
            Wybierz swój budżet. My pomożemy Ci znaleźć nieruchomość i przejść przez cały proces zakupu po polsku.
          </p>
          <a className="button" href="#budzet">
            Znajdź swoją nieruchomość <span>↗</span>
          </a>
          <p className="hero-small">{"Costa Blanca \u00a0 / \u00a0 Costa Cálida \u00a0 / \u00a0 Costa del Sol"}</p>
        </div>
        <div
          className="hero-image"
          role="img"
          aria-label="Wygenerowany widok inspirowany Costa del Sol, z morzem, górami i andaluzyjskimi domami"
        />
      </section>
      <div className="trust">
        <div>
          <strong>0% prowizji</strong>
          <span>dla kupującego</span>
        </div>
        <div>
          <strong>Po polsku</strong>
          <span>od rozmowy do odbioru kluczy</span>
        </div>
        <div>
          <strong>Na miejscu</strong>
          <span>biura w Hiszpanii i w Polsce</span>
        </div>
      </div>
      {REGIONS.map((r, i) => (
        <section key={r.slug} className={`section region-budget ${i === 1 ? "region-sol" : ""}`} id={i === 0 ? "budzet" : r.slug}>
          <div className="region-heading">
            <img
              className="region-view"
              src={`${A}/assets/${i === 0 ? "costa-blanca-cove.webp" : "costa-del-sol-region-v2.webp"}`}
              alt={i === 0 ? "Ilustracyjny widok zatoki inspirowany Costa Blanca" : "Ilustracyjny widok inspirowany Costa del Sol"}
              loading="lazy"
            />
            <div className="region-intro">
              <p className="eyebrow">WYBRANE NIERUCHOMOŚCI · HISZPANIA</p>
              <h2>{r.name}</h2>
              <p>Wybierz swój budżet i poznaj nasze propozycje.</p>
            </div>
          </div>
          <div className="selection-badge">
            <strong>TOP 5</strong>
            <span>Wyselekcjonowane nieruchomości w każdej kategorii cenowej</span>
          </div>
          <div className="categories">
            {GROUPS.map((g, j) => (
              <BudgetCard key={g.slug} g={g} i={j} r={r} />
            ))}
          </div>
          <p className="budget-footnote">Kwoty dotyczą ceny nieruchomości. Podatki i pozostałe koszty zakupu należy uwzględnić osobno.</p>
        </section>
      ))}
      <OtherSearch />
    </>
  );
}

/* ---------- wspólne elementy ofert ---------- */

function OfferCta({ p }: { p: FormOneOffer }) {
  const { inquire } = useInquiry();
  const waText = encodeURIComponent(`Dzień dobry, interesuje mnie oferta ${p.ref} — ${p.title}. Proszę o kontakt.`);
  return (
    <section className="offer-cta" aria-label={`Zapytaj o nieruchomość ${p.ref}`}>
      <div className="offer-cta-copy">
        <h3>Ta nieruchomość pasuje do Twoich planów?</h3>
        <p>Zapytaj mnie o aktualną dostępność, dodatkowe zdjęcia lub możliwość obejrzenia nieruchomości.</p>
      </div>
      <a className="button offer-inquiry" href="#kontakt" onClick={() => inquire(p)}>
        Zapytaj o tę nieruchomość <span aria-hidden="true">→</span>
      </a>
      <div className="offer-cta-contact">
        <span>Wolisz porozmawiać?</span>
        <a href={PHONE_HREF}>
          <PhoneIcon />
          <span>{PHONE}</span>
        </a>
        <a className="offer-cta-whatsapp" href={`${WA}?text=${waText}`} target="_blank" rel="noopener">
          <WhatsAppIcon />
          <span>Napisz na WhatsApp</span>
        </a>
      </div>
    </section>
  );
}

function CategoryTabs({ region, current }: { region: FormOneRegion; current: FormOneGroup }) {
  return (
    <nav className="category-tabs" aria-label="Kategorie cenowe">
      {GROUPS.map((x) => (
        <Link key={x.slug} href={categoryPath(region, x)} aria-current={x.slug === current.slug ? "page" : undefined}>
          {x.label}
        </Link>
      ))}
    </nav>
  );
}

/* ---------- lista TOP 5 w kategorii ---------- */

function OfferCard({ p, i, region }: { p: FormOneOffer; i: number; region: FormOneRegion }) {
  const [photo, setPhoto] = useState(0);
  return (
    <article className="property-card simple-property">
      <div className="inline-property-gallery">
        <div className="inline-property-main">
          <img src={p.images[photo]} alt={`${p.title} — zdjęcie ${photo + 1}`} loading={i ? "lazy" : undefined} />
          <span>TOP 5 · 0{i + 1}</span>
        </div>
        <div className="inline-property-thumbs" aria-label={`Zdjęcia: ${p.title}`}>
          {p.images.map((src, n) => (
            <button key={src} type="button" aria-label={`Pokaż zdjęcie ${n + 1}: ${p.title}`} aria-pressed={n === photo} onClick={() => setPhoto(n)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
      <div className="property-card-copy">
        <p className="property-location">
          {region.name.toUpperCase()} · {p.city}
        </p>
        <h2>{p.title}</h2>
        <strong className="property-price">{euro(p.price)}</strong>
        <p className="simple-property-facts">
          {p.area} m² · {roomCount(p.beds, "sypialnia", "sypialnie", "sypialni")} · {roomCount(p.baths, "łazienka", "łazienki", "łazienek")} · {p.beach}
        </p>
        {p.paragraphs.map((t) => (
          <p key={t} className="property-short">
            {t}
          </p>
        ))}
        {(p.key === "santa-pola" || p.key === "guardamar-2861") && p.note ? <p className="property-important">{p.note}</p> : null}
      </div>
      <OfferCta p={p} />
    </article>
  );
}

export function FormOneCategory({
  region,
  group,
  offers,
}: {
  region: FormOneRegion;
  group: FormOneGroup;
  offers: FormOneOffer[];
}) {
  return (
    <>
      <section className="category-hero">
        <Link className="breadcrumbs" href={`${A}#budzet`}>
          ← Wróć do wyboru budżetu
        </Link>
        <p className="eyebrow">{region.name.toUpperCase()} · WYSELEKCJONOWANE TOP 5</p>
        <h1>{group.slug === "premium" ? "Nieruchomości premium" : "Nieruchomości " + group.label.toLowerCase()}</h1>
        <p className="category-recommendation">TOP 5 rekomendowanych ofert w grupie cenowej</p>
      </section>
      <CategoryTabs region={region} current={group} />
      <section className="section property-list-section">
        <div className="property-list simple-property-list">
          {offers.map((p, i) => (
            <OfferCard key={p.ref} p={p} i={i} region={region} />
          ))}
        </div>
        <p className="property-disclaimer">
          Ceny dotyczą nieruchomości i nie obejmują podatków oraz kosztów zakupu. Dostępność i szczegóły wybranego lokalu potwierdzimy podczas rozmowy.
        </p>
      </section>
      <OtherSearch />
    </>
  );
}

/* ---------- strona pojedynczej oferty ---------- */

function AgentPanel({ p }: { p: FormOneOffer }) {
  const { inquire } = useInquiry();
  return (
    <aside className="offer-agent">
      <p className="eyebrow">TWÓJ KONTAKT W ONESTA</p>
      <img className="agent-portrait" src={`${A}/assets/Karolina.webp`} alt="Karolina Bakowicz" />
      <h2>Karolina Bakowicz</h2>
      <p className="agent-role">CO-FOUNDER</p>
      <p className="agent-text">Zapytaj mnie o tę nieruchomość lub umów prezentację.</p>
      <a className="agent-phone" href={PHONE_HREF}>
        <PhoneIcon />
        <span>{PHONE}</span>
      </a>
      <a className="agent-email" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      <a className="agent-wa" href={`${WA}?text=${encodeURIComponent(`Dzień dobry, interesuje mnie oferta ${p.ref} — ${p.title}`)}`} target="_blank" rel="noopener">
        <WhatsAppIcon />
        <span>Napisz na WhatsApp ↗</span>
      </a>
      <a className="button" href="#kontakt" onClick={() => inquire(p)}>
        Zapytaj o tę ofertę <span>↗</span>
      </a>
      <p className="agent-reference">Nr oferty: {p.ref}</p>
    </aside>
  );
}

export function FormOneProperty({
  p,
  region,
  group,
}: {
  p: FormOneOffer;
  region: FormOneRegion;
  group: FormOneGroup;
}) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const show = (i: number) => setIndex((i + p.images.length) % p.images.length);
  return (
    <>
      <section className="property-detail section">
        <Link className="breadcrumbs" href={categoryPath(region, group)}>
          ← Wróć do Top 5 {region.name}
        </Link>
        <div className="property-layout">
          <article>
            <p className="eyebrow">
              {region.name.toUpperCase()} · {p.city.toUpperCase()}
            </p>
            <h1>{p.title}</h1>
            <p className="detail-subtitle">{p.subtitle}</p>
            <div className="property-gallery">
              <div className={`gallery-stage ${broken[index] ? "image-unavailable" : ""}`}>
                <img
                  id="property-main-photo"
                  src={p.images[index]}
                  alt={`${p.title} — zdjęcie ${index + 1}`}
                  hidden={broken[index]}
                  onError={() => setBroken((b) => ({ ...b, [index]: true }))}
                />
                <div className="gallery-controls">
                  <button type="button" aria-label="Poprzednie zdjęcie" onClick={() => show(index - 1)}>
                    ←
                  </button>
                  <span id="gallery-count" aria-live="polite">
                    {index + 1} / {p.images.length}
                  </span>
                  <button type="button" aria-label="Następne zdjęcie" onClick={() => show(index + 1)}>
                    →
                  </button>
                </div>
              </div>
              <div className="gallery-thumbs" aria-label="Wybierz zdjęcie">
                {p.images.map((im, i) => (
                  <button key={im} type="button" aria-label={`Pokaż zdjęcie ${i + 1}`} aria-pressed={i === index} onClick={() => show(i)}>
                    <img src={im} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            <div className="detail-price-row">
              <strong className="property-price">{euro(p.price)}</strong>
              <span>Rynek pierwotny · {p.ref}</span>
            </div>
            <div className="property-stats">
              <span>
                <strong>{p.area} m²</strong>pow. zabudowana
              </span>
              <span>
                <strong>{p.beds}</strong>
                {p.beds === 1 ? "sypialnia" : "sypialnie"}
              </span>
              <span>
                <strong>{p.baths}</strong>
                {p.baths === 1 ? "łazienka" : "łazienki"}
              </span>
            </div>
            <p className="property-beach">{p.beach}</p>
            {p.note ? <p className="property-important">{p.note}</p> : null}
            <div className="property-description">
              <h2>O nieruchomości</h2>
              {p.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <h2>Najważniejsze atuty</h2>
              <ul>
                {p.features.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <OfferCta p={p} />
            <p className="property-disclaimer">
              Materiały dotyczą oferty i inwestycji. Ceny nie obejmują podatków oraz kosztów zakupu. Dostępność, układ i wyposażenie konkretnego lokalu potwierdzimy podczas rozmowy.
            </p>
          </article>
          <AgentPanel p={p} />
        </div>
      </section>
      <OtherSearch />
    </>
  );
}
