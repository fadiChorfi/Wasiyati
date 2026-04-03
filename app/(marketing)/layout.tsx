import Footer from "@/components/landing/Footer";
/* import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation"; */

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } */
  return (
    <>
      <main className="grow">{children}</main>
      <div className="mx-auto w-full mt-auto">
        <Footer />
      </div>
    </>
  );
}
