import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimits } from "@/lib/auth-utils";
import WidgetsListClient from "@/components/widgets/WidgetsListClient";

export default async function WidgetsPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", authUser.id)
    .single();

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: true });
  const workspace = workspaces?.[0] || null;

  if (!workspace) redirect("/login");

  const { data: widgets } = await supabase
    .from("widgets")
    .select("id, name, type, views_count, embed_code, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const plan = (profile?.plan as string) || "free";
  const limits = getPlanLimits(plan as any);

  return (
    <WidgetsListClient
      widgets={(widgets || []) as any}
      workspaceId={workspace.id}
      plan={plan}
      maxWidgets={limits.maxWidgets}
      currentCount={widgets?.length || 0}
    />
  );
}
