import ActionButton from "@/components/landing/ActionButton";
import Link from "next/link";
import { RxArrowTopLeft, RxCheck, RxCross2 } from "react-icons/rx";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20" dir="rtl">
      {/* Header Hero Area */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-24 pb-20 px-6 mb-12 rounded-b-[40px] mx-2">
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            دليل عمل المنصة
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            خطوات مبسطة تبدأ واضحة وتنتهي باعتماد طلبك من قبل الخبراء، كل شيء
            هنا يتم مراجعته ومتابعته بكل أمان وموثوقية دقيقة.
          </p>
        </div>
      </section>

      {/* Steps Area */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative flex flex-col space-y-12 w-full pb-10">
          {/* Vertical Timeline Line */}
          <div className="absolute right-5.5 md:right-7.5 top-10 bottom-4 w-1 bg-linear-to-b from-[#19714f] via-[#19714f]/20 to-transparent z-0 rounded-full"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex gap-5 md:gap-8 w-full group pt-2">
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#e8f3ef] text-[#19714f] rounded-2xl flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-[#19714f] group-hover:text-white transition-all duration-300 mt-1">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:border-[#19714f]/20">
              <div className="inline-block bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full mb-3">
                الخطوة الأولى
              </div>
              <h3 className="text-2xl font-bold text-[#06281e] mb-3">
                التسجيل أو الدخول
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                قم بتسجيل الدخول إلى حسابك أو أنشئ حساباً جديداً للوصول إلى لوحة
                التحكم الخاصة بك. يمكنك استخدام البريد الإلكتروني أو المتابعة
                بضغطة زر باستخدام حساب جوجل.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex gap-5 md:gap-8 w-full group">
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#e8f3ef] text-[#19714f] rounded-2xl flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-[#19714f] group-hover:text-white transition-all duration-300 mt-1">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:border-[#19714f]/20">
              <div className="inline-block bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full mb-3">
                الخطوة الثانية
              </div>
              <h3 className="text-2xl font-bold text-[#06281e] mb-3">
                الاشتراك وإيصال الدفع
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-5">
                من داخل لوحة التحكم، قم بتحديد الباقة المناسبة لك وارفع إيصال
                الدفع المالي (صورة أو بصيغة PDF).
              </p>
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm leading-relaxed border border-yellow-200/60 flex gap-3 items-start shadow-sm">
                <span className="text-lg">⏳</span>
                <span>
                  سيبقى حسابك قيد الانتظار حتى يقوم المسؤول الإداري بالتحقق من
                  الإيصال والموافقة لاعتماد تفعيل حسابك بالكامل.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex gap-5 md:gap-8 w-full group">
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#e8f3ef] text-[#19714f] rounded-2xl flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-[#19714f] group-hover:text-white transition-all duration-300 mt-1">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:border-[#19714f]/20">
              <div className="inline-block bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full mb-3">
                الخطوة الثالثة
              </div>
              <h3 className="text-2xl font-bold text-[#06281e] mb-3">
                تعبئة نموذج الخدمة
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                بعد الموافقة، يُتاح لك الوصول لجميع الخدمات. اختر الخدمة
                المطلوبة، ثم املأ النموذج بالبيانات اللازمة بشكل دقيق وقدم
                الطلب. سيتم إرساله للمراجعة الخبيرة فوراً.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex gap-5 md:gap-8 w-full group">
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#e8f3ef] text-[#19714f] rounded-2xl flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-[#19714f] group-hover:text-white transition-all duration-300 mt-1">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:border-[#19714f]/20">
              <div className="inline-block bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full mb-3">
                الخطوة الرابعة
              </div>
              <h3 className="text-2xl font-bold text-[#06281e] mb-3">
                مراجعة الخبير والاعتماد
              </h3>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-[#f0f9f6] p-4 rounded-xl flex gap-3 text-sm text-[#06281e] border border-[#19714f]/20 items-start shadow-sm">
                  <span className="text-[#19714f] bg-white p-1.5 rounded-full shadow-sm shrink-0 mt-0.5">
                    <RxCheck className="text-base" strokeWidth={1} />
                  </span>
                  <div>
                    <p className="font-bold mb-1.5 text-base">
                      في حال القبول والإعتماد
                    </p>
                    <p className="opacity-80 text-xs md:text-sm leading-relaxed">
                      إذا كان النموذج صحيحاً يرسل إشعارا في الايميل والنظام
                      لإعلامك أنك تستطيع البدء بتنفيذ أي إجراء بناءً على باقتك
                      المدفوعة.
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-red-50 p-4 rounded-xl flex gap-3 text-sm text-red-900 border border-red-100 items-start shadow-sm">
                  <span className="text-red-500 bg-white p-1.5 rounded-full shadow-sm shrink-0 mt-0.5">
                    <RxCross2 className="text-base" strokeWidth={1} />
                  </span>
                  <div>
                    <p className="font-bold mb-1.5 text-base">
                      في حال وجود أخطاء
                    </p>
                    <p className="opacity-80 text-xs md:text-sm leading-relaxed">
                      يرسل لك الخبير إشعاراً بمكامن الخطأ، ثم تقوم بتصحيحها
                      وإعادة تقديم النموذج للمراجعة مجدداً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center bg-white rounded-3xl p-10 border border-gray-100 shadow-sm max-w-3xl mx-auto flex flex-col items-center overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#19714f]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#06281e]/5 rounded-full blur-3xl"></div>

          <h4 className="text-2xl font-bold text-[#06281e] mb-4 relative z-10">
            هل أنت مستعد لتأمين وصيتك ومستقبلك؟
          </h4>
          <p className="text-gray-500 mb-8 max-w-md mx-auto relative z-10">
            باشر الآن بتسجيل حسابك والاشتراك في منصتنا المتخصصة بخطوات واضحة
            لتسهيل أمورك على أكمل وجه.
          </p>
          <div className="relative z-10 pt-2" dir="ltr">
            <Link href="/">
              <ActionButton
                label="العودة للرئيسية والبدء"
                variant="primary"
                className="  text-base font-bold hidden md:inline-flex   text-white"
                icon={<RxArrowTopLeft />}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
