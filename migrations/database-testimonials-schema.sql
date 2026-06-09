-- =====================================================
-- Testimonials Table Schema
-- =====================================================
-- This table stores testimonials/reviews displayed on the homepage
-- Photos are OPTIONAL - if not provided, avatar generated from initials

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  quote TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT quote_length CHECK (char_length(quote) >= 10 AND char_length(quote) <= 500)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read testimonials (public access - all testimonials always visible)
CREATE POLICY "Public read all testimonials"
ON testimonials FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated insert testimonials"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated update testimonials"
ON testimonials FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated delete testimonials"
ON testimonials FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- Supabase Storage Policies for testimonial-photos bucket
-- =====================================================
-- Note: Create bucket "testimonial-photos" in Supabase Storage UI first

-- Public read access (anyone can view photos)
CREATE POLICY "Public read testimonial photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-photos');

-- Authenticated users can upload photos
CREATE POLICY "Authenticated upload testimonial photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-photos');

-- Authenticated users can delete photos
CREATE POLICY "Authenticated delete testimonial photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-photos');

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these to verify setup:

-- 1. Check table exists
-- SELECT * FROM testimonials;

-- 2. Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'testimonials';

-- 3. Test public read (should work without auth)
-- SELECT id, name, position, company, quote, photo_url FROM testimonials;
