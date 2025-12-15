-- Fix Critical Security Vulnerability in Notifications RLS
--
-- ISSUE: The "System can create notifications" policy used `with check (true)`,
-- which allowed ANY authenticated user to insert notifications via the client API.
-- This could enable:
--   1. Notification flooding/spam
--   2. Spoofing notifications to other users
--
-- FIX: Remove the INSERT policy entirely. Server-side code (API routes, triggers)
-- uses the service_role key which bypasses RLS, so no policy is needed.

drop policy if exists "System can create notifications" on public.notifications;
