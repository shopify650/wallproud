import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import WidgetEditor from "@/components/widgets/WidgetEditor";

export default async function WidgetEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const workspace = await getCurrentWorkspace();

  if (!workspace) redirect("/login");

  const { data: widget } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!widget) notFound();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <WidgetEditor widget={widget} testimonials={(testimonials || []) as any} />
  );
}
