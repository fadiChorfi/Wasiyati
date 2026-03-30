"use client";

import { useState, useEffect } from "react";
import { RxCheck } from "react-icons/rx";

export default function AboutWillClient() {
  const [activeSection, setActiveSection] = useState("definition");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "definition",
        "legal-framework",
        "conditions",
        "formality",
        "sources",
        "limits",
      ];
      let current = sections[0];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "definition", label: "التعريف والأهمية" },
    { id: "legal-framework", label: "التنظيم القانوني" },
    { id: "conditions", label: "شروط الصحة والأركان" },
    { id: "formality", label: "الشكلية القانونية" },
    { id: "sources", label: "أنواع ومصادر" },
    { id: "limits", label: "حدود الوصية ونفاذها" },
  ];

  return (
    <div dir="rtl" className="w-full bg-background text-foreground">
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-24 pb-20 px-6 mb-12 rounded-b-[40px] mx-2">
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            الوصية في القانون الجزائري
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            دليل شامل لكل ما يخص أحكام الوصية، من الشروط والأركان إلى الشكلية
            القانونية وحماية حقوق الورثة.
          </p>
        </div>
      </section>

      {/* 2. ANCHOR NAV */}
      <div className="sticky top-16 md:top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-3 py-1 flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-muted-foreground border-border hover:text-primary hover:border-primary/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        {/* SECTION 1 — التعريف والأهمية */}
        <section id="definition" className="scroll-mt-32">
          <div className="mb-12">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              01
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              تعريف الوصية وأهميتها
            </h2>
            <div className="prose prose-lg max-w-3xl text-muted-foreground leading-loose">
              <p>
                تُستمد أحكام الوصية في القانون الجزائري من مبادئ الفقه الإسلامي،
                حيث تُعرف بأنها تصرف قانوني صادر عن إرادة الموصي المنفردة، ويهدف
                إلى نقل ملكية جزء من أمواله إلى شخص أو جهة معينة، على أن يسري
                مفعول هذا التصرف بعد وفاته وفي النطاق الذي تفرضه النصوص
                التشريعية.
              </p>
            </div>
          </div>

          <div className="bg-surface border-s-4 border-accent rounded-e-xl p-6 md:p-8 mb-12 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <span className="text-2xl">⚖️</span>
              <h3 className="font-bold text-lg">المادة 184 من قانون الأسرة</h3>
            </div>
            <p className="text-xl leading-relaxed text-foreground font-medium italic">
              &quot;الوصية تمليك مضاف إلى ما بعد الموت بطريق التبرع&quot;
            </p>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-8">
            الأهمية الجوهرية للوصية:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "ترتيب شؤون التركة",
                desc: "تتيح للمورث توجيه جزء من ممتلكاته وفق رؤيته الخاصة، سواء بدعم وجوه الخير أو تخصيص منفعة لمن لا حق له في الميراث الشرعي.",
              },
              {
                title: "الحد من الخلافات الأسرية",
                desc: "تساهم الوصية الموثقة والواضحة في حسم مصير الأموال مسبقاً، مما يقلل من احتمالات النزاع بين الورثة عند تقسيم التركة.",
              },
              {
                title: "تجسيد الحرية المالية",
                desc: "تعكس الوصية حق الفرد في التصرف في ماله بالتبرع لمن يشاء، وهو حق مكفول شرعاً وقانوناً.",
              },
              {
                title: "سد ثغرات الميراث الإلزامي",
                desc: "تعمل الوصية كأداة تكميلية تسمح للموصي بتحقيق رغبات لا تتيحها قواعد الإرث الجامدة، وذلك في حدود الثلث.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-surface rounded-2xl p-6 border border-border shadow-sm"
              >
                <h4 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {item.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed ps-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2 — التنظيم القانوني */}
        <section id="legal-framework" className="scroll-mt-32">
          <div className="mb-12">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              02
            </span>
            <h2 className="text-3xl font-bold text-primary mb-6">
              التنظيم القانوني للوصية في الجزائر
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl text-lg">
              يستند التنظيم إلى منظومة تشريعية متكاملة تضبط أركانها، شروط صحتها،
              وآليات تنفيذها. وتتظافر هذه النصوص لتشكل &quot;شبكة أمان
              قانونية&quot; تضمن صون إرادة الموصي وتمنع التلاعب بالحقوق المالية
              بعد الوفاة.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "قانون الأسرة (الأمر 84-11)",
                text: "يعتبر المصدر الموضوعي الأول؛ حيث أفرد المشرع الباب الخامس منه (المواد 184 إلى 205) لبيان أحكام الوصية التفصيلية، بدءاً من أهلية الموصي واستحقاق الموصى له، وصولاً إلى نطاق الثلث وحالات الرجوع عن الوصية.",
              },
              {
                title: "القانون المدني (الأمر 75-58)",
                text: "يمثل الإطار المرجعي للقواعد العامة، حيث يُستعان به بصفة تكميلية في المسائل المتعلقة بنظرية العقد، وعيوب الرضا (كالإكراه والتدليس)، بالإضافة إلى القواعد العامة للإثبات والالتزامات.",
              },
              {
                title: "قانون الإجراءات المدنية والإدارية",
                text: "يحدد الشق الإجرائي والعملي؛ فهو المسار القانوني لإثبات الوصايا (خاصة غير الموثقة منها) أمام القضاء، وينظم طرق رفع الدعاوى المرتبطة بالتركات وآليات التنفيذ.",
              },
            ].map((law, idx) => (
              <div
                key={idx}
                className="border-s-2 border-primary/30 ps-6 py-2 hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground text-xl mb-2">
                  {law.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {law.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — شروط الصحة */}
        <section id="conditions" className="scroll-mt-32">
          <div className="mb-12">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              03
            </span>
            <h2 className="text-3xl font-bold text-primary mb-6">
              شروط صحة الوصية وأركانها
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl text-lg">
              تتوقف صحة الوصية ونفاذها على توافر مجموعة من الأركان والشروط
              الجوهرية التي تضمن سلامة الإرادة وحماية حقوق الورثة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-border">
                أولاً: الموصي (صاحب المال)
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "الأهلية الكاملة",
                    desc: "أن يكون بالغاً سن الرشد (19 سنة) وعاقلاً.",
                  },
                  {
                    title: "سلامة الرضا",
                    desc: "إرادة حرة خالية من الإكراه والتدليس.",
                  },
                  { title: "ملكية الموصى به", desc: "يملك الأموال فعلياً." },
                  {
                    title: "خلو التركة من الديون",
                    desc: "سداد الديون مقدم على الوصايا.",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-muted-foreground leading-relaxed"
                  >
                    <RxCheck className="text-accent text-xl shrink-0 mt-1" />
                    <div>
                      <span className="font-bold text-foreground">
                        {item.title}:
                      </span>{" "}
                      {item.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-border">
                ثانياً: الموصى له (المستفيد)
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "الوجود والتعيين",
                    desc: "معلوماً بوضوح وموجوداً (حقيقة أو حكماً).",
                  },
                  {
                    title: "لا وصية لوارث",
                    desc: "لا تصح لوارث إلا بموافقة باقي الورثة.",
                  },
                  {
                    title: "أهلية التملك",
                    desc: "يجوز له تملك المال قانوناً.",
                  },
                  {
                    title: "مشروعية الغرض",
                    desc: "متوافق مع النظام العام والآداب.",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-muted-foreground leading-relaxed"
                  >
                    <RxCheck className="text-accent text-xl shrink-0 mt-1" />
                    <div>
                      <span className="font-bold text-foreground">
                        {item.title}:
                      </span>{" "}
                      {item.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-border">
                ثالثاً: الموصى به (محل الوصية)
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "المشروعية",
                    desc: "مال متقوّم ومباح شرعاً وقانوناً.",
                  },
                  {
                    title: "العلم النافي للجهالة",
                    desc: "محدد ومعروف بما يمنع النزاع.",
                  },
                  {
                    title: "قيد الثلث",
                    desc: "نفاذ الوصية في حدود الثلث فقط.",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-muted-foreground leading-relaxed"
                  >
                    <RxCheck className="text-accent text-xl shrink-0 mt-1" />
                    <div>
                      <span className="font-bold text-foreground">
                        {item.title}:
                      </span>{" "}
                      {item.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4 — الشكلية */}
        <section id="formality" className="scroll-mt-32">
          <div className="mb-10">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              04
            </span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              الشكلية القانونية للوصية
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              استبعد المشرع الاعتراف بالتصرفات الشفوية المجردة، واشترط الموثوقية
              لحماية التركات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-surface rounded-2xl p-8 border-2 border-primary/20 hover:border-primary transition-all shadow-sm relative">
              <div className="absolute top-6 left-6 bg-primary/10 text-primary text-xs font-bold rounded-full px-3 py-1">
                الأكثر أماناً
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                الوصية الرسمية (التوثيقية)
              </h3>
              <p className="text-muted-foreground leading-loose">
                تُحرر أمام الموثق وفقاً للإجراءات القانونية المعمول بها. تكتسب
                هذه الوصية قوة ثبوتية مطلقة، وتعد الأضمن لتنفيذ إرادة الموصي دون
                عناء الإثبات القضائي اللاحق.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                الوصية العرفية (بخط اليد)
              </h3>
              <p className="text-muted-foreground leading-loose">
                يحررها الموصي شخصياً بخط يده مع التوقيع عليها. ورغم مشروعيتها،
                إلا أنها تفتقر لقوة السند الرسمي، ويتوقف نفاذها غالباً على
                الإثبات القضائي لصحة الخط والتوقيع حال منازعة الورثة فيها.
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border-s-4 border-red-500 rounded-e-xl p-6 text-red-900 dark:text-red-200">
            <p className="font-bold mb-2 flex items-center gap-2">
              ⚠️ استبعاد الوصية الشفوية تماماً
            </p>
            <p className="leading-relaxed">
              لا يعتد القانون الجزائري بالوصايا المنقولة مشافهة؛ إذ يشترط دائماً
              القالب الكتابي كدليل مادي وحيد يعكس جدية التصرف ويمنع التلاعب
              بالتركات.
            </p>
          </div>
        </section>

        {/* SECTION 5 — المصادر والمقارنة */}
        <section id="sources" className="scroll-mt-32">
          <div className="mb-10">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              05
            </span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              الوصية الاختيارية والواجبة
            </h2>
          </div>

          <div className="overflow-x-auto bg-surface rounded-xl border border-border shadow-sm mb-4">
            <table className="w-full text-right text-sm md:text-base whitespace-nowrap md:whitespace-normal">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="py-4 px-6 font-bold w-1/4 border-b border-primary/20">
                    العنصر
                  </th>
                  <th className="py-4 px-6 font-bold w-3/8 border-b border-s border-primary/20">
                    الوصية الاختيارية
                  </th>
                  <th className="py-4 px-6 font-bold w-3/8 border-b border-s border-primary/20">
                    الوصية الواجبة (التنزيل)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground bg-muted/20">
                    الطبيعة
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    اختيارية / اختيار الموصي
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    مفروضة بقوة القانون
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground bg-muted/20">
                    الإرادة
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    تقوم على إرادة الموصي
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    لا تتوقف على إرادة الموصي
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground bg-muted/20">
                    المستفيد
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    أي شخص (غير الوارث)
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    الأحفاد غير الوارثين
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground bg-muted/20">
                    الأساس
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    التبرع
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    العدالة الاجتماعية
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground bg-muted/20">
                    إمكانية الإلغاء
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    يمكن الرجوع فيها
                  </td>
                  <td className="py-4 px-6 text-muted-foreground border-s border-border">
                    لا يمكن الرجوع فيها
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6 — الحدود */}
        <section id="limits" className="scroll-mt-32 pb-16">
          <div className="mb-10">
            <span className="text-sm text-accent font-bold uppercase tracking-wider mb-2 block">
              06
            </span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              حدود الوصية ونفاذها
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              تخضع الوصية لقيود جوهرية تهدف إلى حماية منظومة المواريث الشرعية
              ومنع الإضرار بالورثة.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-surface border border-border rounded-3xl p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="text-accent text-3xl">١/٣</span>
                قاعدة &quot;الثلث الشرعي&quot;
              </h3>
              <p className="text-muted-foreground leading-loose mb-6 text-lg">
                يقرر القانون أن إرادة الموصي نافذة بحد أقصى هو{" "}
                <strong className="text-foreground">ثلث صافي التركة</strong> بعد
                استقطاع مصاريف الجنازة والديون:
              </p>
              <ul className="space-y-4 ps-4 border-s-2 border-border mb-6">
                <li className="text-muted-foreground">
                  <span className="font-bold text-foreground">
                    النفاذ التلقائي:{" "}
                  </span>
                  تكون الوصية نافذة بقوة القانون ولا تتوقف على رضا الورثة إذا
                  كانت في حدود الثلث أو أقل.
                </li>
                <li className="text-muted-foreground">
                  <span className="font-bold text-foreground">
                    شرط الإجازة للزيادة:{" "}
                  </span>
                  القدر الزائد لا ينفذ إلا بموافقة (إجازة) ورثة كاملين الأهلية،
                  صريحة بعد الوفاة.
                </li>
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                قاعدة &quot;لا وصية لوارث&quot;
              </h3>
              <p className="text-muted-foreground leading-loose mb-6 text-lg">
                منع المشرع تمييز أحد الورثة الشرعيين بميزة مالية إضافية عبر
                الوصية، حفاظاً على العدالة الأسرية (المادة 186 من قانون الأسرة).
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/20 p-6 rounded-2xl border border-border">
                  <h4 className="font-bold text-foreground mb-2">
                    استثناء الإجازة الجماعية
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    لا تصبح الوصية لوارث نافذة إلا إذا وافق عليها بقية الورثة
                    بعد الوفاة.
                  </p>
                </div>
                <div className="bg-muted/20 p-6 rounded-2xl border border-border">
                  <h4 className="font-bold text-foreground mb-2">أثر الرفض</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    يعتبر التصرف باطلاً، ويعود المال ليُقسم حسب الأنصبة الشرعية
                    (الفريضة).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
