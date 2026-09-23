import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseServer } from '@/lib/supabaseClient';
import { AGENT_OFFER_CARD_COLUMNS } from '@/lib/agentOffers';
import { getLeadBudget } from '@/lib/leadforms';
import { PROPERTY_COUNTRY_OPTIONS } from '@/lib/propertyCountries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const budget = getLeadBudget(req.query.budget);
  if (!budget) return res.status(400).json({ error: 'Wybierz budżet.' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const query = () => {
      let q = (supabaseServer || supabase).from('properties').select(AGENT_OFFER_CARD_COLUMNS)
        .eq('onesta_featured', true).eq('new_build', true)
        .in('country', PROPERTY_COUNTRY_OPTIONS[1].dbValues)
        .gte('price', budget.min).order('updated_at', { ascending: false }).order('external_id');
      if (budget.max !== null) q = q.lte('price', budget.max);
      return q;
    };
    if (budget.id !== 'magic') {
      const { data, error } = await query().limit(12);
      if (error) throw error;
      return res.status(200).json({ offers: data || [] });
    }
    // Reservoir sampling across every matching row, including beyond Supabase's page limit.
    const offers: any[] = [];
    let seen = 0;
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await query().range(offset, offset + 499);
      if (error) throw error;
      for (const offer of data || []) {
        seen++;
        if (offers.length < 12) offers.push(offer);
        else { const index = Math.floor(Math.random() * seen); if (index < 12) offers[index] = offer; }
      }
      if (!data || data.length < 500) break;
    }
    for (let i = offers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offers[i], offers[j]] = [offers[j], offers[i]];
    }
    return res.status(200).json({ offers });
  } catch { return res.status(503).json({ error: 'Nie udało się pobrać ofert. Spróbuj ponownie.' }); }
}
