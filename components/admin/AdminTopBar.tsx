"use client";

import { usePathname } from "next/navigation";
import {
  RxArchive,
  RxBell,
  RxExit,
  RxGear,
  RxMagnifyingGlass,
  RxPerson,
} from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function AdminTopBar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const profile = useUser();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockNotifications = [
    {
      id: 1,
      title: "طلب وصية جديد",
      desc: "هناك طلب وصية جديد بانتظار المراجعة.",
      time: "منذ 10 دقائق",
      isNew: true,
    },
  ];

  let title = "لوحة القيادة";
  if (pathname.includes("/admin/wills")) title = "إدارة الوصايا";
  if (pathname.includes("/admin/users")) title = "إدارة المستخدمين";
  if (pathname.includes("/admin/settings")) title = "الإعدادات";

  return (
    <header className="fixed md:sticky top-0 right-0 left-0 w-full h-20 bg-background/80 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-4 md:px-8">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground hidden md:block mt-1">
          {new Date().toLocaleDateString("ar-DZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 text-foreground hover:bg-black/5 rounded-lg min-h-11 min-w-11 flex items-center justify-center"
          aria-label="بحث"
        >
          <RxMagnifyingGlass className="text-xl" />
        </button>

        <div className="hidden md:flex items-center bg-surface border border-border rounded-full px-4 py-2 focus-within:border-primary/30 focus-within:bg-background transition-all w-64 lg:w-80">
          <input
            type="text"
            placeholder="ابحث عن مستخدم، وصية..."
            className="bg-transparent border-none outline-none w-full text-sm text-foreground pr-2 placeholder:text-muted-foreground"
          />
          <RxMagnifyingGlass className="text-muted-foreground text-lg mr-2" />
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-foreground hover:bg-black/5 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="الإشعارات"
          >
            <RxBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute left-0 mt-2 w-80 bg-surface rounded-2xl shadow-lg border border-border z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/5">
                <h3 className="font-bold text-foreground">الإشعارات</h3>
                <button className="text-xs text-primary font-bold hover:underline">
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border/50 flex gap-3 hover:bg-black/5 transition-colors ${
                      notif.isNew ? "bg-background" : "bg-black/5 opacity-75"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notif.isNew ? "bg-red-500" : "bg-transparent"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`text-sm ${
                          notif.isNew
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar */}

        <div className="relative group" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-gray-100 p-1.5 pr-2 rounded-full transition-colors"
            aria-label="قائمة المستخدم"
          >
            <div className="w-8 h-8 rounded-full bg-[#c6a96a] text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-gray-200">
              {profile?.avatar_url ? (
                <Image
                  width={32}
                  height={32}
                  src={profile.avatar_url}
                  alt={profile.full_name || "مستخدم"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {profile?.full_name?.charAt(0) || "م"}
                </span>
              )}
            </div>
            <span className="hidden md:block text-sm font-bold text-[#06281e]">
              {profile?.full_name || "مستخدم"}
            </span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div
              className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100/80 z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="py-2">
                <button className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RxArchive className="text-lg text-gray-500" />
                  عروضي
                </button>
                <button className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RxPerson className="text-lg text-gray-500" />
                  الملف الشخصي
                </button>
                <button className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RxGear className="text-lg text-gray-500" />
                  الإعدادات
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full text-right px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center gap-2">
                  <RxExit className="text-lg" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
