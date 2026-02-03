-- Historical events (public read for listing and detail pages)
create table if not exists public.historical_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  summary text not null default '',
  content text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.historical_events enable row level security;

create policy "Allow public read for historical_events"
  on public.historical_events for select
  to public
  using (true);

create policy "Allow authenticated insert/update/delete for historical_events"
  on public.historical_events for all
  to authenticated
  using (true)
  with check (true);

-- Historical figures (linked to events)
create table if not exists public.historical_figures (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.historical_events(id) on delete cascade,
  name text not null,
  brief_description text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.historical_figures enable row level security;

create policy "Allow public read for historical_figures"
  on public.historical_figures for select
  to public
  using (true);

create policy "Allow authenticated insert/update/delete for historical_figures"
  on public.historical_figures for all
  to authenticated
  using (true)
  with check (true);
