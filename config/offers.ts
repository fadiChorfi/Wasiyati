
export const OFFER_KEYS = ["basic", "medium", "pro"] as const;
export type OfferKey = (typeof OFFER_KEYS)[number];

export interface OfferPrivileges {
  can_create_will: boolean;
  can_deliver_will: boolean;
  can_save_draft: boolean;
}

export interface OfferConfig {
  key: OfferKey;
  name_ar: string;
  price_dzd: number;
  privileges: OfferPrivileges;
}

export const OFFERS: Record<OfferKey, OfferConfig> = {
  basic: {
    key: "basic",
    name_ar: "الأساسية",
    price_dzd: 1500,
    privileges: {
      can_create_will: true,
      can_deliver_will: false,
      can_save_draft: false,
    },
  },
  medium: {
    key: "medium",
    name_ar: "المتوسطة",
    price_dzd: 3500,
    privileges: {
      can_create_will: true,
      can_save_draft: true,
      can_deliver_will: false,
    },
  },
  pro: {
    key: "pro",
    name_ar: "الشاملة (Pro)",
    price_dzd: 6000,
    privileges: {
      can_create_will: true,
      can_save_draft: true,
      can_deliver_will: true,
    },
  },
};
