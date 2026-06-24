import { supabaseServer } from "./supabaseClient";

export type OnesariImportKind = "metainmo" | "secondary";
export type OnesariImportStatus = "queued" | "running" | "completed" | "failed";

const tableName = "onesari_import_runs";

export const missingImportRunsTableMessage =
  "Tabela onesari_import_runs nie istnieje w Supabase. Uruchom SQL z scripts/onesari_import_runs_schema.sql.";

function isMissingImportRunsTable(error: { message?: string }) {
  const message = String(error?.message || "");
  return message.includes("Could not find the table") || message.includes(tableName);
}

export function mapImportRunsError(error: { message?: string }) {
  return isMissingImportRunsTable(error) ? missingImportRunsTableMessage : error.message;
}

export async function upsertImportRun(
  id: string,
  kind: OnesariImportKind,
  payload: {
    status: OnesariImportStatus;
    message: string;
    progressPercent?: number;
    processed?: number | null;
    total?: number | null;
    result?: Record<string, unknown> | null;
    error?: string | null;
    completedAt?: string | null;
  },
) {
  if (!supabaseServer) return;

  const { error } = await supabaseServer.from(tableName).upsert(
    {
      id,
      kind,
      status: payload.status,
      message: payload.message,
      progress_percent: payload.progressPercent ?? null,
      processed: payload.processed ?? null,
      total: payload.total ?? null,
      result: payload.result ?? null,
      error: payload.error ?? null,
      completed_at: payload.completedAt ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("onesari_import_runs update failed", mapImportRunsError(error));
  }
}
