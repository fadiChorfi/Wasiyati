"use client";

import { useState } from "react";
import {
  RxCheck,
  RxCross2,
  RxFileText,
  RxLockClosed,
  RxStar,
  RxArrowLeft,
  RxUpload,
} from "react-icons/rx";

export default function PaymentsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("medium");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (file.type === "application/pdf") {
        // Just show a generic PDF placeholder or the file name
        setPreviewUrl("pdf-placeholder");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setPreviewUrl(null), 200); // clear preview after animation
  };

  const plans = [
    {
      id: "basic",
      name: "الأساسية",
      price: "1,500 د.ج",
      period: "تدفع مرة واحدة",
      description: "الأداة البسيطة لإنشاء وصيتك وتنزيلها للاحتفاظ بها.",
      icon: RxFileText,
      features: [
        { text: "إنشاء وصية قانونية", included: true },
        { text: "نموذج معتمد شرعياً وقانونياً", included: true },
        { text: "حفظ الوصية رقمياً بشكل آمن", included: false },
        { text: "إمكانية التعديل لاحقاً", included: false },
        { text: "إشعار الجهات والورثة عند اللزوم", included: false },
      ],
      colors: {
        border: "border-border",
        bg: "bg-surface",
        btn: "bg-background text-foreground border border-border hover:bg-gray-100",
        iconContainer: "bg-gray-100 text-muted-foreground",
      },
    },
    {
      id: "medium",
      name: "المتوسطة",
      price: "3,500 د.ج",
      period: "شهريا",
      description: "الخيار الأفضل للأغلبية: إنشاء، حفظ آمن، وتعديل مستمر.",
      icon: RxLockClosed,
      isPopular: true,
      features: [
        { text: "إنشاء وصية قانونية", included: true },
        { text: "نموذج معتمد شرعياً وقانونياً", included: true },
        { text: "حفظ الوصية رقمياً بشكل آمن", included: true },
        { text: "إمكانية التعديل لاحقاً", included: true },
        { text: "إشعار الجهات والورثة عند اللزوم", included: false },
      ],
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
      name: "الشاملة (Pro)",
      price: "6,000 د.ج",
      period: "شهريا",
      description: "حماية مطلقة مع ضمان التنفيذ عبر إشعار المعنيين نيابة عنك.",
      icon: RxStar,
      features: [
        { text: "إنشاء وصية قانونية", included: true },
        { text: "نموذج معتمد شرعياً وقانونياً", included: true },
        { text: "حفظ الوصية رقمياً بشكل آمن", included: true },
        { text: "إمكانية التعديل لاحقاً", included: true },
        { text: "إشعار الجهات والورثة عند اللزوم", included: true },
      ],
      colors: {
        border: "border-accent",
        bg: "bg-gradient-to-br from-surface to-accent/5",
        btn: "bg-accent text-accent-foreground font-bold hover:opacity-90",
        iconContainer: "bg-accent/20 text-accent-foreground",
      },
    },
  ];

  return (
    <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {/* HEADER */}
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

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                isSelected
                  ? plan.colors.border + " shadow-md scale-[1.02]"
                  : "border-border hover:border-gray-300"
              } ${plan.colors.bg}`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full shadow-sm ${plan.colors.badge}`}
                >
                  الأكثر اختياراً
                </div>
              )}

              {/* Title & Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${plan.colors.iconContainer}`}
                >
                  <Icon className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {plan.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-6 min-h-12">
                {plan.description}
              </p>

              {/* Price */}
              <div className="my-6 flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {plan.period}
                </span>
              </div>

              <div className="h-px bg-border w-full mb-6"></div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        feature.included
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {feature.included ? (
                        <RxCheck className="text-xs font-bold" />
                      ) : (
                        <RxCross2 className="text-xs font-bold" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-foreground font-medium"
                          : "text-muted-foreground line-through opacity-70"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                  if (isSelected) {
                    setIsModalOpen(true);
                  }
                }}
                className={`w-full py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-auto ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90"
                    : plan.colors.btn
                }`}
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

      {/* UPLOAD RECEIPT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm md:max-w-md rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                رفع إيصال الدفع
              </h2>
              <button
                aria-label="إغلاق"
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
                  {plans.find((p) => p.id === selectedPlan)?.name}
                </span>
                ، يرجى الاستمرار برفع إيصال التحويل البنكي أو البريدي الخاص بك.
                سيتم تفعيل حسابك فور التحقق.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-xs text-primary font-bold">
                  الحساب البريدي (CCP)
                </p>
                <p
                  className="text-base font-black text-foreground mt-1 tracking-[0.2em]"
                  dir="ltr"
                >
                  12345678 99
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  الاسم: وصيتي
                </p>
              </div>

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
                      onClick={() => setPreviewUrl(null)}
                      title="حذف الصورة"
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
                onClick={() => {
                  alert("تم إرسال إيصالك للمراجعة بنجاح! سيتم إشعارك قريباً.");
                  closeModal();
                }}
                disabled={!previewUrl}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                تأكيد الإرسال
              </button>
              <button
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
