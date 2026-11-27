import type { AgentOffer } from "@/lib/agentOffers";

// Wspólne teksty podglądu linku prezentacji (WhatsApp, Messenger, SMS, mail) – strona i obrazek OG.
const SALUTATION: Record<string, string> = { pani: "Pani", pan: "Pana", panstwo: "Państwa" };

export function offersCountLabel(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (count === 1) return "1 oferta";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} oferty`;
  return `${count} ofert`;
}

export function presentationTowns(offers: AgentOffer[], limit = 3) {
  const counts = new Map<string, number>();
  for (const offer of offers) {
    const town = String(offer.town || "").trim();
    if (town) counts.set(town, (counts.get(town) || 0) + 1);
  }
  const towns = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([town]) => town);
  return { shown: towns.slice(0, limit), more: Math.max(0, towns.length - limit) };
}

export function presentationPreviewTexts(input: {
  offers: AgentOffer[];
  isTemplate: boolean;
  publicTitle?: string;
  clientSalutation?: string | null;
  clientName?: string;
}) {
  const salutation = input.clientSalutation ? SALUTATION[input.clientSalutation] || "" : "";
  const clientName = String(input.clientName || "").trim();
  const headline = input.isTemplate
    ? String(input.publicTitle || "").trim() || "Wstępnie wybrane oferty"
    : clientName
      ? `Prezentacja dla ${salutation ? `${salutation} ` : ""}${clientName}`
      : "Oferty wybrane dla Ciebie";
  const { shown, more } = presentationTowns(input.offers);
  const places = shown.length ? `${shown.join(", ")}${more ? ` i ${more} ${more === 1 ? "inna" : "innych"}` : ""}` : "";
  const count = offersCountLabel(input.offers.length);
  return {
    headline,
    count,
    places,
    description: [count, places, "Onesta Group"].filter(Boolean).join(" · "),
  };
}
