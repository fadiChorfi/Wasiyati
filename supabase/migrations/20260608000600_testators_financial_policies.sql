alter table public.testators enable row level security;

drop policy if exists "user own testators" on public.testators;
drop policy if exists "admin manage testators" on public.testators;

create policy "user own testators"
  on public.testators
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.wills w
      where w.id = testators.will_id
        and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.wills w
      where w.id = testators.will_id
        and w.user_id = auth.uid()
    )
  );

create policy "admin manage testators"
  on public.testators
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

alter table public.financial_status enable row level security;

drop policy if exists "user own financial status" on public.financial_status;
drop policy if exists "admin manage financial status" on public.financial_status;

create policy "user own financial status"
  on public.financial_status
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.testators t
      join public.wills w on w.id = t.will_id
      where t.id = financial_status.testator_id
        and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.testators t
      join public.wills w on w.id = t.will_id
      where t.id = financial_status.testator_id
        and w.user_id = auth.uid()
    )
  );

create policy "admin manage financial status"
  on public.financial_status
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
