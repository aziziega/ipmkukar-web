-- =====================================================
-- Add Admin Write RLS Policies for Department Tables
-- =====================================================
-- This migration adds write permissions for authenticated admins
-- on departments and department_members tables
--
-- Run this in Supabase SQL Editor AFTER running add-department-rls-policies.sql
-- Date: 2026-06-16

-- =====================================================
-- ADMIN WRITE POLICIES - Departments Table
-- =====================================================

-- Allow authenticated admins to insert departments
CREATE POLICY "Allow admin insert on departments"
ON departments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated admins to update departments
CREATE POLICY "Allow admin update on departments"
ON departments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated admins to delete departments
CREATE POLICY "Allow admin delete on departments"
ON departments
FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- ADMIN WRITE POLICIES - Department Members Table
-- =====================================================

-- Allow authenticated admins to insert department members
CREATE POLICY "Allow admin insert on department_members"
ON department_members
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated admins to update department members
CREATE POLICY "Allow admin update on department_members"
ON department_members
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated admins to delete department members
CREATE POLICY "Allow admin delete on department_members"
ON department_members
FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

-- List all policies on department tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('departments', 'department_members')
ORDER BY tablename, policyname;

-- Expected policies:
-- departments: 
--   - Allow public read access to departments (SELECT)
--   - Allow admin insert/update/delete on departments (INSERT, UPDATE, DELETE)
--
-- department_members:
--   - Allow public read access to department_members (SELECT)
--   - Allow admin insert/update/delete on department_members (INSERT, UPDATE, DELETE)
