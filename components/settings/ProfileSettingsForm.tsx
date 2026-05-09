"use client";

import { useState } from "react";
import { RxCheck, RxPerson, RxReload } from "react-icons/rx";
import {
  BasicProfile,
  updateCurrentUserBasicProfile,
} from "@/actions/profile";

type ProfileSettingsFormProps = {
  profile: BasicProfile;
};

export default function ProfileSettingsForm({
  profile,
}: ProfileSettingsFormProps) {
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    city: profile.city ?? "",
    avatar_url: profile.avatar_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onFieldChange = (
    key: "full_name" | "phone" | "city" | "avatar_url",
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const result = await updateCurrentUserBasicProfile(form);
    if (!result.success) {
      setFeedback({ type: "error", message: result.error ?? "تعذر حفظ التعديلات" });
      setSaving(false);
      return;
    }

    setFeedback({ type: "success", message: "تم حفظ التعديلات بنجاح" });
    setSaving(false);
  };

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 text-right">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">
            إعدادات الحساب
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            يمكنك الاطلاع على معلوماتك الأساسية وتعديلها في أي وقت
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <RxPerson />
          </span>
          <h3 className="text-base font-bold text-foreground">الملف الشخصي</h3>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted-foreground">الاسم الكامل</span>
              <input
                value={form.full_name}
                onChange={(e) => onFieldChange("full_name", e.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="ادخل الاسم الكامل"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted-foreground">رقم الهاتف</span>
              <input
                value={form.phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="مثال: 0550000000"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted-foreground">المدينة</span>
              <input
                value={form.city}
                onChange={(e) => onFieldChange("city", e.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="ادخل المدينة"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted-foreground">
                رابط الصورة الشخصية
              </span>
              <input
                value={form.avatar_url}
                onChange={(e) => onFieldChange("avatar_url", e.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="https://example.com/avatar.png"
                dir="ltr"
              />
            </label>
          </div>

          <div className="rounded-2xl bg-background border border-border p-4 text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium">المعرّف:</span> {profile.id}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">الدور:</span>{" "}
              {profile.role === "admin" ? "مدير" : "مستخدم"}
            </p>
          </div>

          {feedback && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-primary/10 text-primary"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-60 transition inline-flex items-center gap-2"
            >
              {saving ? <RxReload className="animate-spin" /> : <RxCheck />}
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
