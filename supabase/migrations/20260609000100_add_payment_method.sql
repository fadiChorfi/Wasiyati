-- Add payment_method and payment_email columns to subscriptions table
ALTER TABLE "public"."subscriptions"
ADD COLUMN IF NOT EXISTS "payment_method" text DEFAULT 'ccp',
ADD CONSTRAINT "subscriptions_payment_method_check" CHECK (payment_method IN ('ccp', 'baridi_mob'));

ALTER TABLE "public"."subscriptions"
ADD COLUMN IF NOT EXISTS "payment_email" text;
