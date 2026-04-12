"use client";

import { useState } from "react";
import { RxArrowTopLeft } from "react-icons/rx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ActionButton from "./ActionButton";
import SectionBadge from "./SectionBadge";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "الوصية العامة",
    description:
      "خدمة تمكّنك من إنشاء وصية شاملة تشمل أموالك وأعمالك، مع احترام أحكام الشريعة الإسلامية والقانون الجزائري.",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "وصية بالأموال",
    description:
      "خدمة تمكّنك من تخصيص وتوزيع أموالك أو ممتلكاتك بدقة بعد الوفاة، مع الالتزام بأحكام الشريعة الإسلامية والقانون الجزائري.",
    image: "/money.webp",
  },
  {
    title: "وصية بالأعمال",
    description:
      "خدمة تمكّنك من تحديد وتنظيم الأعمال أو المهام التي ترغب في تنفيذها بعد وفاتك، وفقًا للأحكام الشرعية والقانونية المعمول بها.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400",
  },
];

export default function ServicesSection() {
  const [hoverStyle, setHoverStyle] = useState({
    opacity: 0,
    left: 0,
    width: 0,
  });

  return (
    <section
      id="services"
      className="bg-white px-6 pb-24 pt-16 rounded-[40px] mx-4 mb-4"
    >
      <div className="mx-auto max-w-6xl" dir="rtl">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row  md:items-center">
          <div>
            <div className="mb-4">
              <SectionBadge text="خدماتنا" />
            </div>
            <h2 className="text-4xl leading-tight font-serif text-foreground md:text-5xl">
              خدمات قانونية{" "}
              <span className="opacity-40 italic font-serif">موثوقة</span>
              <br />
              يمكنك البدء بها بسهولة
            </h2>
          </div>
          <div className="flex flex-col  gap-6 text-right">
            <p className="max-w-md text-sm leading-8 text-muted-foreground">
              منصة رقمية تساعدك على إعداد وصيتك وتنظيم شؤونك القانونية بطريقة
              واضحة وآمنة، بإشراف مختصين ومراجعة قانونية دقيقة.
            </p>
            <div className="hidden gap-2">
              <button
                title="السابق"
                aria-label="السابق"
                className="h-10 w-10 text-sm rounded-full border border-border flex items-center justify-center hover:bg-gray-50 text-foreground transition-colors"
              >
                <FaArrowRight />
              </button>
              <button
                title="التالي"
                aria-label="التالي"
                className="h-10 w-10 text-sm rounded-full bg-[#c6a96a] text-white flex items-center justify-center hover:bg-[#b0965f] transition-colors"
              >
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </div>

        <div
          className="relative"
          onMouseLeave={() =>
            setHoverStyle((prev) => ({ ...prev, opacity: 0 }))
          }
        >
          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {services.map((service) => (
              <div
                key={service.title}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  setHoverStyle({
                    opacity: 1,
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                  });
                }}
                className="relative"
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>

          {/* Hover highlight background */}
          <div
            className="absolute rounded-4xl bg-[#d0e0db] transition-all duration-300 ease-out hidden md:block z-0 pointer-events-none"
            style={{
              opacity: hoverStyle.opacity,
              left: hoverStyle.left,
              width: hoverStyle.width,
              height: "calc(100% + 2rem)",
              top: "-1rem",
              transform: "scaleX(1.09)", // Slightly enlarge to create a padding effect around the card without messing up exact physical coordinates
            }}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4" dir="ltr">
            <ActionButton
              label="اكتشف جميع الباقات و الأسعار"
              variant="primary"
              className="  text-base font-bold hidden md:inline-flex   text-white"
              icon={<RxArrowTopLeft />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
