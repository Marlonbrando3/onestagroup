import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
// Current feeds either omit status or use AKTUALNA; sales use sale/SPRZEDAŻ.
// Explicit withdrawn/rental/unknown statuses must not leak into public listings.
//
// 26.10.2026: na stronie publicznej nie pokazujemy ofert z rynku wtórnego (MLS secondary,
// source = SECONDARY_XML) tańszych niż 250 000 €. REDSP (METAINMO) i pozostałe źródła bez zmian.
// Dane w bazie zostają — filtr działa tylko przy odczycie (katalog, oferty, sitemap, menu).
// Panel agenta, CRM, onesari i listy dla klientów (/oferty/[token]) go nie używają.
export const SECONDARY_MIN_PRICE_EUR = 250000;

export function publicAvailability(query: any) {
  return query.or(
    "and(" +
      "or(status.is.null,status.eq.AKTUALNA)," +
      "or(operation.is.null,operation.eq.sale,operation.eq.SPRZEDAŻ)," +
      `or(source.is.null,source.neq.SECONDARY_XML,price.gte.${SECONDARY_MIN_PRICE_EUR})` +
      ")",
  );
}
export function publicListings(
  query: any,
  countries = PROPERTY_COUNTRY_OPTIONS.flatMap((c) => c.dbValues),
) {
  return publicAvailability(query)
    .in("country", countries)
    .gte("price", 0)
    .lte("price", 99999999)
    .not("images", "is", null)
    .neq("images", "[]")
    .in("new_build", [true, false]);
}
