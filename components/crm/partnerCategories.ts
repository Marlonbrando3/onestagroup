// Kategorie firm partnerskich – te same nazwy co w polityce prywatności (sekcja „Odbiorcy danych”)
export const PARTNER_CATEGORIES = [
  { value: "biuro", label: "Biuro nieruchomości / agencja w Hiszpanii" },
  { value: "deweloper", label: "Deweloper" },
  { value: "wyposazenie", label: "Wyposażenie i umeblowanie" },
  { value: "zarzadzanie", label: "Zarządzanie najmem / nieruchomością" },
  { value: "prawne", label: "Prawnik, notariusz, gestoria" },
  { value: "finansowanie", label: "Bank / doradca kredytowy" },
  { value: "inne", label: "Inne usługi dla kupującego" },
] as const;

export const partnerCategoryLabel = (value: string) =>
  PARTNER_CATEGORIES.find((item) => item.value === value)?.label || value;
