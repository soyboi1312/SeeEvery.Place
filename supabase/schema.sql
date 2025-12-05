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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Anyone can insert suggestions (no auth required for submissions)
create policy "Anyone can submit suggestions"
  on public.suggestions for insert
  with check (true);

-- Authenticated users can update suggestions (for admin approval)
create policy "Authenticated users can update suggestions"
  on public.suggestions for update
  using (auth.role() = 'authenticated');

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

-- Anyone can insert votes
create policy "Anyone can vote"
  on public.suggestion_votes for insert
  with check (true);

-- Anyone can delete their own votes (for unvoting)
create policy "Anyone can unvote"
  on public.suggestion_votes for delete
  using (true);

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
create index if not exists suggestion_votes_suggestion_id_idx on public.suggestion_votes(suggestion_id);
create index if not exists suggestion_votes_voter_id_idx on public.suggestion_votes(voter_id);
