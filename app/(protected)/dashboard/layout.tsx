import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { UserProvider } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, updated_at, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return (
    <UserProvider profile={profile}>
      <div
        className="flex bg-[#f8f9f7] min-h-screen text-gray-900 font-sans relative"
        dir="rtl"
      >
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:mr-65 pb-16 md:pb-0 flex flex-col min-h-screen">
          <TopBar />
          <main className="p-4 pt-24 md:pt-8 flex-1">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </UserProvider>
  );
}
