"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RxArrowLeft,
  RxCheckCircled,
  RxClock,
  RxCross2,
  RxFileText,
  RxPencil2,
} from "react-icons/rx";
import { toast } from "sonner";
import { getUserWillById, requestWillDelivery } from "@/actions/wills";
import { WillStatus } from "@/types/database";
import FilledWillTemplate from "@/components/wills/FilledWillTemplate";
import FilledWillHtmlView from "@/components/wills/FilledMoneyWillHtmlView";

type WillWithJoins = {
  id: string;
  will_type: "basic" | "medium" | "pro";
  status: WillStatus;
  will_category: string | null;
  created_at: string;
  updated_at: string;
  subject_of_will: string | null;
  testator?: {
    id: string;
    first_name: string;
    last_name: string;
    birth_date?: string | null;
    birth_place?: string | null;
    profession?: string | null;
    residence_place?: string | null;
    national_id?: string | null;
    id_issue_date?: string | null;
    id_issue_place?: string | null;
    financial_status?: Array<{
      number_of_children: number;
      boys: number;
      girls: number;
      total_money: number | null;
    }> | null;
  } | null;
  testators?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    birth_date: string | null;
    birth_place: string | null;
    profession: string | null;
    residence_place: string | null;
    national_id: string | null;
    id_issue_date: string | null;
    id_issue_place: string | null;
    financial_status?: Array<{
      number_of_children: number;
      boys: number;
      girls: number;
      total_money: number | null;
    }> | null;
  }> | null;
  will_beneficiaries?: Array<{
    id: string;
    full_name: string;
    relationship?: string | null;
    share_percentage?: number | null;
  }> | null;
  witnesses?: Array<{
    id: string;
    witness_number: number;
    first_name: string;
    last_name: string;
  }> | null;
  latest_admin_note?: string | null;
  latest_error_step?: number | null;
  will_deliveries?: Array<{
    id: string;
    trustee_name: string;
    trustee_email: string | null;
    trustee_phone: string | null;
    delivery_status: "not_sent" | "scheduled" | "sent" | "confirmed";
    delivery_method: "email" | "sms" | "physical";
    scheduled_at: string | null;
    delivered_at: string | null;
  }> | null;
};

const getWillTypeLabel = (category: string | null): string => {
  switch (category) {
    case "general":
      return "الوصية العامة";
    case "money":
      return "وصية بالأموال";
    case "business":
      return "وصية بالأعمال";
    default:
      return "وصية غير محددة";
  }
};

const getOfferLabel = (willType: string) => {
  switch (willType) {
    case "pro":
      return "الشاملة (Pro)";
    case "medium":
      return "المتوسطة";
    case "basic":
      return "الأساسية";
    default:
      return willType;
  }
};

const getWillStatusLabel = (status: WillStatus): string => {
  switch (status) {
    case "approved":
      return "مكتملة";
    case "under_review":
      return "قيد المراجعة";
    case "submitted":
      return "تم الإرسال";
    case "rejected":
      return "بحاجة تعديل";
    case "draft":
      return "مسودة";
    default:
      return "غير معروف";
  }
};

const getStatusBadge = (status: WillStatus) => {
  switch (status) {
    case "approved":
      return { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" };
    case "under_review":
    case "submitted":
      return {
        bg: "bg-accent/10",
        text: "text-accent-foreground",
        dot: "bg-accent",
      };
    case "rejected":
      return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
    case "draft":
      return {
        bg: "bg-border",
        text: "text-muted-foreground",
        dot: "bg-muted-foreground",
      };
  }
};

/* const willTemplateHref = (category: string | null) => {
  const file =
    category === "business"
      ? "bussiness-will.pdf"
      : category === "money"
        ? "money-will.pdf"
        : "general-will.pdf";
  return `/docs/${file}`;
}; */

export default function WillDetailsPage() {
  const params = useParams<{ willId: string }>();
  const router = useRouter();
  const willId = params.willId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [will, setWill] = useState<WillWithJoins | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isRequestingDelivery, setIsRequestingDelivery] = useState(false);
  const [trusteeName, setTrusteeName] = useState("");
  const [trusteeEmail, setTrusteeEmail] = useState("");
  const [trusteePhone, setTrusteePhone] = useState("");

  const fetchWill = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserWillById(willId);
      if (!res.success || !res.data) {
        setError(res.error || "تعذر تحميل بيانات الوصية");
        setWill(null);
        return;
      }
      setWill(res.data as WillWithJoins);
    } catch {
      setError("حدث خطأ غير متوقع");
      setWill(null);
    } finally {
      setLoading(false);
    }
  }, [willId]);

  useEffect(() => {
    if (willId) fetchWill();
  }, [willId, fetchWill]);

  /* const templateHref = useMemo(
    () => willTemplateHref(will?.will_category ?? null),
    [will?.will_category],
  ); */

  const canModify = !!will && will.status !== "approved";
  const canRequestDelivery =
    will?.status === "approved" && will?.will_type === "pro";
  const editWillHref = useMemo(() => {
    if (!will) return "/dashboard/wills";
    const params = new URLSearchParams();
    params.set("willId", will.id);
    return `/dashboard/new-request/${will.will_category || "general"}?${params.toString()}`;
  }, [will]);

  const testatorName = useMemo(() => {
    const t = will?.testator ?? will?.testators?.[0];
    if (!t) return null;
    const full = `${t.first_name || ""} ${t.last_name || ""}`.trim();
    return full || null;
  }, [will?.testator, will?.testators]);

  const latestDelivery = will?.will_deliveries?.[0] ?? null;

  const onRequestDelivery = useCallback(async () => {
    if (!will || !canRequestDelivery) return;
    if (!trusteeName.trim()) {
      toast.error("يرجى إدخال اسم الجهة المستلمة.");
      return;
    }

    try {
      setIsRequestingDelivery(true);
      const result = await requestWillDelivery(will.id, {
        trusteeName: trusteeName.trim(),
        trusteeEmail: trusteeEmail.trim() || undefined,
        trusteePhone: trusteePhone.trim() || undefined,
        deliveryMethod: trusteePhone.trim() ? "sms" : "email",
      });

      if (!result.success) {
        toast.error(result.error || "تعذر تسجيل طلب التوصيل.");
        return;
      }

      toast.success("تم إرسال طلب توصيل الوصية بنجاح.");
      await fetchWill();
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع أثناء طلب التوصيل.");
    } finally {
      setIsRequestingDelivery(false);
    }
  }, [
    canRequestDelivery,
    fetchWill,
    trusteeEmail,
    trusteeName,
    trusteePhone,
    will,
  ]);

  const generatePdf = useCallback(
    async (mode: "download" | "preview") => {
      if (!will) return;

      const testator = will.testator ?? will.testators?.[0] ?? null;
      const financial = testator?.financial_status?.[0] ?? null;
      const beneficiary = will.will_beneficiaries?.[0] ?? null;
      const witness1 = will.witnesses?.find((w) => w.witness_number === 1);
      const witness2 = will.witnesses?.find((w) => w.witness_number === 2);

      const fields: Record<string, string | number> = {
        will_id: will.id,
        will_category: getWillTypeLabel(will.will_category),
        created_at: new Date(will.created_at).toLocaleDateString("ar-DZ"),
        testator_full_name:
          `${testator?.first_name ?? ""} ${testator?.last_name ?? ""}`.trim(),
        testator_birth_date: testator?.birth_date ?? "",
        testator_birth_place: testator?.birth_place ?? "",
        testator_profession: testator?.profession ?? "",
        testator_residence: testator?.residence_place ?? "",
        testator_national_id: testator?.national_id ?? "",
        testator_id_issue_date: testator?.id_issue_date ?? "",
        testator_id_issue_place: testator?.id_issue_place ?? "",
        beneficiary_full_name: beneficiary?.full_name ?? "",
        beneficiary_relationship: beneficiary?.relationship ?? "",
        subject_of_will: will.subject_of_will ?? "",
        witness_1:
          `${witness1?.first_name ?? ""} ${witness1?.last_name ?? ""}`.trim(),
        witness_2:
          `${witness2?.first_name ?? ""} ${witness2?.last_name ?? ""}`.trim(),
        number_of_children: financial?.number_of_children ?? 0,
        boys: financial?.boys ?? 0,
        girls: financial?.girls ?? 0,
        total_money:
          financial?.total_money == null ? "" : String(financial.total_money),
      };

      try {
        setIsGeneratingPdf(true);
        const htmlTemplateName =
          will.will_category === "business"
            ? "business-will.html"
            : will.will_category === "money"
              ? "money-will.html"
              : "general-will.html";

        const res = await fetch("/api/generate-html-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: htmlTemplateName,
            outputFileName: `${will.id}.pdf`,
            fields: {
              ...fields,
              // Keep PDF footer aligned with customized money preview
              place: testator?.birth_place ?? "",
              beneficiary_birth_place: "",
              beneficiary_residence: "",
            },
          }),
        });

        if (!res.ok) {
          let message = "Failed to generate PDF";
          try {
            const err = (await res.json()) as { error?: string };
            if (err?.error) message = err.error;
          } catch {
            // Ignore JSON parse errors and keep fallback message
          }
          throw new Error(message);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (mode === "preview") {
          window.open(url, "_blank", "noopener,noreferrer");
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
          return;
        }

        const a = document.createElement("a");
        a.href = url;
        a.download = `${will.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
        const message =
          e instanceof Error ? e.message : "تعذر إنشاء ملف PDF حالياً";
        toast.error(message);
      } finally {
        setIsGeneratingPdf(false);
      }
    },
    [will],
  );

  if (loading) {
    return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              جاري تحميل الوصية...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !will) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <RxCross2 className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">
              {error || "لم يتم العثور على الوصية"}
            </p>
            <button
              onClick={() => router.push("/dashboard/wills")}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const b = getStatusBadge(will.status);

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <RxFileText />
              {getWillTypeLabel(will.will_category)}
            </h1>
            <p className="text-sm text-primary-foreground/75 mt-1">
              تفاصيل الوصية وحالة المراجعة الحالية
            </p>
          </div>
          <div className="flex gap-2">
            <button
              title="العودة"
              onClick={() => router.push("/dashboard/wills")}
              className="h-10 px-4 rounded-xl bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20 transition inline-flex items-center gap-2 text-sm font-bold"
            >
              <RxArrowLeft />
              العودة
            </button>
            {canModify && (
              <button
                onClick={() => router.push(editWillHref)}
                className="h-10 px-4 rounded-xl bg-primary-foreground text-primary font-bold text-sm hover:opacity-90 transition active:scale-95 flex items-center gap-2"
              >
                تعديل الوصية <RxPencil2 />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">الحالة</p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 ${b.bg} ${b.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`}></span>
            {getWillStatusLabel(will.status)}
          </span>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">الباقة</p>
          <p className="text-sm font-bold text-foreground">
            {getOfferLabel(will.will_type)}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">الموصي</p>
          <p className="text-sm font-bold text-foreground">
            {testatorName || "غير محدد"}
          </p>
        </div>
      </div>

      {/* Approved template preview */}
      {will.status === "approved" ? (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              إنشاء ملف PDF مطابق للقالب الأصلي مع تعبئة بيانات الوصية.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => void generatePdf("preview")}
                disabled={isGeneratingPdf}
                className="h-10 px-4 rounded-xl bg-background border border-border text-foreground font-bold text-sm hover:bg-border/50 transition disabled:opacity-50"
              >
                معاينة PDF
              </button>
              <button
                onClick={() => void generatePdf("download")}
                disabled={isGeneratingPdf}
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50"
              >
                {isGeneratingPdf ? "جاري الإنشاء..." : "تحميل PDF المُعبأ"}
              </button>
            </div>
          </div>

          {canRequestDelivery && (
            <div className="bg-surface rounded-2xl border border-border p-4 space-y-4">
              <div>
                <p className="text-sm font-black text-foreground">
                  توصيل الوصية (باقة Pro)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  أرسل بيانات الجهة المستلمة ليتم جدولة التوصيل والمتابعة من
                  الإدارة.
                </p>
              </div>

              {latestDelivery && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <p className="font-bold flex items-center gap-2">
                    <RxCheckCircled />
                    حالة الطلب الحالية: {latestDelivery.delivery_status}
                  </p>
                  <p className="mt-1">
                    الجهة المستلمة: {latestDelivery.trustee_name}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={trusteeName}
                  onChange={(e) => setTrusteeName(e.target.value)}
                  placeholder="اسم الجهة المستلمة"
                  className="px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary"
                />
                <input
                  value={trusteeEmail}
                  onChange={(e) => setTrusteeEmail(e.target.value)}
                  placeholder="البريد الإلكتروني (اختياري)"
                  className="px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary"
                />
                <input
                  value={trusteePhone}
                  onChange={(e) => setTrusteePhone(e.target.value)}
                  placeholder="رقم الهاتف (اختياري)"
                  className="px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={() => void onRequestDelivery()}
                disabled={isRequestingDelivery}
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50"
              >
                {isRequestingDelivery ? "جاري الإرسال..." : "تأكيد طلب التوصيل"}
              </button>
            </div>
          )}

          <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
            <FilledWillHtmlView
              variant={
                (will.will_category as "general" | "money" | "business") ??
                "general"
              }
              onOpenPdf={() => void generatePdf("preview")}
              onDownloadPdf={() => void generatePdf("download")}
              data={{
                testator_full_name:
                  `${(will.testator ?? will.testators?.[0])?.first_name ?? ""} ${(will.testator ?? will.testators?.[0])?.last_name ?? ""}`.trim(),
                testator_birth_date:
                  (will.testator ?? will.testators?.[0])?.birth_date ?? "",
                testator_birth_place:
                  (will.testator ?? will.testators?.[0])?.birth_place ?? "",
                testator_residence:
                  (will.testator ?? will.testators?.[0])?.residence_place ?? "",
                testator_profession:
                  (will.testator ?? will.testators?.[0])?.profession ?? "",
                testator_national_id:
                  (will.testator ?? will.testators?.[0])?.national_id ?? "",
                testator_id_issue_date:
                  (will.testator ?? will.testators?.[0])?.id_issue_date ?? "",
                testator_id_issue_place:
                  (will.testator ?? will.testators?.[0])?.id_issue_place ?? "",
                beneficiary_full_name:
                  will.will_beneficiaries?.[0]?.full_name ?? "",
                beneficiary_relationship:
                  will.will_beneficiaries?.[0]?.relationship ?? "",
                witness_1:
                  `${will.witnesses?.find((w) => w.witness_number === 1)?.first_name ?? ""} ${will.witnesses?.find((w) => w.witness_number === 1)?.last_name ?? ""}`.trim(),
                witness_2:
                  `${will.witnesses?.find((w) => w.witness_number === 2)?.first_name ?? ""} ${will.witnesses?.find((w) => w.witness_number === 2)?.last_name ?? ""}`.trim(),
                created_at: new Date(will.created_at).toLocaleDateString(
                  "ar-DZ",
                ),
                subject_of_will: will.subject_of_will ?? "",
                beneficiary_birth_place: "",
                beneficiary_residence: "",
              }}
            />
          </div>

          <FilledWillTemplate will={will} />
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-black text-foreground mb-2">
            {canModify ? "هذه الوصية بحاجة لتعديل" : "حالة الوصية"}
          </h2>
          <p className="text-sm text-muted-foreground leading-7">
            {canModify
              ? "يمكنك الآن إعادة فتح نموذج الإدخال وتعديل بياناتك ثم إعادة الإرسال للمراجعة."
              : "وصيتك قيد المعالجة. يمكنك العودة لاحقاً لرؤية التحديثات."}
          </p>
          <div className="mt-5 flex flex-col md:flex-row gap-3">
            {canModify && (
              <>
                <button
                  onClick={() => router.push(editWillHref)}
                  className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition active:scale-95"
                >
                  فتح النموذج للتعديل
                </button>
                {will.status === "rejected" && will.latest_admin_note && (
                  <div className="w-full md:w-auto px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    ملاحظة الإدارة: {will.latest_admin_note}
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => router.push("/dashboard/wills")}
              className="px-5 py-3 rounded-xl bg-background border border-border text-foreground font-bold text-sm hover:bg-border/50 transition active:scale-95"
            >
              الرجوع إلى قائمة الوصايا
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
