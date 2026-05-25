export const typeDictionaryPlural: Record<string, string> = {
  apartment: "Apartamenty",
  Apartment: "Apartamenty",
  "Apartment Penthouse": "Penthousey",
  bungalow: "Bungalowy",
  Bungalow: "Bungalowy",
  casas: "Domy",
  "Country House": "Domy",
  "Country House Penthouse": "Domy",
  Finca: "Posiadłości",
  Penthouse: "Penthousey",
  "Penthouse Penthouse": "Penthousey",
  "Quad House": "Apartamenty",
  "Semi Detached": "Apartamenty",
  shop: "Nieruchomości",
  "Town House": "Domy",
  "Town House Penthouse": "Domy",
  townhouse: "Domy",
  villa: "Domy",
  Villa: "Domy",
  "Villa Penthouse": "Domy",
  null: "Nieruchomości",
};

export const typeDictionarySingular: Record<string, string> = {
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
};

// Backward compatibility for existing places that expect the old name.
export const typeDictionary = typeDictionaryPlural;

export const countryDictionary = {
  Spain: "Hiszpania",
};
