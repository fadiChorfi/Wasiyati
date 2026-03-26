import ActionButton from "./ActionButton";
import Navbar from "./Navbar";
import Image from "next/image";

const stats = [
  { value: "+10", label: "سنوات خبرة" },
  { value: "95%", label: "نسبة نجاح" },
  { value: "+250", label: "قضايا منجزة" },
  { value: "100%", label: "التزام مهني" },
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white min-h-[85vh] flex flex-col pt-24"
      dir="rtl"
    >
      <Navbar />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-8 pt-10 md:grid-cols-2 flex-1 items-center">
        <div className="space-y-6 relative z-10">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs text-white/90 border border-white/20">
            SRA مرخصون ومعتمدون: 9876660
          </span>
          <h1 className="text-4xl leading-tight font-semibold md:text-6xl text-white">
            شريكك الموثوق
            <br />
            للحلول القانونية
          </h1>
          <p className="max-w-md text-sm leading-8 text-white/80">
            نقدم استشارات قانونية دقيقة للأفراد والشركات، ونبني معك استراتيجية
            واضحة لحماية حقوقك. دعنا نبني أقوى قضية معًا.
          </p>
          <div className="pt-2">
            <ActionButton label="ابدأ قضيتك" />
          </div>
        </div>

        <div className="relative flex items-end justify-center h-full min-h-100">
          {/* Placeholder for image - using a div to represent the person in the design */}
          <div className="absolute bottom-0 w-100 h-125 bg-linear-to-b from-transparent to-black/20 z-0"></div>
          {/* In a real project, this would be <Image src="/person.png" ... /> */}
          <div className="relative h-120 w-90 rounded-t-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-end justify-center overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
              alt="Lawyer"
              fill
              className="object-cover opacity-90 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#06281e] to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/10 backdrop-blur-sm mt-auto relative z-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-right">
              <p className="text-3xl font-light mb-1">{stat.value}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
