import type { NextApiRequest, NextApiResponse } from "next";
import { ingestLead } from "@/lib/leadManager/ingest";
import { extractMetaLeadReferences, fetchMetaLead, validateMetaSignature } from "@/lib/leadManager/meta";
import { addLmLog, readLmSettings } from "@/lib/leadManager/settings";

// Publiczny webhook Meta Lead Ads (Callback URL: https://onesta.com.pl/api/leadmanager/meta-webhook).
// Podpis X-Hub-Signature-256 sprawdzany App Secretem, więc potrzebujemy surowej treści żądania.
export const config = { api: { bodyParser: false } };

async function readRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const settings = await readLmSettings();

  if (req.method === "GET") {
    const mode = String(req.query["hub.mode"] || "");
    const verifyToken = String(req.query["hub.verify_token"] || "");
    const challenge = String(req.query["hub.challenge"] || "");
    if (mode === "subscribe" && settings.meta.verifyToken && verifyToken === settings.meta.verifyToken) {
      await addLmLog("success", "Meta zweryfikowała webhook", "Callback URL potwierdzony (hub.challenge).");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(challenge);
    }
    await addLmLog("error", "Nieudana weryfikacja webhooka Meta", "Verify Token nie zgadza się z ustawieniami.");
    return res.status(403).json({ error: "Weryfikacja webhooka nie powiodła się." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await readRawBody(req);
  if (!settings.meta.enabled) {
    await addLmLog("error", "Webhook Meta odrzucony", "Integracja Meta jest wyłączona w konfiguracji.");
    return res.status(503).json({ error: "Integracja Meta jest wyłączona." });
  }
  if (!settings.meta.appSecret) {
    await addLmLog("error", "Webhook Meta odrzucony", "Brak App Secret – nie da się sprawdzić podpisu.");
    return res.status(503).json({ error: "Brak App Secret." });
  }
  const signature = req.headers["x-hub-signature-256"];
  if (!validateMetaSignature(rawBody, Array.isArray(signature) ? signature[0] : signature, settings.meta.appSecret)) {
    await addLmLog("error", "Webhook Meta odrzucony", "Nieprawidłowy podpis X-Hub-Signature-256.");
    return res.status(401).json({ error: "Nieprawidłowy podpis Meta." });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Nieprawidłowy JSON." });
  }

  const references = extractMetaLeadReferences(payload);
  const results = [];
  for (const reference of references) {
    try {
      const lead = await fetchMetaLead(reference, settings.meta);
      const result = await ingestLead(lead);
      if (result.duplicateLead) await addLmLog("info", "Powtórzony webhook Meta – pominięto", reference.leadgenId);
      results.push({ leadgenId: reference.leadgenId, ok: true, created: result.created });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nieznany błąd integracji.";
      await addLmLog("error", "Błąd webhooka Meta", `${reference.leadgenId}: ${message}`);
      results.push({ leadgenId: reference.leadgenId, ok: false, error: message });
    }
  }
  return res.status(200).json({ received: true, processed: references.length, results });
}
