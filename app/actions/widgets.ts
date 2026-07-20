"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, getCurrentWorkspace } from "@/lib/auth-utils";
import { getDefaultConfig } from "@/lib/widgets";
import type { WidgetConfig, WidgetType } from "@/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function getWorkspaceAndUser(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  const workspace = await getCurrentWorkspace();

  if (!workspace) throw new Error("Workspace not found");

  return {
    userId: user.id,
    plan: (profile?.plan as string) || "free",
    workspaceId: workspace.id,
  };
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["grid", "carousel", "wall", "slider", "minimal", "masonry"]),
  workspaceId: z.string().uuid(),
});

export async function createWidget(
  workspaceId: string,
  name: string,
  type: WidgetType,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const parsed = createSchema.safeParse({ name, type, workspaceId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  let ctx: { plan: string; workspaceId: string };
  try {
    ctx = await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const limits = getPlanLimits(ctx.plan as any);
  if (limits.maxWidgets > 0) {
    const { count } = await supabase
      .from("widgets")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId);

    if (count != null && count >= limits.maxWidgets) {
      return {
        success: false,
        error: `Widget limit reached (${limits.maxWidgets}). Upgrade your plan to create more.`,
      };
    }
  }

  const config = getDefaultConfig(type);

  const { data, error } = await supabase
    .from("widgets")
    .insert({
      workspace_id: workspaceId,
      name,
      type,
      config: config as any,
      testimonial_ids: [],
      views_count: 0,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/widgets");
  return { success: true, id: data.id };
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z
    .enum(["grid", "carousel", "wall", "slider", "minimal", "masonry"])
    .optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  testimonial_ids: z.array(z.string()).optional(),
});

export async function updateWidget(
  id: string,
  data: {
    name?: string;
    type?: WidgetType;
    config?: WidgetConfig;
    testimonial_ids?: string[];
  },
): Promise<{ success: boolean; error?: string }> {
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  try {
    await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.config !== undefined) updateData.config = data.config as any;
  if (data.testimonial_ids !== undefined)
    updateData.testimonial_ids = data.testimonial_ids;

  if (Object.keys(updateData).length === 0) {
    return { success: false, error: "Nothing to update" };
  }

  const { error } = await supabase
    .from("widgets")
    .update(updateData as any)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/widgets");
  revalidatePath(`/dashboard/widgets/${id}`);
  return { success: true };
}

export async function deleteWidget(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const { error } = await supabase.from("widgets").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/widgets");
  return { success: true };
}

export async function getWidgetEmbedCode(
  id: string,
  options?: { iframe?: boolean },
): Promise<{ success: boolean; error?: string; code?: string }> {
  const supabase = await createClient();

  let workspaceContext: { workspaceId: string } | null = null;
  try {
    workspaceContext = await getWorkspaceAndUser(supabase);
  } catch {
    workspaceContext = null;
  }

  const { data: widget, error } = await supabase
    .from("widgets")
    .select("id, workspace_id")
    .eq("id", id)
    .single();

  if (error || !widget) {
    return { success: false, error: "Widget not found" };
  }

  if (workspaceContext && widget.workspace_id !== workspaceContext.workspaceId) {
    return { success: false, error: "Widget not found" };
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "https://wallproud.com";

  const code = options?.iframe
    ? `<iframe src="${origin}/embed/${id}" width="100%" height="600" frameborder="0" loading="lazy" title="WallProud Testimonials"></iframe>`
    : `<script src="${origin}/embed/${id}.js" async></script>`;

  return { success: true, code };
}
