"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RxMagnifyingGlass, RxEyeOpen } from "react-icons/rx";
import { getAdminSubscriptions } from "@/actions/payement";

type AdminSubscription = {
  id: string;
  status: string;
  created_at: string;
  profiles: {
    full_name_ar: string;
    full_name_en: string;
    phone?: string;
  } | null;
  offers: { title: string; price: number } | null;
};

export default function SubscriptionsList() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // safe loader inside effect to avoid synchronous setState warning
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getAdminSubscriptions();
        if (!mounted) return;
        if (res.success && res.data) {
          setSubscriptions(res.data as AdminSubscription[]);
        } else {
          setError(res.error || "Failed to load subscriptions");
        }
      } catch {
        if (!mounted) return;
        setError("حدث خطأ أثناء جلب الاشتراكات");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // expose a manual refresh handler (if needed by UI buttons)
  async function refreshSubscriptions() {
    setLoading(true);
    const res = await getAdminSubscriptions();
    if (res.success && res.data)
      setSubscriptions(res.data as AdminSubscription[]);
    else setError(res.error || "Failed to load subscriptions");
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "مفعل (مقبول)";
      case "cancelled":
        return "مرفوض";
      case "pending":
        return "قيد المراجعة";
      default:
        return status;
    }
  };

  const filteredSubs = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchStatus = filterStatus === "all" || sub.status === filterStatus;
      const matchSearch =
        sub.profiles?.full_name_ar?.includes(searchQuery) ||
        sub.profiles?.phone?.includes(searchQuery) ||
        sub.id.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [subscriptions, filterStatus, searchQuery]);

  if (loading)
    return <div className="p-8 text-center animate-pulse">جاري التحميل...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 py-4" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          إدارة الاشتراكات والمدفوعات
        </h1>
        <p className="text-gray-500 mt-1">
          مراجعة إيصالات الدفع وتفعيل الاشتراكات.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <RxMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد أو رقم الاشتراك..."
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 text-sm cursor-pointer min-w-37.5 outline-none"
          title="تصفية حسب الحالة"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="active">مقبول ومفعل</option>
          <option value="cancelled">مرفوض</option>
        </select>
        <button
          onClick={() => refreshSubscriptions()}
          className="px-4 py-2 bg-primary text-white rounded-2xl ml-auto sm:ml-0 hover:opacity-95 transition-colors text-sm"
          title="تحديث القائمة"
        >
          تحديث
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredSubs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            لا توجد اشتراكات مطابقة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 font-bold">المستخدم</th>
                  <th className="px-6 py-5 font-bold">الباقة</th>
                  <th className="px-6 py-5 font-bold">تاريخ الطلب</th>
                  <th className="px-6 py-5 font-bold">الحالة</th>
                  <th className="px-6 py-5 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/subscriptions/${sub.id}`)
                    }
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">
                        {sub.profiles?.full_name_ar ||
                          sub.profiles?.full_name_en ||
                          sub.profiles?.phone ||
                          "بدون اسم"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {sub.profiles?.phone || "بدون رقم هاتف"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-medium">
                      {sub.offers?.title || "باقة غير معروفة"}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString("ar-DZ")}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.status)}`}
                      >
                        {getStatusLabel(sub.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-left">
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors">
                        <RxEyeOpen className="text-lg" />
                        <span>التفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
