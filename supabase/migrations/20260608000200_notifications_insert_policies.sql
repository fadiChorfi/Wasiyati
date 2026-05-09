-- =============================================================
-- Notifications policies for cross-user system notifications
-- =============================================================

drop policy if exists "own notifications" on public.notifications;

create policy "read own notifications"
  on public.notifications
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "update own notifications"
  on public.notifications
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "insert system notifications"
  on public.notifications
  for insert
  to authenticated
  with check (
    -- user can always create notifications for self
    user_id = auth.uid()
    or
    -- user submission -> notify admins
    (
      type = 'submission_received'
      and exists (
        select 1
        from public.profiles p
        where p.id = user_id and p.role = 'admin'
      )
    )
    or
    -- admin status update -> notify will owner
    (
      type in ('will_approved', 'will_rejected')
      and exists (
        select 1
        from public.wills w
        where w.id = notifications.will_id
          and w.user_id = notifications.user_id
      )
    )
  );
