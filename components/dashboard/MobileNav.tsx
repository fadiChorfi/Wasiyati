"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RxDashboard,
  RxFileText,
  RxIdCard,
  RxGear,
  RxPlus,
} from "react-icons/rx";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "الرئيسية", href: "/dashboard", icon: RxDashboard },
    { label: "وصاياي", href: "/dashboard/wills", icon: RxFileText },
    {
      label: "جديد",
      href: "/dashboard/new-request",
      icon: RxPlus,
      isPrimary: true,
    },
    { label: "المدفوعات", href: "/dashboard/payments", icon: RxIdCard },
    { label: "الإعدادات", href: "/dashboard/settings", icon: RxGear },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/60 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50 px-2 pb-safe">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className="w-14 h-14 rounded-full bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] hover:bg-position-[100%_100%] transition-all duration-500 flex items-center justify-center text-white shadow-lg border-4 border-[#f8f9f7]">
                  <Icon className="text-2xl" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 min-w-11 min-h-11 ${
                isActive
                  ? "text-[#19714f]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
