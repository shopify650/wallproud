import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [profileResult, workspaceResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    supabase.from("workspaces").select("*").eq("user_id", userId).limit(1).single(),
  ]);

  return {
    profile: profileResult.data,
    workspace: workspaceResult.data,
  };
}
