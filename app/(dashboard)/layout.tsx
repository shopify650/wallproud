import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getPlanLimits } from "@/lib/auth-utils";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value || null;

  const [profileResult, workspacesResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("workspaces").select("*").eq("user_id", authUser.id).order("created_at", { ascending: true }),
  ]);

  let profile = profileResult.data;

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email!,
        full_name: authUser.user_metadata?.full_name || null,
        avatar_url: authUser.user_metadata?.avatar_url || null,
      })
      .select()
      .single();

    if (newProfile) {
      profile = newProfile;
    }
  }

  if (!profile) {
    redirect("/login");
  }

  let workspaces = workspacesResult.data || [];
  let activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || null;

  if (!activeWorkspace && workspaces.length === 0) {
    const { data: newWorkspace } = await supabase
      .from("workspaces")
      .insert({
        name: "My Workspace",
        slug: `workspace-${authUser.id.slice(0, 8)}`,
        user_id: authUser.id,
        primary_color: "#000000",
      })
      .select()
      .single();

    if (newWorkspace) {
      activeWorkspace = newWorkspace;
      workspaces = [newWorkspace];
    } else {
      redirect("/login");
    }
  }

  const planLimits = getPlanLimits((profile.plan as any) || "free");
  const maxWorkspaces = planLimits.maxWorkspaces;

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar user={profile} workspace={activeWorkspace} workspaces={workspaces} maxWorkspaces={maxWorkspaces} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader workspace={activeWorkspace} />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
