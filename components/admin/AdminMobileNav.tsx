"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxDashboard, RxFileText, RxPerson, RxGear } from "react-icons/rx";

export default function AdminMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "لوحة القيادة", href: "/admin", icon: RxDashboard },
    { label: "الوصايا", href: "/admin/wills", icon: RxFileText },
    { label: "المستخدمين", href: "/admin/users", icon: RxPerson },
    { label: "الإعدادات", href: "/admin/settings", icon: RxGear },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-border flex justify-between px-6 py-2.5 z-40 pb-5 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 min-h-11 min-w-11 justify-center transition-all ${
              isActive
                ? "text-primary scale-110 font-bold"
                : "text-muted-foreground hover:text-foreground font-medium"
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                isActive ? "bg-primary/10" : "bg-transparent"
              }`}
            >
              <Icon className="text-2xl" />
            </div>
            <span className={`text-[10px] ${isActive ? "block" : "hidden"}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-primary mt-0.5 absolute -bottom-2"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
