-- Lets a new quarterly list replace the old one without deleting history.
-- Vehicles that are no longer in the latest list are marked active = false and hidden from the
-- Insurable Value page; their old values stay in vehicle_values.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste this file -> Run. Safe to run twice.

alter table public.vehicles add column if not exists active boolean not null default true;
create index if not exists vehicles_category_active on public.vehicles (category, active);

create or replace function public.vehicle_makes(p_categories text[])
returns table (make text)
language sql stable
set search_path = ''
as $$
  select distinct v.make from public.vehicles v
  where v.active and v.make is not null and v.category = any(p_categories)
  order by 1;
$$;

create or replace function public.vehicle_models(p_make text, p_categories text[])
returns table (model text)
language sql stable
set search_path = ''
as $$
  select distinct v.model from public.vehicles v
  where v.active and v.make ilike p_make and v.model is not null and v.category = any(p_categories)
  order by 1;
$$;

revoke execute on function public.vehicle_makes(text[]) from public, anon, authenticated;
revoke execute on function public.vehicle_models(text, text[]) from public, anon, authenticated;
grant execute on function public.vehicle_makes(text[]) to service_role;
grant execute on function public.vehicle_models(text, text[]) to service_role;
