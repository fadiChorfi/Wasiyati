"use client";

import { useState, useTransition } from "react";
import { submitPayment } from "@/actions/payement";
import {
  RxCheck,
  RxCross2,
  RxFileText,
  RxLockClosed,
  RxStar,
  RxArrowLeft,
  RxUpload,
  RxClock,
} from "react-icons/rx";
import { OfferKey, OFFERS } from "@/config/offers";
import { Offer } from "@/types/database";
import { useSubscription } from "@/context/SubscriptionContext";

interface PaymentsClientProps {
  initialOfferKey: OfferKey;
  dbOffers: Offer[];
}

export default function PaymentsClient({
  initialOfferKey,
  dbOffers,
}: PaymentsClientProps) {
  const currentSubscription = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    initialOfferKey,
  );
  const [showPricing, setShowPricing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedDbOfferId = dbOffers.find(
    (o) => o.offer_key === selectedPlan,
  )?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else if (file.type === "application/pdf") {
        setPreviewUrl("pdf-placeholder");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setPreviewUrl(null);
      setSelectedFile(null);
    }, 200);
  };

  const uiPlansOptions = [
    {
      id: "basic",
      icon: RxFileText,
      colors: {
        border: "border-border",
        bg: "bg-surface",
        btn: "bg-background text-foreground border border-border hover:bg-gray-100",
        iconContainer: "bg-gray-100 text-muted-foreground",
      },
    },
    {
      id: "medium",
      icon: RxLockClosed,
      isPopular: true,
      colors: {
        border: "border-primary",
        bg: "bg-surface",
        btn: "bg-primary text-primary-foreground hover:bg-primary/95",
        iconContainer: "bg-primary/10 text-primary",
        badge: "bg-primary text-primary-foreground",
      },
    },
    {
      id: "pro",
      icon: RxStar,
      colors: {
        border: "border-accent",
        bg: "bg-gradient-to-br from-surface to-accent/5",
        btn: "bg-accent text-accent-foreground font-bold hover:opacity-90",
        iconContainer: "bg-accent/20 text-accent-foreground",
      },
    },
  ];

  if (currentSubscription && !showPricing) {
    if (currentSubscription.status === "pending") {
      return (
        <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
          <div className="max-w-2xl mx-auto mt-8 bg-surface rounded-3xl border border-blue-200 p-8 md:p-12 shadow-sm text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <RxClock className="text-4xl animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-4">
              الطلب قيد المراجعة
            </h1>
            <div className="bg-blue-50/50 rounded-2xl p-6 mb-6 w-full text-center border border-blue-100">
              <p className="text-sm font-bold text-foreground mb-1">
                الباقة المطلوبة:{" "}
                <span className="text-primary">
                  {currentSubscription.offer?.name_ar || "غير معروفة"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                تاريخ تقديم الطلب:{" "}
                {new Date(currentSubscription.created_at).toLocaleDateString(
                  "ar-DZ",
                )}
              </p>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              لقد قمنا باستلام إيصال الدفع الخاص بك بنجاح. يرجى الانتظار، طلبك
              الآن قيد المراجعة من قبل الإدارة وسيتم تفعيل حسابك فور الانتهاء من
              التحقق.
            </p>
          </div>
        </div>
      );
    }

    if (
      currentSubscription.status === "active" &&
      currentSubscription.started_at
    ) {
      const today = new Date();
      const expiration =
        new Date(currentSubscription.started_at).getTime() +
        30 * 24 * 60 * 60 * 1000;
      const diffTime = expiration - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
          <div className="bg-green-50 rounded-3xl border border-green-200 p-8 shadow-sm text-center">
            <h1 className="text-2xl font-black text-green-800 mb-4">
              اشتراكك فعّال
            </h1>
            <p className="text-green-700">
              الباقة الحالية:{" "}
              <strong>
                {currentSubscription.offer?.name_ar || "غير معروفة"}
              </strong>
            </p>
            <p className="text-green-700 mt-2">
              الأيام المتبقية:{" "}
              <strong>{diffDays > 0 ? diffDays : 0} يوماً</strong>
            </p>
          </div>
        </div>
      );
    }

    if (currentSubscription.status === "cancelled") {
      return (
        <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
          <div className="bg-red-50 rounded-3xl border border-red-200 p-8 shadow-sm text-center">
            <h1 className="text-2xl font-black text-red-800 mb-4">
              فشل الإيصال
            </h1>
            <p className="text-red-700">
              للأسف، تعذر قبول الإيصال الخاص بك للأسباب التالية:
            </p>
            <p className="text-red-900 font-bold mt-4 p-4 bg-red-100 rounded-xl inline-block">
              {currentSubscription.admin_notes
                ? currentSubscription.admin_notes
                : "مراجعة غير صالحة، يرجى إعادة المحاولة."}
            </p>
            <div className="mt-8">
              <button
                onClick={() => setShowPricing(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm mb-6 text-center md:text-right">
        <h1 className="text-2xl font-black text-foreground">
          الباقات والاشتراكات
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl">
          اختر الباقة التي تناسب تطلعاتك. نحن نوفر لك خيارات مرنة تبدأ من
          الإنشاء الأساسي وصولاً إلى الحفظ السحابي وإشعار الأطراف المعنية
          بوصيتك.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uiPlansOptions.map((uiPlan) => {
          const dbPlan = dbOffers.find((d) => d.offer_key === uiPlan.id);
          if (!dbPlan) return null;

          const Icon = uiPlan.icon;
          const isSelected = selectedPlan === uiPlan.id;
          const config = OFFERS[dbPlan.offer_key];
          const features = [
            {
              text: "إنشاء وصية قانونية",
              included: config.privileges.can_create_will,
            },
            { text: "نموذج معتمد شرعياً وقانونياً", included: true },
            {
              text: "حفظ الوصية رقمياً بشكل آمن",
              included: config.privileges.can_save_draft,
            },
            {
              text: "إمكانية التعديل لاحقاً",
              included: config.privileges.can_save_draft,
            },
            {
              text: "إشعار الجهات والورثة عند اللزوم",
              included: config.privileges.can_deliver_will,
            },
          ];

          return (
            <div
              key={dbPlan.id}
              onClick={() => setSelectedPlan(dbPlan.offer_key)}
              className={`flex flex-col relative rounded-3xl p-6 border-2 transition-all cursor-pointer ${isSelected ? uiPlan.colors.border + " shadow-md scale-[1.02]" : "border-border hover:border-gray-300"} ${uiPlan.colors.bg}`}
            >
              {uiPlan.isPopular && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full shadow-sm ${uiPlan.colors.badge}`}
                >
                  الأكثر اختياراً
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${uiPlan.colors.iconContainer}`}
                >
                  <Icon className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {dbPlan.name_ar}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-6 min-h-12">
                {dbPlan.offer_key === "basic"
                  ? "الأداة البسيطة لإنشاء وصيتك وتنزيلها للاحتفاظ بها."
                  : dbPlan.offer_key === "medium"
                    ? "الخيار الأفضل للأغلبية: إنشاء، حفظ آمن، وتعديل مستمر."
                    : "حماية مطلقة مع ضمان التنفيذ عبر إشعار المعنيين نيابة عنك."}
              </p>
              <div className="my-6 flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">
                    {dbPlan.price_dzd.toLocaleString("en-US")} د.ج
                  </span>
                  <span className="text-xs text-muted-foreground">/ شهريا</span>
                </div>
              </div>
              <div className="h-px bg-border w-full mb-6"></div>
              <ul className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feature.included ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}
                    >
                      {feature.included ? (
                        <RxCheck className="text-xs font-bold" />
                      ) : (
                        <RxCross2 className="text-xs font-bold" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${feature.included ? "text-foreground font-medium" : "text-muted-foreground line-through opacity-70"}`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(dbPlan.offer_key);
                  if (isSelected) setIsModalOpen(true);
                }}
                className={`w-full py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-auto ${isSelected ? "bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90" : uiPlan.colors.btn}`}
              >
                {isSelected ? "رفع إيصال الدفع" : "تحديد الباقة"}
                {isSelected ? (
                  <RxUpload className="text-base" />
                ) : (
                  <RxArrowLeft />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm md:max-w-md rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                رفع إيصال الدفع
              </h2>
              <button
                name="close"
                title="إغلاق"
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <RxCross2 className="text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground">
                لإتمام الاشتراك في الباقة{" "}
                <span className="font-bold text-primary">
                  {dbOffers.find((p) => p.offer_key === selectedPlan)?.name_ar}
                </span>
                ، يرجى الاستمرار برفع إيصال التحويل البنكي أو البريدي الخاص بك.
              </p>
              {previewUrl ? (
                <div className="relative border-2 border-border rounded-2xl overflow-hidden group h-40 flex items-center justify-center bg-gray-50">
                  {previewUrl === "pdf-placeholder" ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <RxFileText className="text-4xl" />
                      <p className="text-sm font-bold">ملف PDF مرفق</p>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewUrl}
                      alt="معاينة الإيصال"
                      className="w-full h-full object-contain"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      title="إزالة الصورة"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="bg-white/90 text-red-500 rounded-full p-3 shadow-md hover:bg-white hover:scale-110 transition-all"
                    >
                      <RxCross2 className="text-2xl font-bold" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-border rounded-2xl p-6 text-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group">
                  <RxUpload className="text-3xl text-gray-400 mx-auto mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-bold text-foreground">
                    اضغط هنا لاختيار الملف
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (PNG, JPG, PDF) بحد أقصى 5 ميجابايت
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <div className="p-5 bg-background border-t border-border flex gap-3">
              <button
                onClick={async () => {
                  if (!previewUrl || !selectedDbOfferId || !selectedFile) {
                    alert("يرجى اختيار ملف صحيح");
                    return;
                  }

                  startTransition(async () => {
                    const formData = new FormData();
                    formData.append("offer_id", selectedDbOfferId);
                    formData.append("receipt", selectedFile);
                    console.log("offer id: ", selectedDbOfferId);

                    const res = await submitPayment(formData);
                    if (res.success) {
                      alert(
                        res.isNew
                          ? "تم إرسال إيصالك للمراجعة بنجاح! سيتم إشعارك قريباً."
                          : "لديك اشتراك نشط مسبقاً.",
                      );
                      closeModal();
                    } else {
                      alert("حدث خطأ: " + res.error);
                    }
                  });
                }}
                disabled={!previewUrl || isPending}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {isPending ? "جاري الإرسال..." : "تأكيد الإرسال"}
              </button>
              <button
                title="إلغاء الأمر"
                onClick={closeModal}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-surface border border-border text-foreground hover:bg-gray-50 transition active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
