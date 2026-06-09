-- IPM Kukar Admin Dashboard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES AND TYPES (Clean Slate)
-- =====================================================
-- Drop tables in reverse order (due to foreign keys)
DROP TABLE IF EXISTS organizational_structure CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;

-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE user_role AS ENUM ('super_admin', 'admin');

-- =====================================================
-- 1. USERS TABLE (Admin Accounts)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- 2. SESSIONS TABLE
-- =====================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for token lookups
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- =====================================================
-- 3. ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filtering logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =====================================================
-- 4. HERO SLIDES TABLE
-- =====================================================
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_hero_slides_order ON hero_slides("order");

-- =====================================================
-- 5. STATISTICS TABLE (Single Row)
-- =====================================================
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anggota_aktif INTEGER NOT NULL DEFAULT 30,
  departemen_aktif INTEGER NOT NULL DEFAULT 4,
  kegiatan_per_tahun INTEGER NOT NULL DEFAULT 30,
  alumni_total INTEGER NOT NULL DEFAULT 1000,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial statistics row
INSERT INTO statistics (anggota_aktif, departemen_aktif, kegiatan_per_tahun, alumni_total)
VALUES (30, 4, 30, 1000);

-- =====================================================
-- 6. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  asal VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  initials VARCHAR(2) NOT NULL,
  badge_color VARCHAR(100) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_testimonials_order ON testimonials("order");
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);

-- =====================================================
-- 7. ACTIVITIES TABLE
-- =====================================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  department VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  participants INTEGER,
  location VARCHAR(255) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filtering
CREATE INDEX idx_activities_department ON activities(department);
CREATE INDEX idx_activities_year ON activities(year);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_date ON activities(date DESC);
CREATE INDEX idx_activities_is_published ON activities(is_published);

-- =====================================================
-- 8. ORGANIZATIONAL STRUCTURE TABLE
-- =====================================================
CREATE TABLE organizational_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period VARCHAR(20) NOT NULL,
  dewan_pengawas_1 VARCHAR(255),
  dewan_pengawas_2 VARCHAR(255),
  ketua_umum VARCHAR(255) NOT NULL,
  ketua_umum_photo TEXT,
  wakil_ketua VARCHAR(255) NOT NULL,
  sekretaris VARCHAR(255) NOT NULL,
  bendahara VARCHAR(255) NOT NULL,
  kepala_seni_budaya VARCHAR(255) NOT NULL,
  kepala_sosial_keagamaan VARCHAR(255) NOT NULL,
  kepala_infokom VARCHAR(255) NOT NULL,
  kepala_pengembangan_org VARCHAR(255) NOT NULL,
  kepala_olahraga VARCHAR(255) NOT NULL,
  kepala_kajian_pendidikan VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Only one active period at a time
CREATE UNIQUE INDEX idx_organizational_structure_active ON organizational_structure(is_active) WHERE is_active = true;

-- =====================================================
-- 9. SEED INITIAL SUPER ADMIN
-- =====================================================
-- NOTE: Password will be hashed in the application code
-- This is just a placeholder - actual seeding happens in Next.js API
-- Uncomment and run separately after setting up your password hash

-- INSERT INTO users (email, password_hash, name, role)
-- VALUES (
--   'superadmin@ipmkukar.com',
--   'YOUR_BCRYPT_HASHED_PASSWORD_HERE',
--   'Super Admin',
--   'super_admin'
-- );

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_structure ENABLE ROW LEVEL SECURITY;

-- Note: Policies will be handled in application code using service_role_key
-- For now, all operations will go through authenticated API routes
