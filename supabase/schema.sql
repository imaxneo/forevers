CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
    CREATE TYPE plan_type AS ENUM ('basic', 'featured', 'vip');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS squares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grid_position INTEGER UNIQUE NOT NULL CHECK (grid_position BETWEEN 1 AND 10000),
  name1 TEXT NOT NULL,
  name2 TEXT NOT NULL,
  start_date DATE NOT NULL,
  message TEXT CHECK (char_length(message) <= 150),
  photo_url TEXT,
  plan plan_type NOT NULL DEFAULT 'basic',
  stripe_session_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  country_code TEXT,
  email TEXT
);

CREATE INDEX IF NOT EXISTS idx_squares_grid_position ON squares(grid_position);
CREATE INDEX IF NOT EXISTS idx_squares_is_active ON squares(is_active);
CREATE INDEX IF NOT EXISTS idx_squares_plan ON squares(plan);

ALTER TABLE squares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active squares" ON squares;
CREATE POLICY "Public read active squares" ON squares
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access" ON squares;
CREATE POLICY "Service role full access" ON squares
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE VIEW wall_stats WITH (security_invoker = true) AS
SELECT
  COUNT(*) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > NOW())) AS total_taken,
  10000 - COUNT(*) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > NOW())) AS total_remaining,
  COUNT(*) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > NOW()) AND plan = 'featured') AS featured_taken,
  200 - COUNT(*) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > NOW()) AND plan = 'featured') AS featured_remaining,
  COUNT(*) FILTER (WHERE is_active AND (expires_at IS NULL OR expires_at > NOW()) AND plan = 'vip') AS vip_taken
FROM squares;

GRANT SELECT ON wall_stats TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read photos bucket" ON storage.objects;
CREATE POLICY "Public read photos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');
