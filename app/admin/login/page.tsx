"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RxEnvelopeClosed, RxLockClosed } from "react-icons/rx";
import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { type User } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient(); // ✅ moved to component scope
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async (user: User | undefined | null) => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    };

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await checkUser(session?.user);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        await checkUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("بيانات الدخول غير صحيحة");
      setIsLoggingIn(false);
    } else if (data.session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  };

  const oauthFallback = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
      },
    });
    if (error) console.error("OAuth error:", error.message);
  };

  const handleGoogleSignIn = async () => {
    if (!window.google) {
      await oauthFallback();
      return;
    }

    window.google.accounts.id.prompt(async (notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        await oauthFallback();
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-surface border border-border rounded-4xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-muted-foreground text-sm">
              أدخل بيانات اعتمادك للوصول إلى لوحة تحكم الإدارة
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute right-0 top-0 h-full flex items-center pr-4 text-muted-foreground">
                  <RxEnvelopeClosed className="text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pr-11 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="admin@wasiyati.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-foreground">
                  كلمة المرور
                </label>
                <Link
                  href="/admin/auth/forgot-password"
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <div className="absolute right-0 top-0 h-full flex items-center pr-4 text-muted-foreground">
                  <RxLockClosed className="text-lg" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pr-11 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-left placeholder:text-right"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}

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
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-gray-400 text-xs font-medium">أو</span>
              <div className="h-px bg-gray-200 flex-1" />
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
      </div>
    </div>
  );
}
