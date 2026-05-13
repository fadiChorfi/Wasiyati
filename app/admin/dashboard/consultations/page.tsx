"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ConsultationRequestRow,
  ConsultationStatus,
  getAdminConsultationRequests,
  updateConsultationRequestStatus,
} from "@/actions/consultation";
import { RxCheck, RxClock, RxCross2, RxEyeOpen, RxReload } from "react-icons/rx";

type FilterStatus = "all" | ConsultationStatus;
type FilterType = "all" | "general" | "real_estate";

export default function AdminConsultationsPage() {
  const MESSAGE_PREVIEW_LIMIT = 90;
  const [requests, setRequests] = useState<ConsultationRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequestRow | null>(null);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      setError(null);
      const result = await getAdminConsultationRequests();

      if (!result.success || !result.data) {
        setError(result.error || "تعذر تحميل طلبات الاستشارة");
        setLoading(false);
        return;
      }

      setRequests(result.data);
      setLoading(false);
    }

    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus = filterStatus === "all" || request.status === filterStatus;
      const matchesType = filterType === "all" || request.type === filterType;
      return matchesStatus && matchesType;
    });
  }, [requests, filterStatus, filterType]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const closedCount = requests.filter((r) => r.status === "closed").length;
  const generalCount = requests.filter((r) => r.type === "general").length;
  const realEstateCount = requests.filter((r) => r.type === "real_estate").length;

  const closeRequest = async (requestId: string) => {
    setUpdatingId(requestId);
    const result = await updateConsultationRequestStatus(requestId, "closed");
    if (!result.success) {
      setError(result.error || "فشل تحديث الحالة");
      setUpdatingId(null);
      return;
    }

    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "closed" } : request,
      ),
    );
    setSelectedRequest((prev) =>
      prev && prev.id === requestId ? { ...prev, status: "closed" } : prev,
    );
    setUpdatingId(null);
  };

  const getMessagePreview = (message: string) => {
    if (message.length <= MESSAGE_PREVIEW_LIMIT) return message;
    return `${message.slice(0, MESSAGE_PREVIEW_LIMIT)}...`;
  };

  const getTypeLabel = (type: string | null) => {
    switch (type) {
      case "real_estate":
        return "وصية على عقار";
      case "general":
        return "استشارة عامة";
      default:
        return "-";
    }
  };

  const badgeStyle = (status: ConsultationStatus) =>
    status === "pending"
      ? {
          bg: "bg-accent/10",
          text: "text-accent-foreground",
          dot: "bg-accent",
          label: "قيد المتابعة",
        }
      : {
          bg: "bg-primary/10",
          text: "text-primary",
          dot: "bg-primary",
          label: "مغلقة",
        };

  if (loading) {
    return (
      <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-10 text-center">
          <p className="text-muted-foreground">جاري تحميل طلبات الاستشارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 text-right">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">
            طلبات الاستشارة
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            راجع الطلبات وتابع الاتصال الهاتفي مع العملاء
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-foreground">{requests.length}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground">قيد المتابعة</p>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground">مغلقة</p>
          <p className="text-2xl font-bold text-foreground">{closedCount}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground">استشارة عامة</p>
          <p className="text-2xl font-bold text-foreground">{generalCount}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground">وصية على عقار</p>
          <p className="text-2xl font-bold text-foreground">{realEstateCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value as FilterStatus)}
          className="h-10 rounded-xl border border-border bg-surface px-4 text-sm text-foreground w-full sm:w-44 outline-none"
          title="تصفية حسب الحالة"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">قيد المتابعة</option>
          <option value="closed">مغلقة</option>
        </select>
        <select
          value={filterType}
          onChange={(event) => setFilterType(event.target.value as FilterType)}
          className="h-10 rounded-xl border border-border bg-surface px-4 text-sm text-foreground w-full sm:w-44 outline-none"
          title="تصفية حسب النوع"
        >
          <option value="all">جميع الأنواع</option>
          <option value="general">استشارة عامة</option>
          <option value="real_estate">وصية على عقار</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium bg-red-500/10 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">
            قائمة طلبات الاستشارة
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            لا توجد طلبات مطابقة للتصفية الحالية
          </div>
        ) : (
          <div className="p-4 md:p-5">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/40">
                <tr>
                <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  العميل
                </th>
                <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  نوع الاستشارة
                </th>
                <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  الهاتف
                </th>
                  <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    الرسالة
                  </th>
                  <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    التاريخ
                  </th>
                  <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    الحالة
                  </th>
                  <th className="h-11 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    إجراء
                  </th>
                </tr>
              </thead>
                <tbody>
                {filteredRequests.map((request) => {
                  const style = badgeStyle(request.status);

                  return (
                    <tr
                      key={request.id}
                      className="border-t border-border transition-colors hover:bg-muted/30"
                    >
                      <td className="p-4 align-top">
                        <p className="font-bold text-foreground">{request.full_name}</p>
                        {request.email && (
                          <p className="text-xs text-muted-foreground">{request.email}</p>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <span className="text-xs font-bold text-foreground bg-muted/40 rounded-full px-2.5 py-1">
                          {getTypeLabel(request.type)}
                        </span>
                      </td>
                      <td className="p-4 align-top text-foreground whitespace-nowrap" dir="ltr">
                        {request.phone}
                      </td>
                      <td className="p-4 align-top">
                        <p className="text-sm text-foreground max-w-lg">
                          {getMessagePreview(request.message)}
                        </p>
                      </td>
                      <td className="p-4 align-top text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(request.created_at).toLocaleDateString("ar-DZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                          {style.label}
                        </span>
                      </td>
                      <td className="p-4 align-top">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90"
                        >
                          <RxEyeOpen />
                          فتح
                        </button>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredRequests.map((request) => {
                const style = badgeStyle(request.status);

                return (
                  <div
                    key={request.id}
                    className="rounded-xl border border-border bg-background p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground text-sm">{request.full_name}</p>
                        {request.email && (
                          <p className="text-xs text-muted-foreground mt-0.5">{request.email}</p>
                        )}
                        <span className="inline-block mt-1 text-[10px] font-bold text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5">
                          {getTypeLabel(request.type)}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${style.bg} ${style.text}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${style.dot}`}></span>
                        {style.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground" dir="ltr">{request.phone}</span>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString("ar-DZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-5 line-clamp-2">
                      {getMessagePreview(request.message)}
                    </p>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="self-start inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90"
                    >
                      <RxEyeOpen />
                      فتح
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h4 className="text-base font-bold text-foreground">تفاصيل طلب الاستشارة</h4>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-9 h-9 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <RxCross2 />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-background border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">الاسم الكامل</p>
                  <p className="font-bold text-foreground">{selectedRequest.full_name}</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">رقم الهاتف</p>
                  <p className="font-bold text-foreground" dir="ltr">
                    {selectedRequest.phone}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">البريد الإلكتروني</p>
                  <p className="font-bold text-foreground">
                    {selectedRequest.email || "غير متوفر"}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">نوع الاستشارة</p>
                  <p className="font-bold text-foreground">
                    {getTypeLabel(selectedRequest.type)}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">التاريخ</p>
                  <p className="font-bold text-foreground">
                    {new Date(selectedRequest.created_at).toLocaleDateString("ar-DZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-xs mb-2">حالة الطلب</p>
                {(() => {
                  const style = badgeStyle(selectedRequest.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                      {style.label}
                    </span>
                  );
                })()}
              </div>

              <div className="bg-background border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-xs mb-2">نص الرسالة</p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-7">
                  {selectedRequest.message}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="h-10 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-bold"
                >
                  إغلاق النافذة
                </button>
                {selectedRequest.status === "pending" ? (
                  <button
                    onClick={() => closeRequest(selectedRequest.id)}
                    disabled={updatingId === selectedRequest.id}
                    className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-70"
                  >
                    {updatingId === selectedRequest.id ? (
                      <>
                        <RxReload className="animate-spin" />
                        جاري الإغلاق
                      </>
                    ) : (
                      <>
                        <RxCheck />
                        إغلاق الطلب
                      </>
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2">
                    <RxClock />
                    تم إغلاق هذا الطلب
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
