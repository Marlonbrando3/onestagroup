import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled, rejectDisabledOnesari } from "../../../lib/onesariFeature";
import { mapImportRunsError } from "../../../lib/onesariImportRuns";

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

  const id = String(req.query.id || "").trim();
  if (!id) {
    return res.status(400).json({ error: "Brak ID importu" });
  }

  const { data, error } = await supabaseServer
    .from("onesari_import_runs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: mapImportRunsError(error) });
  }

  if (!data) {
    return res.status(404).json({ error: "Nie znaleziono importu" });
  }

  return res.status(200).json({
    importRun: {
      id: data.id,
      kind: data.kind,
      status: data.status,
      message: data.message,
      progressPercent: data.progress_percent,
      processed: data.processed,
      total: data.total,
      result: data.result,
      error: data.error,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at,
    },
  });
}
