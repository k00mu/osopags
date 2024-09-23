DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'osopags') THEN
      CREATE DATABASE osopags;
   END IF;
END
$$;