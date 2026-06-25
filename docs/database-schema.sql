-- Local Agent Wizard database schema
-- Target: Supabase Postgres or any Postgres 15+ compatible database.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin', 'support')),
  source text,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  intent text not null default 'newsletter',
  source_page text,
  locale text default 'zh-CN',
  hardware_profile jsonb not null default '{}'::jsonb,
  notes text,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.wizard_runs (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  profile_id uuid references public.profiles(id) on delete set null,
  os text,
  memory_gb integer check (memory_gb is null or memory_gb > 0),
  gpu_vram_gb integer check (gpu_vram_gb is null or gpu_vram_gb >= 0),
  use_case text,
  target_tool text,
  autonomy_level integer check (autonomy_level is null or autonomy_level between 1 and 5),
  recommendation jsonb not null default '{}'::jsonb,
  exported_formats text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  profile_id uuid references public.profiles(id) on delete set null,
  tool text,
  error_signature text,
  matched_rule text,
  raw_error_excerpt text,
  user_feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  author_name text not null default '匿名用户',
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'spam')),
  likes integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  email text,
  provider text not null check (provider in ('stripe', 'lemon_squeezy', 'manual')),
  provider_order_id text,
  product_key text not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_order_id)
);

create table if not exists public.template_entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  product_key text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (profile_id, product_key)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  profile_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  path text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_intent_created_idx on public.leads (intent, created_at desc);
create index if not exists wizard_runs_created_idx on public.wizard_runs (created_at desc);
create index if not exists diagnostics_tool_created_idx on public.diagnostics (tool, created_at desc);
create index if not exists comments_page_status_idx on public.comments (page_id, status, created_at desc);
create index if not exists orders_email_idx on public.orders (email);
create index if not exists events_name_created_idx on public.events (event_name, created_at desc);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.wizard_runs enable row level security;
alter table public.diagnostics enable row level security;
alter table public.comments enable row level security;
alter table public.orders enable row level security;
alter table public.template_entitlements enable row level security;
alter table public.events enable row level security;

-- Public read only for approved comments. Writes should go through Edge Functions
-- using a service role key so rate limits, spam checks and consent can be enforced.
create policy "approved comments are public"
on public.comments for select
using (status = 'approved');

-- Authenticated users can read their own paid entitlements.
create policy "users read own entitlements"
on public.template_entitlements for select
using (profile_id::text = auth.uid()::text);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_comments_updated_at on public.comments;
create trigger touch_comments_updated_at
before update on public.comments
for each row execute function public.touch_updated_at();

drop trigger if exists touch_orders_updated_at on public.orders;
create trigger touch_orders_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();
