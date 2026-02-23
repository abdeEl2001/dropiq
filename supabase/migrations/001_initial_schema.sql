create extension if not exists "uuid-ossp";

create table public.profiles (
  id             uuid references auth.users on delete cascade primary key,
  email          text,
  full_name      text,
  avatar_url     text,
  plan           text default 'free' check (plan in ('free','pro','agency')),
  searches_used  int default 0,
  searches_limit int default 10,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.tracked_products (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  name         text not null,
  category     text, hook text, score int,
  viral_score  int, margin_score int,
  trending     boolean default false,
  platforms    text[], price_range text, ad_budget text,
  audience     text, sourcing text, roi text,
  ad_angles    text[], video_ideas text[],
  ad_copy      text, risks text, notes text,
  status       text default 'watching' check (status in ('watching','testing','winner','paused')),
  created_at   timestamptz default now()
);

alter table public.tracked_products enable row level security;
create policy "Users manage own products" on public.tracked_products
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.tracked_products(user_id, created_at desc);

create table public.search_history (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  type       text check (type in ('scout','spy','copy')),
  query      text, country text, platforms text[], results jsonb,
  created_at timestamptz default now()
);

alter table public.search_history enable row level security;
create policy "Users view own history" on public.search_history
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.search_history(user_id, created_at desc);

create or replace function public.increment_search_count(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set searches_used = searches_used + 1, updated_at = now()
  where id = p_user_id;
end;
$$;
