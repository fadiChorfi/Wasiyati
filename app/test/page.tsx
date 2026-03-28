import { createClient } from "@/lib/supabase/server";

export default async function Test() {
  const supabase = await createClient(); 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <h1>Hello {user?.email}</h1>;
}
