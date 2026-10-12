-- Insurable Value page tabs (Car / Motorcycle / Commercial): make and model lists filtered by vehicle category.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste this file -> Run. Safe to run twice.
-- Category values in the vehicles table: car = PRIVATE/private, motorcycle = motorcycle, commercial = light/heavy.

create or replace function public.vehicle_makes(p_categories text[])
returns table (make text)
language sql stable
set search_path = ''
as $$
  select distinct v.make from public.vehicles v
  where v.make is not null and v.category = any(p_categories)
  order by 1;
$$;

create or replace function public.vehicle_models(p_make text, p_categories text[])
returns table (model text)
language sql stable
set search_path = ''
as $$
  select distinct v.model from public.vehicles v
  where v.make ilike p_make and v.model is not null and v.category = any(p_categories)
  order by 1;
$$;

-- Only the server (service role) may call these.
revoke execute on function public.vehicle_makes(text[]) from public, anon, authenticated;
revoke execute on function public.vehicle_models(text, text[]) from public, anon, authenticated;
grant execute on function public.vehicle_makes(text[]) to service_role;
grant execute on function public.vehicle_models(text, text[]) to service_role;
