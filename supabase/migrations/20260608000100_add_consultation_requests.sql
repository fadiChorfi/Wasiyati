-- =============================================================
-- Consultation requests
-- =============================================================

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_consultation_requests_status
  on public.consultation_requests(status);
create index if not exists idx_consultation_requests_user_id
  on public.consultation_requests(user_id);
create index if not exists idx_consultation_requests_created_at
  on public.consultation_requests(created_at desc);

alter table public.consultation_requests enable row level security;

drop policy if exists "own consultation requests" on public.consultation_requests;
create policy "own consultation requests"
  on public.consultation_requests
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admin consultation requests read" on public.consultation_requests;
create policy "admin consultation requests read"
  on public.consultation_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "admin consultation requests update" on public.consultation_requests;
create policy "admin consultation requests update"
  on public.consultation_requests
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
