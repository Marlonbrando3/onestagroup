import type { NextApiRequest, NextApiResponse } from "next";
import {
  AGENT_OFFER_COLUMNS,
  type AgentOffer,
} from "@/lib/agentOffers";
import {
  CBTOP_SOURCE_PRESENTATION_TOKEN,
  isCbTopPropertyId,
} from "@/lib/cbTopOffers";
import { supabaseServer } from "@/lib/supabaseClient";

type OfferResponse =
  | { offer: AgentOffer }
  | { error: string };

function queryValue(value: string | string[] | undefined) {
  return String(Array.isArray(value) ? value[0] : value || "").trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfferResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const offerId = queryValue(req.query.offerId);
  if (!isCbTopPropertyId(offerId)) {
    return res.status(404).json({ error: "Nie znaleziono oferty" });
  }
  if (!supabaseServer) {
    return res.status(503).json({ error: "Baza ofert jest chwilowo niedostępna" });
  }

  const { data: liveOffer } = await supabaseServer
    .from("properties")
    .select(AGENT_OFFER_COLUMNS)
    .eq("external_id", offerId)
    .maybeSingle();

  let offer = (liveOffer || null) as unknown as AgentOffer | null;

  if (!offer) {
    const { data: presentation } = await supabaseServer
      .from("agent_offer_lists")
      .select("offers")
      .eq("public_token", CBTOP_SOURCE_PRESENTATION_TOKEN)
      .maybeSingle();

    const storedOffers = Array.isArray(presentation?.offers)
      ? (presentation.offers as unknown as AgentOffer[])
      : [];
    offer =
      storedOffers.find(
        (storedOffer) => String(storedOffer.external_id) === offerId,
      ) || null;
  }

  if (!offer) {
    return res.status(404).json({ error: "Nie znaleziono oferty" });
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=3600",
  );
  return res.status(200).json({ offer });
}
