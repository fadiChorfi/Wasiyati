import ActionButton from "./ActionButton";
import SectionBadge from "./SectionBadge";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-background px-6 py-24 text-center">
      <div className="flex justify-center mb-8">
        <SectionBadge text="عن فريقنا" />
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-3xl leading-normal font-serif text-foreground md:text-5xl">
        فريق{" "}
        <span className="inline-flex items-center justify-center mx-2 px-1 align-middle h-8 w-16 bg-gray-200 rounded-full overflow-hidden relative top-1">
          <Image
            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=100&h=50"
            className="w-full h-full object-cover opacity-80"
            alt=""
            width={100}
            height={50}
          />
        </span>{" "}
        وصيتي هو محامٍ مخلص يركز على حماية حقوق عملائه{" "}
        <span className="inline-flex items-center justify-center mx-2 px-1 align-middle h-8 w-16 bg-gray-200 rounded-lg overflow-hidden relative top-1">
          <Image
            src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100&h=50"
            className="w-full h-full object-cover"
            alt=""
            width={100}
            height={50}
          />
        </span>{" "}
        مع توجيه واضح ونتائج ملموسة.
      </h2>

      <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-muted-foreground">
        يتم التعامل مع كل قضية بعناية واهتمام وشعور قوي بالمسؤولية. يؤمن روبرت
        بأن العملاء المطلعين يتخذون قرارات أفضل، ولهذا السبب فإن الوضوح والصدق
        يوجهان عمله.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <ActionButton label="ابدأ قضيتك" />
        <ActionButton label="احصل على عرض سعر" variant="secondary" />
      </div>
    </section>
  );
}
