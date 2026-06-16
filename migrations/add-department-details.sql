-- =====================================================
-- Add Department Details Structure
-- =====================================================
-- This migration creates tables for department organizational structure
-- Each department (Seni Budaya, Olahraga, etc.) will have their own
-- internal structure with Kepala and Anggota (members)
--
-- Run this in your Supabase SQL Editor
-- Date: 2026-06-16

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'seni-budaya', 'olahraga', etc.
  name TEXT NOT NULL, -- 'Seni dan Budaya', 'Olahraga'
  full_name TEXT NOT NULL, -- 'Departemen Seni dan Budaya'
  description TEXT, -- Short description
  color TEXT NOT NULL, -- 'purple', 'green', 'blue', 'amber', 'red', 'indigo'
  icon TEXT NOT NULL, -- 'Palette', 'Heart', 'Megaphone', 'Rocket', 'Trophy', 'BookOpen'
  period TEXT NOT NULL, -- '2024-2025'
  order_index INTEGER NOT NULL, -- Display order
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create department_members table
CREATE TABLE IF NOT EXISTS department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL, -- 'Kepala Departemen' or 'Anggota'
  photo TEXT, -- URL to photo in storage
  nim TEXT, -- Optional: student ID
  bio TEXT, -- Optional: short bio
  email TEXT, -- Optional: contact email
  phone TEXT, -- Optional: contact phone
  order_index INTEGER NOT NULL DEFAULT 0, -- Display order (Kepala first, then Anggota)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug);
CREATE INDEX IF NOT EXISTS idx_departments_period ON departments(period);
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(is_active);
CREATE INDEX IF NOT EXISTS idx_department_members_department ON department_members(department_id);
CREATE INDEX IF NOT EXISTS idx_department_members_position ON department_members(position);
CREATE INDEX IF NOT EXISTS idx_department_members_active ON department_members(is_active);

-- Insert initial department data (6 departments)
INSERT INTO departments (slug, name, full_name, description, color, icon, period, order_index) VALUES
('seni-budaya', 'Seni dan Budaya', 'Departemen Seni dan Budaya', 'Mengembangkan kreativitas dan melestarikan budaya Kutai', 'purple', 'Palette', '2024-2025', 1),
('sosial-keagamaan', 'Sosial dan Keagamaan', 'Departemen Sosial dan Keagamaan', 'Mendorong kepedulian sosial dan pembinaan spiritual anggota', 'green', 'Heart', '2024-2025', 2),
('infokom', 'Informasi dan Komunikasi', 'Departemen Informasi dan Komunikasi', 'Mengelola media sosial, publikasi, dan dokumentasi', 'blue', 'Megaphone', '2024-2025', 3),
('pengembangan-organisasi', 'Pengembangan Organisasi', 'Departemen Pengembangan Organisasi', 'Merancang kaderisasi dan pengembangan kapasitas anggota', 'amber', 'Rocket', '2024-2025', 4),
('olahraga', 'Olahraga', 'Departemen Olahraga', 'Membangun semangat sportivitas dan kesehatan melalui kegiatan olahraga', 'red', 'Trophy', '2024-2025', 5),
('kajian-pendidikan', 'Kajian dan Pendidikan', 'Departemen Kajian Strategi dan Pendidikan', 'Mengembangkan kapasitas intelektual melalui kajian dan riset', 'indigo', 'BookOpen', '2024-2025', 6)
ON CONFLICT (slug) DO NOTHING;

-- Example: Insert sample members for Seni Budaya department
-- (You'll need to populate real data via admin interface or manual SQL)
-- Uncomment and modify as needed:

/*
INSERT INTO department_members (department_id, name, position, order_index) VALUES
-- Get Seni Budaya department ID
((SELECT id FROM departments WHERE slug = 'seni-budaya'), 'Ahmad Rizki', 'Kepala Departemen', 1),
((SELECT id FROM departments WHERE slug = 'seni-budaya'), 'Sarah Putri', 'Anggota', 2),
((SELECT id FROM departments WHERE slug = 'seni-budaya'), 'Budi Santoso', 'Anggota', 3),
((SELECT id FROM departments WHERE slug = 'seni-budaya'), 'Fitri Amelia', 'Anggota', 4);
*/

-- Verify tables created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('departments', 'department_members');

-- Verify departments inserted
SELECT slug, name, full_name, color, icon, period 
FROM departments 
ORDER BY order_index;
