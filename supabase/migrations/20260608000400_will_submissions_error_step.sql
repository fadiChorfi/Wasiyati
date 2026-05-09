-- Optional step pointer for rejected will feedback
-- 0: testator, 1: beneficiary, 2: will body, 3: witnesses, 4: financial
alter table public.will_submissions
  add column if not exists error_step integer;

alter table public.will_submissions
  drop constraint if exists will_submissions_error_step_check;

alter table public.will_submissions
  add constraint will_submissions_error_step_check
  check (error_step is null or (error_step >= 0 and error_step <= 4));
