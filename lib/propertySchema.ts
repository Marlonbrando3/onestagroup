import type { SiteLocale } from "./i18n";
import { ORGANIZATION_ID } from "./organizationSchema";
import { propertyImageUrl } from "./propertyImages";
import { propertyTitle, publicCountry, SITE_URL } from "./publicSeo";

// JSON-LD for an offer page, built from the same Supabase row that renders the page,
// so it always matches the visible content and follows the XML imports automatically.
// Feeds fill different fields: anything missing, zero or implausible is omitted, never guessed.

const positive = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

function residenceType(type: unknown) {
  const t = String(type || "").toLowerCase();
  if (/penthouse|apartment|apartament|flat|studio|quad|semi/.test(t)) return "Apartment";
  if (/villa|willa|detached/.test(t)) return "SingleFamilyResidence";
  if (/house|dom|bungalow|town|finca|country/.test(t)) return "House";
  return "Accommodation";
}

export function propertyImages(property: any, limit = 8): string[] {
  return (Array.isArray(property?.images) ? property.images : [])
    .map((image: unknown) => propertyImageUrl(image, ""))
    .filter((url: string) => /^https?:\/\//.test(url))
    .slice(0, limit);
}

export function propertyJsonLd(property: any, locale: SiteLocale, path: string) {
  const url = path.startsWith("http") ? path : SITE_URL + path;
  const name = propertyTitle(property, locale);
  const images = propertyImages(property);
  const price = positive(property.price);
  const surface = positive(property.surface_built);
  const beds = positive(property.beds);
  const baths = positive(property.baths);
  const lat = Number(property.latitude);
  const lng = Number(property.longitude);
  const hasGeo =
    Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const countryCode = publicCountry(property.country)?.slug === "cypr" ? "CY" : "ES";

  const residence = {
    "@type": residenceType(property.type),
    name,
    address: {
      "@type": "PostalAddress",
      ...(property.town && { addressLocality: String(property.town) }),
      ...(property.province && { addressRegion: String(property.province) }),
      addressCountry: countryCode,
    },
    ...(surface && { floorSize: { "@type": "QuantitativeValue", value: surface, unitCode: "MTK" } }),
    ...(beds && { numberOfBedrooms: beds }),
    ...(baths && { numberOfBathroomsTotal: baths }),
    ...(hasGeo && { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } }),
    ...(property.pool === true && {
      amenityFeature: [{ "@type": "LocationFeatureSpecification", name: locale === "en" ? "Swimming pool" : "Basen", value: true }],
    }),
  };

  // New developments: the feed price is a starting price for the project, so it is published
  // as a minimum price rather than as the price of one specific unit.
  const offer = price && {
    "@type": "Offer",
    url,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    businessFunction: "http://purl.org/goodrelations/v1#Sell",
    seller: { "@id": ORGANIZATION_ID },
    ...(property.new_build === true
      ? { priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "EUR" } }
      : { price }),
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name,
    inLanguage: locale === "en" ? "en" : "pl-PL",
    identifier: String(property.external_id),
    ...(images.length && { image: images }),
    provider: { "@id": ORGANIZATION_ID },
    about: residence,
    ...(offer && { offers: offer }),
  };
}
