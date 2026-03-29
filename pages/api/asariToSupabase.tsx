import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("jestem w asari to supa");

  const { properties } = req.body;

  if (!properties || !Array.isArray(properties)) {
    return res.status(400).json({ error: "Brak properties" });
  }

  // 🔹 kasowanie starych rekordów
  await supabase.from("properties").delete().eq("source", "ASARI");

  const chunkSize = 300;

  try {
    for (let i = 0; i < properties.length; i += chunkSize) {
      const chunk = properties.slice(i, i + chunkSize);

      const { error } = await supabase
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
