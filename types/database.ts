import { OfferKey, OfferPrivileges } from "../config/offers";

export type WillType = "general" | "financial" | "business";

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

export type NotificationType =
  | "submission_received"
  | "will_approved"
  | "will_rejected"
  | "delivery_confirmed"
  | "subscription_expiring";

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
}

export interface Subscription {
  id: string;
  user_id: string;
  offer_id: string;
  status: SubscriptionStatus;
  receipt_url: string | null;
  receipt_path: string | null;
  admin_notes?: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Will {
  id: string;
  user_id: string;
  subscription_id: string;
  will_type: WillType;
  status: WillStatus;
  form_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WillSubmission {
  id: string;
  will_id: string;
  submitted_by: string;
  reviewed_by: string | null;
  review_status: ReviewStatus;
  admin_notes: string | null;
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

// -------------------------------------------------------------
// Notifications — raw DB row + typed discriminated union
// -------------------------------------------------------------

// what Supabase returns directly from the table
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

// shared base — fields present on every notification
interface NotificationBase {
  id: string;
  user_id: string;
  title_ar: string;
  message_ar: string;
  is_read: boolean;
  created_at: string;
}

// what the rest of the app uses — narrowed by type
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
  | (NotificationBase & {
      type: "delivery_confirmed";
      will_id: string;
    })
  | (NotificationBase & {
      type: "subscription_expiring";
      subscription_id: string;
      days_remaining: number;
    });

// parser — call this on every raw row before passing to the app
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

// -------------------------------------------------------------
// Joined types — for UI queries that join tables
// -------------------------------------------------------------

export interface SubscriptionWithOffer extends Subscription {
  offer: Offer & { privileges: OfferPrivileges };
}

export interface WillWithSubscription extends Will {
  subscription: SubscriptionWithOffer;
}

export interface SubmissionWithWill extends WillSubmission {
  will: Will;
  profile: Pick<Profile, "id" | "full_name" | "phone" | "city">;
}

// -------------------------------------------------------------
// Will form data types — one interface per will_type
// form_data is cast to one of these after fetching a will row
// -------------------------------------------------------------

export interface BaseWillFormData {
  testator_name: string;
  national_id: string;
  date_of_birth: string;
  heirs: Array<{
    name: string;
    relation: string;
    share: number;
  }>;
  assets: Array<{
    description: string;
    value: number;
  }>;
  special_instructions: string | null;
}

export type GeneralWillFormData = BaseWillFormData;

export interface FinancialWillFormData extends BaseWillFormData {
  bank_accounts: Array<{
    bank: string;
    iban: string;
    assigned_to: string;
  }>;
  debts: Array<{
    creditor: string;
    amount: number;
  }>;
}

export interface BusinessWillFormData extends BaseWillFormData {
  companies: Array<{
    company_name: string;
    registration_number: string;
    shares_percentage: number;
    assigned_to: string;
  }>;
}

// discriminated union — will_type narrows the form_data shape
export type TypedWill =
  | { will_type: "general"; form_data: GeneralWillFormData }
  | { will_type: "financial"; form_data: FinancialWillFormData }
  | { will_type: "business"; form_data: BusinessWillFormData };

// helper — cast a Will row into its typed form after fetching
export function asTypedWill(will: Will): TypedWill {
  return {
    will_type: will.will_type,
    form_data: will.form_data,
  } as unknown as TypedWill;
}
