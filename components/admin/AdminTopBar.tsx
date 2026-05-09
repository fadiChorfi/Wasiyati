"use client";

import { usePathname, useRouter } from "next/navigation";
import { RxArchive, RxBell, RxExit, RxGear, RxPerson } from "react-icons/rx";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type NotificationItem = {
  id: string;
  title_ar: string;
  message_ar: string;
  is_read: boolean;
  created_at: string;
  will_id: string | null;
  subscription_id: string | null;
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const profile = useUser();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

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
      .channel(`admin-notifications-${profile.id}`)
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

  let title = "لوحة القيادة";
  if (pathname.includes("/admin/dashboard/wills")) title = "إدارة الوصايا";
  if (pathname.includes("/admin/dashboard/users")) title = "إدارة المستخدمين";
  if (pathname.includes("/admin/dashboard/consultations")) title = "الاستشارات";
  if (pathname.includes("/admin/dashboard/settings")) title = "الإعدادات";

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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              const next = !showNotifications;
              setShowNotifications(next);
              if (next) {
                void refreshNotifications(true);
              }
            }}
            className="relative p-2 text-foreground hover:bg-black/5 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="الإشعارات"
          >
            <RxBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute left-0 mt-2 w-80 bg-surface rounded-2xl shadow-lg border border-border z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/5">
                <h3 className="font-bold text-foreground">الإشعارات</h3>
                <button
                  onClick={() => void markAllAsRead()}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    جاري تحميل الإشعارات...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    لا توجد إشعارات حالياً
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-border/50 flex gap-3 hover:bg-black/5 transition-colors ${
                        !notif.is_read ? "bg-background" : "bg-black/5 opacity-75"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.is_read ? "bg-red-500" : "bg-transparent"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            !notif.is_read
                              ? "font-bold text-foreground"
                              : "font-medium text-muted-foreground"
                          }`}
                        >
                          {notif.title_ar}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {notif.message_ar}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2">
                          {formatDateTime(notif.created_at)}
                        </p>
                        {notif.will_id && (
                          <Link
                            href={`/admin/dashboard/wills/${notif.will_id}`}
                            className="text-[11px] text-primary font-bold mt-2 inline-block hover:underline"
                            onClick={() => setShowNotifications(false)}
                          >
                            فتح الوصية
                          </Link>
                        )}
                        {!notif.will_id && notif.subscription_id && (
                          <Link
                            href={`/admin/dashboard/subscriptions/${notif.subscription_id}`}
                            className="text-[11px] text-primary font-bold mt-2 inline-block hover:underline"
                            onClick={() => setShowNotifications(false)}
                          >
                            فتح الاشتراك
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
