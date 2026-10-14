import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { CityGuide } from "@/data/cityGuides";

// Treść pod ofertami na stronach miast (PL). Wygląd jak w Torrevieja i Alicante;
// teksty i lokalizacje są w data/cityGuides.ts.

const linkClass =
  "font-semibold text-[#75582e] underline decoration-[#b58b4c] underline-offset-4 transition-colors hover:text-[#182334]";

/** Akapit z linkami zapisanymi jako [anchor](/sciezka). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return link ? (
          <Link key={index} href={link[2]} className={linkClass}>
            {link[1]}
          </Link>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        );
      })}
    </>
  );
}

function Paragraphs({ items, wide = true }: { items: string[]; wide?: boolean }) {
  return (
    <>
      {items.map((text) => (
        <p key={text} className={wide ? "max-w-4xl" : undefined}>
          <RichText text={text} />
        </p>
      ))}
    </>
  );
}

function ContentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="text-2xl font-semibold leading-tight text-[#182334] md:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-7">{children}</div>
    </section>
  );
}

export default function CityGuideContent({
  guide,
  onConsultation,
}: {
  guide: CityGuide;
  onConsultation?: () => void;
}) {
  const id = guide.slug;
  return (
    <section
      id={`${id}-przewodnik`}
      aria-label={guide.ariaLabel}
      className="mx-auto w-[90vw] max-w-[1180px] py-12 text-[#263244] md:py-16"
    >
      <div className="space-y-16">
        <ContentSection id={`${id}-nieruchomosci`} title={guide.intro.title}>
          <Paragraphs items={guide.intro.paragraphs} />
        </ContentSection>

        <ContentSection id={`${id}-lokalizacje`} title={guide.areas.title}>
          <Paragraphs items={guide.areas.lead} />
          <div className="grid gap-5 pt-3 md:grid-cols-2">
            {guide.areas.items.map(({ name, description }) => (
              <article
                key={name}
                className="rounded-[18px] border border-[#e4d9c7] bg-[#f7f3ec] p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold text-[#182334]">{name}</h3>
                <p className="mt-3">{description}</p>
              </article>
            ))}
          </div>
          {guide.areas.after && <Paragraphs items={guide.areas.after} />}
        </ContentSection>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContentSection id={`${id}-mieszkania`} title={guide.apartments.title}>
            <Paragraphs items={guide.apartments.paragraphs} wide={false} />
          </ContentSection>
          <ContentSection id={`${id}-domy`} title={guide.houses.title}>
            <Paragraphs items={guide.houses.paragraphs} wide={false} />
          </ContentSection>
        </div>

        <ContentSection id={`${id}-rynek`} title={guide.market.title}>
          <div className="grid gap-8 md:grid-cols-2">
            {guide.market.columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xl font-semibold text-[#182334]">
                  {column.title}
                </h3>
                <p className="mt-3">
                  <RichText text={column.text} />
                </p>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection id={`${id}-ceny`} title={guide.prices.title}>
          <Paragraphs items={guide.prices.paragraphs} />
        </ContentSection>

        <ContentSection id={`${id}-wynajem`} title={guide.rental.title}>
          <Paragraphs items={guide.rental.paragraphs} />
        </ContentSection>

        <section
          aria-labelledby={`${id}-onesta`}
          className="rounded-[18px] bg-[#182334] p-6 text-white md:p-10"
        >
          <h2
            id={`${id}-onesta`}
            className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl"
          >
            {guide.onesta.title}
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 leading-7 text-white/90">
            {guide.onesta.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {onConsultation && (
            <button
              type="button"
              onClick={onConsultation}
              className="mt-7 rounded-md bg-[#e2c477] px-6 py-3 font-semibold text-[#182334] transition-colors hover:bg-[#eed799] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {guide.onesta.button}
            </button>
          )}
        </section>

        <ContentSection id={`${id}-faq`} title={guide.faqTitle}>
          <div className="pt-2">
            {guide.faqs.map(({ question, answer }) => (
              <details
                key={question}
                name={`${id}-property-faq`}
                className="group border-b border-[#dfd2bd] first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-semibold leading-snug text-[#182334] md:text-xl">
                    {question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9aa63] text-xl text-[#182334]"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="max-w-4xl pb-6 text-[#4b586a] md:pr-14">
                  <RichText text={answer} />
                </p>
              </details>
            ))}
          </div>
        </ContentSection>
      </div>
    </section>
  );
}
