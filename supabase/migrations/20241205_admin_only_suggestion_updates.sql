-- Migration: Restrict suggestion updates to admin users only
-- Previously: Any authenticated user could update suggestions
-- After: Only admin users (defined by email) can update suggestions

-- Create admin_emails table to store admin user emails
-- This allows runtime configuration without code changes
CREATE TABLE IF NOT EXISTS public.admin_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admin_emails (only admins can view/modify)
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_emails
    WHERE email = lower(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old permissive policy that allowed any authenticated user to update
DROP POLICY IF EXISTS "Authenticated users can update suggestions" ON public.suggestions;

-- Create new policy that only allows admin users to update suggestions
CREATE POLICY "Only admins can update suggestions"
  ON public.suggestions FOR UPDATE
  USING (public.is_admin());

-- Admin emails table policies (only accessible by admins, bootstrapped via SQL)
CREATE POLICY "Only admins can view admin_emails"
  ON public.admin_emails FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can insert admin_emails"
  ON public.admin_emails FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete admin_emails"
  ON public.admin_emails FOR DELETE
  USING (public.is_admin());

-- IMPORTANT: After running this migration, you MUST insert at least one admin email
-- Run this command in the Supabase SQL editor (replace with your actual admin email):
-- INSERT INTO public.admin_emails (email) VALUES ('your-admin@example.com');
