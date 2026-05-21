"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RxArrowRight, RxCheck, RxCross2 } from "react-icons/rx";
import {
  getAdminSubscriptionById,
  updateSubscriptionStatusAdmin,
} from "@/actions/payement";
import Image from "next/image";

// Extended interface matching the joined data
interface SubscriptionData {
  id: string;
  status: "active" | "cancelled" | "pending";
  created_at: string;
  receipt_url: string;
  payment_method: string | null;
  profiles: {
    full_name_ar: string;
    full_name_en: string;
    phone: string;
  } | null;
  offers: { title: string; price: number; description: string } | null;
}

export default function SubscriptionDetails() {
  const params = useParams<{ subId: string }>();
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [showRejectComment, setShowRejectComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAdminSubscriptionById(params.subId);
      if (res.success && res.data) setSub(res.data as SubscriptionData);
      setLoading(false);
    };
    fetchData();
  }, [params.subId]);

  const handleAction = async (status: "active" | "cancelled") => {
    if (!sub) return;

    if (status === "cancelled" && !showRejectComment) {
      setShowRejectComment(true);
      return;
    }

    if (status === "cancelled" && showRejectComment && !adminComment.trim()) {
      toast.error("الرجاء إدخال سبب الرفض");
      return;
    }

    setProcessing(true);
    const res = await updateSubscriptionStatusAdmin(
      params.subId,
      status,
      adminComment,
    );
    if (res.success) {
      setSub({ ...sub, status });
      setShowRejectComment(false);
    } else {
      toast.error("حدث خطأ أثناء التحديث");
    }
    setProcessing(false);
  };

  if (loading)
    return (
      <div className="p-8 text-center animate-pulse flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  if (!sub)
    return (
      <div className="p-8 text-center text-red-500">الاشتراك غير موجود</div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 md:px-6 py-4" dir="rtl">
      <div className="flex items-center gap-4 bg-surface p-4 rounded-3xl shadow-sm border border-border">
        <button
          title="العودة"
          onClick={() => router.push("/admin/dashboard/subscriptions")}
          className="p-3 bg-background hover:bg-primary/5 rounded-2xl transition-colors border border-border group"
        >
          <RxArrowRight className="text-xl text-muted-foreground group-hover:text-primary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            مراجعة إيصال الدفع
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-4">
              بيانات المستخدم
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الاسم</span>
                <span className="font-bold text-foreground">
                  {sub.profiles?.full_name_ar || sub.profiles?.full_name_en}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الجوال</span>
                <span className="font-bold text-foreground" dir="ltr">
                  {sub.profiles?.phone || "غير متوفر"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-4">
              بيانات الباقة
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الباقة</span>
                <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-xl">
                  {sub.offers?.title}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">السعر</span>
                <span className="font-bold text-foreground">
                  {sub.offers?.price} د.ج
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">طريقة الدفع</span>
                <span className="font-bold text-foreground bg-primary/5 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5">
                  {sub.payment_method === "baridi_mob" ? (
                    <>
                      <span className="text-primary">📱</span>
                      بريدي موب
                    </>
                  ) : (
                    <>
                      <span className="text-primary">💳</span>
                      CCP
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">تاريخ الطلب</span>
                <span className="font-bold text-foreground" dir="">
                  {new Date(sub.created_at).toLocaleString("ar-DZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {sub.status === "pending" && (
            <div className="p-6 rounded-3xl shadow-sm border border-primary/20 bg-primary/5">
              <h3 className="text-lg font-bold text-foreground mb-4">
                القرار المحاسبي
              </h3>

              {showRejectComment && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    سبب الرفض (يظهر للعميل)
                  </label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 text-sm outline-none resize-none"
                    rows={3}
                    placeholder="يرجى توضيح سبب رفض الإيصال..."
                  ></textarea>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleAction("active")}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-md active:scale-95"
                >
                  <RxCheck className="text-xl" /> قبول وتفعيل
                </button>
                <button
                  onClick={() => handleAction("cancelled")}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-sm active:scale-95"
                >
                  <RxCross2 className="text-xl" /> رفض الإيصال
                </button>
              </div>
            </div>
          )}

          {sub.status !== "pending" && (
            <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border text-center">
              <span
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold ${sub.status === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
              >
                {sub.status === "active" ? (
                  <RxCheck className="text-xl" />
                ) : (
                  <RxCross2 className="text-xl" />
                )}
                الحالة الحالية:{" "}
                {sub.status === "active" ? "مقبول ومفعل" : "مرفوض"}
              </span>
            </div>
          )}
        </div>

        {/* Left Receipt Column */}
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col min-h-125">
          <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-4">
            مرفق الإيصال
          </h3>
          <div className="flex-1 w-full relative bg-background rounded-2xl overflow-hidden border border-border flex items-center justify-center">
            {sub.receipt_url ? (
              <a
                href={sub.receipt_url}
                target="_blank"
                rel="noreferrer"
                className="w-full h-full relative group flex items-center justify-center"
              >
                {sub.receipt_url
                  .toLowerCase()
                  .match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/) ? (
                  <Image
                    src={sub.receipt_url}
                    alt="إيصال الدفع"
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-primary group-hover:bg-primary/5 w-full h-full transition-colors">
                    <span className="font-bold underline px-6 py-3 bg-primary/10 rounded-2xl">
                      اضغط هنا لعرض المرفق (PDF/ملف)
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold backdrop-blur-sm">
                  انقر لفتح الإيصال بحجم كامل
                </div>
              </a>
            ) : (
              <span className="text-muted-foreground font-medium">
                لا يوجد إيصال مرفق
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
