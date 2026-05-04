"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Profile, UserRole, SubscriptionStatus } from "@/types/database";
import {
  RxPerson,
  RxCheck,
  RxCross2,
  RxMagnifyingGlass,
  RxClock,
  RxEyeOpen,
  RxStar,
} from "react-icons/rx";
import { getAdminUsers } from "@/actions/wills";

// Extended type for admin view
type UserWithDetails = Profile;

type FilterRole = "all" | UserRole;
type FilterStatus = "all" | SubscriptionStatus;

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminUsers();

      if (result.success && result.data) {
        setUsers(result.data as UserWithDetails[]);
      } else {
        setError(result.error || "فشل جلب بيانات المستخدمين");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const regularUsers = users.filter((u) => u.role === "user").length;
    const activeSubscriptions = 0; // TODO: Add when subscriptions are implemented
    const expiredSubscriptions = 0; // TODO: Add when subscriptions are implemented

    return {
      total,
      admins,
      regularUsers,
      activeSubscriptions,
      expiredSubscriptions,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all"; // TODO: Add subscription filtering when implemented
      const matchesSearch =
        searchQuery === "" ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery) ||
        user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, filterRole, filterStatus, searchQuery]);

  // Status labels and colors matching (protected) dashboard style
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

  /*  const getSubscriptionBadgeStyle = (status: SubscriptionStatus) => {
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
  }; */

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserSubscriptionStatus = () => {
    // TODO: Implement when subscriptions are added to the data structure
    return { status: "none", label: "لا يوجد اشتراك" };
  };

  if (loading) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RxClock className="text-4xl text-muted-foreground animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">
              جاري تحميل بيانات المستخدمين...
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
              onClick={fetchUsers}
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
    <div
      className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6 max-w-7xl mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة المستخدمين</h1>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة حسابات المستخدمين والاشتراكات
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-surface rounded-3xl p-4 md:p-6 border border-border shadow-sm flex flex-col items-start transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center self-start mb-4 bg-primary/10 text-primary">
            <RxPerson className="text-xl" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">
            الإجمالي
          </h3>
          <p className="text-3xl font-bold text-foreground mt-2">
            {stats.total}
          </p>
        </div>
        <div className="bg-surface rounded-3xl p-4 md:p-6 border border-border shadow-sm flex flex-col items-start transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center self-start mb-4 bg-purple-500/10 text-purple-600">
            <RxStar className="text-xl" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">مديرين</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats.admins}
          </p>
        </div>
        <div className="bg-surface rounded-3xl p-4 md:p-6 border border-border shadow-sm flex flex-col items-start transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center self-start mb-4 bg-blue-500/10 text-blue-600">
            <RxPerson className="text-xl" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">
            مستخدمين
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.regularUsers}
          </p>
        </div>
        <div className="bg-surface rounded-3xl p-4 md:p-6 border border-border shadow-sm flex flex-col items-start transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center self-start mb-4 bg-green-500/10 text-green-600">
            <RxCheck className="text-xl" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">
            اشتراكات نشطة
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.activeSubscriptions}
          </p>
        </div>
        <div className="bg-surface rounded-3xl p-4 md:p-6 border border-border shadow-sm flex flex-col items-start transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center self-start mb-4 bg-red-500/10 text-red-600">
            <RxCross2 className="text-xl" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">منتهية</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {stats.expiredSubscriptions}
          </p>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-3xl shadow-sm border border-border">
        <div className="relative w-full md:w-96">
          <RxMagnifyingGlass className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xl" />
          <input
            type="text"
            placeholder="البحث بالاسم، الهاتف أو المدينة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-2.5 rounded-2xl border-none bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            title="تصفية حسب الدور"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as FilterRole)}
            className="px-4 py-2.5 bg-background border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm cursor-pointer w-full sm:w-auto outline-none"
          >
            <option value="all">جميع الأدوار</option>
            <option value="admin">مديرين</option>
            <option value="user">مستخدمين</option>
          </select>
          <select
            title="تصفية حسب الاشتراك"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2.5 bg-background border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm cursor-pointer w-full sm:w-auto outline-none"
          >
            <option value="all">جميع الاشتراكات</option>
            <option value="active">اشتراك نشط</option>
            <option value="pending">اشتراك معلق</option>
            <option value="expired">اشتراك منتهي</option>
            <option value="cancelled">اشتراك ملغي</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mx-auto mb-4">
              <RxPerson className="text-2xl text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              لا توجد مستخدمين مطابقة للبحث
            </h3>
            <p className="text-sm text-muted-foreground">
              جرب تغيير معايير البحث أو التصفية
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-black/5 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    المستخدم
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    الهاتف
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    المدينة
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    تاريخ الانضمام
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    الاشتراك
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap">
                    الدور
                  </th>
                  <th className="px-6 py-5 font-bold whitespace-nowrap text-left">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadgeStyle(user.role);
                  const subscriptionStatus = getUserSubscriptionStatus();

                  return (
                    <tr
                      key={user.id}
                      onClick={() =>
                        router.push(`/admin/dashboard/users/${user.id}`)
                      }
                      className="hover:bg-primary/5 transition-all group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-border/40 ${
                              user.role === "admin"
                                ? "bg-purple-500/10 text-purple-600"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user.full_name || "مستخدم"}
                                width={44}
                                height={44}
                                className="w-full h-full rounded-2xl object-cover"
                              />
                            ) : (
                              <RxPerson className="text-xl" />
                            )}
                          </div>
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                            {user.full_name || "مستخدم غير معروف"}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-5 text-muted-foreground font-medium"
                        dir="ltr"
                        style={{ textAlign: "right" }}
                      >
                        {user.phone || "غير متوفر"}
                      </td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">
                        {user.city || "غير محدد"}
                      </td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">
                        {formatDate(user.updated_at)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-muted-foreground font-medium">
                          {subscriptionStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${roleBadge.bg} ${roleBadge.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`}
                          ></span>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/dashboard/users/${user.id}`);
                            }}
                            className="bg-surface border border-border group-hover:border-primary/30 text-muted-foreground group-hover:text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:shadow-sm"
                          >
                            <RxEyeOpen className="text-lg" />
                            التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
