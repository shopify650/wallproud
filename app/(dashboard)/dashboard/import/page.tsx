import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImportClient from "@/components/dashboard/ImportClient";

export default async function ImportPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("user_id", authUser.id)
    .limit(1)
    .single();

  if (!workspace) redirect("/login");

  return <ImportClient workspaceId={workspace.id} workspaceName={workspace.name} />;
}
