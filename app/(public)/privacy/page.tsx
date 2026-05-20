import { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import {
  RxCheck,
  RxInfoCircled,
  RxLockClosed,
  RxEnvelopeClosed,
  RxArrowLeft,
  RxReader,
  RxFileText,
} from "react-icons/rx";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | وصيتي",
  description:
    "سياسة الخصوصية لمنصة وصيتي — كيف نجمع ونستخدم ونحمي بياناتك الشخصية وفقاً للقانون الجزائري.",
};

const navItems = [
  { id: "intro", label: "مقدمة" },
  { id: "data-collected", label: "البيانات المجمعة" },
  { id: "purpose", label: "غرض المعالجة" },
  { id: "protection", label: "الحماية والأمن" },
  { id: "sharing", label: "المشاركة والإفصاح" },
  { id: "updates", label: "التحديثات" },
  { id: "contact", label: "اتصل بنا" },
];

const today = new Date();
const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "ماي",
  "يونيو",
  "يوليو",
  "أوت",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
const lastUpdated = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

export default function PrivacyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground pb-16">
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-28 pb-28 px-6 rounded-b-[40px] mx-2 mb-14">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-[#c6a96a]/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-1.5 text-xs text-white/80 mb-6 border border-white/10">
            <RxLockClosed className="text-[#c6a96a] text-base" />
            آخر تحديث: {lastUpdated}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            سياسة الخصوصية
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            الشفافية ثقة. نوضح لك كيف نجمع بياناتك، ولماذا، وكيف نحميها بما
            يتوافق مع القانون الجزائري لحماية المعطيات الشخصية.
          </p>
        </div>
      </section>

      {/* ─────────────── TABLE OF CONTENTS ─────────────── */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <nav className="flex gap-2 text-nowrap">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ─────────────── CONTENT ─────────────── */}
      <div className="max-w-4xl mx-auto px-6 mt-14 space-y-16">
        {/* 1 ─ مقدمة */}
        <Section id="intro" num="1" title="مقدمة">
          <p className="text-lg leading-loose text-muted-foreground">
            في <strong className="text-foreground">وصيتي</strong>، نؤمن أن
            خصوصيتك ليست مجرد التزام قانوني — بل هي أساس الثقة التي تجعل منصتنا
            آمنة لك ولعائلتك. تحدد هذه السياسة كيفية جمع واستخدام وحماية بياناتك
            الشخصية عند استخدام منصة وصيتي.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            نحن ملتزمون بمعالجة بياناتك وفقاً لأحكام{" "}
            <strong className="text-foreground">القانون الجزائري</strong>{" "}
            المتعلق بحماية الأشخاص الطبيعيين في معالجة المعطيات ذات الطابع
            الشخصي، والموافق للأحكام العامة للائحة العامة لحماية البيانات
            (GDPR).
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            استخدامك للمنصة يعني موافقتك على الممارسات الموضحة في هذه السياسة.
            إذا كانت لديك استفسارات، يمكنك التواصل معنا عبر{" "}
            <a
              href="mailto:support@wasiyati.dz"
              className="text-primary font-bold underline underline-offset-2 decoration-primary/30 hover:decoration-primary"
            >
              support@wasiyati.dz
            </a>
            .
          </p>
        </Section>

        {/* 2 ─ البيانات المجمعة */}
        <Section id="data-collected" num="2" title="البيانات التي نجمعها">
          <p className="text-lg leading-loose text-muted-foreground mb-8">
            نحن مسؤولون عن جمع الحد الأدنى الضروري من البيانات لتقديم خدماتنا.
            لا نجمع بيانات لمجرد الجمع. إليك ما قد نجمعه حسب الخدمات التي
            تستخدمها:
          </p>

          <div className="grid grid-cols-1 gap-5">
            {[
              {
                icon: <RxFileText className="text-2xl" />,
                title: "البيانات الأساسية",
                items: ["معلومات التسجيل", "بيانات الوصية", "معلومات الدفع"],
                note: "نحن لا نطلب أو نخزن معلومات بطاقات الدفع",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-3xl p-6 hover:shadow-md hover:border-primary/15 transition-all"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-foreground text-base mb-3">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-sm text-muted-foreground flex gap-2 items-baseline"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c6a96a] shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                {card.note && (
                  <p className="mt-3 text-xs text-primary font-bold flex items-center gap-1.5">
                    <RxInfoCircled />
                    {card.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* 3 ─ غرض المعالجة */}
        <Section id="purpose" num="3" title="لماذا نجمع بياناتك؟">
          <p className="text-lg leading-loose text-muted-foreground mb-6">
            نستخدم بياناتك للأغراض التالية فقط:
          </p>
          <div className="space-y-4">
            {[
              {
                title: "تقديم الخدمات الأساسية",
                desc: "تمكينك من إنشاء وإدارة وصيتك رقمياً.",
              },
              {
                title: "التحقق من الهوية والأمان",
                desc: "المصادقة عند تسجيل الدخول، منع الاحتيال، وحماية حسابك من الوصول غير المصرح به.",
              },
              {
                title: "المدفوعات والاشتراكات",
                desc: "إرسال وصولات الدفع وتفعيل الباقات حسب الاشتراك.",
              },
              {
                title: "التواصل والدعم",
                desc: "الرد على استفساراتك، إشعارك بتحديثات الخدمة، وإرسال إشعارات مهمة.",
              },
              {
                title: "الامتثال القانوني",
                desc: "الوفاء بالالتزامات المنصوص عليها في القانون الجزائري والقرارات القضائية.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-surface border border-border rounded-2xl p-5 hover:border-primary/20 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4 ─ الحماية والأمن */}
        <Section id="protection" num="4" title="كيف نحمي بياناتك؟">
          <div className="bg-linear-to-br from-primary/4 to-primary/8 border border-primary/15 rounded-3xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 text-3xl">
                <RxLockClosed />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-xl mb-2">
                  نحن مسؤولون عن أمن بياناتك
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  نطبق أحدث معايير الأمان لحماية معلوماتك الحساسة. بنيتنا
                  التحتية تعتمد على Supabase (خوادم موزعة عالمياً مع تشفير كامل)
                  وتقنيات أمان متعددة الطبقات.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: <RxLockClosed />,
                title: "تشفير البيانات",
                desc: "جميع البيانات الحساسة مشفرة عند التخزين لحمايتها من الوصول غير المصرح به.",
              },
              {
                icon: <RxLockClosed />,
                title: "SSL/TLS",
                desc: "جميع الاتصالات مشفرة أثناء النقل باستخدام شهادات SSL.",
              },
              {
                icon: <RxReader />,
                title: "التحكم في الوصول (RLS)",
                desc: "كل مستخدم يرى بياناته فقط عبر سياسات Row-Level Security.",
              },
              {
                icon: <RxInfoCircled />,
                title: "التدقيق المنتظم",
                desc: "مراجعات أمنية دورية واختبارات اختراق للكشف عن الثغرات.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl p-5 flex gap-3 items-start"
              >
                <span className="text-primary text-xl shrink-0 mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 5 ─ المشاركة والإفصاح */}
        <Section id="sharing" num="5" title="مشاركة البيانات مع الغير">
          <div className="space-y-4">
            {[
              {
                icon: <RxLockClosed />,
                title: "معالجات الدفع",
                desc: "نحن نتحقق من وصولات الدفع الخاصة بك بشكل يدوي وآمن.",
              },
              {
                icon: <RxReader />,
                title: "الالتزام القانوني",
                desc: "إذا تطلب القانون أو أمر قضائي جزائري ذلك، سنمتثل وفقاً للإجراءات المحددة في القانون.",
              },
              {
                icon: <RxCheck />,
                title: "بموافقتك",
                desc: "بعد الحصول على موافقتك الصريحة في حالات محددة.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-surface border border-border rounded-2xl p-5"
              >
                <span className="text-primary text-2xl shrink-0 mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <h4 className="font-bold text-foreground mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 6 ─ التحديثات */}
        <Section id="updates" num="6" title="تحديثات هذه السياسة">
          <p className="text-lg leading-loose text-muted-foreground">
            قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا
            أو المتطلبات القانونية. سيتم إعلامك بأي تغييرات جوهرية عبر البريد
            الإلكتروني المسجل في حسابك.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            ننصحك بمراجعة هذه الصفحة بشكل دوري. تاريخ آخر تحديث مذكور في أعلى
            الصفحة. استمرارك في استخدام المنصة بعد التحديث يعني موافقتك على
            السياسة المحدثة.
          </p>
        </Section>

        {/* 7 ─ الاتصال */}
        <Section id="contact" num="7" title="اتصل بنا">
          <div className="bg-surface border border-border rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-3xl">
              <RxEnvelopeClosed />
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              لأي استفسار أو طلب يتعلق ببياناتك الشخصية:
            </p>
            <div className="space-y-4 text-sm text-muted-foreground max-w-sm mx-auto">
              <div className="flex justify-between items-center bg-surface border border-border p-4 rounded-2xl">
                <span className="font-bold text-foreground">
                  البريد الإلكتروني:
                </span>
                <a
                  href="mailto:wasiyatidz@gmail.com"
                  className="text-primary font-bold hover:underline underline-offset-2"
                >
                  wasiyatidz@gmail.com
                </a>
              </div>
              <div className="flex justify-between items-center bg-surface border border-border p-4 rounded-2xl">
                <span className="font-bold text-foreground">الواتساب:</span>
                <a
                  href="https://wa.me/213792441574"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] font-bold flex items-center gap-2 hover:underline underline-offset-2"
                >
                  <FaWhatsapp className="text-xl" />
                  <p dir="ltr">07 92 44 15 74</p>
                </a>
              </div>
              <div className="text-center pt-2">
                <span className="font-bold text-foreground">العنوان:</span>{" "}
                الجزائر
              </div>
            </div>
          </div>
        </Section>

        {/* ─────────────── FOOTER LINK ─────────────── */}
        <div className="text-center pt-4 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 decoration-primary/30"
          >
            <RxArrowLeft className="text-lg" />
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SECTION COMPONENT ─────────────── */
function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-[#c6a96a] text-2xl font-black font-mono leading-none">
          {num}
        </span>
        <span className="h-px flex-1 bg-linear-to-r from-[#c6a96a]/40 to-transparent" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}
