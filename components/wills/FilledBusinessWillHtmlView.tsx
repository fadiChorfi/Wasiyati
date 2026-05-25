"use client";

import React from "react";
type WillData = {
  testator_full_name: string;
  testator_birth_date: string;
  testator_birth_place: string;
  testator_residence: string;
  testator_profession: string;
  testator_national_id: string;
  testator_id_issue_date: string;
  testator_id_issue_place: string;
  beneficiary_full_name: string;
  beneficiary_relationship: string;
  beneficiary_birth_date?: string;
  beneficiary_birth_place?: string;
  beneficiary_residence?: string;
  witness_1: string;
  witness_2: string;
  created_at: string;
  subject_of_will?: string;
};

function dotted(value?: string) {
  return value && value.trim() !== "" ? value : "................................";
}

export default function FilledBusinessWillHtmlView({
  data,
  onOpenPdf,
  onDownloadPdf,
}: {
  data: WillData;
  onOpenPdf?: () => void;
  onDownloadPdf?: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-full md:max-w-[210mm] bg-white p-4 md:p-[18mm] shadow-sm border border-border flex flex-col gap-2">
      {/* PDF BUTTONS */}
      <div className="mb-6 flex justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          تحميل PDF
        </button>
        <button
          type="button"
          onClick={onOpenPdf}
          className="rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
        >
          عرض في تبويب جديد
        </button>
      </div>

      <h1 className="text-lg font-bold">عقد وصية بالأعمال :</h1>
      <h2 className="text-base font-bold">أنا الموقع أسفله:</h2>

      <div className="flex flex-row gap-2 flex-wrap">
        <span>السيد(ة):</span>
        <span className="font-bold">{dotted(data.testator_full_name)}</span>
        <span>المولود(ة) بتاريخ:</span>
        <span className="font-bold">{dotted(data.testator_birth_date)}</span>
        <span>بـ:</span>
        <span className="font-bold">{dotted(data.testator_birth_place)}</span>
      </div>

      <div className="flex flex-row gap-2 flex-wrap">
        <span>المهنة:</span>
        <span className="font-bold">{dotted(data.testator_profession)}</span>
        <span>المقيم بـ:</span>
        <span className="font-bold">{dotted(data.testator_residence)}</span>
      </div>

      <div className="flex flex-row gap-2 flex-wrap">
        <span>الحامل لبطاقة التعريف الوطنية رقم:</span>
        <span className="font-bold">{dotted(data.testator_national_id)}</span>
        <span>الصادرة بتاريخ:</span>
        <span className="font-bold">{dotted(data.testator_id_issue_date)}</span>
        <span>عن دائرة:</span>
        <span className="font-bold">{dotted(data.testator_id_issue_place)}</span>
      </div>

      <h2 className="text-base font-bold mt-2">1. المستفيد (الموصى له):</h2>
      <div className="flex flex-row gap-2 flex-wrap">
        <span>أوصي للسيد(ة):</span>
        <span className="font-bold">{dotted(data.beneficiary_full_name)}</span>
        <span>صلة القرابة:</span>
        <span className="font-bold">{dotted(data.beneficiary_relationship)}</span>
      </div>
      <div className="flex flex-row gap-2 flex-wrap">
        <span>المولود بتاريخ:</span>
        <span className="font-bold">{dotted(data.beneficiary_birth_date)}</span>
        <span>بـ:</span>
        <span className="font-bold">{dotted(data.beneficiary_birth_place)}</span>
        <span>والمقيم بـ:</span>
        <span className="font-bold">{dotted(data.beneficiary_residence)}</span>
      </div>

      <h2 className="text-base font-bold mt-2">2. تفاصيل الوصية بالأعمال:</h2>
      <p className="font-medium">{dotted(data.subject_of_will)}</p>

      <ul className="list-disc pr-6 flex flex-col gap-1 text-sm">
        <li>
          <span className="font-bold">إبراء الذمة:</span> أوصي بتعجيل إخراج ديوني (إن وجدت) ومصاريف جنازتي من أصل التركة قبل أي تقسيم.
        </li>
        <li>
          <span className="font-bold">وصية البر (الثلث):</span> أوصي بإخراج مقدار (الثلث أو حدد مبلغاً لا يتجاوز الثلث) من صافي تركتي، ويُخصص لعمل خيري مستدام (كصدقة جارية)، وتحديداً في: [ذكر العمل: مثل بناء مسجد، حفر بئر، أو لفائدة جمعية خيرية معينة].
        </li>
        <li>
          <span className="font-bold">أعمال الخير الأخرى:</span> أوصي بتوزيع مبلغ قدره (........ دج) كصدقات على الفقراء والمحتاجين من الأقارب غير الوارثين والجيران.
        </li>
        <li>
          <span className="font-bold">التوجيه المعنوي:</span> أوصي أبنائي وورثتي بتقوى الله، وصلة الرحم، والحفاظ على وحدة العائلة، وألا ينسوني من صالح دعائهم.
        </li>
      </ul>

      <h2 className="text-base font-bold mt-2">3. الشروط القانونية والشرعية:</h2>
      <ul className="list-disc pr-6 flex flex-col gap-1">
        <li>أقر بأن هذه الوصية لا تتجاوز ثلث (1/3) تركتي الإجمالية، التزاماً بالمادة 185 من قانون الأسرة الجزائري.</li>
        <li>هذه الوصية لا تنفذ إلا بعد وفاتي، ولدي الحق الكامل في الرجوع عنها أو تعديلها حال حياتي.</li>
        <li>الموصى له (ليس من الورثة الشرعيين) / أو (هو وارث وأترك نفاذها لإجازة الورثة بعد وفاتي).</li>
      </ul>

      <h2 className="text-base font-bold mt-2">4. الشهود:</h2>
      <p className="text-sm">
        نشهد نحن الموقعون أسفله على صحة ما ورد في هذه الوصية، وأن الموصي أدلى بها وهو في كامل وعيه وإرادته.
      </p>
      <div className="flex flex-col gap-1">
        <div>
          الشاهد الأول (الاسم واللقب): <span className="font-bold">{dotted(data.witness_1)}</span>
          {"  "}التوقيع: <span className="font-bold">................................</span>
        </div>
        <div>
          الشاهد الثاني (الاسم واللقب): <span className="font-bold">{dotted(data.witness_2)}</span>
          {"  "}التوقيع: <span className="font-bold">................................</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold">توقيع الموصي:</p>
        <p className="mt-1">...................................</p>
      </div>

      <div className="mt-2">
        <span>حرر بـ:</span>{" "}
        <span className="font-bold">{dotted(data.testator_birth_place)}</span>{" "}
        <span>في:</span> <span className="font-bold">{dotted(data.created_at)}</span>
      </div>
    </div>
  );
}