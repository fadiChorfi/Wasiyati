"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ConsultationStatus = "pending" | "closed";

export type ConsultationRequestRow = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  message: string;
  status: ConsultationStatus;
  type: string | null;
  created_at: string;
  updated_at: string;
};

type SubmitConsultationPayload = {
  full_name: string;
  phone: string;
  message: string;
  type?: string;
};

async function isCurrentUserAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase, user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    isAdmin: profile?.role === "admin",
  };
}

export async function submitConsultationRequest(
  payload: SubmitConsultationPayload,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول لإرسال طلب الاستشارة" };
    }

    const full_name = payload.full_name.trim();
    const phone = payload.phone.trim();
    const message = payload.message.trim();

    if (!full_name || !phone || !message) {
      return { success: false, error: "يرجى تعبئة جميع الحقول المطلوبة" };
    }

    const { error } = await supabase.from("consultation_requests").insert({
      user_id: user.id,
      full_name,
      phone,
      email: user.email ?? null,
      message,
      status: "pending",
      type: payload.type || null,
    });

    if (error) {
      console.error("submitConsultationRequest error:", error);
      return { success: false, error: "فشل إرسال الطلب، حاول مرة أخرى" };
    }

    revalidatePath("/admin/dashboard/consultations");
    return { success: true };
  } catch (error) {
    console.error("submitConsultationRequest unexpected error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function getAdminConsultationRequests() {
  try {
    const { supabase, isAdmin } = await isCurrentUserAdmin();

    if (!isAdmin) {
      return { success: false, error: "غير مصرح لك بالوصول" };
    }

    const { data, error } = await supabase
      .from("consultation_requests")
      .select(
        "id, user_id, full_name, phone, email, message, status, type, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAdminConsultationRequests error:", error);
      return { success: false, error: "فشل جلب طلبات الاستشارة" };
    }

    return { success: true, data: (data ?? []) as ConsultationRequestRow[] };
  } catch (error) {
    console.error("getAdminConsultationRequests unexpected error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function updateConsultationRequestStatus(
  requestId: string,
  status: ConsultationStatus,
) {
  try {
    const { supabase, isAdmin } = await isCurrentUserAdmin();

    if (!isAdmin) {
      return { success: false, error: "غير مصرح لك بالوصول" };
    }

    const { error } = await supabase
      .from("consultation_requests")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      console.error("updateConsultationRequestStatus error:", error);
      return { success: false, error: "فشل تحديث حالة الطلب" };
    }

    revalidatePath("/admin/dashboard/consultations");
    return { success: true };
  } catch (error) {
    console.error("updateConsultationRequestStatus unexpected error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}
