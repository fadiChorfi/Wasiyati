import {
  RxFileText,
  RxClock,
  RxCheckCircled,
  RxIdCard,
  RxArrowLeft,
  RxDownload,
  RxChatBubble,
} from "react-icons/rx";

export default function DashboardPage() {
  const stats = [
    { label: "إجمالي الوصايا", value: "3", icon: RxFileText },
    { label: "قيد المراجعة", value: "2", icon: RxClock },
    { label: "مكتملة", value: "1", icon: RxCheckCircled },
    { label: "المدفوعات", value: "15,000 د.ج", icon: RxIdCard },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {/* Welcome Banner */}
      <div className="w-full bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-35 bg-size-[200%_200%] hover:bg-position-[100%_100%] transition-all duration-700">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10 w-full text-right">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">مرحباً، محمد</h2>
          <p className="text-white/80 text-sm md:text-base">
            إليك ملخص وصاياك ونشاطك الأخير
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-right hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-[#f8f9f7] text-[#06281e] border border-gray-200/60 flex items-center justify-center shrink-0">
                <Icon className="text-xl" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-[#06281e] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Will Status */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4 md:p-8">
        <h3 className="text-lg font-bold text-[#06281e] mb-8 text-right">
          وصيتك الحالية
        </h3>

        {/* Progress Bar */}
        <div className="relative w-full max-w-3xl mx-auto mb-10 flex justify-between items-center z-10 md:px-0">
          <div className="absolute top-1/2 right-0 left-0 h-1 bg-gray-200 -translate-y-1/2 -z-10 mx-6 md:mx-10"></div>
          <div className="absolute top-1/2 right-0 w-[50%] h-1 bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] -translate-y-1/2 -z-10 mx-6 md:mx-10 transition-all"></div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] flex items-center justify-center text-white border-4 border-white shadow-sm ring-1 ring-gray-100">
              <RxCheckCircled className="text-xs md:text-sm" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-[#19714f]">
              التسجيل
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] flex items-center justify-center text-white border-4 border-white shadow-sm ring-1 ring-gray-100">
              <RxCheckCircled className="text-xs md:text-sm" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-[#19714f]">
              الاشتراك
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#06281e] flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-[#06281e] relative">
              <span className="w-2 h-2 rounded-full bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] animate-pulse"></span>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-[#06281e] whitespace-nowrap">
              تعبئة النموذج
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 border-4 border-white shadow-sm ring-1 ring-gray-100"></div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400">
              الاعتماد
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-[#f8f9f7] rounded-xl p-4 md:p-6 border border-gray-100 gap-4 text-center md:text-right w-full">
          <div>
            <h4 className="font-bold text-[#06281e] mb-1">
              تعبئة نموذج الخدمة (قيد التنفيذ)
            </h4>
            <p className="text-sm text-gray-500">
              يرجى استكمال البيانات المطلوبة لتقديم الطلب لمراجعته.
            </p>
          </div>
          <button className="bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] hover:bg-position-[100%_100%] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all min-h-11 shrink-0 w-full md:w-auto">
            متابعة النموذج
          </button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="group bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] hover:bg-position-[100%_100%] text-white p-5 md:p-6 rounded-2xl flex flex-col gap-4 text-right transition-all duration-500 border border-transparent min-h-11">
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
            <RxArrowLeft className="text-xl -rotate-45" />
          </div>
          <span className="font-bold text-lg">إنشاء وصية جديدة</span>
        </button>
        <button className="group bg-white text-black p-5 md:p-6 rounded-2xl flex flex-col gap-4 text-right transition-all border border-gray-200/60 shadow-sm min-h-11 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] group-hover:bg-position-[100%_100%] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-[#f8f9f7] group-hover:bg-white text-[#06281e] flex items-center justify-center shrink-0 border border-gray-200/60 group-hover:border-transparent transition-all">
            <RxDownload className="text-xl" />
          </div>
          <span className="relative z-10 font-bold text-lg group-hover:text-white transition-colors">
            تحميل وصيتي
          </span>
        </button>
        <button className="group bg-white text-black p-5 md:p-6 rounded-2xl flex flex-col gap-4 text-right transition-all border border-gray-200/60 shadow-sm min-h-11 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-size-[200%_200%] group-hover:bg-position-[100%_100%] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-[#f8f9f7] group-hover:bg-white text-[#06281e] flex items-center justify-center shrink-0 border border-gray-200/60 group-hover:border-transparent transition-all">
            <RxChatBubble className="text-xl" />
          </div>
          <span className="relative z-10 font-bold text-lg group-hover:text-white transition-colors">
            تواصل مع خبير
          </span>
        </button>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden w-full">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between text-right w-full">
          <h3 className="text-lg font-bold text-[#06281e]">النشاط الأخير</h3>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100 w-full text-right">
          <div className="p-4 flex flex-col gap-3 w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <h4 className="font-bold text-sm text-[#06281e] mb-1">
                  وصية عامة
                </h4>
                <span className="text-xs text-gray-500">28 مارس 2026</span>
              </div>
              <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full bg-yellow-50 text-yellow-700">
                قيد المراجعة
              </span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <h4 className="font-bold text-sm text-[#06281e] mb-1">
                  وصية مالية
                </h4>
                <span className="text-xs text-gray-500">20 مارس 2026</span>
              </div>
              <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#19714f]/10 text-[#19714f]">
                مكتمل
              </span>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block w-full overflow-x-auto text-right">
          <table className="w-full text-right text-sm border-collapse">
            <thead className="bg-[#f8f9f7] text-gray-500 border-b border-gray-200 text-right">
              <tr>
                <th className="py-4 px-6 font-semibold text-right">النوع</th>
                <th className="py-4 px-6 font-semibold text-right">التاريخ</th>
                <th className="py-4 px-6 font-semibold text-right">الحالة</th>
                <th className="py-4 px-6 font-semibold text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-right">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-bold text-[#06281e]">
                  وصية عامة
                </td>
                <td className="py-4 px-6 text-gray-500">28 مارس 2026</td>
                <td className="py-4 px-6">
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-yellow-50 text-yellow-700">
                    قيد المراجعة
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-[#19714f] font-bold hover:underline min-h-11 min-w-11">
                    عرض
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-bold text-[#06281e]">
                  وصية مالية
                </td>
                <td className="py-4 px-6 text-gray-500">20 مارس 2026</td>
                <td className="py-4 px-6">
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-[#19714f]/10 text-[#19714f]">
                    مكتمل
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-[#19714f] font-bold hover:underline min-h-11 min-w-11">
                    عرض
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
