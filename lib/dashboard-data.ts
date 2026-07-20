import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [profileResult, workspace] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    getCurrentWorkspace(),
  ]);

  return {
    profile: profileResult.data,
    workspace,
  };
}
