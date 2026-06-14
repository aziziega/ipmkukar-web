-- =====================================================
-- Add Department Photos to Organizational Structure
-- =====================================================
-- This migration adds 6 photo columns for department heads
-- to store group photos for each department
--
-- Run this in your Supabase SQL Editor
-- Date: 2026-06-14

ALTER TABLE organizational_structure
ADD COLUMN IF NOT EXISTS kepala_seni_budaya_photo TEXT,
ADD COLUMN IF NOT EXISTS kepala_sosial_keagamaan_photo TEXT,
ADD COLUMN IF NOT EXISTS kepala_infokom_photo TEXT,
ADD COLUMN IF NOT EXISTS kepala_pengembangan_org_photo TEXT,
ADD COLUMN IF NOT EXISTS kepala_olahraga_photo TEXT,
ADD COLUMN IF NOT EXISTS kepala_kajian_pendidikan_photo TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'organizational_structure' 
AND column_name LIKE '%photo%'
ORDER BY ordinal_position;
