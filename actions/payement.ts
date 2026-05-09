"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function deleteWillCascadeForOwner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  willId: string,
  ownerUserId: string,
) {
  const { data: will, error: willError } = await supabase
    .from("wills")
    .select("id, user_id")
    .eq("id", willId)
    .maybeSingle();

  if (willError) throw willError;
  if (!will || will.user_id !== ownerUserId) return;

  const { data: testators, error: testatorsError } = await supabase
    .from("testators")
    .select("id")
    .eq("will_id", willId);

  if (testatorsError) throw testatorsError;

  const testatorIds = (testators ?? []).map((t) => t.id);
  if (testatorIds.length > 0) {
    const { error: financialDeleteError } = await supabase
      .from("financial_status")
      .delete()
      .in("testator_id", testatorIds);
    if (financialDeleteError) throw financialDeleteError;
  }

  const deleteByWillId = async (table: string) => {
    const { error } = await supabase.from(table).delete().eq("will_id", willId);
    if (error) throw error;
  };

  await deleteByWillId("notifications");
  await deleteByWillId("will_submissions");
  await deleteByWillId("will_deliveries");
  await deleteByWillId("will_beneficiaries");
  await deleteByWillId("witnesses");
  await deleteByWillId("will_basic_details");
  await deleteByWillId("will_medium_details");
  await deleteByWillId("will_pro_details");
  await deleteByWillId("testators");

  const { error: willDeleteError } = await supabase
    .from("wills")
    .delete()
    .eq("id", willId)
    .eq("user_id", ownerUserId);

  if (willDeleteError) throw willDeleteError;
}

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
    // 1. Check current open subscriptions (active/pending) and auto-clean consumed actives
    const { data: openSubscriptions, error: openSubsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["active", "pending"])
      .order("created_at", { ascending: false });

    if (openSubsError) throw openSubsError;

    if (openSubscriptions && openSubscriptions.length > 0) {
      for (const existing of openSubscriptions) {
        if (existing.status === "pending") {
          return {
            success: true,
            data: existing,
            isNew: false,
            blockReason: "pending_existing",
          };
        }

        if (existing.status === "active") {
          const { data: existingWillRows, error: existingWillError } =
            await supabase
              .from("wills")
              .select("id")
              .eq("subscription_id", existing.id)
              .limit(1);

          if (existingWillError) throw existingWillError;

          // Legacy cleanup: active sub already consumed by a will -> expire it and continue.
          if (existingWillRows && existingWillRows.length > 0) {
            const { error: expireError } = await supabase
              .from("subscriptions")
              .update({
                status: "expired",
                expires_at: new Date().toISOString(),
              })
              .eq("id", existing.id);

            if (expireError) throw expireError;
            continue;
          }

          return {
            success: true,
            data: existing,
            isNew: false,
            blockReason: "active_existing",
          };
        }
      }
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

    // Notify admins about new subscription submission (same pattern as will submission)
    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (adminProfiles && adminProfiles.length > 0) {
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert(
          adminProfiles.map((admin) => ({
            user_id: admin.id,
            type: "submission_received" as const,
            title_ar: "طلب اشتراك جديد",
            message_ar: "تم إرسال طلب اشتراك جديد من أحد العملاء وبانتظار المراجعة.",
            subscription_id: newSubscription.id,
            is_read: false,
          })),
        );

      if (notificationError) {
        console.error(
          "Subscription admin notification insert error:",
          notificationError,
        );
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

export async function deleteUserSubscriptionWithWills(subscriptionId: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("id, user_id, receipt_path")
      .eq("id", subscriptionId)
      .maybeSingle();

    if (subscriptionError) throw subscriptionError;

    if (!subscription || subscription.user_id !== user.id) {
      return { success: false, error: "Subscription not found" };
    }

    const { data: wills, error: willsError } = await supabase
      .from("wills")
      .select("id")
      .eq("subscription_id", subscriptionId)
      .eq("user_id", user.id);

    if (willsError) throw willsError;

    for (const will of wills ?? []) {
      await deleteWillCascadeForOwner(supabase, will.id, user.id);
    }

    const { error: subNotificationsDeleteError } = await supabase
      .from("notifications")
      .delete()
      .eq("subscription_id", subscriptionId);

    if (subNotificationsDeleteError) throw subNotificationsDeleteError;

    const { error: subscriptionDeleteError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", subscriptionId)
      .eq("user_id", user.id);

    if (subscriptionDeleteError) throw subscriptionDeleteError;

    if (subscription.receipt_path) {
      const { error: storageDeleteError } = await supabase.storage
        .from("payement_receipts")
        .remove([subscription.receipt_path]);

      if (storageDeleteError) {
        console.error("Receipt storage delete warning:", storageDeleteError);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/wills");
    revalidatePath("/admin/dashboard/subscriptions");
    revalidatePath("/admin/dashboard/wills");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete subscription and wills";
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
  status: "active" | "cancelled" | "pending",
  adminComment?: string,
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "غير مصرح لك بالوصول" };
    }

    const updateData: {
      status: "active" | "cancelled" | "pending";
      started_at?: string | null;
      expires_at?: string | null;
    } = { status };

    if (status === "active") {
      updateData.started_at = new Date().toISOString();
    }

    if (status === "cancelled") {
      updateData.expires_at = new Date().toISOString();
    }

    const { data: updatedSubscription, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subId)
      .select("id, user_id")
      .single();

    if (error) throw error;

    // Notify subscriber about admin decision
    if (updatedSubscription?.user_id) {
      const title =
        status === "active" ? "تم قبول اشتراكك" : "تم رفض طلب الاشتراك";
      const message =
        status === "active"
          ? "تمت مراجعة إيصال الدفع وتفعيل اشتراكك بنجاح."
          : adminComment?.trim() ||
            "تم رفض طلب الاشتراك. يرجى التواصل مع الدعم أو إعادة الإرسال.";

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: updatedSubscription.user_id,
          type: "submission_received",
          title_ar: title,
          message_ar: message,
          subscription_id: subId,
          is_read: false,
        });

      if (notificationError) {
        console.error(
          "Subscription status notification insert error:",
          notificationError,
        );
      }
    }

    revalidatePath("/admin/dashboard/subscriptions");
    revalidatePath(`/admin/dashboard/subscriptions/${subId}`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update subscription";
    return { success: false, error: message };
  }
}
