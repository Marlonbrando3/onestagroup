-- Moduł mailingu CRM. Uruchom ten plik w Supabase SQL Editor.

alter table public.crm_contacts
  add column if not exists marketing_email_status text not null default 'unknown';
alter table public.crm_contacts
  add column if not exists marketing_consent_at timestamptz;
alter table public.crm_contacts
  add column if not exists marketing_consent_source text not null default '';
alter table public.crm_contacts
  add column if not exists marketing_unsubscribed_at timestamptz;
alter table public.crm_contacts
  add column if not exists email_deliverability_status text not null default 'unknown';

create index if not exists crm_contacts_marketing_email_status_idx
  on public.crm_contacts (marketing_email_status);

create table if not exists public.crm_mailing_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_mailing_group_members (
  group_id uuid not null references public.crm_mailing_groups(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (group_id, contact_id)
);

create index if not exists crm_mailing_group_members_contact_idx
  on public.crm_mailing_group_members (contact_id);

create table if not exists public.crm_mailing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  preview_text text not null default '',
  from_name text not null default 'Marek z Onesta',
  from_email text not null default '',
  reply_to text not null default '',
  group_id uuid references public.crm_mailing_groups(id) on delete set null,
  content jsonb not null default '{"blocks": []}'::jsonb,
  html_content text not null default '',
  status text not null default 'draft',
  resend_segment_id text,
  resend_contact_import_id text,
  resend_broadcast_id text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_mailing_campaigns_created_at_idx
  on public.crm_mailing_campaigns (created_at desc);
create index if not exists crm_mailing_campaigns_group_idx
  on public.crm_mailing_campaigns (group_id);

create table if not exists public.crm_mailing_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.crm_mailing_campaigns(id) on delete cascade,
  contact_id uuid references public.crm_contacts(id) on delete set null,
  email text not null,
  name text not null default '',
  status text not null default 'queued',
  provider_message_id text,
  last_event text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, email)
);

create index if not exists crm_mailing_recipients_campaign_idx
  on public.crm_mailing_recipients (campaign_id);
create index if not exists crm_mailing_recipients_email_idx
  on public.crm_mailing_recipients (lower(email));

create table if not exists public.crm_mailing_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text unique,
  campaign_id uuid references public.crm_mailing_campaigns(id) on delete set null,
  email text not null default '',
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists crm_mailing_events_campaign_idx
  on public.crm_mailing_events (campaign_id);
create index if not exists crm_mailing_events_type_idx
  on public.crm_mailing_events (event_type);

alter table public.crm_mailing_groups enable row level security;
alter table public.crm_mailing_groups force row level security;
alter table public.crm_mailing_group_members enable row level security;
alter table public.crm_mailing_group_members force row level security;
alter table public.crm_mailing_campaigns enable row level security;
alter table public.crm_mailing_campaigns force row level security;
alter table public.crm_mailing_recipients enable row level security;
alter table public.crm_mailing_recipients force row level security;
alter table public.crm_mailing_events enable row level security;
alter table public.crm_mailing_events force row level security;

revoke all on table public.crm_mailing_groups from anon, authenticated;
revoke all on table public.crm_mailing_group_members from anon, authenticated;
revoke all on table public.crm_mailing_campaigns from anon, authenticated;
revoke all on table public.crm_mailing_recipients from anon, authenticated;
revoke all on table public.crm_mailing_events from anon, authenticated;

