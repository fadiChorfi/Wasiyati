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
import {
  RxPerson,
  RxCheck,
  RxCross2,
  RxFileText,
  RxArrowLeft,
  RxCardStack,
  RxCalendar,
  RxStar,
  RxMagnifyingGlass,
  RxChatBubble,
  RxClock,
} from "react-icons/rx";
import { getAdminUserById, updateUserRole } from "@/actions/wills";

// Extended interfaces for user details
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

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
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.userId) {
      fetchUserData(params.userId);
    }
  }, [params.userId, fetchUserData]);

  const generateActivityLogs = (user: UserWithDetails) => {
    const logs: ActivityLog[] = [];

    // Profile creation log
    logs.push({
      id: "profile-1",
      action: "إنشاء حساب",
      description: "تم إنشاء حساب المستخدم",
      date: user.updated_at || "غير محدد",
      type: "profile",
    });

    // Subscription logs
    if (user.subscriptions && user.subscriptions.length > 0) {
      user.subscriptions.forEach((sub, index) => {
        logs.push({
          id: `sub-${sub.id}`,
          action: "اشتراك",
          description: `اشتراك ${sub.offers?.name_ar || "غير محدد"} - ${getSubscriptionLabel(sub.status)}`,
          date: sub.created_at,
          type: "subscription",
        });
      });
    }

    // Will logs
    if (user.wills && user.wills.length > 0) {
      user.wills.forEach((will) => {
        logs.push({
          id: `will-${will.id}`,
          action: "وصية",
          description: `إنشاء وصية ${getWillStatusLabel(will.status)}`,
          date: will.created_at,
          type: "will",
        });
      });
    }

    // Sort by date (most recent first)
    logs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setActivityLogs(logs);
  };

  // Status labels and colors
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-600",
          dot: "bg-purple-500",
        };
      case "user":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-600",
          dot: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "مدير";
      case "user":
        return "مستخدم";
      default:
        return "غير محدد";
    }
  };

  const getSubscriptionBadgeStyle = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-green-500/10",
          text: "text-green-600",
          dot: "bg-green-500",
        };
      case "expired":
        return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
      case "pending":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-600",
          dot: "bg-yellow-500",
        };
      case "cancelled":
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-600",
          dot: "bg-gray-500",
        };
      default:
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
    }
  };

  const getSubscriptionLabel = (status: SubscriptionStatus): string => {
    switch (status) {
      case "active":
        return "نشط";
      case "expired":
        return "منتهي";
      case "pending":
        return "معلق";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const getWillStatusLabel = (status: WillStatus): string => {
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

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (!userData) return;

    try {
      const result = await updateUserRole(userData.id, newRole);
      if (result.success) {
        setToastMessage(`تم تحديث دور المستخدم إلى ${getRoleLabel(newRole)}`);
        setShowToast(true);
        // Refresh data
        fetchUserData(userData.id);
      } else {
        setToastMessage(result.error || "فشل تحديث دور المستخدم");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      setToastMessage("حدث خطأ غير متوقع");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">
              جاري تحميل بيانات المستخدم...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
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

  if (!userData) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RxCross2 className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-500">لم يتم العثور على المستخدم</p>
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

  const roleBadge = getRoleBadgeStyle(userData.role);
  const subscription = userData.subscriptions?.[0];
  const wills = userData.wills || [];

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg animate-pulse">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => router.back()}
          className="p-2 bg-surface border border-border rounded-xl hover:bg-gray-50 transition-colors"
          title="العودة"
        >
          <RxArrowLeft className="text-xl text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            تفاصيل المستخدم
          </h1>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${roleBadge.bg} ${roleBadge.text}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`}
              ></div>
              {getRoleLabel(userData.role)}
            </span>
            <span className="text-sm text-muted-foreground">
              {userData.full_name || "غير محدد"}
            </span>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-gray-50">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxPerson className="text-primary" />
              معلومات المستخدم
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  الاسم الكامل
                </label>
                <p className="font-medium text-foreground">
                  {userData.full_name || "غير محدد"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  رقم الهاتف
                </label>
                <p className="font-medium text-foreground" dir="ltr">
                  {userData.phone || "غير محدد"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  المدينة
                </label>
                <p className="font-medium text-foreground">
                  {userData.city || "غير محدد"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  الدور
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${roleBadge.bg} ${roleBadge.text}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`}
                    ></div>
                    {getRoleLabel(userData.role)}
                  </div>
                  <select
                    value={userData.role}
                    onChange={(e) =>
                      handleRoleChange(e.target.value as UserRole)
                    }
                    className="px-3 py-1 rounded-lg text-sm border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    title="تغيير دور المستخدم"
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  تاريخ الانضمام
                </label>
                <p className="font-medium text-foreground">
                  {formatDate(userData.updated_at)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  الصورة الشخصية
                </label>
                <div className="flex items-center gap-3">
                  {userData.avatar_url ? (
                    <img
                      src={userData.avatar_url}
                      alt={userData.full_name || "مستخدم"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <RxPerson className="text-primary text-2xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        {subscription && (
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <RxCardStack className="text-primary" />
                معلومات الاشتراك
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    نوع الاشتراك
                  </label>
                  <p className="font-medium text-foreground">
                    {subscription.offers?.name_ar || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    الحالة
                  </label>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${getSubscriptionBadgeStyle(subscription.status).bg} ${getSubscriptionBadgeStyle(subscription.status).text}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${getSubscriptionBadgeStyle(subscription.status).dot}`}
                    ></div>
                    {getSubscriptionLabel(subscription.status)}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ البدء
                  </label>
                  <p className="font-medium text-foreground">
                    {formatDate(subscription.started_at)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الانتهاء
                  </label>
                  <p className="font-medium text-foreground">
                    {formatDate(subscription.expires_at)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    السعر
                  </label>
                  <p className="font-medium text-foreground">
                    {subscription.offers?.price_dzd
                      ? `${subscription.offers.price_dzd.toLocaleString("ar-DZ")} د.ج`
                      : "غير محدد"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الإنشاء
                  </label>
                  <p className="font-medium text-foreground">
                    {formatDate(subscription.created_at)}
                  </p>
                </div>
              </div>

              {/* Subscription Features */}
              {subscription.offers && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    المميزات
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subscription.offers.has_legal_will_creation && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <RxCheck className="text-green-500" />
                        إنشاء وصية قانونية
                      </div>
                    )}
                    {subscription.offers.has_approved_template && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <RxCheck className="text-green-500" />
                        قوالب معتمدة
                      </div>
                    )}
                    {subscription.offers.has_secure_digital_storage && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <RxCheck className="text-green-500" />
                        تخزين رقمي آمن
                      </div>
                    )}
                    {subscription.offers.has_edit_later && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <RxCheck className="text-green-500" />
                        تعديل لاحق
                      </div>
                    )}
                    {subscription.offers.has_heir_notification && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <RxCheck className="text-green-500" />
                        إشعارات للورثة
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Wills */}
        {wills.length > 0 && (
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <RxFileText className="text-primary" />
                وصايا المستخدم ({wills.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {wills.map((will) => (
                  <div key={will.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">
                          الوصية #{will.id}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {will.subject_of_will || "لا يوجد عنوان"}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${
                          will.status === "approved"
                            ? "bg-green-500/10 text-green-600"
                            : will.status === "rejected"
                              ? "bg-red-500/10 text-red-600"
                              : will.status === "under_review"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            will.status === "approved"
                              ? "bg-green-500"
                              : will.status === "rejected"
                                ? "bg-red-500"
                                : will.status === "under_review"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                          }`}
                        ></div>
                        {getWillStatusLabel(will.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">النوع:</span>
                        <span className="mr-2 font-medium">
                          {will.will_category === "general"
                            ? "عامة"
                            : will.will_category === "financial"
                              ? "مالية"
                              : will.will_category === "business"
                                ? "أعمال"
                                : "غير محدد"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">المستوى:</span>
                        <span className="mr-2 font-medium">
                          {will.will_type === "basic"
                            ? "أساسي"
                            : will.will_type === "medium"
                              ? "متوسط"
                              : will.will_type === "pro"
                                ? "احترافي"
                                : "غير محدد"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">التاريخ:</span>
                        <span className="mr-2 font-medium">
                          {formatDate(will.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() =>
                          router.push(`/admin/dashboard/wills/${will.id}`)
                        }
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-gray-50">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <RxClock className="text-primary" />
              سجل النشاط
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.type === "will"
                            ? "bg-blue-500/10 text-blue-600"
                            : log.type === "subscription"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-purple-500/10 text-purple-600"
                        }`}
                      >
                        {log.type === "will" ? (
                          <RxFileText className="text-sm" />
                        ) : log.type === "subscription" ? (
                          <RxCardStack className="text-sm" />
                        ) : (
                          <RxPerson className="text-sm" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {log.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(log.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
