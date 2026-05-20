import { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import {
  RxCheck,
  RxInfoCircled,
  RxLockClosed,
  RxArrowLeft,
  RxReader,
  RxPerson,
  RxExclamationTriangle,
  RxEnvelopeClosed,
} from "react-icons/rx";

export const metadata: Metadata = {
  title: "الشروط والأحكام | وصيتي",
  description:
    "الشروط والأحكام المنظمة لاستخدام منصة وصيتي — منصة رقمية جزائرية لإعداد الوصايا وتنظيم التركات.",
};

const navItems = [
  { id: "acceptance", label: "القبول" },
  { id: "service", label: "وصف الخدمة" },
  { id: "eligibility", label: "الأهلية" },
  { id: "account", label: "الحساب" },
  { id: "responsibilities", label: "المسؤوليات" },
  { id: "payments", label: "الاشتراكات" },
  { id: "ip", label: "الملكية الفكرية" },
  { id: "liability", label: "حدود المسؤولية" },
  { id: "termination", label: "إنهاء الخدمة" },
  { id: "modifications", label: "التعديلات" },
  { id: "governing", label: "القانون المطبق" },
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

export default function TermsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground pb-16">
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-28 pb-28 px-6 rounded-b-[40px] mx-2 mb-14">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-[#c6a96a]/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-1.5 text-xs text-white/80 mb-6 border border-white/10">
            <RxReader className="text-[#c6a96a] text-base" />
            آخر تحديث: {lastUpdated}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            الشروط والأحكام
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            القواعد المنظمة لاستخدام منصة وصيتي. يرجى قراءتها بعناية قبل استخدام
            الخدمات.
          </p>
        </div>
      </section>

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

      <div className="max-w-4xl mx-auto px-6 mt-10 mb-14">
        <div className="bg-linear-to-br from-primary/4 to-primary/8 border border-primary/15 rounded-3xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-2xl">
              <RxExclamationTriangle />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                تنبيه مهم — إخلاء مسؤولية قانوني
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                <strong className="text-foreground">وصيتي</strong> هي منصة تقنية
                رقمية مساعدة لصياغة الوصايا، وليست مكتب محاماة أو وكالة استشارات
                قانونية. الخدمات المقدمة لا ترقى إلى مستوى الاستشارة القانونية
                المتخصصة، ولا تغني عن مراجعة موثق رسمي أو محامٍ مختص.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────── CONTENT ─────────────── */}
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* 1 ─ القبول */}
        <Section id="acceptance" num="1" title="القبول بالشروط">
          <p className="text-lg leading-loose text-muted-foreground">
            باستخدامك لمنصة وصيتي (يُشار إليها بـ&quot;المنصة&quot;)، فإنك توافق
            بشكل تام وملزم على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق
            على أي جزء منها، يجب عليك التوقف فوراً عن استخدام المنصة.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            تحتفظ المنصة بالحق في تعديل هذه الشروط في أي وقت. يُعتبر استمرارك في
            استخدام المنصة بعد نشر التعديلات موافقة ضمنية منك على الشروط
            المعدلة.
          </p>
        </Section>

        {/* 2 ─ وصف الخدمة */}
        <Section id="service" num="2" title="وصف الخدمة">
          <p className="text-lg leading-loose text-muted-foreground">
            وصيتي هي منصة رقمية جزائرية تساعدك على إعداد مسودة وصيتك بتوفير
            نماذج تفاعلية وقوالب قانونية.
          </p>

          <div className="bg-surface border border-border rounded-3xl p-6 mt-4">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <RxInfoCircled className="text-primary" />
              ما المنصة ليست:
            </h4>
            <ul className="space-y-2">
              {[
                "ليست مكتب محاماة ولا تمثل مستخدميها قانونياً.",
                "لا تضمن القبول القانوني للوصية من قبل أي جهة رسمية.",
                "لا تحل محل الموثق أو المحامي في المراجعة النهائية.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <RxCheck className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 mt-4">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <RxCheck className="text-primary" />
              ما المنصة تقدم:
            </h4>
            <ul className="space-y-2">
              {[
                "واجهة رقمية تفاعلية لإدخال بيانات الوصية بسهولة.",
                "قوالب قانونية محدثة بناءً على .",
                "تخزين آمن للوصية وإمكانية تعديلها قبل الاعتماد النهائي.",
                "مراجعة الخبراء للبيانات المقدمة (حسب الباقة المختارة).",
                "توصيل الوصية (للمشتركين في الباقة الاحترافية).",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <RxCheck className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 3 ─ الأهلية */}
        <Section id="eligibility" num="3" title="أهلية الاستخدام">
          <p className="text-lg leading-loose text-muted-foreground">
            يُسمح باستخدام المنصة للأشخاص الذين تتوفر فيهم الشروط التالية:
          </p>
          <div className="space-y-4 mt-6">
            {[
              {
                title: "السن القانوني",
                desc: "يجب أن تكون قد بلغت 18 سنة ميلادية كاملة (سن الرشد في الجزائر).",
              },
              {
                title: "الأهلية القانونية",
                desc: "يجب أن تكون كامل الأهلية وغير محجور عليك قانوناً.",
              },
              {
                title: "الجنسية",
                desc: "المنصة موجهة للمستخدمين الجزائريين أو المقيمين في الجزائر الخاضعين للقانون الجزائري.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-surface border border-border rounded-2xl p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                  {i + 1}
                </div>
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

        {/* 4 ─ الحساب */}
        <Section id="account" num="4" title="إنشاء الحساب وأمانه">
          <p className="text-lg leading-loose text-muted-foreground">
            لاستخدام الخدمات، يجب إنشاء حساب شخصي. أنت المسؤول الوحيد عن الحفاظ
            على سرية بيانات تسجيل الدخول الخاصة بك.
          </p>
          <div className="bg-surface border border-border rounded-3xl p-6 mt-4 space-y-4">
            {[
              "يجب تقديم معلومات دقيقة وكاملة عند التسجيل.",
              "أنت مسؤول عن جميع الأنشطة التي تتم عبر حسابك.",
              "يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.",
              "نحن مسؤولون عن توفير بيئة آمنة ومشفرة لحماية بيانات حسابك.",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-muted-foreground">
                <RxCheck className="text-primary shrink-0 mt-1" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 5 ─ المسؤوليات */}
        <Section id="responsibilities" num="5" title="مسؤوليات المستخدم">
          <div className="bg-linear-to-br from-primary/4 to-primary/8 border border-primary/15 rounded-3xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <RxLockClosed className="text-primary text-2xl shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground mb-1">
                  نحن مسؤولون عن
                </h4>
                <ul className="space-y-1.5">
                  {[
                    "توفير المنصة وتشغيلها بشكل آمن ومستمر.",
                    "حماية بياناتك وفقاً لأعلى معايير الأمان.",
                    "معالجة طلباتك ومراجعتها ضمن المدة المحددة.",
                    "إشعارك بأي تغييرات جوهرية في الخدمة أو الشروط.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <RxCheck className="text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/30 rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <RxPerson className="text-primary text-2xl shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground mb-1">أنت مسؤول عن</h4>
                <ul className="space-y-1.5">
                  {[
                    "دقة واكتمال المعلومات التي تدخلها عند إعداد وصيتك.",
                    "مراجعة الوصية لدى موثق رسمي قبل اعتمادها نهائياً.",
                    "الحفاظ على سرية بيانات حسابك وكلمة المرور.",
                    "الامتثال للقوانين واللوائح الجزائرية ذات الصلة.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <RxCheck className="text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* 6 ─ الاشتراكات */}
        <Section id="payments" num="6" title="الاشتراكات والمدفوعات">
          <p className="text-lg leading-loose text-muted-foreground">
            توفر المنصة عدة باقات اشتراك (أساسية، متوسطة، Pro) بأسعار محددة
            بالدينار الجزائري (DZD). الأسعار قابلة للتحديث من وقت لآخر.
          </p>

          <div className="space-y-4 mt-6">
            {[
              {
                title: "طرق الدفع",
                desc: "يتم الدفع عن طريق إرسال وصولات دفع للحسابات البريدية أو البنكية الخاصة بنا.",
              },
              {
                title: "الاشتراك للفرد",
                desc: "يمنحك الحق في استخدام الخدمات وفقاً للباقة المختارة. وصية واحدة فقط لكل اشتراك.",
              },
              {
                title: "الاستهلاك التلقائي",
                desc: "يُستهلك الاشتراك فور تقديم طلب الوصية بنجاح.",
              },
              {
                title: "الإلغاء واسترداد المبلغ",
                desc: "لا يمكن استرداد قيمة الاشتراك بعد استهلاكه بتقديم طلب وصية. قبل الاستهلاك، يمكن طلب الإلغاء خلال 7 أيام من تاريخ الدفع.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-surface border border-border rounded-2xl p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                  {i + 1}
                </div>
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

        {/* 7 ─ الملكية الفكرية */}
        <Section id="ip" num="7" title="الملكية الفكرية">
          <p className="text-lg leading-loose text-muted-foreground">
            جميع محتويات المنصة — بما في ذلك النصوص، القوالب، التصاميم،
            الرسومات، الشعارات، والبرمجيات — هي ملك حصري لمنصة وصيتي ومحمية
            بموجب قوانين حماية الملكية الفكرية الجزائرية والدولية.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            يمنحك استخدام المنصة ترخيصاً شخصياً محدوداً للاستفادة من الخدمات
            لأغراضك الشخصية غير التجارية. لا يحق لك نسخ أو توزيع أو تعديل أو
            إنشاء أعمال مشتقة من محتوى المنصة دون موافقة خطية مسبقة.
          </p>
        </Section>

        {/* 8 ─ حدود المسؤولية */}
        <Section id="liability" num="8" title="حدود المسؤولية">
          <p className="text-lg leading-loose text-muted-foreground">
            نحن مسؤولون عن تقديم الخدمات وفقاً لأعلى معايير الجودة والأمان
            المتاحة تقنياً، وعن حماية بياناتك وفقاً للتشريعات السارية.
          </p>

          <div className="bg- text-primary border border-red-200/60 dark:border-red-700/30 rounded-3xl p-6 mt-4">
            <h4 className="font-bold   mb-3 flex items-center gap-2">
              <RxInfoCircled className="text-lg" />
              لا تتحمل المنصة المسؤولية عن:
            </h4>
            <ul className="space-y-2">
              {[
                "أي قرارات قانونية تتخذها بناءً على المعلومات المقدمة عبر المنصة دون استشارة متخصص.",
                "عدم قبول الوصية من قبل الجهات الرسمية إذا لم تستوفِ المتطلبات القانونية المحلية.",
                "الأضرار غير المباشرة أو التبعية الناتجة عن استخدام المنصة.",
                "دقة المعلومات القانونية التي قد تختلف باختلاف الاختصاص القضائي.",
                "فقدان البيانات الناتج عن إهمال المستخدم في الحفاظ على نسخة احتياطية.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-sm  ">
                  <span className="shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 9 ─ إنهاء الخدمة */}
        <Section id="termination" num="9" title="إنهاء الخدمة">
          <p className="text-lg leading-loose text-muted-foreground">
            تحتفظ المنصة بالحق في تعليق أو إنهاء حساب أي مستخدم يخالف هذه الشروط
            أو يساء استخدام المنصة أو يشكل خطراً على أمن المنصة أو مستخدميها.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            يمكنك طلب حذف حسابك في أي وقت عبر التواصل مع فريق الدعم على{" "}
            <a
              href="mailto:support@wasiyati.dz"
              className="text-primary font-bold underline underline-offset-2"
            >
              support@wasiyati.dz
            </a>
            . سيتم حذف بياناتك وفقاً لسياسة الخصوصية والمتطلبات القانونية.
          </p>
        </Section>

        {/* 10 ─ التعديلات */}
        <Section id="modifications" num="10" title="التعديلات على الشروط">
          <p className="text-lg leading-loose text-muted-foreground">
            قد نقوم بتعديل هذه الشروط من وقت لآخر. سنقوم بإشعارك بأي تغييرات
            جوهرية عبر البريد الإلكتروني المسجل في حسابك.
          </p>
          <p className="text-lg leading-loose text-muted-foreground">
            يُعتبر استمرارك في استخدام المنصة بعد نشر التعديلات موافقة ضمنية منك
            على الشروط المعدلة. ننصحك بمراجعة هذه الصفحة بشكل دوري.
          </p>
        </Section>

        {/* 11 ─ القانون المطبق */}
        <Section id="governing" num="11" title="القانون الواجب التطبيق">
          <div className="bg-surface border border-border rounded-3xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-3xl">
              <RxReader />
            </div>
            <p className="text-lg leading-loose text-muted-foreground">
              تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين{" "}
              <strong className="text-foreground">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </strong>
              . في حالة نشوء أي نزاع، يتم حله وديًا أولاً، فإن تعذر ذلك، يُرفع
              إلى المحاكم المختصة بالجزائر.
            </p>
          </div>
        </Section>

        {/* 12 ─ الاتصال */}
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
