-- ============================================
-- User Management Features Migration
-- Adds: user_status table, role management, impersonation logging
-- ============================================

-- User status table for tracking suspension/ban status
create table if not exists public.user_status (
  id uuid references auth.users(id) on delete cascade primary key,
  status text default 'active' check (status in ('active', 'suspended', 'banned')),
  suspended_at timestamp with time zone,
  suspended_by text, -- admin email who suspended
  suspend_reason text,
  suspended_until timestamp with time zone, -- null means indefinite
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on user_status
alter table public.user_status enable row level security;

-- Users can view their own status
create policy "Users can view own status"
  on public.user_status for select
  using (auth.uid() = id);

-- Only admins can view all user statuses
create policy "Admins can view all user statuses"
  on public.user_status for select
  using (public.is_admin());

-- Only admins can insert user statuses
create policy "Admins can insert user statuses"
  on public.user_status for insert
  with check (public.is_admin());

-- Only admins can update user statuses
create policy "Admins can update user statuses"
  on public.user_status for update
  using (public.is_admin());

-- Only admins can delete user statuses
create policy "Admins can delete user statuses"
  on public.user_status for delete
  using (public.is_admin());

-- Trigger to update updated_at
create trigger on_user_status_update
  before update on public.user_status
  for each row execute function public.handle_updated_at();

-- Add role column to admin_emails for role management
alter table public.admin_emails
  add column if not exists role text default 'admin' check (role in ('admin', 'super_admin'));

-- Add policy for admins to view all admin_emails
create policy "Admins can view all admin emails"
  on public.admin_emails for select
  using (public.is_admin());

-- Function to check if current user is a super admin
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_emails
    where email = lower(auth.jwt() ->> 'email')
    and role = 'super_admin'
  );
end;
$$ language plpgsql security definer;

-- Only super admins can update admin_emails (change roles)
create policy "Only super admins can update admin roles"
  on public.admin_emails for update
  using (public.is_super_admin());

-- Function to check if a user is suspended
create or replace function public.is_user_suspended(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_status
    where id = user_id
    and status in ('suspended', 'banned')
    and (suspended_until is null or suspended_until > now())
  );
end;
$$ language plpgsql security definer;

-- Function to get user status
create or replace function public.get_user_status(user_id uuid)
returns table (
  status text,
  suspended_at timestamp with time zone,
  suspended_by text,
  suspend_reason text,
  suspended_until timestamp with time zone
) as $$
begin
  return query
  select
    us.status,
    us.suspended_at,
    us.suspended_by,
    us.suspend_reason,
    us.suspended_until
  from public.user_status us
  where us.id = user_id;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index if not exists user_status_status_idx on public.user_status(status);
create index if not exists admin_emails_role_idx on public.admin_emails(role);
