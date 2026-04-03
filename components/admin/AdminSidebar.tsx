"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxDashboard, RxFileText, RxPerson, RxGear } from "react-icons/rx";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "لوحة القيادة", href: "/admin", icon: RxDashboard },
    { label: "إدارة الوصايا", href: "/admin/wills", icon: RxFileText },
    { label: "إدارة المستخدمين", href: "/admin/users", icon: RxPerson },
    { label: "الإعدادات", href: "/admin/settings", icon: RxGear },
  ];

  return (
    <aside className="hidden md:flex flex-col w-65 h-screen bg-surface border-l border-border shadow-sm fixed top-0 right-0 z-40">
      <div className="p-6 h-20 flex items-center border-b border-border">
        <h1 className="text-2xl font-black text-foreground">وصيتي - الإدارة</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 min-h-11 rounded-xl font-bold transition-all text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md transition-all duration-500"
                    : "text-foreground hover:bg-black/5 border border-transparent"
                }`}
              >
                <Icon
                  className={`text-xl ${isActive ? "text-primary-foreground" : "text-primary"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
