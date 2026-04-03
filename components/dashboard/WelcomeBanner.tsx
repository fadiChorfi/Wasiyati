"use client";

import { User } from "@/types/user";

interface WelcomeBannerProps {
  profile: User | null;
}

export default function WelcomeBanner({ profile }: WelcomeBannerProps) {
  return (
    <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
      <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
      <div className="relative z-10 text-right">
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">
          مرحباً، {profile?.full_name} 👋
        </h2>
        <p className="text-sm text-primary-foreground/70 mt-1">
          إليك ملخص وصاياك ونشاطك الأخير
        </p>
      </div>
    </div>
  );
}
