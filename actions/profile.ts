"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BasicProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
};

type UpdateProfilePayload = {
  full_name: string;
  phone: string;
  city: string;
  avatar_url: string;
};

export async function getCurrentUserBasicProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول" };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, city, avatar_url, role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return { success: false, error: "تعذر جلب بيانات الملف الشخصي" };
    }

    return { success: true, data: profile as BasicProfile };
  } catch (error) {
    console.error("getCurrentUserBasicProfile error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function updateCurrentUserBasicProfile(
  payload: UpdateProfilePayload,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول" };
    }

    const full_name = payload.full_name.trim();
    const phone = payload.phone.trim();
    const city = payload.city.trim();
    const avatar_url = payload.avatar_url.trim();

    if (!full_name) {
      return { success: false, error: "الاسم الكامل مطلوب" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        phone: phone || null,
        city: city || null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("updateCurrentUserBasicProfile error:", error);
      return { success: false, error: "فشل تحديث الملف الشخصي" };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("updateCurrentUserBasicProfile unexpected error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}
