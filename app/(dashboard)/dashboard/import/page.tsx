import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImportClient from "@/components/dashboard/ImportClient";

export default async function ImportPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: true });
  const workspace = workspaces?.[0] || null;

  if (!workspace) redirect("/login");

  return <ImportClient workspaceId={workspace.id} workspaceName={workspace.name} />;
}
