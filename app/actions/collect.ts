"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const submitSchema = z.object({
  author_name: z.string().min(1).max(100),
  author_email: z.string().email().max(255).optional().or(z.literal("")),
  author_company: z.string().max(100).optional().or(z.literal("")),
  author_role: z.string().max(100).optional().or(z.literal("")),
  content: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  video_url: z.string().url().optional().nullable(),
});

export type CollectFormData = z.infer<typeof submitSchema>;

export async function getCollectionRequest(slug: string): Promise<{
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
  logo_image: string | null;
  workspace: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    primary_color: string;
  } | null;
} | null> {
  const supabase = await createClient();

  const { data: request, error } = await supabase
    .from("collection_requests")
    .select("*")
    .eq("token", slug)
    .single();

  if (error || !request) return null;

  let workspace = null;
  if (request.workspace_id) {
    const { data: ws } = await supabase
      .from("workspaces")
      .select("id, name, slug, logo_url, primary_color")
      .eq("id", request.workspace_id)
      .single();
    workspace = ws;
  }

  return { ...(request as any), workspace };
}

export async function submitTestimonial(
  token: string,
  data: CollectFormData,
): Promise<{ success: boolean; error?: string }> {
  const parsed = submitSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data: request, error: reqError } = await supabase
    .from("collection_requests")
    .select("id, workspace_id, status, expires_at")
    .eq("token", token)
    .single();

  if (reqError || !request) {
    return { success: false, error: "Invalid collection link" };
  }

  if (request.status === "completed") {
    return { success: false, error: "already_submitted" };
  }

  if (request.expires_at && new Date(request.expires_at) < new Date()) {
    return { success: false, error: "This collection link has expired" };
  }

  const { error: insertError } = await supabase.from("testimonials").insert({
    workspace_id: request.workspace_id,
    author_name: parsed.data.author_name,
    author_email: parsed.data.author_email || null,
    author_company: parsed.data.author_company || null,
    author_role: parsed.data.author_role || null,
    content: parsed.data.content,
    rating: parsed.data.rating || null,
    video_url: parsed.data.video_url || null,
    source: "email",
    status: "pending",
    metadata: { collection_token: token },
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Mark the collection link completed via a SECURITY DEFINER function so a
  // public (anon) visitor can do this without a direct UPDATE grant / RLS.
  const { error: updateError } = await supabase.rpc(
    "complete_collection_request",
    { p_token: token },
  );

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/collect/[slug]");
  return { success: true };
}

export async function uploadVideo(
  token: string,
  blob: Blob,
): Promise<{ success: boolean; error?: string; url?: string }> {
  const supabase = await createClient();

  const { data: request, error: reqError } = await supabase
    .from("collection_requests")
    .select("id, workspace_id")
    .eq("token", token)
    .single();

  if (reqError || !request) {
    return { success: false, error: "Invalid collection link" };
  }

  const MAX_BYTES = 50 * 1024 * 1024;
  if (blob.size === 0 || blob.size > MAX_BYTES) {
    return {
      success: false,
      error: "Video must be between 1 byte and 50 MB",
    };
  }

  const contentType = blob.type?.startsWith("video/") ? blob.type : "video/webm";
  const ext = contentType.split("/")[1]?.split(";")[0] || "webm";
  const fileName = `${request.workspace_id}/${token}-${Date.now()}.${ext}`;

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("testimonial-videos")
    .upload(fileName, buffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from("testimonial-videos")
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}

export async function uploadCollectionImage(
  formData: FormData,
): Promise<{ success: boolean; error?: string; url?: string }> {
  const raw = formData.get("file");
  if (!(raw instanceof File)) {
    return { success: false, error: "Missing file" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const {
    data: workspace,
    error: wsError,
  } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (wsError || !workspace) return { success: false, error: "Workspace not found" };

  const maxBytes = 2 * 1024 * 1024;
  if (raw.size === 0 || raw.size > maxBytes) {
    return { success: false, error: "Image must be between 1 byte and 2 MB" };
  }

  const contentType = (raw.type || "image/png").split(";")[0];
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(contentType)) {
    return { success: false, error: "Only PNG, JPG, or WebP images are allowed" };
  }

  const ext = contentType.split("/")[1] || "png";
  const fileName = `collection-${workspace.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = Buffer.from(await raw.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("collection-images")
    .upload(fileName, buffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from("collection-images")
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}

const createCollectionSchema = z.object({
  workspaceId: z.string().uuid(),
  recipientEmail: z.string().email().max(255),
  recipientName: z.string().max(100).optional().or(z.literal("")),
  expiresInDays: z.number().int().min(1).max(365).optional().nullable(),
  title: z.string().max(255).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  buttonText: z.string().max(100).optional().or(z.literal("")),
  thankYouMessage: z.string().max(255).optional().or(z.literal("")),
  brandColor: z.string().max(20).optional().or(z.literal("")),
  fieldConfig: z.record(z.string(), z.any()).optional(),
  redirectUrl: z.string().url().optional().or(z.literal("")),
  logoImage: z.string().url().optional().nullable().or(z.literal("")),
});

export async function createCollection(
  input: z.infer<typeof createCollectionSchema>,
): Promise<{ success: boolean; error?: string; token?: string }> {
  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const token = randomUUID().replace(/-/g, "");
  const expiresAt =
    parsed.data.expiresInDays && parsed.data.expiresInDays > 0
      ? new Date(Date.now() + parsed.data.expiresInDays * 86400000).toISOString()
      : null;

  const { error } = await supabase.from("collection_requests").insert({
    workspace_id: parsed.data.workspaceId,
    recipient_email: parsed.data.recipientEmail,
    recipient_name: parsed.data.recipientName || null,
    token,
    status: "pending",
    expires_at: expiresAt,
    title: parsed.data.title || "Share your feedback",
    description: parsed.data.description || "We'd love to hear about your experience.",
    button_text: parsed.data.buttonText || "Submit Testimonial",
    thank_you_message: parsed.data.thankYouMessage || "Thanks for your feedback!",
    brand_color: parsed.data.brandColor || "#000000",
    field_config: parsed.data.fieldConfig || {},
    redirect_url: parsed.data.redirectUrl || null,
    logo_image: parsed.data.logoImage || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/collections");
  return { success: true, token };
}

export async function updateCollection(
  id: string,
  input: {
    title?: string;
    description?: string;
    buttonText?: string;
    thankYouMessage?: string;
    brandColor?: string;
    fieldConfig?: Record<string, any>;
    redirectUrl?: string;
    logoImage?: string;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!id) return { success: false, error: "Missing collection id" };

  const supabase = await createClient();

  const updateData: Record<string, any> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.buttonText !== undefined) updateData.button_text = input.buttonText;
  if (input.thankYouMessage !== undefined) updateData.thank_you_message = input.thankYouMessage;
  if (input.brandColor !== undefined) updateData.brand_color = input.brandColor;
  if (input.fieldConfig !== undefined) updateData.field_config = input.fieldConfig;
  if (input.redirectUrl !== undefined) updateData.redirect_url = input.redirectUrl || null;
  if (input.logoImage !== undefined) updateData.logo_image = input.logoImage || null;

  const { error } = await supabase
    .from("collection_requests")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/collections");
  return { success: true };
}

export async function deleteCollection(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  if (!id) return { success: false, error: "Missing collection id" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("collection_requests")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/collections");
  return { success: true };
}
