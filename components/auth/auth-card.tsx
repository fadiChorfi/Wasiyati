"use client";

import { useSignupModal } from "@/hooks/useSignupModal";
import { SignupModal } from "./SignupModal";

export default function AuthCard() {
  const { open } = useSignupModal();
  return (
    <>
      <SignupModal />
      <div className="w-full max-w-[320px] bg-white border border-gray-200/60 rounded-3xl p-6 relative z-10 shadow-sm mr-auto mt-8 md:mt-0 text-black">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#06281e] mb-1.5">
            تسجيل الدخول
          </h3>
          <p className="text-sm text-gray-500">
            ليس لديك حساب؟{" "}
            <button
              onClick={() => open()}
              className="text-[#19714f] font-medium hover:underline"
            >
              حساب جديد
            </button>
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-xs text-gray-700 mb-1.5 font-medium">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#19714f] focus:ring-1 focus:ring-[#19714f] transition-all text-left"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1.5 font-medium">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#19714f] focus:ring-1 focus:ring-[#19714f] transition-all text-left"
              dir="ltr"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              className="w-full bg-[#06281e] text-white font-bold rounded-xl py-2.5 hover:bg-[#19714f] transition shadow-md active:scale-95 text-base"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
