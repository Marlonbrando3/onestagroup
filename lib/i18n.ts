export type SiteLocale = "pl" | "en";

export const localePath = {
  pl: {
    home: "/",
    about: "/aboutus",
    propertiesBase: "/nieruchomosci",
    properties: (country = "hiszpania") => `/nieruchomosci/${country}`,
    property: (country: string, slug: string) => `/nieruchomosci/${country}/${slug}`,
    investorTrip: "/pobytinwestorski",
    privacy: "/polityka-prywatnosci",
  },
  en: {
    home: "/en",
    about: "/en/about-us",
    propertiesBase: "/en/properties",
    properties: (country = "hiszpania") => `/en/properties/${country}`,
    property: (country: string, slug: string) => `/en/properties/${country}/${slug}`,
    investorTrip: "/en/investor-trip",
    privacy: "/polityka-prywatnosci",
  },
} as const;

export const propertyTypeLabel: Record<SiteLocale, Record<string, string>> = {
  pl: {
    apartment: "Apartament",
    Apartment: "Apartament",
    "Apartment Penthouse": "Penthouse",
    bungalow: "Bungalow",
    Bungalow: "Bungalow",
    casas: "Dom",
    "Country House": "Dom",
    "Country House Penthouse": "Dom",
    Finca: "Posiadłość",
    Penthouse: "Penthouse",
    "Penthouse Penthouse": "Penthouse",
    "Quad House": "Apartament",
    "Semi Detached": "Apartament",
    shop: "Nieruchomość",
    "Town House": "Dom szeregowy",
    "Town House Penthouse": "Dom",
    townhouse: "Dom szeregowy",
    villa: "Dom",
    Villa: "Dom",
    "Villa Penthouse": "Dom",
    null: "Nieruchomość",
  },
  en: {
    apartment: "Apartment",
    Apartment: "Apartment",
    "Apartment Penthouse": "Penthouse",
    bungalow: "Bungalow",
    Bungalow: "Bungalow",
    casas: "House",
    "Country House": "Country house",
    "Country House Penthouse": "Country house",
    Finca: "Finca",
    Penthouse: "Penthouse",
    "Penthouse Penthouse": "Penthouse",
    "Quad House": "Apartment",
    "Semi Detached": "Semi-detached house",
    shop: "Property",
    "Town House": "Townhouse",
    "Town House Penthouse": "Townhouse",
    townhouse: "Townhouse",
    villa: "Villa",
    Villa: "Villa",
    "Villa Penthouse": "Villa",
    null: "Property",
  },
};

export const countryLabel: Record<SiteLocale, Record<string, string>> = {
  pl: {
    cypr: "Cypr",
    hiszpania: "Hiszpania",
    Cyprus: "Cypr",
    Spain: "Hiszpania",
  },
  en: {
    cypr: "Cyprus",
    hiszpania: "Spain",
    Cyprus: "Cyprus",
    Spain: "Spain",
    Cypr: "Cyprus",
    Hiszpania: "Spain",
  },
};

export function getSiteLocale(value?: string): SiteLocale {
  return value === "en" ? "en" : "pl";
}
