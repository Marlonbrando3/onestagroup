import { supabaseServer } from "./supabaseClient";

/**
 * Attaches hand-written development titles (view `property_development_titles`) to offer rows
 * as `dev_title`. Failures never break the page: rows simply keep the automatic title.
 */
export async function attachDevelopmentTitles<T extends { external_id?: unknown }>(rows: T[]): Promise<T[]> {
  const ids = rows.map((row) => row?.external_id).filter((id): id is string => typeof id === "string" && id.length > 0);
  if (!supabaseServer || ids.length === 0) return rows;
  try {
    const { data, error } = await supabaseServer
      .from("property_development_titles")
      .select("external_id, tail_pl, tail_en, exceptional")
      .in("external_id", ids);
    if (error || !data) return rows;
    const byId = new Map(data.map((row: any) => [row.external_id, row]));
    return rows.map((row) => {
      const dev = byId.get(row.external_id as string);
      return dev && typeof dev.tail_pl === "string" && dev.tail_pl ? { ...row, dev_title: { tail_pl: dev.tail_pl, tail_en: dev.tail_en, exceptional: dev.exceptional } } : row;
    });
  } catch {
    return rows;
  }
}
