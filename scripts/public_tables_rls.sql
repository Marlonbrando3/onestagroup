alter table public.properties enable row level security;
alter table public.properties force row level security;

alter table public.properties_secondary enable row level security;
alter table public.properties_secondary force row level security;

alter table public.crm_contacts enable row level security;
alter table public.crm_contacts force row level security;

alter table public.crm_activities enable row level security;
alter table public.crm_activities force row level security;

revoke all on table public.properties from anon, authenticated;
revoke all on table public.properties_secondary from anon, authenticated;
revoke all on table public.crm_contacts from anon, authenticated;
revoke all on table public.crm_activities from anon, authenticated;
