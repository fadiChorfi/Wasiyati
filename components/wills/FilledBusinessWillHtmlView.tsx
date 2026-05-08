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
  witness_1: string;
  witness_2: string;
  created_at: string;
  subject_of_will?: string;
};

function dotted(value?: string) {
  return value && value.trim() !== "" ? value : "................................";
}

export default function FilledBusinessWillHtmlView({ data }: { data: WillData }) {
  return (
    <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white p-[18mm] shadow-sm border border-border flex flex-col gap-2">
      <h1 className="text-lg font-bold">عقد وصية بالأعمال :</h1>
      <h2 className="text-base font-bold">أنا الموقع أسفله:</h2>

      <div className="flex flex-row gap-2 flex-wrap">
        <span>السيد(ة):</span>
        <span className="font-bold">{dotted(data.testator_full_name)}</span>
        <span>المهنة:</span>
        <span className="font-bold">{dotted(data.testator_profession)}</span>
      </div>

      <div className="flex flex-row gap-2 flex-wrap">
        <span>المقيم بـ:</span>
        <span className="font-bold">{dotted(data.testator_residence)}</span>
        <span>رقم التعريف:</span>
        <span className="font-bold">{dotted(data.testator_national_id)}</span>
      </div>

      <h2 className="text-base font-bold mt-2">1. المستفيد (الموصى له):</h2>
      <div className="flex flex-row gap-2 flex-wrap">
        <span>الاسم:</span>
        <span className="font-bold">{dotted(data.beneficiary_full_name)}</span>
        <span>العلاقة:</span>
        <span className="font-bold">{dotted(data.beneficiary_relationship)}</span>
      </div>

      <h2 className="text-base font-bold mt-2">2. تفاصيل الوصية بالأعمال:</h2>
      <p className="font-medium">{dotted(data.subject_of_will)}</p>

      <h2 className="text-base font-bold mt-2">3. الشروط القانونية والشرعية:</h2>
      <ul className="list-disc pr-6 flex flex-col gap-1">
        <li>لا تتجاوز الوصية ثلث التركة.</li>
        <li>تنفذ بعد الوفاة مع حق التعديل أو الرجوع حال الحياة.</li>
      </ul>

      <h2 className="text-base font-bold mt-2">4. الشهود:</h2>
      <div className="flex flex-col gap-1">
        <div>
          الشاهد الأول: <span className="font-bold">{dotted(data.witness_1)}</span>
        </div>
        <div>
          الشاهد الثاني: <span className="font-bold">{dotted(data.witness_2)}</span>
        </div>
      </div>

      <div className="mt-2">
        <span>حرر بـ:</span>{" "}
        <span className="font-bold">{dotted(data.testator_birth_place)}</span>{" "}
        <span>في:</span> <span className="font-bold">{dotted(data.created_at)}</span>
      </div>
    </div>
  );
}

