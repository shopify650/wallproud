import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", authUser.id)
    .limit(1)
    .single();

  if (!profile || !workspace) redirect("/login");

  return (
    <SettingsClient
      email={authUser.email || ""}
      fullName={profile.full_name || ""}
      workspaceName={workspace.name}
      workspaceSlug={workspace.slug}
      plan={profile.plan}
    />
  );
}
