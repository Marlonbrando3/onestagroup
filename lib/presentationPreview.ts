import type { AgentOffer } from "@/lib/agentOffers";

// Zdjęcia agentów do podglądu linku (dopasowanie po e-mailu albo imieniu i nazwisku). Brak zdjęcia → inicjały.
const AGENT_PHOTOS: Array<{ emails: string[]; name: string; photo: string }> = [
  { emails: ["marek.marszalek@onesta.com.pl"], name: "marek marszałek", photo: "images/agency/team-marek.webp" },
  { emails: ["karolina@fenomen.nieruchomosci.pl"], name: "karolina bakowicz", photo: "images/agency/team-karolina.webp" },
];

export function presentationAgent(input: { agentEmail?: string | null; agentName?: string | null; contactName?: string | null }) {
  const name = String(input.contactName || input.agentName || "").trim();
  const email = String(input.agentEmail || "").trim().toLowerCase();
  const match = AGENT_PHOTOS.find((agent) => agent.emails.includes(email) || agent.name === name.toLowerCase());
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  return { name, photo: match?.photo || null, initials: initials || "OG" };
}

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
