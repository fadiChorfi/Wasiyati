"use client";

import React from "react";
import FilledBusinessWillHtmlView from "./FilledBusinessWillHtmlView";
import FilledGeneralWillHtmlView from "./FilledGeneralWillHtmlView";

export type WillData = {
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
  witness_1: string;
  witness_2: string;
  created_at: string;
  subject_of_will?: string;
  witness_1_signature?: string;
  witness_2_signature?: string;
  testator_signature?: string;
  beneficiary_birth_place?: string;
  beneficiary_residence?: string;
};

type WillVariant = "money" | "general" | "business";

const dotted = (value?: string) =>
  value && value.trim() !== ""
    ? value
    : "................................";

type FieldProps = {
  value?: string;
  width?: string;
  align?: string;
};

function Field({
  value,
  width = "min-w-[140px]",
  align = "text-center",
}: FieldProps) {
  return (
    <span
      className={`
        inline-flex
        border-b
        border-black
        px-2
        pb-0.5
        font-bold
        text-black
        ${width}
        ${align}
      `}
    >
      {dotted(value)}
    </span>
  );
}

export default function FilledWillHtmlView({
  data,
  variant = "money",
  onOpenPdf,
  onDownloadPdf,
}: {
  data: WillData;
  variant?: WillVariant;
  onOpenPdf?: () => void;
  onDownloadPdf?: () => void;
}) {
  if (variant === "general") {
    return <FilledGeneralWillHtmlView data={data} />;
  }

  if (variant === "business") {
    return <FilledBusinessWillHtmlView data={data} />;
  }

  return (
    <div
      dir="rtl"
      lang="ar"
      className="
        mx-auto
        w-full
        max-w-[210mm]
        min-h-[297mm]
        bg-white
        px-[18mm]
        py-[20mm]
        text-[15px]
        leading-loose
        text-black
        print:shadow-none
      "
    >
      {/* PDF BUTTONS */}
      <div className="mb-6 flex justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="
            rounded-lg
            bg-primary
            px-4
            py-2
            text-sm
            font-bold
            text-primary-foreground
            transition
            hover:bg-primary/90
          "
        >
          تحميل PDF
        </button>
        <button
          type="button"
          onClick={onOpenPdf}
          className="
            rounded-lg
            border
            border-primary
            px-4
            py-2
            text-sm
            font-bold
            text-primary
            transition
            hover:bg-primary/10
          "
        >
          عرض في تبويب جديد
        </button>
      </div>

      {/* TITLE */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold underline underline-offset-8">
          عقد وصية
        </h1>
      </div>

      {/* INTRO */}
      <div className="mb-6">
        <h2 className="mb-5 text-[17px] font-bold">
          أنا الموقع أسفله:
        </h2>

        <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-4">
          <span>السيد(ة):</span>

          <Field
            value={data.testator_full_name}
            width="min-w-[260px]"
          />

          <span>المولود(ة) بتاريخ:</span>

          <Field
            value={data.testator_birth_date}
            width="min-w-[150px]"
          />

          <span>بـ:</span>

          <Field
            value={data.testator_birth_place}
            width="min-w-[170px]"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-4">
          <span>المهنة:</span>

          <Field
            value={data.testator_profession}
            width="min-w-[170px]"
          />

          <span>المقيم بـ:</span>

          <Field
            value={data.testator_residence}
            width="min-w-[320px]"
            align="text-right"
          />
        </div>

        <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
          <span>
            الحامل لبطاقة التعريف الوطنية رقم:
          </span>

          <Field
            value={data.testator_national_id}
            width="min-w-[180px]"
          />

          <span>الصادرة بتاريخ:</span>

          <Field
            value={data.testator_id_issue_date}
            width="min-w-[120px]"
          />

          <span>عن دائرة:</span>

          <Field
            value={data.testator_id_issue_place}
            width="min-w-[180px]"
          />
        </div>
      </div>

      {/* DECLARATION */}
      <div className="mb-8 text-justify">
        أصرح وأشهد وأنا في كامل قواي العقلية والجسدية،
        وبمحض إرادتي وبدون ضغط أو إكراه، أنني أوصي بما يلي:
      </div>

      {/* SECTION 1 */}
      <section className="mb-10">
        <h2 className="mb-5 text-[17px] font-bold">
          1- المستفيد (الموصى له)
        </h2>

        <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-4">
          <span>أوصي للسيد(ة):</span>

          <Field
            value={data.beneficiary_full_name}
            width="min-w-[260px]"
          />

          <span>صلة القرابة:</span>

          <Field
            value={data.beneficiary_relationship}
            width="min-w-[160px]"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-4">
          <span>بـ:</span>

          <Field
            value={data.beneficiary_birth_place}
            width="min-w-[180px]"
          />

          <span>المقيم بـ:</span>

          <Field
            value={data.beneficiary_residence}
            width="min-w-[320px]"
            align="text-right"
          />
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="mb-10">
        <h2 className="mb-5 text-[17px] font-bold">
          2- موضوع الوصية
        </h2>

        <div
          className="
            min-h-22.5
            w-full
            border
            border-black
            px-4
            py-4
            text-justify
            leading-[2.2]
          "
        >
          {dotted(data.subject_of_will)}
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="mb-10">
        <h2 className="mb-5 text-[17px] font-bold">
          3- الشروط القانونية والشرعية
        </h2>

        <ul className="list-disc space-y-4 pr-7 text-justify">
          <li>
            أقر بأن هذه الوصية لا تتجاوز ثلث (1/3)
            تركتي الإجمالية، التزاماً بالمادة 185 من
            قانون الأسرة الجزائري.
          </li>

          <li>
            هذه الوصية لا تنفذ إلا بعد وفاتي، ولدي
            الحق الكامل في الرجوع عنها أو تعديلها حال
            حياتي.
          </li>

          <li>
            الموصى له ليس من الورثة الشرعيين / أو هو
            وارث وتبقى الوصية خاضعة لإجازة الورثة بعد
            الوفاة.
          </li>
        </ul>
      </section>

      {/* SECTION 4 */}
      <section className="mb-14">
        <h2 className="mb-5 text-[17px] font-bold">
          4- الشهود
        </h2>

        <p className="mb-6 text-justify">
          نشهد نحن الموقعون أسفله على صحة ما ورد في
          هذه الوصية، وأن الموصي أدلى بها وهو في كامل
          وعيه وإرادته.
        </p>

        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
            <span>
              الشاهد الأول (الاسم واللقب):
            </span>

            <Field
              value={data.witness_1}
              width="min-w-[260px]"
            />

            <span>التوقيع:</span>

            <Field
              value={data.witness_1_signature}
              width="min-w-[180px]"
            />
          </div>

          <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
            <span>
              الشاهد الثاني (الاسم واللقب):
            </span>

            <Field
              value={data.witness_2}
              width="min-w-[260px]"
            />

            <span>التوقيع:</span>

            <Field
              value={data.witness_2_signature}
              width="min-w-[180px]"
            />
          </div>
        </div>
      </section>

      {/* SIGNATURES */}
      <section className="mt-20">
        <div className="flex items-start justify-between gap-10">
          <div className="w-[45%]">
            <h3 className="mb-14 text-center font-bold">
              توقيع الموصي
            </h3>

            <div className="border-b border-black"></div>
          </div>

          
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-start gap-x-4 gap-y-4">
          <span>حرر بـ:</span>

          <Field
            value={data.testator_birth_place}
            width="min-w-[180px]"
          />

          <span>في:</span>

          <Field
            value={data.created_at}
            width="min-w-[180px]"
          />
        </div>
      </section>
    </div>
  );
}