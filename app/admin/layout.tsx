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

  return <UserProvider profile={profile}>{children}</UserProvider>;
}
