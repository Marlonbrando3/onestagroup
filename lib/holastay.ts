/** Net rates from docs/HOLASTAY_ Oferta Zarządzania Apartamentem Wakacyjnym w Hiszpanii.pdf. */
export const HOLASTAY_RATES = {
  managementPercent: 15,
  residentPerStay: 60,
  cleaningPerStay: 125,
  laundryPerStay: 80,
} as const;

export interface RentalAssumptions {
  bookings: number;
  nightsPerBooking: number;
  nightlyRate: number;
  portalPercent: number;
  serviceVatPercent: number;
  annualOtherCosts: number;
}

export const DEFAULT_RENTAL_ASSUMPTIONS: RentalAssumptions = {
  bookings: 18,
  nightsPerBooking: 7,
  nightlyRate: 110,
  portalPercent: 0,
  serviceVatPercent: 21,
  annualOtherCosts: 1800,
};

function bounded(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

/** An illustrative, uniform-booking model, not a revenue or tax forecast.
 * Commission basis: accommodation only, before portal fees; confirm in the agreement.
 * Round service lines and VAT per booking to cents, then aggregate the year.
 */
export function calculateRental(input: RentalAssumptions) {
  const nightsPerBooking = Math.round(bounded(input.nightsPerBooking, 1, 365));
  const bookings = Math.round(bounded(input.bookings, 0, Math.floor(365 / nightsPerBooking)));
  const nightlyCents = Math.round(bounded(input.nightlyRate, 0, 10000) * 100);
  const portalPercent = bounded(input.portalPercent, 0, 100);
  const serviceVatPercent = bounded(input.serviceVatPercent, 0, 100);
  const otherCents = Math.round(bounded(input.annualOtherCosts, 0, 1000000) * 100);
  const bookingCents = nightlyCents * nightsPerBooking;
  const managementCents = Math.round(bookingCents * HOLASTAY_RATES.managementPercent / 100);
  const residentCents = HOLASTAY_RATES.residentPerStay * 100;
  const vatCents = Math.round(managementCents * serviceVatPercent / 100)
    + Math.round(residentCents * serviceVatPercent / 100);
  const portalCents = Math.round(bookingCents * portalPercent / 100);
  const revenueCents = bookingCents * bookings;
  const totalServiceCents = (managementCents + residentCents + vatCents) * bookings;
  const totalPortalCents = portalCents * bookings;
  const balanceCents = revenueCents - totalServiceCents - totalPortalCents - otherCents;

  return {
    bookings,
    nights: bookings * nightsPerBooking,
    occupancy: bookings * nightsPerBooking / 365 * 100,
    revenue: revenueCents / 100,
    management: managementCents * bookings / 100,
    resident: residentCents * bookings / 100,
    serviceVat: vatCents * bookings / 100,
    portal: totalPortalCents / 100,
    otherCosts: otherCents / 100,
    balance: balanceCents / 100,
    guestFeesNet: (HOLASTAY_RATES.cleaningPerStay + HOLASTAY_RATES.laundryPerStay) * bookings,
    costShares: [totalServiceCents, totalPortalCents, otherCents, Math.max(0, balanceCents)]
      .map((cents, _, all) => all.reduce((sum, cost) => sum + cost, 0) > 0
        ? cents / all.reduce((sum, cost) => sum + cost, 0) * 100 : 0),
  };
}
