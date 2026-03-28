"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useSignupModal } from "@/hooks/useSignupModal";
import { SignupModal } from "./SignupModal";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function AuthCard() {
  const { open } = useSignupModal();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginError("بيانات الدخول غير صحيحة");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Add artificial delay for smoother visual UX
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await supabase.auth.signOut();
    setIsLoggingOut(false);
  };

  const handleGoogleSignIn = async () => {
    if (!window.google) {
      await oauthFallback();
      return;
    }

    window.google.accounts.id.prompt(async (notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap is suppressed — fall back to full OAuth redirect
        await oauthFallback();
      }
    });
  };

  const oauthFallback = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("OAuth error:", error.message);
  };

  return (
    <>
      <SignupModal />
      <div className="w-full max-w-[320px] min-h-95 flex flex-col justify-center bg-white border border-gray-200/60 rounded-3xl p-6 relative z-10 shadow-sm mr-auto mt-8 md:mt-0 text-black">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
            <div className="h-10 w-full bg-gray-100 rounded-xl mt-4"></div>
          </div>
        ) : user ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#e8f3ef] text-[#19714f] rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-sm border border-[#19714f]/20 overflow-hidden">
              {user.user_metadata?.picture ? (
                <Image
                  src={user.user_metadata.picture}
                  alt={user.user_metadata?.full_name || "User Profile"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.user_metadata?.full_name?.charAt(0) ||
                user.email?.charAt(0)?.toUpperCase() ||
                "👤"
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#06281e]">مرحباً بك</h3>
              <p className="text-sm text-gray-500 mt-1 truncate px-2" dir="ltr">
                {user.user_metadata?.full_name || user.email}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-full bg-[#06281e] text-white font-bold rounded-xl py-2.5 hover:bg-[#19714f] transition shadow-md active:scale-95 text-base"
              >
                لوحة التحكم الخاصة بي
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-gray-500 font-medium hover:text-red-500 transition text-sm py-1 disabled:opacity-50 disabled:hover:text-gray-500"
              >
                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#06281e] mb-1.5">
                تسجيل الدخول
              </h3>
              <p className="text-sm text-gray-500">
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  onClick={() => open()}
                  className="text-[#19714f] font-medium hover:underline"
                >
                  حساب جديد
                </button>
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1.5 font-medium">
                  البريد الإلكتروني
                </label>
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#19714f] focus:ring-1 focus:ring-[#19714f] transition-all text-left"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1.5 font-medium">
                  كلمة المرور
                </label>
                <input
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#19714f] focus:ring-1 focus:ring-[#19714f] transition-all text-left"
                  dir="ltr"
                  required
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-xs">{loginError}</p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#06281e] text-white font-bold rounded-xl py-2.5 hover:bg-[#19714f] transition shadow-md active:scale-95 text-base disabled:opacity-70 disabled:active:scale-100"
                >
                  {isLoggingIn ? "جاري الدخول..." : "تسجيل الدخول"}
                </button>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 text-xs font-medium">أو</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-200 text-gray-700 font-medium rounded-xl py-2.5 flex justify-center items-center gap-2 hover:bg-gray-50 transition shadow-sm active:scale-95 text-sm"
              >
                <FcGoogle className="text-xl" />
                المتابعة باستخدام جوجل
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
