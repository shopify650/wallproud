import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import CollectionsClient, { CollectionRequest } from "@/components/dashboard/CollectionsClient";

export default async function CollectionsPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const workspace = await getCurrentWorkspace();

  if (!workspace) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", authUser.id)
    .single();

  const plan = (profile?.plan as string) || "free";

  const { data: collections } = await supabase
    .from("collection_requests")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <CollectionsClient
      collections={(collections || []) as CollectionRequest[]}
      workspaceId={workspace.id}
      plan={plan}
    />
  );
}
