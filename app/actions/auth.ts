"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(100),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8).max(200),
});

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

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<ActionResponse> {
  const parsed = signUpSchema.safeParse({ email, password, fullName });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const slug = `${slugify(fullName)}-${generateShortId()}`;
    const { error: wsError } = await supabase.from("workspaces").insert({
      user_id: user.id,
      name: `${fullName}'s Workspace`,
      slug,
    });

    if (wsError) {
      return { success: false, error: wsError.message };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signIn(
  email: string,
  password: string,
): Promise<ActionResponse> {
  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(
  email: string,
): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(
  password: string,
): Promise<ActionResponse> {
  const parsed = updatePasswordSchema.safeParse({ password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateProfile(
  data: z.infer<typeof updateProfileSchema>,
): Promise<ActionResponse> {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.fullName !== undefined) {
    updateData.full_name = parsed.data.fullName;
  }
  if (parsed.data.avatarUrl !== undefined) {
    updateData.avatar_url = parsed.data.avatarUrl;
  }

    const { error: updateError } = await supabase
      .from("users")
      .update(updateData as any)
      .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
