import { parseCatalogPath } from "@/lib/catalogRouting";
import { publicAvailability } from "@/lib/publicListings";
import ListingsPage, {
  getServerSideProps as getListingsProps,
} from "@/pages/nieruchomosci/[country]";
import { findRegion, regionForProperty, SEO_CITIES } from "@/lib/seoLocations";
import SeoHead from "@/components/SeoHead";
import { propertyImages, propertyJsonLd } from "@/lib/propertySchema";
import { attachDevelopmentTitles } from "@/lib/developmentTitles";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import { publicCache,
  logPublicRender,
  catalogPath,
  propertyPath,
  propertyTitle,
  propertyMetadata,
  publicCountry,
  noStore,
  preservedQuery,
} from "@/lib/publicSeo";
import { useState, type CSSProperties } from "react";
import { supabaseServer } from "@/lib/supabaseClient";
import Head from "next/head";
import Header from "../../../../components/Header";
import Footer from "@/components/Footer";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Slider from "@/components/SliderInOfferPage/slider";
import Gallery from "@/components/SliderInOfferPage/gallery";
import ContactOnPropertyCard from "@/components/SearchEngine/ContactOnPropertyCard";
import Loan from "@/components/loanCalc/loan";
import { LuMapPin } from "react-icons/lu";
import { typeDictionarySingular } from "@/lib/titlesDictionary";
import { propertyTypeLabel, SiteLocale } from "@/lib/i18n";
import { normalizeFeatures, terraceArea } from "@/lib/propertyFeatures";
import OfferDescription from "@/components/offer/OfferDescription";
import {
  CopyRef,
  OfferAgents,
  OfferFacts,
  OfferFeatures,
  OfferGallery,
  OfferInquiry,
  OfferLocation,
  OfferMobileBar,
  OfferPriceCard,
  OfferTrust,
  factsFor,
} from "@/components/offer/OfferSections";
import offerStyles from "@/styles/offerPage.module.css";

const PROPERTY_DETAIL_COLUMNS = [
  "external_id",
  "type",
  "town",
  "province",
  "country",
  "price",
  "surface_built",
  "new_build",
  "beds",
  "baths",
  "pool",
  "images",
  "title",
  "features",
  "latitude",
  "longitude",
  "distance_to_sea_m",
  "description_pl:descriptions->>pl",
  "description_en:descriptions->>en",
].join(",");

export default function PublicDetailPage(props: any) {
  return props.catalogRoute ? (
    <ListingsPage {...props} />
  ) : (
    <Property
      key={`${props.propertyFromSupabase.external_id}:${props.locale || "pl"}`}
      {...props}
    />
  );
}

function Property({
  propertyFromSupabase,
  locale = "pl",
}: {
  propertyFromSupabase: any;
  locale?: SiteLocale;
}) {
  const isEn = locale === "en";
  const p = propertyFromSupabase;

  const [choosedImage, setChoosedImage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const listingTitle = propertyTitle(p, locale);
  const metadata = propertyMetadata(p, locale);
  const country = publicCountry(p.country)!;
  const canonical = propertyPath(p, locale)!;
  const region = regionForProperty(p);
  const city =
    region &&
    SEO_CITIES.find(
      (c) => c.region === region.slug && c.aliases.includes(p.town),
    );
  const countryName = isEn
    ? country.slug === "cypr"
      ? "Cyprus"
      : "Spain"
    : country.label;
  const breadcrumbs = [
    { name: isEn ? "Home" : "Strona główna", path: isEn ? "/en" : "/" },
    { name: countryName, path: catalogPath(country.slug, locale) },
  ];
  if (region)
    breadcrumbs.push({
      name: region.name,
      path: catalogPath(country.slug, locale, region.slug),
    });
  if (city)
    breadcrumbs.push({
      name: city.name,
      path: catalogPath(country.slug, locale, region!.slug, city.slug),
    });
  breadcrumbs.push({ name: listingTitle, path: canonical });

  const typeLabel =
    propertyTypeLabel[locale]?.[p.type] ||
    typeDictionarySingular[p.type] ||
    (isEn ? "Property" : "Nieruchomość");
  const townName = city?.name || p.town;
  const place = [townName, region?.name, countryName].filter(Boolean).join(", ");
  const features = normalizeFeatures(p.features, locale, p);
  const facts = factsFor(p, terraceArea(p.features), typeLabel, locale);
  const badges = [
    p.new_build
      ? { label: isEn ? "New build" : "Rynek pierwotny" }
      : { label: isEn ? "Resale" : "Rynek wtórny" },
    { label: isEn ? "0% buyer commission" : "0% prowizji", gold: true },
  ];

  const openImage = (index: number) => {
    setChoosedImage(index);
    setShowSlider(true);
  };
  const askAboutOffer = () =>
    document.getElementById("zapytanie")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SeoHead
        {...metadata}
        canonical={canonical}
        image={propertyImages(p, 1)[0]}
        jsonLd={propertyJsonLd(p, locale, canonical)}
        alternates={{
          pl: propertyPath(p, "pl"),
          en: propertyPath(p, "en"),
        }}
      />
      <Head>
        <link rel="shortcut icon" href="/logotype.png" />
      </Head>
      {showGallery && !showSlider ? (
        <Gallery
          locale={locale}
          title={listingTitle}
          choosedImage={choosedImage}
          setChoosedImage={setChoosedImage}
          showSlider={showSlider}
          setShowSlider={setShowSlider}
          showGallery={showGallery}
          setShowGallery={setShowGallery}
          images={p.images}
        />
      ) : null}
      {showSlider ? (
        <Slider
          locale={locale}
          showSlider={showSlider}
          choosedImage={choosedImage}
          setChoosedImage={setChoosedImage}
          setShowSlider={setShowSlider}
          images={p.images}
          propertyDetails={p}
        />
      ) : null}
      <Header
        locale={locale}
        languagePaths={{
          pl: propertyPath(p, "pl")!,
          en: propertyPath(p, "en")!,
        }}
      />
      <WhatsAppButton />
      <div
        className={`${offerStyles.page} ${HomeMontserratSans.className}`}
        style={{ "--offer-serif": HomePlayfairSans.style.fontFamily } as CSSProperties}
      >
        <main className={offerStyles.container}>
          <header className={offerStyles.head}>
            <SeoBreadcrumbs items={breadcrumbs} />
            <p className={offerStyles.eyebrow}>
              {[typeLabel, region?.name].filter(Boolean).join(" · ")}
            </p>
            <h1>{listingTitle}</h1>
            <div className={offerStyles.metaRow}>
              <span>
                <LuMapPin aria-hidden="true" />
                {place}
              </span>
              <span className={offerStyles.ref}>
                <CopyRef value={p.external_id} locale={locale} />
              </span>
            </div>
          </header>

          <OfferGallery
            images={p.images}
            title={listingTitle}
            badges={badges}
            locale={locale}
            onOpenGallery={() => setShowGallery(true)}
            onOpenImage={openImage}
          />

          <div className={offerStyles.layout}>
            <div className={offerStyles.main}>
              <OfferFacts facts={facts} locale={locale} />
              <OfferFeatures features={features} locale={locale} />
              <OfferDescription
                description={p.descriptions?.pl}
                descriptionEN={p.descriptions?.en}
                locale={locale}
              />
              <OfferLocation
                property={p}
                place={place}
                locale={locale}
                cityLink={
                  city
                    ? { name: city.name, path: catalogPath(country.slug, locale, region!.slug, city.slug) }
                    : null
                }
                regionLink={
                  region
                    ? { name: region.name, path: catalogPath(country.slug, locale, region.slug) }
                    : null
                }
              />
              <section
                className={`${offerStyles.card} ${offerStyles.loanSlot}`}
                aria-label={isEn ? "Mortgage calculator" : "Kalkulator kredytowy"}
              >
                <Loan propertyPrice={p.price} locale={locale} />
              </section>
              <OfferTrust locale={locale} />
              <OfferInquiry locale={locale}>
                <ContactOnPropertyCard
                  propertyRef={p.external_id}
                  locale={locale}
                  variant="section"
                />
              </OfferInquiry>
            </div>
            <aside className={offerStyles.aside}>
              <OfferPriceCard
                price={p.price}
                area={p.surface_built}
                facts={facts}
                locale={locale}
                onAsk={askAboutOffer}
              />
              <OfferAgents locale={locale} />
            </aside>
          </div>
        </main>
        <OfferMobileBar price={p.price} locale={locale} onAsk={askAboutOffer} />
      </div>
      <Footer locale={locale} />
    </>
  );
}

async function propertyServerSideProps(context: any) {
  if (
    !context.query.id &&
    parseCatalogPath(context.resolvedUrl)
  )
    return getListingsProps(context);
  noStore(context.res);
  const locale: SiteLocale = context.resolvedUrl?.startsWith("/en/")
    ? "en"
    : "pl";
  const id = context.query.id;
  if (typeof id !== "string" || !id.trim() || id.length > 180)
    return { notFound: true };
  if (!supabaseServer) throw new Error("Property database unavailable");
  const { data, error } = await publicAvailability(
    supabaseServer.from("properties").select(PROPERTY_DETAIL_COLUMNS),
  )
    .eq("external_id", id)
    .maybeSingle();
  if (error) throw new Error("Property lookup failed");
  if (!data) return { notFound: true };
  const destination = propertyPath(data, locale);
  if (!destination) return { notFound: true };
  const requestedPath =
    `${locale === "en" ? "/en/properties" : "/nieruchomosci"}/${context.params.country}` +
    "/" +
    context.params.title;
  if (requestedPath !== destination.split("?")[0])
    return {
      redirect: {
        destination: preservedQuery(destination, context.query),
        permanent: true,
      },
    };

  const propertyRecord = data as unknown as Record<string, any>;
  let normalizedImages = propertyRecord.images;
  try {
    if (typeof normalizedImages === "string") {
      normalizedImages = JSON.parse(normalizedImages);
    }
  } catch {
    normalizedImages = [];
  }

  const { description_pl, description_en, ...propertyData } = propertyRecord;
  const normalizedData = {
    ...propertyData,
    images: Array.isArray(normalizedImages)
      ? normalizedImages
      : normalizedImages
        ? [normalizedImages]
        : [],
    descriptions: {
      pl: description_pl || "",
      en: description_en || "",
    },
  };

  const [titledData] = await attachDevelopmentTitles([normalizedData as Record<string, any>]);
  return {
    props: {
      propertyFromSupabase: titledData ?? null,
    },
  };
}

// Offer pages change rarely: keep them on Netlify's CDN for 7 days. Only ?id= is part of
// the cache key, so tracking params (fbclid, utm_…) don't create new entries.
export async function getServerSideProps(context: any) {
  const result: any = await propertyServerSideProps(context);
  // Region/city catalogue routes are delegated here too; they keep their own catalogue cache.
  if (result && "props" in result && "propertyFromSupabase" in result.props) {
    logPublicRender(context, "offer");
    publicCache(context.res, 7 * 86400, 30 * 86400, ["id"]);
  }
  else if (!(result && "props" in result)) noStore(context.res);
  return result;
}
