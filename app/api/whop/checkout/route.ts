import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    const validPlans = ["pro", "agency"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan requested" }, { status: 400 });
    }

    let productIds: Record<string, string> = {};
    try {
      productIds = JSON.parse(process.env.WHOP_PRODUCT_IDS || "{}");
    } catch {
      console.warn("Invalid WHOP_PRODUCT_IDS JSON in environment variables.");
    }

    const productId = productIds[plan];
    if (!productId || productId.trim() === "") {
      return NextResponse.json(
        {
          error: `Whop Product ID for plan "${plan}" is not configured in .env.local yet. Please update WHOP_PRODUCT_IDS.`,
          unconfigured: true,
        },
        { status: 400 }
      );
    }

    // Construct Whop checkout URL. If productId is already a full URL, use it directly.
    const checkoutUrl = productId.startsWith("http")
      ? `${productId}?email=${encodeURIComponent(user.email || "")}`
      : `https://whop.com/checkout/${productId}?email=${encodeURIComponent(user.email || "")}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Whop checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
