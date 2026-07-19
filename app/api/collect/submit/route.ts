import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { widgetId, content, rating, authorName, authorEmail, authorCompany, pageUrl, referrer } = body;

    if (!widgetId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const contentStr = String(content).trim();
    if (contentStr.length < 10) {
      return NextResponse.json({ error: "Content must be at least 10 characters" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (contentStr.length > 5000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const sanitized = contentStr.replace(/<[^>]*>/g, "");

    const supabase = await createClient();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("x-real-ip") ||
               "unknown";

    const { data, error } = await supabase.rpc("submit_collect_widget_testimonial", {
      p_widget_id: widgetId,
      p_author_name: authorName || "Anonymous",
      p_author_email: authorEmail || null,
      p_author_company: authorCompany || null,
      p_content: sanitized,
      p_rating: rating ? parseInt(rating) : null,
      p_page_url: pageUrl || null,
      p_referrer: referrer || null,
      p_ip_address: ip,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const result = data as { success?: boolean; error?: string; status?: string };

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return NextResponse.json({
      success: true,
      status: result.status || "pending",
    }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}
