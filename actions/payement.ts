"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitPayment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Unauthorized" };

  const offerId = formData.get("offer_id") as string;
  const receiptFile = formData.get("receipt") as File;

  if (!offerId || !receiptFile) {
    return { success: false, error: "Missing offer or receipt" };
  }

  try {
    // 1. check for existing active subscription
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["active", "pending"]) // ← also block pending
      .maybeSingle();

    if (existing) {
      return { success: true, data: existing, isNew: false };
    }

    // 2. upload receipt to storage
    const ext = receiptFile.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payement_receipts")
      .upload(path, receiptFile);

    if (uploadError) throw uploadError;

    // 3. get signed URL (1 year — admin uses this to view the receipt)
    const { data: signedUrlData, error: signUrlError } = await supabase.storage
      .from("payement_receipts")
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    if (signUrlError || !signedUrlData)
      throw signUrlError || new Error("Failed to create signed URL");
    const signedUrl = signedUrlData.signedUrl;

    // 4. create pending subscription
    const { data: newSubscription, error: insertError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        offer_id: offerId,
        status: "pending",
        receipt_path: path,
        receipt_url: signedUrl,
      })
      .select("*")
      .single();

    if (insertError) throw insertError;

    // Attach offer manually to avoid join errors
    if (newSubscription && newSubscription.offer_id) {
      const { data: offerData } = await supabase
        .from("offers")
        .select("*")
        .eq("id", newSubscription.offer_id)
        .single();

      if (offerData) {
        newSubscription.offer = offerData;
      }
    }
    revalidatePath("/dashboard");
    return { success: true, data: newSubscription, isNew: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process payment";
    return { success: false, error: message };
  }
}

export async function getUserSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error fetching subscription:", error);
      throw error;
    }

    if (subscription && subscription.offer_id) {
      const { data: offerData } = await supabase
        .from("offers")
        .select("*")
        .eq("id", subscription.offer_id)
        .single();

      if (offerData) {
        subscription.offer = offerData;
      }
    }

    console.log("Fetched subscription:", subscription);

    return { success: true, data: subscription };
  } catch (error: unknown) {
    console.error("🚨 catch block in getUserSubscription:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch subscription";
    return { success: false, error: message };
  }
}

// --- ADMIN ACTIONS ---

export async function getAdminSubscriptions() {
  const supabase = await createClient();

  try {
    // Fetch all subscriptions
    const { data: subsData, error: subsError } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (subsError) throw subsError;
    if (!subsData) return { success: true, data: [] };

    const userIds = [
      ...new Set(subsData.map((sub) => sub.user_id).filter(Boolean)),
    ];
    const offerIds = [
      ...new Set(subsData.map((sub) => sub.offer_id).filter(Boolean)),
    ];

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds);

    const { data: offersData } = await supabase
      .from("offers")
      .select("id, name_ar, price_dzd")
      .in("id", offerIds);

    const data = subsData.map((sub) => {
      const profile = profilesData?.find((p) => p.id === sub.user_id) || null;
      const offer = offersData?.find((o) => o.id === sub.offer_id) || null;

      return {
        ...sub,
        profiles: profile
          ? {
              full_name_ar: profile.full_name,
              full_name_en: profile.full_name,
              phone: profile.phone,
            }
          : null,
        offers: offer
          ? {
              title: offer.name_ar,
              price: offer.price_dzd,
            }
          : null,
      };
    });

    return { success: true, data };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch subscriptions";
    return { success: false, error: message };
  }
}

export async function getAdminSubscriptionById(subId: string) {
  const supabase = await createClient();

  try {
    const { data: subData, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subId)
      .single();

    if (subError) throw subError;

    let profileData = null;
    if (subData.user_id) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("id", subData.user_id)
        .single();
      profileData = data;
    }

    let offerData = null;
    if (subData.offer_id) {
      const { data } = await supabase
        .from("offers")
        .select("id, name_ar, price_dzd")
        .eq("id", subData.offer_id)
        .single();
      offerData = data;
    }

    const data = {
      ...subData,
      profiles: profileData
        ? {
            full_name_ar: profileData.full_name,
            full_name_en: profileData.full_name,
            phone: profileData.phone,
          }
        : null,
      offers: offerData
        ? {
            title: offerData.name_ar,
            price: offerData.price_dzd,
            description: "", // Add this field if it exists in DB, else empty string
          }
        : null,
    };

    return { success: true, data };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch subscription";
    return { success: false, error: message };
  }
}

export async function updateSubscriptionStatusAdmin(
  subId: string,
  status: "active" | "rejected" | "pending",
  adminComment?: string,
) {
  const supabase = await createClient();

  try {
    const updateData: Record<string, string> = { status };
    if (adminComment !== undefined) {
      updateData.admin_comment = adminComment;
    }

    const { error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subId);

    if (error) throw error;

    revalidatePath("/admin/dashboard/subscriptions");
    revalidatePath(`/admin/dashboard/subscriptions/${subId}`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update subscription";
    return { success: false, error: message };
  }
}
