-- Newsletter double opt-in i rejestr dowodowy zgód.
-- Uruchom w Supabase SQL Editor przed testem formularza.

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text not null unique,
  name text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  token_hash text not null unique,
  token_expires_at timestamptz not null,
  consent_version text not null,
  consent_text text not null,
  consent_text_hash text not null,
  source_url text not null default '',
  requested_at timestamptz not null default now(),
  request_ip text not null default '',
  request_user_agent text not null default '',
  confirmation_sent_at timestamptz,
  confirmation_email_message_id text,
  confirmation_email_smtp_response text,
  confirmation_email_accepted jsonb not null default '[]'::jsonb,
  confirmation_email_rejected jsonb not null default '[]'::jsonb,
  confirmation_email_envelope jsonb not null default '{}'::jsonb,
  confirmation_email_content_hash text,
  confirmation_email_template_version text,
  confirmed_at timestamptz,
  confirmation_ip text not null default '',
  confirmation_user_agent text not null default '',
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_subscriptions
  add column if not exists initiation_type text not null default 'website_form';
alter table public.newsletter_subscriptions
  add column if not exists invitation_requested_by text not null default '';
alter table public.newsletter_subscriptions
  add column if not exists invitation_context text not null default '';
alter table public.newsletter_subscriptions
  add column if not exists invitation_conversation_at timestamptz;

create index if not exists newsletter_subscriptions_status_idx
  on public.newsletter_subscriptions (status);
create index if not exists newsletter_subscriptions_requested_at_idx
  on public.newsletter_subscriptions (requested_at desc);

create table if not exists public.newsletter_consent_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.newsletter_subscriptions(id) on delete set null,
  email text not null,
  event_type text not null,
  token_hash text not null default '',
  provider_message_id text,
  request_method text not null default '',
  ip text not null default '',
  user_agent text not null default '',
  payload jsonb not null default '{}'::jsonb,
  sequence_number bigint,
  previous_event_hash text not null default '',
  event_hash text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists newsletter_consent_events_subscription_idx
  on public.newsletter_consent_events (subscription_id, occurred_at);
create index if not exists newsletter_consent_events_email_idx
  on public.newsletter_consent_events (email, occurred_at);
create index if not exists newsletter_consent_events_type_idx
  on public.newsletter_consent_events (event_type);

alter table public.newsletter_subscriptions
  add column if not exists confirmation_email_provider text not null default 'smtp';
alter table public.newsletter_subscriptions
  add column if not exists confirmation_email_provider_status text not null default '';
alter table public.newsletter_subscriptions
  add column if not exists confirmation_email_delivered_at timestamptz;
alter table public.newsletter_subscriptions
  add column if not exists confirmation_email_subject text not null default '';
alter table public.newsletter_subscriptions
  add column if not exists confirmation_email_archive jsonb not null default '{}'::jsonb;
alter table public.newsletter_subscriptions
  add column if not exists unsubscribe_token_hash text;

alter table public.newsletter_consent_events
  add column if not exists sequence_number bigint;
alter table public.newsletter_consent_events
  add column if not exists previous_event_hash text not null default '';
alter table public.newsletter_consent_events
  add column if not exists event_hash text;

create unique index if not exists newsletter_consent_events_sequence_idx
  on public.newsletter_consent_events (subscription_id, sequence_number)
  where subscription_id is not null and sequence_number is not null;
create index if not exists newsletter_consent_events_hash_idx
  on public.newsletter_consent_events (event_hash);

create table if not exists public.newsletter_evidence_packages (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.newsletter_subscriptions(id) on delete restrict,
  package_type text not null check (package_type in ('consent_confirmed', 'consent_withdrawn')),
  package_version text not null,
  canonical_payload jsonb not null,
  payload_hash text not null,
  payload_signature text not null default '',
  signature_key_id text not null default 'onesta-evidence-v1',
  previous_package_hash text not null default '',
  external_timestamp_provider text,
  external_timestamp_reference text,
  external_timestamp_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.newsletter_evidence_packages
  add column if not exists payload_signature text not null default '';
alter table public.newsletter_evidence_packages
  add column if not exists signature_key_id text not null default 'onesta-evidence-v1';

create index if not exists newsletter_evidence_packages_subscription_idx
  on public.newsletter_evidence_packages (subscription_id, created_at);
create index if not exists newsletter_evidence_packages_hash_idx
  on public.newsletter_evidence_packages (payload_hash);

alter table public.crm_contacts
  add column if not exists marketing_consent_evidence_id uuid
  references public.newsletter_evidence_packages(id) on delete set null;

create index if not exists crm_contacts_marketing_consent_evidence_idx
  on public.crm_contacts (marketing_consent_evidence_id);

update public.crm_contacts as contact
set marketing_consent_evidence_id = evidence.id
from public.newsletter_subscriptions as subscription
join lateral (
  select package.id
  from public.newsletter_evidence_packages as package
  where package.subscription_id = subscription.id
    and package.package_type = 'consent_confirmed'
  order by package.created_at desc
  limit 1
) as evidence on true
where lower(contact.email) = subscription.email_normalized
  and contact.marketing_email_status = 'consented'
  and contact.marketing_consent_evidence_id is null;

create or replace function public.newsletter_reject_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Newsletter audit records are append-only';
end;
$$;

drop trigger if exists newsletter_consent_events_append_only on public.newsletter_consent_events;
create trigger newsletter_consent_events_append_only
before update or delete on public.newsletter_consent_events
for each row execute function public.newsletter_reject_audit_mutation();

drop trigger if exists newsletter_evidence_packages_append_only on public.newsletter_evidence_packages;
create trigger newsletter_evidence_packages_append_only
before update or delete on public.newsletter_evidence_packages
for each row execute function public.newsletter_reject_audit_mutation();

alter table public.newsletter_subscriptions enable row level security;
alter table public.newsletter_subscriptions force row level security;
alter table public.newsletter_consent_events enable row level security;
alter table public.newsletter_consent_events force row level security;
alter table public.newsletter_evidence_packages enable row level security;
alter table public.newsletter_evidence_packages force row level security;

revoke all on table public.newsletter_subscriptions from anon, authenticated;
revoke all on table public.newsletter_consent_events from anon, authenticated;
revoke all on table public.newsletter_evidence_packages from anon, authenticated;
