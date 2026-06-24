create table if not exists public.onesari_import_runs (
  id uuid primary key,
  kind text not null check (kind in ('metainmo', 'secondary')),
  status text not null check (status in ('queued', 'running', 'completed', 'failed')),
  message text not null default '',
  progress_percent integer,
  processed integer,
  total integer,
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists onesari_import_runs_kind_updated_at_idx
  on public.onesari_import_runs (kind, updated_at desc);

create index if not exists onesari_import_runs_status_idx
  on public.onesari_import_runs (status);
