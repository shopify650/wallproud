import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectionsClient from "@/components/dashboard/CollectionsClient";

export default async function CollectionsPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", authUser.id)
    .limit(1)
    .single();

  if (!workspace) redirect("/login");

  const { data: collections } = await supabase
    .from("collection_requests")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <CollectionsClient
      collections={(collections || []) as any}
      workspaceId={workspace.id}
    />
  );
}
