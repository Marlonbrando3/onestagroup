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
  // 🔹 wysyłka do Supabase

  const chunkSize = 300;
  try {
    for (let i = 0; (i += chunkSize); ) {
      const { error } = await supabase
        .from("properties")
        .upsert(chunkSize, { onConflict: "external_id" });

      if (error) {
        console.error(error);
        return res.status(500).json({ error });
      }
    }

    return res.status(200).json({
      message: "Export ASARI do Supabase zakończony",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
}
