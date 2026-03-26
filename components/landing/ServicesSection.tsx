import ActionButton from "./ActionButton";
import SectionBadge from "./SectionBadge";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "التمثيل القانوني",
    description:
      "مرافعة احترافية وتمثيل كامل أمام الجهات القضائية لحماية مصالحك بأعلى مستوى.",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "قضايا التعويض",
    description:
      "متابعة دقيقة لملفات الأضرار والإصابات لضمان الحصول على تعويض عادل ومنصف.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "قضايا الأسرة",
    description:
      "حلول قانونية متوازنة وحساسة لملفات الأسرة بما يحقق الأمان والاستقرار.",
    image:
      "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&q=80&w=400",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white px-6 pb-24 pt-16 rounded-[40px] mx-4 mb-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4">
              <SectionBadge text="مجالات الممارسة" />
            </div>
            <h2 className="text-4xl leading-tight font-serif text-foreground md:text-5xl">
              خدمات قانونية{" "}
              <span className="opacity-40 italic font-serif">موثوقة</span>
              <br />
              يمكنك الاعتماد عليها
            </h2>
          </div>
          <div className="flex flex-col items-end gap-6">
            <p className="max-w-md text-sm leading-7 text-muted-foreground md:text-left rtl:md:text-left">
              يعمل توماس عن كثب مع العملاء، ويقدم حلولاً قانونية واضحة وعملية
              بثقة وشفافية.
            </p>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-gray-50 text-foreground">
                ←
              </button>
              <button className="h-10 w-10 rounded-full bg-[#c6a96a] text-white flex items-center justify-center hover:bg-[#b0965f]">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              هل تحتاج لمساعدة؟
            </span>
            <ActionButton label="ابدأ قضيتك" />
          </div>
        </div>
      </div>
    </section>
  );
}
