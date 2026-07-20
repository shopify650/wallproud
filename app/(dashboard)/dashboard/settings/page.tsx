import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces } from "@/lib/auth-utils";
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

  const workspaces = await getUserWorkspaces();

  if (!profile || workspaces.length === 0) redirect("/login");

  const currentWorkspace = workspaces[0];

  return (
    <SettingsClient
      email={authUser.email || ""}
      fullName={profile.full_name || ""}
      workspaceName={currentWorkspace.name}
      workspaceSlug={currentWorkspace.slug}
      plan={profile.plan}
      workspaces={workspaces}
      currentWorkspaceId={currentWorkspace.id}
    />
  );
}
