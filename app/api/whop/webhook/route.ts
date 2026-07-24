import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifyWhopSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-whop-signature");

  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  if (!webhookSecret || !verifyWhopSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "payment_success":
      case "subscription_created": {
        const { customer_email, customer_id, product_id, plan_id } = event.data || {};
        if (!customer_email && !customer_id) {
          return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
        }

        const productIds: Record<string, string> = JSON.parse(
          process.env.WHOP_PRODUCT_IDS || "{}"
        );
        const plan = Object.keys(productIds).find(
          (key) => productIds[key] === product_id
        );

        if (!plan) {
          return NextResponse.json({ error: "Unknown product" }, { status: 400 });
        }

        const planName = plan as "pro" | "agency";

        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id, plan")
          .eq("email", customer_email)
          .single();

        if (userError || !user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await supabase
          .from("users")
          .update({
            plan: planName,
            stripe_customer_id: customer_id || null,
            stripe_subscription_id: product_id || null,
          })
          .eq("id", user.id);

        break;
      }

      case "subscription_cancelled":
      case "payment_failed": {
        const { customer_id } = event.data || {};
        if (!customer_id) {
          return NextResponse.json({ error: "Missing customer_id" }, { status: 400 });
        }

        await supabase
          .from("users")
          .update({
            plan: "free",
            stripe_customer_id: null,
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customer_id);

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
