-- ============================================================
-- RideChecks — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Orders table
create table if not exists orders (
  id            uuid        default gen_random_uuid() primary key,
  full_name     text        not null,
  email         text        not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  phone         text        not null,
  vin           text        not null check (length(vin) = 17),
  package_name  text        not null,
  package_price numeric(10,2) not null check (package_price > 0),
  status        text        not null default 'pending'
                            check (status in ('pending', 'processing', 'completed')),
  report_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Enable Row Level Security
alter table orders enable row level security;

-- Customers can insert orders (public)
create policy "Allow public insert" on orders
  for insert with check (true);

-- Customers can read their own order by id (optional tracking)
create policy "Allow read by id" on orders
  for select using (true);

-- Service role bypasses RLS automatically (admin portal uses service key)

-- Auto-update updated_at on change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute procedure update_updated_at();

-- ============================================================
-- Storage: reports bucket
-- Run this AFTER the table above
-- ============================================================

-- Create the storage bucket for report files
insert into storage.buckets (id, name, public)
values ('reports', 'reports', true)
on conflict (id) do nothing;

-- Allow authenticated admin uploads (service role bypasses this automatically)
-- Allow public reads so report download links work
create policy "Public report reads" on storage.objects
  for select using (bucket_id = 'reports');

-- Only service role can insert/delete (admin portal)
-- (service role bypasses RLS, so no insert policy needed for it)
