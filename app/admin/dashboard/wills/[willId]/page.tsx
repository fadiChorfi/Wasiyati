"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Will,
  Profile,
  Testator,
  Witness,
  FinancialStatus,
  WillBeneficiary,
} from "@/types/database";
import {
  RxPerson,
  RxFileText,
  RxArchive,
  RxIdCard,
  RxArrowLeft,
  RxCheck,
  RxCross2,
  RxChatBubble,
  RxClock,
  RxCheckCircled,
  RxExclamationTriangle,
} from "react-icons/rx";
import { getAdminWillById, updateWillStatus } from "@/actions/wills";

// Extended interfaces for will form data
interface WillWithDetails extends Will {
  profiles: Profile | null;
  testators:
    | (Testator & { financial_status: FinancialStatus[] | null })[]
    | null;
  witnesses: Witness[] | null;
  will_beneficiaries: WillBeneficiary[] | null;
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  date: string;
  comment?: string;
}

export default function WillReviewPage() {
  const params = useParams<{ willId: string }>();
  const router = useRouter();
  const [willData, setWillData] = useState<WillWithDetails | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [errorStep, setErrorStep] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const fetchWillData = useCallback(async (willId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminWillById(willId);

      if (result.success && result.data) {
        setWillData(result.data as WillWithDetails);
        // Generate audit logs from will data
        generateAuditLogs(result.data as WillWithDetails);
      } else {
        setError(result.error || "فشل جلب بيانات الوصية");
      }
    } catch (err) {
      console.error("Error fetching will data:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.willId) {
      fetchWillData(params.willId);
    }
  }, [params.willId, fetchWillData]);

  const generateAuditLogs = (will: WillWithDetails) => {
    const logs: AuditLog[] = [
      {
        id: "audit-1",
        action: "تم تقديم الوصية",
        actor: will.profiles?.full_name || "مستخدم",
        date: will.created_at,
        comment: "تقديم الوصية للموافقة",
      },
    ];

    // Add status change logs if any
    if (will.updated_at !== will.created_at) {
      logs.push({
        id: "audit-2",
        action: "تم تحديث الوصية",
        actor: "النظام",
        date: will.updated_at,
        comment: "تم تحديث حالة الوصية",
      });
    }

    setAuditLogs(logs);
  };

  // Status labels and colors matching (protected) dashboard style
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-600",
          dot: "bg-yellow-500",
        };
      case "under_review":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-600",
          dot: "bg-blue-500",
        };
      case "approved":
        return {
          bg: "bg-green-500/10",
          text: "text-green-600",
          dot: "bg-green-500",
        };
      case "rejected":
        return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
      default:
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
    }
  };

  const getWillStatusLabel = (status: string): string => {
    switch (status) {
      case "submitted":
        return "معلقة";
      case "under_review":
        return "تحت المراجعة";
      case "approved":
        return "موافق عليها";
      case "rejected":
        return "مرفوضة";
      default:
        return "مسودة";
    }
  };

  const getWillTypeLabel = (willCategory: string): string => {
    switch (willCategory) {
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

  // Handle will actions
  const handleApprove = async () => {
    if (!willData) return;

    try {
      const result = await updateWillStatus(willData.id, "approved");
      if (result.success) {
        showFeedback("success", "تم اعتماد الوصية وحفظ سجل المراجعة بنجاح.");
        // Refresh data
        fetchWillData(willData.id);
      } else {
        showFeedback("error", result.error || "فشل اعتماد الوصية.");
      }
    } catch (err) {
      console.error("Error approving will:", err);
      showFeedback("error", "حدث خطأ غير متوقع أثناء الاعتماد.");
    }
  };

  const handleReject = async () => {
    if (!willData || !adminComment.trim()) {
      showFeedback("error", "يرجى إضافة سبب الرفض قبل الإرسال.");
      return;
    }

    try {
      const result = await updateWillStatus(
        willData.id,
        "rejected",
        adminComment,
        errorStep === "" ? null : Number(errorStep),
      );
      if (result.success) {
        showFeedback(
          "success",
          "تم حفظ قرار الرفض وملاحظاتك، وسيتم توجيه العميل إلى الخطوة المحددة.",
        );
        // Refresh data
        fetchWillData(willData.id);
        setAdminComment("");
        setErrorStep("");
      } else {
        showFeedback("error", result.error || "فشل حفظ قرار الرفض.");
      }
    } catch (err) {
      console.error("Error rejecting will:", err);
      showFeedback("error", "حدث خطأ غير متوقع أثناء الرفض.");
    }
  };

  const handleSendComment = async () => {
    if (!willData || !adminComment.trim()) {
      showFeedback("error", "يرجى إضافة تعليق قبل الإرسال.");
      return;
    }

    try {
      const result = await updateWillStatus(
        willData.id,
        "under_review",
        adminComment,
      );
      if (result.success) {
        showFeedback("success", "تم إرسال التعليق وحفظ سجل المراجعة.");
        // Refresh data
        fetchWillData(willData.id);
        setAdminComment("");
      } else {
        showFeedback("error", result.error || "فشل إرسال التعليق.");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
      showFeedback("error", "حدث خطأ غير متوقع أثناء إرسال التعليق.");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل بيانات الوصية...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <RxCross2 className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!willData) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <RxCross2 className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-500">لم يتم العثور على الوصية</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const b = getBadgeStyle(willData.status);
  const testatorArray = willData.testators;
  const testator = Array.isArray(testatorArray)
    ? testatorArray[0]
    : testatorArray;
  const beneficiaries = willData.will_beneficiaries || [];
  const witnesses = willData.witnesses || [];
  const financialStatusArray = testator?.financial_status || null;
  const financialStatus = Array.isArray(financialStatusArray)
    ? financialStatusArray[0]
    : financialStatusArray;
  const requesterName = willData.profiles?.full_name || "مستخدم";

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {feedback && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg border max-w-lg w-[calc(100%-2rem)] md:w-auto ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
          dir="rtl"
        >
          <div className="flex items-start gap-3">
            {feedback.type === "success" ? (
              <RxCheckCircled className="text-xl mt-0.5 shrink-0" />
            ) : (
              <RxExclamationTriangle className="text-xl mt-0.5 shrink-0" />
            )}
            <div className="text-sm font-medium leading-6">
              {feedback.message}
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="mr-auto text-current/70 hover:text-current transition-colors"
              aria-label="إغلاق التنبيه"
              title="إغلاق"
            >
              <RxCross2 className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
              مراجعة الوصية
            </h1>
            <p className="text-sm text-primary-foreground/75 mt-1">
              تحقق من البيانات وقرر اعتماد الطلب أو رفضه
            </p>
          </div>
          <button
            title="العودة"
            onClick={() => router.push("/admin/dashboard/wills")}
            className="h-10 px-4 rounded-xl bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20 transition inline-flex items-center gap-2 text-sm font-bold w-fit"
          >
            <RxArrowLeft />
            العودة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">الحالة</p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 ${b.bg} ${b.text}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${b.dot}`}></div>
            {getWillStatusLabel(willData.status)}
          </span>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">نوع الوصية</p>
          <p className="text-sm font-bold text-foreground">
            {willData.will_category
              ? getWillTypeLabel(willData.will_category)
              : "غير محدد"}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">صاحب الطلب</p>
          <p className="text-sm font-bold text-foreground">{requesterName}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">تاريخ الإنشاء</p>
          <p className="text-sm font-bold text-foreground">
            {formatDate(willData.created_at)}
          </p>
        </div>
      </div>

      {/* Will Form Data */}
      <div className="space-y-6">
        {/* Testator Information */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxPerson className="text-primary" />
              معلومات الموصي
            </h3>
          </div>
          <div className="p-6">
            {testator ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    الاسم الكامل
                  </label>
                  <p className="font-bold text-foreground">
                    {testator.first_name || ""} {testator.last_name || ""}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الميلاد
                  </label>
                  <p className="font-bold text-foreground">
                    {formatDate(testator.birth_date)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    مكان الميلاد
                  </label>
                  <p className="font-bold text-foreground">
                    {testator.birth_place || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    المهنة
                  </label>
                  <p className="font-bold text-foreground">
                    {testator.profession || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    مكان الإقامة
                  </label>
                  <p className="font-bold text-foreground">
                    {testator.residence_place || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    رقم بطاقة التعريف
                  </label>
                  <p className="font-bold text-foreground" dir="">
                    {testator.national_id || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ إصدار البطاقة
                  </label>
                  <p className="font-bold text-foreground">
                    {formatDate(testator.id_issue_date)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    مكان إصدار البطاقة
                  </label>
                  <p className="font-bold text-foreground">
                    {testator.id_issue_place || "غير محدد"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                لا توجد بيانات متاحة للموصي
              </p>
            )}
          </div>
        </div>

        {/* Beneficiary Information */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxPerson className="text-primary" />
              معلومات الموصى لهم
            </h3>
          </div>
          <div className="p-6">
            {beneficiaries.length > 0 ? (
              <div className="space-y-4">
                {beneficiaries.map((beneficiary, index) => (
                  <div
                    key={beneficiary.id}
                    className="bg-background border border-border rounded-xl p-4"
                  >
                    <h4 className="font-medium text-foreground mb-3">
                      الموصى له #{index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          الاسم الكامل
                        </label>
                        <p className="font-medium text-foreground">
                          {beneficiary.full_name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          صلة القرابة
                        </label>
                        <p className="font-medium text-foreground">
                          {beneficiary.relationship || "غير محدد"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          تاريخ الميلاد
                        </label>
                        <p className="font-medium text-foreground">
                          {formatDate(beneficiary.birth_date)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          مكان الميلاد
                        </label>
                        <p className="font-medium text-foreground">
                          {beneficiary.birth_place || "غير محدد"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          مكان الإقامة
                        </label>
                        <p className="font-medium text-foreground">
                          {beneficiary.residence_place || "غير محدد"}
                        </p>
                      </div>
                      {beneficiary.share_percentage && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            نسبة الحصة
                          </label>
                          <p className="font-medium text-foreground">
                            {beneficiary.share_percentage}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                لا توجد بيانات متاحة للموصى لهم
              </p>
            )}
          </div>
        </div>

        {/* Will Body */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxFileText className="text-primary" />
              موضوع الوصية
            </h3>
          </div>
          <div className="p-6">
            <div className="bg-background border border-border rounded-xl p-6">
              <p className="font-medium text-foreground leading-8 whitespace-pre-wrap">
                {willData.subject_of_will || "لا يوجد نص متاح للوصية"}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Information (if available) */}
        {financialStatus && (
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <RxArchive className="text-primary" />
                الذمة المالية
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    إجمالي الأبناء
                  </label>
                  <p className="font-medium text-foreground">
                    {financialStatus.number_of_children || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    عدد الذكور
                  </label>
                  <p className="font-medium text-foreground">
                    {financialStatus.boys || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    عدد الإناث
                  </label>
                  <p className="font-medium text-foreground">
                    {financialStatus.girls || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    المبلغ الإجمالي
                  </label>
                  <p className="font-medium text-foreground">
                    {financialStatus.total_money
                      ? financialStatus.total_money.toLocaleString("ar-DZ") +
                        " د.ج"
                      : "غير محدد"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Witnesses Information */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxIdCard className="text-primary" />
              معلومات الشهود
            </h3>
          </div>
          <div className="p-6">
            {witnesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {witnesses.map((witness) => (
                  <div key={witness.id} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      الشاهد {witness.witness_number}
                    </label>
                    <p className="font-medium text-foreground">
                      {witness.first_name} {witness.last_name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                لا توجد بيانات متاحة للشهود
              </p>
            )}
          </div>
        </div>

        {/* Audit History */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxClock className="text-primary" />
              سجل المراجعة
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-background border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {log.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.actor}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(log.date)}
                    </p>
                  </div>
                  {log.comment && (
                    <p className="text-sm text-foreground mt-2">
                      {log.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxChatBubble className="text-primary" />
              إجراءات الإدارة
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                ملاحظات الإدارة
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="أضف ملاحظاتك أو سبب الرفض..."
                className="w-full p-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                مكان الخطأ في النموذج (اختياري)
              </label>
              <select
                value={errorStep}
                onChange={(e) => setErrorStep(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                title="مكان الخطأ في النموذج"
              >
                <option value="">بدون تحديد خطوة</option>
                <option value="0">الخطوة 1: معلومات الموصي</option>
                <option value="1">الخطوة 2: معلومات الموصى له</option>
                <option value="2">الخطوة 3: موضوع الوصية</option>
                <option value="3">الخطوة 4: معلومات الشهود</option>
                {(willData.will_category === "money" ||
                  willData.will_category === "general") && (
                  <option value="4">الخطوة 5: الذمة المالية</option>
                )}
              </select>
              <p className="text-xs text-muted-foreground">
                عند الرفض، سيتم فتح نموذج العميل مباشرة على هذه الخطوة.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleApprove}
                className="h-11 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                <RxCheck className="inline ml-2" />
                اعتماد
              </button>
              <button
                onClick={handleReject}
                className="h-11 px-6 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
              >
                <RxCross2 className="inline ml-2" />
                رفض
              </button>
              <button
                onClick={handleSendComment}
                className="h-11 px-6 bg-accent text-accent-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-colors"
              >
                <RxChatBubble className="inline ml-2" />
                إرسال تعليق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
