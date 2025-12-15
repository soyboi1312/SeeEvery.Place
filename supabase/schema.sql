-- TravelMap Database Schema
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- User selections table
create table if not exists public.user_selections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  selections jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS on user_selections
alter table public.user_selections enable row level security;

-- Policy: Users can only see their own selections
drop policy if exists "Users can view own selections" on public.user_selections;
create policy "Users can view own selections"
  on public.user_selections for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own selections
drop policy if exists "Users can insert own selections" on public.user_selections;
create policy "Users can insert own selections"
  on public.user_selections for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own selections
drop policy if exists "Users can update own selections" on public.user_selections;
create policy "Users can update own selections"
  on public.user_selections for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own selections
drop policy if exists "Users can delete own selections" on public.user_selections;
create policy "Users can delete own selections"
  on public.user_selections for delete
  using (auth.uid() = user_id);

-- Function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger on_user_selections_update
  before update on public.user_selections
  for each row execute function public.handle_updated_at();

-- Create index for faster user lookups
create index if not exists user_selections_user_id_idx on public.user_selections(user_id);

-- Optional: User profiles table (if you want to store additional user info)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  username text,
  bio text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint on username (case-insensitive) to prevent race conditions
-- This is the hard stop that ensures no duplicates even with concurrent requests
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username))
  where username is not null;

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SECURITY: Prevent users from manually updating sensitive fields (XP, level)
-- These fields should only be updated by server-side sync logic using service_role
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

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Category Suggestions System
-- ============================================

-- Suggestions table for new category ideas
create table if not exists public.suggestions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  example_places text, -- comma-separated examples
  data_source text, -- where to find the data (wikipedia, official site, etc.)
  submitter_email text, -- optional contact email
  submitter_ip text, -- for rate limiting (not displayed publicly)
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'implemented')),
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on suggestions
alter table public.suggestions enable row level security;

-- Anyone can view approved/pending suggestions
drop policy if exists "Suggestions are viewable by everyone" on public.suggestions;
create policy "Suggestions are viewable by everyone"
  on public.suggestions for select
  using (status in ('pending', 'approved', 'implemented'));

-- Block direct client inserts - must go through API route with rate limiting
-- Use service_role key in API to bypass this
drop policy if exists "No direct inserts allowed" on public.suggestions;
create policy "No direct inserts allowed"
  on public.suggestions for insert
  with check (false);

-- ============================================
-- Admin Management
-- ============================================

-- Admin emails table to store admin user emails
create table if not exists public.admin_emails (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_emails
alter table public.admin_emails enable row level security;

-- Function to check if current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_emails
    where email = lower(auth.jwt() ->> 'email')
  );
end;
$$ language plpgsql security definer;

-- Admin emails table policies
-- Allow authenticated users to check if their own email is in the admin list
-- (Required for middleware to verify admin status without circular dependency)
drop policy if exists "Authenticated users can check own admin status" on public.admin_emails;
create policy "Authenticated users can check own admin status"
  on public.admin_emails for select
  using (
    auth.role() = 'authenticated'
    and email = lower(auth.jwt() ->> 'email')
  );

drop policy if exists "Only admins can insert admin_emails" on public.admin_emails;
create policy "Only admins can insert admin_emails"
  on public.admin_emails for insert
  with check (public.is_admin());

drop policy if exists "Only admins can delete admin_emails" on public.admin_emails;
create policy "Only admins can delete admin_emails"
  on public.admin_emails for delete
  using (public.is_admin());

-- Only admin users can update suggestions (for approval/rejection)
drop policy if exists "Only admins can update suggestions" on public.suggestions;
create policy "Only admins can update suggestions"
  on public.suggestions for update
  using (public.is_admin());

-- Authenticated users can view all suggestions (including rejected)
drop policy if exists "Authenticated users can view all suggestions" on public.suggestions;
create policy "Authenticated users can view all suggestions"
  on public.suggestions for select
  using (auth.role() = 'authenticated');

-- Votes table to track who voted for what
create table if not exists public.suggestion_votes (
  id uuid default gen_random_uuid() primary key,
  suggestion_id uuid references public.suggestions(id) on delete cascade not null,
  voter_id text not null, -- can be user_id or anonymous fingerprint
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(suggestion_id, voter_id)
);

-- Enable RLS on votes
alter table public.suggestion_votes enable row level security;

-- Anyone can view votes
drop policy if exists "Votes are viewable by everyone" on public.suggestion_votes;
create policy "Votes are viewable by everyone"
  on public.suggestion_votes for select
  using (true);

-- Only authenticated users can insert votes, and voter_id must match their user id
drop policy if exists "Authenticated users can vote" on public.suggestion_votes;
create policy "Authenticated users can vote"
  on public.suggestion_votes for insert
  with check (
    auth.role() = 'authenticated'
    and auth.uid()::text = voter_id
  );

-- Users can only delete their own votes (for unvoting)
drop policy if exists "Users can unvote their own votes" on public.suggestion_votes;
create policy "Users can unvote their own votes"
  on public.suggestion_votes for delete
  using (
    auth.role() = 'authenticated'
    and auth.uid()::text = voter_id
  );

-- Function to update vote count when a vote is added
create or replace function public.handle_vote_insert()
returns trigger as $$
begin
  update public.suggestions
  set vote_count = vote_count + 1, updated_at = now()
  where id = new.suggestion_id;
  return new;
end;
$$ language plpgsql security definer;

-- Function to update vote count when a vote is removed
create or replace function public.handle_vote_delete()
returns trigger as $$
begin
  update public.suggestions
  set vote_count = vote_count - 1, updated_at = now()
  where id = old.suggestion_id;
  return old;
end;
$$ language plpgsql security definer;

-- Triggers for vote count
create trigger on_vote_insert
  after insert on public.suggestion_votes
  for each row execute function public.handle_vote_insert();

create trigger on_vote_delete
  after delete on public.suggestion_votes
  for each row execute function public.handle_vote_delete();

-- Trigger to update suggestions updated_at
create trigger on_suggestions_update
  before update on public.suggestions
  for each row execute function public.handle_updated_at();

-- Indexes for performance
create index if not exists suggestions_status_idx on public.suggestions(status);
create index if not exists suggestions_vote_count_idx on public.suggestions(vote_count desc);
create index if not exists suggestions_ip_created_idx on public.suggestions(submitter_ip, created_at desc);
create index if not exists suggestion_votes_suggestion_id_idx on public.suggestion_votes(suggestion_id);
create index if not exists suggestion_votes_voter_id_idx on public.suggestion_votes(voter_id);

-- ============================================
-- Social Layer: Follows, Activity Feed, Leaderboards
-- ============================================
-- See migration: 20241217_social_layer.sql for full implementation

-- Follows table for user-to-user following
create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint no_self_follow check (follower_id != following_id),
  unique(follower_id, following_id)
);

alter table public.follows enable row level security;

drop policy if exists "Users can view own follows" on public.follows;
create policy "Users can view own follows"
  on public.follows for select
  using (
    auth.uid() = follower_id or
    auth.uid() = following_id or
    exists (
      select 1 from public.profiles
      where profiles.id = follows.following_id
      and profiles.is_public = true
    )
  );

drop policy if exists "Users can follow others" on public.follows;
create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

create index if not exists follows_follower_id_idx on public.follows(follower_id);
create index if not exists follows_following_id_idx on public.follows(following_id);
create index if not exists follows_created_at_idx on public.follows(created_at desc);

-- Activity feed table for storing events
create table if not exists public.activity_feed (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_type text not null,
  category text,
  place_id text,
  place_name text,
  achievement_id text,
  achievement_name text,
  old_level integer,
  new_level integer,
  challenge_id uuid,
  challenge_name text,
  xp_earned integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_feed enable row level security;

drop policy if exists "Users can view relevant activities" on public.activity_feed;
create policy "Users can view relevant activities"
  on public.activity_feed for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.follows f
      join public.profiles p on p.id = activity_feed.user_id
      where f.follower_id = auth.uid()
      and f.following_id = activity_feed.user_id
      and p.is_public = true
    ) or
    exists (
      select 1 from public.profiles
      where profiles.id = activity_feed.user_id
      and profiles.is_public = true
    )
  );

-- NOTE: No INSERT policy for activity_feed.
-- Activities should only be created by database triggers or server-side code,
-- never directly from the client. This prevents users from faking achievements.
drop policy if exists "Users can create own activities" on public.activity_feed;

create index if not exists activity_feed_user_id_idx on public.activity_feed(user_id);
create index if not exists activity_feed_created_at_idx on public.activity_feed(created_at desc);
create index if not exists activity_feed_type_idx on public.activity_feed(activity_type);
create index if not exists activity_feed_user_created_idx on public.activity_feed(user_id, created_at desc);

-- ============================================
-- Notifications System
-- ============================================
-- See migration: 20241218_notifications.sql for full implementation
-- Type is extensible text field - no CHECK constraint for OCP compliance
-- Currently supported: 'follow' (more types can be added without schema changes)

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text,
  actor_id uuid references auth.users(id) on delete set null,
  actor_username text,
  actor_avatar_url text,
  data jsonb default '{}',
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own notifications" on public.notifications;
create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- NOTE: No INSERT policy needed for notifications.
-- System-generated notifications are created server-side using service_role key,
-- which bypasses RLS. This prevents malicious users from spoofing notifications.
drop policy if exists "System can create notifications" on public.notifications;

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, read) where read = false;
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

-- Additional policy: Allow users to remove their own followers
drop policy if exists "Users can remove followers" on public.follows;
create policy "Users can remove followers"
  on public.follows for delete
  using (auth.uid() = following_id);
