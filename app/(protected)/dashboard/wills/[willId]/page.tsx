"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RxArrowLeft,
  RxClock,
  RxCross2,
  RxDownload,
  RxFileText,
  RxPencil2,
} from "react-icons/rx";
import { getUserWillById } from "@/actions/wills";
import { WillStatus } from "@/types/database";
import FilledWillTemplate from "@/components/wills/FilledWillTemplate";
import FilledWillHtmlView from "@/components/wills/FilledMoneyWillHtmlView";

type WillWithJoins = {
  id: string;
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

const willTemplateHref = (category: string | null) => {
  const file =
    category === "business"
      ? "bussiness-will.pdf"
      : category === "money"
        ? "money-will.pdf"
        : "general-will.pdf";
  return `/docs/${file}`;
};

export default function WillDetailsPage() {
  const params = useParams<{ willId: string }>();
  const router = useRouter();
  const willId = params.willId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [will, setWill] = useState<WillWithJoins | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const templateHref = useMemo(
    () => willTemplateHref(will?.will_category ?? null),
    [will?.will_category],
  );

  const canModify = will?.status === "rejected" || will?.status === "draft";

  const testatorName = useMemo(() => {
    const t = will?.testator ?? will?.testators?.[0];
    if (!t) return null;
    const full = `${t.first_name || ""} ${t.last_name || ""}`.trim();
    return full || null;
  }, [will?.testator, will?.testators]);

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
        alert(message);
      } finally {
        setIsGeneratingPdf(false);
      }
    },
    [will],
  );

  if (loading) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الوصية...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !will) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
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
    <div
      className="space-y-6 max-w-6xl mx-auto px-4 md:px-6 py-4 pb-24 md:pb-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center gap-4 bg-surface p-4 rounded-3xl shadow-sm border border-border">
        <button
          title="العودة"
          onClick={() => router.push("/dashboard/wills")}
          className="p-3 bg-background hover:bg-primary/5 rounded-2xl transition-colors border border-border group"
        >
          <RxArrowLeft className="text-xl text-muted-foreground group-hover:text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <RxFileText className="text-primary" />
            {getWillTypeLabel(will.will_category)}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${b.dot}`}></div>
              {getWillStatusLabel(will.status)}
            </span>
            <span className="text-xs text-muted-foreground">
              {will.id.replace("WAS-", "# WAS-")}
            </span>
            {testatorName && (
              <span className="text-xs text-muted-foreground">
                الموصي:{" "}
                <span className="text-foreground font-bold">
                  {testatorName}
                </span>
              </span>
            )}
          </div>
        </div>

        {canModify && (
          <button
            onClick={() =>
              router.push(
                `/dashboard/new-request/${will.will_category || "general"}?willId=${encodeURIComponent(will.id)}`,
              )
            }
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition active:scale-95 flex items-center gap-2"
          >
            تعديل الوصية <RxPencil2 />
          </button>
        )}
      </div>

      {/* Approved template preview */}
      {will.status === "approved" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-surface rounded-2xl border border-border p-4">
            <div>
              <p className="text-sm font-black text-foreground">
                الوصية المعتمدة
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                هذا عرض مُعبّأ تلقائياً من بياناتك المحفوظة.
              </p>
            </div>
            <a
              href={templateHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-background border border-border hover:bg-border/50 text-primary font-bold text-sm transition active:scale-95 flex items-center gap-2"
              title="عرض القالب الأصلي (PDF)"
            >
              عرض القالب PDF <RxDownload />
            </a>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              إنشاء ملف PDF مطابق للقالب الأصلي مع تعبئة بيانات الوصية.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => void generatePdf("preview")}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-background border border-border text-foreground font-bold text-sm hover:bg-border/50 transition disabled:opacity-50"
              >
                معاينة PDF
              </button>
              <button
                onClick={() => void generatePdf("download")}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50"
              >
                {isGeneratingPdf ? "جاري الإنشاء..." : "تحميل PDF المُعبأ"}
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
            <FilledWillHtmlView
              variant={(will.will_category as "general" | "money" | "business") ?? "general"}
              onOpenPdf={() => void generatePdf("preview")}
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
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/new-request/${will.will_category || "general"}?willId=${encodeURIComponent(will.id)}`,
                  )
                }
                className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition active:scale-95"
              >
                فتح النموذج للتعديل
              </button>
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
