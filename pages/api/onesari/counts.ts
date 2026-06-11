import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";

type SourceCount = "metainmo" | "secondary" | "onesta";

const sourceMap: Record<SourceCount, string> = {
  metainmo: "METAINMO",
  secondary: "SECONDARY_XML",
  onesta: "ONESTA_FTP",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isOnesariEnabled()) {
    return rejectDisabledOnesari(res);
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY" });
  }
  const db = supabaseServer;

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Brak tokenu dostępu" });
  }

  const { data: userData, error: userError } =
    await supabaseServer.auth.getUser(token);
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Brak dostępu" });
  }

  const entries = await Promise.all(
    (Object.entries(sourceMap) as Array<[SourceCount, string]>).map(
      async ([key, source]) => {
        const { count, error } = await db
          .from("properties")
          .select("id", { count: "exact", head: true })
          .eq("source", source);

        if (error) throw error;
        return [key, count ?? 0] as const;
      },
    ),
  );

  return res.status(200).json(Object.fromEntries(entries));
}
