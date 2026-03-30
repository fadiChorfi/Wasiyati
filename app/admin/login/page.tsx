"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RxEnvelopeClosed, RxLockClosed } from "react-icons/rx";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-surface border border-border rounded-4xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-muted-foreground text-sm">
              أدخل بيانات اعتمادك للوصول إلى لوحة تحكم الإدارة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-3.5 hover:opacity-90 active:scale-95 transition-all shadow-md flex justify-center items-center gap-2"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}