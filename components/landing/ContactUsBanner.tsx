import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import ActionButton from "./ActionButton";

export default function ContactUsBanner() {
  return (
    <section id="contact" className="px-6 py-12 mx-4" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden bg-white border border-border rounded-4xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#25D366]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 flex-1 text-foreground">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 shrink-0">
                <FaWhatsapp className="text-3xl text-[#25D366]" />
              </div> */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  هل لديك استفسار؟ تواصل معنا
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
                  فريقنا من الخبراء القانونيين مستعد للإجابة على كافة أسئلتكم
                  وتوجيهكم لاختيار الباقة الأنسب واستكمال إجراءاتكم. تواصل معنا
                  مباشرة عبر الواتساب.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-end">
            {/* Replace with your actual WhatsApp phone number */}
            <Link
              href="https://wa.me/213551669458"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <ActionButton
                label="تواصل عبر الواتساب"
                variant="primary"
                className="text-base font-bold hidden md:flex md:flex-row bg-[#25D366] hover:bg-[#1ebe57] text-white border-[#25D366] hover:border-[#1ebe57]"
                icon={<FaWhatsapp className="text-xl" />}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
