import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces, getCurrentWorkspace } from "@/lib/auth-utils";
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

  const [workspaces, currentWorkspace] = await Promise.all([
    getUserWorkspaces(),
    getCurrentWorkspace(),
  ]);

  if (!profile || workspaces.length === 0) redirect("/login");

  const activeWorkspace = currentWorkspace || workspaces[0];

  return (
    <SettingsClient
      email={authUser.email || ""}
      fullName={profile.full_name || ""}
      workspaceName={activeWorkspace.name}
      workspaceSlug={activeWorkspace.slug}
      plan={profile.plan}
      workspaces={workspaces}
      currentWorkspaceId={activeWorkspace.id}
    />
  );
}
