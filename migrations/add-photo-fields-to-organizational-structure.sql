-- Migration: Add photo fields to organizational_structure table
-- Date: 2026-06-10
-- Description: Add photo URL fields for dewan pengawas and pengurus harian inti

-- Add photo fields for Dewan Pengawas
ALTER TABLE organizational_structure
ADD COLUMN IF NOT EXISTS dewan_pengawas_1_photo TEXT,
ADD COLUMN IF NOT EXISTS dewan_pengawas_2_photo TEXT;

-- Add photo fields for Pengurus Harian Inti
ALTER TABLE organizational_structure
ADD COLUMN IF NOT EXISTS wakil_ketua_photo TEXT,
ADD COLUMN IF NOT EXISTS sekretaris_photo TEXT,
ADD COLUMN IF NOT EXISTS bendahara_photo TEXT;

-- Add comments for documentation
COMMENT ON COLUMN organizational_structure.dewan_pengawas_1_photo IS 'Photo URL for Dewan Pengawas 1 (stored in Supabase Storage)';
COMMENT ON COLUMN organizational_structure.dewan_pengawas_2_photo IS 'Photo URL for Dewan Pengawas 2 (stored in Supabase Storage)';
COMMENT ON COLUMN organizational_structure.wakil_ketua_photo IS 'Photo URL for Wakil Ketua (stored in Supabase Storage)';
COMMENT ON COLUMN organizational_structure.sekretaris_photo IS 'Photo URL for Sekretaris (stored in Supabase Storage)';
COMMENT ON COLUMN organizational_structure.bendahara_photo IS 'Photo URL for Bendahara (stored in Supabase Storage)';
