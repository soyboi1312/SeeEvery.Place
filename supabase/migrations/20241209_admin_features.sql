-- ============================================
-- Admin Features Migration
-- Adds: system_banners, admin_logs tables
-- ============================================

-- System Banners table for global announcements
create table if not exists public.system_banners (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  type text default 'info' check (type in ('info', 'warning', 'success', 'error')),
  link_text text, -- optional link text
  link_url text, -- optional link URL
  is_active boolean default true,
  starts_at timestamp with time zone default timezone('utc'::text, now()),
  ends_at timestamp with time zone, -- null means no end date
  created_by text, -- admin email who created it
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on system_banners
alter table public.system_banners enable row level security;

-- Anyone can view active banners (for displaying on the site)
create policy "Active banners are viewable by everyone"
  on public.system_banners for select
  using (
    is_active = true
    and starts_at <= now()
    and (ends_at is null or ends_at > now())
  );

-- Admins can view all banners
create policy "Admins can view all banners"
  on public.system_banners for select
  using (public.is_admin());

-- Only admins can insert banners
create policy "Only admins can insert banners"
  on public.system_banners for insert
  with check (public.is_admin());

-- Only admins can update banners
create policy "Only admins can update banners"
  on public.system_banners for update
  using (public.is_admin());

-- Only admins can delete banners
create policy "Only admins can delete banners"
  on public.system_banners for delete
  using (public.is_admin());

-- Trigger to update updated_at
create trigger on_system_banners_update
  before update on public.system_banners
  for each row execute function public.handle_updated_at();

-- Indexes for performance
create index if not exists system_banners_active_idx on public.system_banners(is_active);
create index if not exists system_banners_dates_idx on public.system_banners(starts_at, ends_at);

-- ============================================
-- Admin Activity Logs table
-- ============================================

create table if not exists public.admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_email text not null, -- who performed the action
  action text not null, -- action type (e.g., 'delete_user', 'update_suggestion', 'create_banner')
  target_type text, -- what was affected (e.g., 'user', 'suggestion', 'banner')
  target_id text, -- ID of the affected record
  details jsonb, -- additional context (e.g., user email that was deleted)
  ip_address text, -- for security auditing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_logs
alter table public.admin_logs enable row level security;

-- Only admins can view logs
create policy "Only admins can view admin logs"
  on public.admin_logs for select
  using (public.is_admin());

-- Only server-side with service role can insert logs (bypasses RLS)
-- API routes use createAdminClient which has service_role key
create policy "Service role can insert logs"
  on public.admin_logs for insert
  with check (true);  -- Will be called with service role key only

-- No one can update or delete logs (immutable audit trail)
-- If needed, use service_role key directly

-- Indexes for performance
create index if not exists admin_logs_admin_email_idx on public.admin_logs(admin_email);
create index if not exists admin_logs_action_idx on public.admin_logs(action);
create index if not exists admin_logs_created_at_idx on public.admin_logs(created_at desc);
create index if not exists admin_logs_target_idx on public.admin_logs(target_type, target_id);
