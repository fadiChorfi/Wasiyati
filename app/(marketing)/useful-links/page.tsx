import { RxArrowLeft, RxExternalLink, RxFileText } from "react-icons/rx";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "روابط مفيدة | وصيتي",
  description:
    "مجموعة من الروابط القانونية المفيدة: وزارة العدل، المحكمة العليا، مقالات وأبحاث قانونية.",
};

type LinkItem = {
  label: string;
  href: string;
  badge?: string;
  note?: string;
};

const sections: { title: string; items: LinkItem[] }[] = [
  {
    title: "مواقع",
    items: [
      {
        label: "وزارة العدل",
        href: "https://www.mjustice.gov.dz/ar/",
      },
      {
        label: "المحكمة العليا",
        href: "https://coursupreme.dz/",
      },
      {
        label: "مركز البحوث القانونية و القضائية",
        href: "https://crjj.mjustice.gov.dz/",
      },
    ],
  },
  {
    title: "الأحكام القضائية",
    items: [
      {
        label: "قرارات محكمة العليا حول الوصية",
        href: "https://coursupreme.dz/?s=%D8%A7%D9%84%D9%88%D8%B5%D9%8A%D8%A9+",
      },
    ],
  },
  {
    title: "مقالات قانونية",
    items: [
      {
        label: "أحكام الوصية في القانون الجزائري",
        href: "https://asjp.cerist.dz/en/article/206792",
        badge: "",
        note: "دراسة تحليلية لأحكام الوصية في التشريع الجزائري",
      },
      {
        label: "إثبات الوصية وإجراءات تثبيت الملكية المكتسبة في التشريع",
        href: "https://asjp.cerist.dz/index.php/en/article/183892",
        badge: "",
      },
    ],
  },
];

export default function UsefulLinksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20" dir="rtl">
      {/* Header */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white pt-24 pb-20 px-6 mb-12 rounded-b-[40px] mx-2">
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">روابط مفيدة</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            مجموعة من المصادر والمراجع القانونية المعتمدة في الجزائر
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
              {section.title}
            </h2>
            <div className="grid gap-4">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-surface border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      {item.badge === "PDF" ? (
                        <RxFileText className="text-xl" />
                      ) : (
                        <RxExternalLink className="text-xl" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.badge === "PDF"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <RxExternalLink className="text-lg text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-4 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 decoration-primary/30"
          >
            <RxArrowLeft className="text-lg" />
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
