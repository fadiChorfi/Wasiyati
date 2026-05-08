"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import NewRequestClient from "./NewRequestClient";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NewRequestPage() {
  const currentSubscription = useSubscription();
  const [willStatus, setWillStatus] = useState<string | null>(null);
  const [willId, setWillId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWill = async () => {
      try {
        if (currentSubscription?.id) {
          const supabase = createClient();
          const { data } = await supabase
            .from("wills")
            .select("id, status")
            .eq("subscription_id", currentSubscription.id)
            .maybeSingle();

          setWillStatus(data?.status ?? null);
          setWillId(data?.id ?? null);
        } else {
          setWillStatus(null);
          setWillId(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkWill();
  }, [currentSubscription?.id]);

  const blockReason = !currentSubscription
    ? "no_subscription"
    : currentSubscription.status === "pending"
      ? "pending"
      : currentSubscription.status === "cancelled"
        ? "cancelled"
        : willStatus === "draft"
          ? "will_draft"
          : willStatus === "submitted" || willStatus === "under_review"
            ? "will_under_review"
            : willStatus === "approved"
              ? "will_approved"
              : willStatus === "rejected"
                ? "will_rejected"
                : null;

  const hasActiveSubscription = blockReason === null;

  if (loading) return null;

  return (
    <NewRequestClient
      hasActiveSubscription={hasActiveSubscription}
      blockReason={blockReason}
      existingWillId={willId}
    />
  );
}
