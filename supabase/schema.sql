create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text not null,
  fulfillment text not null default 'pickup'
    check (fulfillment in ('pickup', 'delivery')),
  address text,
  requested_time text,
  items jsonb not null default '[]'::jsonb,
  comment text,
  total_cents integer,
  status text not null default 'new'
    check (status in ('new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
  email_sent boolean not null default false
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text not null,
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null check (guests between 1 and 30),
  comment text,
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  email_sent boolean not null default false
);

create index if not exists reservations_created_at_idx on public.reservations (created_at desc);
create index if not exists reservations_date_idx on public.reservations (reservation_date, reservation_time);
create index if not exists reservations_status_idx on public.reservations (status);

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.reservations enable row level security;
alter table public.staff_users enable row level security;

-- There are intentionally no public RLS policies. All customer writes and
-- staff reads go through authenticated Vercel functions using the service role.

