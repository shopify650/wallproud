"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import type { CollectWidgetRow } from "@/lib/supabase/types";

async function getWorkspaceId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const workspace = await getCurrentWorkspace();

  if (!workspace) throw new Error("Workspace not found");
  return workspace.id;
}

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).default("On-Site Widget"),
  display_type: z.enum(["floating", "inline", "popup"]).default("floating"),
  position: z.enum(["bottom-right", "bottom-left", "bottom-center"]).default("bottom-right"),
  trigger: z.enum(["click", "scroll", "exit-intent", "timed"]).default("click"),
  scroll_percent: z.number().int().min(10).max(100).default(70),
  delay_seconds: z.number().int().min(1).max(120).default(5),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#000000"),
  heading: z.string().min(1).max(200).default("We'd love your feedback!"),
  description: z.string().max(500).default("Share your experience with us"),
  placeholder: z.string().max(200).default("Tell us about your experience..."),
  thank_you_message: z.string().max(200).default("Thanks for your feedback!"),
  show_star_rating: z.boolean().default(true),
  show_name: z.boolean().default(true),
  name_required: z.boolean().default(true),
  show_email: z.boolean().default(true),
  email_required: z.boolean().default(false),
  show_company: z.boolean().default(false),
  company_required: z.boolean().default(false),
  show_phone: z.boolean().default(false),
  phone_required: z.boolean().default(false),
  show_video: z.boolean().default(false),
  max_characters: z.number().int().min(100).max(10000).default(5000),
  min_characters: z.number().int().min(1).max(1000).default(10),
  auto_close_seconds: z.number().int().min(0).max(30).default(3),
  show_confetti: z.boolean().default(true),
  show_powered_by: z.boolean().default(true),
  auto_approve_5star: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type CollectWidgetFormData = z.infer<typeof upsertSchema>;

export async function getCollectWidgets(): Promise<CollectWidgetRow[]> {
  const supabase = await createClient();
  const workspaceId = await getWorkspaceId();

  const { data } = await supabase
    .from("collect_widgets")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  return (data as CollectWidgetRow[]) || [];
}

export async function getCollectWidget(id: string): Promise<CollectWidgetRow | null> {
  const supabase = await createClient();
  const workspaceId = await getWorkspaceId();

  const { data } = await supabase
    .from("collect_widgets")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  return data as CollectWidgetRow | null;
}

export async function upsertCollectWidget(
  data: CollectWidgetFormData,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const parsed = upsertSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid data" };
  }

  const supabase = await createClient();
  let workspaceId: string;
  try {
    workspaceId = await getWorkspaceId();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const { id, ...fields } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("collect_widgets")
      .update(fields as any)
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard/collect-widget");
    return { success: true, id };
  }

  const { data: created, error } = await supabase
    .from("collect_widgets")
    .insert({ workspace_id: workspaceId, ...fields } as any)
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/collect-widget");
  return { success: true, id: created.id };
}

export async function deleteCollectWidget(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  let workspaceId: string;
  try {
    workspaceId = await getWorkspaceId();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const { error } = await supabase
    .from("collect_widgets")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/collect-widget");
  return { success: true };
}
