"use client";
import React, { useState } from "react";
import {
  RxCheck,
  RxCross2,
  RxFileText,
  RxLockClosed,
  RxStar,
  RxArrowLeft,
} from "react-icons/rx";
import { OFFERS } from "@/config/offers";
import Link from "next/link";

export default function OfferPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("medium");

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

  return (
    <div
      className="space-y-6 md:px-6 py-4 pb-24 md:pb-6 mt-16 max-w-6xl mx-auto"
      dir="rtl"
    >
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm mb-6 text-center md:text-right">
        <h1 className="text-3xl font-black text-foreground">
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
          const config = OFFERS[uiPlan.id as keyof typeof OFFERS];
          if (!config) return null;

          const Icon = uiPlan.icon;
          const isSelected = selectedPlan === uiPlan.id;
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
              key={config.key}
              onClick={() => setSelectedPlan(config.key)}
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
                    {config.name_ar}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-6 min-h-12">
                {config.key === "basic"
                  ? "الأداة البسيطة لإنشاء وصيتك وتنزيلها للاحتفاظ بها."
                  : config.key === "medium"
                    ? "الخيار الأفضل للأغلبية: إنشاء، حفظ آمن، وتعديل مستمر."
                    : "حماية مطلقة مع ضمان التنفيذ عبر إشعار المعنيين نيابة عنك."}
              </p>
              <div className="my-6 flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">
                    {config.price_dzd.toLocaleString("en-US")} د.ج
                  </span>
                </div>
              </div>
              <div className="h-px bg-border w-full mb-6"></div>
              <ul className="space-y-4 mb-8 flex-1">
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

              <Link href={`/dashboard/payments?offer_key=${config.key}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`w-full py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-auto ${isSelected ? "bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90" : uiPlan.colors.btn}`}
                >
                  الاشتراك في الباقة
                  <RxArrowLeft />
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12 bg-primary/5 rounded-3xl p-6 border border-primary/10">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
          <RxLockClosed className="text-primary text-lg" />
          <span className="font-bold">ملاحظة:</span> يجب عليك تسجيل الدخول أو
          إنشاء حساب جديد لإتمام الاشتراك ورفع الإيصال.
        </p>
      </div>
    </div>
  );
}
