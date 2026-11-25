import type { NextApiRequest, NextApiResponse } from "next";
import { canAccessCrm, isCrmAdmin, normalizeCrmEmail } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

export type CrmRequestUser = { email: string; isAdmin: boolean };

// Wspólne sprawdzenie sesji dla API CRM (token Supabase w nagłówku Authorization).
export async function requireCrmUser(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<CrmRequestUser | null> {
  if (!supabaseServer) {
    res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY w konfiguracji." });
    return null;
  }
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) {
    res.status(401).json({ error: "Brak autoryzacji. Zaloguj sie, aby korzystac z CRM." });
    return null;
  }
  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Sesja wygasla albo jest nieprawidlowa." });
    return null;
  }
  if (!canAccessCrm(data.user.email)) {
    res.status(403).json({ error: "Brak dostepu do CRM dla tego konta." });
    return null;
  }
  return { email: normalizeCrmEmail(data.user.email), isAdmin: isCrmAdmin(data.user.email) };
}

export async function canAccessCrmContact(user: CrmRequestUser, contactId: string) {
  if (!supabaseServer || !contactId) return false;
  let query = supabaseServer.from("crm_contacts").select("id").eq("id", contactId);
  if (!user.isAdmin) query = query.eq("pipeline_owner", user.email);
  const { data, error } = await query.maybeSingle();
  return !error && Boolean(data);
}
