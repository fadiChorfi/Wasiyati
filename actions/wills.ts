"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "./payement";
import { revalidatePath } from "next/cache";

export async function submitWill(payload: Record<string, unknown>) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول لتقديم الوصية" };
    }

    // 1. Check existing active subscription and valid offer BEFORE proceeding
    const subResult = await getUserSubscription();
    if (!subResult.success || !subResult.data) {
      return { success: false, error: "لم يتم العثور على اشتراك فعال." };
    }

    const sub = subResult.data;
    if (sub.status !== "active") {
      return {
        success: false,
        error: "اشتراكك ليس فعالاً حالياً أو انتهت صلاحيته.",
      };
    }

    const willType = payload.willType as string;
    const formData = payload as Record<string, unknown>;

    // Validate empty dates before sending to Postgres
    const parseDate = (val: unknown) =>
      typeof val === "string" && val.trim() !== "" ? val : null;

    // Save to the DB
    // Determine tier from offer, fallback to 'basic'
    const willTier =
      typeof sub.offer === "object" && sub.offer?.offer_key
        ? sub.offer.offer_key
        : "basic";

    const { data: newWill, error: insertError } = await supabase
      .from("wills")
      .insert({
        user_id: user.id,
        subscription_id: sub.id,
        will_type: willTier,
        will_category: willType,
        status: "submitted",
        subject_of_will: formData.willBody || null,
      })
      .select()
      .single();

    if (insertError || !newWill) {
      console.error(insertError);
      return { success: false, error: "فشل حفظ الوصية، يرجى المحاولة لاحقاً." };
    }

    // Insert Testator
    const { data: testator, error: testatorError } = await supabase
      .from("testators")
      .insert({
        will_id: newWill.id,
        last_name: formData.testatorSurnam,
        first_name: formData.testatorName,
        birth_date: parseDate(formData.testatorDob),
        birth_place: formData.testatorPob,
        profession: formData.testatorJob,
        residence_place: formData.testatorRes,
        national_id: formData.testatorNin,
        id_issue_date: parseDate(formData.testatorIDDate),
        id_issue_place: formData.testatorIDPlace,
      })
      .select()
      .single();

    if (testatorError) {
      console.error("Testator insert error:", testatorError);
      throw testatorError;
    }

    // Insert Beneficiary
    const { error: benError } = await supabase
      .from("will_beneficiaries")
      .insert({
        will_id: newWill.id,
        full_name: `${formData.beneficiaryName} ${formData.beneficiarySurname}`,
        relationship: "غير محدد",
        last_name: formData.beneficiarySurname,
        birth_date: parseDate(formData.beneficiaryDob),
        birth_place: formData.beneficiaryPob,
        residence_place: formData.beneficiaryRes,
      });

    if (benError) {
      console.error("Beneficiary insert error:", benError);
      throw benError;
    }

    // Insert Witnesses
    const w1Name =
      typeof formData.witness1 === "string"
        ? formData.witness1.split(" ")
        : ["", ""];
    const w2Name =
      typeof formData.witness2 === "string"
        ? formData.witness2.split(" ")
        : ["", ""];
    const { error: witError } = await supabase.from("witnesses").insert([
      {
        will_id: newWill.id,
        witness_number: 1,
        first_name: w1Name[0] || "غير محدد",
        last_name: w1Name.slice(1).join(" ") || "غير محدد",
      },
      {
        will_id: newWill.id,
        witness_number: 2,
        first_name: w2Name[0] || "غير محدد",
        last_name: w2Name.slice(1).join(" ") || "غير محدد",
      },
    ]);

    if (witError) {
      console.error("Witnesses insert error:", witError);
      throw witError;
    }

    // Financial Status
    if ((willType === "money" || willType === "general") && testator) {
      const { error: finError } = await supabase
        .from("financial_status")
        .insert({
          testator_id: testator.id,
          number_of_children: formData.totalChildren || 0,
          boys: formData.maleChildren || 0,
          girls: formData.femaleChildren || 0,
          total_money: formData.totalMoney || null,
        });
      if (finError) {
        console.error("Financial status insert error:", finError);
        throw finError;
      }
    }

    // Detail tables (to prevent UI crashes since these might be required)
    const detailsPayload = {
      will_id: newWill.id,
      executor_name: formData.testatorName || "نفسه",
    };

    let detError = null;
    if (willTier === "basic") {
      const res = await supabase
        .from("will_basic_details")
        .insert(detailsPayload);
      detError = res.error;
    } else if (willTier === "medium") {
      const res = await supabase
        .from("will_medium_details")
        .insert(detailsPayload);
      detError = res.error;
    } else if (willTier === "pro") {
      const res = await supabase
        .from("will_pro_details")
        .insert(detailsPayload);
      detError = res.error;
    }

    if (detError) {
      console.error("Details insert error:", detError);
      throw detError;
    }

    revalidatePath("/dashboard/wills");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء معالجة طلبك." };
  }
}

export async function getUserWills() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: wills, error } = await supabase
      .from("wills")
      .select(
        `
        *,
        testator:testators(first_name, last_name)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch wills" };
    }

    return { success: true, data: wills };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Unexpected error" };
  }
}

export async function getUserWillById(willId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: will, error } = await supabase
      .from("wills")
      .select(
        `
        *,
        testators (
          id,
          first_name,
          last_name,
          birth_date,
          birth_place,
          profession,
          residence_place,
          national_id,
          id_issue_date,
          id_issue_place,
          financial_status (
            id,
            number_of_children,
            boys,
            girls,
            total_money
          )
        ),
        will_beneficiaries (
          id,
          full_name,
          last_name,
          relationship,
          birth_date,
          birth_place,
          residence_place,
          share_percentage
        ),
        witnesses (
          id,
          witness_number,
          first_name,
          last_name
        )
      `,
      )
      .eq("id", willId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user will:", error);
      return { success: false, error: "Failed to fetch will" };
    }

    if (!will) {
      return { success: false, error: "Will not found" };
    }

    type FinancialStatusRow = {
      id: string;
      number_of_children: number | null;
      boys: number | null;
      girls: number | null;
      total_money: number | null;
    };

    type TestatorRow = {
      id: string;
      financial_status?: FinancialStatusRow[] | null;
      [key: string]: unknown;
    };

    type WillWithRelations = typeof will & {
      testator?: TestatorRow | null;
      testators?: TestatorRow[] | null;
    };

    const willWithRelations = will as WillWithRelations;

    // Some setups / RLS policies can cause joined relations to come back empty.
    // Fallback: fetch the 1-1 testator + financial_status directly.
    const hasTestatorJoin =
      Array.isArray(willWithRelations.testators) &&
      willWithRelations.testators.length > 0;

    if (!hasTestatorJoin) {
      const { data: testator, error: testatorError } = await supabase
        .from("testators")
        .select(
          `
          id,
          first_name,
          last_name,
          birth_date,
          birth_place,
          profession,
          residence_place,
          national_id,
          id_issue_date,
          id_issue_place,
          financial_status (
            id,
            number_of_children,
            boys,
            girls,
            total_money
          )
        `,
        )
        .eq("will_id", willId)
        .maybeSingle();

      if (testatorError) {
        console.error("Error fetching testator fallback:", testatorError);
      } else if (testator) {
        const typedTestator = testator as TestatorRow;
        willWithRelations.testator = typedTestator;
        willWithRelations.testators = [typedTestator];
      }
    }

    // Ensure financial_status is present even if nested join is empty.
    const resolvedTestator =
      willWithRelations.testator ??
      (Array.isArray(willWithRelations.testators)
        ? willWithRelations.testators[0]
        : null);

    const hasFinancialJoin =
      Array.isArray(resolvedTestator?.financial_status) &&
      resolvedTestator.financial_status.length > 0;

    if (resolvedTestator?.id && !hasFinancialJoin) {
      const { data: financialStatus, error: financialError } = await supabase
        .from("financial_status")
        .select("id, number_of_children, boys, girls, total_money")
        .eq("testator_id", resolvedTestator.id)
        .maybeSingle();

      if (financialError) {
        console.error("Error fetching financial_status fallback:", financialError);
      } else if (financialStatus) {
        resolvedTestator.financial_status = [financialStatus];
        willWithRelations.testator = resolvedTestator;
        willWithRelations.testators = [resolvedTestator];
      }
    }

    return { success: true, data: will };
  } catch (error) {
    console.error("Get user will error:", error);
    return { success: false, error: "Unexpected error" };
  }
}

export async function updateUserWill(
  willId: string,
  payload: Record<string, unknown>,
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول لتعديل الوصية" };
    }

    const parseDate = (val: unknown) =>
      typeof val === "string" && val.trim() !== "" ? val : null;

    const { data: will, error: willError } = await supabase
      .from("wills")
      .select("id, user_id, will_category, status")
      .eq("id", willId)
      .single();

    if (willError || !will) {
      console.error("Will fetch for update error:", willError);
      return { success: false, error: "تعذر العثور على الوصية" };
    }

    if (will.user_id !== user.id) {
      return { success: false, error: "غير مصرح لك بتعديل هذه الوصية" };
    }

    // Update main will row (resubmission)
    const { error: willUpdateError } = await supabase
      .from("wills")
      .update({
        subject_of_will: (payload.willBody as string) || null,
        status: "submitted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", willId);

    if (willUpdateError) {
      console.error("Will update error:", willUpdateError);
      return { success: false, error: "فشل تحديث بيانات الوصية" };
    }

    // Testator
    const { data: existingTestator, error: testatorFetchError } = await supabase
      .from("testators")
      .select("id")
      .eq("will_id", willId)
      .maybeSingle();

    if (testatorFetchError) {
      console.error("Testator fetch error:", testatorFetchError);
      return { success: false, error: "فشل تحميل بيانات الموصي" };
    }

    const testatorPayload = {
      will_id: willId,
      last_name: payload.testatorSurnam as string,
      first_name: payload.testatorName as string,
      birth_date: parseDate(payload.testatorDob),
      birth_place: (payload.testatorPob as string) || null,
      profession: (payload.testatorJob as string) || null,
      residence_place: (payload.testatorRes as string) || null,
      national_id: (payload.testatorNin as string) || null,
      id_issue_date: parseDate(payload.testatorIDDate),
      id_issue_place: (payload.testatorIDPlace as string) || null,
    };

    let testatorId: string | null = null;
    if (existingTestator?.id) {
      testatorId = existingTestator.id;
      const { error } = await supabase
        .from("testators")
        .update(testatorPayload)
        .eq("id", existingTestator.id);
      if (error) {
        console.error("Testator update error:", error);
        return { success: false, error: "فشل تحديث بيانات الموصي" };
      }
    } else {
      const { data, error } = await supabase
        .from("testators")
        .insert(testatorPayload)
        .select("id")
        .single();
      if (error || !data) {
        console.error("Testator insert error:", error);
        return { success: false, error: "فشل تحديث بيانات الموصي" };
      }
      testatorId = data.id;
    }

    // Beneficiary (first/primary beneficiary)
    const { data: existingBeneficiary, error: benFetchError } = await supabase
      .from("will_beneficiaries")
      .select("id, relationship, share_percentage")
      .eq("will_id", willId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (benFetchError) {
      console.error("Beneficiary fetch error:", benFetchError);
      return { success: false, error: "فشل تحميل بيانات الموصى له" };
    }

    const beneficiaryPayload = {
      will_id: willId,
      full_name: `${(payload.beneficiaryName as string) || ""} ${(payload.beneficiarySurname as string) || ""}`.trim(),
      last_name: payload.beneficiarySurname as string,
      birth_date: parseDate(payload.beneficiaryDob),
      birth_place: (payload.beneficiaryPob as string) || null,
      residence_place: (payload.beneficiaryRes as string) || null,
      relationship:
        typeof existingBeneficiary?.relationship === "string" &&
        existingBeneficiary.relationship.trim() !== ""
          ? existingBeneficiary.relationship
          : "غير محدد",
    };

    if (existingBeneficiary?.id) {
      const { error } = await supabase
        .from("will_beneficiaries")
        .update(beneficiaryPayload)
        .eq("id", existingBeneficiary.id);
      if (error) {
        console.error("Beneficiary update error:", error);
        return { success: false, error: "فشل تحديث بيانات الموصى له" };
      }
    } else {
      const { error } = await supabase
        .from("will_beneficiaries")
        .insert(beneficiaryPayload);
      if (error) {
        console.error("Beneficiary insert error:", error);
        return { success: false, error: "فشل تحديث بيانات الموصى له" };
      }
    }

    // Witnesses (by witness_number)
    const witnessesToUpsert = [
      {
        will_id: willId,
        witness_number: 1,
        first_name:
          typeof payload.witness1 === "string"
            ? payload.witness1.split(" ")[0] || "غير محدد"
            : "غير محدد",
        last_name:
          typeof payload.witness1 === "string"
            ? payload.witness1.split(" ").slice(1).join(" ") || "غير محدد"
            : "غير محدد",
      },
      {
        will_id: willId,
        witness_number: 2,
        first_name:
          typeof payload.witness2 === "string"
            ? payload.witness2.split(" ")[0] || "غير محدد"
            : "غير محدد",
        last_name:
          typeof payload.witness2 === "string"
            ? payload.witness2.split(" ").slice(1).join(" ") || "غير محدد"
            : "غير محدد",
      },
    ];

    const { error: witnessUpsertError } = await supabase
      .from("witnesses")
      .upsert(witnessesToUpsert, { onConflict: "will_id,witness_number" });

    if (witnessUpsertError) {
      console.error("Witnesses upsert error:", witnessUpsertError);
      return { success: false, error: "فشل تحديث بيانات الشهود" };
    }

    // Financial status (optional, only if provided)
    const shouldUpdateFinancial =
      payload.totalChildren !== undefined ||
      payload.maleChildren !== undefined ||
      payload.femaleChildren !== undefined ||
      payload.totalMoney !== undefined;

    if (shouldUpdateFinancial && testatorId) {
      const finPayload = {
        testator_id: testatorId,
        number_of_children: (payload.totalChildren as number) || 0,
        boys: (payload.maleChildren as number) || 0,
        girls: (payload.femaleChildren as number) || 0,
        total_money:
          payload.totalMoney === undefined || payload.totalMoney === null
            ? null
            : (payload.totalMoney as number),
      };

      const { error: finUpsertError } = await supabase
        .from("financial_status")
        .upsert(finPayload, { onConflict: "testator_id" });

      if (finUpsertError) {
        console.error("Financial status upsert error:", finUpsertError);
        return { success: false, error: "فشل تحديث الذمة المالية" };
      }
    }

    revalidatePath(`/dashboard/wills/${willId}`);
    revalidatePath("/dashboard/wills");
    return { success: true };
  } catch (error) {
    console.error("Update will error:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء تعديل الوصية." };
  }
}

export interface AdminDashboardData {
  stats: {
    usersCount: number;
    underReviewWillsCount: number;
    approvedWillsCount: number;
    totalWillsCount: number;
  };
  recentUsers: {
    name: string;
    email: string;
    date: string;
  }[];
  recentActivity: {
    user: string;
    action: string;
    status: string;
    time: string;
  }[];
}

export async function getAdminWills() {
  try {
    const supabase = await createClient();

    // Check if user is admin
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

    // Fetch all wills with related data
    const { data: wills, error } = await supabase
      .from("wills")
      .select(
        `
        *,
        profiles!wills_user_id_fkey (
          id,
          full_name,
          phone,
          city,
          role,
          updated_at
        ),
        testators (
          id,
          first_name,
          last_name,
          birth_date,
          birth_place,
          profession,
          residence_place,
          national_id,
          id_issue_date,
          id_issue_place,
          financial_status (
            id,
            number_of_children,
            boys,
            girls,
            total_money
          )
        ),
        will_beneficiaries (
          id,
          full_name,
          last_name,
          relationship,
          birth_date,
          birth_place,
          residence_place,
          share_percentage
        ),
        witnesses (
          id,
          witness_number,
          first_name,
          last_name
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin wills:", error);
      return { success: false, error: "فشل جلب بيانات الوصايا" };
    }

    return { success: true, data: wills };
  } catch (error) {
    console.error("Admin wills error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function getAdminWillById(willId: string) {
  try {
    const supabase = await createClient();

    // Check if user is admin
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

    // Fetch specific will with all related data
    const { data: will, error } = await supabase
      .from("wills")
      .select(
        `
        *,
        profiles!wills_user_id_fkey (
          id,
          full_name,
          phone,
          city,
          role,
          updated_at
        ),
        testators (
          id,
          first_name,
          last_name,
          birth_date,
          birth_place,
          profession,
          residence_place,
          national_id,
          id_issue_date,
          id_issue_place,
          financial_status (
            id,
            number_of_children,
            boys,
            girls,
            total_money
          )
        ),
        will_beneficiaries (
          id,
          full_name,
          last_name,
          relationship,
          birth_date,
          birth_place,
          residence_place,
          share_percentage
        ),
        witnesses (
          id,
          witness_number,
          first_name,
          last_name
        )
      `,
      )
      .eq("id", willId)
      .single();

    if (error) {
      console.error("Error fetching admin will:", error);
      return { success: false, error: "فشل جلب بيانات الوصية" };
    }

    if (!will) {
      return { success: false, error: "لم يتم العثور على الوصية" };
    }

    return { success: true, data: will };
  } catch (error) {
    console.error("Admin will error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function updateWillStatus(
  willId: string,
  status: string,
  adminNotes?: string,
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "غير مصرح لك بالوصول" };
    }

    // Update will status
    const { data: updatedWill, error } = await supabase
      .from("wills")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", willId)
      .select()
      .single();

    if (error) {
      console.error("Error updating will status:", error);
      return { success: false, error: "فشل تحديث حالة الوصية" };
    }

    if (adminNotes) {
      const { error: notesError } = await supabase
        .from("will_admin_notes")
        .insert({
          will_id: willId,
          admin_id: user.id,
          notes: adminNotes,
        });

      if (notesError) {
        console.error("Error adding admin notes:", notesError);
        // Don't fail the whole operation if notes fail
      }
    }

    return { success: true, data: updatedWill };
  } catch (error) {
    console.error("Update will status error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function getAdminUsers() {
  try {
    const supabase = await createClient();

    // Check if user is admin
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

    // Fetch all users with basic data first
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin users:", error);
      return { success: false, error: "فشل جلب بيانات المستخدمين" };
    }

    return { success: true, data: users };
  } catch (error) {
    console.error("Admin users error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function getAdminUserById(userId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "يجب تسجيل الدخول" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return { success: false, error: "غير مصرح لك بالوصول" };

    // 1️⃣ Fetch profile + wills (no offers join)
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select(`
        *,
        subscriptions (
          id,
          status,
          started_at,
          expires_at,
          created_at,
          receipt_url,
          receipt_path,
          offer_id
        ),
        wills (
          id,
          status,
          will_type,
          will_category,
          subject_of_will,
          created_at,
          updated_at,
          testators (
            id,
            first_name,
            last_name,
            birth_date,
            birth_place,
            profession,
            residence_place
          ),
          will_beneficiaries (
            id,
            full_name,
            relationship,
            birth_date,
            birth_place,
            residence_place,
            share_percentage
          ),
          witnesses (
            id,
            witness_number,
            first_name,
            last_name
          )
        )
      `)
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching admin user:", error);
      return { success: false, error: "فشل جلب بيانات المستخدم" };
    }

    if (!userProfile) return { success: false, error: "لم يتم العثور على المستخدم" };

    // 2️⃣ Fetch offers separately for each subscription
    const offerIds = userProfile.subscriptions
      ?.map((s: { offer_id: string }) => s.offer_id)
      .filter(Boolean) ?? [];

    let offersMap: Record<string, unknown> = {};

    if (offerIds.length > 0) {
      const { data: offers } = await supabase
        .from("offers")
        .select(`
          id,
          offer_key,
          name_ar,
          price_dzd,
          tier_rank,
          has_legal_will_creation,
          has_approved_template,
          has_secure_digital_storage,
          has_edit_later,
          has_heir_notification
        `)
        .in("id", offerIds);

      offersMap = Object.fromEntries((offers ?? []).map((o) => [o.id, o]));
    }

    // 3️⃣ Merge offers into subscriptions
    const enrichedProfile = {
      ...userProfile,
      subscriptions: userProfile.subscriptions?.map((sub: { offer_id: string }) => ({
        ...sub,
        offers: offersMap[sub.offer_id] ?? null,
      })),
    };

    return { success: true, data: enrichedProfile };
  } catch (error) {
    console.error("Admin user error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const supabase = await createClient();

    // Check if user is admin
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

    // Update user role
    const { data: updatedUser, error } = await supabase
      .from("profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: "فشل تحديث دور المستخدم" };
    }

    revalidatePath("/admin/dashboard/users");
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Update user role error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function getAdminDashboardData() {
  try {
    const supabase = await createClient();

    // 1. Check if user is admin
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

    // 2. Fetch stats
    const [
      { count: usersCount },
      { count: underReviewWillsCount },
      { count: approvedWillsCount },
      { count: totalWillsCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("wills")
        .select("*", { count: "exact", head: true })
        .in("status", ["submitted", "under_review"]),
      supabase
        .from("wills")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase.from("wills").select("*", { count: "exact", head: true }),
    ]);

    // 3. Fetch recent users
    const { data: recentUsersData } = await supabase
      .from("profiles")
      .select("id, full_name, phone, updated_at")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(5);

    // 4. Fetch recent activity (wills updates)
    const { data: recentWills } = await supabase
      .from("wills")
      .select(
        `
        id,
        will_category,
        status,
        updated_at,
        profiles!wills_user_id_fkey  (full_name)
      `,
      )
      .order("updated_at", { ascending: false })
      .limit(5);

    // Format Data
    const formattedUsers = (recentUsersData || []).map((u) => ({
      name: u.full_name || "مستخدم",
      email: "",
      date: u.updated_at
        ? new Date(u.updated_at).toLocaleDateString("ar-EG", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "غير متوفر",
    }));

    const formattedActivity = (recentWills || []).map((w) => {
      let action = "تحديث وصية";
      if (w.will_category === "general") action = "تقديم وصية عامة";
      if (w.will_category === "financial") action = "تقديم وصية مالية";
      if (w.will_category === "business") action = "تقديم وصية أعمال";

      let statusLabel = w.status;
      if (w.status === "approved") statusLabel = "مكتملة";
      if (w.status === "under_review") statusLabel = "قيد المراجعة";
      if (w.status === "draft") statusLabel = "مسودة";

      return {
        user:
          (Array.isArray(w.profiles)
            ? w.profiles[0]?.full_name
            : (w.profiles as { full_name?: string } | null)?.full_name) ||
          "مستخدم",
        action,
        status: statusLabel,
        time: new Date(w.updated_at).toLocaleDateString("ar-EG", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    return {
      success: true,
      data: {
        stats: {
          usersCount: usersCount || 0,
          underReviewWillsCount: underReviewWillsCount || 0,
          approvedWillsCount: approvedWillsCount || 0,
          totalWillsCount: totalWillsCount || 0,
        },
        recentUsers: formattedUsers,
        recentActivity: formattedActivity,
      },
    };
  } catch (error) {
    console.error("Dashboard data error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}
