import { SITE_URL } from "./publicSeo";

// Shared with pages/polskie-biuro-nieruchomosci-w-hiszpanii.tsx via the same @id,
// so Google merges both descriptions into one entity.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": ORGANIZATION_ID,
        name: "Onesta Group",
        legalName: "Onesta Group Sp. z o.o.",
        url: SITE_URL,
        logo: `${SITE_URL}/logotype_full_new.png`,
        image: `${SITE_URL}/onesta_og_img.png`,
        telephone: "+48576652525",
        email: "biuro@onesta.com.pl",
        taxID: "8992922378",
        knowsLanguage: ["pl", "en", "es"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "ul. Wolbromska 18/1b",
          postalCode: "53-148",
          addressLocality: "Wrocław",
          addressCountry: "PL",
        },
        areaServed: ["Costa Blanca", "Costa Cálida", "Costa del Sol", "Costa de Almería", "Cypr"].map(
          (name) => ({ "@type": "Place", name }),
        ),
        sameAs: ["https://www.facebook.com/profile.php?id=100071864003899"],
        department: [{ "@id": `${SITE_URL}/#biuro-opole` }, { "@id": `${SITE_URL}/#biuro-san-javier` }],
      },
      {
        "@type": "RealEstateAgent",
        "@id": `${SITE_URL}/#biuro-opole`,
        name: "Onesta Group – biuro dla klientów w Opolu",
        parentOrganization: { "@id": ORGANIZATION_ID },
        telephone: "+48576652525",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ul. Niemodlińska 58a",
          postalCode: "45-865",
          addressLocality: "Opole",
          addressCountry: "PL",
        },
      },
      {
        "@type": "RealEstateAgent",
        "@id": `${SITE_URL}/#biuro-san-javier`,
        name: "Onesta Group – biuro w Hiszpanii (San Javier)",
        parentOrganization: { "@id": ORGANIZATION_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Calle Abel 19",
          postalCode: "30720",
          addressLocality: "San Javier",
          addressRegion: "Murcia",
          addressCountry: "ES",
        },
      },
    ],
  };
}
