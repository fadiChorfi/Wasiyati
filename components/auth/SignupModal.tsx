"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSignupModal } from "@/hooks/useSignupModal";

export function SignupModal() {
  const { isOpen, step, email, close, nextStep, prevStep, setEmail } =
    useSignupModal();
  const supabase = createClient();

  // Step 1 fields
  const [password, setPassword] = useState("");

  // Step 2 fields — your extra info here
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Just validate and move to step 2
    // Don't create the account yet — user might abandon step 2
    if (!email || !password) return;
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    nextStep();
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Now create the account with all info
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    nextStep();
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100">
          <div
            className="h-1 bg-green-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step 1 — Email + Password */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">إنشاء حساب</h2>
              <p className="text-sm text-gray-500">الخطوة 1 من 2</p>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  name="email"
                  autoComplete="email"
                  title="يرجى إدخال بريد إلكتروني صالح"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-right text-gray-900 bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  كلمة المرور
                </label>
                <input
                  name="password"
                  autoComplete="new-password"
                  title="كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-left text-gray-900 bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-green-700 text-white rounded-xl py-2.5 font-medium hover:bg-green-800 transition"
              >
                التالي
              </button>
            </form>
          )}

          {/* Step 2 — Extra Info */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                معلومات إضافية
              </h2>
              <p className="text-sm text-gray-500">الخطوة 2 من 2</p>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  الاسم الكامل
                </label>
                <input
                  name="fullName"
                  autoComplete="name"
                  title="يرجى إدخال اسمك الكامل"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-right text-gray-900 bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  رقم الهاتف
                </label>
                <input
                  name="phone"
                  autoComplete="tel"
                  title="يرجى إدخال رقم هاتف صالح"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-right text-gray-900 bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Add any extra fields your app needs here */}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-gray-600 hover:bg-gray-50 transition"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-700 text-white rounded-xl py-2.5 font-medium hover:bg-green-800 transition"
                >
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="text-5xl">✅</div>
              <h2 className="text-xl font-bold text-gray-900">
                تم إنشاء الحساب
              </h2>
              <p className="text-sm text-gray-500">
                تحقق من بريدك الإلكتروني لتأكيد الحساب
              </p>
              <button
                onClick={close}
                className="w-full bg-green-700 text-white rounded-xl py-2.5 font-medium hover:bg-green-800 transition"
              >
                حسناً
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
