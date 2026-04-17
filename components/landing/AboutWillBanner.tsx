import Link from "next/link";
import { RxArrowTopLeft } from "react-icons/rx";
import ActionButton from "./ActionButton";

export default function AboutWillBanner() {
  
  
  return (
    <section id="about-will" className=" px-6 py-12 mx-4" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] rounded-4xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#19714f]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c6a96a]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 flex-1 text-white">
            <div className="flex items-center gap-3 mb-4">
              {/*   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                <RxFileText className="text-2xl text-[#c6a96a]" />
              </div> */}
              <h2 className="text-2xl md:text-3xl font-b++++++old">
                دليلك الشامل عن الوصية في القانون الجزائري
              </h2>
            </div>
            <p className="text-white/80 leading-relaxed text-sm md:text-base max-w-2xl lg:ps-15">
              تعرف على الشروط والأركان القانونية، والشكلية المعتمدة لضمان حقوق
              ورثتك وتنظيم شؤونك بكل وضوح بما يتوافق مع قانون الأسرة الجزائري.
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-end">
            <Link href="/about-will" className="w-full md:w-auto " dir="ltr">
              <ActionButton
                label="اقرأ الدليل الآن"
                variant="primary"
                className="  text-base font-bold flex "
                icon={<RxArrowTopLeft />}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
