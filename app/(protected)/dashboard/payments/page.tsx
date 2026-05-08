"use server";

import { getOffers } from "@/actions/offers";
import PaymentsClient from "./PaymentsClient";
import { OfferKey } from "@/config/offers";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const result = await getOffers();
  const dbOffers = result.error === null ? result.data! : [];

  const sp = await searchParams;
  const initialOfferKeyParams = (sp?.offer_key as string) || "medium";
  const initialOfferKey = initialOfferKeyParams as OfferKey;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasWill = false;

  if (user) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subscription) {
      const { data: will } = await supabase
        .from("wills")
        .select("id")
        .eq("subscription_id", subscription.id)
        .maybeSingle();

      hasWill = !!will;
    }
  }

  return (
    <PaymentsClient
      initialOfferKey={initialOfferKey}
      dbOffers={dbOffers}
      hasWill={hasWill}
    />
  );
}