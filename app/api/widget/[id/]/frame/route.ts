import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { WidgetConfig } from "@/types";
import { generateEmbedScript } from "@/lib/embed";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
) {
  const { id: widgetId } = await context.params;

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
    return new Response(
      `<html><body style="font-family:system-ui;padding:24px;color:#666"><p>Widget not found</p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
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
    return new Response(
      `<html><body style="font-family:system-ui;padding:24px;color:#666"><p>No testimonials to display</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  const script = generateEmbedScript(
    { id: widget.id, type: widget.type, config },
    testimonials,
  );

  if (!script) {
    return new Response(
      `<html><body style="font-family:system-ui;padding:24px;color:#666"><p>No approved testimonials</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    await supabase.rpc("increment_widget_views", { p_widget_id: widgetId });
  } catch {}

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>body{margin:0;padding:0;font-family:system-ui,sans-serif;background:transparent}</style>
</head>
<body>
  <script>${script}</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
