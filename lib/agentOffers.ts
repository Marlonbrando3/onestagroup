export const AGENT_OFFER_CARD_COLUMNS = [
  "external_id",
  "ref",
  "source",
  "price",
  "currency",
  "type",
  "town",
  "province",
  "country",
  "beds",
  "baths",
  "new_build",
  "surface_built",
  "pool",
  "images",
  "title",
  "distance_to_sea_m",
  "available_from",
  "updated_at",
].join(",");

export const AGENT_OFFER_COLUMNS = [
  AGENT_OFFER_CARD_COLUMNS,
  "surface_plot",
  "descriptions",
  "features",
  "latitude",
  "longitude",
].join(",");

export type AgentOffer = {
  external_id: string;
  ref: string | null;
  source: string | null;
  price: number | null;
  currency: string | null;
  type: string | null;
  town: string | null;
  province: string | null;
  country: string | null;
  beds: number | null;
  baths: number | null;
  new_build: boolean;
  surface_built: number | null;
  surface_plot: number | null;
  pool: boolean | null;
  images: unknown;
  title: string | null;
  descriptions: unknown;
  features: unknown;
  latitude: number | null;
  longitude: number | null;
  distance_to_sea_m: number | null;
  available_from: string | null;
  updated_at: string | null;
};

export function agentOfferLabel(offer: AgentOffer) {
  const title = String(offer.title || "").trim();
  if (title) return title;

  const type = String(offer.type || "Nieruchomość").trim();
  const town = String(offer.town || offer.province || "Hiszpania").trim();
  return `${type} · ${town}`;
}
