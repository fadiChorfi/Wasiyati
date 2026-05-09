import { redirect } from "next/navigation";
import { getCurrentUserBasicProfile } from "@/actions/profile";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";

export default async function AdminSettingsPage() {
  const result = await getCurrentUserBasicProfile();

  if (!result.success || !result.data) {
    redirect("/admin/dashboard");
  }

  return <ProfileSettingsForm profile={result.data} />;
}
