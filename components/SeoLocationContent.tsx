import Link from "next/link";
import {
  SEO_REGIONS,
  SEO_CITIES,
  findRegion,
  findCity,
} from "@/lib/seoLocations";
import { catalogPath } from "@/lib/publicSeo";
import type { SiteLocale } from "@/lib/i18n";
export default function SeoLocationContent({
  regionSlug,
  citySlug,
  locale = "pl",
  onConsultation,
}: {
  regionSlug?: string;
  citySlug?: string;
  locale?: SiteLocale;
  onConsultation?: () => void;
}) {
  const region = findRegion(regionSlug),
    city = findCity(regionSlug, citySlug),
    en = locale === "en";
  return (
    <section className="mx-auto w-[90vw] max-w-[1300px] space-y-6 py-10 text-[#182334]">
      {region && (
        <>
          <h2 className="text-2xl font-semibold">
            {en ? "Choosing a location" : "Jak wybrać lokalizację?"}
          </h2>
          <p className="max-w-4xl leading-7">{region.copy[locale].advice}</p>
          <h2 className="text-xl font-semibold">
            {region.copy[locale].question}
          </h2>
          <p className="max-w-4xl leading-7">{region.copy[locale].answer}</p>
        </>
      )}
      <h2 className="text-2xl font-semibold">
        {region
          ? en
            ? `Locations on the ${region.name}`
            : `Miejscowości na ${region.name}`
          : en
            ? "Explore the coasts of Spain"
            : "Wybierz wybrzeże Hiszpanii"}
      </h2>
      <div className="flex flex-wrap gap-3">
        {(region
          ? SEO_CITIES.filter(
              (c) => c.region === region.slug && c.slug !== city?.slug,
            ).map((c) => ({
              name: c.name,
              path: catalogPath("hiszpania", locale, region.slug, c.slug),
            }))
          : SEO_REGIONS.map((r) => ({
              name: r.name,
              path: catalogPath("hiszpania", locale, r.slug),
            }))
        ).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="border border-[#d7c8ad] bg-white px-4 py-3 hover:bg-[#f7f3ec]"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <h2 className="text-2xl font-semibold">
        {en ? "Before you buy" : "Co sprawdzić przed zakupem?"}
      </h2>
      <p className="max-w-4xl leading-7">
        {en
          ? "Compare the property documents, total purchase budget and ongoing costs before choosing an offer. Ask Onesta to arrange viewings and help you prepare questions for the seller and your lawyer."
          : "Przed wyborem oferty porównaj dokumentację nieruchomości, pełny budżet zakupu i koszty utrzymania. Onesta pomoże zaplanować oglądanie i przygotować pytania do sprzedającego oraz prawnika."}
      </p>
      <div className="flex flex-wrap gap-5 underline">
        <Link href="/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces">
          {en ? "Buying process (Polish)" : "Proces zakupu krok po kroku"}
        </Link>
        <Link href="/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca">
          {en ? "Buying costs (Polish)" : "Koszty zakupu"}
        </Link>
        {region?.slug === "costa-blanca" && (
          <Link href="/blog/nieruchomosci-costa-blanca">
            {en ? "Costa Blanca guide (Polish)" : "Poradnik Costa Blanca"}
          </Link>
        )}
        {city?.slug === "torrevieja" && (
          <Link href="/blog/torrevieja-apartamenty-na-sprzedaz">
            {en ? "Torrevieja guide (Polish)" : "Poradnik o Torrevieja"}
          </Link>
        )}
      </div>
      {onConsultation && (
        <button
          onClick={onConsultation}
          className="rounded-md bg-[#182334] px-6 py-3 text-white"
        >
          {en ? "Arrange a consultation" : "Umów konsultację"}
        </button>
      )}
    </section>
  );
}
