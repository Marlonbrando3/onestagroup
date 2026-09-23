import { PROPERTY_COUNTRY_OPTIONS } from "./propertyCountries";
// Current feeds either omit status or use AKTUALNA; sales use sale/SPRZEDAŻ.
// Explicit withdrawn/rental/unknown statuses must not leak into public listings.
export function publicAvailability(query: any) {
  return query.or(
    "and(or(status.is.null,status.eq.AKTUALNA),or(operation.is.null,operation.eq.sale,operation.eq.SPRZEDAŻ))",
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
