import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCollectEmbedScript } from "@/lib/collect-embed";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> },
) {
  try {
    const { widgetId } = await params;
    const id = widgetId.replace(/\.js$/i, "");

    const supabase = await createClient();

    const { data: widget, error } = await supabase
      .from("collect_widgets")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !widget) {
      return new NextResponse("// Widget not found", {
        status: 200,
        headers: { "Content-Type": "application/javascript" },
      });
    }

    const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const script = generateCollectEmbedScript(widget as any, origin);

    return new NextResponse(script, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, s-maxage=3600, max-age=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("// Internal error", {
      status: 200,
      headers: { "Content-Type": "application/javascript" },
    });
  }
}
