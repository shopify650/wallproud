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
    const { widgetId, content, rating, authorName, authorEmail, authorImage, authorCompany, pageUrl, referrer } = body;

    if (!widgetId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const supabase = await createClient();

    // Fetch widget settings to enforce dynamic limits and requirements
    const { data: widget } = await supabase
      .from("collect_widgets")
      .select("is_active, min_characters, max_characters, name_required, email_required, company_required")
      .eq("id", widgetId)
      .single();

    if (widget && widget.is_active === false) {
      return NextResponse.json({ error: "Widget is currently disabled" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const minChars = widget?.min_characters ?? 10;
    const maxChars = widget?.max_characters ?? 5000;

    const contentStr = String(content).trim();
    if (contentStr.length < minChars) {
      return NextResponse.json({ error: `Content must be at least ${minChars} characters` }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (contentStr.length > maxChars) {
      return NextResponse.json({ error: `Content cannot exceed ${maxChars} characters` }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const nameStr = authorName ? String(authorName).trim() : "";
    const emailStr = authorEmail ? String(authorEmail).trim() : "";
    const companyStr = authorCompany ? String(authorCompany).trim() : "";

    if (widget?.name_required && !nameStr) {
      return NextResponse.json({ error: "Name is required" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (widget?.email_required && !emailStr) {
      return NextResponse.json({ error: "Email is required" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (widget?.company_required && !companyStr) {
      return NextResponse.json({ error: "Company is required" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    if (nameStr.length > 100) {
      return NextResponse.json({ error: "Name cannot exceed 100 characters" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (emailStr.length > 255) {
      return NextResponse.json({ error: "Email cannot exceed 255 characters" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (companyStr.length > 100) {
      return NextResponse.json({ error: "Company cannot exceed 100 characters" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const sanitized = contentStr.replace(/<[^>]*>/g, "");

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("x-real-ip") ||
               "unknown";

    const { data, error } = await supabase.rpc("submit_collect_widget_testimonial", {
      p_widget_id: widgetId,
      p_author_name: nameStr || "Anonymous",
      p_content: sanitized,
      p_author_email: emailStr || null,
      p_author_image: authorImage || null,
      p_author_company: companyStr || null,
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
