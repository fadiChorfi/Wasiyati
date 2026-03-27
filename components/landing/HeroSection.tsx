import { RxArrowTopLeft } from "react-icons/rx";
import ActionButton from "./ActionButton";
import Image from "next/image";

const stats = [
  { value: "إجراءات", label: "آمنة" },
  { value: "مراجعة", label: "من الخبراء" },
  { value: "اعتماد", label: "سريع" },
  { value: "سرية", label: "تامة" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white min-h-[85vh] flex flex-col pt-24 mx-4"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full mx-auto max-w-5xl gap-8 px-6 pb-8 pt-10 flex-1">
        <div className="space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs text-white/90 border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            منصة مخصصة وموثوقة قانونياً
          </span>
          <h1 className="text-5xl leading-tight font-bold md:text-5xl text-white">
            أنشئ وصيتك بسهولة
            <br />
            وبخطوات قانونية واضحة
          </h1>
          <p className="max-w-md text-base leading-8 text-white/80">
            منصة رقمية تساعدك على إعداد وصيتك من خلال عملية منظمة تبدأ باختيار
            الخدمة، ثم تقديم المعلومات، ومراجعتها من طرف مختصين قبل اعتمادها
            بشكل نهائي.
          </p>
          <div className="pt-2">
            <ActionButton
              label="كيف تعمل المنصة؟"
              variant="secondary"
              className="  text-base font-bold hidden md:flex md:flex-row "
              icon={<RxArrowTopLeft />}
            />
          </div>
        </div>

        {/* <div className="relative hidden items-end justify-center h-full min-h-100">
          <div className="relative h-95 w-70 rounded-t-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-end justify-center overflow-hidden">
            <Image
              src="/header.png"
              alt="Lawyer"
              fill
              className="object-cover opacity-90 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#06281e] to-transparent"></div>
          </div>
        </div> */}
      </div>

      <div className="border-t  border-white/10  backdrop-blur-sm mt-auto  max-w-5xl mx-auto relative z-10 w-full">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 px-6 py-6 md:flex md:justify-between md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-right">
              <p className="text-3xl font-medium  mb-1">{stat.value}</p>
              <p className="text-xs text-white/60  uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-23 top-16  h-220 w-110  justify-center min-h-100">
        <Image
          src="/header.png"
          alt="Lawyer"
          fill
          className="object-cover "
          priority
        />
      </div>
    </section>
  );
}
