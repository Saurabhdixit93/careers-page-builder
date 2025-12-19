-- Script to refresh Supabase schema cache
-- This resolves issues like "Could not find the 'column_name' column of 'table_name' in the schema cache"

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- If the above doesn't work, we can also try to reset the cache by updating the schema cache timestamp
-- This forces PostgREST to reload the schema
SELECT pg_notify('pgrst', 'reload schema');