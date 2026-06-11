import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("jestem w asari to supa");

  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY" });
  }

  const { properties } = req.body;

  if (!properties || !Array.isArray(properties)) {
    return res.status(400).json({ error: "Brak properties" });
  }

  // 🔹 kasowanie starych rekordów
  await supabaseServer.from("properties").delete().eq("source", "ASARI");

  const chunkSize = 300;

  try {
    for (let i = 0; i < properties.length; i += chunkSize) {
      const chunk = properties.slice(i, i + chunkSize);

      const { error } = await supabaseServer
        .from("properties")
        .upsert(chunk, { onConflict: "external_id" });

      if (error) {
        console.error("SUPABASE ERROR:", error);
        return res.status(500).json({ error });
      }

      console.log(`Inserted ${i + chunk.length}`);
    }

    console.log("Export zakończony");

    return res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
}
