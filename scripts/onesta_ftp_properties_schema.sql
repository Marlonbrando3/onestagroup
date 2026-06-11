alter table public.properties
  add column if not exists status text,
  add column if not exists operation text,
  add column if not exists title text,
  add column if not exists distance_to_sea_m integer,
  add column if not exists available_from date,
  add column if not exists surface_usable numeric,
  add column if not exists street text,
  add column if not exists own_offer boolean,
  add column if not exists remote_service boolean,
  add column if not exists energy_usable numeric,
  add column if not exists energy_final numeric,
  add column if not exists energy_primary numeric,
  add column if not exists co2_emission numeric,
  add column if not exists renewable_energy_share numeric,
  add column if not exists raw_parameters jsonb,
  add column if not exists raw_pictures jsonb,
  add column if not exists raw_payload jsonb;

create index if not exists properties_source_external_id_idx
  on public.properties (source, external_id);
