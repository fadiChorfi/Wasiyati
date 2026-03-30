"use client";

import { usePathname } from "next/navigation";
import { RxBell, RxMagnifyingGlass } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";

export default function TopBar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
        <button
          className="md:hidden p-2 text-[#06281e] hover:bg-gray-100 rounded-lg min-h-11 min-w-11 flex items-center justify-center"
          aria-label="بحث"
        >
          <RxMagnifyingGlass className="text-xl" />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-[#19714f]/30 focus-within:bg-white transition-all w-64 lg:w-80">
          <input
            type="text"
            placeholder="ابحث عن وصية، مستند..."
            className="bg-transparent border-none outline-none w-full text-sm text-[#06281e] pr-2"
          />
          <RxMagnifyingGlass className="text-gray-400 text-lg mr-2" />
        </div>

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
      </div>
    </header>
  );
}
