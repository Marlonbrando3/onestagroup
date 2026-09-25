import Link from "next/link";
import {
  SEO_REGIONS,
  SEO_CITIES,
  findRegion,
  findCity,
} from "@/lib/seoLocations";
import { catalogPath } from "@/lib/publicSeo";
import type { SiteLocale } from "@/lib/i18n";
import TorreviejaCatalogContent from "@/components/TorreviejaCatalogContent";
import AlicanteCatalogContent from "@/components/AlicanteCatalogContent";

type RegionDetails = {
  locations: string[];
  types: string;
  market: string;
  guideHref: string;
  guideLabel: string;
  faqs: Array<[string, string]>;
};

const REGION_DETAILS: Record<string, RegionDetails> = {
  "costa-blanca": {
    locations: [
      "Alicante",
      "Torrevieja",
      "Orihuela Costa",
      "Guardamar del Segura",
      "Benidorm",
      "Finestrat",
      "Calpe",
      "Dénia",
    ],
    types:
      "Oferta obejmuje apartamenty w istniejącej zabudowie, nowe osiedla z częściami wspólnymi, domy szeregowe oraz niezależne wille. Dostępność poszczególnych typów zależy od miejscowości i odległości od wybrzeża.",
    market:
      "Costa Blanca jest rozległym i zróżnicowanym rynkiem. Poziom cen zmienia się między południową i północną częścią wybrzeża, a także w zależności od standardu, widoku, infrastruktury osiedla i faktycznej drogi do plaży. Porównuj konkretne adresy, nie tylko nazwy miejscowości.",
    guideHref: "/blog/nieruchomosci-costa-blanca",
    guideLabel: "Przeczytaj przewodnik po Costa Blanca",
    faqs: [
      [
        "Jakie miejscowości warto porównać na Costa Blanca?",
        "Wybór zależy od budżetu i planowanego sposobu użytkowania. Warto zestawić większe miasta i popularne kurorty, takie jak Alicante, Torrevieja czy Benidorm, ze spokojniejszymi miejscowościami oraz osiedlami w ich otoczeniu.",
      ],
      [
        "Czy każda nieruchomość na Costa Blanca leży blisko plaży?",
        "Nie. Nazwa wybrzeża ani miejscowości nie potwierdza odległości od morza. Dla każdej oferty trzeba sprawdzić dokładne położenie oraz rzeczywistą trasę pieszą lub samochodową.",
      ],
      [
        "Czy na Costa Blanca dostępny jest rynek pierwotny i wtórny?",
        "Tak. Dostępne są zarówno nowe inwestycje, jak i nieruchomości z rynku wtórnego. Najlepszy wybór zależy od terminu zakupu, standardu, lokalizacji i budżetu.",
      ],
    ],
  },
  "costa-del-sol": {
    locations: [
      "Málaga",
      "Marbella",
      "Estepona",
      "Mijas",
      "Fuengirola",
      "Benalmádena",
      "Nerja",
      "Manilva",
    ],
    types:
      "Na Costa del Sol można znaleźć apartamenty wakacyjne, lokale w nowych inwestycjach, domy szeregowe oraz wille. Segment i standard ofert mocno różnią się pomiędzy miejscowościami oraz dzielnicami.",
    market:
      "Rynek obejmuje zarówno popularne miejscowości wypoczynkowe, jak i lokalizacje o charakterze premium. Na cenę wpływa dokładny adres, standard inwestycji, ukształtowanie terenu, widok oraz dostęp do plaży i codziennych usług.",
    guideHref: "/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces",
    guideLabel: "Przeczytaj przewodnik po procesie zakupu",
    faqs: [
      [
        "Gdzie szukać nieruchomości na Costa del Sol?",
        "Warto porównać Málagę, Marbellę, Esteponę, Mijas, Fuengirolę i Benalmádenę. Każda z tych lokalizacji ma inny charakter, dlatego wybór powinien wynikać z budżetu i planowanego sposobu korzystania z nieruchomości.",
      ],
      [
        "Czy nieruchomości w Mijas zawsze znajdują się nad morzem?",
        "Nie. Gmina Mijas obejmuje obszary nadmorskie i położone w głębi lądu. Przed wyborem oferty należy sprawdzić konkretną dzielnicę, trasę dojazdu oraz nachylenie terenu.",
      ],
      [
        "Jakie typy nieruchomości oferuje Costa del Sol?",
        "Dostępne są apartamenty, nowe inwestycje, domy i wille. Zakres ofert oraz standard różnią się zależnie od miejscowości i konkretnej części wybrzeża.",
      ],
    ],
  },
  "costa-calida": {
    locations: [
      "San Pedro del Pinatar",
      "Los Alcázares",
      "Cartagena",
      "La Manga",
      "San Javier",
      "Águilas",
      "Mazarrón",
      "Santiago de la Ribera",
    ],
    types:
      "W regionie dostępne są apartamenty, bungalowy, domy szeregowe, wille i nowe inwestycje. Przy wyborze warto rozróżnić lokalizacje nad Mar Menor od miejscowości położonych bezpośrednio nad Morzem Śródziemnym.",
    market:
      "Costa Cálida może być alternatywą dla sąsiedniej Costa Blanca. Ceny i dostępność ofert zależą od miejscowości, odległości od wybranego akwenu, standardu osiedla oraz dostępu do usług poza sezonem.",
    guideHref: "/blog/region-san-pedro-del-pinatar",
    guideLabel: "Przeczytaj przewodnik po San Pedro del Pinatar",
    faqs: [
      [
        "Czy Costa Cálida znajduje się w regionie Murcji?",
        "Tak. Costa Cálida obejmuje wybrzeże regionu Murcji, w tym lokalizacje nad Mar Menor i Morzem Śródziemnym.",
      ],
      [
        "Czy San Pedro del Pinatar należy do Costa Blanca?",
        "Nie. San Pedro del Pinatar znajduje się w regionie Murcji i jest częścią Costa Cálida, mimo bliskości granicy z prowincją Alicante.",
      ],
      [
        "Jak wybierać między miejscowościami Costa Cálida?",
        "Porównaj dostęp do Mar Menor lub Morza Śródziemnego, codzienne usługi, dojazdy i charakter zabudowy. Decyzję warto podejmować na podstawie konkretnego adresu.",
      ],
    ],
  },
  "costa-de-almeria": {
    locations: [
      "Almería",
      "Vera",
      "Vera Playa",
      "Mojácar",
      "Pulpí",
      "San Juan de los Terreros",
      "Cuevas del Almanzora",
    ],
    types:
      "Costa de Almería oferuje apartamenty, domy oraz nowe inwestycje w wybranych miejscowościach wybrzeża. Typ zabudowy i dostępność części wspólnych różnią się pomiędzy lokalizacjami.",
    market:
      "Rynek ma inny charakter niż Costa Blanca i Costa del Sol. Porównując ceny, trzeba osobno ocenić położenie miejscowości, dokładny adres, dostęp do usług i rzeczywistą odległość od plaży.",
    guideHref: "/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces",
    guideLabel: "Przeczytaj przewodnik po procesie zakupu",
    faqs: [
      [
        "Jakie miejscowości obejmuje oferta Costa de Almería?",
        "Katalog obejmuje wybrane lokalizacje prowincji Almería, między innymi Vera, Mojácar, okolice Pulpí i San Juan de los Terreros.",
      ],
      [
        "Czy oferta opisana jako Vera zawsze znajduje się przy plaży?",
        "Nie. Nazwa Vera może dotyczyć miasta lub okolicy bliżej wybrzeża. Odległość od plaży należy sprawdzić dla konkretnego adresu.",
      ],
      [
        "Jakie nieruchomości można kupić na Costa de Almería?",
        "Dostępne są apartamenty, domy i nowe inwestycje. Wybór zależy od miejscowości, standardu oraz aktualnej podaży ofert.",
      ],
    ],
  },
};

function PolishRegionContent({
  region,
  onConsultation,
}: {
  region: NonNullable<ReturnType<typeof findRegion>>;
  onConsultation?: () => void;
}) {
  const details = REGION_DETAILS[region.slug];
  const cityLinks = SEO_CITIES.filter((city) => city.region === region.slug);

  if (!details) return null;

  return (
    <section className="mx-auto w-[90vw] max-w-[1180px] py-12 text-[#263244] md:py-16">
      <div className="space-y-14">
        <section aria-labelledby="wybor-lokalizacji-region">
          <h2
            id="wybor-lokalizacji-region"
            className="text-2xl font-semibold text-[#182334] md:text-3xl"
          >
            Jak wybrać lokalizację na {region.name}?
          </h2>
          <p className="mt-5 max-w-4xl leading-7">{region.copy.pl.advice}</p>
        </section>

        <section aria-labelledby="miejscowosci-region">
          <h2
            id="miejscowosci-region"
            className="text-2xl font-semibold text-[#182334] md:text-3xl"
          >
            Najważniejsze miejscowości na {region.name}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {details.locations.map((name) => {
              const city = cityLinks.find((item) => item.name === name);
              return city ? (
                <Link
                  key={name}
                  href={catalogPath("hiszpania", "pl", region.slug, city.slug)}
                  className="border border-[#d7c8ad] bg-white px-4 py-3 font-medium hover:bg-[#f7f3ec]"
                >
                  {name}
                </Link>
              ) : (
                <span
                  key={name}
                  className="border border-[#e4d9c7] bg-[#f7f3ec] px-4 py-3"
                >
                  {name}
                </span>
              );
            })}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="typy-region">
            <h2
              id="typy-region"
              className="text-2xl font-semibold text-[#182334]"
            >
              Jakie nieruchomości można kupić na {region.name}?
            </h2>
            <p className="mt-5 leading-7">{details.types}</p>
          </section>
          <section aria-labelledby="rynek-region">
            <h2
              id="rynek-region"
              className="text-2xl font-semibold text-[#182334]"
            >
              Ceny i charakter rynku na {region.name}
            </h2>
            <p className="mt-5 leading-7">{details.market}</p>
          </section>
        </div>

        <section aria-labelledby="przed-zakupem-region">
          <h2
            id="przed-zakupem-region"
            className="text-2xl font-semibold text-[#182334] md:text-3xl"
          >
            Co sprawdzić przed zakupem?
          </h2>
          <p className="mt-5 max-w-4xl leading-7">
            Przed wyborem oferty porównaj dokumentację nieruchomości, pełny
            budżet zakupu i koszty utrzymania. Onesta pomoże zaplanować oglądanie
            i przygotować pytania do sprzedającego oraz prawnika.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 underline underline-offset-4">
            <Link href={details.guideHref}>{details.guideLabel}</Link>
            <Link href="/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca">
              Sprawdź koszty zakupu
            </Link>
            <Link href="/nieruchomosci/hiszpania">
              Zobacz wszystkie nieruchomości w Hiszpanii
            </Link>
          </div>
        </section>

        <section aria-labelledby="faq-region">
          <h2
            id="faq-region"
            className="text-2xl font-semibold text-[#182334] md:text-3xl"
          >
            Najczęściej zadawane pytania o {region.name}
          </h2>
          <div className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {details.faqs.map(([question, answer]) => (
              <article key={question}>
                <h3 className="text-lg font-semibold leading-snug text-[#182334]">
                  {question}
                </h3>
                <p className="mt-3 leading-7">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        {onConsultation && (
          <button
            type="button"
            onClick={onConsultation}
            className="bg-[#182334] px-6 py-3 font-semibold text-white"
          >
            Umów konsultację
          </button>
        )}
      </div>
    </section>
  );
}

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

  if (city?.slug === "torrevieja" && !en) {
    return <TorreviejaCatalogContent onConsultation={onConsultation} />;
  }

  if (city?.slug === "alicante" && !en) {
    return <AlicanteCatalogContent onConsultation={onConsultation} />;
  }

  if (region && !city && !en) {
    return (
      <PolishRegionContent
        region={region}
        onConsultation={onConsultation}
      />
    );
  }

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
