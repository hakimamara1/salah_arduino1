-- ──────────────────────────────────────────────────────────────────────
-- Arduino Shop — orders table
-- Run in Supabase → SQL Editor (or via the CLI: `supabase db push`).
-- ──────────────────────────────────────────────────────────────────────

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  full_name       text        not null,
  phone           text        not null,
  wilaya          text        not null,
  address         text        not null,
  landing_variant text        not null default 'A',
  created_at      timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_variant_idx    on public.orders (landing_variant);

-- Row Level Security: lock the table down. The Server Action writes with the
-- service-role key, which bypasses RLS, so no public insert policy is needed.
alter table public.orders enable row level security;

-- (No anon/authenticated policies on purpose — only the service role can read
--  or write. Add a dashboard/admin policy later if you build an admin panel.)
