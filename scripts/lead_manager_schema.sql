-- Lead Manager w CRM Onesta (przeniesiony z leadmanager-iota.vercel.app, 26.11.2026)
-- Leady z Meta Lead Ads trafiają bezpośrednio do crm_contacts (lejek Marka).

create table if not exists public.lm_settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null default 'Onesta Group',
  meta_enabled boolean not null default false,
  meta_app_id text not null default '',
  meta_app_secret text not null default '',
  meta_verify_token text not null default '',
  meta_page_access_token text not null default '',
  meta_graph_api_version text not null default 'v26.0',
  sms_enabled boolean not null default false,
  sms_simulation_mode boolean not null default true,
  sms_api_token text not null default '',
  sms_sender_name text not null default '',
  sms_client_template text not null default 'Dzień dobry, {{name}}!
Dziękujemy za kontakt z Onesta Group. Z przyjemnością wesprzemy Cię w poszukiwaniu wymarzonej nieruchomości w Hiszpanii. Niebawem do Ciebie oddzwonimy.

Możesz również skontaktować się z nami od razu pod numerem +4857662525.

Pozdrawiamy!
Zespół Onesta Group',
  lead_owner_email text not null default 'marek.marszalek@onesta.com.pl',
  updated_at timestamptz not null default now()
);
insert into public.lm_settings (id) values (1) on conflict (id) do nothing;

-- Każdy lead z Meta (deduplikacja po Meta Lead ID) i jego powiązanie z kontaktem CRM
create table if not exists public.lm_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'meta' check (source in ('meta', 'diagnostic')),
  meta_lead_id text unique,
  meta_form_id text,
  meta_page_id text,
  campaign_name text,
  form_name text,
  name text not null,
  phone text not null,
  email text,
  form_answers jsonb not null default '[]'::jsonb,
  crm_contact_id uuid references public.crm_contacts(id) on delete set null,
  duplicate_of_existing boolean not null default false,
  welcome_sms_claimed_at timestamptz
);
create index if not exists lm_leads_created_idx on public.lm_leads (created_at desc);
create index if not exists lm_leads_contact_idx on public.lm_leads (crm_contact_id);

create table if not exists public.lm_sms_deliveries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.lm_leads(id) on delete set null,
  crm_contact_id uuid references public.crm_contacts(id) on delete set null,
  audience text not null default 'lead' check (audience in ('lead', 'test')),
  provider text not null check (provider in ('smsapi', 'simulation')),
  recipient text not null,
  message text not null,
  status text not null check (status in ('sent', 'failed', 'simulated')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);
create unique index if not exists lm_sms_one_welcome_idx
  on public.lm_sms_deliveries (lead_id) where audience = 'lead' and lead_id is not null;
create index if not exists lm_sms_created_idx on public.lm_sms_deliveries (created_at desc);

-- Dziennik techniczny (webhook, błędy, testy)
create table if not exists public.lm_log (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('info', 'success', 'error')),
  title text not null,
  detail text,
  lead_id uuid references public.lm_leads(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists lm_log_created_idx on public.lm_log (created_at desc);

-- Aktywność leada na /cbtop (link z SMS)
create table if not exists public.lm_tracking_events (
  id uuid primary key default gen_random_uuid(),
  crm_contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  lead_id uuid references public.lm_leads(id) on delete set null,
  event text not null check (event in ('sms_link_open','property_open','property_like','contact_form_submit','whatsapp_click','phone_click','email_click','urgent_contact_request')),
  offer_id text check (offer_id is null or offer_id ~ '^[A-Za-z0-9_-]{1,80}$'),
  title text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists lm_tracking_contact_idx on public.lm_tracking_events (crm_contact_id, created_at desc);
create unique index if not exists lm_tracking_one_like_idx
  on public.lm_tracking_events (crm_contact_id, offer_id) where event = 'property_like' and offer_id is not null;

alter table public.lm_settings enable row level security;
alter table public.lm_leads enable row level security;
alter table public.lm_sms_deliveries enable row level security;
alter table public.lm_log enable row level security;
alter table public.lm_tracking_events enable row level security;
revoke all on table public.lm_settings, public.lm_leads, public.lm_sms_deliveries, public.lm_log, public.lm_tracking_events from anon, authenticated;
grant all on table public.lm_settings, public.lm_leads, public.lm_sms_deliveries, public.lm_log, public.lm_tracking_events to service_role;
