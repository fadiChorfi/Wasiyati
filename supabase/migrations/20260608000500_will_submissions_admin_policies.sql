-- Allow admin review records in will_submissions
-- Existing old policy from remote schema blocks admin inserts because it enforces:
-- submitted_by = auth.uid()

alter table public.will_submissions enable row level security;

drop policy if exists "own submissions" on public.will_submissions;
drop policy if exists "user own submissions select" on public.will_submissions;
drop policy if exists "user own submissions insert" on public.will_submissions;
drop policy if exists "admin manage submissions" on public.will_submissions;

-- User can read their own submission records
create policy "user own submissions select"
  on public.will_submissions
  for select
  to authenticated
  using (submitted_by = auth.uid());

-- User can create their own initial submission records (if used by app flow)
create policy "user own submissions insert"
  on public.will_submissions
  for insert
  to authenticated
  with check (submitted_by = auth.uid());

-- Admin can read/insert/update all review records
create policy "admin manage submissions"
  on public.will_submissions
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
