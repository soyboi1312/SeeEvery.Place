-- ============================================
-- Newsletter Feature Migration
-- Adds: newsletter_subscribers, newsletters tables
-- ============================================

-- Newsletter Subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text, -- optional name
  is_active boolean default true, -- can unsubscribe
  source text default 'website', -- where they signed up (website, admin, import)
  confirmed_at timestamp with time zone, -- email confirmation timestamp
  confirmation_token text unique, -- for double opt-in
  unsubscribed_at timestamp with time zone,
  unsubscribe_reason text,
  preferences jsonb default '{"weekly_digest": true, "special_announcements": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on newsletter_subscribers
alter table public.newsletter_subscribers enable row level security;

-- Admins can view all subscribers
create policy "Admins can view all subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

-- Admins can insert subscribers
create policy "Admins can insert subscribers"
  on public.newsletter_subscribers for insert
  with check (public.is_admin());

-- Admins can update subscribers
create policy "Admins can update subscribers"
  on public.newsletter_subscribers for update
  using (public.is_admin());

-- Admins can delete subscribers
create policy "Admins can delete subscribers"
  on public.newsletter_subscribers for delete
  using (public.is_admin());

-- Service role can insert (for public signup)
create policy "Service role can insert subscribers"
  on public.newsletter_subscribers for insert
  with check (true);

-- Trigger to update updated_at
create trigger on_newsletter_subscribers_update
  before update on public.newsletter_subscribers
  for each row execute function public.handle_updated_at();

-- Indexes for performance
create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers(email);
create index if not exists newsletter_subscribers_active_idx on public.newsletter_subscribers(is_active);
create index if not exists newsletter_subscribers_confirmed_idx on public.newsletter_subscribers(confirmed_at);

-- ============================================
-- Newsletters table for storing sent newsletters
-- ============================================

create table if not exists public.newsletters (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  preview_text text, -- preview text shown in email clients
  content_html text not null, -- HTML content
  content_text text, -- Plain text version
  status text default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at timestamp with time zone, -- when to send (if scheduled)
  sent_at timestamp with time zone, -- when actually sent
  sent_by text, -- admin email who sent it
  recipient_count integer default 0,
  open_count integer default 0,
  click_count integer default 0,
  -- Content generation metadata (for analytics-based content)
  content_type text default 'custom' check (content_type in ('custom', 'weekly_digest', 'hidden_gems', 'trending')),
  content_metadata jsonb, -- stores which places/categories were featured
  created_by text not null, -- admin email
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on newsletters
alter table public.newsletters enable row level security;

-- Admins can view all newsletters
create policy "Admins can view all newsletters"
  on public.newsletters for select
  using (public.is_admin());

-- Admins can insert newsletters
create policy "Admins can insert newsletters"
  on public.newsletters for insert
  with check (public.is_admin());

-- Admins can update newsletters
create policy "Admins can update newsletters"
  on public.newsletters for update
  using (public.is_admin());

-- Admins can delete newsletters
create policy "Admins can delete newsletters"
  on public.newsletters for delete
  using (public.is_admin());

-- Trigger to update updated_at
create trigger on_newsletters_update
  before update on public.newsletters
  for each row execute function public.handle_updated_at();

-- Indexes for performance
create index if not exists newsletters_status_idx on public.newsletters(status);
create index if not exists newsletters_sent_at_idx on public.newsletters(sent_at desc);
create index if not exists newsletters_created_at_idx on public.newsletters(created_at desc);

-- ============================================
-- Newsletter Send Logs for tracking individual sends
-- ============================================

create table if not exists public.newsletter_send_logs (
  id uuid default gen_random_uuid() primary key,
  newsletter_id uuid not null references public.newsletters(id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  email text not null, -- denormalized for easier querying
  status text default 'pending' check (status in ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
  resend_id text, -- Resend email ID for tracking
  sent_at timestamp with time zone,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on newsletter_send_logs
alter table public.newsletter_send_logs enable row level security;

-- Admins can view all send logs
create policy "Admins can view all send logs"
  on public.newsletter_send_logs for select
  using (public.is_admin());

-- Service role can insert/update (for webhook handling)
create policy "Service role can manage send logs"
  on public.newsletter_send_logs for all
  with check (true);

-- Indexes for performance
create index if not exists newsletter_send_logs_newsletter_idx on public.newsletter_send_logs(newsletter_id);
create index if not exists newsletter_send_logs_subscriber_idx on public.newsletter_send_logs(subscriber_id);
create index if not exists newsletter_send_logs_status_idx on public.newsletter_send_logs(status);
