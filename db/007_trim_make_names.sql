-- Some makes were saved with a space at the end ('BMW ', 'KTM ', 'TRIUMPH ', 'NISSAN '...), so choosing them on the
-- Insurable Value page found no models or variants. This removes those spaces (161 rows on 2026-10-12; none of
-- them clash with an existing row). The admin upload page now trims names too, so new uploads stay clean.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste this file -> Run. Safe to run twice.

update public.vehicles set make = trim(make) where make <> trim(make);
