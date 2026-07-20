import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectionsClient from "@/components/dashboard/CollectionsClient";

export type CollectionRequest = {
  id: string;
  workspace_id: string;
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "sent" | "completed" | "expired";
  token: string | null;
  expires_at: string | null;
  created_at: string;
  title: string;
  description: string;
  button_text: string;
  thank_you_message: string;
  brand_color: string;
  field_config: Record<string, any>;
  redirect_url: string | null;
};

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
      collections={(collections || []) as CollectionRequest[]}
      workspaceId={workspace.id}
    />
  );
}
