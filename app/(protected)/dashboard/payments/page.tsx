"use client";

import { useState } from "react";
import {
  RxCheck,
  RxCross2,
  RxFileText,
  RxLockClosed,
  RxStar,
  RxArrowLeft,
} from "react-icons/rx";

export default function PaymentsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("medium");

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
                className={`w-full py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.colors.btn
                }`}
              >
                {isSelected ? "الباقة المختارة" : "اختيار الباقة"}
                {!isSelected && <RxArrowLeft />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
