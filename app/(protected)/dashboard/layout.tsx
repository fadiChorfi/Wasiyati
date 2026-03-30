import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex bg-[#f8f9f7] min-h-screen text-gray-900 font-sans relative"
      dir="rtl"
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:mr-65 pb-16 md:pb-0 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-4 md:p-6 lg:p-8 pt-24 md:pt-6 lg:pt-8 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
