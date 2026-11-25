import {
  CrmNotificationSettings,
  normalizeNotificationSettings,
} from "@/components/crm/notificationSettings";
import { normalizeCrmEmail } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

export async function getCrmUserSettings(email: string): Promise<CrmNotificationSettings> {
  if (!supabaseServer) return normalizeNotificationSettings({});
  const { data } = await supabaseServer
    .from("crm_user_settings")
    .select("settings")
    .eq("user_email", normalizeCrmEmail(email))
    .maybeSingle();
  return normalizeNotificationSettings(data?.settings);
}
