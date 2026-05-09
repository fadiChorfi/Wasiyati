-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.consultation_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'closed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT consultation_requests_pkey PRIMARY KEY (id),
  CONSTRAINT consultation_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.financial_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  testator_id uuid NOT NULL UNIQUE,
  number_of_children integer NOT NULL DEFAULT 0,
  boys integer NOT NULL DEFAULT 0,
  girls integer NOT NULL DEFAULT 0,
  total_money double precision,
  CONSTRAINT financial_status_pkey PRIMARY KEY (id),
  CONSTRAINT financial_status_testator_fkey FOREIGN KEY (testator_id) REFERENCES public.testators(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['submission_received'::text, 'will_approved'::text, 'will_rejected'::text, 'delivery_confirmed'::text, 'subscription_expiring'::text])),
  title_ar text NOT NULL,
  message_ar text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  will_id uuid,
  submission_id uuid,
  subscription_id uuid,
  days_remaining integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT notifications_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id),
  CONSTRAINT notifications_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.will_submissions(id),
  CONSTRAINT notifications_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  offer_key text NOT NULL UNIQUE CHECK (offer_key = ANY (ARRAY['basic'::text, 'medium'::text, 'pro'::text])),
  name_ar text NOT NULL,
  price_dzd numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  tier_rank integer NOT NULL DEFAULT 1,
  has_legal_will_creation boolean NOT NULL DEFAULT true,
  has_approved_template boolean NOT NULL DEFAULT true,
  has_secure_digital_storage boolean NOT NULL DEFAULT false,
  has_edit_later boolean NOT NULL DEFAULT false,
  has_heir_notification boolean NOT NULL DEFAULT false,
  CONSTRAINT offers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  phone text,
  city text,
  avatar_url text,
  updated_at timestamp with time zone,
  role character varying DEFAULT 'user'::character varying CHECK (role::text = ANY (ARRAY['user'::character varying::text, 'admin'::character varying::text])),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  offer_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'expired'::text, 'cancelled'::text])),
  receipt_url text,
  receipt_path text,
  started_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.testators (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL UNIQUE,
  last_name text NOT NULL,
  first_name text NOT NULL,
  birth_date date,
  birth_place text,
  profession text,
  residence_place text,
  marital_status text CHECK (marital_status = ANY (ARRAY['single'::text, 'married'::text, 'divorced'::text, 'widowed'::text])),
  national_id text,
  id_issue_date date,
  id_issue_place text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT testators_pkey PRIMARY KEY (id),
  CONSTRAINT testators_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_basic_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL UNIQUE,
  executor_name text NOT NULL,
  executor_phone text,
  executor_relationship text,
  special_instructions text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT will_basic_details_pkey PRIMARY KEY (id),
  CONSTRAINT will_basic_details_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_beneficiaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL,
  full_name text NOT NULL,
  national_id text,
  relationship text NOT NULL,
  share_percentage numeric CHECK (share_percentage > 0::numeric AND share_percentage <= 100::numeric),
  asset_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_name text,
  birth_date date,
  birth_place text,
  residence_place text,
  CONSTRAINT will_beneficiaries_pkey PRIMARY KEY (id),
  CONSTRAINT will_beneficiaries_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_deliveries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL UNIQUE,
  trustee_name text NOT NULL,
  trustee_email text,
  trustee_phone text,
  delivery_status text NOT NULL DEFAULT 'not_sent'::text CHECK (delivery_status = ANY (ARRAY['not_sent'::text, 'scheduled'::text, 'sent'::text, 'confirmed'::text])),
  delivery_method text NOT NULL DEFAULT 'email'::text CHECK (delivery_method = ANY (ARRAY['email'::text, 'sms'::text, 'physical'::text])),
  scheduled_at timestamp with time zone,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT will_deliveries_pkey PRIMARY KEY (id),
  CONSTRAINT will_deliveries_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_medium_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL UNIQUE,
  executor_name text NOT NULL,
  executor_phone text,
  executor_relationship text,
  real_estate_description text,
  real_estate_location text,
  real_estate_value numeric,
  vehicle_description text,
  vehicle_registration text,
  other_assets text,
  special_instructions text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT will_medium_details_pkey PRIMARY KEY (id),
  CONSTRAINT will_medium_details_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_pro_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL UNIQUE,
  executor_name text NOT NULL,
  executor_phone text,
  executor_relationship text,
  real_estate_description text,
  real_estate_location text,
  real_estate_value numeric,
  vehicle_description text,
  vehicle_registration text,
  other_assets text,
  bank_accounts text,
  investment_portfolio text,
  debts_owed_to_me text,
  debts_i_owe text,
  business_shares text,
  digital_assets text,
  funeral_wishes text,
  charity_bequests text,
  special_instructions text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT will_pro_details_pkey PRIMARY KEY (id),
  CONSTRAINT will_pro_details_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);
CREATE TABLE public.will_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL,
  submitted_by uuid NOT NULL,
  reviewed_by uuid,
  review_status text NOT NULL DEFAULT 'pending'::text CHECK (review_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  admin_notes text,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  error_step integer,
  CONSTRAINT will_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT will_submissions_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id),
  CONSTRAINT will_submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.profiles(id),
  CONSTRAINT will_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.wills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid NOT NULL,
  will_type text NOT NULL CHECK (will_type = ANY (ARRAY['basic'::text, 'medium'::text, 'pro'::text])),
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  declaration_statement text,
  subject_of_will text,
  will_category text CHECK (will_category = ANY (ARRAY['money'::text, 'general'::text, 'business'::text])),
  CONSTRAINT wills_pkey PRIMARY KEY (id),
  CONSTRAINT wills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT wills_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.witnesses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  will_id uuid NOT NULL,
  witness_number integer NOT NULL CHECK (witness_number = ANY (ARRAY[1, 2])),
  last_name text NOT NULL,
  first_name text NOT NULL,
  national_id text,
  CONSTRAINT witnesses_pkey PRIMARY KEY (id),
  CONSTRAINT witnesses_will_id_fkey FOREIGN KEY (will_id) REFERENCES public.wills(id)
);