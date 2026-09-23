import nodemailer from 'nodemailer';
import { supabaseServer } from '@/lib/supabaseClient';
import { crmAdminEmail } from '@/components/crm/users';
import { createHelpChoosingHandler } from '@/lib/helpChoosingServer';

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } };

export default createHelpChoosingHandler({
  secret: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  owner: crmAdminEmail,
  async save(record) {
    if (!supabaseServer) throw new Error('CRM not configured');
    const { error } = await supabaseServer.from('crm_contacts').insert(record);
    if (!error) return 'inserted';
    if (error.code === '23505') {
      const existing = await supabaseServer.from('crm_contacts').select('id').eq('id', record.id).eq('source', record.source).eq('phone', record.phone).maybeSingle();
      if (!existing.error && existing.data) return 'duplicate';
    }
    throw new Error('CRM persistence failed');
  },
  async notify(record) {
    if (!process.env.FROM_EMAIL || !process.env.EMAIL_PASS) throw new Error('SMTP not configured');
    const transport = nodemailer.createTransport({
      host: 'mail-serwer141299.lh.pl', port: 465, secure: true,
      auth: { user: process.env.FROM_EMAIL, pass: process.env.EMAIL_PASS },
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000,
    });
    await transport.sendMail({
      from: process.env.FROM_EMAIL, to: crmAdminEmail,
      subject: 'Onesta: nowa prośba o rozmowę — pomoc w wyborze',
      text: [`Nowe zgłoszenie zapisane w CRM Onesta.`, `Imię: ${record.name}`, `Telefon: ${record.phone}`, '', record.note].join('\n'),
    });
  },
});
