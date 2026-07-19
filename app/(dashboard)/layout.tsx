import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const [profileResult, workspaceResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("workspaces").select("*").eq("user_id", authUser.id).limit(1).single(),
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

  const workspace = workspaceResult.data;

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar user={profile} workspace={workspace} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader workspace={workspace} />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
