import { supabaseServer } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { page = 1 } = req.query;

  const limit = 18;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data } = await supabaseServer
    .from("properties")
    .select("*")
    .order("external_id", { ascending: false })
    .range(from, to);

  res.status(200).json(data);
}
