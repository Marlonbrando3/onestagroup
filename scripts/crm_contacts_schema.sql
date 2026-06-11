create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null default 'Bez firmy',
  email text not null default '',
  phone text not null default '',
  owner text not null default 'Marco',
  value numeric not null default 0,
  status text not null default 'Zakwalifikowano',
  source text not null default 'CRM',
  last_contact date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists crm_contacts_status_idx on public.crm_contacts (status);
create index if not exists crm_contacts_created_at_idx on public.crm_contacts (created_at desc);

alter table public.crm_contacts add column if not exists country text not null default '';
alter table public.crm_contacts add column if not exists max_budget numeric not null default 0;
alter table public.crm_contacts add column if not exists bedrooms text not null default '';
alter table public.crm_contacts add column if not exists bathrooms text not null default '';
alter table public.crm_contacts add column if not exists coast text not null default '';
alter table public.crm_contacts add column if not exists purchase_timeline text not null default '';
alter table public.crm_contacts add column if not exists note text not null default '';
alter table public.crm_contacts add column if not exists pipeline_owner text not null default 'marek.marszalek@onesta.com.pl';

create index if not exists crm_contacts_pipeline_owner_idx on public.crm_contacts (pipeline_owner);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  type text not null,
  title text not null,
  note text not null default '',
  due_date date,
  due_time time,
  status text not null default 'planned',
  created_by text not null default 'CRM',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists crm_activities_contact_id_idx on public.crm_activities (contact_id);
create index if not exists crm_activities_status_idx on public.crm_activities (status);
create index if not exists crm_activities_due_date_idx on public.crm_activities (due_date);
