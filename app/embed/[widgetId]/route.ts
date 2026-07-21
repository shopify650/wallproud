import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { WidgetConfig } from "@/types";
import { generateEmbedScript } from "@/lib/embed";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ widgetId: string }> },
) {
  const { widgetId } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: widget } = await supabase
    .from("widgets")
    .select("id, type, config, testimonial_ids, workspace_id, views_count")
    .eq("id", widgetId)
    .single();

  if (!widget) {
    return new Response("console.warn('WallProud: widget not found');", {
      headers: { "Content-Type": "application/javascript", "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  }

  const config = widget.config as WidgetConfig;

  let testimonialIds: string[] | undefined;
  let query = supabase
    .from("testimonials")
    .select("id, author_name, author_image, author_company, author_role, content, rating, created_at, status");

  if (widget.testimonial_ids && widget.testimonial_ids.length > 0) {
    testimonialIds = widget.testimonial_ids;
    query = query.in("id", testimonialIds);
  } else {
    const workspaceId = widget.workspace_id;
    query = query.eq("workspace_id", workspaceId);
  }

  const { data: testimonials } = await query;

  if (!testimonials || testimonials.length === 0) {
    return new Response("console.warn('WallProud: no testimonials to display');", {
      headers: { "Content-Type": "application/javascript", "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  }

  const script = generateEmbedScript(
    { id: widget.id, type: widget.type, config },
    testimonials,
  );

  if (!script) {
    return new Response("console.warn('WallProud: no approved testimonials');", {
      headers: { "Content-Type": "application/javascript", "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  }

  try {
    await supabase.rpc("increment_widget_views", { p_widget_id: widgetId });
  } catch {}

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
