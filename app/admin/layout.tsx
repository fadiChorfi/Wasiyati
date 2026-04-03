import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { UserProvider } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <UserProvider profile={profile}>
      <div
        className="flex bg-background min-h-screen text-foreground font-sans relative"
        dir="rtl"
      >
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:mr-65 pb-16 md:pb-0 flex flex-col min-h-screen">
          <AdminTopBar />
          <main className="p-4 pt-24 md:pt-8 flex-1">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <AdminMobileNav />
      </div>
    </UserProvider>
  );
}
