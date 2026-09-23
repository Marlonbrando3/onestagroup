import { createHmac } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HELP_BUDGETS, HELP_PRIVACY_TEXT, HELP_PRIVACY_VERSION, HELP_UTM_KEYS, helpVariant, normalizeHelpPhone, validateHelpFields, type HelpFields } from './helpChoosing';

export type HelpContactRecord = {
  id: string; name: string; phone: string; email: string; country: string; max_budget: number;
  note: string; pipeline_owner: string; pipeline_id: null; status: string; source: string; created_at: string; last_contact: string;
};
type Services = {
  secret: string;
  owner: string;
  save: (record: HelpContactRecord) => Promise<'inserted' | 'duplicate'>;
  notify: (record: HelpContactRecord) => Promise<void>;
  now?: () => number;
};
const FAILURE = 'Nie udało się wysłać formularza. Spróbuj ponownie za chwilę lub zadzwoń: +48 576 652 525.';

export function createHelpChoosingHandler(services: Services) {
  // Additional per-instance abuse protection; the existing honeypot is retained.
  const attempts = new Map<string, { count: number; expires: number }>();
  const now = services.now || Date.now;
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Użyj formularza kontaktowego.' }); }
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: FAILURE });
    if (req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ error: FAILURE }); }
      catch { return res.status(403).json({ error: FAILURE }); }
    }
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) || body.website) return res.status(400).json({ error: FAILURE });
    const raw = (key: string) => typeof body[key] === 'string' ? body[key] : '';
    const fields: HelpFields = { name: raw('name').trim(), phone: raw('phone'), budget: raw('budget'), message: raw('message').trim(), privacy: body.privacy === true };
    const errors = validateHelpFields(fields);
    if (raw('message').length > 500) errors.message = 'Wiadomość może mieć maksymalnie 500 znaków.';
    if (raw('phone').length > 40) errors.phone = 'Podaj poprawny numer telefonu z prefiksem kraju.';
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(raw('requestId'))) return res.status(400).json({ error: FAILURE });
    if (!services.secret) return res.status(503).json({ error: FAILURE });

    const time = now();
    for (const [key, value] of attempts) if (value.expires <= time) attempts.delete(key);
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const fingerprint = createHmac('sha256', services.secret).update(ip).digest('hex');
    const rate = attempts.get(fingerprint) || { count: 0, expires: time + 3600000 };
    if (rate.count >= 8) { res.setHeader('Retry-After', String(Math.ceil((rate.expires - time) / 1000))); return res.status(429).json({ error: FAILURE }); }
    if (attempts.size >= 2000 && !attempts.has(fingerprint)) attempts.delete(attempts.keys().next().value!);
    attempts.set(fingerprint, { count: rate.count + 1, expires: rate.expires });

    const budget = HELP_BUDGETS.find(item => item.id === fields.budget)!;
    const variant = helpVariant(body.variant);
    const utm = Object.fromEntries(HELP_UTM_KEYS.flatMap(key => typeof body.utm?.[key] === 'string' ? [[key, body.utm[key].slice(0, 200).replace(/[\r\n\x00-\x1f]/g, '')]] : []));
    const createdAt = new Date(time).toISOString();
    const phone = normalizeHelpPhone(fields.phone);
    // A DB primary key provides durable idempotency across processes and deployments.
    // Bind the request to its data so editing after a failed attempt remains safe.
    const digest = createHmac('sha256', services.secret).update(JSON.stringify(['help-choosing', body.requestId, fields.name, phone, fields.budget, fields.message, variant])).digest('hex');
    const eventId = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
    const note = [
      'Prośba o bezpłatną rozmowę — pomoc w wyborze nieruchomości w Hiszpanii.',
      `Budżet: ${budget.label} (${budget.id})`,
      `Wiadomość: ${fields.message || 'Nie podano'}`,
      `Wariant: ${variant}`, `UTM: ${JSON.stringify(utm)}`, `Data zgłoszenia: ${createdAt}`,
      `Prywatność: ${HELP_PRIVACY_TEXT} — potwierdzono ${createdAt}`,
      `Polityka: /polityka-prywatnosci, wersja ${HELP_PRIVACY_VERSION}`,
      'Zgoda na przyszły marketing: nie była zbierana. Brak zapisu do newslettera.',
      `CookieYes — analityka: ${body.analyticsConsent === true ? 'tak' : 'nie'}; reklama: ${body.advertisementConsent === true ? 'tak' : 'nie'}`,
      `Identyfikator zgłoszenia: ${eventId}`,
    ].join('\n');
    const record: HelpContactRecord = {
      id: eventId, name: fields.name, phone, email: '', country: 'Hiszpania', max_budget: budget.max,
      note, pipeline_owner: services.owner, pipeline_id: null, status: 'Zakwalifikowano', source: '/pomoc-w-wyborze',
      created_at: createdAt, last_contact: createdAt.slice(0, 10),
    };
    try {
      const result = await services.save(record);
      if (result === 'inserted') {
        try { await services.notify(record); }
        catch { console.error('[help-choosing] CRM saved; advisor notification failed. Check SMTP.'); }
      }
      return res.status(result === 'inserted' ? 201 : 200).json({ success: true, eventId });
    } catch {
      console.error('[help-choosing] CRM persistence failed.');
      return res.status(503).json({ error: FAILURE });
    }
  };
}
