"use client";

import { useState } from "react";
import {
  RxFileText,
  RxArchive,
  RxIdCard,
  RxCross2,
  RxArrowLeft,
  RxInfoCircled,
} from "react-icons/rx";

export default function NewRequestPage() {
  const [selectedWill, setSelectedWill] = useState<string | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const willTypes = [
    {
      id: "general",
      title: "الوصية العامة",
      description:
        "خدمة تمكّنك من إنشاء وصية شاملة تشمل أموالك وأعمالك، مع احترام أحكام الشريعة الإسلامية والقانون الجزائري.",
      icon: RxFileText,
      colors: "bg-primary/10 text-primary border-primary",
    },
    {
      id: "money",
      title: "وصية بالأموال",
      description:
        "خدمة تمكّنك من تخصيص وتوزيع أموالك أو ممتلكاتك بدقة بعد الوفاة، مع الالتزام بأحكام الشريعة الإسلامية والقانون الجزائري.",
      icon: RxArchive,
      colors: "bg-accent/10 text-accent-foreground border-accent",
    },
    {
      id: "business",
      title: "وصية بالأعمال",
      description:
        "خدمة تمكّنك من تحديد وتنظيم الأعمال أو المهام التي ترغب في تنفيذها بعد وفاتك، وفقًا للأحكام الشرعية والقانونية المعمول بها.",
      icon: RxIdCard,
      colors: "bg-[#0a3f2f]/10 text-[#0a3f2f] border-[#0a3f2f]",
    },
  ];

  const openModal = (id: string) => {
    setSelectedWill(id);
    setIsTermsAccepted(false);
  };

  const closeModal = () => {
    setSelectedWill(null);
    setIsTermsAccepted(false);
  };

  const handleProceed = () => {
    if (isTermsAccepted) {
      alert("تم قبول الشروط. سيتم توجيهك لنموذج الوصية الآن.");
      // TODO: Redirect to the actual form flow
      closeModal();
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {/* HEADER */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm mb-6 text-center md:text-right">
        <h1 className="text-2xl font-black text-foreground">
          إنشاء وصية جديدة
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          اختر نوع الوصية التي ترغب في إنشائها. جميع النماذج مصممة للتوافق مع
          أحكام الشريعة الإسلامية والقانون الجزائري لضمان حقوقك ومقاصدك.
        </p>
      </div>

      {/* WILL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {willTypes.map((will) => {
          const Icon = will.icon;
          return (
            <div
              key={will.id}
              className="bg-surface rounded-3xl border border-border p-6 flex flex-col items-start hover:shadow-md transition-all hover:border-primary/50 group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mb-4 ${will.colors}`}
              >
                <Icon className="text-2xl" />
              </div>
              <h3 className="font-bold text-foreground text-xl mb-2">
                {will.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-6 mb-6 flex-1">
                {will.description}
              </p>

              <button
                onClick={() => openModal(will.id)}
                className="w-full py-3 rounded-xl text-sm font-bold bg-primary/5 text-primary transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground mt-auto"
              >
                بدء الإجراءات <RxArrowLeft />
              </button>
            </div>
          );
        })}
      </div>

      {/* TERMS MODAL */}
      {selectedWill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg md:max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-border shrink-0">
              <h2 className="text-xl font-bold text-foreground">
                إقرار الموافقة على الشروط
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                aria-label="إغلاق"
              >
                <RxCross2 className="text-xl" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3 text-amber-800">
                  <RxInfoCircled className="text-xl shrink-0 mt-0.5" />
                  <p className="text-sm font-bold leading-6">
                    قبل الشروع في كتابة الوصية، يرجى قراءة الإقرارات القانونية
                    والشرعية التالية بدقة والموافقة عليها:
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-border rounded-2xl p-6">
                <ul className="space-y-4 text-sm text-foreground font-medium leading-8 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-black mt-1">•</span>
                    أقر بأن هذه الوصية لا تتجاوز ثلث (1/3) تركتي الإجمالية،
                    التزاماً بالمادة 185 من قانون الأسرة الجزائري.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-black mt-1">•</span>
                    هذه الوصية لا تنفذ إلا بعد وفاتي، ولدي الحق الكامل في الرجوع
                    عنها أو تعديلها حال حياتي.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-black mt-1">•</span>
                    الموصى له (ليس من الورثة الشرعيين) / أو (هو وارث وأترك
                    نفاذها لإجازة الورثة بعد وفاتي).
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-black mt-1">•</span>
                    أتحمل جميع المسؤولية القانونية والأخلاقية تجاه صحة المعلومات
                    والبيانات المدرجة.
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  />
                </div>
                <p className="text-sm font-bold text-primary select-none">
                  أقر بأنني قرأت واستوعبت جميع أحكام وشروط الوصية وأصرح
                  بالموافقة عليها التامة.
                </p>
              </label>
            </div>

            <div className="p-5 bg-background border-t border-border flex gap-3 shrink-0">
              <button
                onClick={handleProceed}
                disabled={!isTermsAccepted}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                متابعة إنشاء الوصية <RxArrowLeft className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
