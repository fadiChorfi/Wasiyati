"use client";
import {
  RxFileText,
  RxClock,
  RxCheck,
  RxIdCard,
  RxArrowLeft,
  RxDownload,
  RxChatBubble,
  RxPlus,
  RxLockClosed,
} from "react-icons/rx";
import Link from "next/link";
import { useSubscription } from "@/context/SubscriptionContext";

export default function DashboardPage() {
  const currentSubscription = useSubscription();
  const hasActiveSubscription = currentSubscription?.status === "active";
  const hasPendingSubscription = currentSubscription?.status === "pending";

  const diffDays = currentSubscription?.started_at
    ? Math.ceil(
        (new Date(currentSubscription.started_at).getTime() +
          30 * 24 * 60 * 60 * 1000 -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const stats = [
    {
      label: "إجمالي الوصايا",
      value: "3",
      icon: RxFileText,
      colors: "bg-primary/10 text-primary",
    },
    {
      label: "قيد المراجعة",
      value: "2",
      icon: RxClock,
      colors: "bg-accent/10 text-accent-foreground",
    },
    {
      label: "مكتملة",
      value: "1",
      icon: RxCheck,
      colors: "bg-primary/10 text-primary",
    },
    {
      label: "المدفوعات",
      value: "15,000 د.ج",
      icon: RxIdCard,
      colors: "bg-accent/10 text-accent-foreground",
    },
  ];

  const recentActivity = [
    { type: "وصية عامة", date: "28 مارس 2026", status: "قيد المراجعة" },
    { type: "وصية مالية", date: "20 مارس 2026", status: "مكتملة" },
  ];

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "مكتملة":
        return { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" };
      case "قيد المراجعة":
        return {
          bg: "bg-accent/10",
          text: "text-accent-foreground",
          dot: "bg-accent",
        };
      case "بحاجة تعديل":
        return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
      case "مسودة":
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
      default:
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
    }
  };

  /* const profile = useUser(); */

  return (
    <div className="space-y-5 px-4 md:px-6 py-4  pb-24 md:pb-6" dir="rtl">
      {/* WELCOME BANNER */}
      {/* <WelcomeBanner profile={profile} /> */}

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-4 md:p-5 border border-border shadow-sm flex flex-col items-end"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center self-start mb-3 ${stat.colors}`}
              >
                <Icon className="text-lg" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground leading-none">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* SUBSCRIPTION WIDGET */}
      {hasActiveSubscription ? (
        <div className="bg-linear-to-l from-primary to-[#0a3f2f] rounded-3xl p-6 shadow-[0px_10px_30px_rgba(15,92,63,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shrink-0">
              <RxIdCard className="text-2xl" />
            </div>
            <div>
              <h3 className="text-primary-foreground font-black text-lg flex items-center gap-2">
                {currentSubscription?.offer?.name_ar || "باقة نشطة"}
                <span className="bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded-full font-bold">
                  نشط
                </span>
              </h3>
              <p className="text-primary-foreground/70 text-xs mt-1">
                يتبقى {diffDays > 0 ? diffDays : 0} يوم على صلاحية المراجعة
                القانونية
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="bg-accent text-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition w-full md:w-auto text-center relative z-10"
          >
            إدارة الاشتراك
          </Link>
        </div>
      ) : hasPendingSubscription ? (
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <RxClock className="text-2xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-blue-900 font-black text-lg flex items-center gap-2">
                الاشتراك قيد المراجعة
                <span className="bg-blue-200 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  قيد الانتظار
                </span>
              </h3>
              <p className="text-blue-700 text-xs mt-1">
                لقد استلمنا إيصال الدفع. سنقوم بتفعيل باقتك فور مراجعته من قبل
                الإدارة.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition w-full md:w-auto text-center relative z-10 flex items-center justify-center gap-2"
          >
            عرض التفاصيل <RxArrowLeft />
          </Link>
        </div>
      ) : (
        <div className="bg-surface border-2 border-dashed border-border rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-muted-foreground/10 rounded-2xl flex items-center justify-center text-muted-foreground shrink-0">
              <RxIdCard className="text-2xl" />
            </div>
            <div>
              <h3 className="text-foreground font-black text-lg flex items-center gap-2">
                لا يوجد اشتراك فعال
              </h3>
              <p className="text-muted-foreground text-xs mt-1">
                يرجى اختيار باقة للتمكن من البدء في تعبئة وصيتك ومراجعتها من قبل
                خبرائنا
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition w-full md:w-auto text-center relative z-10 flex items-center justify-center gap-2"
          >
            اشترك الآن <RxArrowLeft />
          </Link>
        </div>
      )}

      {/* CURRENT WILL STATUS */}
      {/* <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-foreground">وصيتك الحالية</h3>
          <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
            وصية عامة
          </span>
        </div>

        <div className="relative w-full mb-8 z-10">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10 mx-5"></div>
          <div className="absolute top-5 right-0 w-[50%] h-0.5 bg-primary -z-10 mx-5"></div>

          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground font-bold shadow-sm">
                <RxCheck className="text-lg" />
              </div>
              <span className="text-xs text-center mt-2 max-w-15 text-primary font-medium leading-tight">
                التسجيل
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold shadow-sm transition-all ${
                  hasActiveSubscription || hasPendingSubscription
                    ? hasActiveSubscription
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-blue-500 bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse"
                    : "border-primary bg-surface text-primary ring-4 ring-primary/20 animate-pulse"
                }`}
              >
                {hasActiveSubscription ? (
                  <RxCheck className="text-lg" />
                ) : hasPendingSubscription ? (
                  <RxClock className="text-lg animate-pulse" />
                ) : (
                  "2"
                )}
              </div>
              <span
                className={`text-xs text-center mt-2 max-w-15 leading-tight ${
                  hasActiveSubscription || hasPendingSubscription
                    ? hasActiveSubscription
                      ? "text-primary font-medium"
                      : "text-blue-600 font-bold"
                    : "text-foreground font-bold"
                }`}
              >
                الاشتراك
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold shadow-sm transition-all ${
                  hasActiveSubscription
                    ? "border-primary bg-surface text-primary ring-4 ring-primary/20 animate-pulse"
                    : "border-border bg-surface text-muted-foreground"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs text-center mt-2 max-w-15 leading-tight ${
                  hasActiveSubscription
                    ? "text-foreground font-bold"
                    : "text-muted-foreground"
                }`}
              >
                تعبئة النموذج
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-border bg-surface text-muted-foreground font-bold shadow-sm">
                4
              </div>
              <span className="text-xs text-center mt-2 max-w-15 text-muted-foreground leading-tight">
                الاعتماد
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-4 border border-border">
          {hasActiveSubscription ? (
            <>
              <h4 className="text-sm font-bold text-foreground">
                تعبئة النموذج
              </h4>
              <p className="text-xs text-muted-foreground leading-6 mt-1">
                يرجى استكمال البيانات المطلوبة لتقديم الطلب لمراجعته من قبل
                خبرائنا.
              </p>
              <Link
                href="/dashboard/new-request"
                className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium mt-4 hover:bg-primary/90 transition active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                متابعة النموذج <RxArrowLeft />
              </Link>
            </>
          ) : hasPendingSubscription ? (
            <>
              <h4 className="text-sm font-bold text-blue-800">
                الاشتراك قيد المراجعة
              </h4>
              <p className="text-xs text-blue-700 leading-6 mt-1">
                لا يمكنك الشروع في تعبئة النموذج حتى تتم الموافقة على اشتراكك.
                يرجى الانتظار.
              </p>
              <Link
                href="/dashboard/payments"
                className="bg-blue-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium mt-4 hover:bg-blue-700 transition active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                تتبع الطلب <RxArrowLeft />
              </Link>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold text-foreground">
                اختر الباقة المناسبة
              </h4>
              <p className="text-xs text-muted-foreground leading-6 mt-1">
                الخطوة التالية هي اختيار باقة الاشتراك للتمكن من الشروع في تجهيز
                وتسجيل طلب وصيتك الخاصة.
              </p>
              <Link
                href="/dashboard/payments"
                className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium mt-4 hover:bg-primary/90 transition active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                الانتقال للدفع <RxArrowLeft />
              </Link>
            </>
          )}
        </div>
      </div> */}

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-5 mt-5">
        {/* Card 1 */}
        {hasActiveSubscription ? (
          <Link
            href="/dashboard/new-request"
            className="block bg-primary rounded-3xl p-6 relative overflow-hidden group hover:opacity-95 transition-opacity"
          >
            <div className="absolute top-4 left-4 bg-primary-foreground/20 rounded-xl p-2 text-primary-foreground">
              <RxArrowLeft />
            </div>
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div className="bg-primary-foreground/20 rounded-2xl p-3 w-fit text-primary-foreground text-xl shrink-0">
                <RxPlus />
              </div>
              <h4 className="text-base font-bold text-primary-foreground md:mt-4">
                إنشاء وصية جديدة
              </h4>
            </div>
          </Link>
        ) : (
          <div className="block bg-surface border border-border rounded-3xl p-6 relative overflow-hidden group">
            <Link
              href="/dashboard/payments"
              className="absolute top-4 left-4 bg-primary/10 hover:bg-primary/20 rounded-xl p-2 text-primary transition-colors"
            >
              <RxArrowLeft />
            </Link>
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div className="bg-primary/10 rounded-2xl p-3 w-fit text-primary text-xl shrink-0 relative">
                <RxPlus />
                <div className="absolute -top-1 -right-1 bg-accent w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface">
                  <RxLockClosed className="text-[8px] text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground md:mt-4">
                  إنشاء وصية جديدة
                </h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                  <RxLockClosed className="text-accent" />
                  تتطلب باقة فعالة
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card 2 */}
        <button className="bg-surface rounded-3xl p-6 border border-border text-right hover:shadow-md transition-shadow flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="bg-primary/10 rounded-2xl p-3 w-fit text-primary shrink-0">
            <RxDownload className="text-xl" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground md:mt-4">
              تحميل وصيتي
            </h4>
            <p className="text-xs text-muted-foreground mt-1">PDF</p>
          </div>
        </button>

        {/* Card 3 */}
        <button className="bg-surface rounded-3xl p-6 border border-border text-right hover:shadow-md transition-shadow flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="bg-accent/10 rounded-2xl p-3 w-fit text-accent-foreground shrink-0">
            <RxChatBubble className="text-xl" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground md:mt-4">
              تواصل مع خبير
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              رد خلال 24 ساعة
            </p>
          </div>
        </button>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-base font-bold text-foreground">النشاط الأخير</h3>
          <Link
            href="/dashboard/wills"
            className="text-sm text-primary hover:underline font-medium"
          >
            عرض الكل
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-background">
              <tr>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  النوع
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  التاريخ
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                  الإجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, idx) => {
                const b = getBadgeStyle(activity.status);
                return (
                  <tr
                    key={idx}
                    className="border-t border-border hover:bg-background/50 transition"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-foreground">
                      {activity.type}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {activity.date}
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${b.dot}`}
                        ></div>
                        {activity.status}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-sm text-primary hover:underline font-medium min-h-11 min-w-11">
                        عرض
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col">
          {recentActivity.map((activity, idx) => {
            const b = getBadgeStyle(activity.status);
            return (
              <div
                key={idx}
                className="px-4 py-4 border-t border-border flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground">
                    {activity.type}
                  </span>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${b.dot}`}></div>
                    {activity.status}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {activity.date}
                  </span>
                  <button className="text-sm text-primary hover:underline font-medium min-h-11 min-w-11">
                    عرض
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
