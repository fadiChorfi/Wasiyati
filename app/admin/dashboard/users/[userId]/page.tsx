"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Profile,
  Subscription,
  Offer,
  Will,
  UserRole,
  SubscriptionStatus,
  WillStatus,
  Testator,
  WillBeneficiary,
  Witness,
} from "@/types/database";
import Image from "next/image";
import {
  RxPerson,
  RxCheck,
  RxCross2,
  RxFileText,
  RxArrowLeft,
  RxCardStack,
  RxClock,
  RxChevronRight,
} from "react-icons/rx";
import { getAdminUserById, updateUserRole } from "@/actions/wills";

interface UserWithDetails extends Profile {
  subscriptions: (Subscription & { offers: Offer | null })[] | null;
  wills:
    | (Will & {
        testators: Testator[] | null;
        will_beneficiaries: WillBeneficiary[] | null;
        witnesses: Witness[] | null;
      })[]
    | null;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  date: string;
  type: "will" | "subscription" | "profile";
}

export default function UserDetailsPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const [userData, setUserData] = useState<UserWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [updatingRole, setUpdatingRole] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminUserById(userId);
      if (result.success && result.data) {
        setUserData(result.data as UserWithDetails);
        generateActivityLogs(result.data as UserWithDetails);
      } else {
        setError(result.error || "فشل جلب بيانات المستخدم");
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.userId) fetchUserData(params.userId);
  }, [params.userId, fetchUserData]);

  const generateActivityLogs = (user: UserWithDetails) => {
    const logs: ActivityLog[] = [];
    logs.push({
      id: "profile-1",
      action: "إنشاء حساب",
      description: "تم إنشاء حساب المستخدم",
      date: user.updated_at || "",
      type: "profile",
    });
    user.subscriptions?.forEach((sub) => {
      logs.push({
        id: `sub-${sub.id}`,
        action: "اشتراك جديد",
        description: `${sub.offers?.name_ar || "غير محدد"} — ${getSubscriptionLabel(sub.status)}`,
        date: sub.created_at,
        type: "subscription",
      });
    });
    user.wills?.forEach((will) => {
      logs.push({
        id: `will-${will.id}`,
        action: "وصية",
        description: `إنشاء وصية — ${getWillStatusLabel(will.status)}`,
        date: will.created_at,
        type: "will",
      });
    });
    logs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setActivityLogs(logs);
  };

  const getRoleConfig = (role: UserRole) =>
    ({
      admin: {
        bg: "bg-purple-500/10",
        text: "text-purple-600",
        border: "border-purple-200",
        dot: "bg-purple-500",
        label: "مدير",
      },
      user: {
        bg: "bg-blue-500/10",
        text: "text-blue-600",
        border: "border-blue-200",
        dot: "bg-blue-500",
        label: "مستخدم",
      },
    })[role] ?? {
      bg: "bg-border",
      text: "text-muted-foreground",
      border: "border-transparent",
      dot: "bg-muted-foreground",
      label: "غير محدد",
    };

  const getSubscriptionConfig = (status: SubscriptionStatus) =>
    ({
      active: {
        bg: "bg-green-500/10",
        text: "text-green-600",
        border: "border-green-200",
        dot: "bg-green-500",
        label: "نشط",
      },
      expired: {
        bg: "bg-red-500/10",
        text: "text-red-600",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "منتهي",
      },
      pending: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-600",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
        label: "معلق",
      },
      cancelled: {
        bg: "bg-gray-500/10",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-500",
        label: "ملغي",
      },
    })[status] ?? {
      bg: "bg-border",
      text: "text-muted-foreground",
      border: "border-transparent",
      dot: "bg-muted-foreground",
      label: "غير محدد",
    };

  const getWillConfig = (status: WillStatus) =>
    ({
      approved: {
        bg: "bg-green-500/10",
        text: "text-green-600",
        border: "border-green-200",
        dot: "bg-green-500",
        label: "موافق عليها",
      },
      rejected: {
        bg: "bg-red-500/10",
        text: "text-red-600",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "مرفوضة",
      },
      under_review: {
        bg: "bg-blue-500/10",
        text: "text-blue-600",
        border: "border-blue-200",
        dot: "bg-blue-500",
        label: "تحت المراجعة",
      },
      submitted: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-600",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
        label: "معلقة",
      },
      draft: {
        bg: "bg-border",
        text: "text-muted-foreground",
        border: "border-transparent",
        dot: "bg-muted-foreground",
        label: "مسودة",
      },
    })[status] ?? {
      bg: "bg-border",
      text: "text-muted-foreground",
      border: "border-transparent",
      dot: "bg-muted-foreground",
      label: "مسودة",
    };

  const getSubscriptionLabel = (status: SubscriptionStatus) =>
    getSubscriptionConfig(status).label;
  const getWillStatusLabel = (status: WillStatus) =>
    getWillConfig(status).label;

  const formatShortDate = (dateString: string | null): string => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (!userData) return;
    setUpdatingRole(true);
    try {
      const result = await updateUserRole(userData.id, newRole);
      if (result.success) {
        showToast(`تم تحديث الدور بنجاح`, "success");
        fetchUserData(userData.id);
      } else {
        showToast(result.error || "فشل تحديث الدور", "error");
      }
    } catch {
      showToast("حدث خطأ غير متوقع", "error");
    } finally {
      setUpdatingRole(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">
            جاري تحميل بيانات المستخدم...
          </p>
        </div>
      </div>
    );
  }

  // ─── Error / Not found ─────────────────────────────────────────────────────
  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <RxCross2 className="text-2xl text-red-500" />
          </div>
          <p className="text-foreground font-semibold">
            {error || "لم يتم العثور على المستخدم"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const roleConfig = getRoleConfig(userData.role);
  const subscription = userData.subscriptions?.[0];
  const wills = userData.wills || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-4 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-bold transition-all flex items-center gap-2 animate-pulse ${
            toast.type === "success"
              ? "bg-primary text-primary-foreground"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <RxCheck className="text-xl" />
          ) : (
            <RxCross2 className="text-xl" />
          )}
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <button
            title="عودة للخلف"
            onClick={() => router.back()}
            className="p-2.5 bg-surface border border-border rounded-xl hover:bg-black/5 transition-colors shadow-sm"
          >
            <RxArrowLeft className="text-lg text-muted-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>المستخدمون</span>
              <RxChevronRight className="text-muted-foreground" />
              <span className="text-foreground font-bold">
                {userData.full_name || "مستخدم"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              تفاصيل المستخدم
            </h1>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="h-24 bg-linear-to-l from-primary/10 via-primary/5 to-transparent" />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-3xl border-4 border-surface shadow-sm overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 relative">
                  {userData.avatar_url ? (
                    <Image
                      src={userData.avatar_url}
                      alt={userData.full_name || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <RxPerson className="text-3xl text-primary" />
                  )}
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {userData.full_name || "غير محدد"}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    {userData.phone || "لا يوجد رقم هاتف"}
                  </p>
                </div>
              </div>

              {/* Role badge + selector */}
              <div className="flex items-center gap-2 pb-1">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-transparent flex items-center gap-1.5 ${roleConfig.bg} ${roleConfig.text}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`}
                  />
                  {roleConfig.label}
                </span>
                <select
                  title="تغيير دور المستخدم"
                  value={userData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  disabled={updatingRole}
                  className="px-4 py-2 rounded-2xl text-sm font-bold border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <option value="user">ترقية/تخفيض لمستخدم</option>
                  <option value="admin">ترقية/تخفيض لمدير</option>
                </select>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 border-t border-border pt-6">
              <div className="bg-background rounded-2xl p-4 text-center border border-border/50">
                <p className="text-2xl font-bold text-foreground">
                  {wills.length}
                </p>
                <p className="text-xs text-muted-foreground font-bold mt-1">
                  وصايا
                </p>
              </div>
              <div className="bg-background rounded-2xl p-4 text-center border border-border/50">
                <p className="text-2xl font-bold text-foreground">
                  {userData.subscriptions?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground font-bold mt-1">
                  اشتراكات
                </p>
              </div>
              <div className="bg-background rounded-2xl p-4 text-center border border-border/50">
                <p className="text-sm font-bold text-foreground mt-2">
                  {userData.city || "—"}
                </p>
                <p className="text-xs text-muted-foreground font-bold mt-1">
                  المدينة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Subscription Card ── */}
        {subscription && (
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-black/5">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RxCardStack className="text-primary text-lg" />
                </div>
                الاشتراك الحالي
              </h3>
              {(() => {
                const cfg = getSubscriptionConfig(subscription.status);
                return (
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border-transparent flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                );
              })()}
            </div>

            <div className="p-6 space-y-6">
              {/* Plan name + price */}
              <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">
                    خطة الاشتراك
                  </p>
                  <p className="font-bold text-xl text-foreground">
                    {subscription.offers?.name_ar || "غير محدد"}
                  </p>
                </div>
                {subscription.offers?.price_dzd && (
                  <div className="text-left">
                    <p className="font-black text-2xl text-primary" dir="ltr">
                      {subscription.offers.price_dzd.toLocaleString("ar-DZ")}{" "}
                      <span className="text-sm font-bold text-muted-foreground">
                        د.ج
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-2xl p-4 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold mb-2">
                    <RxClock className="text-sm" /> تاريخ البدء
                  </div>
                  <p className="font-bold text-sm text-foreground">
                    {formatShortDate(subscription.started_at)}
                  </p>
                </div>
                <div className="bg-background rounded-2xl p-4 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold mb-2">
                    <RxClock className="text-sm" /> تاريخ الانتهاء
                  </div>
                  <p className="font-bold text-sm text-foreground">
                    {formatShortDate(subscription.expires_at)}
                  </p>
                </div>
              </div>

              {/* Features */}
              {subscription.offers && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                    المميزات
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        key: "has_legal_will_creation",
                        label: "إنشاء وصية قانونية",
                      },
                      { key: "has_approved_template", label: "قوالب معتمدة" },
                      {
                        key: "has_secure_digital_storage",
                        label: "تخزين رقمي آمن",
                      },
                      { key: "has_edit_later", label: "تعديل لاحق" },
                      { key: "has_heir_notification", label: "إشعارات للورثة" },
                    ].map(({ key, label }) => {
                      const enabled = subscription.offers?.[
                        key as keyof Offer
                      ] as boolean;
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold border ${
                            enabled
                              ? "bg-green-500/10 border-transparent text-green-700"
                              : "bg-background border-border/50 text-muted-foreground"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              enabled ? "bg-green-500" : "bg-border"
                            }`}
                          >
                            {enabled ? (
                              <RxCheck className="text-white text-sm" />
                            ) : (
                              <RxCross2 className="text-muted-foreground text-sm" />
                            )}
                          </div>
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Wills ── */}
        {wills.length > 0 && (
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-black/5">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RxFileText className="text-primary text-lg" />
                </div>
                الوصايا
              </h3>
              <span className="px-3 py-1 bg-background border border-border text-foreground rounded-lg text-xs font-bold shadow-sm">
                {wills.length}
              </span>
            </div>
            <div className="divide-y divide-border/50">
              {wills.map((will) => {
                const cfg = getWillConfig(will.status);
                return (
                  <div
                    key={will.id}
                    className="px-6 py-5 hover:bg-black/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border-transparent flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                            />
                            {cfg.label}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-lg border border-border/50">
                            {will.will_category === "general"
                              ? "عامة"
                              : will.will_category === "financial"
                                ? "مالية"
                                : will.will_category === "business"
                                  ? "أعمال"
                                  : "غير محدد"}
                          </span>
                        </div>
                        <p className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {will.subject_of_will ||
                            `وصية #${will.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1">
                          <RxClock />
                          {formatShortDate(will.created_at)}
                        </p>
                      </div>
                      <button
                        title="التفاصيل"
                        onClick={() =>
                          router.push(`/admin/dashboard/wills/${will.id}`)
                        }
                        className="shrink-0 flex items-center gap-2 px-4 py-2 bg-background border border-border group-hover:border-primary/30 text-muted-foreground group-hover:text-primary rounded-xl text-sm font-bold transition-all hover:shadow-sm"
                      >
                        التفاصيل
                        <RxArrowLeft className="text-lg" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Activity Log ── */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-black/5">
            <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <RxClock className="text-primary text-lg" />
              </div>
              سجل النشاط
            </h3>
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute right-4 top-2 bottom-2 w-0.5 bg-border/80 rounded-full" />
              <div className="space-y-6 relative">
                {activityLogs.map((log) => {
                  const iconBg =
                    log.type === "will"
                      ? "bg-blue-500 text-white"
                      : log.type === "subscription"
                        ? "bg-green-500 text-white"
                        : "bg-purple-500 text-white";
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 relative group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-surface ${iconBg}`}
                      >
                        {log.type === "will" ? (
                          <RxFileText className="text-sm border-transparent" />
                        ) : log.type === "subscription" ? (
                          <RxCardStack className="text-sm border-transparent" />
                        ) : (
                          <RxPerson className="text-sm border-transparent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 bg-background rounded-2xl p-4 border border-border/50 group-hover:border-border transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {log.action}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">
                              {log.description}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground bg-black/5 px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                            {formatShortDate(log.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
