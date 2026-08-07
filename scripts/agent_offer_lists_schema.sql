create extension if not exists pgcrypto;

create table if not exists public.agent_offer_lists (
  id uuid primary key default gen_random_uuid(),
  public_token text not null unique,
  agent_user_id uuid not null references auth.users(id) on delete cascade,
  agent_email text not null,
  agent_name text,
  presentation_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  offers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_offer_lists_offers_array
    check (jsonb_typeof(offers) = 'array')
);

alter table public.agent_offer_lists
  add column if not exists presentation_name text,
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists agent_offer_lists_agent_created_idx
  on public.agent_offer_lists (agent_user_id, created_at desc);

create index if not exists agent_offer_lists_public_token_idx
  on public.agent_offer_lists (public_token);

alter table public.agent_offer_lists enable row level security;
alter table public.agent_offer_lists force row level security;

revoke all on table public.agent_offer_lists from anon, authenticated;

notify pgrst, 'reload schema';
