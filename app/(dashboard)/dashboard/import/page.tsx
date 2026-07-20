import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import ImportClient from "@/components/dashboard/ImportClient";

export default async function ImportPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const workspace = await getCurrentWorkspace();

  if (!workspace) redirect("/login");

  return <ImportClient workspaceId={workspace.id} workspaceName={workspace.name} />;
}
