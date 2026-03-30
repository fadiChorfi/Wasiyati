"use client";

import { usePathname } from "next/navigation";
import { RxBell, RxMagnifyingGlass } from "react-icons/rx";

export default function TopBar() {
  const pathname = usePathname();

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

        <button
          className="relative p-2 text-[#06281e] hover:bg-gray-200 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
          aria-label="الإشعارات"
        >
          <RxBell className="text-xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
