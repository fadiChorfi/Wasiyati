import Link from "next/link";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-[radial-gradient(circle_at_70%_80%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-20 pb-10 rounded-[40px] mt-24 mx-4 mb-4"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">وصيتي</h2>
            <p className="text-white/70 max-w-md text-sm leading-8">
              منصة رقمية متخصصة تساعدك على إعداد وصيتك وتنظيم شؤونك القانونية
              بطريقة واضحة وآمنة، بإشراف مختصين ومراجعة قانونية دقيقة لضمان
              حقوقك وحقوق من تحب.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c6a96a] transition-all duration-300"
                aria-label="Twitter"
              >
                <FaFacebook />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c6a96a] transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c6a96a] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">روابط سريعة</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <Link
                  href="#hero"
                  className="hover:text-white transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  الخدمات
                </Link>
              </li>
              <li>
                <Link
                  href="/about-will"
                  className="hover:text-white transition-colors"
                >
                  عن الوصية
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  حول المنصة
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-white transition-colors"
                >
                  دليل المنصة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-6">تواصل معنا</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>الجزائر، الجزائر</li>
              <li dir="ltr" className="text-right">
                contact@wasiyati.com
              </li>
              <li dir="ltr" className="text-right">
                +213 591969959
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
          <p>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لمنصة وصيتي.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#19714f] opacity-20 blur-3xl z-0 pointer-events-none"></div>
    </footer>
  );
}
