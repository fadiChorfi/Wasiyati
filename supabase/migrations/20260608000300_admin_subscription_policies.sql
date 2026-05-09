-- =============================================================
-- Admin access for subscription review actions
-- Fixes: activate/reject decisions blocked by RLS
-- =============================================================

alter table public.subscriptions enable row level security;

drop policy if exists "admin manage subscriptions" on public.subscriptions;

create policy "admin manage subscriptions"
  on public.subscriptions
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- If profiles RLS is enabled in deployed DB, this lets authenticated users
-- read admin IDs (needed for admin-targeted notification inserts).
drop policy if exists "read own or admin profiles" on public.profiles;

create policy "read own or admin profiles"
  on public.profiles
  for select
  to authenticated
  using (
    id = auth.uid()
    or role = 'admin'
  );
