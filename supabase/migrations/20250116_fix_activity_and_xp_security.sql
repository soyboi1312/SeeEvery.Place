-- Fix Security Vulnerabilities: Activity Feed Spoofing & XP Manipulation
--
-- ISSUE 1: Activity Feed Spoofing
-- The "Users can create own activities" policy allowed users to insert fake
-- activities (e.g., fake achievements, level-ups) via client-side API calls.
--
-- FIX: Remove the INSERT policy. Activities should only be created by
-- database triggers or server-side code using service_role.

drop policy if exists "Users can create own activities" on public.activity_feed;

-- ISSUE 2: Profile XP/Level Manipulation
-- Users could update their own profile row, including total_xp and level fields,
-- allowing them to give themselves unlimited XP or max level.
--
-- FIX: Add a trigger that prevents authenticated users from modifying
-- sensitive fields. Server-side code using service_role bypasses this.

create or replace function public.protect_sensitive_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only enforce for authenticated users (not service_role)
  if auth.role() = 'authenticated' then
    -- Prevent XP manipulation
    if NEW.total_xp is distinct from OLD.total_xp then
      raise exception 'Cannot manually update total_xp';
    end if;
    -- Prevent level manipulation
    if NEW.level is distinct from OLD.level then
      raise exception 'Cannot manually update level';
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_sensitive_profile_fields();
