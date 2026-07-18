import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CollectWidgetClient from "./CollectWidgetClient";

export default async function CollectWidgetPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, primary_color")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!workspace) redirect("/login");

  const { data: widgets } = await supabase
    .from("collect_widgets")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <CollectWidgetClient
      workspaceId={workspace.id}
      workspaceName={workspace.name}
      workspaceColor={workspace.primary_color}
      widgets={(widgets || []) as any[]}
    />
  );
}
