-- =====================================================
-- Add District Field to Testimonials Table
-- Migration Date: 2026-06-09
-- =====================================================
-- This migration adds a separate 'district' column to store
-- the origin district/kecamatan in Kutai Kartanegara,
-- keeping 'company' for company/university/organization names.

-- Add district column (nullable)
ALTER TABLE testimonials 
ADD COLUMN district VARCHAR(255);

-- Add index for faster filtering and search
CREATE INDEX IF NOT EXISTS idx_testimonials_district 
ON testimonials(district);

-- Add column comment for documentation
COMMENT ON COLUMN testimonials.district 
IS 'Origin district/kecamatan in Kutai Kartanegara (optional)';

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify the column was added successfully:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'testimonials' AND column_name = 'district';

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================
-- If you need to undo this migration, run:
-- DROP INDEX IF EXISTS idx_testimonials_district;
-- ALTER TABLE testimonials DROP COLUMN IF EXISTS district;
