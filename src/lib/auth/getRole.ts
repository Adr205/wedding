import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "super_admin";

export async function getMyRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as UserRole) ?? "admin";
}

export function isSuperAdmin(role: UserRole) {
  return role === "super_admin";
}
