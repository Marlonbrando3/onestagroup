import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";
import { applyOnesariListingFilters } from "@/lib/onesariListingFilters";

const PAGE_SIZE = 20;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isOnesariEnabled()) {
    return rejectDisabledOnesari(res);
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY" });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Brak tokenu dostępu" });
  }

  const { data: userData, error: userError } = await supabaseServer.auth.getUser(token);
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Brak dostępu" });
  }
  if (!canAccessOnesari(userData.user.email)) {
    return res.status(403).json({ error: "Brak dostępu do Onesari" });
  }

  const page = Math.max(1, Number(req.query.page || 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let propertiesQuery = supabaseServer
    .from("properties")
    .select(
      "id,external_id,ref,source,price,currency,type,town,province,country,developer,investment_name,surface_built,beds,baths,new_build,features,images,descriptions,date,updated_at,onesta_featured,onesta_investment,map_featured,map_ville,map_handpicked",
      { count: "exact" },
    )
    .eq("source", "METAINMO");

  propertiesQuery = applyOnesariListingFilters(propertiesQuery, req.query);

  const { data, count, error } = await propertiesQuery
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    data: data || [],
    count: count || 0,
    page,
    pageSize: PAGE_SIZE,
  });
}
