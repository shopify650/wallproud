import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    const validPlans = ["pro", "agency"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const productIds: Record<string, string> = JSON.parse(
      process.env.WHOP_PRODUCT_IDS || "{}"
    );

    const productId = productIds[plan];
    if (!productId) {
      return NextResponse.json({ error: "Product not configured" }, { status: 500 });
    }

    const checkoutUrl = `https://whop.com/product/${productId}/checkout?email=${encodeURIComponent(user.email || "")}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Whop checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
