create index if not exists properties_country_price_idx
  on public.properties (country, price);

create index if not exists properties_country_new_build_price_idx
  on public.properties (country, new_build, price);

create index if not exists properties_country_province_idx
  on public.properties (country, province);

