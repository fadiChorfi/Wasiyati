"use client";

import { usePathname } from "next/navigation";
import {
  RxBell,
  RxPerson,
  RxArchive,
  RxGear,
  RxExit,
  RxPlus,
} from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const profile = useUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockNotifications = [
    {
      id: 1,
      title: "تم التوثيق بنجاح",
      desc: "تم اعتماد وصيتك بنجاح من قبل الخبير.",
      time: "منذ ساعتين",
      isNew: true,
    },
    {
      id: 2,
      title: "رسالة جديدة",
      desc: "لديك ملاحظة جديدة بخصوص طلبك رقم #1029.",
      time: "منذ 5 ساعات",
      isNew: true,
    },
    {
      id: 3,
      title: "تذكير بالدفع",
      desc: "يرجى رفع إيصال الدفع للباقة المختارة.",
      time: "منذ يومين",
      isNew: false,
    },
  ];

  let title = "نظرة عامة";
  if (pathname.includes("/wills")) title = "وصاياي";
  if (pathname.includes("/new-request")) title = "إنشاء وصية جديدة";
  if (pathname.includes("/payments")) title = "المدفوعات";
  if (pathname.includes("/settings")) title = "الإعدادات";

  return (
    <header className="fixed md:sticky top-0 right-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-30 flex items-center justify-between px-4 md:px-8">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#06281e]">
          {title}
        </h2>
        <p className="text-xs text-gray-500 hidden md:block mt-1">
          {new Date().toLocaleDateString("ar-DZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/new-request"
          className="flex items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] hover:bg-position-[100%_100%] text-white px-5 min-h-11 rounded-full text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <RxPlus className="text-xl" />
          <span className="hidden md:block">وصية جديدة</span>
        </Link>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#06281e] hover:bg-gray-200 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="الإشعارات"
          >
            <RxBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100/80 z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-[#06281e]">الإشعارات</h3>
                <button className="text-xs text-[#19714f] font-bold hover:underline">
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${notif.isNew ? "bg-white" : "bg-gray-50/50 opacity-75"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isNew ? "bg-red-500" : "bg-transparent"}`}
                    ></div>
                    <div>
                      <p
                        className={`text-sm ${notif.isNew ? "font-bold text-[#06281e]" : "font-medium text-gray-700"}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50/50 text-center">
                <button className="text-xs font-bold text-[#06281e] hover:text-[#19714f] transition-colors">
                  عرض كل الإشعارات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
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
