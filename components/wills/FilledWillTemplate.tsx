"use client";

import React, { useMemo } from "react";

type WillCategory = "general" | "money" | "business" | string;

export type FilledWillTemplateWill = {
  id: string;
  will_category: WillCategory | null;
  created_at: string;
  subject_of_will: string | null;
  // Some queries alias 1-1 relations as singular objects
  testator?: {
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
      number_of_children: number;
      boys: number;
      girls: number;
      total_money: number | null;
    }> | null;
  } | null;
  testators?: Array<{
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
  beneficiary?: {
    full_name?: string | null;
    relationship?: string | null;
    share_percentage?: number | null;
  } | null;
  will_beneficiaries?: Array<{
    full_name: string;
    relationship?: string | null;
    share_percentage?: number | null;
  }> | null;
  witnesses?: Array<{
    witness_number: number;
    first_name: string;
    last_name: string;
  }> | null;
};

function willTitle(category: WillCategory | null) {
  switch (category) {
    case "general":
      return "الوصية العامة";
    case "money":
      return "وصية بالأموال";
    case "business":
      return "وصية بالأعمال";
    default:
      return "وصية";
  }
}

function safeDate(d: string | null | undefined) {
  if (!d) return "غير محدد";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? "غير محدد"
    : dt.toLocaleDateString("ar-DZ");
}

function joinName(first?: string | null, last?: string | null) {
  return `${first || ""} ${last || ""}`.trim() || "غير محدد";
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export default function FilledWillTemplate({
  will,
}: {
  will: FilledWillTemplateWill;
}) {
  const testator = useMemo(() => {
    // Prefer explicit singular
    if (will.testator) return will.testator;
    // Fallback to joined array
    return asArray(will.testators)[0] ?? null;
  }, [will.testator, will.testators]);
  const financial = useMemo(
    () => testator?.financial_status?.[0] ?? null,
    [testator?.financial_status],
  );
  const primaryBeneficiary = useMemo(() => {
    if (will.beneficiary) return will.beneficiary;
    return asArray(will.will_beneficiaries)[0] ?? null;
  }, [will.beneficiary, will.will_beneficiaries]);
  const w1 = useMemo(
    () => asArray(will.witnesses).find((w) => w.witness_number === 1) ?? null,
    [will.witnesses],
  );
  const w2 = useMemo(
    () => asArray(will.witnesses).find((w) => w.witness_number === 2) ?? null,
    [will.witnesses],
  );

  const showFinancial =
    will.will_category === "money" || will.will_category === "general";

  return (
    <div
      className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden"
      dir="rtl"
    >
      <div className="px-6 py-5 border-b border-border bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-foreground">
              {willTitle(will.will_category)}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              • تاريخ الإنشاء:{" "}
              <span className="font-bold text-foreground">
                {safeDate(will.created_at)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 text-primary font-bold text-sm leading-7">
          &quot;أصرح وأشهد وأنا في كامل قواي العقلية والجسدية، وبمحض إرادتي
          وبدون ضغط أو إكراه أنني أوصي بما يلي...&quot;
        </div>

        {/* Testator */}
        <section className="bg-background border border-border rounded-2xl p-5">
          <h3 className="text-sm font-black text-foreground mb-4">
            بيانات الموصي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">الاسم الكامل</span>
              <span className="font-bold text-foreground">
                {joinName(testator?.first_name, testator?.last_name)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">تاريخ الميلاد</span>
              <span className="font-bold text-foreground">
                {safeDate(testator?.birth_date)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">مكان الميلاد</span>
              <span className="font-bold text-foreground">
                {testator?.birth_place || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">المهنة</span>
              <span className="font-bold text-foreground">
                {testator?.profession || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">مكان الإقامة</span>
              <span className="font-bold text-foreground">
                {testator?.residence_place || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">رقم التعريف</span>
              <span className="font-bold text-foreground" dir="ltr">
                {testator?.national_id || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">تاريخ إصدار البطاقة</span>
              <span className="font-bold text-foreground">
                {safeDate(testator?.id_issue_date)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">مكان إصدار البطاقة</span>
              <span className="font-bold text-foreground">
                {testator?.id_issue_place || "غير محدد"}
              </span>
            </div>
          </div>
        </section>

        {/* Beneficiary */}
        <section className="bg-background border border-border rounded-2xl p-5">
          <h3 className="text-sm font-black text-foreground mb-4">
            بيانات الموصى له
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">الاسم</span>
              <span className="font-bold text-foreground">
                {primaryBeneficiary?.full_name || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">صلة القرابة</span>
              <span className="font-bold text-foreground">
                {primaryBeneficiary?.relationship || "غير محدد"}
              </span>
            </div>
            {primaryBeneficiary?.share_percentage != null && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">نسبة الحصة</span>
                <span className="font-bold text-foreground">
                  {primaryBeneficiary.share_percentage}%
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Will body */}
        <section className="bg-background border border-border rounded-2xl p-5">
          <h3 className="text-sm font-black text-foreground mb-4">
            موضوع الوصية
          </h3>
          <div className="bg-surface rounded-2xl border border-border p-5 leading-8 text-sm font-medium text-foreground whitespace-pre-wrap">
            {will.subject_of_will || "لا يوجد نص متاح للوصية"}
          </div>
        </section>

        {/* Financial */}
        {showFinancial && (
          <section className="bg-background border border-border rounded-2xl p-5">
            <h3 className="text-sm font-black text-foreground mb-4">
              الذمة المالية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  إجمالي الأبناء
                </p>
                <p className="text-lg font-black text-foreground mt-1">
                  {financial?.number_of_children ?? 0}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  عدد الذكور
                </p>
                <p className="text-lg font-black text-foreground mt-1">
                  {financial?.boys ?? 0}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  عدد الإناث
                </p>
                <p className="text-lg font-black text-foreground mt-1">
                  {financial?.girls ?? 0}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  إجمالي الأموال
                </p>
                <p className="text-lg font-black text-foreground mt-1">
                  {financial?.total_money != null
                    ? `${financial.total_money.toLocaleString("ar-DZ")} د.ج`
                    : "غير محدد"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Witnesses */}
        <section className="bg-background border border-border rounded-2xl p-5">
          <h3 className="text-sm font-black text-foreground mb-4">الشهود</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-surface border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground">
                الشاهد الأول
              </p>
              <p className="text-base font-black text-foreground mt-1">
                {joinName(w1?.first_name, w1?.last_name)}
              </p>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground">
                الشاهد الثاني
              </p>
              <p className="text-base font-black text-foreground mt-1">
                {joinName(w2?.first_name, w2?.last_name)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
