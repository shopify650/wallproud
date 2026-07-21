import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import CollectWidgetClient from "./CollectWidgetClient";

export default async function CollectWidgetPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const workspace = await getCurrentWorkspace();

  if (!workspace) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

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
      plan={(profile?.plan as string) || "free"}
    />
  );
}
