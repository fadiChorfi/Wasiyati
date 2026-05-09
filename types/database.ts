import { OfferKey, OfferPrivileges } from "../config/offers";

/** Subscription tier — controls which detail table is used */
export type WillTier = "basic" | "medium" | "pro";

/** Document category — the kind of will being written */
export type WillCategory = "general" | "money" | "business";

export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

export type WillStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type DeliveryStatus = "not_sent" | "scheduled" | "sent" | "confirmed";
export type DeliveryMethod = "email" | "sms" | "physical" | "in_app";
export type UserRole = "user" | "admin";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export type NotificationType =
  | "submission_received"
  | "will_approved"
  | "will_rejected"
  | "delivery_confirmed"
  | "subscription_expiring";

// ─────────────────────────────────────────────
// Core table interfaces
// ─────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  city: string | null;
  role: UserRole;
  updated_at: string | null;
}

export interface Offer {
  id: string;
  offer_key: OfferKey;
  name_ar: string;
  price_dzd: number;
  is_active: boolean;
  tier_rank: number;
  has_legal_will_creation: boolean;
  has_approved_template: boolean;
  has_secure_digital_storage: boolean;
  has_edit_later: boolean;
  has_heir_notification: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  offer_id: string;
  status: SubscriptionStatus;
  receipt_url: string | null;
  receipt_path: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Will {
  id: string;
  user_id: string;
  subscription_id: string;
  /** Subscription tier — determines which detail table holds the form data */
  will_type: WillTier;
  /** Document kind — general / financial / business */
  will_category: WillCategory | null;
  declaration_statement: string | null;
  subject_of_will: string | null;
  status: WillStatus;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Testator (replaces embedded personal-info
// columns in basic/medium/pro detail tables)
// ─────────────────────────────────────────────

export interface Testator {
  id: string;
  will_id: string;
  last_name: string;
  first_name: string;
  birth_date: string | null;
  birth_place: string | null;
  profession: string | null;
  residence_place: string | null;
  marital_status: MaritalStatus | null;
  national_id: string | null;
  id_issue_date: string | null;
  id_issue_place: string | null;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Financial status (linked to testator)
// ─────────────────────────────────────────────

export interface FinancialStatus {
  id: string;
  testator_id: string;
  number_of_children: number;
  boys: number;
  girls: number;
  total_money: number | null;
}

// ─────────────────────────────────────────────
// Witnesses (replaces witness1_* / witness2_*
// columns embedded in detail tables)
// ─────────────────────────────────────────────

export interface Witness {
  id: string;
  will_id: string;
  /** 1 or 2 — enforced by DB CHECK + UNIQUE(will_id, witness_number) */
  witness_number: 1 | 2;
  last_name: string;
  first_name: string;
  national_id: string | null;
}

// ─────────────────────────────────────────────
// Beneficiaries (enriched with personal fields)
// ─────────────────────────────────────────────

export interface WillBeneficiary {
  id: string;
  will_id: string;
  full_name: string;
  last_name: string | null;
  national_id: string | null;
  relationship: string;
  share_percentage: number | null;
  asset_description: string | null;
  birth_date: string | null;
  birth_place: string | null;
  residence_place: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// Will detail tables (tier-specific asset data
// only — personal info now lives in testators)
// ─────────────────────────────────────────────

export interface WillBasicDetails {
  id: string;
  will_id: string;
  executor_name: string;
  executor_phone: string | null;
  executor_relationship: string | null;
  special_instructions: string | null;
  updated_at: string;
}

export interface WillMediumDetails extends WillBasicDetails {
  real_estate_description: string | null;
  real_estate_location: string | null;
  real_estate_value: number | null;
  vehicle_description: string | null;
  vehicle_registration: string | null;
  other_assets: string | null;
}

export interface WillProDetails extends WillMediumDetails {
  bank_accounts: string | null;
  investment_portfolio: string | null;
  debts_owed_to_me: string | null;
  debts_i_owe: string | null;
  business_shares: string | null;
  digital_assets: string | null;
  funeral_wishes: string | null;
  charity_bequests: string | null;
}

// ─────────────────────────────────────────────
// Discriminated union — tier narrows detail type
// ─────────────────────────────────────────────

export type WillDetails =
  | { will_type: "basic"; details: WillBasicDetails }
  | { will_type: "medium"; details: WillMediumDetails }
  | { will_type: "pro"; details: WillProDetails };

export function asWillDetails(
  will_type: WillTier,
  details: WillBasicDetails,
): WillDetails {
  return { will_type, details } as WillDetails;
}

// ─────────────────────────────────────────────
// Submissions & Delivery
// ─────────────────────────────────────────────

export interface WillSubmission {
  id: string;
  will_id: string;
  submitted_by: string;
  reviewed_by: string | null;
  review_status: ReviewStatus;
  admin_notes: string | null;
  error_step: number | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface WillDelivery {
  id: string;
  will_id: string;
  trustee_name: string;
  trustee_email: string | null;
  trustee_phone: string | null;
  delivery_status: DeliveryStatus;
  delivery_method: DeliveryMethod;
  scheduled_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// Notifications — raw DB row + discriminated union
// ─────────────────────────────────────────────

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title_ar: string;
  message_ar: string;
  is_read: boolean;
  will_id: string | null;
  submission_id: string | null;
  subscription_id: string | null;
  days_remaining: number | null;
  created_at: string;
}

interface NotificationBase {
  id: string;
  user_id: string;
  title_ar: string;
  message_ar: string;
  is_read: boolean;
  created_at: string;
}

export type Notification =
  | (NotificationBase & {
      type: "submission_received";
      will_id: string;
      submission_id: string;
    })
  | (NotificationBase & {
      type: "will_approved" | "will_rejected";
      will_id: string;
      submission_id: string;
    })
  | (NotificationBase & { type: "delivery_confirmed"; will_id: string })
  | (NotificationBase & {
      type: "subscription_expiring";
      subscription_id: string;
      days_remaining: number;
    });

export function parseNotification(row: NotificationRow): Notification {
  switch (row.type) {
    case "submission_received":
    case "will_approved":
    case "will_rejected":
      if (!row.will_id || !row.submission_id)
        throw new Error(
          `Missing will_id or submission_id for type: ${row.type}`,
        );
      return {
        ...row,
        type: row.type,
        will_id: row.will_id,
        submission_id: row.submission_id,
      };

    case "delivery_confirmed":
      if (!row.will_id)
        throw new Error("Missing will_id for delivery_confirmed");
      return { ...row, type: row.type, will_id: row.will_id };

    case "subscription_expiring":
      if (!row.subscription_id || row.days_remaining === null)
        throw new Error(
          "Missing subscription_id or days_remaining for subscription_expiring",
        );
      return {
        ...row,
        type: row.type,
        subscription_id: row.subscription_id,
        days_remaining: row.days_remaining,
      };
  }
}

// ─────────────────────────────────────────────
// Joined types — for UI queries
// ─────────────────────────────────────────────

export interface SubscriptionWithOffer extends Subscription {
  offer: Offer & { privileges: OfferPrivileges };
}

/** Full will with everything a form page needs */
export interface WillWithDetails extends Will {
  testator: Testator | null;
  financial_status: FinancialStatus | null;
  witnesses: Witness[];
  beneficiaries: WillBeneficiary[];
  details: WillBasicDetails | WillMediumDetails | WillProDetails | null;
  subscription: SubscriptionWithOffer;
}

export interface WillWithSubscription extends Will {
  subscription: SubscriptionWithOffer;
}

export interface SubmissionWithWill extends WillSubmission {
  will: Will;
  profile: Pick<Profile, "id" | "full_name" | "phone" | "city">;
}
