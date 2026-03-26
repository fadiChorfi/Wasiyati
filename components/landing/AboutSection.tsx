import SectionBadge from "./SectionBadge";
import Image from "next/image";
import { RxCheck } from "react-icons/rx";

const trustPoints = [
  "خطوات واضحة ومنظمة",
  "مراجعة بشرية من مختصين",
  "حماية وسرية المعلومات",
  "متابعة حالة الطلب بسهولة",
];

export default function AboutSection() {
  return (
    <section className="bg-background px-6 py-24" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="flex  mb-12">
          <SectionBadge text="من نحن" />
        </div>

        <div className="flex flex-col gap-16 md:flex-row md:items-center">
          {/* Right side for Text */}
          <div className="flex flex-1 flex-col items-start space-y-6 text-right">
            <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              هدفنا هو جعل إعداد وصيتك عملية بسيطة وآمنة دون تعقيد أو غموض.
            </h2>

            <div className="space-y-4 text-base leading-8 text-muted-foreground m-0 p-0">
              <p>
                نحن منصة رقمية تهدف إلى تبسيط الإجراءات القانونية المتعلقة
                بإعداد الوصية من خلال نظام منظم وواضح. نوفر للمستخدم تجربة سهلة
                تبدأ باختيار الخدمة، مرورًا بتعبئة المعلومات المطلوبة، وصولًا
                إلى مراجعة الطلب من طرف مختصين لضمان دقة الإجراءات واحترام
                الشروط القانونية.
              </p>
              <p>
                نؤمن أن التعامل مع الأمور القانونية يجب أن يكون واضحًا وآمنًا
                ومتاحًا للجميع، لذلك قمنا ببناء منصة تجمع بين التكنولوجيا
                والخبرة القانونية لتقديم خدمة موثوقة وشفافة.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 w-full">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 text-sm font-semibold text-foreground"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#19714f]/10 text-[#19714f]">
                    <RxCheck className="h-4 w-4" />
                  </span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Left side for Image */}
          <div className="flex-1 w-full">
            <div className="relative h-87.5 w-full md:h-125 overflow-hidden rounded-[28px] bg-gray-100 shadow-sm">
              <Image
                src="/about.jpg"
                className="object-cover"
                alt="من نحن"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
