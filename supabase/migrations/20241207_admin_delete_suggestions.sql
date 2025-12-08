-- Migration: Allow admins to delete suggestions
-- This adds a DELETE policy to the suggestions table for admin users

-- Create delete policy for admin users
CREATE POLICY "Only admins can delete suggestions"
  ON public.suggestions FOR DELETE
  USING (public.is_admin());
