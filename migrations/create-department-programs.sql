-- =====================================================
-- Migration: Create department_programs table
-- =====================================================
-- Purpose: Separate CMS for managing 6 departemen program section on home page
-- Author: System
-- Date: 2026-06-11
-- =====================================================

-- Create department_programs table
CREATE TABLE IF NOT EXISTS department_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  programs TEXT[] NOT NULL DEFAULT '{}', -- Array of program strings (flexible, unlimited)
  images JSONB NOT NULL DEFAULT '[]', -- Array of image URLs (max 10)
  badge_text VARCHAR(100) NOT NULL,
  badge_color VARCHAR(100) NOT NULL DEFAULT 'bg-emerald-100 text-emerald-700 border-emerald-200',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_department_programs_display_order ON department_programs(display_order);
CREATE INDEX idx_department_programs_published ON department_programs(is_published);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_department_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_department_programs_updated_at
  BEFORE UPDATE ON department_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_department_programs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE department_programs IS 'Stores program information for 6 departments displayed on home page';
COMMENT ON COLUMN department_programs.department IS 'Department name (e.g., "Seni dan Budaya", "Sosial dan Keagamaan")';
COMMENT ON COLUMN department_programs.programs IS 'Array of program strings, flexible unlimited items';
COMMENT ON COLUMN department_programs.images IS 'Array of image URLs (max 10 images per program)';
COMMENT ON COLUMN department_programs.display_order IS 'Order for displaying on home page (lower = higher priority)';

-- =====================================================
-- NOTES:
-- 1. Run this migration in Supabase SQL Editor
-- 2. department column is UNIQUE to ensure only 1 entry per department
-- 3. programs is TEXT[] to support flexible unlimited list items
-- 4. images is JSONB to store array of URLs (max 10)
-- 5. badge_color stores Tailwind CSS classes for department badge styling
-- =====================================================
