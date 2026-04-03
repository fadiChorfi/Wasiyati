import {
  RxFileText,
  RxPerson,
  RxCheck,
  RxActivityLog,
  RxArrowLeft,
  RxLayers,
  RxEnvelopeClosed,
} from "react-icons/rx";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "المستخدمين",
      value: "142",
      icon: RxPerson,
      colors: "bg-primary/10 text-primary",
    },
    {
      label: "وصايا قيد المراجعة",
      value: "12",
      icon: RxActivityLog,
      colors: "bg-accent/10 text-accent-foreground",
    },
    {
      label: "وصايا مكتملة",
      value: "45",
      icon: RxCheck,
      colors: "bg-primary/10 text-primary",
    },
    {
      label: "إجمالي الطلبات",
      value: "57",
      icon: RxLayers,
      colors: "bg-accent/10 text-accent-foreground",
    },
  ];

  const recentUsers = [
    { name: "أحمد بن علي", email: "ahmed@example.com", date: "اليوم 10:30 ص" },
    { name: "سارة محمد", email: "sara@example.com", date: "أمس 14:15 م" },
    { name: "كريم حسن", email: "karim@example.com", date: "28 مارس 2026" },
  ];

  const recentActivity = [
    {
      user: "محمد عمر",
      action: "تقديم وصية مالية",
      status: "قيد المراجعة",
      time: "قبل ساعتين",
    },
    {
      user: "ليلى علي",
      action: "دفع رسوم الخدمة",
      status: "مكتمل",
      time: "قبل 5 ساعات",
    },
    {
      user: "عبدالله حسن",
      action: "تحديث مسودة الوصية",
      status: "مسودة",
      time: "قبل يوم",
    },
  ];

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "مكتمل":
      case "مكتملة":
        return { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" };
      case "قيد المراجعة":
        return {
          bg: "bg-accent/10",
          text: "text-accent-foreground",
          dot: "bg-accent",
        };
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

  return (
    <div className="space-y-5 px-4 md:px-6 py-4 pb-24 md:pb-6" dir="rtl">
      {/* ADMIN WELCOME BANNER */}
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 text-right">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">
            مرحباً بك في لوحة الإدارة 👋
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            إليك نظرة شاملة على نشاط المنصة وحالة الطلبات
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Card 1 */}
        <Link
          href="/admin/wills?status=pending"
          className="block bg-primary rounded-3xl p-6 relative overflow-hidden group hover:opacity-95 transition-opacity"
        >
          <div className="absolute top-4 left-4 bg-primary-foreground/20 rounded-xl p-2 text-primary-foreground">
            <RxArrowLeft />
          </div>
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div className="bg-primary-foreground/20 rounded-2xl p-3 w-fit text-primary-foreground text-xl shrink-0">
              <RxFileText />
            </div>
            <h4 className="text-base font-bold text-primary-foreground md:mt-4">
              مراجعة الطلبات الجديدة
            </h4>
          </div>
        </Link>

        {/* Card 2 */}
        <Link
          href="/admin/users"
          className="block bg-surface rounded-3xl p-6 border border-border text-right hover:shadow-md transition-shadow group"
        >
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0 relative">
            <div className="absolute top-0 left-0 hidden md:block bg-black/5 rounded-xl p-2 text-foreground group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
              <RxArrowLeft />
            </div>
            <div className="bg-primary/10 rounded-2xl p-3 w-fit text-primary shrink-0">
              <RxPerson className="text-xl" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground md:mt-4">
                إدارة المستخدمين
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                تفعيل أو إيقاف الحسابات
              </p>
            </div>
          </div>
        </Link>

        {/* Card 3 */}
        <Link
          href="/admin/messages"
          className="block bg-surface rounded-3xl p-6 border border-border text-right hover:shadow-md transition-shadow group"
        >
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0 relative">
            <div className="absolute top-0 left-0 hidden md:block bg-black/5 rounded-xl p-2 text-foreground group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
              <RxArrowLeft />
            </div>
            <div className="bg-accent/10 rounded-2xl p-3 w-fit text-accent-foreground shrink-0">
              <RxEnvelopeClosed className="text-xl" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground md:mt-4">
                رسائل التواصل
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                الرد على استفسارات العملاء
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* RECENT ACTIVITY TABLE (Takes 2/3 of space on desktop) */}
        <div className="lg:col-span-2 bg-surface rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">
              النشاط الأخير في المنصة
            </h3>
            <Link
              href="/admin/activity"
              className="text-sm text-primary hover:underline font-medium"
            >
              سجل النشاطات
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block w-full flex-1 overflow-x-auto">
            <table className="w-full text-right h-full">
              <thead className="bg-background">
                <tr>
                  <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                    المستخدم
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                    الإجراء
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                    الوقت
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-muted-foreground">
                    الحالة
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
                        {activity.user}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {activity.action}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {activity.time}
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
                      {activity.user}
                    </span>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 w-fit ${b.bg} ${b.text}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${b.dot}`}
                      ></div>
                      {activity.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-foreground font-medium">
                      {activity.action}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEW USERS WIDGET (Takes 1/3 of space on desktop) */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">
              مستخدمين جدد
            </h3>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline font-medium"
            >
              إدارة
            </Link>
          </div>

          <div className="flex flex-col p-4 gap-3 flex-1">
            {recentUsers.map((u, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 hover:bg-background transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg pb-1 leading-none shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {u.name}
                  </h4>
                  <p
                    className="text-xs text-muted-foreground truncate"
                    dir="ltr"
                  >
                    {u.email}
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0">
                  {u.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
