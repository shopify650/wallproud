"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, getCurrentWorkspace } from "@/lib/auth-utils";

const testimonialSchema = z.object({
  author_name: z.string().min(1).max(100),
  author_email: z.string().email().max(255).optional().or(z.literal("")),
  author_image: z.string().url().optional().or(z.literal("")),
  author_company: z.string().max(100).optional().or(z.literal("")),
  author_role: z.string().max(100).optional().or(z.literal("")),
  content: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  source: z.enum(["manual", "email", "google", "twitter", "import"]).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  status: z.enum(["approved", "pending", "rejected"]).optional(),
});

const updateSchema = z.object({
  author_name: z.string().min(1).max(100).optional(),
  author_email: z.string().email().max(255).optional().nullable().or(z.literal("")),
  author_image: z.string().url().optional().nullable().or(z.literal("")),
  author_company: z.string().max(100).optional().nullable().or(z.literal("")),
  author_role: z.string().max(100).optional().nullable().or(z.literal("")),
  content: z.string().min(1).max(5000).optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  source: z.enum(["manual", "email", "google", "twitter", "import"]).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  status: z.enum(["approved", "pending", "rejected"]).optional(),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type TestimonialUpdateData = z.infer<typeof updateSchema>;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function getWorkspaceAndUser(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  return { userId: user.id, plan: (profile?.plan as string) || "free" };
}

export async function uploadAuthorImage(
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

  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false, error: "Workspace not found" };

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
  const fileName = `${workspace.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = Buffer.from(await raw.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("testimonial-images")
    .upload(fileName, buffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from("testimonial-images")
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}

export async function createTestimonial(
  workspaceId: string,
  data: TestimonialFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  let userPlan: string;

  try {
    const result = await getWorkspaceAndUser(supabase);
    userPlan = result.plan;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const limits = getPlanLimits(userPlan as any);
  if (limits.maxTestimonials > 0) {
    const { count } = await supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId);

    if (count != null && count >= limits.maxTestimonials) {
      return { success: false, error: `Free plan limit of ${limits.maxTestimonials} testimonials reached. Upgrade to add more.` };
    }
  }

  const { error } = await supabase.from("testimonials").insert({
    workspace_id: workspaceId,
    author_name: parsed.data.author_name,
    author_email: parsed.data.author_email || null,
    author_image: parsed.data.author_image || null,
    author_company: parsed.data.author_company || null,
    author_role: parsed.data.author_role || null,
    content: parsed.data.content,
    rating: parsed.data.rating || null,
    source: parsed.data.source || "manual",
    tags: parsed.data.tags || [],
    status: parsed.data.status || "pending",
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  data: TestimonialUpdateData
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
  const fields: (keyof typeof parsed.data)[] = [
    "author_name", "author_email", "author_image", "author_company", "author_role",
    "content", "rating", "source", "tags", "status",
  ];

  for (const field of fields) {
    const val = parsed.data[field];
    if (val !== undefined) {
      updateData[field] = val === "" ? null : val;
    }
  }

  const { error } = await supabase
    .from("testimonials")
    .update(updateData as any)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

export async function deleteTestimonial(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

export async function bulkUpdateTestimonials(
  ids: string[],
  data: { status?: string; tags?: string[] }
): Promise<{ success: boolean; error?: string }> {
  if (ids.length === 0) return { success: false, error: "No IDs provided" };

  const supabase = await createClient();

  try {
    await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const updateData: Record<string, unknown> = {};
  if (data.status) updateData.status = data.status;
  if (data.tags) updateData.tags = data.tags;

  if (Object.keys(updateData).length === 0) {
    return { success: false, error: "No fields to update" };
  }

  const { error } = await supabase
    .from("testimonials")
    .update(updateData as any)
    .in("id", ids);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

export async function toggleFeatured(
  id: string
): Promise<{ success: boolean; error?: string; featured?: boolean }> {
  const supabase = await createClient();

  try {
    await getWorkspaceAndUser(supabase);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const { data: current, error: fetchError } = await supabase
    .from("testimonials")
    .select("featured")
    .eq("id", id)
    .single();

  if (fetchError) return { success: false, error: fetchError.message };

  const newFeatured = !current?.featured;

  const { error } = await supabase
    .from("testimonials")
    .update({ featured: newFeatured } as any)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true, featured: newFeatured };
}

export async function importFromCSV(
  workspaceId: string,
  csvContent: string
): Promise<{ success: boolean; error?: string; imported?: number }> {
  const supabase = await createClient();
  let plan: string;

  try {
    const result = await getWorkspaceAndUser(supabase);
    plan = result.plan;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const limits = getPlanLimits(plan as any);

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { success: false, error: "CSV must have a header row and at least one data row" };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const nameIdx = headers.indexOf("author_name") ?? headers.indexOf("name");
  const emailIdx = headers.indexOf("author_email") ?? headers.indexOf("email");
  const companyIdx = headers.indexOf("author_company") ?? headers.indexOf("company");
  const roleIdx = headers.indexOf("author_role") ?? headers.indexOf("role");
  const contentIdx = headers.indexOf("content") ?? headers.indexOf("testimonial");
  const ratingIdx = headers.indexOf("rating");

  if (nameIdx === -1 || contentIdx === -1) {
    return { success: false, error: "CSV must include author_name and content columns" };
  }

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    return {
      author_name: cols[nameIdx] || "Anonymous",
      author_email: emailIdx >= 0 ? cols[emailIdx] || null : null,
      author_company: companyIdx >= 0 ? cols[companyIdx] || null : null,
      author_role: roleIdx >= 0 ? cols[roleIdx] || null : null,
      content: cols[contentIdx] || "",
      rating: ratingIdx >= 0 ? parseInt(cols[ratingIdx]) || null : null,
      source: "import" as const,
      status: "pending" as const,
    };
  }).filter((r) => r.content);

  if (limits.maxTestimonials > 0 && rows.length > limits.maxTestimonials) {
    return {
      success: false,
      error: `CSV has ${rows.length} rows but free plan limit is ${limits.maxTestimonials} testimonials`,
    };
  }

  const { error } = await supabase.from("testimonials").insert(
    rows.map((r) => ({
      workspace_id: workspaceId,
      author_name: r.author_name,
      author_email: r.author_email,
      author_company: r.author_company,
      author_role: r.author_role,
      content: r.content,
      rating: r.rating,
      source: r.source,
      status: r.status,
    }))
  );

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/testimonials");
  return { success: true, imported: rows.length };
}
