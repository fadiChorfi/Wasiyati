"use client";

import { createContext, useContext } from "react";
import { Subscription, Offer } from "@/types/database";

export type SubscriptionWithOffer = Subscription & { offer?: Offer };

const SubscriptionContext = createContext<
  SubscriptionWithOffer | null | undefined
>(undefined);

export function SubscriptionProvider({
  children,
  subscription,
}: {
  children: React.ReactNode;
  subscription: SubscriptionWithOffer | null;
}) {
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used inside SubscriptionProvider");
  }
  return context;
}
