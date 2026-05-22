"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RxDashboard,
  RxFileText,
  RxIdCard,
  RxGear,
  RxArrowRight,
} from "react-icons/rx";
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useUser();

  const navItems = [
    { label: "الرئيسية", href: "/dashboard", icon: RxDashboard },
    { label: "وصايا", href: "/dashboard/wills", icon: RxFileText },
    { label: "طلب جديد", href: "/dashboard/new-request", icon: RxFileText },
    { label: "المدفوعات", href: "/dashboard/payments", icon: RxIdCard },
    { label: "الإعدادات", href: "/dashboard/settings", icon: RxGear },
  ];

  return (
    <aside className="hidden md:flex flex-col w-65 h-screen bg-white border-l border-gray-200/60 shadow-sm fixed top-0 right-0 z-40">
      <div className="p-6 h-20 flex items-center border-b border-gray-100">
        <h1 className="text-2xl font-black text-[#06281e]">وصيتي</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-2">
          {user.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-between gap-3 px-4 min-h-11 rounded-xl font-bold transition-all text-sm bg-accent/10 border border-accent/20 text-accent-foreground shadow-sm hover:bg-accent hover:text-white"
            >
              <div className="flex items-center gap-3">
                <RxDashboard className="text-xl" />
                <span>لوحة تحكم المشرف</span>
              </div>
            </Link>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 min-h-11 rounded-xl font-bold transition-all text-sm ${
                  isActive
                    ? "bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white shadow-md bg-size-[150%_150%] hover:bg-position-[100%_100%] transition-all duration-500"
                    : "text-[#06281e] hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon
                  className={`text-xl ${isActive ? "text-white" : "text-[#19714f]"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 min-h-11 rounded-xl font-bold transition-all text-sm text-[#06281e] hover:bg-gray-50 border border-transparent"
        >
          <RxArrowRight className="text-xl text-[#19714f]" />
          <span>العودة للمنصة</span>
        </Link>
      </div>
    </aside>
  );
}
