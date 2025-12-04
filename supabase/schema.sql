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
