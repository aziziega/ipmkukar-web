-- =====================================================
-- Add RLS Policies for Department Tables
-- =====================================================
-- This migration adds Row Level Security policies to allow
-- public read access to departments and department_members tables
--
-- Run this in your Supabase SQL Editor AFTER running add-department-details.sql
-- Date: 2026-06-16

-- Enable RLS on both tables (if not already enabled)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this migration)
DROP POLICY IF EXISTS "Allow public read access to departments" ON departments;
DROP POLICY IF EXISTS "Allow public read access to department_members" ON department_members;

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- Policy 1: Allow anyone to read active departments
CREATE POLICY "Allow public read access to departments"
ON departments
FOR SELECT
TO public
USING (is_active = true);

-- Policy 2: Allow anyone to read active department members
CREATE POLICY "Allow public read access to department_members"
ON department_members
FOR SELECT
TO public
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM departments
    WHERE departments.id = department_members.department_id
    AND departments.is_active = true
  )
);

-- =====================================================
-- ADMIN WRITE POLICIES (Optional - for future admin interface)
-- =====================================================
-- Uncomment these when you build admin interface for managing departments

/*
-- Policy 3: Allow authenticated admins to insert departments
CREATE POLICY "Allow admin insert on departments"
ON departments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Allow authenticated admins to update departments
CREATE POLICY "Allow admin update on departments"
ON departments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Allow authenticated admins to delete departments
CREATE POLICY "Allow admin delete on departments"
ON departments
FOR DELETE
TO authenticated
USING (true);

-- Policy 6: Allow authenticated admins to insert department members
CREATE POLICY "Allow admin insert on department_members"
ON department_members
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 7: Allow authenticated admins to update department members
CREATE POLICY "Allow admin update on department_members"
ON department_members
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 8: Allow authenticated admins to delete department members
CREATE POLICY "Allow admin delete on department_members"
ON department_members
FOR DELETE
TO authenticated
USING (true);
*/

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

-- List all policies on departments table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('departments', 'department_members')
ORDER BY tablename, policyname;

-- Test query (should return data if policies work)
SELECT COUNT(*) as department_count FROM departments WHERE is_active = true;
SELECT COUNT(*) as member_count FROM department_members WHERE is_active = true;
