"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser, getPlanLimits } from "@/lib/auth-utils";
import type { User, Workspace } from "@/types/database";

type ActionResponse<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function createWorkspace(
  name: string,
): Promise<ActionResponse<Workspace>> {
  const parsed = createWorkspaceSchema.safeParse({ name });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const limits = getPlanLimits(user.plan);
  const supabase = await createClient();

  const { data: existing, error: countError } = await supabase
    .from("workspaces")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return { success: false, error: countError.message };
  }

  const currentCount = existing?.length || 0;
  if (currentCount >= limits.maxWorkspaces) {
    return {
      success: false,
      error: `You have reached the maximum of ${limits.maxWorkspaces} workspaces on your ${user.plan} plan.`,
    };
  }

  const slug = `${slugify(name)}-${generateShortId()}`;
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      slug,
    })
    .select("*")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, data: workspace };
}

const updateWorkspaceSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export async function updateWorkspace(
  input: z.infer<typeof updateWorkspaceSchema>,
): Promise<ActionResponse<Workspace>> {
  const parsed = updateWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("workspaces")
    .select("user_id")
    .eq("id", parsed.data.workspaceId)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return { success: false, error: "Workspace not found" };
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug;
  if (parsed.data.logoUrl !== undefined) updateData.logo_url = parsed.data.logoUrl;
  if (parsed.data.primaryColor !== undefined) updateData.primary_color = parsed.data.primaryColor;

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .update(updateData)
    .eq("id", parsed.data.workspaceId)
    .select("*")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, data: workspace };
}

export async function deleteWorkspace(
  workspaceId: string,
): Promise<ActionResponse> {
  if (!workspaceId) return { success: false, error: "Missing workspace id" };

  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("workspaces")
    .select("user_id")
    .eq("id", workspaceId)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return { success: false, error: "Workspace not found" };
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function switchWorkspace(
  workspaceId: string,
): Promise<ActionResponse> {
  if (!workspaceId) return { success: false, error: "Missing workspace id" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("workspaces")
    .select("user_id")
    .eq("id", workspaceId)
    .single();

  if (!existing) {
    return { success: false, error: "Workspace not found" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || existing.user_id !== user.id) {
    return { success: false, error: "Workspace not found" };
  }

  const cookieStore = await import("next/headers").then(m => m.cookies());
  cookieStore.set("active_workspace_id", workspaceId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
  });

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
