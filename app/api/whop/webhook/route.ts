import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

type UserPlan = "free" | "starter" | "pro" | "agency";

function verifyWhopSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(body).digest("hex");
    // Whop sends the full "sha256=..." prefix sometimes
    const clean = signature.replace(/^sha256=/, "");
    return crypto.timingSafeEqual(Buffer.from(clean), Buffer.from(digest));
  } catch {
    return false;
  }
}

/** Maps a Whop product ID → plan name.
 *  Keys like "pro_monthly" / "pro_yearly" both resolve to "pro". */
function resolvePlan(productId: string | undefined, productIds: Record<string, string>): UserPlan {
  if (!productId) return "pro";
  for (const [key, value] of Object.entries(productIds)) {
    if (value === productId || value.includes(productId) || productId.includes(value)) {
      // Strip billing cycle suffix: pro_monthly → pro, agency_yearly → agency
      const basePlan = key.replace(/_monthly|_yearly|_annual/, "");
      if (["free", "starter", "pro", "agency"].includes(basePlan)) {
        return basePlan as UserPlan;
      }
    }
  }
  return "pro"; // safe default for any paid Whop event
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-whop-signature");

  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  // Only enforce signature if secret is set and non-empty
  if (webhookSecret && webhookSecret.trim() !== "") {
    if (!verifyWhopSignature(body, signature, webhookSecret)) {
      console.warn("Whop webhook: invalid signature. sig=", signature?.slice(0, 20));
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Log the full event for debugging
  console.log("Whop webhook received:", JSON.stringify(event, null, 2).slice(0, 1000));

  const supabase = await createClient();

  try {
    const eventType: string = event.type || event.action || "";
    const eventData = event.data || event;

    switch (eventType) {
      case "payment_succeeded":
      case "payment_success":
      case "payment_created":
      case "membership_activated":
      case "subscription_created": {
        // Whop sends user email in several places depending on event type
        const email =
          eventData.email ||
          eventData.customer_email ||
          eventData.user?.email ||
          eventData.buyer?.email ||
          eventData.membership?.user?.email;

        const customerId =
          eventData.customer_id ||
          eventData.user_id ||
          eventData.user?.id ||
          eventData.membership?.user_id;

        const productId =
          eventData.product_id ||
          eventData.plan_id ||
          eventData.pass_id ||
          eventData.membership?.product_id;

        console.log(`Whop event [${eventType}]: email=${email}, productId=${productId}`);

        if (!email) {
          console.error("Whop webhook: no email in payload", JSON.stringify(eventData).slice(0, 500));
          return NextResponse.json({ error: "Missing customer email in event payload" }, { status: 400 });
        }

        let productIds: Record<string, string> = {};
        try {
          productIds = JSON.parse(process.env.WHOP_PRODUCT_IDS || "{}");
        } catch {
          console.warn("Invalid WHOP_PRODUCT_IDS in env");
        }

        const planName = resolvePlan(productId, productIds);

        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (userError || !user) {
          console.error(`Whop webhook: user not found for email=${email}`);
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

        console.log(`✅ Upgraded user ${email} to ${planName}`);
        break;
      }

      case "membership_deactivated":
      case "subscription_cancelled":
      case "payment_failed": {
        const email =
          eventData.email ||
          eventData.customer_email ||
          eventData.user?.email ||
          eventData.membership?.user?.email;

        const customerId = eventData.customer_id || eventData.user_id || eventData.user?.id;

        if (email) {
          await supabase
            .from("users")
            .update({ plan: "free", stripe_customer_id: null, stripe_subscription_id: null })
            .eq("email", email);
          console.log(`Downgraded ${email} to free`);
        } else if (typeof customerId === "string") {
          await supabase
            .from("users")
            .update({ plan: "free", stripe_customer_id: null, stripe_subscription_id: null })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      default:
        console.log(`Whop webhook: unhandled event type "${eventType}"`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
