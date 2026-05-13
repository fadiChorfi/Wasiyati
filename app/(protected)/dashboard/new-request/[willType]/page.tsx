"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useSubscription } from "@/context/SubscriptionContext";

// Define the full schema
const willSchema = z
  .object({
    // Step 1: Testator
    testatorSurnam: z.string().min(2, "اللقب مطلوب"),
    testatorName: z.string().min(2, "الاسم مطلوب"),
    testatorDob: z.string().min(1, "تاريخ الميلاد مطلوب"),
    testatorPob: z.string().min(2, "مكان الميلاد مطلوب"),
    testatorJob: z.string().min(2, "المهنة مطلوبة"),
    testatorRes: z.string().min(2, "مكان الإقامة مطلوب"),
    testatorNin: z
      .string()
      .length(18, "رقم التعريف الوطني يجب أن يكون 18 رقماً"),
    testatorIDDate: z.string().min(1, "تاريخ الإصدار مطلوب"),
    testatorIDPlace: z.string().min(2, "مكان الإصدار مطلوب"),

    // Step 2: Beneficiary
    beneficiarySurname: z.string().min(2, "اللقب مطلوب"),
    beneficiaryName: z.string().min(2, "الاسم مطلوب"),
    beneficiaryDob: z.string().min(1, "تاريخ الميلاد مطلوب"),
    beneficiaryPob: z.string().min(2, "مكان الميلاد مطلوب"),
    beneficiaryRes: z.string().min(2, "مكان الإقامة مطلوب"),

    // Step 3: Body
    willBody: z.string().min(50, "موضوع الوصية يجب أن يكون 50 حرفاً على الأقل"),

    // Step 4: Witnesses
    witness1: z.string().min(4, "لقب واسم الشاهد الأول مطلوب"),
    witness2: z.string().min(4, "لقب واسم الشاهد الثاني مطلوب"),

    // Step 5: Financial (Optional/Conditional)
    totalChildren: z.number().int().min(0).optional(),
    maleChildren: z.number().int().min(0).optional(),
    femaleChildren: z.number().int().min(0).optional(),
    totalMoney: z
      .number()
      .min(0, "المبلغ الإجمالي يجب أن يكون موجباً")
      .optional(),

    // Step: Delivery (Pro only)
    trustee_name: z.string().optional(),
    trustee_email: z.string().optional(),
    trustee_phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate total children if not null
    if (data.totalChildren !== undefined) {
      const total = (data.maleChildren || 0) + (data.femaleChildren || 0);
      if (total !== data.totalChildren) {
        ctx.addIssue({
          code: "custom",
          message: "مجموع الذكور والإناث لا يساوي عدد الأبناء الإجمالي",
          path: ["totalChildren"],
        });
      }
    }
  });

type WillFormData = z.infer<typeof willSchema>;

export default function WillFormByType() {
  const currentSubscription = useSubscription();
  const params = useParams<{ willType: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const willTypeParam = params.willType;
  const willId = searchParams.get("willId");
  const stepParam = searchParams.get("step");
  const requestedStep = stepParam !== null ? Number(stepParam) : Number.NaN;
  const maxInitialStep =
    willTypeParam === "money" || willTypeParam === "general" ? 4 : 3;
  const initialStep = Number.isFinite(requestedStep)
    ? Math.min(Math.max(0, Math.trunc(requestedStep)), maxInitialStep)
    : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [reviewIssue, setReviewIssue] = useState<{
    errorStep: number | null;
    adminNote: string | null;
  } | null>(null);

  const {
    register,
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<WillFormData>({
    resolver: zodResolver(willSchema),
    mode: "onTouched",
    defaultValues: {
      totalChildren:
        willTypeParam === "money" || willTypeParam === "general"
          ? 0
          : undefined,
      maleChildren:
        willTypeParam === "money" || willTypeParam === "general"
          ? 0
          : undefined,
      femaleChildren:
        willTypeParam === "money" || willTypeParam === "general"
          ? 0
          : undefined,
      totalMoney:
        willTypeParam === "money" || willTypeParam === "general"
          ? 0
          : undefined,
    },
  });

  useEffect(() => {
    const guardRouteAccess = async () => {
      try {
        // Editing an existing will is allowed from the will details flow.
        if (willId) {
          setCanAccess(true);
          return;
        }

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/");
          return;
        }

        const { data: latestSubscription } = await supabase
          .from("subscriptions")
          .select("id, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // No latest active sub => go back to the guarded selector page.
        if (!latestSubscription || latestSubscription.status !== "active") {
          router.replace("/dashboard/new-request");
          return;
        }

        // Active sub already consumed by a will => block direct route access.
        const { data: existingWillRows } = await supabase
          .from("wills")
          .select("id")
          .eq("subscription_id", latestSubscription.id)
          .limit(1);

        if (existingWillRows && existingWillRows.length > 0) {
          router.replace("/dashboard/new-request");
          return;
        }

        setCanAccess(true);
      } finally {
        setAccessChecked(true);
      }
    };

    void guardRouteAccess();
  }, [router, willId]);

  useEffect(() => {
    const load = async () => {
      if (!willId) return;
      setPrefillLoading(true);
      try {
        const { getUserWillById } = await import("@/actions/wills");
        const result = await getUserWillById(willId);
        if (!result.success || !result.data) return;
        const willRow = result.data as {
          status: string;
          subject_of_will: string | null;
          testator?: {
            id: string;
            first_name?: string | null;
            last_name?: string | null;
            birth_date?: string | null;
            birth_place?: string | null;
            profession?: string | null;
            residence_place?: string | null;
            national_id?: string | null;
            id_issue_date?: string | null;
            id_issue_place?: string | null;
            financial_status?: Array<{
              number_of_children?: number | null;
              boys?: number | null;
              girls?: number | null;
              total_money?: number | null;
            }> | null;
          } | null;
          testators?: Array<{
            id: string;
            first_name?: string | null;
            last_name?: string | null;
            birth_date?: string | null;
            birth_place?: string | null;
            profession?: string | null;
            residence_place?: string | null;
            national_id?: string | null;
            id_issue_date?: string | null;
            id_issue_place?: string | null;
            financial_status?: Array<{
              number_of_children?: number | null;
              boys?: number | null;
              girls?: number | null;
              total_money?: number | null;
            }> | null;
          }> | null;
          will_beneficiaries?: Array<{
            full_name?: string | null;
            last_name?: string | null;
            birth_date?: string | null;
            birth_place?: string | null;
            residence_place?: string | null;
          }> | null;
          witnesses?: Array<{
            witness_number: number;
            first_name?: string | null;
            last_name?: string | null;
          }> | null;
          latest_admin_note?: string | null;
          latest_error_step?: number | null;
        };

        const testator =
          willRow.testator ??
          (Array.isArray(willRow.testators) ? willRow.testators[0] : null);
        const beneficiary = Array.isArray(willRow.will_beneficiaries)
          ? willRow.will_beneficiaries[0]
          : null;
        const w1 = Array.isArray(willRow.witnesses)
          ? willRow.witnesses.find(
              (w: { witness_number: number }) => w.witness_number === 1,
            )
          : null;
        const w2 = Array.isArray(willRow.witnesses)
          ? willRow.witnesses.find(
              (w: { witness_number: number }) => w.witness_number === 2,
            )
          : null;
        const fin = testator?.financial_status
          ? Array.isArray(testator.financial_status)
            ? testator.financial_status[0]
            : null
          : null;

        const beneficiaryFullName =
          typeof beneficiary?.full_name === "string" ? beneficiary.full_name : "";
        const beneficiaryLastName =
          typeof beneficiary?.last_name === "string" ? beneficiary.last_name : "";
        const beneficiaryFirst = beneficiaryLastName
          ? beneficiaryFullName
              .replace(new RegExp(`\\s*${beneficiaryLastName}\\s*$`), "")
              .trim()
          : beneficiaryFullName.trim();

        reset({
          testatorSurnam: testator?.last_name || "",
          testatorName: testator?.first_name || "",
          testatorDob: testator?.birth_date || "",
          testatorPob: testator?.birth_place || "",
          testatorJob: testator?.profession || "",
          testatorRes: testator?.residence_place || "",
          testatorNin: testator?.national_id || "",
          testatorIDDate: testator?.id_issue_date || "",
          testatorIDPlace: testator?.id_issue_place || "",

          beneficiarySurname: beneficiaryLastName || "",
          beneficiaryName: beneficiaryFirst,
          beneficiaryDob: beneficiary?.birth_date || "",
          beneficiaryPob: beneficiary?.birth_place || "",
          beneficiaryRes: beneficiary?.residence_place || "",

          willBody: willRow.subject_of_will || "",

          witness1: `${w1?.first_name || ""} ${w1?.last_name || ""}`.trim(),
          witness2: `${w2?.first_name || ""} ${w2?.last_name || ""}`.trim(),

          totalChildren:
            willTypeParam === "money" || willTypeParam === "general"
              ? fin?.number_of_children ?? 0
              : undefined,
          maleChildren:
            willTypeParam === "money" || willTypeParam === "general"
              ? fin?.boys ?? 0
              : undefined,
          femaleChildren:
            willTypeParam === "money" || willTypeParam === "general"
              ? fin?.girls ?? 0
              : undefined,
          totalMoney:
            willTypeParam === "money" || willTypeParam === "general"
              ? fin?.total_money ?? 0
              : undefined,
        });

        const isRejectedReview =
          willRow.status === "rejected" &&
          (willRow.latest_admin_note !== null ||
            typeof willRow.latest_error_step === "number");
        if (isRejectedReview) {
          setReviewIssue({
            errorStep:
              typeof willRow.latest_error_step === "number"
                ? willRow.latest_error_step
                : null,
            adminNote: willRow.latest_admin_note ?? null,
          });
        } else {
          setReviewIssue(null);
        }
      } finally {
        setPrefillLoading(false);
      }
    };

    void load();
  }, [reset, willId, willTypeParam]);

  const willBodyValue = useWatch({ control, name: "willBody" }) || "";

  const canDeliver =
    currentSubscription?.offer?.offer_key === "pro";

  // Base Steps
  const steps = [
    {
      title: "معلومات الموصي",
      fields: [
        "testatorSurnam",
        "testatorName",
        "testatorDob",
        "testatorPob",
        "testatorJob",
        "testatorRes",
        "testatorNin",
        "testatorIDDate",
        "testatorIDPlace",
      ],
    },
    {
      title: "معلومات الموصى له",
      fields: [
        "beneficiarySurname",
        "beneficiaryName",
        "beneficiaryDob",
        "beneficiaryPob",
        "beneficiaryRes",
      ],
    },
    { title: "موضوع الوصية", fields: ["willBody"] },
    { title: "معلومات الشهود", fields: ["witness1", "witness2"] },
  ];

  // Add conditional step for financial
  if (willTypeParam === "money" || willTypeParam === "general") {
    steps.push({
      title: "الذمة المالية",
      fields: ["totalChildren", "maleChildren", "femaleChildren", "totalMoney"],
    });
  }

  // Add delivery step for Pro users
  if (canDeliver) {
    steps.push({
      title: "توصيل الوصية",
      fields: ["trustee_name", "trustee_email", "trustee_phone"],
    });
  }

  // Final Review Step
  steps.push({ title: "المراجعة والتأكيد", fields: [] });

  const deliveryStepIndex = steps.findIndex((s) =>
    s.fields.includes("trustee_name"),
  );
  const isReviewStep = currentStep === steps.length - 1;
  const canSaveDraft =
    currentSubscription?.offer?.offer_key === "medium" ||
    currentSubscription?.offer?.offer_key === "pro";

  useEffect(() => {
    if (reviewIssue) {
      setCurrentStep(steps.length - 1);
    }
  }, [reviewIssue, steps.length]);

  const validateAndNext = async () => {
    if (isSubmitting) return;
    const fieldsToValidate = steps[currentStep]
      .fields as (keyof WillFormData)[];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      if (isReviewStep) {
        submitForm();
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    } else {
      router.back();
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const data = getValues();
      console.log("Submitting:", { willType: willTypeParam, ...data });

      const payload = { willType: willTypeParam, ...data };
      const { submitWill, updateUserWill } = await import("@/actions/wills");

      const result = willId
        ? await updateUserWill(willId, payload)
        : await submitWill(payload);

      if (result?.success) {
        toast.success(willId ? "تم تعديل الوصية وإعادة إرسالها بنجاح!" : "تم تقديم الوصية بنجاح!");
        router.push(willId ? `/dashboard/wills/${willId}` : "/dashboard/wills");
      } else {
        toast.error(
          result?.error ||
            "حدث خطأ أثناء المحاولة، يرجى التحقق من اشتراكك أو المحاولة لاحقاً.",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if (isSavingDraft || isSubmitting) return;
    setIsSavingDraft(true);
    try {
      const data = getValues();
      const payload = {
        willType: willTypeParam,
        willId: willId ?? undefined,
        ...data,
      };
      const { saveWillDraft } = await import("@/actions/wills");
      const result = await saveWillDraft(payload);

      if (result?.success) {
        toast.success("تم حفظ المسودة بنجاح.");
        router.push("/dashboard/wills");
      } else {
        toast.error(result?.error || "تعذر حفظ المسودة.");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع أثناء حفظ المسودة.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (!accessChecked || !canAccess) {
    return (
      <div className="max-w-5xl mx-auto py-3" dir="rtl">
        <div className="bg-surface rounded-3xl p-6 md:p-10 shadow-sm border border-border min-h-[40vh] flex items-center justify-center">
          <p className="text-sm font-bold text-muted-foreground">
            جاري التحقق من حالة الاشتراك...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-3 " dir="rtl">
      {/* FORM CARDS */}
      <div className="bg-surface rounded-3xl p-6 md:p-10 shadow-sm border border-border min-h-[50vh] relative overflow-hidden">
        {prefillLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-surface border border-border rounded-2xl px-5 py-3 text-sm font-bold text-muted-foreground">
              جاري تحميل بيانات الوصية...
            </div>
          </div>
        )}
        <div className="text-xl font-bold mb-6 text-foreground border-b border-border pb-4 w-full flex items-center justify-between">
          <span>{steps[currentStep].title}</span>
          <span className="text-sm font-bold text-muted-foreground bg-surface border border-border px-3 py-1 rounded-full">
            الخطوة {currentStep + 1} / {steps.length}
          </span>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1: Testator */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      لقب الموصي
                    </label>
                    <input
                      {...register("testatorSurnam")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorSurnam && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorSurnam.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      اسم الموصي
                    </label>
                    <input
                      {...register("testatorName")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorName && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      {...register("testatorDob")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorDob && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorDob.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      مكان الميلاد
                    </label>
                    <input
                      {...register("testatorPob")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorPob && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorPob.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      المهنة
                    </label>
                    <input
                      {...register("testatorJob")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorJob && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorJob.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      مكان الإقامة
                    </label>
                    <input
                      {...register("testatorRes")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorRes && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorRes.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-foreground">
                      رقم بطاقة التعريف (18 رقم)
                    </label>
                    <input
                      {...register("testatorNin")}
                      placeholder="00 00000000 0000000 0"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-left"
                      dir="ltr"
                    />
                    {errors.testatorNin && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorNin.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      تاريخ الإصدار
                    </label>
                    <input
                      type="date"
                      {...register("testatorIDDate")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorIDDate && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorIDDate.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      مكان الإصدار
                    </label>
                    <input
                      {...register("testatorIDPlace")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.testatorIDPlace && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.testatorIDPlace.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Beneficiary */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      لقب الموصى له
                    </label>
                    <input
                      {...register("beneficiarySurname")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.beneficiarySurname && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.beneficiarySurname.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      اسم الموصى له
                    </label>
                    <input
                      {...register("beneficiaryName")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.beneficiaryName && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.beneficiaryName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      {...register("beneficiaryDob")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.beneficiaryDob && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.beneficiaryDob.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      مكان الميلاد
                    </label>
                    <input
                      {...register("beneficiaryPob")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.beneficiaryPob && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.beneficiaryPob.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-foreground">
                      مكان الإقامة
                    </label>
                    <input
                      {...register("beneficiaryRes")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.beneficiaryRes && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.beneficiaryRes.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Body */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 text-primary font-bold text-sm leading-7">
                    &quot;أصرح وأشهد وأنا في كامل قواي العقلية والجسدية، وبمحض
                    إرادتي وبدون ضغط أو إكراه أنني أوصي بما يلي...&quot;
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      موضوع الوصية (بحد أدنى 50 حرف)
                    </label>
                    <textarea
                      {...register("willBody")}
                      rows={6}
                      className="w-full p-4 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                      placeholder="اكتب هنا تفاصيل موضوع الوصية..."
                    ></textarea>
                    <div className="flex justify-between items-center text-xs font-bold">
                      {errors.willBody ? (
                        <span className="text-red-500">
                          {errors.willBody.message}
                        </span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                      <span
                        className={`${willBodyValue.length < 50 ? "text-amber-500" : "text-green-600"}`}
                      >
                        {willBodyValue.length} حرف
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Witnesses */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      لقب واسم الشاهد الأول
                    </label>
                    <input
                      {...register("witness1")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.witness1 && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.witness1.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">
                      لقب واسم الشاهد الثاني
                    </label>
                    <input
                      {...register("witness2")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    {errors.witness2 && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.witness2.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Financial (Only if 'money' or 'general') */}
              {(willTypeParam === "money" || willTypeParam === "general") &&
                currentStep === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-foreground">
                        عدد الأبناء الإجمالي
                      </label>
                      <input
                        type="number"
                        {...register("totalChildren", { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-foreground">
                        عدد الذكور
                      </label>
                      <input
                        type="number"
                        {...register("maleChildren", { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-foreground">
                        عدد الإناث
                      </label>
                      <input
                        type="number"
                        {...register("femaleChildren", { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-3 mt-2">
                      <label className="text-sm font-bold text-foreground">
                        إجمالي الأموال المراد تفريقها (اختياري)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("totalMoney", { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                      {errors.totalMoney && (
                        <p className="text-xs font-bold text-red-500">
                          {errors.totalMoney.message}
                        </p>
                      )}
                    </div>
                    {errors.totalChildren && (
                      <div className="col-span-1 md:col-span-3 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 font-bold text-sm border border-red-100">
                        {errors.totalChildren.message}
                      </div>
                    )}
                  </div>
                )}

              {/* DELIVERY STEP (Pro only) */}
              {deliveryStepIndex >= 0 && currentStep === deliveryStepIndex && (
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                    <p className="text-sm text-foreground leading-7">
                      سيتم توصيل نسخة من الوصية إلى الجهة التي تحددها بعد اعتمادها من الإدارة.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3 md:col-span-2">
                      <label className="text-sm font-bold text-foreground">
                        اسم الجهة المستلمة <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("trustee_name")}
                        placeholder="اسم المحكمة، الموثق، أو أي جهة مختصة"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                      {errors.trustee_name && (
                        <p className="text-xs font-bold text-red-500">
                          {errors.trustee_name.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-foreground">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <input
                        type="email"
                        {...register("trustee_email")}
                        placeholder="trustee@example.com"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-foreground">
                        رقم الهاتف (اختياري)
                      </label>
                      <input
                        type="tel"
                        {...register("trustee_phone")}
                        placeholder="05XX XX XX XX"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FINAL REVIEW STEP */}
              {isReviewStep && (
                <div className="space-y-6">
                  {(() => {
                    const reviewSections: {
                      title: string;
                      target: number;
                      fields: { l: string; v: string | number | null }[];
                    }[] = [
                      {
                        title: "معلومات الموصي",
                        target: 0,
                        fields: [
                          {
                            l: "الاسم الكامل",
                            v: `${getValues("testatorName") || ""} ${getValues("testatorSurnam") || ""}`,
                          },
                          { l: "رقم التعريف", v: getValues("testatorNin") },
                        ],
                      },
                      {
                        title: "معلومات الموصى له",
                        target: 1,
                        fields: [
                          {
                            l: "الاسم الكامل",
                            v: `${getValues("beneficiaryName") || ""} ${getValues("beneficiarySurname") || ""}`,
                          },
                          { l: "مكان الإقامة", v: getValues("beneficiaryRes") },
                        ],
                      },
                      {
                        title: "موضوع الوصية",
                        target: 2,
                        fields: [{ l: "التفاصيل", v: getValues("willBody") }],
                      },
                      {
                        title: "الشهود",
                        target: 3,
                        fields: [
                          { l: "الشاهد الأول", v: getValues("witness1") },
                          { l: "الشاهد الثاني", v: getValues("witness2") },
                        ],
                      },
                    ];

                    // Conditionally include financial review when applicable
                    if (
                      willTypeParam === "money" ||
                      willTypeParam === "general"
                    ) {
                      reviewSections.push({
                        title: "الذمة المالية",
                        target: 4,
                        fields: [
                          {
                            l: "إجمالي الأبناء",
                            v: getValues("totalChildren") ?? null,
                          },
                          { l: "الذكور", v: getValues("maleChildren") ?? null },
                          {
                            l: "الإناث",
                            v: getValues("femaleChildren") ?? null,
                          },
                          {
                            l: "إجمالي الأموال",
                            v: getValues("totalMoney") ?? null,
                          },
                        ],
                      });
                    }

                    // Conditionally include delivery review for Pro users
                    if (canDeliver) {
                      const trusteeName = getValues("trustee_name");
                      if (trusteeName) {
                        const trusteeEmail = getValues("trustee_email");
                        const trusteePhone = getValues("trustee_phone");
                        reviewSections.push({
                          title: "توصيل الوصية",
                          target: deliveryStepIndex,
                          fields: [
                            { l: "الجهة المستلمة", v: trusteeName },
                            ...(trusteeEmail ? [{ l: "البريد الإلكتروني", v: trusteeEmail }] : []),
                            ...(trusteePhone ? [{ l: "رقم الهاتف", v: trusteePhone }] : []),
                          ],
                        });
                      }
                    }

                    return reviewSections.map((section, idx) => {
                      const isIssueSection = reviewIssue?.errorStep === section.target;
                      return (
                      <div
                        key={idx}
                        className={`bg-background border rounded-2xl p-5 relative group transition-colors ${
                          isIssueSection
                            ? "border-red-300 bg-red-50/40"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCurrentStep(section.target)}
                          className="absolute top-4 border left-4 px-3 py-1 bg-surface rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition text-xs font-bold"
                        >
                          تعديل
                        </button>
                        <h3 className="text-sm font-black text-foreground mb-4">
                          {section.title}
                        </h3>
                        <div className="space-y-3">
                          {section.fields.map((f, i) => (
                            <div
                              key={i}
                              className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4"
                            >
                              <span className="text-xs font-bold text-muted-foreground w-28 shrink-0">
                                {f.l}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {f.v}
                              </span>
                            </div>
                          ))}
                        </div>
                        {isIssueSection && reviewIssue?.adminNote && (
                          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-xs font-bold text-red-700 mb-1">
                              ملاحظة الإدارة
                            </p>
                            <p className="text-sm text-red-700 leading-6">
                              {reviewIssue.adminNote}
                            </p>
                          </div>
                        )}
                      </div>
                      );
                    });
                  })()}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>

      <div className="mt-8 flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className="px-6 py-3.5 rounded-xl font-bold bg-transparent text-foreground border border-border hover:bg-surface transition-colors"
          >
            السابق
          </button>
        )}
        {canSaveDraft && (
          <button
            onClick={saveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-3.5 rounded-xl font-bold bg-background text-foreground border border-border hover:bg-surface transition-colors disabled:opacity-50"
          >
            {isSavingDraft ? "جاري حفظ المسودة..." : "حفظ كمسودة"}
          </button>
        )}
        <button
          onClick={validateAndNext}
          disabled={isSavingDraft || isSubmitting}
          className="flex-1 bg-primary text-white rounded-xl py-3.5 font-bold shadow-sm hover:opacity-90 transition active:scale-95 text-center flex items-center justify-center gap-2"
        >
          {isReviewStep ? "إرسال واعتماد الوصية" : "التالي ومتابعة الإدخال"}
        </button>
      </div>
    </div>
  );
}
