import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

type UserPlan = "free" | "starter" | "pro" | "agency";

function verifyWhopSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(body).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-whop-signature");

  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  if (webhookSecret && webhookSecret.trim() !== "" && !verifyWhopSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    const eventType: string = event.type || event.action || "";
    const eventData = event.data || event;

    switch (eventType) {
      case "payment_succeeded":
      case "payment_success":
      case "membership_activated":
      case "subscription_created": {
        const email = eventData.email || eventData.customer_email || eventData.user?.email;
        const customerId = eventData.customer_id || eventData.user_id || eventData.id;
        const productId = eventData.product_id || eventData.plan_id || eventData.pass_id;

        if (!email) {
          return NextResponse.json({ error: "Missing customer email in event payload" }, { status: 400 });
        }

        let productIds: Record<string, string> = {};
        try {
          productIds = JSON.parse(process.env.WHOP_PRODUCT_IDS || "{}");
        } catch {
          console.warn("Invalid WHOP_PRODUCT_IDS in env");
        }

        // Match plan key by product ID if configured, default to 'pro' if unknown
        const matchedPlan = Object.keys(productIds).find((key) => productIds[key] === productId);
        const planName: UserPlan = matchedPlan && ["free", "starter", "pro", "agency"].includes(matchedPlan)
          ? (matchedPlan as UserPlan)
          : "pro";

        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (userError || !user) {
          return NextResponse.json({ error: `User with email ${email} not found` }, { status: 404 });
        }

        await supabase
          .from("users")
          .update({
            plan: planName,
            stripe_customer_id: typeof customerId === "string" ? customerId : null,
            stripe_subscription_id: typeof productId === "string" ? productId : null,
          })
          .eq("id", user.id);

        console.log(`Successfully upgraded user ${email} to ${planName}`);
        break;
      }

      case "membership_deactivated":
      case "subscription_cancelled":
      case "payment_failed": {
        const email = eventData.email || eventData.customer_email || eventData.user?.email;
        const customerId = eventData.customer_id || eventData.user_id;

        if (email) {
          await supabase
            .from("users")
            .update({
              plan: "free",
              stripe_customer_id: null,
              stripe_subscription_id: null,
            })
            .eq("email", email);
        } else if (typeof customerId === "string") {
          await supabase
            .from("users")
            .update({
              plan: "free",
              stripe_customer_id: null,
              stripe_subscription_id: null,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      default:
        console.log(`Received Whop webhook event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
