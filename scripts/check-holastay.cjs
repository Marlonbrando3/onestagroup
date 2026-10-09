// Run with Node 24: node scripts/check-holastay.cjs
const assert = require("node:assert/strict");
const { calculateRental, DEFAULT_RENTAL_ASSUMPTIONS, HOLASTAY_RATES } = require("../lib/holastay.ts");

assert.equal(HOLASTAY_RATES.managementPercent, 15);
assert.equal(HOLASTAY_RATES.residentPerStay, 60);
assert.equal(HOLASTAY_RATES.cleaningPerStay + HOLASTAY_RATES.laundryPerStay, 205);

// One 10-night booking at EUR 100: services EUR 150 + 60 net,
// VAT EUR 44.10. Guest preparation charges must not reduce the owner balance.
const booking = calculateRental({
  bookings: 1, nightsPerBooking: 10, nightlyRate: 100,
  portalPercent: 0, serviceVatPercent: 21, annualOtherCosts: 0,
});
assert.equal(booking.revenue, 1000);
assert.equal(booking.management, 150);
assert.equal(booking.resident, 60);
assert.equal(booking.serviceVat, 44.1);
assert.equal(booking.balance, 745.9);
assert.equal(booking.guestFeesNet, 205);

// Portal fees are separate, without reducing the assumed commission base.
const portalBooking = calculateRental({
  bookings: 1, nightsPerBooking: 10, nightlyRate: 100,
  portalPercent: 15, serviceVatPercent: 0, annualOtherCosts: 100,
});
assert.equal(portalBooking.management, 150);
assert.equal(portalBooking.portal, 150);
assert.equal(portalBooking.balance, 540);

const annual = calculateRental(DEFAULT_RENTAL_ASSUMPTIONS);
assert.equal(annual.nights, 126);
assert.equal(annual.revenue, 13860);
assert.equal(annual.serviceVat, 663.48); // VAT rounded per service line and booking.
assert.equal(annual.balance, 8237.52);

const emptyYear = calculateRental({ ...DEFAULT_RENTAL_ASSUMPTIONS, bookings: 0 });
assert.equal(emptyYear.revenue, 0);
assert.equal(emptyYear.management, 0);
assert.equal(emptyYear.resident, 0);
assert.equal(emptyYear.serviceVat, 0);
assert.equal(emptyYear.guestFeesNet, 0);
assert.equal(emptyYear.balance, -1800); // Show losses; never silently floor to zero.

const overbooked = calculateRental({ ...DEFAULT_RENTAL_ASSUMPTIONS, bookings: 52, nightsPerBooking: 30 });
assert.equal(overbooked.bookings, 12);
assert.equal(overbooked.nights, 360);
assert.ok(overbooked.occupancy <= 100);

const invalid = calculateRental({
  bookings: NaN, nightsPerBooking: Infinity, nightlyRate: -10,
  portalPercent: NaN, serviceVatPercent: -21, annualOtherCosts: -100,
});
for (const value of Object.values(invalid).flat()) assert.ok(Number.isFinite(value));
assert.equal(invalid.balance, 0);
assert.ok(invalid.costShares.every((share) => share === 0));
assert.ok(Math.abs(annual.costShares.reduce((sum, share) => sum + share, 0) - 100) < 0.000001);

console.log("HOLASTAY: source rates, booking/annual calculations, rounding, fees, zero bookings and boundary cases passed.");
