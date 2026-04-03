import {
  RxFileText,
  RxClock,
  RxCheck,
  RxIdCard,
  RxArrowLeft,
  RxDownload,
  RxChatBubble,
  RxPlus,
} from "react-icons/rx";
import Link from "next/link";

export default function DashboardPage() {
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

  return (
    <div
      className="space-y-5 px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6"
      dir="rtl"
    >
      {/* WELCOME BANNER */}
      <div className="bg-primary rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/5 -bottom-12 -right-12"></div>
        <div className="relative z-10 text-right">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">
            مرحباً، محمد 👋
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            إليك ملخص وصاياك ونشاطك الأخير
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

      {/* CURRENT WILL STATUS */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-foreground">وصيتك الحالية</h3>
          <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
            وصية عامة
          </span>
        </div>

        {/* Stepper */}
        <div className="relative w-full mb-8 z-10">
          {/* Progress Lines */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10 mx-5"></div>
          <div className="absolute top-5 right-0 w-[50%] h-0.5 bg-primary -z-10 mx-5"></div>

          <div className="flex justify-between items-start">
            {/* Step 1: Completed */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground font-bold shadow-sm">
                <RxCheck className="text-lg" />
              </div>
              <span className="text-xs text-center mt-2 max-w-15 text-primary font-medium leading-tight">
                التسجيل
              </span>
            </div>

            {/* Step 2: Completed */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground font-bold shadow-sm">
                <RxCheck className="text-lg" />
              </div>
              <span className="text-xs text-center mt-2 max-w-15 text-primary font-medium leading-tight">
                الاشتراك
              </span>
            </div>

            {/* Step 3: Current */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary bg-surface text-primary font-bold ring-4 ring-primary/20 animate-pulse shadow-sm">
                3
              </div>
              <span className="text-xs text-center mt-2 max-w-15 text-foreground font-bold leading-tight">
                تعبئة النموذج
              </span>
            </div>

            {/* Step 4: Upcoming */}
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

        {/* Current Step Card */}
        <div className="bg-background rounded-2xl p-4 border border-border">
          <h4 className="text-sm font-bold text-foreground">تعبئة النموذج</h4>
          <p className="text-xs text-muted-foreground leading-6 mt-1">
            يرجى استكمال البيانات المطلوبة لتقديم الطلب لمراجعته من قبل خبرائنا.
          </p>
          <button className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium mt-4 hover:bg-primary/90 transition active:scale-95 shadow-sm inline-flex items-center gap-2">
            متابعة النموذج <RxArrowLeft />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Card 1 */}
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
