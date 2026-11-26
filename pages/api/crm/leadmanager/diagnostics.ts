import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { requireCrmSuperadmin } from "@/lib/crmServerAuth";
import { sendCrmPush } from "@/lib/crmPush";
import { ingestLead } from "@/lib/leadManager/ingest";
import { testMetaConnection } from "@/lib/leadManager/meta";
import { addLmLog, readLmSettings } from "@/lib/leadManager/settings";
import { sendLmSms } from "@/lib/leadManager/sms";

// Centrum diagnostyczne Lead Managera (tylko superadmin):
// GET – dziennik, ostatnie leady i SMS-y; POST – testy połączeń i lead testowy.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmSuperadmin(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "GET") {
    const [log, leads, sms] = await Promise.all([
      supabaseServer.from("lm_log").select("*").order("created_at", { ascending: false }).limit(60),
      supabaseServer
        .from("lm_leads")
        .select("id,created_at,source,name,phone,email,form_name,campaign_name,crm_contact_id,duplicate_of_existing,form_answers")
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseServer
        .from("lm_sms_deliveries")
        .select("id,created_at,audience,provider,recipient,status,error,message,crm_contact_id")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    return res.status(200).json({ log: log.data || [], leads: leads.data || [], sms: sms.data || [] });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = String(req.body?.action || "");
  const settings = await readLmSettings();
  try {
    if (action === "test_meta") {
      const page = await testMetaConnection(settings.meta);
      await addLmLog("success", "Test Meta: token działa", `Strona: ${page.name || "?"} (${page.id || "?"})`);
      return res.status(200).json({ ok: true, message: `Token działa – strona: ${page.name || page.id}` });
    }

    if (action === "test_sms") {
      const phone = String(req.body?.phone || "").trim();
      if (!phone) return res.status(400).json({ error: "Podaj numer telefonu do testu." });
      const delivery = await sendLmSms({
        recipient: phone,
        message: String(req.body?.message || "").trim() || "Test SMS z Lead Managera Onesta CRM.",
        settings: settings.sms,
      });
      await supabaseServer.from("lm_sms_deliveries").insert({
        audience: "test",
        provider: delivery.provider,
        recipient: delivery.recipient,
        message: delivery.message,
        status: delivery.status,
        provider_message_id: delivery.providerMessageId || null,
        error: delivery.error || null,
      });
      await addLmLog(
        delivery.status === "failed" ? "error" : delivery.status === "sent" ? "success" : "info",
        delivery.status === "sent" ? "Test SMS wysłany" : delivery.status === "simulated" ? "Test SMS – symulacja" : "Test SMS niewysłany",
        `${delivery.recipient}${delivery.error ? ` • ${delivery.error}` : ""}`,
      );
      return res.status(200).json({
        ok: delivery.status !== "failed",
        message:
          delivery.status === "sent"
            ? "SMS wysłany."
            : delivery.status === "simulated"
              ? "Tryb symulacji – SMS nie wyszedł (zapisano w dzienniku)."
              : `Nie wysłano: ${delivery.error}`,
      });
    }

    if (action === "test_push") {
      const sent = await sendCrmPush(settings.leadOwnerEmail, {
        title: "🆕 Nowy lead z Facebooka: Test",
        body: "Tak będzie wyglądać powiadomienie o nowym leadzie.",
        url: "/crm/leadmanager",
        tag: `lm-test-${Date.now()}`,
      });
      return res.status(200).json({ ok: sent > 0, message: sent ? "Push wysłany." : "Brak zapisanych urządzeń z włączonymi powiadomieniami." });
    }

    if (action === "simulate_lead") {
      const name = String(req.body?.name || "").trim() || "Test Lead Manager";
      const phone = String(req.body?.phone || "").trim();
      if (!phone) return res.status(400).json({ error: "Podaj numer telefonu leada testowego." });
      const result = await ingestLead({
        name,
        phone,
        email: String(req.body?.email || "").trim() || undefined,
        formName: "Formularz testowy",
        campaignName: "Test",
        source: "diagnostic",
        formAnswers: [
          { label: "Jaki budżet planujesz przeznaczyć?", values: ["300–400 tys. €"] },
          { label: "Kiedy planujesz zakup?", values: ["W ciągu 6 miesięcy"] },
          { label: "Który region Cię interesuje?", values: ["Costa Blanca"] },
        ],
      });
      return res.status(200).json({
        ok: true,
        contactId: result.contactId,
        message: result.existingContact
          ? "Numer już był w CRM – dopisano ankietę do podsumowania istniejącego kontaktu."
          : "Utworzono szansę sprzedaży w Twoim lejku (etap „Zakwalifikowano”).",
        sms: result.sms,
      });
    }

    return res.status(400).json({ error: "Nieznana akcja." });
  } catch (error: any) {
    const message = error?.message || "Błąd testu.";
    await addLmLog("error", `Test nieudany (${action})`, message);
    return res.status(200).json({ ok: false, message });
  }
}
