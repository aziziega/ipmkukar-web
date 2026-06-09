-- =====================================================
-- Statistics Table Schema
-- =====================================================
-- This table stores site-wide statistics displayed on the homepage footer
-- Single-row table (only one set of statistics for the entire site)

-- Create site_statistics table
CREATE TABLE IF NOT EXISTS site_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  active_members INTEGER NOT NULL DEFAULT 30,
  activities_per_year INTEGER NOT NULL DEFAULT 10,
  total_alumni INTEGER NOT NULL DEFAULT 1000,
  active_departments INTEGER NOT NULL DEFAULT 6,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT positive_active_members CHECK (active_members >= 0),
  CONSTRAINT positive_activities CHECK (activities_per_year >= 0),
  CONSTRAINT positive_alumni CHECK (total_alumni >= 0),
  CONSTRAINT positive_departments CHECK (active_departments >= 0)
);

-- Insert initial statistics (only if table is empty)
INSERT INTO site_statistics (
  active_members,
  activities_per_year,
  total_alumni,
  active_departments
)
SELECT 30, 10, 1000, 6
WHERE NOT EXISTS (SELECT 1 FROM site_statistics);

-- Enable Row Level Security
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read statistics (public access)
CREATE POLICY "Public read statistics"
ON site_statistics FOR SELECT
USING (true);

-- Policy: Only authenticated users can update statistics
CREATE POLICY "Authenticated update statistics"
ON site_statistics FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index for faster queries (though only 1 row, good practice)
CREATE INDEX IF NOT EXISTS idx_site_statistics_updated_at ON site_statistics(updated_at DESC);

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these to verify setup:

-- 1. Check table exists and has data
-- SELECT * FROM site_statistics;

-- 2. Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'site_statistics';

-- 3. Test public read (should work without auth)
-- SELECT active_members, activities_per_year, total_alumni, active_departments FROM site_statistics;
