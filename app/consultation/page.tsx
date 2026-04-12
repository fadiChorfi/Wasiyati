"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AuthCard from "@/components/auth/auth-card";
import { RxPaperPlane, RxCheck, RxArrowLeft } from "react-icons/rx";
import Link from "next/link";
import SectionBadge from "@/components/landing/SectionBadge";

export default function ConsultationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // form state

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user?.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) {
        setName(session.user.user_metadata.full_name);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !phone || !message) return;
    setIsSubmitting(true);

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <main
      className="min-h-screen bg-background flex flex-col font-sans"
      dir="rtl"
    >
      {/* Navigation */}
      <div className="top-2 left-0 right-0 w-full z-50 sticky px-3">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col items-center pt-32 pb-24 px-6 relative w-full overflow-hidden">
        {/* Decorative Backgrounds */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-2xl mt-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex justify-center mb-4">
              <SectionBadge text="استشارة قانونية" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground mb-4">
              تواصل مع خبرائنا
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              ارسل استفسارك وسيقوم فريقنا القانوني بالتواصل معك لمساندتك في
              اتخاذ الخطوة الصحيحة أو المساعدة في إنشاء وصيتك.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 w-full bg-surface rounded-[40px] border border-border shadow-sm">
              <div className="animate-pulse flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-xs text-muted-foreground font-bold font-sans">
                  جاري التحقق...
                </p>
              </div>
            </div>
          ) : !user ? (
            <div className="bg-surface p-8 md:p-12 rounded-[40px] border border-border shadow-sm flex flex-col items-center text-center overflow-hidden">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                تسجيل الدخول مطلوب
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                يجب عليك تسجيل الدخول أو إنشاء حساب لمتابعة طلب الاستشارة ليتمكن
                الفريق من ربط طلبك بملفك.
              </p>

              {/* Force AuthCard to ignore its internal margin logic with !m-0 !mx-auto */}
              <div className="w-full flex justify-center [&>div]:m-0! [&>div]:mx-auto!">
                <AuthCard />
              </div>
            </div>
          ) : success ? (
            <div className="bg-surface p-10 md:p-14 rounded-[40px] border border-primary/20 shadow-[0_10px_40px_rgba(15,92,63,0.08)] flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5"></div>
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 relative z-10">
                <RxCheck className="text-5xl" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4 relative z-10">
                تم إرسال طلبك بنجاح!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm relative z-10">
                شكرًا لتواصلك معنا {user.user_metadata?.full_name || ""}.
                سيتواصل معك أحد خبرائنا القانونيين في أقرب وقت عبر الهاتف أو
                البريد الإلكتروني.
              </p>
              <Link
                href="/dashboard"
                className="bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white px-10 py-4 rounded-full text-base font-bold shadow-md hover:opacity-90 bg-size-[200%_200%] hover:bg-position-[100%_100%] transition-all duration-500 flex items-center justify-center gap-2 active:scale-95 relative z-10"
              >
                العودة للرئيسية <RxArrowLeft className="text-xl" />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface p-6 md:p-10 rounded-[40px] border border-border shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col gap-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-bold text-foreground">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ادخل اسمك الكامل"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-bold text-foreground">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 0550000000"
                    dir="ltr"
                    className="w-full text-right bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                  <div className="absolute top-10 left-4 text-muted-foreground/40 text-xs pointer-events-none">
                    +213
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">
                  الرسالة والاستفسار
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="كيف يمكننا مساعدتك؟ يرجى كتابة تفاصيل استفسارك هنا..."
                  rows={6}
                  className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none shadow-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white bg-size-[200%_200%] hover:bg-position-[100%_100%] transition-all duration-500 py-4 rounded-full text-base font-bold shadow-lg disabled:opacity-75 disabled:active:scale-100 active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/50 border-t-white animate-spin"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال الطلب
                    <RxPaperPlane className="text-xl group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </main>
  );
}
