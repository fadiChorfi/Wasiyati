"use client";

import { usePathname, useRouter } from "next/navigation";
import { RxBell, RxArchive, RxGear, RxExit, RxPlus } from "react-icons/rx";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  title_ar: string;
  message_ar: string;
  is_read: boolean;
  created_at: string;
  will_id: string | null;
  subscription_id: string | null;
};

export default function TopBar() {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const profile = useUser();

  const refreshNotifications = async (withLoader = false) => {
    if (!profile?.id) return;
    if (withLoader) setLoadingNotifications(true);

    const { data } = await supabase
      .from("notifications")
      .select(
        "id, title_ar, message_ar, is_read, created_at, will_id, subscription_id",
      )
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications((data ?? []) as NotificationItem[]);
    if (withLoader) setLoadingNotifications(false);
  };

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

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      if (!profile?.id) return;
      setLoadingNotifications(true);
      const { data } = await supabase
        .from("notifications")
        .select(
          "id, title_ar, message_ar, is_read, created_at, will_id, subscription_id",
        )
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!mounted) return;
      setNotifications((data ?? []) as NotificationItem[]);
      setLoadingNotifications(false);
    };

    void loadNotifications();

    return () => {
      mounted = false;
    };
  }, [profile?.id, supabase]);

  useEffect(() => {
    if (!profile?.id) return;

    const loadNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select(
          "id, title_ar, message_ar, is_read, created_at, will_id, subscription_id",
        )
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications((data ?? []) as NotificationItem[]);
      setLoadingNotifications(false);
    };

    const channel = supabase
      .channel(`user-notifications-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          setLoadingNotifications(true);
          void loadNotifications();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profile?.id, supabase]);

  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    if (!profile?.id) return;

    const interval = setInterval(() => {
      void (async () => {
        const { data } = await supabase
          .from("notifications")
          .select(
            "id, title_ar, message_ar, is_read, created_at, will_id, subscription_id",
          )
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(20);

        setNotifications((data ?? []) as NotificationItem[]);
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [profile?.id, supabase]);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const formatDateTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("ar-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markAllAsRead = async () => {
    if (!profile?.id) return;
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true })),
    );
  };

  let title = "نظرة عامة";
  if (pathname.includes("/wills")) title = "وصايا";
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
            onClick={() => {
              const next = !showNotifications;
              setShowNotifications(next);
              if (next) {
                void refreshNotifications(true);
              }
            }}
            className="relative p-2 text-[#06281e] hover:bg-gray-200 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="الإشعارات"
          >
            <RxBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100/80 z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-[#06281e]">الإشعارات</h3>
                <button
                  onClick={() => void markAllAsRead()}
                  className="text-xs text-[#19714f] font-bold hover:underline"
                >
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    جاري تحميل الإشعارات...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    لا توجد إشعارات حالياً
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${!notif.is_read ? "bg-white" : "bg-gray-50/50 opacity-75"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.is_read ? "bg-red-500" : "bg-transparent"}`}
                      ></div>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${!notif.is_read ? "font-bold text-[#06281e]" : "font-medium text-gray-700"}`}
                        >
                          {notif.title_ar}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {notif.message_ar}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {formatDateTime(notif.created_at)}
                        </p>
                        {notif.will_id && (
                          <Link
                            href={`/dashboard/wills/${notif.will_id}`}
                            className="text-[11px] text-[#19714f] font-bold mt-2 inline-block hover:underline"
                            onClick={() => setShowNotifications(false)}
                          >
                            فتح الوصية
                          </Link>
                        )}
                        {!notif.will_id && notif.subscription_id && (
                          <Link
                            href="/dashboard/payments"
                            className="text-[11px] text-[#19714f] font-bold mt-2 inline-block hover:underline"
                            onClick={() => setShowNotifications(false)}
                          >
                            فتح المدفوعات
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
                {profile?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <RxGear className="text-lg text-[#19714f]" />{" "}
                    {/* you can adjust the icon color to match your admin color schema */}
                    لوحة تحكم المشرف
                  </Link>
                )}
                <button
                  onClick={() => router.push("/dashboard/payments")}
                  className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <RxArchive className="text-lg text-gray-500" />
                    عروضي
                  </div>
                  <span className="text-[10px] bg-[#c6a96a] text-[#06281e] px-1.5 py-0.5 rounded-sm font-bold opacity-80 group-hover:opacity-100 transition">
                    نشط
                  </span>
                </button>
                {/* <button className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RxPerson className="text-lg text-gray-500" />
                  الملف الشخصي
                </button> */}
                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="w-full text-right px-4 py-2.5 text-sm text-[#06281e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <RxGear className="text-lg text-gray-500" />
                  الإعدادات
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
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
