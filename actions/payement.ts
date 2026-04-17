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
      .select()
      .single();

    if (insertError) throw insertError;

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

    if (error) throw error;
    console.log("Fetched subscription:", subscription);

    return { success: true, data: subscription };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch subscription";
    return { success: false, error: message };
  }
}
