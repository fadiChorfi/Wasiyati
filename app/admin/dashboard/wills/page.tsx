"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Will,
  WillStatus,
  WillBeneficiary,
  Profile,
  Testator,
  Witness,
  FinancialStatus,
} from "@/types/database";
import {
  RxCheck,
  RxCross2,
  RxMagnifyingGlass,
  RxPerson,
  RxFileText,
  RxClock,
  RxEyeOpen,
} from "react-icons/rx";
import { getAdminWills, updateWillStatus } from "@/actions/wills";

// Extended interfaces for admin view
interface WillWithDetails extends Will {
  profiles: Profile | null;
  testators:
    | (Testator & { financial_status: FinancialStatus[] | null })[]
    | null;
  will_beneficiaries: WillBeneficiary[] | null;
  witnesses: Witness[] | null;
}

type FilterStatus = "all" | WillStatus;

export default function Wills() {
  const router = useRouter();
  const [wills, setWills] = useState<WillWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch wills data on component mount
  useEffect(() => {
    fetchWills();
  }, []);

  const fetchWills = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminWills();

      if (result.success && result.data) {
        setWills(result.data as WillWithDetails[]);
      } else {
        setError(result.error || "فشل جلب بيانات الوصايا");
      }
    } catch (err) {
      console.error("Error fetching wills:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  // Filter wills
  const filteredWills = useMemo(() => {
    return wills.filter((will) => {
      const matchesStatus =
        filterStatus === "all" || will.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        will.profiles?.full_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        will.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [wills, filterStatus, searchQuery]);

  // Status labels and colors matching (protected) dashboard style
  const getBadgeStyle = (status: WillStatus) => {
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

  const getWillTypeLabel = (willCategory: string | null): string => {
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

  // Handle quick approve/reject actions
  const handleQuickApprove = async (willId: string) => {
    // Optimistic update
    const previousWills = [...wills];
    setWills(
      wills.map((w) => (w.id === willId ? { ...w, status: "approved" } : w)),
    );

    try {
      const result = await updateWillStatus(willId, "approved");
      if (result.success) {
        setToastMessage("تمت الموافقة على الوصية بنجاح");
        setShowToast(true);
      } else {
        setWills(previousWills); // Revert on failure
        setToastMessage(result.error || "فشل الموافقة على الوصية");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error approving will:", err);
      setWills(previousWills); // Revert on failure
      setToastMessage("حدث خطأ غير متوقع");
      setShowToast(true);
    }
  };

  const handleQuickReject = async (willId: string) => {
    // Optimistic update
    const previousWills = [...wills];
    setWills(
      wills.map((w) => (w.id === willId ? { ...w, status: "rejected" } : w)),
    );

    try {
      const result = await updateWillStatus(
        willId,
        "rejected",
        "مرفوض من الإدارة",
      );
      if (result.success) {
        setToastMessage("تم رفض الوصية");
        setShowToast(true);
      } else {
        setWills(previousWills); // Revert on failure
        setToastMessage(result.error || "فشل رفض الوصية");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error rejecting will:", err);
      setWills(previousWills); // Revert on failure
      setToastMessage("حدث خطأ غير متوقع");
      setShowToast(true);
    }
  };

  const formatDate = (dateString: string | null): string => {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">
              جاري تحميل بيانات الوصايا...
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
              onClick={fetchWills}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg animate-pulse">
          {toastMessage}
        </div>
      )}

      {/* Stats Bar */}

      {/* Filters and Search */}
      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-base font-bold text-foreground">الوصايا</h3>
          <div className="text-sm text-muted-foreground">
            {filteredWills.length} وصية
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: "all", label: "الكل" },
              { key: "submitted", label: "معلقة" },
              { key: "approved", label: "موافق عليها" },
              { key: "rejected", label: "مرفوضة" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as FilterStatus)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filterStatus === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <RxMagnifyingGlass className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xl" />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الوصية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-background">
              <tr>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  العميل
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  رقم الوصية
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  النوع
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  التاريخ
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  الإجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWills.map((will) => {
                const b = getBadgeStyle(will.status);
                return (
                  <tr
                    key={will.id}
                    className="border-t border-border hover:bg-background/50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <RxPerson className="text-primary text-lg" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {will.profiles?.full_name || "غير محدد"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {will.profiles?.city || "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-foreground">
                      {will.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {getWillTypeLabel(will.will_category)}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {formatDate(will.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${b.dot}`}
                        ></div>
                        {getWillStatusLabel(will.status)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/dashboard/wills/${will.id}`)
                          }
                          className="text-sm text-primary hover:underline font-medium min-h-11 min-w-11 flex items-center gap-1"
                        >
                          <RxEyeOpen className="text-sm" />
                          مراجعة
                        </button>
                        {will.status === "submitted" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleQuickApprove(will.id)}
                              className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                              title="الموافقة"
                            >
                              <RxCheck className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleQuickReject(will.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                              title="الرفض"
                            >
                              <RxCross2 className="text-sm" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col">
          {filteredWills.map((will) => {
            const b = getBadgeStyle(will.status);
            return (
              <div
                key={will.id}
                className="px-4 py-4 border-t border-border flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <RxPerson className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {will.profiles?.full_name || "غير محدد"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {will.profiles?.city || "غير محدد"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${b.dot}`}></div>
                    {getWillStatusLabel(will.status)}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      {will.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getWillTypeLabel(will.will_category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(will.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/dashboard/wills/${will.id}`)
                      }
                      className="text-sm text-primary hover:underline font-medium min-h-11 min-w-11 flex items-center gap-1"
                    >
                      <RxEyeOpen className="text-sm" />
                      مراجعة
                    </button>
                    {will.status === "submitted" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleQuickApprove(will.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                          title="الموافقة"
                        >
                          <RxCheck className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleQuickReject(will.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                          title="الرفض"
                        >
                          <RxCross2 className="text-sm" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWills.length === 0 && (
          <div className="text-center py-12">
            <RxFileText className="text-4xl text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد وصايا مطابقة للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
