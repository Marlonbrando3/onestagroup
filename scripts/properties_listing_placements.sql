alter table public.properties
  add column if not exists onesta_featured boolean not null default false,
  add column if not exists onesta_investment boolean not null default false,
  add column if not exists map_featured boolean not null default false,
  add column if not exists map_ville boolean not null default false,
  add column if not exists map_handpicked boolean not null default false;

comment on column public.properties.onesta_featured is
  'Oferta polecana na stronie Onesta.';
comment on column public.properties.onesta_investment is
  'Oferta inwestycyjna na stronie Onesta.';
comment on column public.properties.map_featured is
  'Oferta polecana na stronie Marshall and Partners.';
comment on column public.properties.map_ville is
  'Oferta wyświetlana w sekcji Ville na stronie Marshall and Partners.';
comment on column public.properties.map_handpicked is
  'Oferta ręcznie wybrana na stronie Marshall and Partners.';

create index if not exists properties_onesta_featured_updated_at_idx
  on public.properties (updated_at desc)
  where onesta_featured = true;

create index if not exists properties_onesta_investment_updated_at_idx
  on public.properties (updated_at desc)
  where onesta_investment = true;

create index if not exists properties_map_featured_updated_at_idx
  on public.properties (updated_at desc)
  where map_featured = true;

create index if not exists properties_map_ville_updated_at_idx
  on public.properties (updated_at desc)
  where map_ville = true;

create index if not exists properties_map_handpicked_updated_at_idx
  on public.properties (updated_at desc)
  where map_handpicked = true;
