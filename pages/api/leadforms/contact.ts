import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { supabase, supabaseServer } from '@/lib/supabaseClient';
import { getLeadBudget } from '@/lib/leadforms';

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body || {};
  const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  const name = clean(body.name, 100), email = clean(body.email, 254), phone = clean(body.phone, 40);
  const offerId = clean(body.offerId, 150), budget = getLeadBudget(body.budget);
  if (body.website) return res.status(400).json({ error: 'Nie udało się wysłać formularza.' });
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+\d\s().-]{7,40}$/.test(phone) || phone.replace(/\D/g, '').length < 7 || body.consent !== true || !budget || !offerId)
    return res.status(400).json({ error: 'Uzupełnij poprawnie dane i zgodę na kontakt.' });
  try {
    const { data: offer, error } = await (supabaseServer || supabase).from('properties')
      .select('external_id,title,town,price').eq('external_id', offerId).eq('onesta_featured', true).eq('new_build', true).single();
    if (error || !offer) return res.status(400).json({ error: 'Ta oferta nie jest już dostępna. Wybierz inną.' });
    const transport = nodemailer.createTransport({ host: 'mail-serwer141299.lh.pl', port: 465, secure: true,
      auth: { user: process.env.FROM_EMAIL, pass: process.env.EMAIL_PASS }, connectionTimeout: 10000, socketTimeout: 15000 });
    await transport.sendMail({ from: process.env.FROM_EMAIL, to: 'marek.marszalek@onesta.com.pl', replyTo: email,
      subject: `Leadforms: zainteresowanie ofertą ${offer.external_id}`,
      text: [`Źródło: /leadforms`, `Oferta: ${offer.external_id} — ${offer.title || ''}`, `Lokalizacja: ${offer.town}`, `Cena: ${offer.price} EUR`, `Wybór budżetu: ${budget.label}`, `Imię: ${name}`, `Email: ${email}`, `Telefon: ${phone}`, `Zgoda na kontakt i polityka prywatności: tak`, `Data: ${new Date().toISOString()}`, `Kampania: ${clean(body.campaign, 500)}`].join('\n') });
    return res.status(200).json({ success: true });
  } catch { return res.status(503).json({ error: 'Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: +48 576 65 25 25.' }); }
}
