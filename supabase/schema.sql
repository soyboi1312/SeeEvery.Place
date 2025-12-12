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
create policy "Users can view own selections"
  on public.user_selections for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own selections
create policy "Users can insert own selections"
  on public.user_selections for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own selections
create policy "Users can update own selections"
  on public.user_selections for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own selections
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
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

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
create policy "Suggestions are viewable by everyone"
  on public.suggestions for select
  using (status in ('pending', 'approved', 'implemented'));

-- Block direct client inserts - must go through API route with rate limiting
-- Use service_role key in API to bypass this
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
create policy "Authenticated users can check own admin status"
  on public.admin_emails for select
  using (
    auth.role() = 'authenticated'
    and email = lower(auth.jwt() ->> 'email')
  );

create policy "Only admins can insert admin_emails"
  on public.admin_emails for insert
  with check (public.is_admin());

create policy "Only admins can delete admin_emails"
  on public.admin_emails for delete
  using (public.is_admin());

-- Only admin users can update suggestions (for approval/rejection)
create policy "Only admins can update suggestions"
  on public.suggestions for update
  using (public.is_admin());

-- Authenticated users can view all suggestions (including rejected)
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
create policy "Votes are viewable by everyone"
  on public.suggestion_votes for select
  using (true);

-- Only authenticated users can insert votes, and voter_id must match their user id
create policy "Authenticated users can vote"
  on public.suggestion_votes for insert
  with check (
    auth.role() = 'authenticated'
    and auth.uid()::text = voter_id
  );

-- Users can only delete their own votes (for unvoting)
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
