"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import NewRequestClient from "./NewRequestClient";
import { useState } from "react";

export default function NewRequestPage() {
  const currentSubscription = useSubscription();
  const [now] = useState(() => Date.now());

  let hasActiveSubscription = false;

  if (
    currentSubscription?.status === "active" &&
    currentSubscription?.created_at
  ) {
    const createdAtDate = new Date(currentSubscription.created_at).getTime();
    const expirationDate = createdAtDate + 30 * 24 * 60 * 60 * 1000;
    hasActiveSubscription = expirationDate > now;
  }

  return <NewRequestClient hasActiveSubscription={hasActiveSubscription} />;
}
