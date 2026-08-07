import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { AGENT_OFFER_CARD_COLUMNS } from "@/lib/agentOffers";
import { getPropertyCountryOption } from "@/lib/propertyCountries";
import { supabaseServer } from "@/lib/supabaseClient";

const PAGE_SIZE = 30;

function queryText(value: string | string[] | undefined) {
  return String(Array.isArray(value) ? value[0] : value || "").trim();
}

function queryNumber(value: string | string[] | undefined) {
  const parsed = Number(queryText(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function safeSearchValue(value: string) {
  return value.replace(/[%_,()"'\\]/g, " ").replace(/\s+/g, " ").trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const page = Math.max(1, Math.floor(queryNumber(req.query.page) || 1));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const search = safeSearchValue(queryText(req.query.search));
  const country = queryText(req.query.country);
  const province = queryText(req.query.province);
  const type = queryText(req.query.type);
  const market = queryText(req.query.market);
  const bedsMin = queryNumber(req.query.bedsMin);
  const priceMin = queryNumber(req.query.priceMin);
  const priceMax = queryNumber(req.query.priceMax);
  const sort = queryText(req.query.sort) || "updated_desc";

  let query = supabaseServer
    .from("properties")
    .select(AGENT_OFFER_CARD_COLUMNS, { count: "exact" })
    .not("images", "is", null)
    .neq("images", "[]");

  if (search) {
    query = query.or(
      [
        `town.ilike.%${search}%`,
        `province.ilike.%${search}%`,
        `external_id.ilike.%${search}%`,
        `ref.ilike.%${search}%`,
      ].join(","),
    );
  }

  if (country && country !== "all") {
    query = query.in("country", getPropertyCountryOption(country).dbValues);
  }
  if (province && province !== "all") query = query.ilike("province", province);
  if (type && type !== "all") query = query.ilike("type", type);
  if (market === "primary") query = query.eq("new_build", true);
  if (market === "secondary") query = query.eq("new_build", false);
  if (bedsMin !== null && bedsMin > 0) query = query.gte("beds", bedsMin);
  if (priceMin !== null && priceMin >= 0) query = query.gte("price", priceMin);
  if (priceMax !== null && priceMax > 0) query = query.lte("price", priceMax);

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true, nullsFirst: false });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("updated_at", { ascending: false, nullsFirst: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    data: data || [],
    count: count || 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)),
    agent: auth.agent,
  });
}
