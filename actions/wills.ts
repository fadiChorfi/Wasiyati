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
    if (willType === "money" && testator) {
      const { error: finError } = await supabase
        .from("financial_status")
        .insert({
          testator_id: testator.id,
          number_of_children: formData.totalChildren || 0,
          boys: formData.maleChildren || 0,
          girls: formData.femaleChildren || 0,
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
