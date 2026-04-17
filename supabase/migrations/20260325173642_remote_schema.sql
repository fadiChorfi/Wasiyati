-- =============================================================
-- Wasiyati — Final Database Schema v2
-- Privileges are static (defined in config/offers.ts).
-- The DB stores only offer_key as a plain string.
-- Compatible with existing public.profiles table.
-- Run once in Supabase SQL editor.
-- =============================================================


-- =============================================================
-- 0. EXTEND EXISTING PROFILES TABLE
-- =============================================================

create table public.profiles (
  id uuid not null,
  full_name text null,
  phone text null,
  city text null,
  avatar_url text null,
  updated_at timestamp with time zone null,
  role character varying(20) null default 'user'::character varying,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_role_check check (
    (
      (role)::text = any (
        (
          array[
            'user'::character varying,
            'admin'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;


-- =============================================================
-- 1. OFFERS
-- One row per pricing tier.
-- offer_key is the join point to config/offers.ts.
-- No JSONB — privileges live entirely in TypeScript.
-- =============================================================

create table public.offers (
  id          uuid          primary key default gen_random_uuid(),
  offer_key   text          not null unique
                              check (offer_key in ('basic', 'advanced', 'comprehensive')),
  name_ar     text          not null,
  price_dzd   numeric(10,2) not null,
  is_active   boolean       not null default true,
);


-- =============================================================
-- 2. SUBSCRIPTIONS
-- Records a user purchasing an offer.
-- =============================================================

create table public.subscriptions (
  id          uuid  primary key default gen_random_uuid(),
  user_id     uuid  not null references public.profiles(id) on delete cascade,
  offer_id    uuid  not null references public.offers(id),
  status      text  not null default 'pending'
                      check (status in ('pending', 'active', 'expired', 'cancelled')),
  receipt_url   text,    
  receipt_path  text, 
  started_at  timestamptz,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status  on public.subscriptions(status);


-- =============================================================
-- 3. WILLS
-- Core document. will_type maps to /forms/<type>.ts.
-- form_data is the only JSONB — holds the filled form fields.
-- =============================================================

create table public.wills (
  id               uuid  primary key default gen_random_uuid(),
  user_id          uuid  not null references public.profiles(id) on delete cascade,
  subscription_id  uuid  not null references public.subscriptions(id),
  will_type        text  not null
                           check (will_type in ('basic', 'property', 'financial', 'comprehensive')),
  status           text  not null default 'draft'
                           check (status in ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  form_data        jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_wills_user_id on public.wills(user_id);
create index idx_wills_status  on public.wills(status);

-- auto-stamp updated_at on every save
create or replace function public.handle_will_updated()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_will_updated
  before update on public.wills
  for each row execute procedure public.handle_will_updated();


-- =============================================================
-- 4. WILL SUBMISSIONS
-- User sends a will to the admin queue for review.
-- =============================================================

create table public.will_submissions (
  id             uuid  primary key default gen_random_uuid(),
  will_id        uuid  not null references public.wills(id) on delete cascade,
  submitted_by   uuid  not null references public.profiles(id),
  reviewed_by    uuid  references public.profiles(id),
  review_status  text  not null default 'pending'
                         check (review_status in ('pending', 'approved', 'rejected')),
  admin_notes    text,
  submitted_at   timestamptz not null default now(),
  reviewed_at    timestamptz
);

create index idx_will_submissions_will_id       on public.will_submissions(will_id);
create index idx_will_submissions_review_status on public.will_submissions(review_status);


-- =============================================================
-- 5. WILL DELIVERIES
-- Sends an approved will to a trustee (وصي).
-- unique on will_id: one will → one trustee.
-- =============================================================

create table public.will_deliveries (
  id               uuid  primary key default gen_random_uuid(),
  will_id          uuid  not null unique references public.wills(id) on delete cascade,
  trustee_name     text  not null,
  trustee_email    text,
  trustee_phone    text,
  delivery_status  text  not null default 'not_sent'
                           check (delivery_status in ('not_sent', 'scheduled', 'sent', 'confirmed')),
  delivery_method  text  not null default 'email'
                           check (delivery_method in ('email', 'sms', 'physical')),
  scheduled_at     timestamptz,
  delivered_at     timestamptz,
  created_at       timestamptz not null default now()
);


-- =============================================================
-- 6. NOTIFICATIONS
-- INSERT here fires the Realtime event on the user's channel.
-- =============================================================

create table public.notifications (
  id          uuid    primary key default gen_random_uuid(),
  user_id     uuid    not null references public.profiles(id) on delete cascade,
  type        text    not null
                        check (type in (
                          'submission_received',
                          'will_approved',
                          'will_rejected',
                          'delivery_confirmed',
                          'subscription_expiring'
                        )),
  title_ar    text    not null,
  message_ar  text    not null,
  is_read     boolean not null default false,
  will_id:          string | null
  submission_id:    string | null
  subscription_id:  string | null
  days_remaining:   number | null
  created_at  timestamptz not null default now()
);

create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_is_read on public.notifications(is_read);


-- =============================================================
-- 7. AUTO-CREATE PROFILE ON SIGNUP
-- on conflict do nothing makes this safe to re-run.
-- =============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =============================================================
-- 8. ROW LEVEL SECURITY
-- Users access only their own rows.
-- Admins use the service role key in server actions (bypasses RLS).
-- =============================================================

alter table public.offers            enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.wills             enable row level security;
alter table public.will_submissions  enable row level security;
alter table public.will_deliveries   enable row level security;
alter table public.notifications     enable row level security;

-- offers: anyone authenticated can read active offers
create policy "read active offers"
  on public.offers for select
  to authenticated
  using (is_active = true);

-- subscriptions: users read and write only their own
create policy "own subscriptions"
  on public.subscriptions for all
  to authenticated
  using (user_id = auth.uid());

-- wills: users read and write only their own
create policy "own wills"
  on public.wills for all
  to authenticated
  using (user_id = auth.uid());

-- will_submissions: user can insert and read their own submissions
create policy "own submissions"
  on public.will_submissions for all
  to authenticated
  using (submitted_by = auth.uid());

-- will_deliveries: accessible through the parent will's owner
create policy "own deliveries"
  on public.will_deliveries for all
  to authenticated
  using (
    will_id in (
      select id from public.wills
      where user_id = auth.uid()
    )
  );

-- notifications: users read and update (mark as read) only their own
create policy "own notifications"
  on public.notifications for all
  to authenticated
  using (user_id = auth.uid());


