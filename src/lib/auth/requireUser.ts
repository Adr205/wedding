import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requirePageUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/admin/login");
  }

  return data.user;
}

export async function requireApiUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
